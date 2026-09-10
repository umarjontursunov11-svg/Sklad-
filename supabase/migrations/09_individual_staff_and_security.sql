-- ==============================================================================
-- Migration 09: Individual Staff Accounts, Role Permissions, Correction Requests & Login Logs
-- ==============================================================================

-- 1. Extend roles table check constraint to include 'receiver' and 'dispatcher'
ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS roles_name_check;
ALTER TABLE public.roles ADD CONSTRAINT roles_name_check CHECK (name IN ('admin', 'warehouse_manager', 'warehouse_staff', 'receiver', 'dispatcher'));

-- Insert new roles if they don't exist
INSERT INTO public.roles (name, description)
VALUES 
    ('receiver', 'Ombor Qabul Qiluvchisi (Faqat kirim amallari)'),
    ('dispatcher', 'Ombor Jo''natuvchisi (Faqat chiqim va sotuv yuk xatlari)')
ON CONFLICT (name) DO NOTHING;

-- 2. Enhance users profile table with full_name, employee_id, and phone
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS employee_id TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Populate full_name from name if not set
UPDATE public.users SET full_name = name WHERE full_name IS NULL OR full_name = '';

-- Add uniqueness constraint on employee_id and phone where not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON public.users(employee_id) WHERE employee_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone) WHERE phone IS NOT NULL;

-- 3. Enhance stock_movements table with employee_id and device_type
ALTER TABLE public.stock_movements
ADD COLUMN IF NOT EXISTS employee_id TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'web' CHECK (device_type IN ('web', 'mobile', 'scanner'));

CREATE INDEX IF NOT EXISTS idx_stock_movements_employee_id ON public.stock_movements(employee_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_timestamp_sec ON public.stock_movements(timestamp DESC);

-- 4. Enhance invoices table with creator_employee_id
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS creator_name TEXT,
ADD COLUMN IF NOT EXISTS creator_employee_id TEXT;

-- 5. Create correction_requests table
CREATE TABLE IF NOT EXISTS public.correction_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_movement_id UUID NOT NULL REFERENCES public.stock_movements(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    requested_change JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_correction_requests_status ON public.correction_requests(status);
CREATE INDEX IF NOT EXISTS idx_correction_requests_requested_by ON public.correction_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_correction_requests_created_at ON public.correction_requests(created_at DESC);

-- 6. Create login_logs table
CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    employee_id TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'admin_access_success', 'admin_access_failed')),
    device_type TEXT NOT NULL DEFAULT 'web' CHECK (device_type IN ('web', 'mobile', 'scanner')),
    ip_address TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_logs_event_type ON public.login_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE public.correction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Correction requests policies:
-- Staff can view only their own submitted requests
DROP POLICY IF EXISTS "Staff can view own correction requests" ON public.correction_requests;
CREATE POLICY "Staff can view own correction requests"
    ON public.correction_requests
    FOR SELECT
    TO authenticated
    USING (requested_by = auth.uid());

-- Staff can insert correction requests
DROP POLICY IF EXISTS "Staff can insert correction requests" ON public.correction_requests;
CREATE POLICY "Staff can insert correction requests"
    ON public.correction_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (requested_by = auth.uid());

-- Managers and Admins can view all correction requests
DROP POLICY IF EXISTS "Managers and Admins can view all correction requests" ON public.correction_requests;
CREATE POLICY "Managers and Admins can view all correction requests"
    ON public.correction_requests
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager')
        )
    );

-- Managers and Admins can update/approve correction requests
DROP POLICY IF EXISTS "Managers and Admins can update correction requests" ON public.correction_requests;
CREATE POLICY "Managers and Admins can update correction requests"
    ON public.correction_requests
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name IN ('admin', 'warehouse_manager')
        )
    );

-- Login logs policies:
-- Admins can view all login logs
DROP POLICY IF EXISTS "Admins can view all login logs" ON public.login_logs;
CREATE POLICY "Admins can view all login logs"
    ON public.login_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            JOIN public.roles r ON u.role_id = r.id
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Any authenticated user can insert their own login/logout logs
DROP POLICY IF EXISTS "Users can insert login logs" ON public.login_logs;
CREATE POLICY "Users can insert login logs"
    ON public.login_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on correction_requests" ON public.correction_requests;
CREATE POLICY "Service role full access on correction_requests" ON public.correction_requests FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on login_logs" ON public.login_logs;
CREATE POLICY "Service role full access on login_logs" ON public.login_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
