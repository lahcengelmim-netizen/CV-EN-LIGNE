'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  LogOut, 
  RefreshCw, 
  Radio, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Globe, 
  Shield, 
  Search,
  Eye,
  UserCheck
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

interface AdminStats {
  activeVisitors5Min: number;
  totalAccounts: number;
  adminCount: number;
  userCount: number;
}

interface AccountItem {
  id: string;
  email: string;
  name: string;
  role: string;
  currentPage: string;
  lastActiveAt: string;
  status: 'Online' | 'Offline';
}

interface ActivityItem {
  id: string;
  user_email: string;
  action: string;
  details: any;
  page?: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    activeVisitors5Min: 0,
    totalAccounts: 0,
    adminCount: 0,
    userCount: 0,
  });
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'admins'>('all');

  // Fetch admin statistics from secure API
  const fetchDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Get access token from active Supabase session
      let token = '';
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || '';
      }

      // 2. Call admin API route
      const response = await fetch('/api/admin/stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/admin/login?error=session_expired';
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setAccounts(data.accounts || []);
        setActivities(data.recentActivities || []);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Real-time polling: auto-refresh every 8 seconds
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 8000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handle Admin Logout
  const handleLogout = async () => {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await supabase.auth.signOut();
    }
    window.location.href = '/admin/login';
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          account.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'online') return matchesSearch && account.status === 'Online';
    if (activeTab === 'admins') return matchesSearch && account.role === 'admin';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Isolated Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 shadow-md shadow-rose-900/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white tracking-wider">SIRATI-Ai ADMIN</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Isolated Control & Live Sync</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-Refresh Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live (8s)</span>
              {lastUpdated && <span className="text-slate-500">• {lastUpdated}</span>}
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Real-time Live Visitors */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Traffic (5 min)</span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.activeVisitors5Min}</span>
              <span className="text-xs text-emerald-400 font-medium">active visitors now</span>
            </div>
          </div>

          {/* Card 2: Total Accounts */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Registered Accounts</span>
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.totalAccounts}</span>
              <span className="text-xs text-slate-400">total accounts</span>
            </div>
          </div>

          {/* Card 3: Standard Users */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Standard Users</span>
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.userCount}</span>
              <span className="text-xs text-slate-400">members</span>
            </div>
          </div>

          {/* Card 4: Admins */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Administrators</span>
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats.adminCount}</span>
              <span className="text-xs text-rose-400 font-medium">cleared</span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Accounts Management & Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 & 2: Account Management Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Account Management</span>
                </h3>
                <p className="text-xs text-slate-400">Synced directly with Supabase Profiles</p>
              </div>

              {/* Search & Tabs */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search accounts..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 w-44"
                  />
                </div>

                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTab === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('online')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTab === 'online' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setActiveTab('admins')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${activeTab === 'admins' ? 'bg-rose-500/20 text-rose-400 font-medium' : 'text-slate-400 hover:text-white'}`}
                  >
                    Admins
                  </button>
                </div>
              </div>
            </div>

            {/* Accounts Table Container */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">User & Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Current Page</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                          Loading accounts from Supabase...
                        </td>
                      </tr>
                    ) : filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                          No registered accounts match your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((account) => (
                        <tr key={account.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-sans font-medium text-white">{account.name}</div>
                            <div className="text-[11px] text-slate-400">{account.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            {account.status === 'Online' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                Offline
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                              <Globe className="w-3 h-3 text-slate-500" />
                              {account.currentPage || '/'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {account.role === 'admin' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                ADMIN
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                                USER
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[11px] text-slate-400">
                            {account.lastActiveAt ? new Date(account.lastActiveAt).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 3: Real-time User Activity Feed */}
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Activity Feed</span>
                </h3>
                <p className="text-xs text-slate-400">Live user event stream</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl max-h-[640px] overflow-y-auto space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading activities...</div>
              ) : activities.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No activity recorded yet. User actions (CV generated, PDF exported, login) will show here in real-time.
                </div>
              ) : (
                activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 mt-0.5">
                      {act.action.includes('export') || act.action.includes('pdf') ? (
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                      ) : act.action.includes('login') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : act.action.includes('view') ? (
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-white truncate">
                          {act.user_email || 'Guest User'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {new Date(act.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 font-mono">
                        {act.action.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      {act.page && (
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          on {act.page}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
