-- ==============================================================================
-- 13_stock_movement_guard.sql  («Склад» loyihasi -> SQL Editor -> Run)
-- execute_stock_movement RLS'ni chetlab o'tadi (SECURITY DEFINER). Endi:
--   * faqat tizimga kirgan foydalanuvchi chaqira oladi;
--   * amal doim chaqirgan foydalanuvchi nomidan yoziladi (p_user_id soxtalashtirib bo'lmaydi);
--   * oddiy xodim faqat o'ziga biriktirilgan ombordan amal bajaradi
--     (admin va ombor boshlig'i - barcha omborlarda).
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.execute_stock_movement(
    p_product_id UUID,
    p_warehouse_id UUID,
    p_movement_type TEXT,
    p_quantity NUMERIC,
    p_user_id UUID DEFAULT NULL,
    p_target_warehouse_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_source_stock_id UUID;
    v_current_source_qty NUMERIC := 0;
    v_target_stock_id UUID;
    v_new_movement_id UUID;
    v_product_name TEXT;
    v_warehouse_name TEXT;
    v_target_warehouse_name TEXT;
BEGIN
    -- ---- Access control -------------------------------------------------------
    IF auth.role() IS DISTINCT FROM 'service_role' THEN
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Authentication required';
        END IF;
        p_user_id := auth.uid();
        IF NOT public.is_manager_or_admin()
           AND p_warehouse_id IS DISTINCT FROM public.get_user_warehouse() THEN
            RAISE EXCEPTION 'You can only record movements for your assigned warehouse';
        END IF;
    END IF;

    -- ---- Validation -------------------------------------------------------------
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

    SELECT id, quantity INTO v_source_stock_id, v_current_source_qty
    FROM public.stock
    WHERE product_id = p_product_id AND warehouse_id = p_warehouse_id
    FOR UPDATE;

    IF p_movement_type = 'inbound' THEN
        IF v_source_stock_id IS NOT NULL THEN
            UPDATE public.stock SET quantity = quantity + p_quantity, updated_at = timezone('utc'::text, now()) WHERE id = v_source_stock_id;
        ELSE
            INSERT INTO public.stock (product_id, warehouse_id, quantity) VALUES (p_product_id, p_warehouse_id, p_quantity) RETURNING id INTO v_source_stock_id;
        END IF;
    ELSIF p_movement_type = 'outbound' THEN
        IF v_source_stock_id IS NULL OR v_current_source_qty < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock in warehouse "%". Current: %, Requested: %',
                v_warehouse_name, COALESCE(v_current_source_qty, 0), p_quantity;
        END IF;
        UPDATE public.stock SET quantity = quantity - p_quantity, updated_at = timezone('utc'::text, now()) WHERE id = v_source_stock_id;
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
        UPDATE public.stock SET quantity = quantity - p_quantity, updated_at = timezone('utc'::text, now()) WHERE id = v_source_stock_id;
        SELECT id INTO v_target_stock_id FROM public.stock WHERE product_id = p_product_id AND warehouse_id = p_target_warehouse_id FOR UPDATE;
        IF v_target_stock_id IS NOT NULL THEN
            UPDATE public.stock SET quantity = quantity + p_quantity, updated_at = timezone('utc'::text, now()) WHERE id = v_target_stock_id;
        ELSE
            INSERT INTO public.stock (product_id, warehouse_id, quantity) VALUES (p_product_id, p_target_warehouse_id, p_quantity);
        END IF;
    END IF;

    INSERT INTO public.stock_movements (product_id, warehouse_id, target_warehouse_id, movement_type, quantity, user_id, notes)
    VALUES (p_product_id, p_warehouse_id, p_target_warehouse_id, p_movement_type, p_quantity, p_user_id, p_notes)
    RETURNING id INTO v_new_movement_id;

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
$$;

REVOKE EXECUTE ON FUNCTION public.execute_stock_movement(UUID, UUID, TEXT, NUMERIC, UUID, UUID, TEXT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.execute_stock_movement(UUID, UUID, TEXT, NUMERIC, UUID, UUID, TEXT) TO authenticated;
