-- Migration 08: Product Expiry Dates, Storage Conditions & Expiration Alerts
-- Adds manufacture_date, expiry_date, storage_conditions to products table

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS manufacture_date DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS expiry_date DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS storage_conditions TEXT DEFAULT NULL;

-- Index for speedy queries on expiry date
CREATE INDEX IF NOT EXISTS idx_products_expiry_date ON public.products(expiry_date);

-- Update get_daily_report_data RPC to also aggregate expiring products (<= 90 days or expired)
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
