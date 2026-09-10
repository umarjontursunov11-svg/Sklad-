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

// Initial system administrator (Staff will self-register)
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
];

// Clean empty collections ready for real production inventory
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_STOCK: StockBalance[] = [];
export const INITIAL_MOVEMENTS: StockMovement[] = [];
export const INITIAL_INVOICES: InvoiceWithItems[] = [];
export const INITIAL_CORRECTIONS: CorrectionRequest[] = [];
export const INITIAL_LOGIN_LOGS: LoginLog[] = [];

