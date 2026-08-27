import React, { useState, useEffect } from 'react';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminUsersView } from './AdminUsersView';
import { AdminCVsView } from './AdminCVsView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { AdminRevenueView } from './AdminRevenueView';
import { AdminAIView } from './AdminAIView';
import { AdminTemplatesView } from './AdminTemplatesView';
import { AdminMessagesView } from './AdminMessagesView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminLoginModal } from './AdminLoginModal';
import { adminService } from '../../lib/adminService';
import { AdminStats } from '../../types';

interface AdminPortalProps {
  onBackToSite: () => void;
  currentUser: any;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToSite, currentUser }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Check admin session on mount
  useEffect(() => {
    const checkAdmin = async () => {
      const storedToken = adminService.getStoredToken();
      const storedEmail = adminService.getStoredAdminEmail();
      const userEmail = currentUser?.email || storedEmail;

      if (storedToken || (userEmail && adminService.isAdminEmail(userEmail))) {
        setIsAuthenticated(true);
        loadStats();
      } else {
        setIsAuthenticated(false);
        setShowLoginModal(true);
      }
      setCheckingAuth(false);
    };

    checkAdmin();
  }, [currentUser]);

  const loadStats = async () => {
    const data = await adminService.getStats();
    if (data) {
      setStats(data);
    }
    const msgs = await adminService.getMessages('all');
    if (msgs?.counts) {
      setUnreadCount(msgs.counts.nouveau);
    }
  };

  const handleLogout = () => {
    adminService.clearAdminSession();
    setIsAuthenticated(false);
    onBackToSite();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Vérification des droits d'administration...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <AdminLoginModal
          isOpen={true}
          onClose={onBackToSite}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            loadStats();
          }}
        />
      </div>
    );
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onBackToSite={onBackToSite}
      onLogout={handleLogout}
      unreadMessagesCount={unreadCount}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboardView stats={stats} onNavigate={setCurrentTab} />
      )}
      {currentTab === 'users' && <AdminUsersView />}
      {currentTab === 'cvs' && <AdminCVsView />}
      {currentTab === 'payments' && <AdminPaymentsView />}
      {currentTab === 'revenue' && <AdminRevenueView />}
      {currentTab === 'ai' && <AdminAIView />}
      {currentTab === 'templates' && <AdminTemplatesView />}
      {currentTab === 'messages' && <AdminMessagesView />}
      {currentTab === 'settings' && <AdminSettingsView />}
    </AdminLayout>
  );
};
