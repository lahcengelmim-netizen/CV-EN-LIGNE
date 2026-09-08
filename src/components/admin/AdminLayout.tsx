import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Sparkles,
  Palette,
  MessageSquare,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { adminService } from '../../lib/adminService';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'cvs'
  | 'payments'
  | 'revenue'
  | 'ai'
  | 'templates'
  | 'messages'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onBackToSite: () => void;
  onLogout: () => void;
  unreadMessagesCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onBackToSite,
  onLogout,
  unreadMessagesCount = 0,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const adminEmail = adminService.getStoredAdminEmail() || 'vitareysupport@gmail.com';

  const navItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
    { id: 'cvs', label: 'CVs Créés', icon: <FileText className="w-4 h-4" /> },
    { id: 'payments', label: 'Paiements', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenus & Ventes', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'ai', label: 'Utilisation IA', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'templates', label: 'Gestion Modèles', icon: <Palette className="w-4 h-4" /> },
    {
      id: 'messages',
      label: 'Support & Messages',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'settings', label: 'Paramètres', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white px-2 py-1 rounded-xl shadow-md inline-flex items-center">
              <img
                src="/images/logo.jpg"
                alt="VITAREY"
                className="h-6 sm:h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>

        {/* Center / Right: Quick Navigation & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to site button */}
          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retour au site public</span>
            <span className="sm:hidden">Site</span>
          </button>

          {/* Admin User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
                LG
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-semibold text-white truncate max-w-[120px]">
                  {adminEmail}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Super Admin
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">Compte Administrateur</p>
                  <p className="text-[11px] text-slate-400 truncate">{adminEmail}</p>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      onTabChange('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Paramètres du système</span>
                  </button>

                  <button
                    onClick={() => {
                      onBackToSite();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir l'application publique</span>
                  </button>
                </div>

                <div className="p-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 pt-16 lg:pt-0 lg:static lg:block transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-1.5">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu Principal
              </div>

              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom System Health Pill */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
                  <span>Serveur Express & IA</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Opérationnel
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Tarif Pass Flash : $1.99 USD</p>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Quitter l'administration</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
