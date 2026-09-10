import {
  Warehouse,
  Product,
  StockBalance,
  StockMovement,
  UserProfile,
  InvoiceWithItems,
  CorrectionRequest,
  LoginLog,
} from './types';

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

// Default individual staff profiles (No generic shared logins)
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Ulug\'bek Karimov (Admin)',
    full_name: 'Ulug\'bek Karimov',
    email: 'admin@warehouse.io',
    phone: '+998 90 123-45-67',
    employee_id: 'EMP-0001',
    role: 'admin',
    role_id: '11111111-1111-1111-1111-111111111111',
    assigned_warehouse_id: null,
  },
  {
    id: 'usr-manager',
    name: 'Jasur Mansurov (Ombor Mudiri)',
    full_name: 'Jasur Mansurov',
    email: 'manager@warehouse.io',
    phone: '+998 90 234-56-78',
    employee_id: 'EMP-1001',
    role: 'warehouse_manager',
    role_id: '22222222-2222-2222-2222-222222222222',
    assigned_warehouse_id: null,
  },
  {
    id: 'usr-receiver',
    name: 'Sherzod Aliyev (Qabul Qiluvchi)',
    full_name: 'Sherzod Aliyev',
    email: 'receiver@warehouse.io',
    phone: '+998 90 345-67-89',
    employee_id: 'EMP-2001',
    role: 'receiver',
    role_id: '33333333-3333-3333-3333-333333333333',
    assigned_warehouse_id: 'wh-main',
  },
  {
    id: 'usr-dispatcher',
    name: 'Nodir Qodirov (Jo\'natuvchi)',
    full_name: 'Nodir Qodirov',
    email: 'dispatcher@warehouse.io',
    phone: '+998 90 456-78-90',
    employee_id: 'EMP-3001',
    role: 'dispatcher',
    role_id: '44444444-4444-4444-4444-444444444444',
    assigned_warehouse_id: 'wh-main',
  },
];

// Clean empty collections ready for real production inventory
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STOCK: StockBalance[] = [];
export const INITIAL_MOVEMENTS: StockMovement[] = [];
export const INITIAL_INVOICES: InvoiceWithItems[] = [];
export const INITIAL_CORRECTIONS: CorrectionRequest[] = [];
export const INITIAL_LOGIN_LOGS: LoginLog[] = [];

