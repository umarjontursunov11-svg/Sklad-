-- ==============================================================================
-- 05_seed_data.sql: Realistic Seed Data for Development & Testing
-- ==============================================================================

-- 1. Seed Roles
INSERT INTO public.roles (id, name, description)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin', 'System Administrator with full access to all settings, users, and warehouses'),
    ('22222222-2222-2222-2222-222222222222', 'warehouse_manager', 'Warehouse Manager with read/write access across all warehouses and reports'),
    ('33333333-3333-3333-3333-333333333333', 'warehouse_staff', 'Warehouse Staff member with access limited to assigned warehouse')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

-- 2. Seed Initial Warehouses
INSERT INTO public.warehouses (id, name, address, is_active)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Main Logistics Hub', '100 Industrial Parkway, Section A', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'North Distribution Center', '77 Northern Highway, Bay 12', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'South Transit Depot', '42 Harbor Logistics Blvd, Dock 3', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, is_active = EXCLUDED.is_active;

-- Initial schema is clean and ready for real production inventory.

