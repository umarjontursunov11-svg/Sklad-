-- ==============================================================================
-- 11_security_hardening.sql
-- 1) Block privilege escalation: a non-admin user could previously UPDATE their
--    own public.users row and set role_id = admin.
-- 2) Pin search_path on SECURITY DEFINER helpers.
-- 3) Users may only write login logs for themselves.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.role() = 'service_role' OR public.is_admin() THEN
        RETURN NEW;
    END IF;

    IF NEW.role_id IS DISTINCT FROM OLD.role_id
       OR NEW.assigned_warehouse_id IS DISTINCT FROM OLD.assigned_warehouse_id
       OR NEW.id IS DISTINCT FROM OLD.id
       OR NEW.email IS DISTINCT FROM OLD.email THEN
        RAISE EXCEPTION 'Only administrators can change role, warehouse, id or email';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.users;
CREATE TRIGGER trg_prevent_privilege_escalation
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_escalation();

ALTER FUNCTION public.get_user_role(UUID)        SET search_path = public;
ALTER FUNCTION public.is_admin(UUID)             SET search_path = public;
ALTER FUNCTION public.is_manager_or_admin(UUID)  SET search_path = public;
ALTER FUNCTION public.get_user_warehouse(UUID)   SET search_path = public;

DROP POLICY IF EXISTS "Users can insert login logs" ON public.login_logs;
CREATE POLICY "Users can insert login logs"
    ON public.login_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
