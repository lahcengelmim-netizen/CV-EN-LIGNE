import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Helper to get privileged Supabase Admin client
 */
function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase Service Role Key is missing on the server. Please set SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * GET /api/admin/stats
 * Secure Admin Endpoint for Live Traffic, Account Management, and Activity Feed
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const adminToken = req.headers.get('x-admin-token');

    // 1. Authorization Verification (Service Key or Bearer Token)
    let token: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (adminToken) {
      token = adminToken;
    }

    const supabaseAdmin = getSupabaseAdmin();

    if (token && token !== SUPABASE_SERVICE_ROLE_KEY) {
      // Verify token belongs to an admin user
      const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
      if (authErr || !user) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid authentication credentials.' },
          { status: 401 }
        );
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Super Admin privileges required.' },
          { status: 403 }
        );
      }
    }

    // 2. Compute Real-time Visitors Threshold (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    // Query 1: All registered profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, first_name, last_name, role, current_page, last_active_at, created_at')
      .order('last_active_at', { ascending: false });

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // Process accounts and online/offline status
    const accounts = (profiles || []).map((p) => {
      const isOnline = p.last_active_at && new Date(p.last_active_at).getTime() >= Date.now() - 5 * 60 * 1000;
      return {
        id: p.id,
        email: p.email,
        name: [p.first_name, p.last_name].filter(Boolean).join(' ') || p.email.split('@')[0],
        role: p.role || 'user',
        currentPage: p.current_page || '/',
        lastActiveAt: p.last_active_at || p.created_at,
        status: isOnline ? 'Online' : 'Offline',
      };
    });

    const activeVisitorsCount = accounts.filter((a) => a.status === 'Online').length;

    // Query 2: Recent User Activity Feed
    const { data: activities, error: activitiesError } = await supabaseAdmin
      .from('user_activities')
      .select('id, user_id, user_email, action, details, page, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (activitiesError) {
      console.warn('Could not query user_activities table:', activitiesError.message);
    }

    // Query 3: Aggregated Metrics
    const totalUsers = accounts.length;
    const adminUsersCount = accounts.filter((a) => a.role === 'admin').length;
    const regularUsersCount = totalUsers - adminUsersCount;

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        stats: {
          activeVisitors5Min: activeVisitorsCount,
          totalAccounts: totalUsers,
          adminCount: adminUsersCount,
          userCount: regularUsersCount,
        },
        accounts,
        recentActivities: activities || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [API /api/admin/stats] Server Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'An unexpected error occurred while fetching admin statistics.',
      },
      { status: 500 }
    );
  }
}
