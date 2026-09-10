-- ==============================================================================
-- 02_functions_and_triggers.sql: Functions, Stored Procedures & Triggers
-- ==============================================================================

-- 1. Helper function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
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

-- 2. Automatically create public.users record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
    first_warehouse_id UUID;
BEGIN
    -- Determine default role: 'warehouse_staff' by default, or 'admin' if first user
    IF (SELECT count(*) FROM public.users) = 0 THEN
        SELECT id INTO default_role_id FROM public.roles WHERE name = 'admin' LIMIT 1;
    ELSE
        SELECT id INTO default_role_id FROM public.roles WHERE name = 'warehouse_staff' LIMIT 1;
    END IF;

    -- Pick first available warehouse as default assignment if exists
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

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Atomic stock movement execution stored procedure
-- Handles:
--   'inbound': increments stock at warehouse_id
--   'outbound': decrements stock at warehouse_id (validates sufficient quantity)
--   'transfer': decrements stock at source warehouse_id and increments at target_warehouse_id
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
    -- Validation: Movement type
    IF p_movement_type NOT IN ('inbound', 'outbound', 'transfer') THEN
        RAISE EXCEPTION 'Invalid movement type: %. Must be inbound, outbound, or transfer.', p_movement_type;
    END IF;

    -- Validation: Positive quantity
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Movement quantity must be greater than zero. Received: %', p_quantity;
    END IF;

    -- Verify product exists
    SELECT name INTO v_product_name FROM public.products WHERE id = p_product_id;
    IF v_product_name IS NULL THEN
        RAISE EXCEPTION 'Product with ID % not found.', p_product_id;
    END IF;

    -- Verify source warehouse exists
    SELECT name INTO v_warehouse_name FROM public.warehouses WHERE id = p_warehouse_id;
    IF v_warehouse_name IS NULL THEN
        RAISE EXCEPTION 'Warehouse with ID % not found.', p_warehouse_id;
    END IF;

    -- If user_id is not provided, try to resolve from auth.uid()
    IF p_user_id IS NULL THEN
        p_user_id := auth.uid();
    END IF;

    -- Lock and get current source stock balance
    SELECT id, quantity INTO v_source_stock_id, v_current_source_qty
    FROM public.stock
    WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id
    FOR UPDATE;

    -- Handle INBOUND
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

    -- Handle OUTBOUND
    ELSIF p_movement_type = 'outbound' THEN
        IF v_source_stock_id IS NULL OR v_current_source_qty < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock in warehouse "%". Current stock: %, Requested: %',
                v_warehouse_name, COALESCE(v_current_source_qty, 0), p_quantity;
        END IF;

        UPDATE public.stock
        SET quantity = quantity - p_quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_source_stock_id;

    -- Handle TRANSFER
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

        -- Check source availability
        IF v_source_stock_id IS NULL OR v_current_source_qty < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock in source warehouse "%". Current: %, Requested: %',
                v_warehouse_name, COALESCE(v_current_source_qty, 0), p_quantity;
        END IF;

        -- Deduct from source
        UPDATE public.stock
        SET quantity = quantity - p_quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_source_stock_id;

        -- Lock and increment target
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

    -- Record in stock_movements ledger
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
