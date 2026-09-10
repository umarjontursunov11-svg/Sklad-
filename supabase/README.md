# Supabase Setup Guide & Documentation

This directory contains the complete database migrations, Row Level Security (RLS) policies, atomic functions, and seed data for the **Warehouse Management & Automation System (WMS)**.

## Quick 1-Step Setup in Supabase

1. Open your Supabase Dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Select your project (or create a new free project).
3. Navigate to the **SQL Editor** on the left menu.
4. Click **New query**.
5. Copy the entire content of [complete_setup.sql](file:///c:/Users/Max/Desktop/%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4/supabase/complete_setup.sql) and paste it into the editor.
6. Click **Run** (or press `Ctrl+Enter`).

## What is created:

### 1. Tables
- `roles`: `admin`, `warehouse_manager`, `warehouse_staff`.
- `warehouses`: Multi-warehouse locations (e.g. Main Logistics Hub, North Distribution Center).
- `users`: User profiles linked to `auth.users` with assigned role and assigned warehouse.
- `products`: Product catalog with name, description, unit, `min_stock_level`, `qr_code_data`, and image URLs.
- `stock`: Real-time inventory balance per product and per warehouse with `quantity >= 0` check.
- `stock_movements`: Immutable transaction ledger recording every `inbound`, `outbound`, and `transfer` event.

### 2. Stored Procedures & Triggers
- `execute_stock_movement(...)`: Atomic ACID transaction with row-level locks (`FOR UPDATE`). Handles stock balance deduction, increment, threshold checks, and ledger logging in a single atomic transaction.
- `handle_new_user()`: Trigger on `auth.users` to automatically create a `public.users` profile and assign a default role.
- `set_updated_at()`: Automatic timestamp triggers on records.

### 3. Row Level Security (RLS)
- **Admin**: Full read & write permissions across all tables.
- **Warehouse Manager**: Full read & write permissions on products, inventory, and movements across all warehouses.
- **Warehouse Staff**: Read products & inventory; can record inbound/outbound stock movements for their assigned warehouse.

### 4. Storage Buckets (run `04_storage_buckets.sql` if not already created)
- `product-images`: Public bucket for product catalog photos.
- `product-qrcodes`: Public bucket for generated QR code assets and badge prints.

### 5. Real-Time Synchronization
- Real-time replication is enabled for `stock`, `stock_movements`, and `products` so web and mobile clients receive live updates instantly.
