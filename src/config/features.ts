/**
 * Global Feature Flags & Platform Configuration
 * 
 * 1-MONTH FREE TEST PERIOD TOGGLE:
 * Set ENABLE_PAYMENTS = false to make the entire platform 100% free:
 * - Automatically grants full premium access (unlimited HD PDF downloads, all templates, cover letters)
 * - Hides all pricing tables, upgrade buttons, checkout modals, and payment triggers across the UI
 * - Bypasses paywall checks so users are routed directly to downloads and creation
 * 
 * TO RE-ENABLE PAYMENTS:
 * Change ENABLE_PAYMENTS to true below, OR set VITE_ENABLE_PAYMENTS="true" in your environment variables.
 */
export const ENABLE_PAYMENTS: boolean = 
  import.meta.env.VITE_ENABLE_PAYMENTS === 'true';
