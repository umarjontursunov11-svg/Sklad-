// Shares products and stock balances between devices through Supabase
// (tables app_products / app_stock, see supabase/migrations/14_app_data_sync.sql).
// localStorage stays the working copy; this module only reconciles it with the cloud.
import { supabase, isSupabaseConfigured } from './supabase/client';
import { Product, StockBalance } from './types';
import { INITIAL_PRODUCTS } from './mock-data';

const KNOWN_IDS_KEY = 'wms_cloud_known_products_v1';
const PAGE_SIZE = 1000;
const WRITE_CHUNK = 50;

const BASELINE_PRODUCT_IDS = new Set(INITIAL_PRODUCTS.map((p) => p.id));

export interface CloudData {
  products: Product[];
  stock: StockBalance[];
}

// What the cloud holds, as last read or written by this browser.
export interface CloudSnapshot {
  products: Map<string, string>;
  stock: Map<string, string>;
}

export const stockKey = (s: Pick<StockBalance, 'product_id' | 'warehouse_id'>) =>
  `${s.product_id}|${s.warehouse_id}`;
const productSig = (p: Product) => JSON.stringify(p);
const stockSig = (s: StockBalance) => `${s.id}|${Number(s.quantity)}`;

export function buildSnapshot(cloud: CloudData): CloudSnapshot {
  return {
    products: new Map(cloud.products.map((p) => [p.id, productSig(p)])),
    stock: new Map(cloud.stock.map((s) => [stockKey(s), stockSig(s)])),
  };
}

export async function hasCloudSession(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data?.session);
}

async function fetchAll(table: string, columns: string): Promise<any[] | null> {
  const rows: any[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await (supabase!.from(table as any) as any)
      .select(columns)
      .order(table === 'app_products' ? 'id' : 'product_id')
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      console.warn(`Cloud sync: reading ${table} failed`, error.message);
      return null;
    }
    rows.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
}

// Returns null when the cloud can't be read (not configured, signed out, tables missing).
export async function fetchCloud(): Promise<CloudData | null> {
  if (!(await hasCloudSession())) return null;
  const [productRows, stockRows] = await Promise.all([
    fetchAll('app_products', 'id, data'),
    fetchAll('app_stock', 'id, product_id, warehouse_id, quantity, updated_at'),
  ]);
  if (!productRows || !stockRows) return null;
  return {
    products: productRows.map((r) => ({ ...r.data, id: r.id })),
    stock: stockRows.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      warehouse_id: r.warehouse_id,
      quantity: Number(r.quantity),
      updated_at: r.updated_at,
    })),
  };
}

export function loadKnownIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KNOWN_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function rememberKnownIds(ids: string[]) {
  try {
    const known = loadKnownIds();
    ids.forEach((id) => known.add(id));
    localStorage.setItem(KNOWN_IDS_KEY, JSON.stringify(Array.from(known)));
  } catch {}
}

// A local product missing from a non-empty cloud was deleted on another device
// if this browser saw it in the cloud before, or it is part of the built-in catalog
// (which the first upload always carries). Anything else is new and gets uploaded.
function isDeletedElsewhere(id: string, cloudIds: Set<string>, known: Set<string>) {
  return cloudIds.size > 0 && !cloudIds.has(id) && (known.has(id) || BASELINE_PRODUCT_IDS.has(id));
}

export function mergeProducts(
  local: Product[],
  cloud: CloudData,
  known: Set<string>,
  snapshot: CloudSnapshot | null
): Product[] {
  const cloudById = new Map(cloud.products.map((p) => [p.id, p]));
  const cloudIds = new Set(cloudById.keys());
  const seen = new Set<string>();
  const kept: Product[] = [];

  for (const p of local) {
    const remote = cloudById.get(p.id);
    if (remote && !seen.has(p.id)) {
      seen.add(p.id);
      // Keep an edit made here that hasn't reached the cloud yet.
      const unsynced = snapshot?.products.has(p.id) && snapshot.products.get(p.id) !== productSig(p);
      kept.push(unsynced ? p : remote);
      continue;
    }
    if (isDeletedElsewhere(p.id, cloudIds, known)) continue;
    kept.push(p);
  }

  const cloudOnly = cloud.products
    .filter((p) => !seen.has(p.id))
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return [...cloudOnly, ...kept];
}

export function mergeStock(local: StockBalance[], cloud: CloudData, known: Set<string>): StockBalance[] {
  const cloudByKey = new Map(cloud.stock.map((s) => [stockKey(s), s]));
  const cloudIds = new Set(cloud.products.map((p) => p.id));
  const used = new Set<string>();
  const merged: StockBalance[] = [];

  for (const s of local) {
    if (isDeletedElsewhere(s.product_id, cloudIds, known)) continue;
    const key = stockKey(s);
    const remote = cloudByKey.get(key);
    if (remote && !used.has(key)) {
      used.add(key);
      // The most recently changed balance wins.
      const localTime = Date.parse(s.updated_at) || 0;
      const remoteTime = Date.parse(remote.updated_at) || 0;
      merged.push(localTime > remoteTime ? s : remote);
      continue;
    }
    merged.push(s);
  }

  for (const s of cloud.stock) {
    if (!used.has(stockKey(s))) merged.push(s);
  }
  return merged;
}

async function inChunks<T>(items: T[], write: (chunk: T[]) => Promise<{ error: any }>) {
  for (let i = 0; i < items.length; i += WRITE_CHUNK) {
    const { error } = await write(items.slice(i, i + WRITE_CHUNK));
    if (error) throw error;
  }
}

// Uploads what changed since the snapshot and updates the snapshot in place.
// Returns the product ids now known to be in the cloud.
export async function pushChanges(
  products: Product[],
  stock: StockBalance[],
  snapshot: CloudSnapshot
): Promise<string[]> {
  if (!supabase) return [];
  const now = new Date().toISOString();

  const productIds = new Set(products.map((p) => p.id));
  const changedProducts = products.filter((p) => snapshot.products.get(p.id) !== productSig(p));
  const removedProductIds = Array.from(snapshot.products.keys()).filter((id) => !productIds.has(id));

  const firstByKey = new Map<string, StockBalance>();
  for (const s of stock) {
    if (productIds.has(s.product_id) && !firstByKey.has(stockKey(s))) firstByKey.set(stockKey(s), s);
  }
  const changedStock = Array.from(firstByKey.values()).filter(
    (s) => snapshot.stock.get(stockKey(s)) !== stockSig(s)
  );
  const removedStockKeys = Array.from(snapshot.stock.keys()).filter((k) => !firstByKey.has(k));

  if (changedProducts.length > 0) {
    await inChunks(changedProducts, (chunk) =>
      (supabase!.from('app_products' as any) as any).upsert(
        chunk.map((p) => ({ id: p.id, data: p, updated_at: now })),
        { onConflict: 'id' }
      )
    );
    changedProducts.forEach((p) => snapshot.products.set(p.id, productSig(p)));
  }

  if (changedStock.length > 0) {
    await inChunks(changedStock, (chunk) =>
      (supabase!.from('app_stock' as any) as any).upsert(
        chunk.map((s) => ({
          product_id: s.product_id,
          warehouse_id: s.warehouse_id,
          id: s.id,
          quantity: Number(s.quantity),
          updated_at: now,
        })),
        { onConflict: 'product_id,warehouse_id' }
      )
    );
    changedStock.forEach((s) => snapshot.stock.set(stockKey(s), stockSig(s)));
  }

  for (const key of removedStockKeys) {
    const [product_id, warehouse_id] = key.split('|');
    const { error } = await (supabase.from('app_stock' as any) as any)
      .delete()
      .eq('product_id', product_id)
      .eq('warehouse_id', warehouse_id);
    if (error) throw error;
    snapshot.stock.delete(key);
  }

  if (removedProductIds.length > 0) {
    await inChunks(removedProductIds, (chunk) =>
      (supabase!.from('app_products' as any) as any).delete().in('id', chunk)
    );
    removedProductIds.forEach((id) => snapshot.products.delete(id));
  }

  return changedProducts.map((p) => p.id);
}
