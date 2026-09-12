-- ==============================================================================
-- Migration 10: Ensure must_change_password Column Exists on public.users
-- ==============================================================================

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT true;

-- Default existing admin accounts to false
UPDATE public.users
SET must_change_password = false
WHERE username = 'admin' OR id = 'usr-admin';
