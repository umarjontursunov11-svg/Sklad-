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

-- 2. Seed Warehouses
INSERT INTO public.warehouses (id, name, address, is_active)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Main Logistics Hub', '100 Industrial Parkway, Section A', true),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'North Distribution Center', '77 Northern Highway, Bay 12', true),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'South Transit Depot', '42 Harbor Logistics Blvd, Dock 3', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, is_active = EXCLUDED.is_active;

-- 3. Seed Products
INSERT INTO public.products (id, name, description, unit, min_stock_level, qr_code_data, image_url)
VALUES 
    (
        '90000000-0000-0000-0000-000000000001',
        'Industrial Ball Bearings (Set of 10)',
        'Chrome steel precision deep groove ball bearings for heavy machinery.',
        'box',
        25,
        'WMS-PRD-1001',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000002',
        'Synthetic Motor Oil 5W-30',
        'High-performance full synthetic engine lubricant for commercial fleet.',
        'liter',
        50,
        'WMS-PRD-1002',
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000003',
        'Heavy-Duty Euro Pallet (Pine)',
        'Standard heat-treated EPAL wooden pallet, 1200x800mm.',
        'pallet',
        15,
        'WMS-PRD-1003',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000004',
        'Nitrile Protective Gloves (100 pcs)',
        'Powder-free textured heavy-duty black nitrile gloves.',
        'box',
        40,
        'WMS-PRD-1004',
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000005',
        'Stainless Steel Hex Bolt M8x50',
        'Grade A2-70 rust-resistant stainless steel hex head screw.',
        'piece',
        300,
        'WMS-PRD-1005',
        'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000006',
        'Hydraulic Fluid ISO VG 46',
        'Anti-wear premium hydraulic oil for fork lifts and presses.',
        'liter',
        80,
        'WMS-PRD-1006',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000007',
        'Safety Hard Hat ANSI Z89.1',
        'High-visibility ventilated hard hat with 4-point ratchet suspension.',
        'piece',
        20,
        'WMS-PRD-1007',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'
    ),
    (
        '90000000-0000-0000-0000-000000000008',
        'Industrial Stretch Wrap Film (500mm)',
        'Cast stretch film 23 micron, high puncture resistance.',
        'piece',
        35,
        'WMS-PRD-1008',
        'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=400&q=80'
    )
ON CONFLICT (qr_code_data) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, min_stock_level = EXCLUDED.min_stock_level;

-- 4. Seed Initial Stock Balances
INSERT INTO public.stock (product_id, warehouse_id, quantity)
VALUES
    -- Main Logistics Hub
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 120),
    ('90000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 200),
    ('90000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50),
    ('90000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 85),
    ('90000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1500),
    ('90000000-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 300),
    ('90000000-0000-0000-0000-000000000007', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 60),
    ('90000000-0000-0000-0000-000000000008', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 90),

    -- North Distribution Center (Some low stock items to trigger alerts!)
    ('90000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 12), -- Low! (min 25)
    ('90000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 45), -- Low! (min 50)
    ('90000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 22),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 60),
    ('90000000-0000-0000-0000-000000000005', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 200), -- Low! (min 300)
    ('90000000-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 95),

    -- South Transit Depot
    ('90000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 30),
    ('90000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 80),
    ('90000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 18),
    ('90000000-0000-0000-0000-000000000004', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 10)  -- Low! (min 40)
ON CONFLICT (product_id, warehouse_id) DO UPDATE
SET quantity = EXCLUDED.quantity;

-- 5. Seed Sample Movements History
INSERT INTO public.stock_movements (product_id, warehouse_id, movement_type, quantity, timestamp, notes)
VALUES
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'inbound', 150, now() - INTERVAL '3 days', 'Initial vendor delivery via PO-9821'),
    ('90000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'outbound', 30, now() - INTERVAL '2 days', 'Dispatched to Assembly Line A'),
    ('90000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'inbound', 200, now() - INTERVAL '5 days', 'Bulk delivery palletized'),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'inbound', 80, now() - INTERVAL '1 day', 'Restock shipment received'),
    ('90000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'outbound', 20, now() - INTERVAL '4 hours', 'Issued to packaging shift team');
