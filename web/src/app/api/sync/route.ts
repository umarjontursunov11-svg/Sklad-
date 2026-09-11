import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_STOCK, INITIAL_MOVEMENTS, INITIAL_INVOICES, INITIAL_CORRECTIONS, INITIAL_LOGIN_LOGS } from '@/lib/mock-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function getInitialData() {
  return {
    users: INITIAL_USERS,
    products: INITIAL_PRODUCTS,
    stock: INITIAL_STOCK,
    movements: INITIAL_MOVEMENTS,
    invoices: INITIAL_INVOICES,
    corrections: INITIAL_CORRECTIONS,
    loginLogs: INITIAL_LOGIN_LOGS,
    updatedAt: new Date().toISOString(),
  };
}

function readStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading store.json:', e);
    return getInitialData();
  }
}

function writeStore(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing store.json:', e);
  }
}

export async function GET() {
  const store = readStore();
  return NextResponse.json(store);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = readStore();

    if (body.action === 'register_user' && body.user) {
      const existing = store.users.find((u: any) => u.username?.toLowerCase() === body.user.username?.toLowerCase());
      if (!existing) {
        store.users.push(body.user);
      } else {
        store.users = store.users.map((u: any) => u.username?.toLowerCase() === body.user.username?.toLowerCase() ? body.user : u);
      }
      store.updatedAt = new Date().toISOString();
      writeStore(store);
      return NextResponse.json({ success: true, store });
    }

    if (body.action === 'update_user' && body.user) {
      store.users = store.users.map((u: any) => u.id === body.user.id ? body.user : u);
      store.updatedAt = new Date().toISOString();
      writeStore(store);
      return NextResponse.json({ success: true, store });
    }

    if (body.action === 'sync_all' && body.data) {
      if (Array.isArray(body.data.users) && body.data.users.length > 0) store.users = body.data.users;
      if (Array.isArray(body.data.products)) store.products = body.data.products;
      if (Array.isArray(body.data.stock)) store.stock = body.data.stock;
      if (Array.isArray(body.data.movements)) store.movements = body.data.movements;
      if (Array.isArray(body.data.invoices)) store.invoices = body.data.invoices;
      if (Array.isArray(body.data.corrections)) store.corrections = body.data.corrections;
      if (Array.isArray(body.data.loginLogs)) store.loginLogs = body.data.loginLogs;
      store.updatedAt = new Date().toISOString();
      writeStore(store);
      return NextResponse.json({ success: true, store });
    }

    if (Array.isArray(body.users)) {
      store.users = body.users;
      if (Array.isArray(body.products)) store.products = body.products;
      if (Array.isArray(body.stock)) store.stock = body.stock;
      if (Array.isArray(body.movements)) store.movements = body.movements;
      if (Array.isArray(body.invoices)) store.invoices = body.invoices;
      if (Array.isArray(body.corrections)) store.corrections = body.corrections;
      if (Array.isArray(body.loginLogs)) store.loginLogs = body.loginLogs;
      store.updatedAt = new Date().toISOString();
      writeStore(store);
      return NextResponse.json({ success: true, store });
    }

    return NextResponse.json({ success: true, store });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
