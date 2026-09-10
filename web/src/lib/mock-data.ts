import { Warehouse, Product, StockBalance, StockMovement, UserProfile } from './types';

// Default initial warehouses
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-main',
    name: 'Asosiy Ombor (Central Hub)',
    address: 'Sanoat zonasi, 1-bino',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'wh-north',
    name: 'Shimoliy Filial (North Distribution)',
    address: 'Aylanma yo\'l, 12-blok',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'wh-south',
    name: 'Janubiy Terminal (South Depot)',
    address: 'Logistika ko\'chasi, 4-dock',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Default initial user profiles
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Admin User',
    email: 'admin@warehouse.io',
    role: 'admin',
    role_id: '11111111-1111-1111-1111-111111111111',
    assigned_warehouse_id: null,
  },
  {
    id: 'usr-manager',
    name: 'Ombor Mudiri (Manager)',
    email: 'manager@warehouse.io',
    role: 'warehouse_manager',
    role_id: '22222222-2222-2222-2222-222222222222',
    assigned_warehouse_id: null,
  },
  {
    id: 'usr-staff',
    name: 'Ombor Xodimi (Staff)',
    email: 'staff@warehouse.io',
    role: 'warehouse_staff',
    role_id: '33333333-3333-3333-3333-333333333333',
    assigned_warehouse_id: 'wh-main',
  },
];

// Clean empty collections ready for real production inventory
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STOCK: StockBalance[] = [];
export const INITIAL_MOVEMENTS: StockMovement[] = [];
