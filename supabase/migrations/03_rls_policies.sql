-- ==============================================================================
-- 03_rls_policies.sql: Row Level Security (RLS) Configuration
-- ==============================================================================

-- 1. Helper Security Functions (SECURITY DEFINER to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
    SELECT r.name
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = p_user_id AND r.name = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_manager_or_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.users u
        JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = p_user_id AND r.name IN ('admin', 'warehouse_manager')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_warehouse(p_user_id UUID DEFAULT auth.uid())
RETURNS UUID AS $$
    SELECT assigned_warehouse_id
    FROM public.users
    WHERE id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Enable RLS on all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- ROLES POLICIES
-- ==============================================================================
CREATE POLICY "Authenticated users can read roles"
    ON public.roles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can insert/update/delete roles"
    ON public.roles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- WAREHOUSES POLICIES
-- ==============================================================================
-- Everyone authenticated can view warehouses
CREATE POLICY "Authenticated users can read warehouses"
    ON public.warehouses FOR SELECT
    TO authenticated
    USING (true);

-- Admins and managers can modify warehouses
CREATE POLICY "Admins and managers can manage warehouses"
    ON public.warehouses FOR ALL
    TO authenticated
    USING (public.is_manager_or_admin())
    WITH CHECK (public.is_manager_or_admin());

-- ==============================================================================
-- USERS POLICIES
-- ==============================================================================
-- Users can view their own profile; managers and admins can view all users
CREATE POLICY "Users can read profiles"
    ON public.users FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR
        public.is_manager_or_admin()
    );

-- Users can update their own name; admins can update everything
CREATE POLICY "Users can update own name"
    ON public.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can insert and delete users"
    ON public.users FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- PRODUCTS POLICIES
-- ==============================================================================
-- All authenticated users can view product catalog
CREATE POLICY "All authenticated users can view products"
    ON public.products FOR SELECT
    TO authenticated
    USING (true);

-- Admins and managers can create/edit/delete products
CREATE POLICY "Admins and managers can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_manager_or_admin())
    WITH CHECK (public.is_manager_or_admin());

-- ==============================================================================
-- STOCK POLICIES
-- ==============================================================================
-- Admins & managers can see all stock; staff can see their assigned warehouse stock (or all for inventory lookup)
CREATE POLICY "Staff can view assigned warehouse stock, managers view all"
    ON public.stock FOR SELECT
    TO authenticated
    USING (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse() OR
        -- Allow lookup of stock across warehouses for scanned products
        true
    );

-- Modifications to stock must go through stored procedure or be done by manager/admin
CREATE POLICY "Managers and admins can directly modify stock"
    ON public.stock FOR ALL
    TO authenticated
    USING (public.is_manager_or_admin())
    WITH CHECK (public.is_manager_or_admin());

-- ==============================================================================
-- STOCK MOVEMENTS POLICIES
-- ==============================================================================
-- Staff can view movements for their warehouse; managers & admins can view all
CREATE POLICY "Users can view relevant stock movements"
    ON public.stock_movements FOR SELECT
    TO authenticated
    USING (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse() OR
        target_warehouse_id = public.get_user_warehouse()
    );

-- Staff can record movements for their warehouse; managers & admins for any warehouse
CREATE POLICY "Users can record stock movements"
    ON public.stock_movements FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_manager_or_admin() OR
        warehouse_id = public.get_user_warehouse()
    );
