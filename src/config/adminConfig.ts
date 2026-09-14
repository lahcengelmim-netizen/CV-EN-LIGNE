/**
 * Secure Administrative Configuration
 * 
 * Defines the obfuscated administrative route and authentication session constants.
 * Security through obscurity combined with strict cryptographic Role-Based Access Control (RBAC).
 */

// Secret, non-standard route for administrative access (e.g. /app-control-panel-x97)
// Can be customized via environment variable VITE_ADMIN_SECRET_ROUTE
export const ADMIN_SECRET_ROUTE = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_SECRET_ROUTE) 
    ? import.meta.env.VITE_ADMIN_SECRET_ROUTE 
    : '/app-control-panel-x97';

export const ADMIN_STORAGE_KEYS = {
  TOKEN: 'cvenligne_admin_token',
  EMAIL: 'cvenligne_admin_email',
  SESSION_EXPIRY: 'cvenligne_admin_session_expiry',
} as const;

export const ADMIN_CONFIG = {
  secretRoute: ADMIN_SECRET_ROUTE,
  sessionDurationHours: 24,
  realtimeEndpoint: '/api/admin/realtime-stream',
  verifyEndpoint: '/api/admin/verify',
  simulateEndpoint: '/api/admin/simulate-event',
} as const;
