-- ==============================================================================
-- 14_app_data_sync.sql  («Склад» loyihasi -> SQL Editor -> Run)
-- Mahsulotlar va qoldiqlarni barcha qurilmalarda bir xil ko'rsatish uchun jadvallar.
-- Ilova mahsulot va omborlarni matnli ID bilan saqlaydi ('prd-...', 'wh-main'),
-- shuning uchun ular UUID'li products/stock jadvallariga emas, alohida jadvallarga yoziladi.
-- Faqat yangi jadvallar qo'shiladi; mavjud jadval va ma'lumotlarga tegilmaydi.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.app_products (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS public.app_stock (
    product_id TEXT NOT NULL,
    warehouse_id TEXT NOT NULL,
    id TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID DEFAULT auth.uid(),
    PRIMARY KEY (product_id, warehouse_id)
);

ALTER TABLE public.app_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_stock ENABLE ROW LEVEL SECURITY;

-- Read: any signed-in user with a role. Write: every staff role. Delete: admin / manager.
DROP POLICY IF EXISTS "Staff can view app products" ON public.app_products;
CREATE POLICY "Staff can view app products" ON public.app_products FOR SELECT TO authenticated
    USING (public.get_user_role() IS NOT NULL);
DROP POLICY IF EXISTS "Staff can insert app products" ON public.app_products;
CREATE POLICY "Staff can insert app products" ON public.app_products FOR INSERT TO authenticated
    WITH CHECK (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));
DROP POLICY IF EXISTS "Staff can update app products" ON public.app_products;
CREATE POLICY "Staff can update app products" ON public.app_products FOR UPDATE TO authenticated
    USING (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'))
    WITH CHECK (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));
DROP POLICY IF EXISTS "Managers can delete app products" ON public.app_products;
CREATE POLICY "Managers can delete app products" ON public.app_products FOR DELETE TO authenticated
    USING (public.is_manager_or_admin());

DROP POLICY IF EXISTS "Staff can view app stock" ON public.app_stock;
CREATE POLICY "Staff can view app stock" ON public.app_stock FOR SELECT TO authenticated
    USING (public.get_user_role() IS NOT NULL);
DROP POLICY IF EXISTS "Staff can insert app stock" ON public.app_stock;
CREATE POLICY "Staff can insert app stock" ON public.app_stock FOR INSERT TO authenticated
    WITH CHECK (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));
DROP POLICY IF EXISTS "Staff can update app stock" ON public.app_stock;
CREATE POLICY "Staff can update app stock" ON public.app_stock FOR UPDATE TO authenticated
    USING (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'))
    WITH CHECK (public.get_user_role() IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));
DROP POLICY IF EXISTS "Managers can delete app stock" ON public.app_stock;
CREATE POLICY "Managers can delete app stock" ON public.app_stock FOR DELETE TO authenticated
    USING (public.is_manager_or_admin());
