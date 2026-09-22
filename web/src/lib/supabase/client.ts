import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isPlaceholderUrl = (url: string): boolean => {
  if (!url) return true;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.includes('your-project') ||
    lower.includes('example.com') ||
    lower.includes('placeholder')
  ) {
    return true;
  }

  if (lower.startsWith('https://') && lower.includes('.supabase.co')) {
    const hostname = lower.replace('https://', '').split('/')[0];
    const projectRef = hostname.split('.')[0];
    return !projectRef || projectRef === 'your-project' || projectRef === 'your-project-id';
  }

  return true;
};

export const isPlaceholderKey = (key: string): boolean => {
  if (!key) return true;
  const trimmed = key.trim();
  const lower = trimmed.toLowerCase();

  // Explicit placeholder tokens
  if (
    lower.includes('your-anon-key') ||
    lower.includes('your-service-role-key') ||
    lower.includes('your-key') ||
    lower.includes('placeholder')
  ) {
    return true;
  }

  // Supabase modern API key format (sb_publishable_... and sb_secret_...)
  if (trimmed.startsWith('sb_publishable_') || trimmed.startsWith('sb_secret_')) {
    return trimmed.length < 20; // Valid new-format keys are legitimate
  }

  // Legacy Supabase JWT keys (eyJhbGciOi...)
  if (trimmed.startsWith('ey') && trimmed.length > 50) {
    return false;
  }

  return trimmed.length < 20;
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !isPlaceholderUrl(supabaseUrl) &&
  !isPlaceholderKey(supabaseAnonKey)
);

export const supabase = isSupabaseConfigured
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// JSON headers plus the current Supabase access token, for calls to our own /api routes.
export async function authJsonHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}
