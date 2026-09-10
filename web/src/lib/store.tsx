'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { Warehouse, UserProfile, Product, StockBalance, StockMovement, ProductWithStock, MovementType, ProductUnit } from './types';
import { INITIAL_WAREHOUSES, INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_STOCK, INITIAL_MOVEMENTS } from './mock-data';

interface AppContextType {
  warehouses: Warehouse[];
  currentWarehouse: Warehouse | null;
  setCurrentWarehouseId: (id: string | null) => void;
  users: UserProfile[];
  currentUser: UserProfile;
  setCurrentUserId: (id: string) => void;
  products: Product[];
  productsWithStock: ProductWithStock[];
  stock: StockBalance[];
  movements: StockMovement[];
  lowStockItems: ProductWithStock[];
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
  findProductByQR: (qrData: string) => ProductWithStock | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'wms_products_v2_clean',
  STOCK: 'wms_stock_v2_clean',
  MOVEMENTS: 'wms_movements_v2_clean',
  CURRENT_USER: 'wms_current_user_v2_clean',
  CURRENT_WH: 'wms_current_wh_v2_clean',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserIdState] = useState<string>('usr-admin');
  const [currentWarehouseId, setCurrentWarehouseIdState] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [stock, setStock] = useState<StockBalance[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_STOCK;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_MOVEMENTS;
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
    }
  }, [stock]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    }
  }, [movements]);

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const currentWarehouse = useMemo(() => {
    if (!currentWarehouseId) return null;
    return warehouses.find((w) => w.id === currentWarehouseId) || null;
  }, [warehouses, currentWarehouseId]);

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
    const user = users.find((u) => u.id === id);
    if (user?.assigned_warehouse_id) {
      setCurrentWarehouseIdState(user.assigned_warehouse_id);
    }
  };

  const setCurrentWarehouseId = (id: string | null) => {
    setCurrentWarehouseIdState(id);
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

      const productMovements = movements
        .filter((m) => m.product_id === product.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        ...product,
        total_stock,
        warehouse_stock: warehouseStockMap,
        is_low_stock,
        last_movement: productMovements[0] || null,
      };
    });
  }, [products, stock, warehouses, currentWarehouseId, movements]);

  const lowStockItems = useMemo(() => {
    return productsWithStock.filter((p) => p.is_low_stock);
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
      timestamp: new Date().toISOString(),
      notes: notes || null,
    };

    setMovements((prev) => [newMovement, ...prev]);

    return { success: true, movement: newMovement };
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
        products,
        productsWithStock,
        stock,
        movements,
        lowStockItems,
        selectedProductIds,
        toggleSelectProduct,
        selectAllProducts,
        clearSelection,
        addProduct,
        updateProduct,
        deleteProduct,
        executeMovement,
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
