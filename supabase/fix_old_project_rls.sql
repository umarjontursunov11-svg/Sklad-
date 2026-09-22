-- ==============================================================================
-- fix_old_project_rls.sql — ESKI loyiha (fwuqtrfoenejodufnwyb, online-market bilan umumiy)
-- Ombor jadvallari RLS'siz ochiq turibdi: anon kalit bilan har kim o'qiy/o'chira oladi.
-- Bu jadvallarni hech bir ilova ishlatmaydi (oxirgi 24 soatda REST so'rovi yo'q),
-- shuning uchun RLS yoqish hech narsani buzmaydi. Faqat service_role kirishi qoladi.
-- ==============================================================================
ALTER TABLE public.roles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs          ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- IXTIYORIY (online-market sayti): quyidagilarni online-market kodini tekshirib,
-- keyin ishga tushiring. Hozir "Admin All ..." siyosatlari USING (true) — ya'ni
-- HAR KIM mahsulot, buyurtma, sozlamalarni o'zgartira/o'chira oladi, buyurtmalardagi
-- mijoz ma'lumotlari ochiq o'qiladi. Sayt admin paneli anon kalit bilan yozsa, bu
-- o'zgarish uni to'xtatadi — shuning uchun avval admin panelni Supabase Auth'ga o'tkazing.
-- ------------------------------------------------------------------------------
-- DROP POLICY "Admin All Products" ON public.products;
-- CREATE POLICY "Admin All Products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- DROP POLICY "Public Read Orders" ON public.orders;
-- DROP POLICY "Public Read Seller Applications" ON public.seller_applications;
-- ALTER TABLE public.site_products     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.site_categories   ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.site_company_info ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read" ON public.site_products     FOR SELECT USING (true);
-- CREATE POLICY "Public read" ON public.site_categories   FOR SELECT USING (true);
-- CREATE POLICY "Public read" ON public.site_company_info FOR SELECT USING (true);
