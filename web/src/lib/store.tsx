'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import QRCode from 'qrcode';
import { Warehouse, UserProfile, Product, StockBalance, StockMovement, ProductWithStock, MovementType, ProductUnit, InvoiceWithItems, InvoiceItem, CorrectionRequest, LoginLog, UserRole } from './types';
import { INITIAL_WAREHOUSES, INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_STOCK, INITIAL_MOVEMENTS, INITIAL_INVOICES, INITIAL_CORRECTIONS, INITIAL_LOGIN_LOGS } from './mock-data';
import { supabase, isSupabaseConfigured, authJsonHeaders } from './supabase/client';

// SHA-256 hash utility (sync version using SubtleCrypto workaround)
export async function hashPassword(password: string): Promise<string> {
  const cleanPassword = (password || '').trim();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(cleanPassword);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('SubtleCrypto failed, using fallback hash:', e);
    }
  }

  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < cleanPassword.length; i++) {
    const char = cleanPassword.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 7) + hash2) ^ char;
  }
  const h1Hex = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2Hex = (hash2 >>> 0).toString(16).padStart(8, '0');
  return 'fb_' + h1Hex + h2Hex;
}

// Synchronous hash for comparison (using simple hash)
export function hashPasswordSync(password: string): string {
  // Simple djb2-based hash — for localStorage/mock usage only
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  authenticatedUser: UserProfile | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  warehouses: Warehouse[];
  currentWarehouse: Warehouse | null;
  setCurrentWarehouseId: (id: string | null) => void;
  users: UserProfile[];
  currentUser: UserProfile;
  setCurrentUserId: (id: string) => void;
  registerStaffUser: (data: {
    full_name: string;
    username: string;
    password: string;
    email: string;
    phone?: string;
    role: UserRole;
    assigned_warehouse_id?: string | null;
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  deleteStaffUser: (userId: string) => { success: boolean; error?: string };
  products: Product[];
  productsWithStock: ProductWithStock[];
  stock: StockBalance[];
  movements: StockMovement[];
  invoices: InvoiceWithItems[];
  correctionRequests: CorrectionRequest[];
  loginLogs: LoginLog[];
  adminSessionVerified: boolean;
  setAdminSessionVerified: (verified: boolean) => void;
  lowStockItems: ProductWithStock[];
  expiringItems: ProductWithStock[];
  selectedProductIds: string[];
  toggleSelectProduct: (id: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;
  addProduct: (product: {
    name: string;
    description: string;
    unit: ProductUnit;
    min_stock_level: number;
    image_url?: string;
    manufacture_date?: string | null;
    expiry_date?: string | null;
    storage_conditions?: string | null;
    initial_stock?: { warehouse_id: string; quantity: number }[];
  }) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  executeMovement: (params: {
    productId: string;
    warehouseId: string;
    targetWarehouseId?: string | null;
    movementType: MovementType;
    quantity: number;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string; movement?: StockMovement }>;
  adjustStockBalance: (params: {
    productId: string;
    warehouseId: string;
    newQuantity: number;
    reason?: string;
  }) => { success: boolean; error?: string; oldQuantity?: number; newQuantity?: number };
  createSaleInvoice: (params: {
    warehouseId: string;
    customerName: string;
    customerPhone?: string | null;
    customerAddress?: string | null;
    customerInn?: string | null;
    notes?: string | null;
    creatorName?: string | null;
    createdBy?: string | null;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[];
  }) => { success: boolean; error?: string; invoice?: InvoiceWithItems };
  updateInvoiceCreator: (invoiceId: string, creatorName: string) => void;
  cancelInvoice: (invoiceId: string) => { success: boolean; error?: string };
  submitCorrectionRequest: (params: {
    movementId: string;
    reason: string;
    requestedChanges: {
      quantity?: number;
      movement_type?: MovementType;
      notes?: string;
    };
  }) => { success: boolean; error?: string; request?: CorrectionRequest };
  reviewCorrectionRequest: (params: {
    requestId: string;
    status: 'approved' | 'rejected';
    reviewNotes?: string;
  }) => { success: boolean; error?: string };
  verifyAdminPin: (pin: string) => Promise<boolean>;
  recordLoginLog: (eventType: LoginLog['event_type'], details?: Record<string, any>) => void;
  findProductByQR: (qrData: string) => ProductWithStock | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'wms_users_v5_auth',
  PRODUCTS: 'wms_products_v5_auth',
  STOCK: 'wms_stock_v5_auth',
  MOVEMENTS: 'wms_movements_v5_auth',
  INVOICES: 'wms_invoices_v5_auth',
  CORRECTIONS: 'wms_corrections_v5_auth',
  LOGIN_LOGS: 'wms_login_logs_v5_auth',
  CURRENT_USER: 'wms_current_user_v5_auth',
  CURRENT_WH: 'wms_current_wh_v5_auth',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserIdState] = useState<string>('usr-admin');
  const [currentWarehouseId, setCurrentWarehouseIdState] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stock, setStock] = useState<StockBalance[]>(INITIAL_STOCK);
  const [movements, setMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>(INITIAL_INVOICES);
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>(INITIAL_CORRECTIONS);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(INITIAL_LOGIN_LOGS);
  const [adminSessionVerified, setAdminSessionVerified] = useState<boolean>(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Auth state
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(null);

  // Load from localStorage only after initial client mount to prevent SSR hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const loadInitialData = async () => {
          try {
            const res = await fetch('/api/sync');
            if (res.ok) {
              const serverData = await res.json();
              if (Array.isArray(serverData.users) && serverData.users.length > 0) {
                const sanitized = serverData.users.map((u: UserProfile) => ({
                  ...u,
                  password_hash: u.password_hash || '4f25be58d1a252a1c039b97353e6880e58bf592ed52c0e852383169c3b4c8f0f',
                }));
                setUsers(sanitized);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sanitized));
              }
              if (Array.isArray(serverData.products) && serverData.products.length > 0) setProducts(serverData.products);
              if (Array.isArray(serverData.stock) && serverData.stock.length > 0) setStock(serverData.stock);
              if (Array.isArray(serverData.movements) && serverData.movements.length > 0) setMovements(serverData.movements);
              if (Array.isArray(serverData.invoices) && serverData.invoices.length > 0) setInvoices(serverData.invoices);
              if (Array.isArray(serverData.corrections) && serverData.corrections.length > 0) setCorrectionRequests(serverData.corrections);
              if (Array.isArray(serverData.loginLogs) && serverData.loginLogs.length > 0) setLoginLogs(serverData.loginLogs);
            }
          } catch (err) {
            console.warn('Server sync fetch failed, falling back to localStorage:', err);
          } finally {
            setIsHydrated(true);
          }
        };

        loadInitialData();

        const savedUsers =
          localStorage.getItem(STORAGE_KEYS.USERS) ||
          localStorage.getItem('wms_users_v3_clean');
        if (savedUsers) {
          try {
            const parsed = JSON.parse(savedUsers);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const updated = parsed.map((u: UserProfile) => {
                let pHash = u.password_hash || '4f25be58d1a252a1c039b97353e6880e58bf592ed52c0e852383169c3b4c8f0f';
                if (u.id === 'usr-admin') {
                  return { ...u, name: 'Tursunov Umarjon (Admin)', full_name: 'Tursunov Umarjon', password_hash: pHash };
                }
                return { ...u, password_hash: pHash };
              });
              setUsers((prev) => {
                const map = new Map<string, UserProfile>();
                prev.forEach(u => map.set(u.username?.toLowerCase() || u.id, u));
                updated.forEach(u => {
                  const key = u.username?.toLowerCase() || u.id;
                  if (!map.has(key)) map.set(key, u);
                });
                return Array.from(map.values());
              });
            }
          } catch (e) {}
        }

        const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed)) setProducts(parsed);
        }

        const savedStock = localStorage.getItem(STORAGE_KEYS.STOCK);
        if (savedStock) {
          const parsed = JSON.parse(savedStock);
          if (Array.isArray(parsed)) setStock(parsed);
        }

        const savedMovements = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
        if (savedMovements) {
          const parsed = JSON.parse(savedMovements);
          if (Array.isArray(parsed)) setMovements(parsed);
        }

        const savedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
        if (savedInvoices) {
          const parsed = JSON.parse(savedInvoices);
          if (Array.isArray(parsed)) setInvoices(parsed);
        }

        const savedCorrections = localStorage.getItem(STORAGE_KEYS.CORRECTIONS);
        if (savedCorrections) {
          const parsed = JSON.parse(savedCorrections);
          if (Array.isArray(parsed)) setCorrectionRequests(parsed);
        }

        const savedLoginLogs = localStorage.getItem(STORAGE_KEYS.LOGIN_LOGS);
        if (savedLoginLogs) {
          const parsed = JSON.parse(savedLoginLogs);
          if (Array.isArray(parsed)) setLoginLogs(parsed);
        }
      } catch (e) {
        console.error('Failed to load WMS data from localStorage:', e);
      } finally {
        setIsHydrated(true);
      }
    }
  }, []);

  // Sync to localStorage ONLY after hydration is complete (prevent overwriting saved data on initial render)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }, [users, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
    }
  }, [stock, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    }
  }, [movements, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    }
  }, [invoices, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CORRECTIONS, JSON.stringify(correctionRequests));
    }
  }, [correctionRequests, isHydrated]);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LOGIN_LOGS, JSON.stringify(loginLogs));
    }
  }, [loginLogs, isHydrated]);

  // Supabase Auth session sync & real DB user profiles
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    if (isSupabaseConfigured && supabase) {
      // 1. Fetch real users and roles from Supabase database
      supabase
        .from('users')
        .select('id, name, email, role_id, employee_id, phone, full_name, assigned_warehouse_id, must_change_password, roles(name)')
        .then(({ data, error }) => {
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: UserProfile[] = data.map((u: any) => ({
              id: u.id,
              name: u.full_name || u.name,
              full_name: u.full_name || u.name,
              username: u.email ? u.email.split('@')[0] : u.name,
              email: u.email,
              employee_id: u.employee_id || null,
              phone: u.phone || null,
              role: (u.roles?.name || 'warehouse_staff') as UserRole,
              role_id: u.role_id || '',
              password_hash: '',
              assigned_warehouse_id: u.assigned_warehouse_id || null,
              must_change_password: u.must_change_password ?? false,
            }));
            setUsers(mapped);
          }
        });

      // 2. Sync Supabase Auth session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setAuthenticatedUserId(session.user.id);
          setCurrentUserIdState(session.user.id);
          const role = session.user.user_metadata?.role;
          if (role) {
            document.cookie = `wms_user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setAuthenticatedUserId(session.user.id);
          setCurrentUserIdState(session.user.id);
          const role = session.user.user_metadata?.role;
          if (role) {
            document.cookie = `wms_user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthenticatedUserId(null);
          setAdminSessionVerified(false);
          document.cookie = 'wms_user_role=; path=/; max-age=0';
          document.cookie = 'admin_verified=; path=/; max-age=0';
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isHydrated]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const currentWarehouse = useMemo(() => {
    if (!currentWarehouseId) return null;
    return warehouses.find((w) => w.id === currentWarehouseId) || null;
  }, [warehouses, currentWarehouseId]);

  const recordLoginLog = (eventType: LoginLog['event_type'], details?: Record<string, any>) => {
    const newLog: LoginLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: currentUser?.id || 'unknown',
      user_name: currentUser?.name || 'Unknown',
      employee_id: currentUser?.employee_id || null,
      role: currentUser?.role || 'warehouse_staff',
      event_type: eventType,
      ip_address: '127.0.0.1',
      device_type: 'web',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      details: details || null,
      created_at: new Date().toISOString(),
    };
    setLoginLogs((prev) => [newLog, ...prev]);
  };

  // Auth: computed values
  const isAuthenticated = authenticatedUserId !== null;
  const authenticatedUser = useMemo(() => {
    if (!authenticatedUserId) return null;
    return users.find(u => u.id === authenticatedUserId) || null;
  }, [users, authenticatedUserId]);

  // Auth: login function
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedUsername = (username || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!trimmedUsername) {
      return { success: false, error: "Login kiritilishi shart!" };
    }
    if (!cleanPassword) {
      return { success: false, error: "Parol kiritilishi shart!" };
    }

    // Strict Supabase Auth login - ALL authentication goes through signInWithPassword
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase maʼlumotlar bazasi sozlanmagan!" };
    }

    const foundUser = users.find(u => u.username?.trim().toLowerCase() === trimmedUsername || u.email?.trim().toLowerCase() === trimmedUsername);
    const targetEmail = foundUser?.email || (trimmedUsername.includes('@') ? trimmedUsername : `${trimmedUsername}@ombor.uz`);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: cleanPassword,
      });

      if (authError || !authData?.user) {
        return { success: false, error: authError?.message || "Login yoki parol noto'g'ri!" };
      }

      const activeId = authData.user.id;
      setAuthenticatedUserId(activeId);
      setCurrentUserIdState(activeId);

      // Reload staff profiles now that the session exists (RLS hides them before login).
      const { data: dbUsers } = await (supabase.from('users') as any)
        .select('id, name, email, role_id, employee_id, phone, full_name, assigned_warehouse_id, must_change_password, roles(name)');
      if (Array.isArray(dbUsers) && dbUsers.length > 0) {
        setUsers(dbUsers.map((u: any) => ({
          id: u.id,
          name: u.full_name || u.name,
          full_name: u.full_name || u.name,
          username: u.email ? u.email.split('@')[0] : u.name,
          email: u.email,
          employee_id: u.employee_id || null,
          phone: u.phone || null,
          role: (u.roles?.name || 'warehouse_staff') as UserRole,
          role_id: u.role_id || '',
          password_hash: '',
          assigned_warehouse_id: u.assigned_warehouse_id || null,
          must_change_password: u.must_change_password ?? false,
        })));
      }

      // Set cookie for middleware route guarding
      const userRole = foundUser?.role || authData.user.user_metadata?.role || 'warehouse_staff';
      if (typeof document !== 'undefined') {
        document.cookie = `wms_user_role=${userRole}; path=/; max-age=86400; SameSite=Lax`;
        if (userRole === 'admin') {
          document.cookie = `admin_verified=true; path=/; max-age=14400; SameSite=Lax`;
        }
      }

      if (foundUser?.assigned_warehouse_id) {
        setCurrentWarehouseIdState(foundUser.assigned_warehouse_id);
      }

      const loginLog: LoginLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        user_id: activeId,
        user_name: foundUser?.name || targetEmail,
        employee_id: foundUser?.employee_id || null,
        role: userRole,
        event_type: 'login',
        ip_address: '127.0.0.1',
        device_type: 'web',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
        details: { method: 'supabase_auth', email: targetEmail },
        created_at: new Date().toISOString(),
      };
      setLoginLogs((prev) => [loginLog, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Autentifikatsiyada xatolik!" };
    }
  }, [users]);

  // Auth: logout function
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }

    const logoutLog: LoginLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: currentUser?.id || 'unknown',
      user_name: currentUser?.name || 'Unknown',
      employee_id: currentUser?.employee_id || null,
      role: currentUser?.role || 'warehouse_staff',
      event_type: 'logout',
      ip_address: '127.0.0.1',
      device_type: 'web',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      details: { method: 'manual_logout' },
      created_at: new Date().toISOString(),
    };
    setLoginLogs((prev) => [logoutLog, ...prev]);

    setAuthenticatedUserId(null);
    setAdminSessionVerified(false);

    if (typeof document !== 'undefined') {
      document.cookie = 'wms_user_role=; path=/; max-age=0';
      document.cookie = 'admin_verified=; path=/; max-age=0';
    }
  }, [currentUser]);

  // Auth: change password function (used on first login or manual change)
  const changePassword = useCallback(async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!authenticatedUserId) {
      return { success: false, error: "Tizimga kirilmagan!" };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak!" };
    }

    // 1. Update password in Supabase Auth if Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: updateData, error: authError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (authError) {
          console.error("Supabase auth updateUser failed:", authError.message);
          return { success: false, error: authError.message || "Parolni o'zgartirishda xatolik yuz berdi!" };
        }

        // 2. Update must_change_password: false in public.users DB table
        const { error: dbError } = await (supabase.from('users') as any)
          .update({ must_change_password: false })
          .eq('id', authenticatedUserId);

        if (dbError) {
          console.error("Supabase DB update failed:", dbError.message);
          return { success: false, error: dbError.message || "Ma'lumotlar bazasida parolni tasdiqlashda xatolik!" };
        }
      } catch (err: any) {
        console.error("Unexpected error updating password:", err);
        return { success: false, error: err?.message || "Kutilmagan xatolik yuz berdi!" };
      }
    }

    // 3. Update local state & central server store only after Auth & DB updates succeed
    const newHash = await hashPassword(newPassword);
    let updatedRecord: UserProfile | null = null;

    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === authenticatedUserId) {
          updatedRecord = { ...u, password_hash: newHash, must_change_password: false };
          return updatedRecord;
        }
        return u;
      });
      return updated;
    });

    const log: LoginLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: authenticatedUserId,
      user_name: authenticatedUser?.name || 'User',
      employee_id: authenticatedUser?.employee_id || null,
      role: authenticatedUser?.role || 'warehouse_staff',
      event_type: 'admin_access_success',
      ip_address: '127.0.0.1',
      device_type: 'web',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      details: { action: 'password_changed_by_user' },
      created_at: new Date().toISOString(),
    };
    setLoginLogs((prev) => [log, ...prev]);

    return { success: true };
  }, [authenticatedUserId, authenticatedUser]);

  const setCurrentUserId = (id: string) => {
    const prevUser = currentUser;
    const nextUser = users.find((u) => u.id === id) || users[0];

    if (prevUser && prevUser.id !== id) {
      const logoutLog: LoginLog = {
        id: `log-${Date.now()}-out`,
        user_id: prevUser.id,
        user_name: prevUser.name,
        employee_id: prevUser.employee_id || null,
        role: prevUser.role,
        event_type: 'logout',
        ip_address: '127.0.0.1',
        device_type: 'web',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
        details: { switched_to: nextUser.name },
        created_at: new Date().toISOString(),
      };
      const loginLog: LoginLog = {
        id: `log-${Date.now() + 1}-in`,
        user_id: nextUser.id,
        user_name: nextUser.name,
        employee_id: nextUser.employee_id || null,
        role: nextUser.role,
        event_type: 'login',
        ip_address: '127.0.0.1',
        device_type: 'web',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
        details: { employee_id: nextUser.employee_id, role: nextUser.role },
        created_at: new Date().toISOString(),
      };
      setLoginLogs((prev) => [loginLog, logoutLog, ...prev]);
    }

    if (nextUser.role !== 'admin') {
      setAdminSessionVerified(false);
    }

    setCurrentUserIdState(id);
    if (nextUser.assigned_warehouse_id) {
      setCurrentWarehouseIdState(nextUser.assigned_warehouse_id);
    }
  };

  const setCurrentWarehouseId = (id: string | null) => {
    setCurrentWarehouseIdState(id);
  };

  const registerStaffUser = async (data: {
    full_name: string;
    username: string;
    password: string;
    email: string;
    phone?: string;
    role: UserRole;
    assigned_warehouse_id?: string | null;
  }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const trimmedName = data.full_name.trim();
    const trimmedUsername = data.username.trim().toLowerCase();
    const trimmedEmail = data.email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: "Xodimning to'liq F.I.O kiritilishi shart!" };
    }
    if (!trimmedUsername) {
      return { success: false, error: "Login kiritilishi shart!" };
    }
    if (trimmedUsername.length < 3) {
      return { success: false, error: "Login kamida 3 ta belgidan iborat bo'lishi kerak!" };
    }
    if (!data.password || data.password.length < 8) {
      return { success: false, error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Elektron pochta manzili kiritilishi shart!' };
    }

    // Check username uniqueness
    const usernameExists = users.some((u) => u.username?.toLowerCase() === trimmedUsername);
    if (usernameExists) {
      return { success: false, error: 'Ushbu login allaqachon band! Boshqa login tanlang.' };
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (emailExists) {
      return { success: false, error: 'Ushbu elektron pochta bilan allaqachon akkaunt mavjud!' };
    }

    // Hash password
    const password_hash = await hashPassword(data.password);

    // Generate unique employee ID based on role
    const prefix =
      data.role === 'receiver'
        ? 'EMP-2'
        : data.role === 'dispatcher'
        ? 'EMP-3'
        : data.role === 'warehouse_manager'
        ? 'EMP-1'
        : 'EMP-5';

    const countWithPrefix = users.filter((u) => u.employee_id.startsWith(prefix)).length + 1;
    const employee_id = `${prefix}${String(countWithPrefix).padStart(3, '0')}`;

    const newId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const roleId =
      data.role === 'admin'
        ? '11111111-1111-1111-1111-111111111111'
        : data.role === 'warehouse_manager'
        ? '22222222-2222-2222-2222-222222222222'
        : data.role === 'receiver'
        ? '44444444-4444-4444-4444-444444444444'
        : data.role === 'dispatcher'
        ? '55555555-5555-5555-5555-555555555555'
        : '33333333-3333-3333-3333-333333333333';

    const newUser: UserProfile = {
      id: newId,
      name: trimmedName,
      full_name: trimmedName,
      username: trimmedUsername,
      email: trimmedEmail,
      phone: data.phone?.trim() || null,
      employee_id,
      role: data.role,
      role_id: roleId,
      assigned_warehouse_id: data.assigned_warehouse_id || null,
      password_hash,
      must_change_password: true, // Staff member must set their own password upon first login
    };

    setUsers((prev) => {
      const updated = [...prev, newUser];
      if (typeof window !== 'undefined') {
        try {
          authJsonHeaders()
            .then((headers) =>
              fetch('/api/staff', {
                method: 'POST',
                headers,
                body: JSON.stringify({ action: 'register_user', user: newUser, password: data.password }),
              })
            )
            .then(res => res.json())
            .then(resData => {
              if (resData?.user?.id) {
                const createdAuthId = resData.user.id;
                setUsers(current =>
                  current.map(u => (u.id === newId ? { ...u, id: createdAuthId } : u))
                );
              }
            })
            .catch(() => {});
        } catch (e) {}
      }
      return updated;
    });

    // If no user is logged in, auto-login as the new user. If Admin is already logged in, preserve Admin's session.
    if (!authenticatedUserId) {
      setAuthenticatedUserId(newId);
      setCurrentUserIdState(newId);
      if (newUser.assigned_warehouse_id) {
        setCurrentWarehouseIdState(newUser.assigned_warehouse_id);
      }
    }

    const regLog: LoginLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: newId,
      user_name: trimmedName,
      employee_id,
      role: data.role,
      event_type: 'login',
      ip_address: '127.0.0.1',
      device_type: 'web',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      details: { action: 'staff_account_created_by_admin', username: trimmedUsername, warehouse_id: data.assigned_warehouse_id },
      created_at: new Date().toISOString(),
    };
    setLoginLogs((prev) => [regLog, ...prev]);

    return { success: true, user: newUser };
  };

  const deleteStaffUser = (userId: string): { success: boolean; error?: string } => {
    // Only Admin can delete staff
    if (currentUser.role !== 'admin') {
      return {
        success: false,
        error: "Xodimlarni o'chirish faqat Tizim Administratoriga ruxsat etilgan!",
      };
    }

    // Protect main admin account
    if (userId === 'usr-admin' || userId === currentUser.id) {
      return {
        success: false,
        error: "Asosiy tizim administratorini o'chirib bo'lmaydi!",
      };
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) {
      return {
        success: false,
        error: "Xodim topilmadi!",
      };
    }

    // Remove user
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    // If active user was the deleted user, fallback to main admin
    if (currentUserId === userId) {
      setCurrentUserIdState('usr-admin');
    }

    // Audit log
    const delLog: LoginLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name || currentUser.name,
      employee_id: currentUser.employee_id,
      role: currentUser.role,
      event_type: 'logout',
      ip_address: '127.0.0.1',
      device_type: 'web',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      details: {
        action: 'staff_account_deleted',
        deleted_employee_id: targetUser.employee_id,
        deleted_user_name: targetUser.full_name || targetUser.name,
        deleted_role: targetUser.role,
      },
      created_at: new Date().toISOString(),
    };
    setLoginLogs((prev) => [delLog, ...prev]);

    return { success: true };
  };

  // Compute products with calculated stock per warehouse and total
  const productsWithStock: ProductWithStock[] = useMemo(() => {
    return products.map((product) => {
      const warehouseStockMap: { [whId: string]: number } = {};
      warehouses.forEach((wh) => {
        const item = stock.find((s) => s.product_id === product.id && s.warehouse_id === wh.id);
        warehouseStockMap[wh.id] = item ? Number(item.quantity) : 0;
      });

      const total_stock = Object.values(warehouseStockMap).reduce((sum, q) => sum + q, 0);

      // If a specific warehouse is selected, check against that warehouse's stock
      const effectiveStock = currentWarehouseId ? (warehouseStockMap[currentWarehouseId] ?? 0) : total_stock;
      const is_low_stock = effectiveStock <= product.min_stock_level;

      // Expiry status calculation
      let expiry_status: 'good' | 'expiring_soon' | 'expired' | 'none' = 'none';
      let days_until_expiry: number | null = null;
      if (product.expiry_date) {
        const expiryTime = new Date(product.expiry_date).getTime();
        const now = new Date();
        const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const diffDays = Math.ceil((expiryTime - todayTime) / (1000 * 60 * 60 * 24));
        days_until_expiry = diffDays;

        if (diffDays < 0) {
          expiry_status = 'expired';
        } else if (diffDays <= 90) { // 3 months or less (<= 90 days)
          expiry_status = 'expiring_soon';
        } else {
          expiry_status = 'good';
        }
      }

      const productMovements = movements
        .filter((m) => m.product_id === product.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        ...product,
        total_stock,
        warehouse_stock: warehouseStockMap,
        is_low_stock,
        expiry_status,
        days_until_expiry,
        last_movement: productMovements[0] || null,
      };
    });
  }, [products, stock, warehouses, currentWarehouseId, movements]);

  const lowStockItems = useMemo(() => {
    return productsWithStock.filter((p) => p.is_low_stock);
  }, [productsWithStock]);

  const expiringItems = useMemo(() => {
    return productsWithStock.filter(
      (p) => p.expiry_status === 'expiring_soon' || p.expiry_status === 'expired'
    );
  }, [productsWithStock]);

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectAllProducts = () => {
    setSelectedProductIds(products.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  // Add Product with automatic QR code generation
  const addProduct = async (data: {
    name: string;
    description: string;
    unit: ProductUnit;
    min_stock_level: number;
    image_url?: string;
    manufacture_date?: string | null;
    expiry_date?: string | null;
    storage_conditions?: string | null;
    initial_stock?: { warehouse_id: string; quantity: number }[];
  }): Promise<Product> => {
    const id = `prd-${Date.now().toString(36)}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const qr_code_data = `WMS-PRD-${randomCode}`;

    // Generate high resolution QR code data URL
    let qr_code_image_url = '';
    try {
      qr_code_image_url = await QRCode.toDataURL(qr_code_data, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (err) {
      console.error('Failed to generate QR code data URL', err);
    }

    const newProduct: Product = {
      id,
      name: data.name,
      description: data.description,
      unit: data.unit,
      min_stock_level: data.min_stock_level,
      image_url: data.image_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
      qr_code_data,
      qr_code_image_url,
      manufacture_date: data.manufacture_date || null,
      expiry_date: data.expiry_date || null,
      storage_conditions: data.storage_conditions || null,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Initial stock insertion if provided
    if (data.initial_stock && data.initial_stock.length > 0) {
      const newStockBalances: StockBalance[] = [];
      const newMovementsList: StockMovement[] = [];

      data.initial_stock.forEach((init) => {
        if (init.quantity > 0) {
          newStockBalances.push({
            id: `stk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            product_id: id,
            warehouse_id: init.warehouse_id,
            quantity: init.quantity,
            updated_at: new Date().toISOString(),
          });

          newMovementsList.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            product_id: id,
            warehouse_id: init.warehouse_id,
            target_warehouse_id: null,
            movement_type: 'inbound',
            quantity: init.quantity,
            user_id: currentUser.id,
            user_name: currentUser.name,
            timestamp: new Date().toISOString(),
            notes: 'Initial stock intake upon product creation',
          });
        }
      });

      setStock((prev) => [...prev, ...newStockBalances]);
      setMovements((prev) => [...newMovementsList, ...prev]);
    }

    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setStock((prev) => prev.filter((s) => s.product_id !== id));
    setSelectedProductIds((prev) => prev.filter((pId) => pId !== id));
  };

  // Atomic Stock Movement Execution invoking real execute_stock_movement RPC
  const executeMovement = async ({
    productId,
    warehouseId,
    targetWarehouseId = null,
    movementType,
    quantity,
    notes = '',
  }: {
    productId: string;
    warehouseId: string;
    targetWarehouseId?: string | null;
    movementType: MovementType;
    quantity: number;
    notes?: string;
  }): Promise<{ success: boolean; error?: string; movement?: StockMovement }> => {
    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be greater than 0.' };
    }

    // Enforce role restrictions
    if (currentUser.role === 'receiver' && movementType !== 'inbound') {
      return {
        success: false,
        error: "Qabul qiluvchi (Receiver) faqat kirim (inbound) operatsiyalarini bajara oladi.",
      };
    }
    if (currentUser.role === 'dispatcher' && movementType !== 'outbound') {
      return {
        success: false,
        error: "Jo'natuvchi (Dispatcher) faqat chiqim (outbound) operatsiyalarini bajara oladi.",
      };
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return { success: false, error: 'Product not found.' };

    const sourceWh = warehouses.find((w) => w.id === warehouseId);
    if (!sourceWh) return { success: false, error: 'Source warehouse not found.' };

    const currentSourceStock = stock.find(
      (s) => s.product_id === productId && s.warehouse_id === warehouseId
    );
    const sourceQty = currentSourceStock ? Number(currentSourceStock.quantity) : 0;

    if (movementType === 'transfer') {
      if (!targetWarehouseId || targetWarehouseId === warehouseId) {
        return { success: false, error: 'Target warehouse must be distinct from source warehouse.' };
      }
    }

    // Real Supabase RPC invocation
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: rpcData, error: rpcError } = await (supabase as any).rpc('execute_stock_movement', {
          p_product_id: productId,
          p_warehouse_id: warehouseId,
          p_movement_type: movementType,
          p_quantity: quantity,
          p_user_id: currentUser.id?.includes('-') ? currentUser.id : null,
          p_target_warehouse_id: targetWarehouseId || null,
          p_notes: notes || null,
        });

        if (rpcError) {
          return { success: false, error: rpcError.message };
        }

        const newMovementId = rpcData?.movement_id || `mov-${Date.now()}`;
        const newMovement: StockMovement = {
          id: newMovementId,
          product_id: productId,
          warehouse_id: warehouseId,
          target_warehouse_id: targetWarehouseId,
          movement_type: movementType,
          quantity,
          user_id: currentUser.id,
          user_name: currentUser.name,
          employee_id: currentUser.employee_id || null,
          device_type: 'web',
          timestamp: rpcData?.timestamp || new Date().toISOString(),
          notes: notes || null,
        };

        setMovements((prev) => [newMovement, ...prev]);

        // Calculate and update local stock balances
        const newQty = movementType === 'inbound'
          ? sourceQty + quantity
          : Math.max(0, sourceQty - quantity);

        setStock((prev) => {
          let updated = [...prev];
          const srcIdx = updated.findIndex(s => s.product_id === productId && s.warehouse_id === warehouseId);
          if (srcIdx >= 0) {
            updated[srcIdx] = { ...updated[srcIdx], quantity: newQty, updated_at: new Date().toISOString() };
          } else {
            updated.push({ id: `stk-${Date.now()}`, product_id: productId, warehouse_id: warehouseId, quantity: newQty, updated_at: new Date().toISOString() });
          }

          if (movementType === 'transfer' && targetWarehouseId) {
            const tgtIdx = updated.findIndex(s => s.product_id === productId && s.warehouse_id === targetWarehouseId);
            if (tgtIdx >= 0) {
              updated[tgtIdx] = { ...updated[tgtIdx], quantity: updated[tgtIdx].quantity + quantity, updated_at: new Date().toISOString() };
            } else {
              updated.push({ id: `stk-${Date.now()}-tgt`, product_id: productId, warehouse_id: targetWarehouseId, quantity: quantity, updated_at: new Date().toISOString() });
            }
          }
          return updated;
        });

        // Trigger Telegram low-stock alert if remaining stock in warehouse falls below threshold
        if (movementType === 'outbound' || movementType === 'transfer') {
          if (newQty <= product.min_stock_level) {
            const alertBody = JSON.stringify({
                product_name: product.name,
                qr_code_data: product.qr_code_data,
                warehouse_name: sourceWh.name,
                current_stock: newQty,
                min_stock_level: product.min_stock_level,
                unit: product.unit,
                movement_type: movementType,
                quantity,
                user_name: currentUser.name,
              });
            authJsonHeaders()
              .then((headers) => fetch('/api/telegram/send-alert', { method: 'POST', headers, body: alertBody }))
              .catch(e => console.error('Telegram alert dispatch error:', e));
          }
        }

        recordLoginLog('movement_created', {
          movement_id: newMovement.id,
          product_name: product.name,
          warehouse_name: sourceWh.name,
          type: movementType,
          quantity,
        });

        return { success: true, movement: newMovement };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Bazada operatsiyani bajarishda xatolik yuz berdi' };
      }
    }

    // Fallback if Supabase not configured
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      product_id: productId,
      warehouse_id: warehouseId,
      target_warehouse_id: targetWarehouseId,
      movement_type: movementType,
      quantity,
      user_id: currentUser.id,
      user_name: currentUser.name,
      employee_id: currentUser.employee_id || null,
      device_type: 'web',
      timestamp: new Date().toISOString(),
      notes: notes || null,
    };
    return { success: true, movement: newMovement };
  };

  const adjustStockBalance = (params: {
    productId: string;
    warehouseId: string;
    newQuantity: number;
    reason?: string;
  }): { success: boolean; error?: string; oldQuantity?: number; newQuantity?: number } => {
    const { productId, warehouseId, newQuantity, reason } = params;
    const cleanQty = Math.max(0, Math.round(Number(newQuantity) * 1000) / 1000 || 0);

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, error: 'Mahsulot topilmadi!' };
    }

    const wh = warehouses.find((w) => w.id === warehouseId);
    if (!wh) {
      return { success: false, error: 'Ombor topilmadi!' };
    }

    const currentItem = stock.find(
      (s) => s.product_id === productId && s.warehouse_id === warehouseId
    );
    const oldQty = currentItem ? Number(currentItem.quantity) : 0;

    if (oldQty === cleanQty) {
      return { success: true, oldQuantity: oldQty, newQuantity: cleanQty };
    }

    const diff = cleanQty - oldQty;
    const movementType: MovementType = diff > 0 ? 'inbound' : 'outbound';

    setStock((prev) => {
      const idx = prev.findIndex(
        (s) => s.product_id === productId && s.warehouse_id === warehouseId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: cleanQty,
          updated_at: new Date().toISOString(),
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: cleanQty,
            updated_at: new Date().toISOString(),
          },
        ];
      }
    });

    // Record adjustment movement for transparency and auditability
    const adjMovement: StockMovement = {
      id: `mov-adj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_id: productId,
      warehouse_id: warehouseId,
      target_warehouse_id: null,
      movement_type: movementType,
      quantity: Math.abs(diff),
      user_id: currentUser?.id || 'usr-admin',
      user_name: currentUser?.full_name || currentUser?.name || 'Admin',
      employee_id: currentUser?.employee_id || null,
      device_type: 'web',
      timestamp: new Date().toISOString(),
      notes: reason
        ? `Ombor matritsasidan miqdor o'zgartirildi (${oldQty} -> ${cleanQty} ${product.unit}). Sabab: ${reason}`
        : `Ombor matritsasidan to'g'rilandi: ${wh.name} (${oldQty} -> ${cleanQty} ${product.unit})`,
    };
    setMovements((prev) => [adjMovement, ...prev]);

    recordLoginLog('movement_created', {
      movement_id: adjMovement.id,
      action: 'matrix_quantity_adjusted',
      product_name: product.name,
      warehouse_name: wh.name,
      old_quantity: oldQty,
      new_quantity: cleanQty,
      difference: diff,
    });

    return { success: true, oldQuantity: oldQty, newQuantity: cleanQty };
  };

  const createSaleInvoice = ({
    warehouseId,
    customerName,
    customerPhone = null,
    customerAddress = null,
    customerInn = null,
    notes = null,
    creatorName = null,
    createdBy = null,
    items,
  }: {
    warehouseId: string;
    customerName: string;
    customerPhone?: string | null;
    customerAddress?: string | null;
    customerInn?: string | null;
    notes?: string | null;
    creatorName?: string | null;
    createdBy?: string | null;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[];
  }): { success: boolean; error?: string; invoice?: InvoiceWithItems } => {
    if (currentUser.role === 'receiver') {
      return { success: false, error: "Qabul qiluvchi (Receiver) hisob-faktura chiqara olmaydi." };
    }

    if (!customerName.trim()) {
      return { success: false, error: 'Customer name is required.' };
    }
    if (!items || items.length === 0) {
      return { success: false, error: 'At least one item is required.' };
    }

    const sourceWh = warehouses.find((w) => w.id === warehouseId);
    if (!sourceWh) {
      return { success: false, error: 'Warehouse not found.' };
    }

    const effectiveCreatorName = creatorName?.trim() || currentUser.name;
    const effectiveCreatedBy = createdBy || currentUser.id;

    // Validate all items have sufficient stock
    for (const item of items) {
      if (item.quantity <= 0) {
        return { success: false, error: 'Quantity must be greater than 0.' };
      }
      if (item.unitPrice < 0) {
        return { success: false, error: 'Unit price cannot be negative.' };
      }
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: 'Product not found.' };
      }
      const currentSourceStock = stock.find(
        (s) => s.product_id === item.productId && s.warehouse_id === warehouseId
      );
      const available = currentSourceStock ? currentSourceStock.quantity : 0;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${prod.name} in ${sourceWh.name}. Available: ${available} ${prod.unit}, requested: ${item.quantity} ${prod.unit}`,
        };
      }
    }

    const invoiceId = `inv-${Date.now()}`;
    const year = new Date().getFullYear();
    const invoiceNumSeq = String(invoices.length + 1).padStart(6, '0');
    const invoiceNumber = `INV-${year}-${invoiceNumSeq}`;

    let totalAmount = 0;
    const createdMovements: StockMovement[] = [];
    const invoiceItems: InvoiceItem[] = [];

    // Deduct stock and record stock movements
    setStock((prev) => {
      let updated = [...prev];
      items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const lineTotal = item.quantity * item.unitPrice;
        totalAmount += lineTotal;

        const movementId = `mov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const movement: StockMovement = {
          id: movementId,
          product_id: item.productId,
          warehouse_id: warehouseId,
          target_warehouse_id: null,
          movement_type: 'outbound',
          quantity: item.quantity,
          user_id: effectiveCreatedBy,
          user_name: effectiveCreatorName,
          employee_id: currentUser.employee_id || null,
          device_type: 'web',
          timestamp: new Date().toISOString(),
          notes: `Sotuv (Sale): ${invoiceNumber} - Mijoz: ${customerName}`,
        };
        createdMovements.push(movement);

        invoiceItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          invoice_id: invoiceId,
          product_id: item.productId,
          stock_movement_id: movementId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: lineTotal,
          product: prod,
          created_at: new Date().toISOString(),
        });

        const existingIdx = updated.findIndex(
          (s) => s.product_id === item.productId && s.warehouse_id === warehouseId
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: Math.max(0, updated[existingIdx].quantity - item.quantity),
            updated_at: new Date().toISOString(),
          };
        }
      });
      return updated;
    });

    const newInvoice: InvoiceWithItems = {
      id: invoiceId,
      invoice_number: invoiceNumber,
      customer_name: customerName.trim(),
      customer_phone: customerPhone?.trim() || null,
      customer_address: customerAddress?.trim() || null,
      customer_inn: customerInn?.trim() || null,
      warehouse_id: warehouseId,
      warehouse_name: sourceWh.name,
      created_by: effectiveCreatedBy,
      creator_name: effectiveCreatorName,
      creator_employee_id: currentUser.employee_id || null,
      created_at: new Date().toISOString(),
      total_amount: totalAmount,
      status: 'issued',
      notes: notes?.trim() || null,
      items: invoiceItems,
    };

    setMovements((prev) => [...createdMovements, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    recordLoginLog('invoice_created', {
      invoice_id: invoiceId,
      invoice_number: invoiceNumber,
      customer_name: customerName,
      total_amount: totalAmount,
    });

    return { success: true, invoice: newInvoice };
  };

  const updateInvoiceCreator = (invoiceId: string, creatorName: string) => {
    if (!creatorName.trim()) return;
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invoiceId ? { ...i, creator_name: creatorName.trim() } : i
      )
    );
  };

  const cancelInvoice = (invoiceId: string): { success: boolean; error?: string } => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { success: false, error: 'Invoice not found.' };
    if (inv.status === 'cancelled') return { success: false, error: 'Invoice is already cancelled.' };

    // 1. Restore stock balance for each item in the cancelled invoice
    setStock((prev) => {
      let updated = [...prev];
      inv.items.forEach((item) => {
        const idx = updated.findIndex(
          (s) => s.product_id === item.product_id && s.warehouse_id === inv.warehouse_id
        );
        if (idx >= 0) {
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + item.quantity,
            updated_at: new Date().toISOString(),
          };
        } else {
          updated.push({
            id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            product_id: item.product_id,
            warehouse_id: inv.warehouse_id,
            quantity: item.quantity,
            updated_at: new Date().toISOString(),
          });
        }
      });
      return updated;
    });

    // 2. Record compensatory inbound stock movements ("Return to Stock")
    const returnMovements: StockMovement[] = inv.items.map((item) => ({
      id: `mov-ret-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      product_id: item.product_id,
      warehouse_id: inv.warehouse_id,
      target_warehouse_id: null,
      movement_type: 'inbound',
      quantity: item.quantity,
      user_id: currentUser.id,
      user_name: currentUser.name,
      employee_id: currentUser.employee_id || null,
      device_type: 'web',
      timestamp: new Date().toISOString(),
      notes: `Qaytarildi (Return from Cancelled Invoice): ${inv.invoice_number}`,
    }));

    setMovements((prev) => [...returnMovements, ...prev]);

    // 3. Mark invoice as cancelled
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'cancelled' } : i))
    );

    recordLoginLog('movement_created', {
      action: 'invoice_cancelled',
      invoice_id: invoiceId,
      invoice_number: inv.invoice_number,
      returned_items_count: inv.items.length,
    });

    return { success: true };
  };

  const submitCorrectionRequest = ({
    movementId,
    reason,
    requestedChanges,
  }: {
    movementId: string;
    reason: string;
    requestedChanges: {
      quantity?: number;
      movement_type?: MovementType;
      notes?: string;
    };
  }): { success: boolean; error?: string; request?: CorrectionRequest } => {
    const targetMovement = movements.find((m) => m.id === movementId);
    if (!targetMovement) {
      return { success: false, error: "Operatsiya topilmadi." };
    }

    if (
      (currentUser.role === 'receiver' || currentUser.role === 'dispatcher') &&
      targetMovement.user_id !== currentUser.id
    ) {
      return {
        success: false,
        error: "Faqat o'zingiz kiritgan operatsiyalar bo'yicha tuzatish so'rashingiz mumkin.",
      };
    }

    if (!reason.trim()) {
      return { success: false, error: "Tuzatish sababi ko'rsatilishi shart." };
    }

    const newRequest: CorrectionRequest = {
      id: `req-${Date.now()}`,
      movement_id: movementId,
      requested_by: currentUser.id,
      requester_name: currentUser.name,
      requester_employee_id: currentUser.employee_id || null,
      reason: reason.trim(),
      requested_changes: requestedChanges,
      status: 'pending',
      created_at: new Date().toISOString(),
      movement: targetMovement,
    };

    setCorrectionRequests((prev) => [newRequest, ...prev]);

    recordLoginLog('correction_requested', {
      request_id: newRequest.id,
      movement_id: movementId,
      reason: reason.trim(),
    });

    return { success: true, request: newRequest };
  };

  const reviewCorrectionRequest = ({
    requestId,
    status,
    reviewNotes = '',
  }: {
    requestId: string;
    status: 'approved' | 'rejected';
    reviewNotes?: string;
  }): { success: boolean; error?: string } => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'warehouse_manager') {
      return {
        success: false,
        error: "Faqat ombor mudiri yoki admin tuzatish so'rovini ko'rib chiqishi mumkin.",
      };
    }

    const req = correctionRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: "So'rov topilmadi." };
    if (req.status !== 'pending') return { success: false, error: "Bu so'rov allaqachon ko'rib chiqilgan." };

    const targetMovement = movements.find((m) => m.id === req.movement_id);
    if (!targetMovement && status === 'approved') {
      return { success: false, error: "Bog'langan operatsiya topilmadi." };
    }

    if (status === 'approved' && targetMovement) {
      const newQty = req.requested_changes.quantity !== undefined ? req.requested_changes.quantity : targetMovement.quantity;
      const newType = req.requested_changes.movement_type || targetMovement.movement_type;

      // Revert old movement effect and apply new one on stock
      setStock((prev) => {
        let updated = [...prev];
        const stockIdx = updated.findIndex(
          (s) => s.product_id === targetMovement.product_id && s.warehouse_id === targetMovement.warehouse_id
        );

        if (stockIdx >= 0) {
          let currentQty = updated[stockIdx].quantity;
          // Undo old effect
          if (targetMovement.movement_type === 'inbound') {
            currentQty -= targetMovement.quantity;
          } else if (targetMovement.movement_type === 'outbound') {
            currentQty += targetMovement.quantity;
          } else if (targetMovement.movement_type === 'transfer') {
            currentQty += targetMovement.quantity; // return to source
            if (targetMovement.target_warehouse_id) {
              const tgtIdx = updated.findIndex(
                (s) => s.product_id === targetMovement.product_id && s.warehouse_id === targetMovement.target_warehouse_id
              );
              if (tgtIdx >= 0) {
                updated[tgtIdx] = {
                  ...updated[tgtIdx],
                  quantity: Math.max(0, updated[tgtIdx].quantity - targetMovement.quantity),
                  updated_at: new Date().toISOString(),
                };
              }
            }
          }

          // Apply new effect
          if (newType === 'inbound') {
            currentQty += newQty;
          } else if (newType === 'outbound') {
            currentQty = Math.max(0, currentQty - newQty);
          } else if (newType === 'transfer') {
            currentQty = Math.max(0, currentQty - newQty); // deduct new qty from source
            const tgtWh = targetMovement.target_warehouse_id;
            if (tgtWh) {
              const tgtIdx = updated.findIndex(
                (s) => s.product_id === targetMovement.product_id && s.warehouse_id === tgtWh
              );
              if (tgtIdx >= 0) {
                updated[tgtIdx] = {
                  ...updated[tgtIdx],
                  quantity: updated[tgtIdx].quantity + newQty,
                  updated_at: new Date().toISOString(),
                };
              } else {
                updated.push({
                  id: `stk-${Date.now()}-corr-tgt`,
                  product_id: targetMovement.product_id,
                  warehouse_id: tgtWh,
                  quantity: newQty,
                  updated_at: new Date().toISOString(),
                });
              }
            }
          }

          updated[stockIdx] = {
            ...updated[stockIdx],
            quantity: Math.max(0, currentQty),
            updated_at: new Date().toISOString(),
          };
        }
        return updated;
      });

      // Update movement record
      setMovements((prev) =>
        prev.map((m) =>
          m.id === targetMovement.id
            ? {
                ...m,
                quantity: newQty,
                movement_type: newType,
                notes: `${m.notes || ''} [Tuzatildi: ${currentUser.name} (${currentUser.employee_id || 'Manager'}) - ${reviewNotes || 'Tasdiqlandi'}]`.trim(),
              }
            : m
        )
      );
    }

    const reviewedAt = new Date().toISOString();
    setCorrectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              reviewed_by: currentUser.id,
              reviewer_name: currentUser.name,
              review_notes: reviewNotes || null,
              reviewed_at: reviewedAt,
            }
          : r
      )
    );

    recordLoginLog(status === 'approved' ? 'correction_approved' : 'correction_rejected', {
      request_id: requestId,
      movement_id: req.movement_id,
      notes: reviewNotes,
    });

    return { success: true };
  };

  // Admin re-verification: the admin re-enters their OWN account password.
  // Nothing secret is embedded in the browser bundle.
  const verifyAdminPin = async (pin: string): Promise<boolean> => {
    const candidate = (pin || '').trim();
    let isMatch = false;
    try {
      if (candidate && isSupabaseConfigured && supabase) {
        // Read identity and role from Supabase directly (the local users list may not be loaded yet).
        const { data: userData } = await supabase.auth.getUser();
        const authUser = userData?.user;
        if (authUser?.email) {
          const { data: profile } = await (supabase.from('users') as any)
            .select('id, roles(name)')
            .eq('id', authUser.id)
            .maybeSingle();
          if ((profile as any)?.roles?.name === 'admin') {
            // Re-authenticate with the admin's own account password.
            const { error } = await supabase.auth.signInWithPassword({
              email: authUser.email,
              password: candidate,
            });
            isMatch = !error;
          }
        }
      } else if (candidate && authenticatedUser?.role === 'admin' && authenticatedUser.password_hash) {
        isMatch = (await hashPassword(candidate)) === authenticatedUser.password_hash;
      }
    } catch (e) {
      isMatch = false;
    }
    if (isMatch) {
      setAdminSessionVerified(true);
      recordLoginLog('admin_access_success', { verified_at: new Date().toISOString() });
      return true;
    } else {
      recordLoginLog('admin_access_failed', { attempted_length: pin.length });
      return false;
    }
  };

  const findProductByQR = (qrData: string): ProductWithStock | undefined => {
    return productsWithStock.find(
      (p) => p.qr_code_data.toLowerCase() === qrData.trim().toLowerCase() || p.id === qrData.trim()
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        authenticatedUser,
        login,
        logout,
        changePassword,
        warehouses,
        currentWarehouse,
        setCurrentWarehouseId,
        users,
        currentUser,
        setCurrentUserId,
        registerStaffUser,
        deleteStaffUser,
        products,
        productsWithStock,
        stock,
        movements,
        invoices,
        correctionRequests,
        loginLogs,
        adminSessionVerified,
        setAdminSessionVerified,
        lowStockItems,
        expiringItems,
        selectedProductIds,
        toggleSelectProduct,
        selectAllProducts,
        clearSelection,
        addProduct,
        updateProduct,
        deleteProduct,
        executeMovement,
        adjustStockBalance,
        createSaleInvoice,
        updateInvoiceCreator,
        cancelInvoice,
        submitCorrectionRequest,
        reviewCorrectionRequest,
        verifyAdminPin,
        recordLoginLog,
        findProductByQR,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
