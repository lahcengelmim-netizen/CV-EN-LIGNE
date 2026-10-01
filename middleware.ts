import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Next.js Edge Middleware for Admin Route Protection
 * Intercepts all requests matching /admin/*
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow public access to the admin login page and static assets
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  // 2. Extract Auth Token from Cookies or Authorization Header
  // Supabase standard cookies format: sb-[project-ref]-auth-token or sb-access-token
  let accessToken: string | null = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
  }

  if (!accessToken && req.cookies) {
    // Search cookies for supabase auth token
    for (const cookie of req.cookies.getAll ? req.cookies.getAll() : []) {
      if (cookie.name.includes('-auth-token') || cookie.name === 'sb-access-token') {
        try {
          const parsed = JSON.parse(cookie.value);
          accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token || cookie.value;
        } catch {
          accessToken = cookie.value;
        }
        break;
      }
    }
  }

  // 3. Fallback: If no token found, redirect immediately to /admin/login
  if (!accessToken) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  // 4. Verify Token & Role with Supabase
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
      });

      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

      if (userError || !user) {
        const loginUrl = new URL('/admin/login', req.nextUrl.origin);
        loginUrl.searchParams.set('error', 'invalid_session');
        return NextResponse.redirect(loginUrl);
      }

      // Check role in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const userRole = profile?.role || user.user_metadata?.role;

      if (userRole !== 'admin') {
        // Forbidden: Not an admin
        const forbiddenUrl = new URL('/admin/login', req.nextUrl.origin);
        forbiddenUrl.searchParams.set('error', 'forbidden_not_admin');
        return NextResponse.redirect(forbiddenUrl);
      }
    } catch (err) {
      console.error('[Middleware] Supabase auth verification failed:', err);
      const loginUrl = new URL('/admin/login', req.nextUrl.origin);
      loginUrl.searchParams.set('error', 'auth_error');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Authorized Super Admin -> Proceed
  return NextResponse.next();
}

/**
 * Configure matching paths
 */
export const config = {
  matcher: ['/admin/:path*'],
};
