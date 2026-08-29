import { PassType, UserPassState } from '../types';

const LOCAL_STORAGE_PASS_KEY = 'cvenligne_active_user_pass_v1';

export const DEFAULT_PASS_STATE: UserPassState = {
  activePass: 'none',
  downloadCredits: 0,
  passExpiresAt: null,
  unlockedCoverLetters: false,
  totalDownloads: 0,
  isUnlimited: false,
  canDownload: false,
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
   * Evaluate if a pass is still valid based on expiration date or credits
   */
  evaluatePassValidity(pass: UserPassState): UserPassState {
    const now = new Date().getTime();

    // 1. Time-based passes (Pro 7 days, Monthly 30 days, Annual 365 days)
    if (['pro', 'monthly', 'yearly', 'annual'].includes(pass.activePass)) {
      if (pass.passExpiresAt) {
        const expiryTime = new Date(pass.passExpiresAt).getTime();
        if (now > expiryTime) {
          // Pass has expired
          return {
            ...pass,
            activePass: 'none',
            downloadCredits: 0,
            isUnlimited: false,
            canDownload: false,
            unlockedCoverLetters: false,
            canEdit: true
          };
        }
      }
      // Valid unlimited pass
      return {
        ...pass,
        isUnlimited: true,
        canDownload: true,
        unlockedCoverLetters: true,
        canEdit: true
      };
    }

    // 2. Pass Flash ($1.99 - Single Purchase - 1 Download Credit)
    if (pass.activePass === 'flash' || pass.activePass === 'single_cv') {
      const hasCredit = (pass.downloadCredits || 0) >= 1;
      return {
        ...pass,
        activePass: 'flash',
        isUnlimited: false,
        canDownload: hasCredit,
        unlockedCoverLetters: false,
        canEdit: hasCredit // Once consumed (0 credit), edits are locked without a new pass
      };
    }

    // 3. No pass
    return {
      ...pass,
      activePass: 'none',
      downloadCredits: 0,
      isUnlimited: false,
      canDownload: false,
      unlockedCoverLetters: false,
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
   * Consume download credit (e.g. Flash Pass 1 -> 0, or Unlimited + 1 count)
   * Enforces backend decrement and database persistence
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

    // 1. Initial check
    if (!currentPass.canDownload && currentPass.downloadCredits <= 0 && !currentPass.isUnlimited) {
      return {
        success: false,
        remainingCredits: 0,
        activePass: 'none',
        requirePass: true,
        error: currentPass.activePass === 'flash'
          ? 'Votre crédit de téléchargement Pass Flash a été utilisé. Achetez un nouveau pass pour continuer.'
          : 'Aucun pass actif. Veuillez choisir un pass pour télécharger votre CV.'
      };
    }

    // 2. Call backend consumer
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

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          remainingCredits: data.remainingCredits || 0,
          activePass: data.activePass || 'none',
          requirePass: data.requirePass || true,
          error: data.error || 'Impossible de valider le téléchargement.'
        };
      }

      // Update local pass from server response
      const updated = this.saveLocalPass({
        downloadCredits: data.remainingCredits,
        activePass: data.activePass,
        totalDownloads: (currentPass.totalDownloads || 0) + 1,
        canEdit: data.canEdit ?? (data.remainingCredits > 0 || currentPass.isUnlimited)
      });

      return {
        success: true,
        remainingCredits: updated.downloadCredits,
        activePass: updated.activePass
      };
    } catch (err) {
      console.warn('Backend download consume failed, applying client fallback decrement:', err);
      
      // Resilient fallback decrement for Flash Pass
      if (currentPass.activePass === 'flash' || currentPass.activePass === 'single_cv') {
        const remaining = Math.max(0, currentPass.downloadCredits - 1);
        const updated = this.saveLocalPass({
          downloadCredits: remaining,
          activePass: remaining > 0 ? 'flash' : 'none',
          canDownload: remaining > 0,
          canEdit: remaining > 0,
          totalDownloads: (currentPass.totalDownloads || 0) + 1
        });
        return {
          success: true,
          remainingCredits: updated.downloadCredits,
          activePass: updated.activePass
        };
      }

      return {
        success: true,
        remainingCredits: currentPass.downloadCredits,
        activePass: currentPass.activePass
      };
    }
  }
};
