import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept requests to /admin and subpaths
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If Supabase environment is missing, immediately deny admin access
    if (!supabaseUrl || !supabaseAnonKey) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('unauthorized', 'admin_route_restricted');
      return NextResponse.redirect(redirectUrl, 307);
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Cryptographically verify session token via Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Reject unauthenticated requests or invalid/spoofed sessions immediately
    if (authError || !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('unauthorized', 'admin_route_restricted');
      return NextResponse.redirect(redirectUrl, 307);
    }

    // Query user's real role from the database
    const { data: profile } = await supabase
      .from('users')
      .select('id, role_id, roles(name)')
      .eq('id', user.id)
      .maybeSingle();

    // Only the database role counts: user_metadata can be edited by the user themself.
    const verifiedRole = (profile as any)?.roles?.name;

    // Strict check: User must have verified 'admin' role in database
    if (verifiedRole !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('unauthorized', 'admin_route_restricted');
      return NextResponse.redirect(redirectUrl, 307);
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
