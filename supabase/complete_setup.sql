-- ==============================================================================
-- WAREHOUSE MANAGEMENT SYSTEM (WMS) - COMPLETE SUPABASE SETUP SCRIPT
-- Run this entire script in Supabase SQL Editor (https://app.supabase.com) -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- ==============================================================================
-- PART 1: EXTENSIONS & SCHEMA
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Warehouses table
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Users profile table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    full_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    employee_id TEXT,
    must_change_password BOOLEAN NOT NULL DEFAULT false,
    role_id UUID REFERENCES public.roles(id) ON DELETE RESTRICT,
    assigned_warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL CHECK (unit IN ('piece', 'kg', 'liter', 'box', 'meter', 'pallet', 'ampoule', 'set')),
    min_stock_level NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (min_stock_level >= 0),
    image_url TEXT,
    qr_code_data TEXT UNIQUE NOT NULL,
    qr_code_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Stock balances table (one record per product per warehouse)
CREATE TABLE IF NOT EXISTS public.stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    quantity NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_product_warehouse UNIQUE (product_id, warehouse_id)
);

-- 6. Stock movements table (ledger)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    target_warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('inbound', 'outbound', 'transfer')),
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    CONSTRAINT chk_transfer_target CHECK (
        (movement_type = 'transfer' AND target_warehouse_id IS NOT NULL AND target_warehouse_id <> warehouse_id) OR
        (movement_type <> 'transfer')
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_qr_code_data ON public.products(qr_code_data);
CREATE INDEX IF NOT EXISTS idx_stock_product_id ON public.stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse_id ON public.stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse_id ON public.stock_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_timestamp ON public.stock_movements(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_assigned_warehouse ON public.users(assigned_warehouse_id);

-- ==============================================================================
-- PART 2: TRIGGERS & PROCEDURES
-- ==============================================================================

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_warehouses_updated_at ON public.warehouses;
CREATE TRIGGER trg_warehouses_updated_at
    BEFORE UPDATE ON public.warehouses
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_stock_updated_at ON public.stock;
CREATE TRIGGER trg_stock_updated_at
    BEFORE UPDATE ON public.stock
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
    first_warehouse_id UUID;
BEGIN
    IF (SELECT count(*) FROM public.users) = 0 THEN
        SELECT id INTO default_role_id FROM public.roles WHERE name = 'admin' LIMIT 1;
    ELSE
        SELECT id INTO default_role_id FROM public.roles WHERE name = 'warehouse_staff' LIMIT 1;
    END IF;

    SELECT id INTO first_warehouse_id FROM public.warehouses WHERE is_active = true ORDER BY created_at ASC LIMIT 1;

    INSERT INTO public.users (id, name, email, role_id, assigned_warehouse_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        default_role_id,
        first_warehouse_id
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, public.users.name);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic stock movement procedure
CREATE OR REPLACE FUNCTION public.execute_stock_movement(
    p_product_id UUID,
    p_warehouse_id UUID,
    p_movement_type TEXT,
    p_quantity NUMERIC,
    p_user_id UUID DEFAULT NULL,
    p_target_warehouse_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_source_stock_id UUID;
    v_current_source_qty NUMERIC := 0;
    v_target_stock_id UUID;
    v_new_movement_id UUID;
    v_product_name TEXT;
    v_warehouse_name TEXT;
    v_target_warehouse_name TEXT;
BEGIN
    IF p_movement_type NOT IN ('inbound', 'outbound', 'transfer') THEN
        RAISE EXCEPTION 'Invalid movement type: %. Must be inbound, outbound, or transfer.', p_movement_type;
    END IF;

    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Movement quantity must be greater than zero. Received: %', p_quantity;
    END IF;

    SELECT name INTO v_product_name FROM public.products WHERE id = p_product_id;
    IF v_product_name IS NULL THEN
        RAISE EXCEPTION 'Product with ID % not found.', p_product_id;
    END IF;

    SELECT name INTO v_warehouse_name FROM public.warehouses WHERE id = p_warehouse_id;
    IF v_warehouse_name IS NULL THEN
        RAISE EXCEPTION 'Warehouse with ID % not found.', p_warehouse_id;
    END IF;

    IF p_user_id IS NULL THEN
        p_user_id := auth.uid();
    END IF;

    -- Lock and fetch current source balance
    SELECT id, quantity INTO v_source_stock_id, v_current_source_qty
    FROM public.stock
    WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id
    FOR UPDATE;

    -- INBOUND
    IF p_movement_type = 'inbound' THEN
        IF v_source_stock_id IS NOT NULL THEN
            UPDATE public.stock
            SET quantity = quantity + p_quantity,
                updated_at = timezone('utc'::text, now())
            WHERE id = v_source_stock_id;
        ELSE
            INSERT INTO public.stock (product_id, warehouse_id, quantity)
            VALUES (p_product_id, p_warehouse_id, p_quantity)
            RETURNING id INTO v_source_stock_id;
        END IF;

    -- OUTBOUND
    ELSIF p_movement_type = 'outbound' THEN
        IF v_source_stock_id IS NULL OR v_current_source_qty < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock in warehouse "%". Current: %, Requested: %',
                v_warehouse_name, COALESCE(v_current_source_qty, 0), p_quantity;
        END IF;

        UPDATE public.stock
        SET quantity = quantity - p_quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_source_stock_id;

    -- TRANSFER
    ELSIF p_movement_type = 'transfer' THEN
        IF p_target_warehouse_id IS NULL THEN
            RAISE EXCEPTION 'Target warehouse must be specified for transfer.';
        END IF;

        IF p_target_warehouse_id = p_warehouse_id THEN
            RAISE EXCEPTION 'Source and target warehouses cannot be the same.';
        END IF;

        SELECT name INTO v_target_warehouse_name FROM public.warehouses WHERE id = p_target_warehouse_id;
        IF v_target_warehouse_name IS NULL THEN
            RAISE EXCEPTION 'Target warehouse with ID % not found.', p_target_warehouse_id;
        END IF;

        IF v_source_stock_id IS NULL OR v_current_source_qty < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock in source warehouse "%". Current: %, Requested: %',
                v_warehouse_name, COALESCE(v_current_source_qty, 0), p_quantity;
        END IF;

        UPDATE public.stock
        SET quantity = quantity - p_quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_source_stock_id;

        SELECT id INTO v_target_stock_id
        FROM public.stock
        WHERE product_id = p_product_id AND warehouse_id = p_target_warehouse_id
        FOR UPDATE;

        IF v_target_stock_id IS NOT NULL THEN
            UPDATE public.stock
            SET quantity = quantity + p_quantity,
                updated_at = timezone('utc'::text, now())
            WHERE id = v_target_stock_id;
        ELSE
            INSERT INTO public.stock (product_id, warehouse_id, quantity)
            VALUES (p_product_id, p_target_warehouse_id, p_quantity);
        END IF;
    END IF;

    -- Log transaction
    INSERT INTO public.stock_movements (
        product_id,
        warehouse_id,
        target_warehouse_id,
        movement_type,
        quantity,
        user_id,
        notes
    ) VALUES (
        p_product_id,
        p_warehouse_id,
        p_target_warehouse_id,
        p_movement_type,
        p_quantity,
        p_user_id,
        p_notes
    ) RETURNING id INTO v_new_movement_id;

    RETURN jsonb_build_object(
        'success', true,
        'movement_id', v_new_movement_id,
        'product_id', p_product_id,
        'warehouse_id', p_warehouse_id,
        'target_warehouse_id', p_target_warehouse_id,
        'movement_type', p_movement_type,
        'quantity', p_quantity,
        'timestamp', timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- PART 3: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
    SELECT r.name
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = p_user_id AND r.name = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = p_user_id AND r.name IN ('admin', 'warehouse_manager')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_warehouse(p_user_id UUID DEFAULT auth.uid())
RETURNS UUID AS $$
    SELECT assigned_warehouse_id
    FROM public.users
    WHERE id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Roles Policies
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.roles;
CREATE POLICY "Authenticated users can read roles"
    ON public.roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Only admins can insert/update/delete roles" ON public.roles;
CREATE POLICY "Only admins can insert/update/delete roles"
    ON public.roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Warehouses Policies
DROP POLICY IF EXISTS "Authenticated users can read warehouses" ON public.warehouses;
CREATE POLICY "Authenticated users can read warehouses"
    ON public.warehouses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins and managers can manage warehouses" ON public.warehouses;
CREATE POLICY "Admins and managers can manage warehouses"
    ON public.warehouses FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Users Policies
DROP POLICY IF EXISTS "Users can read profiles" ON public.users;
CREATE POLICY "Users can read profiles"
    ON public.users FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_manager_or_admin());

DROP POLICY IF EXISTS "Users can update own name" ON public.users;
CREATE POLICY "Users can update own name"
    ON public.users FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert and delete users" ON public.users;
CREATE POLICY "Admins can insert and delete users"
    ON public.users FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products Policies
DROP POLICY IF EXISTS "All authenticated users can view products" ON public.products;
CREATE POLICY "All authenticated users can view products"
    ON public.products FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins and managers can manage products" ON public.products;
CREATE POLICY "Admins and managers can manage products"
    ON public.products FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Stock Policies
DROP POLICY IF EXISTS "Stock read policy" ON public.stock;
DROP POLICY IF EXISTS "Staff can view assigned warehouse stock, managers view all" ON public.stock;
CREATE POLICY "Staff can view assigned warehouse stock, managers view all"
    ON public.stock FOR SELECT
    TO authenticated
    USING (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse()
    );

DROP POLICY IF EXISTS "Managers and admins can directly modify stock" ON public.stock;
CREATE POLICY "Managers and admins can directly modify stock"
    ON public.stock FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Stock Movements Policies
DROP POLICY IF EXISTS "Users can view relevant stock movements" ON public.stock_movements;
CREATE POLICY "Users can view relevant stock movements"
    ON public.stock_movements FOR SELECT TO authenticated
    USING (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse() OR
        target_warehouse_id = public.get_user_warehouse()
    );

DROP POLICY IF EXISTS "Users can record stock movements" ON public.stock_movements;
CREATE POLICY "Users can record stock movements"
    ON public.stock_movements FOR INSERT TO authenticated
    WITH CHECK (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse()
    );

-- Enable Realtime publication for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_movements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- ==============================================================================
-- PART 4: SEED DATA
-- ==============================================================================

-- 1. Seed Roles
INSERT INTO public.roles (id, name, description)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin', 'System Administrator with full access to all settings, users, and warehouses'),
    ('22222222-2222-2222-2222-222222222222', 'warehouse_manager', 'Warehouse Manager with read/write access across all warehouses and reports'),
    ('33333333-3333-3333-3333-333333333333', 'warehouse_staff', 'Warehouse Staff member with access limited to assigned warehouse')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

-- 2. Seed Warehouses
INSERT INTO public.warehouses (id, name, address, is_active)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Main Logistics Hub', '100 Industrial Parkway, Section A', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'North Distribution Center', '77 Northern Highway, Bay 12', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'South Transit Depot', '42 Harbor Logistics Blvd, Dock 3', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, is_active = EXCLUDED.is_active;

-- 3. Seed Products
INSERT INTO public.products (id, name, description, unit, min_stock_level, qr_code_data, image_url)
VALUES 
    (
        '90000000-0000-0000-0000-000000000001',
        'Industrial Ball Bearings (Set of 10)',
        'Chrome steel precision deep groove ball bearings for heavy machinery.',
        'box',
        25,
        'WMS-PRD-1001',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000002',
        'Synthetic Motor Oil 5W-30',
        'High-performance full synthetic engine lubricant for commercial fleet.',
        'liter',
        50,
        'WMS-PRD-1002',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000003',
        'Heavy-Duty Euro Pallet (Pine)',
        'Standard heat-treated EPAL wooden pallet, 1200x800mm.',
        'pallet',
        15,
        'WMS-PRD-1003',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000004',
        'Nitrile Protective Gloves (100 pcs)',
        'Powder-free textured heavy-duty black nitrile gloves.',
        'box',
        40,
        'WMS-PRD-1004',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000005',
        'Stainless Steel Hex Bolt M8x50',
        'Grade A2-70 rust-resistant stainless steel hex head screw.',
        'piece',
        300,
        'WMS-PRD-1005',
        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000006',
        'Hydraulic Fluid ISO VG 46',
        'Anti-wear premium hydraulic oil for fork lifts and presses.',
        'liter',
        80,
        'WMS-PRD-1006',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000007',
        'Safety Hard Hat ANSI Z89.1',
        'High-visibility ventilated hard hat with 4-point ratchet suspension.',
        'piece',
        20,
        'WMS-PRD-1007',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000008',
        'Industrial Stretch Wrap Film (500mm)',
        'Cast stretch film 23 micron, high puncture resistance.',
        'piece',
        35,
        'WMS-PRD-1008',
        'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=400&q=80'
    )
ON CONFLICT (qr_code_data) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, min_stock_level = EXCLUDED.min_stock_level;

-- 4. Seed Initial Stock Balances
INSERT INTO public.stock (product_id, warehouse_id, quantity)
VALUES
    -- Main Logistics Hub
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 120),
    ('90000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200),
    ('90000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50),
    ('90000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 85),
    ('90000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1500),
    ('90000000-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300),
    ('90000000-0000-0000-0000-000000000007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 60),
    ('90000000-0000-0000-0000-000000000008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 90),

    -- North Distribution Center (includes low stock items)
    ('90000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 12),
    ('90000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 45),
    ('90000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 22),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 60),
    ('90000000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 200),
    ('90000000-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 95),

    -- South Transit Depot
    ('90000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 30),
    ('90000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 80),
    ('90000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 18),
    ('90000000-0000-0000-0000-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 10)
ON CONFLICT (product_id, warehouse_id) DO UPDATE
SET quantity = EXCLUDED.quantity;

-- 5. Seed Sample Movements History
INSERT INTO public.stock_movements (product_id, warehouse_id, movement_type, quantity, timestamp, notes)
VALUES
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'inbound', 150, now() - INTERVAL '3 days', 'Initial vendor delivery via PO-9821'),
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'outbound', 30, now() - INTERVAL '2 days', 'Dispatched to Assembly Line A'),
    ('90000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'inbound', 200, now() - INTERVAL '5 days', 'Bulk delivery palletized'),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'inbound', 80, now() - INTERVAL '1 day', 'Restock shipment received'),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'outbound', 20, now() - INTERVAL '4 hours', 'Issued to packaging shift team');

-- ==============================================================================
-- 6. TELEGRAM BOT REPORTING, AUDIT LOGS & REPORT ENGINE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.report_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type TEXT NOT NULL CHECK (report_type IN ('daily_summary', 'low_stock_alert', 'manual_trigger')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'retrying', 'pending')),
    payload JSONB,
    telegram_message_id BIGINT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON public.report_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_logs_status ON public.report_logs (status);

ALTER TABLE public.report_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff and Admins can view report logs" ON public.report_logs;
CREATE POLICY "Staff and Admins can view report logs"
    ON public.report_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher')
        )
    );

DROP POLICY IF EXISTS "Service role can manage report logs" ON public.report_logs;
CREATE POLICY "Service role can manage report logs"
    ON public.report_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.get_daily_report_data(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
    v_start_timestamp TIMESTAMPTZ;
    v_end_timestamp TIMESTAMPTZ;
    v_inbound_total_count INT := 0;
    v_inbound_total_qty NUMERIC := 0;
    v_inbound_by_warehouse JSONB;
    v_outbound_total_count INT := 0;
    v_outbound_total_qty NUMERIC := 0;
    v_outbound_by_warehouse JSONB;
    v_low_stock_items JSONB;
    v_top_moved_products JSONB;
    v_new_products_count INT := 0;
    v_result JSONB;
BEGIN
    v_start_timestamp := p_date::timestamptz;
    v_end_timestamp := (p_date + INTERVAL '1 day')::timestamptz;

    -- Inbound breakdown
    SELECT 
        COALESCE(COUNT(*), 0),
        COALESCE(SUM(quantity), 0)
    INTO 
        v_inbound_total_count,
        v_inbound_total_qty
    FROM public.stock_movements
    WHERE movement_type = 'inbound'
      AND created_at >= v_start_timestamp
      AND created_at < v_end_timestamp;

    SELECT COALESCE(jsonb_agg(wh_row), '[]'::jsonb)
    INTO v_inbound_by_warehouse
    FROM (
        SELECT 
            w.name AS warehouse_name,
            COUNT(sm.id) AS tx_count,
            COALESCE(SUM(sm.quantity), 0) AS total_qty
        FROM public.stock_movements sm
        JOIN public.warehouses w ON sm.warehouse_id = w.id
        WHERE sm.movement_type = 'inbound'
          AND sm.created_at >= v_start_timestamp
          AND sm.created_at < v_end_timestamp
        GROUP BY w.name
        ORDER BY total_qty DESC
    ) wh_row;

    -- Outbound breakdown
    SELECT 
        COALESCE(COUNT(*), 0),
        COALESCE(SUM(quantity), 0)
    INTO 
        v_outbound_total_count,
        v_outbound_total_qty
    FROM public.stock_movements
    WHERE movement_type = 'outbound'
      AND created_at >= v_start_timestamp
      AND created_at < v_end_timestamp;

    SELECT COALESCE(jsonb_agg(wh_row), '[]'::jsonb)
    INTO v_outbound_by_warehouse
    FROM (
        SELECT 
            w.name AS warehouse_name,
            COUNT(sm.id) AS tx_count,
            COALESCE(SUM(sm.quantity), 0) AS total_qty
        FROM public.stock_movements sm
        JOIN public.warehouses w ON sm.warehouse_id = w.id
        WHERE sm.movement_type = 'outbound'
          AND sm.created_at >= v_start_timestamp
          AND sm.created_at < v_end_timestamp
        GROUP BY w.name
        ORDER BY total_qty DESC
    ) wh_row;

    -- Low-stock items list
    SELECT COALESCE(jsonb_agg(low_row), '[]'::jsonb)
    INTO v_low_stock_items
    FROM (
        SELECT 
            p.id,
            p.name,
            p.qr_code_data,
            p.unit,
            p.min_stock_level,
            COALESCE(SUM(s.quantity), 0) AS current_total_stock
        FROM public.products p
        LEFT JOIN public.stock s ON p.id = s.product_id
        GROUP BY p.id, p.name, p.qr_code_data, p.unit, p.min_stock_level
        HAVING COALESCE(SUM(s.quantity), 0) <= p.min_stock_level
        ORDER BY (COALESCE(SUM(s.quantity), 0) - p.min_stock_level) ASC
    ) low_row;

    -- Top 3 most-moved products
    SELECT COALESCE(jsonb_agg(top_row), '[]'::jsonb)
    INTO v_top_moved_products
    FROM (
        SELECT 
            p.name AS product_name,
            p.qr_code_data,
            p.unit,
            COALESCE(SUM(sm.quantity), 0) AS total_volume,
            COUNT(sm.id) AS tx_count
        FROM public.stock_movements sm
        JOIN public.products p ON sm.product_id = p.id
        WHERE sm.created_at >= v_start_timestamp
          AND sm.created_at < v_end_timestamp
        GROUP BY p.id, p.name, p.qr_code_data, p.unit
        ORDER BY total_volume DESC
        LIMIT 3
    ) top_row;

    -- New products count
    SELECT COUNT(*)
    INTO v_new_products_count
    FROM public.products
    WHERE created_at >= v_start_timestamp
      AND created_at < v_end_timestamp;

    -- Sales Invoices Totals for today
    SELECT 
        COALESCE(COUNT(*), 0),
        COALESCE(SUM(grand_total), 0)
    INTO 
        v_sales_invoices_count,
        v_sales_total_amount
    FROM public.invoices
    WHERE status != 'cancelled'
      AND created_at >= v_start_timestamp
      AND created_at < v_end_timestamp;

    v_result := jsonb_build_object(
        'report_date', p_date,
        'inbound', jsonb_build_object(
            'total_count', v_inbound_total_count,
            'total_quantity', v_inbound_total_qty,
            'by_warehouse', v_inbound_by_warehouse
        ),
        'outbound', jsonb_build_object(
            'total_count', v_outbound_total_count,
            'total_quantity', v_outbound_total_qty,
            'by_warehouse', v_outbound_by_warehouse
        ),
        'low_stock_items', v_low_stock_items,
        'top_moved_products', v_top_moved_products,
        'new_products_count', v_new_products_count,
        'sales', jsonb_build_object(
            'invoices_count', v_sales_invoices_count,
            'total_amount', v_sales_total_amount
        ),
        'generated_at', timezone('utc'::text, now())
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 7. INVOICES, INVOICE ITEMS & SALES WAYBILLS
-- ==============================================================================

CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_seq INT;
BEGIN
    v_year := to_char(CURRENT_DATE, 'YYYY');
    v_seq := nextval('public.invoice_number_seq');
    RETURN 'INV-' || v_year || '-' || lpad(v_seq::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL DEFAULT public.generate_invoice_number(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    customer_inn TEXT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (vat_rate >= 0),
    vat_amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (vat_amount >= 0),
    grand_total NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (grand_total >= 0),
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON public.invoices (customer_name);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status);
CREATE INDEX IF NOT EXISTS idx_invoices_warehouse_id ON public.invoices (warehouse_id);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    movement_id UUID REFERENCES public.stock_movements(id) ON DELETE SET NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    line_total NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items (invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_id ON public.invoice_items (product_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_movement_id ON public.invoice_items (movement_id);

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff and Admins can view invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can view invoices" ON public.invoices FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher')));

DROP POLICY IF EXISTS "Staff and Admins can insert invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can insert invoices" ON public.invoices FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher')));

DROP POLICY IF EXISTS "Staff and Admins can update invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can update invoices" ON public.invoices FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher')));

DROP POLICY IF EXISTS "Staff and Admins can view invoice items" ON public.invoice_items;
CREATE POLICY "Staff and Admins can view invoice items" ON public.invoice_items FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher')));

DROP POLICY IF EXISTS "Staff and Admins can insert invoice items" ON public.invoice_items;
CREATE POLICY "Staff and Admins can insert invoice items" ON public.invoice_items FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'dispatcher')));

DROP POLICY IF EXISTS "Service role full access on invoices" ON public.invoices;
CREATE POLICY "Service role full access on invoices" ON public.invoices FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on invoice items" ON public.invoice_items;
CREATE POLICY "Service role full access on invoice items" ON public.invoice_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. PRODUCT EXPIRY DATES, STORAGE CONDITIONS & EXPOSURE ALERTS
-- ==============================================================================

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS manufacture_date DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS expiry_date DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS storage_conditions TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON public.products(expiry_date);

CREATE OR REPLACE FUNCTION public.get_daily_report_data(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inbound_count INT := 0;
  v_inbound_qty NUMERIC := 0;
  v_inbound_wh JSONB := '{}'::jsonb;
  
  v_outbound_count INT := 0;
  v_outbound_qty NUMERIC := 0;
  v_outbound_wh JSONB := '{}'::jsonb;
  
  v_low_stock JSONB := '[]'::jsonb;
  v_top_moved JSONB := '[]'::jsonb;
  v_new_products INT := 0;
  
  v_sales_invoices INT := 0;
  v_sales_amount NUMERIC := 0;

  v_expiring_items JSONB := '[]'::jsonb;
BEGIN
  -- 1. Inbound Movements
  SELECT 
    COUNT(*), 
    COALESCE(SUM(quantity), 0)
  INTO v_inbound_count, v_inbound_qty
  FROM public.stock_movements
  WHERE movement_type = 'inbound'
    AND timestamp::date = p_date;

  SELECT COALESCE(jsonb_object_agg(wh_name, total_qty), '{}'::jsonb)
  INTO v_inbound_wh
  FROM (
    SELECT w.name AS wh_name, SUM(sm.quantity) AS total_qty
    FROM public.stock_movements sm
    JOIN public.warehouses w ON w.id = sm.warehouse_id
    WHERE sm.movement_type = 'inbound'
      AND sm.timestamp::date = p_date
    GROUP BY w.name
  ) in_wh;

  -- 2. Outbound Movements
  SELECT 
    COUNT(*), 
    COALESCE(SUM(quantity), 0)
  INTO v_outbound_count, v_outbound_qty
  FROM public.stock_movements
  WHERE movement_type = 'outbound'
    AND timestamp::date = p_date;

  SELECT COALESCE(jsonb_object_agg(wh_name, total_qty), '{}'::jsonb)
  INTO v_outbound_wh
  FROM (
    SELECT w.name AS wh_name, SUM(sm.quantity) AS total_qty
    FROM public.stock_movements sm
    JOIN public.warehouses w ON w.id = sm.warehouse_id
    WHERE sm.movement_type = 'outbound'
      AND sm.timestamp::date = p_date
    GROUP BY w.name
  ) out_wh;

  -- 3. Sales & Invoices Summary for the day
  SELECT 
    COUNT(*),
    COALESCE(SUM(total_amount), 0)
  INTO v_sales_invoices, v_sales_amount
  FROM public.invoices
  WHERE created_at::date = p_date
    AND status = 'issued';

  -- 4. Low stock products
  SELECT COALESCE(jsonb_agg(sub), '[]'::jsonb)
  INTO v_low_stock
  FROM (
    SELECT 
      p.id,
      p.name,
      p.qr_code_data,
      p.unit,
      p.min_stock_level,
      COALESCE(SUM(s.quantity), 0) AS current_total_stock
    FROM public.products p
    LEFT JOIN public.stock s ON s.product_id = p.id
    GROUP BY p.id, p.name, p.qr_code_data, p.unit, p.min_stock_level
    HAVING COALESCE(SUM(s.quantity), 0) <= p.min_stock_level
    ORDER BY (COALESCE(SUM(s.quantity), 0) - p.min_stock_level) ASC
    LIMIT 10
  ) sub;

  -- 5. Expiring products (<= 90 days left or expired)
  SELECT COALESCE(jsonb_agg(sub_exp), '[]'::jsonb)
  INTO v_expiring_items
  FROM (
    SELECT 
      p.id,
      p.name,
      p.qr_code_data,
      p.unit,
      p.expiry_date,
      p.storage_conditions,
      (p.expiry_date - p_date) AS days_left,
      COALESCE(SUM(s.quantity), 0) AS current_total_stock
    FROM public.products p
    LEFT JOIN public.stock s ON s.product_id = p.id
    WHERE p.expiry_date IS NOT NULL
      AND p.expiry_date <= (p_date + INTERVAL '90 days')
    GROUP BY p.id, p.name, p.qr_code_data, p.unit, p.expiry_date, p.storage_conditions
    ORDER BY p.expiry_date ASC
    LIMIT 10
  ) sub_exp;

  -- 6. Top 3 moved products
  SELECT COALESCE(jsonb_agg(sub_top), '[]'::jsonb)
  INTO v_top_moved
  FROM (
    SELECT 
      p.name AS product_name,
      p.qr_code_data,
      p.unit,
      SUM(sm.quantity) AS total_volume,
      COUNT(sm.id) AS tx_count
    FROM public.stock_movements sm
    JOIN public.products p ON p.id = sm.product_id
    WHERE sm.timestamp::date = p_date
    GROUP BY p.id, p.name, p.qr_code_data, p.unit
    ORDER BY total_volume DESC
    LIMIT 3
  ) sub_top;

  -- 7. New products registered today
  SELECT COUNT(*)
  INTO v_new_products
  FROM public.products
  WHERE created_at::date = p_date;

  RETURN jsonb_build_object(
    'report_date', p_date,
    'generated_at', NOW(),
    'inbound', jsonb_build_object(
      'total_count', v_inbound_count,
      'total_quantity', v_inbound_qty,
      'by_warehouse', v_inbound_wh
    ),
    'outbound', jsonb_build_object(
      'total_count', v_outbound_count,
      'total_quantity', v_outbound_qty,
      'by_warehouse', v_outbound_wh
    ),
    'sales', jsonb_build_object(
      'total_invoices', v_sales_invoices,
      'total_sales_amount', v_sales_amount
    ),
    'low_stock_items', v_low_stock,
    'expiring_items', v_expiring_items,
    'top_moved_products', v_top_moved,
    'new_products_count', v_new_products
  );
END;
$$;

-- ==============================================================================
-- 9. INDIVIDUAL STAFF ACCOUNTS, GRANULAR ROLES, CORRECTIONS & AUDIT LOGS
-- ==============================================================================

ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS roles_name_check;
ALTER TABLE public.roles ADD CONSTRAINT roles_name_check CHECK (name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));

INSERT INTO public.roles (name, description)
VALUES 
    ('receiver', 'Ombor Qabul Qiluvchisi (Faqat kirim amallari)'),
    ('dispatcher', 'Ombor Jo''natuvchisi (Faqat chiqim va sotuv yuk xatlari)')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS employee_id TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

UPDATE public.users SET full_name = name WHERE full_name IS NULL OR full_name = '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON public.users(employee_id) WHERE employee_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone) WHERE phone IS NOT NULL;

ALTER TABLE public.stock_movements
ADD COLUMN IF NOT EXISTS employee_id TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'web' CHECK (device_type IN ('web', 'mobile', 'scanner'));

CREATE INDEX IF NOT EXISTS idx_stock_movements_employee_id ON public.stock_movements(employee_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_timestamp_sec ON public.stock_movements(timestamp DESC);

ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS creator_name TEXT,
ADD COLUMN IF NOT EXISTS creator_employee_id TEXT;

CREATE TABLE IF NOT EXISTS public.correction_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_movement_id UUID NOT NULL REFERENCES public.stock_movements(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    requested_change JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_correction_requests_status ON public.correction_requests(status);
CREATE INDEX IF NOT EXISTS idx_correction_requests_requested_by ON public.correction_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_correction_requests_created_at ON public.correction_requests(created_at DESC);

CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    employee_id TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'admin_access_success', 'admin_access_failed')),
    device_type TEXT NOT NULL DEFAULT 'web' CHECK (device_type IN ('web', 'mobile', 'scanner')),
    ip_address TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_event_type ON public.login_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);

ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view own correction requests" ON public.correction_requests;
CREATE POLICY "Staff can view own correction requests"
    ON public.correction_requests FOR SELECT TO authenticated
    USING (requested_by = auth.uid());

DROP POLICY IF EXISTS "Staff can insert correction requests" ON public.correction_requests;
CREATE POLICY "Staff can insert correction requests"
    ON public.correction_requests FOR INSERT TO authenticated
    WITH CHECK (requested_by = auth.uid());

DROP POLICY IF EXISTS "Managers and Admins can view all correction requests" ON public.correction_requests;
CREATE POLICY "Managers and Admins can view all correction requests"
    ON public.correction_requests FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager')));

DROP POLICY IF EXISTS "Managers and Admins can update correction requests" ON public.correction_requests;
CREATE POLICY "Managers and Admins can update correction requests"
    ON public.correction_requests FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager')));

DROP POLICY IF EXISTS "Admins can view all login logs" ON public.login_logs;
CREATE POLICY "Admins can view all login logs"
    ON public.login_logs FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name = 'admin'));

DROP POLICY IF EXISTS "Users can insert login logs" ON public.login_logs;
CREATE POLICY "Users can insert login logs"
    ON public.login_logs FOR INSERT TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on correction_requests" ON public.correction_requests;
CREATE POLICY "Service role full access on correction_requests" ON public.correction_requests FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on login_logs" ON public.login_logs;
CREATE POLICY "Service role full access on login_logs" ON public.login_logs FOR ALL TO service_role USING (true) WITH CHECK (true);



