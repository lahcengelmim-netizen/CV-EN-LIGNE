import { PassType, UserPassState } from '../types';

const LOCAL_STORAGE_PASS_KEY = 'cvenligne_active_user_pass_v1';

export const DEFAULT_PASS_STATE: UserPassState = {
  activePass: 'free',
  downloadCredits: 999999,
  passExpiresAt: null,
  unlockedCoverLetters: true,
  totalDownloads: 0,
  isUnlimited: true,
  canDownload: true,
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
   * Evaluate if a pass is still valid - during the Free Test Phase, all passes are 100% free, active, and unlimited
   */
  evaluatePassValidity(pass: UserPassState): UserPassState {
    return {
      ...pass,
      activePass: 'free',
      downloadCredits: 999999,
      isUnlimited: true,
      canDownload: true,
      unlockedCoverLetters: true,
      canEdit: true
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
   * Consume download credit - in Free Test Phase, all downloads are 100% free and unlimited
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

    // Call backend consumer to notify and track download
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
      console.warn('Backend consume-download notification error (harmless in free mode):', err);
    }

    const updated = this.saveLocalPass({
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
};
