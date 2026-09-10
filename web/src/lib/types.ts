export type UserRole = 'admin' | 'warehouse_manager' | 'warehouse_staff';
export type MovementType = 'inbound' | 'outbound' | 'transfer';
export type ProductUnit = 'piece' | 'kg' | 'liter' | 'box' | 'meter' | 'pallet';

export interface Warehouse {
  id: string;
  name: string;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  role_id: string;
  assigned_warehouse_id: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  unit: ProductUnit;
  min_stock_level: number;
  image_url: string | null;
  qr_code_data: string;
  qr_code_image_url?: string | null;
  created_at: string;
}

export interface StockBalance {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  warehouse_id: string;
  target_warehouse_id: string | null;
  movement_type: MovementType;
  quantity: number;
  user_id: string | null;
  user_name?: string;
  timestamp: string;
  notes: string | null;
}

export interface ProductWithStock extends Product {
  total_stock: number;
  warehouse_stock: { [warehouse_id: string]: number };
  is_low_stock: boolean;
  last_movement?: StockMovement | null;
}
