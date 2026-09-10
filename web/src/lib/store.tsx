'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { Warehouse, UserProfile, Product, StockBalance, StockMovement, ProductWithStock, MovementType, ProductUnit, InvoiceWithItems, InvoiceItem, CorrectionRequest, LoginLog, UserRole } from './types';
import { INITIAL_WAREHOUSES, INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_STOCK, INITIAL_MOVEMENTS, INITIAL_INVOICES, INITIAL_CORRECTIONS, INITIAL_LOGIN_LOGS } from './mock-data';

interface AppContextType {
  warehouses: Warehouse[];
  currentWarehouse: Warehouse | null;
  setCurrentWarehouseId: (id: string | null) => void;
  users: UserProfile[];
  currentUser: UserProfile;
  setCurrentUserId: (id: string) => void;
  registerStaffUser: (data: {
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    assigned_warehouse_id?: string | null;
  }) => { success: boolean; error?: string; user?: UserProfile };
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
  }) => { success: boolean; error?: string; movement?: StockMovement };
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
  verifyAdminPin: (pin: string) => boolean;
  recordLoginLog: (eventType: LoginLog['event_type'], details?: Record<string, any>) => void;
  findProductByQR: (qrData: string) => ProductWithStock | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USERS: 'wms_users_v4_market',
  PRODUCTS: 'wms_products_v4_market',
  STOCK: 'wms_stock_v4_market',
  MOVEMENTS: 'wms_movements_v4_market',
  INVOICES: 'wms_invoices_v4_market',
  CORRECTIONS: 'wms_corrections_v4_market',
  LOGIN_LOGS: 'wms_login_logs_v4_market',
  CURRENT_USER: 'wms_current_user_v4_market',
  CURRENT_WH: 'wms_current_wh_v4_market',
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

  // Load from localStorage only after initial client mount to prevent SSR hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUsers =
          localStorage.getItem(STORAGE_KEYS.USERS) ||
          localStorage.getItem('wms_users_v3_clean');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const updated = parsed.map((u: UserProfile) =>
              u.id === 'usr-admin'
                ? {
                    ...u,
                    name: 'Tursunov Umarjon (Admin)',
                    full_name: 'Tursunov Umarjon',
                  }
                : u
            );
            setUsers(updated);
          }
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

  const registerStaffUser = (data: {
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    assigned_warehouse_id?: string | null;
  }): { success: boolean; error?: string; user?: UserProfile } => {
    const trimmedName = data.full_name.trim();
    const trimmedEmail = data.email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: "Xodimning to'liq F.I.O kiritilishi shart!" };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Elektron pochta manzili kiritilishi shart!' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'Ushbu elektron pochta bilan allaqachon akkaunt mavjud!' };
    }

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
      email: trimmedEmail,
      phone: data.phone?.trim() || null,
      employee_id,
      role: data.role,
      role_id: roleId,
      assigned_warehouse_id: data.assigned_warehouse_id || null,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserIdState(newId);
    if (newUser.assigned_warehouse_id) {
      setCurrentWarehouseIdState(newUser.assigned_warehouse_id);
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
      details: { action: 'staff_self_registered', warehouse_id: data.assigned_warehouse_id },
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

  // Atomic Stock Movement Execution
  const executeMovement = ({
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
  }): { success: boolean; error?: string; movement?: StockMovement } => {
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
    const sourceQty = currentSourceStock ? currentSourceStock.quantity : 0;

    // Check OUTBOUND & TRANSFER availability
    if ((movementType === 'outbound' || movementType === 'transfer') && sourceQty < quantity) {
      return {
        success: false,
        error: `Insufficient stock in ${sourceWh.name}. Available: ${sourceQty} ${product.unit}, Requested: ${quantity} ${product.unit}`,
      };
    }

    if (movementType === 'transfer') {
      if (!targetWarehouseId || targetWarehouseId === warehouseId) {
        return { success: false, error: 'Target warehouse must be distinct from source warehouse.' };
      }
    }

    // Apply stock balance updates
    setStock((prev) => {
      let updated = [...prev];

      if (movementType === 'inbound') {
        const existingIdx = updated.findIndex(
          (s) => s.product_id === productId && s.warehouse_id === warehouseId
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
            updated_at: new Date().toISOString(),
          };
        } else {
          updated.push({
            id: `stk-${Date.now()}`,
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: quantity,
            updated_at: new Date().toISOString(),
          });
        }
      } else if (movementType === 'outbound') {
        const existingIdx = updated.findIndex(
          (s) => s.product_id === productId && s.warehouse_id === warehouseId
        );
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: Math.max(0, updated[existingIdx].quantity - quantity),
            updated_at: new Date().toISOString(),
          };
        }
      } else if (movementType === 'transfer' && targetWarehouseId) {
        // Deduct from source
        const srcIdx = updated.findIndex(
          (s) => s.product_id === productId && s.warehouse_id === warehouseId
        );
        if (srcIdx >= 0) {
          updated[srcIdx] = {
            ...updated[srcIdx],
            quantity: Math.max(0, updated[srcIdx].quantity - quantity),
            updated_at: new Date().toISOString(),
          };
        }
        // Increment at target
        const tgtIdx = updated.findIndex(
          (s) => s.product_id === productId && s.warehouse_id === targetWarehouseId
        );
        if (tgtIdx >= 0) {
          updated[tgtIdx] = {
            ...updated[tgtIdx],
            quantity: updated[tgtIdx].quantity + quantity,
            updated_at: new Date().toISOString(),
          };
        } else {
          updated.push({
            id: `stk-${Date.now()}`,
            product_id: productId,
            warehouse_id: targetWarehouseId,
            quantity: quantity,
            updated_at: new Date().toISOString(),
          });
        }
      }

      return updated;
    });

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

    setMovements((prev) => [newMovement, ...prev]);

    recordLoginLog('movement_created', {
      movement_id: newMovement.id,
      product_name: product.name,
      warehouse_name: sourceWh.name,
      type: movementType,
      quantity,
    });

    return { success: true, movement: newMovement };
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

    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'cancelled' } : i))
    );

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
          }
          // Apply new effect
          if (newType === 'inbound') {
            currentQty += newQty;
          } else if (newType === 'outbound') {
            currentQty = Math.max(0, currentQty - newQty);
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

  const verifyAdminPin = (pin: string): boolean => {
    const isMatch = pin.trim() === 'U20020604u';
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
