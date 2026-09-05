import { PassType, UserPassState } from '../types';
import { ENABLE_PAYMENTS } from '../config/features';

const LOCAL_STORAGE_PASS_KEY = 'cvenligne_active_user_pass_v1';

export const DEFAULT_PASS_STATE: UserPassState = {
  activePass: ENABLE_PAYMENTS ? 'none' : 'free',
  downloadCredits: ENABLE_PAYMENTS ? 0 : 999999,
  passExpiresAt: null,
  unlockedCoverLetters: !ENABLE_PAYMENTS,
  totalDownloads: 0,
  isUnlimited: !ENABLE_PAYMENTS,
  canDownload: !ENABLE_PAYMENTS,
  canEdit: true
};

export const passService = {
  /**
   * Get current pass state from LocalStorage (synchronous)
   */
  getLocalPass(): UserPassState {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PASS_KEY);
      if (!stored) return { ...DEFAULT_PASS_STATE };

      const parsed: UserPassState = JSON.parse(stored);
      return this.evaluatePassValidity(parsed);
    } catch {
      return { ...DEFAULT_PASS_STATE };
    }
  },

  /**
   * Evaluate if a pass is still valid.
   * If ENABLE_PAYMENTS is false (Free Test Period), all users automatically receive unlimited free access.
   */
  evaluatePassValidity(pass: UserPassState): UserPassState {
    if (!ENABLE_PAYMENTS) {
      return {
        ...pass,
        activePass: 'free',
        downloadCredits: 999999,
        isUnlimited: true,
        canDownload: true,
        unlockedCoverLetters: true,
        canEdit: true
      };
    }

    const now = new Date().getTime();

    // Check expiration for time-limited passes
    if (['pro', 'monthly', 'yearly', 'annual'].includes(pass.activePass)) {
      if (pass.passExpiresAt) {
        const expiryTime = new Date(pass.passExpiresAt).getTime();
        if (now > expiryTime) {
          return {
            ...pass,
            activePass: 'none',
            downloadCredits: 0,
            unlockedCoverLetters: false,
            isUnlimited: false,
            canDownload: false,
            canEdit: true
          };
        }
      }
    }

    const isUnlimited = ['pro', 'monthly', 'yearly', 'annual'].includes(pass.activePass);
    const canDownload = isUnlimited || pass.downloadCredits >= 1;
    const canEdit = isUnlimited || pass.downloadCredits >= 1 || pass.activePass === 'none';

    return {
      ...pass,
      isUnlimited,
      canDownload,
      canEdit
    };
  },

  /**
   * Save pass state locally and optionally notify server
   */
  saveLocalPass(state: Partial<UserPassState>): UserPassState {
    const current = this.getLocalPass();
    const updated: UserPassState = this.evaluatePassValidity({
      ...current,
      ...state
    });

    try {
      localStorage.setItem(LOCAL_STORAGE_PASS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save pass to localStorage', e);
    }

    return updated;
  },

  /**
   * Fetch live pass status from backend server
   */
  async fetchServerPassStatus(userId?: string, userEmail?: string): Promise<UserPassState> {
    try {
      const res = await fetch('/api/user/pass-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userEmail })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.pass) {
          const validPass = this.evaluatePassValidity(data.pass);
          this.saveLocalPass(validPass);
          return validPass;
        }
      }
    } catch (err) {
      console.warn('Could not fetch pass from server, using local fallback:', err);
    }

    return this.getLocalPass();
  },

  /**
   * Activate pass after a successful purchase
   */
  activatePurchasedPass(planType: string, customData?: Partial<UserPassState>): UserPassState {
    const now = new Date();
    let newPass: Partial<UserPassState> = {};

    if (planType === 'flash' || planType === 'single_cv') {
      newPass = {
        activePass: 'flash',
        downloadCredits: 1,
        passExpiresAt: null,
        unlockedCoverLetters: false,
        isUnlimited: false,
        canDownload: true,
        canEdit: true
      };
    } else if (planType === 'pro') {
      const expiresAt = new Date(now.getTime() + 7 * 86400000).toISOString();
      newPass = {
        activePass: 'pro',
        downloadCredits: 999999,
        passExpiresAt: expiresAt,
        unlockedCoverLetters: true,
        isUnlimited: true,
        canDownload: true,
        canEdit: true
      };
    } else if (planType === 'monthly') {
      const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString();
      newPass = {
        activePass: 'monthly',
        downloadCredits: 999999,
        passExpiresAt: expiresAt,
        unlockedCoverLetters: true,
        isUnlimited: true,
        canDownload: true,
        canEdit: true
      };
    } else if (planType === 'yearly' || planType === 'annual') {
      const expiresAt = new Date(now.getTime() + 365 * 86400000).toISOString();
      newPass = {
        activePass: 'annual',
        downloadCredits: 999999,
        passExpiresAt: expiresAt,
        unlockedCoverLetters: true,
        isUnlimited: true,
        canDownload: true,
        canEdit: true
      };
    }

    return this.saveLocalPass({ ...newPass, ...customData });
  },

  /**
   * Consume download credit.
   * If ENABLE_PAYMENTS is false (Free Test Phase), all downloads are 100% free and unlimited.
   */
  async consumeDownload(params: {
    cvId?: string;
    userId?: string;
    userEmail?: string;
  }): Promise<{
    success: boolean;
    remainingCredits: number;
    activePass: PassType;
    error?: string;
    requirePass?: boolean;
  }> {
    const currentPass = this.getLocalPass();

    // 1-Month Free Test Period: unlimited free downloads
    if (!ENABLE_PAYMENTS) {
      try {
        await fetch('/api/user/consume-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cvId: params.cvId,
            userId: params.userId,
            userEmail: params.userEmail,
            currentPassType: 'free'
          })
        });
      } catch (err) {
        console.warn('Backend consume-download notification error:', err);
      }

      this.saveLocalPass({
        downloadCredits: 999999,
        activePass: 'free',
        isUnlimited: true,
        canDownload: true,
        canEdit: true,
        unlockedCoverLetters: true,
        totalDownloads: (currentPass.totalDownloads || 0) + 1
      });

      return {
        success: true,
        remainingCredits: 999999,
        activePass: 'free'
      };
    }

    // Normal Paid Mode: Check permissions
    if (!currentPass.canDownload && currentPass.downloadCredits <= 0 && !currentPass.isUnlimited) {
      return {
        success: false,
        remainingCredits: 0,
        activePass: currentPass.activePass,
        requirePass: true,
        error: 'Aucun crédit de téléchargement disponible.'
      };
    }

    try {
      const res = await fetch('/api/user/consume-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: params.cvId,
          userId: params.userId,
          userEmail: params.userEmail,
          currentPassType: currentPass.activePass
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          const newCredits = data.remainingCredits !== undefined ? data.remainingCredits : Math.max(0, currentPass.downloadCredits - 1);
          const newActivePass = data.activePass || (newCredits > 0 ? currentPass.activePass : 'none');
          
          this.saveLocalPass({
            downloadCredits: newCredits,
            activePass: newActivePass,
            canDownload: currentPass.isUnlimited || newCredits > 0,
            canEdit: currentPass.isUnlimited || newCredits > 0,
            totalDownloads: (currentPass.totalDownloads || 0) + 1
          });

          return {
            success: true,
            remainingCredits: newCredits,
            activePass: newActivePass
          };
        }
      }
    } catch (err) {
      console.warn('Backend consume-download error, falling back to local evaluation:', err);
    }

    // Local fallback when backend call fails
    const newCredits = currentPass.isUnlimited ? 999999 : Math.max(0, currentPass.downloadCredits - 1);
    const newActivePass = currentPass.isUnlimited ? currentPass.activePass : (newCredits > 0 ? currentPass.activePass : 'none');

    this.saveLocalPass({
      downloadCredits: newCredits,
      activePass: newActivePass,
      canDownload: currentPass.isUnlimited || newCredits > 0,
      canEdit: currentPass.isUnlimited || newCredits > 0,
      totalDownloads: (currentPass.totalDownloads || 0) + 1
    });

    return {
      success: true,
      remainingCredits: newCredits,
      activePass: newActivePass
    };
  }
};
