export type UserRole = 'admin' | 'warehouse_manager' | 'receiver' | 'dispatcher' | 'warehouse_staff';
export type MovementType = 'inbound' | 'outbound' | 'transfer';
export type ProductUnit = 'piece' | 'kg' | 'liter' | 'box' | 'meter' | 'pallet' | 'ampoule' | 'set';

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
  full_name: string;
  username: string;
  email: string;
  phone?: string | null;
  employee_id: string;
  role: UserRole;
  role_id: string;
  assigned_warehouse_id: string | null;
  password_hash: string;
  must_change_password?: boolean;
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
  manufacture_date?: string | null;
  expiry_date?: string | null;
  storage_conditions?: string | null;
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
  employee_id?: string | null;
  device_type?: 'web' | 'mobile' | 'scanner' | string | null;
  timestamp: string;
  notes: string | null;
}

export interface ProductWithStock extends Product {
  total_stock: number;
  warehouse_stock: { [warehouse_id: string]: number };
  is_low_stock: boolean;
  expiry_status: 'good' | 'expiring_soon' | 'expired' | 'none';
  days_until_expiry?: number | null;
  last_movement?: StockMovement | null;
}

export type InvoiceStatus = 'draft' | 'issued' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  customer_inn: string | null;
  warehouse_id: string;
  created_by: string | null;
  creator_name?: string | null;
  creator_employee_id?: string | null;
  created_at: string;
  total_amount: number;
  status: InvoiceStatus;
  notes: string | null;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string;
  stock_movement_id?: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  product?: Product;
  created_at?: string;
}

export interface InvoiceWithItems extends Invoice {
  items: (InvoiceItem & { product?: Product })[];
  warehouse_name?: string;
}

export interface CorrectionChanges {
  quantity?: number;
  movement_type?: MovementType;
  notes?: string;
  manufacture_date?: string | null;
  storage_conditions?: string | null;
}

export type CorrectionStatus = 'pending' | 'approved' | 'rejected';

export interface CorrectionRequest {
  id: string;
  movement_id: string;
  original_movement_id?: string;
  original_movement?: StockMovement | null;
  movement?: StockMovement | null;
  requested_by: string;
  requester_name?: string;
  requested_by_name?: string;
  requester_employee_id?: string | null;
  requested_by_employee_id?: string;
  reason: string;
  requested_changes: CorrectionChanges;
  // Snapshot of the values at the time the request was sent (for "old → new" display)
  original_values?: {
    quantity?: number;
    manufacture_date?: string | null;
    storage_conditions?: string | null;
  };
  requested_change?: {
    new_quantity?: number;
    new_notes?: string;
  };
  status: CorrectionStatus;
  reviewed_by?: string | null;
  reviewer_name?: string | null;
  reviewed_by_name?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  created_at: string;
}

export type LoginEventType =
  | 'login'
  | 'logout'
  | 'admin_access_success'
  | 'admin_access_failed'
  | 'movement_created'
  | 'invoice_created'
  | 'correction_requested'
  | 'correction_approved'
  | 'correction_rejected';

export interface LoginLog {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  user_name?: string;
  employee_id?: string | null;
  role?: string;
  event_type: LoginEventType;
  device_type: 'web' | 'mobile' | 'scanner';
  ip_address?: string | null;
  user_agent?: string | null;
  details?: Record<string, any> | null;
  metadata?: any;
  created_at: string;
}
