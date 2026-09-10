-- ==============================================================================
-- 01_schema.sql: Core Warehouse Management System Tables
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'warehouse_manager', 'warehouse_staff')),
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
    email TEXT NOT NULL,
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

-- 6. Stock movements (immutable ledger of all inventory transactions)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_qr_code_data ON public.products(qr_code_data);
CREATE INDEX IF NOT EXISTS idx_stock_product_id ON public.stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_warehouse_id ON public.stock(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse_id ON public.stock_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_timestamp ON public.stock_movements(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_assigned_warehouse ON public.users(assigned_warehouse_id);
