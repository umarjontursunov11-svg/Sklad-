-- ==============================================================================
-- 12_role_policy_fix.sql  («Склад» loyihasi -> SQL Editor -> Run)
-- Rol nomlarini tuzatadi ('manager' -> 'warehouse_manager', receiver/dispatcher qo'shildi)
-- va xodim faqat o'z omborining qoldig'ini ko'radigan qiladi.
-- ==============================================================================
DROP POLICY IF EXISTS "Stock read policy" ON public.stock;
DROP POLICY IF EXISTS "Staff can view assigned warehouse stock, managers view all" ON public.stock;
CREATE POLICY "Staff can view assigned warehouse stock, managers view all"
    ON public.stock FOR SELECT TO authenticated
    USING (public.is_manager_or_admin() OR warehouse_id = public.get_user_warehouse());

DROP POLICY IF EXISTS "Staff and Admins can view report logs" ON public.report_logs;
CREATE POLICY "Staff and Admins can view report logs" ON public.report_logs FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.users u JOIN public.roles r ON u.role_id = r.id WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher')));

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
