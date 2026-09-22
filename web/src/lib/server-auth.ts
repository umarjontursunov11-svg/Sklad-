// Server-side request authentication for Next.js API routes.
// The browser sends the Supabase access token as "Authorization: Bearer <token>".
// The token is verified with Supabase Auth, and the caller's role is read
// from public.users (RLS lets every user read their own row).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
    anonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl !== 'https://your-project-id.supabase.co'
);

// Local mode (no Supabase) is allowed only on a developer machine.
export const isLocalDevMode = !isServerSupabaseConfigured && process.env.NODE_ENV !== 'production';

export type AuthResult =
  | { ok: true; userId: string | null; role: string | null; devMode: boolean }
  | { ok: false; status: number; error: string };

export async function authenticateRequest(req: Request): Promise<AuthResult> {
  if (isLocalDevMode) {
    return { ok: true, userId: null, role: 'admin', devMode: true };
  }
  if (!isServerSupabaseConfigured) {
    return { ok: false, status: 503, error: 'Server autentifikatsiyasi sozlanmagan.' };
  }

  const header = req.headers.get('authorization') || '';
  const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    return { ok: false, status: 401, error: 'Avtorizatsiya talab qilinadi.' };
  }

  const client = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: userError } = await client.auth.getUser(token);
  if (userError || !userData?.user) {
    return { ok: false, status: 401, error: 'Sessiya yaroqsiz yoki muddati tugagan.' };
  }

  const { data: profile } = await client
    .from('users')
    .select('id, roles(name)')
    .eq('id', userData.user.id)
    .maybeSingle();

  const roleName = (profile as any)?.roles?.name ?? null;
  return { ok: true, userId: userData.user.id, role: roleName, devMode: false };
}

export function isAdminRole(role: string | null) {
  return role === 'admin';
}

// Removes secret fields before user records leave the server.
export function sanitizeUser<T extends Record<string, any>>(u: T): Omit<T, 'password' | 'password_hash'> {
  if (!u || typeof u !== 'object') return u;
  const { password, password_hash, ...rest } = u as any;
  return rest;
}
