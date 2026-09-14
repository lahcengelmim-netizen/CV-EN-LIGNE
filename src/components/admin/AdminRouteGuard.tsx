import React, { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { AdminLoginModal } from './AdminLoginModal';
import { IsolatedAdminDashboard } from './IsolatedAdminDashboard';
import { NotFoundPage } from '../common/NotFoundPage';

interface AdminRouteGuardProps {
  onBackToSite: () => void;
  currentUser?: any;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  onBackToSite,
  currentUser,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');

  // Strict verification of stored cryptographic admin session
  useEffect(() => {
    const verifySession = async () => {
      setCheckingAuth(true);
      const token = adminService.getStoredToken();
      const storedEmail = adminService.getStoredAdminEmail();

      if (token) {
        try {
          const stats = await adminService.getStats();
          if (stats) {
            setIsAuthenticated(true);
            setAdminEmail(storedEmail || 'Administrateur');
          } else {
            // Token expired or invalid
            adminService.clearAdminSession();
            setIsAuthenticated(false);
          }
        } catch {
          adminService.clearAdminSession();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    };

    verifySession();
  }, [currentUser]);

  const handleLogout = () => {
    adminService.clearAdminSession();
    setIsAuthenticated(false);
    onBackToSite();
  };

  // 1. Loading state (neutral spinner)
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wide font-mono">
            Vérification des autorisations...
          </span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated / Non-Admin: Render realistic 404 without revealing route existence
  if (!isAuthenticated) {
    return (
      <>
        <NotFoundPage
          onGoHome={onBackToSite}
          onUnlockAdmin={() => setShowLoginModal(true)}
          isObfuscatedAdminRoute={true}
        />

        {/* High-Security Modal Challenge triggered strictly via secret gesture or direct admin intent */}
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowLoginModal(false);
            const email = adminService.getStoredAdminEmail() || 'Administrateur';
            setAdminEmail(email);
          }}
        />
      </>
    );
  }

  // 3. Authenticated: Render the isolated admin dashboard
  return (
    <IsolatedAdminDashboard
      onLogout={handleLogout}
      adminEmail={adminEmail}
    />
  );
};

export default AdminRouteGuard;
