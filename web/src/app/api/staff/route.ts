import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { INITIAL_USERS } from '@/lib/mock-data';
import { authenticateRequest, isAdminRole, sanitizeUser } from '@/lib/server-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Service role (secret) key only — never fall back to the public anon key.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const asUuid = (v: any) => (typeof v === 'string' && UUID_RE.test(v) ? v : null);

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

function readStoreUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { users: INITIAL_USERS, updatedAt: new Date().toISOString() };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return INITIAL_USERS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.users) ? parsed.users : INITIAL_USERS;
  } catch (e) {
    console.error('Error reading store.json in staff route:', e);
    return INITIAL_USERS;
  }
}

function writeStoreUser(newUser: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let storeData: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        storeData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      } catch (e) {}
    }
    if (!Array.isArray(storeData.users)) {
      storeData.users = INITIAL_USERS;
    }

    const key = (newUser.username || newUser.id || '').toLowerCase();
    const existingIndex = storeData.users.findIndex(
      (u: any) => (u.username || u.id || '').toLowerCase() === key || u.id === newUser.id
    );

    if (existingIndex >= 0) {
      storeData.users[existingIndex] = { ...storeData.users[existingIndex], ...newUser };
    } else {
      storeData.users.push(newUser);
    }
    storeData.updatedAt = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(storeData, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing store.json in staff route:', e);
  }
}

export async function GET(req: NextRequest) {
  // Staff names, emails and phones: signed-in staff only.
  const auth = await authenticateRequest(req);
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }
  try {
    let users = readStoreUsers();

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.from('users').select('*');
      if (!error && data && data.length > 0) {
        const userMap = new Map<string, any>();
        users.forEach((u: any) => userMap.set(u.username?.toLowerCase() || u.id, u));
        data.forEach((dbUser: any) => {
          const k = dbUser.username?.toLowerCase() || dbUser.id;
          const existing = userMap.get(k) || {};
          userMap.set(k, {
            ...existing,
            id: dbUser.id,
            name: dbUser.name || dbUser.full_name || existing.name,
            full_name: dbUser.full_name || dbUser.name || existing.full_name,
            username: dbUser.username || existing.username,
            email: dbUser.email || existing.email,
            phone: dbUser.phone || existing.phone,
            employee_id: dbUser.employee_id || existing.employee_id,
            role_id: dbUser.role_id || existing.role_id,
            assigned_warehouse_id: dbUser.assigned_warehouse_id || existing.assigned_warehouse_id,
            must_change_password: dbUser.must_change_password !== undefined ? dbUser.must_change_password : (existing.must_change_password ?? true),
          });
        });
        users = Array.from(userMap.values());
      }
    }

    return NextResponse.json({ success: true, users: users.map((u: any) => sanitizeUser(u)) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { action, user, password } = body;

    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'User email and payload required' }, { status: 400 });
    }

    const isAdmin = isAdminRole(auth.role);
    const isSelf = Boolean(auth.userId && user.id === auth.userId);

    // Only an admin may create users; a user may only update their own record.
    if (action === 'update_user' ? !(isAdmin || isSelf) : !isAdmin) {
      return NextResponse.json({ success: false, error: "Ruxsat yo'q." }, { status: 403 });
    }

    let authUserId = user.id;

    if (action === 'update_user') {
      if (supabaseAdmin && user.id) {
        try {
          await supabaseAdmin.from('users').update({
            must_change_password: user.must_change_password ?? false,
          }).eq('id', user.id);
        } catch (e) {}
      }
      // Non-admins cannot change their own role or warehouse through this route.
      const safeUser = isAdmin ? user : { id: user.id, email: user.email, must_change_password: user.must_change_password ?? false };
      writeStoreUser(sanitizeUser(safeUser));
      return NextResponse.json({ success: true, user: sanitizeUser(safeUser) });
    }

    const rawPassword = String(password || '');
    if (rawPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Parol kamida 8 belgidan iborat bo'lishi kerak." }, { status: 400 });
    }

    // 1. Create real Auth user in auth.users using Supabase Auth Admin API
    if (supabaseAdmin) {
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: rawPassword,
          email_confirm: true,
          user_metadata: {
            name: user.name || user.full_name,
            full_name: user.full_name || user.name,
            username: user.username,
            role: user.role,
            employee_id: user.employee_id,
            assigned_warehouse_id: user.assigned_warehouse_id,
          },
        });

        if (authError) {
          console.warn('Supabase Auth createUser warning:', authError.message);
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
          const existingAuthUser = existingUsers?.users?.find(
            (u) => u.email?.toLowerCase() === user.email.toLowerCase()
          );
          if (existingAuthUser) {
            authUserId = existingAuthUser.id;
            await supabaseAdmin.auth.admin.updateUserById(authUserId, { password: rawPassword });
          }
        } else if (authData?.user) {
          authUserId = authData.user.id;
        }

        // 2. Provision public.users linked directly to auth.users.id
        await supabaseAdmin.from('users').upsert({
          id: authUserId,
          name: user.name || user.full_name,
          full_name: user.full_name || user.name,
          username: user.username,
          email: user.email,
          phone: user.phone || null,
          employee_id: user.employee_id || null,
          role_id: asUuid(user.role_id) || '33333333-3333-3333-3333-333333333333',
          // The web app uses local ids like 'wh-main'; only real UUIDs fit this column.
          assigned_warehouse_id: asUuid(user.assigned_warehouse_id),
          must_change_password: user.must_change_password ?? true,
        });
      } catch (sbErr: any) {
        console.warn('Supabase admin provision error:', sbErr?.message);
      }
    }

    const finalUser = sanitizeUser({ ...user, id: authUserId });

    // 3. Fallback write to central file store (no password or hash is stored on the server)
    writeStoreUser(finalUser);

    return NextResponse.json({ success: true, user: finalUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
