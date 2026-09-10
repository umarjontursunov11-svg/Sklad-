export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'warehouse_manager' | 'warehouse_staff';
export type MovementType = 'inbound' | 'outbound' | 'transfer';
export type ProductUnit = 'piece' | 'kg' | 'liter' | 'box' | 'meter' | 'pallet' | 'ampoule' | 'set';

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: UserRole;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: UserRole;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: UserRole;
          description?: string | null;
          created_at?: string;
        };
      };
      warehouses: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role_id: string | null;
          assigned_warehouse_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role_id?: string | null;
          assigned_warehouse_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role_id?: string | null;
          assigned_warehouse_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          unit: ProductUnit;
          min_stock_level: number;
          image_url: string | null;
          qr_code_data: string;
          qr_code_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          unit: ProductUnit;
          min_stock_level?: number;
          image_url?: string | null;
          qr_code_data: string;
          qr_code_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          unit?: ProductUnit;
          min_stock_level?: number;
          image_url?: string | null;
          qr_code_data?: string;
          qr_code_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stock: {
        Row: {
          id: string;
          product_id: string;
          warehouse_id: string;
          quantity: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          warehouse_id: string;
          quantity?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          warehouse_id?: string;
          quantity?: number;
          updated_at?: string;
        };
      };
      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          warehouse_id: string;
          target_warehouse_id: string | null;
          movement_type: MovementType;
          quantity: number;
          user_id: string | null;
          timestamp: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          warehouse_id: string;
          target_warehouse_id?: string | null;
          movement_type: MovementType;
          quantity: number;
          user_id?: string | null;
          timestamp?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          warehouse_id?: string;
          target_warehouse_id?: string | null;
          movement_type?: MovementType;
          quantity?: number;
          user_id?: string | null;
          timestamp?: string;
          notes?: string | null;
        };
      };
    };
    Functions: {
      execute_stock_movement: {
        Args: {
          p_product_id: string;
          p_warehouse_id: string;
          p_movement_type: MovementType;
          p_quantity: number;
          p_user_id?: string | null;
          p_target_warehouse_id?: string | null;
          p_notes?: string | null;
        };
        Returns: Json;
      };
      get_user_role: {
        Args: { p_user_id?: string };
        Returns: string;
      };
      is_admin: {
        Args: { p_user_id?: string };
        Returns: boolean;
      };
      is_manager_or_admin: {
        Args: { p_user_id?: string };
        Returns: boolean;
      };
      get_user_warehouse: {
        Args: { p_user_id?: string };
        Returns: string;
      };
    };
  };
}
