-- ==============================================================================
-- 06_telegram_and_reporting.sql: Telegram Bot Reporting, Report Logs & pg_cron
-- ==============================================================================

-- 1. Create report_logs table to audit all automated and manual report dispatches
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

-- Index for analytics and logs viewing
CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON public.report_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_logs_status ON public.report_logs (status);

-- 2. Row Level Security for report_logs
ALTER TABLE public.report_logs ENABLE ROW LEVEL SECURITY;

-- Admins and staff can view logs
DROP POLICY IF EXISTS "Staff and Admins can view report logs" ON public.report_logs;
CREATE POLICY "Staff and Admins can view report logs"
    ON public.report_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'manager', 'warehouse_staff')
        )
    );

-- Edge function / service role can insert and update logs
DROP POLICY IF EXISTS "Service role can manage report logs" ON public.report_logs;
CREATE POLICY "Service role can manage report logs"
    ON public.report_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Stored procedure to aggregate daily warehouse activity for the report
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
    -- Define start and end of the specified day (in UTC)
    v_start_timestamp := p_date::timestamptz;
    v_end_timestamp := (p_date + INTERVAL '1 day')::timestamptz;

    -- A. Inbound transactions breakdown
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

    -- B. Outbound transactions breakdown
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

    -- C. Low-stock products list (total quantity < min_stock_level)
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

    -- D. Top 3 most-moved products of the day by total transaction volume
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

    -- E. New products added today
    SELECT COUNT(*)
    INTO v_new_products_count
    FROM public.products
    WHERE created_at >= v_start_timestamp
      AND created_at < v_end_timestamp;

    -- Build consolidated response
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
        'generated_at', timezone('utc'::text, now())
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Supabase pg_cron Setup for Daily 20:00 Scheduled Report
-- Note: Enable pg_cron and pg_net extensions in Supabase Dashboard -> Database -> Extensions.
-- Run the following block to schedule automated daily 20:00 trigger:

/*
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily report at 20:00 (server time / 15:00 UTC for UTC+5):
SELECT cron.schedule(
    'send-daily-warehouse-report-2000',
    '0 20 * * *',
    $$
    SELECT net.http_post(
        url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL') || '/functions/v1/send-daily-report',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY')
        ),
        body := jsonb_build_object('triggered_by', 'pg_cron_2000')::text
    );
    $$
);
*/
