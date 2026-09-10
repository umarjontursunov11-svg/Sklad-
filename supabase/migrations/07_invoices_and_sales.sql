-- ==============================================================================
-- 07_invoices_and_sales.sql: Invoices, Invoice Items & Sales Waybill Generation
-- ==============================================================================

-- 1. Create invoices sequence for auto-incrementing numbers
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

-- 2. Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
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

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_name ON public.invoices (customer_name);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices (status);
CREATE INDEX IF NOT EXISTS idx_invoices_warehouse_id ON public.invoices (warehouse_id);

-- 3. Create invoice_items table
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

-- Trigger for invoices updated_at
DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Helper function to generate human-readable invoice numbers: INV-YYYY-000001
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

-- Set default invoice_number via generator
ALTER TABLE public.invoices
    ALTER COLUMN invoice_number SET DEFAULT public.generate_invoice_number();

-- 5. Row Level Security for invoices and items
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Staff and Admins can view invoices
DROP POLICY IF EXISTS "Staff and Admins can view invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can view invoices"
    ON public.invoices
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

-- Staff and Admins can insert invoices
DROP POLICY IF EXISTS "Staff and Admins can insert invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can insert invoices"
    ON public.invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

-- Staff and Admins can update invoices (e.g. status to cancelled)
DROP POLICY IF EXISTS "Staff and Admins can update invoices" ON public.invoices;
CREATE POLICY "Staff and Admins can update invoices"
    ON public.invoices
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

-- Invoice items policies
DROP POLICY IF EXISTS "Staff and Admins can view invoice items" ON public.invoice_items;
CREATE POLICY "Staff and Admins can view invoice items"
    ON public.invoice_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

DROP POLICY IF EXISTS "Staff and Admins can insert invoice items" ON public.invoice_items;
CREATE POLICY "Staff and Admins can insert invoice items"
    ON public.invoice_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on invoices" ON public.invoices;
CREATE POLICY "Service role full access on invoices" ON public.invoices FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on invoice items" ON public.invoice_items;
CREATE POLICY "Service role full access on invoice items" ON public.invoice_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Updated get_daily_report_data function including Sales Invoices aggregation
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
    v_sales_invoices_count INT := 0;
    v_sales_total_amount NUMERIC(15, 2) := 0;
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
