-- ==============================================================================
-- 04_storage_buckets.sql: Supabase Storage Buckets Configuration
-- ==============================================================================

-- 1. Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('product-qrcodes', 'product-qrcodes', true, 2097152, ARRAY['image/png', 'image/svg+xml', 'application/pdf'])
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for product-images
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins and managers can update product images" ON storage.objects;
CREATE POLICY "Admins and managers can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_manager_or_admin());

DROP POLICY IF EXISTS "Admins and managers can delete product images" ON storage.objects;
CREATE POLICY "Admins and managers can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_manager_or_admin());

-- 3. Storage Policies for product-qrcodes
DROP POLICY IF EXISTS "Public can view product QR codes" ON storage.objects;
CREATE POLICY "Public can view product QR codes"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'product-qrcodes');

DROP POLICY IF EXISTS "Authenticated users can upload product QR codes" ON storage.objects;
CREATE POLICY "Authenticated users can upload product QR codes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-qrcodes');

DROP POLICY IF EXISTS "Admins and managers can update product QR codes" ON storage.objects;
CREATE POLICY "Admins and managers can update product QR codes"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-qrcodes' AND public.is_manager_or_admin());
