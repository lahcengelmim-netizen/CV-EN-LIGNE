// Real-time user activity tracker client
export interface ActivityUser {
  userId: string;
  email?: string;
  userEmail?: string;
  name?: string;
  userName?: string;
  role: string;
}

class ActivityTracker {
  private timer: any = null;
  private lastAction: string = 'En ligne';
  private debounceTimer: any = null;
  private isInitialized = false;
  private customUser: ActivityUser | null = null;

  public init(initialUser?: Partial<ActivityUser>) {
    if (initialUser) {
      this.updateUser(initialUser);
    }

    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Send initial heartbeat
    this.sendHeartbeat(window.location.pathname, 'Visite du site', 'Connexion active');

    // Re-send heartbeat on window focus
    window.addEventListener('focus', () => {
      this.sendHeartbeat(undefined, 'Retour sur l\'onglet', 'Actif sur l\'onglet');
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.sendHeartbeat(undefined, 'Session active', 'Navigation active');
      }
    });

    // Auto periodic heartbeat every 15 seconds
    this.timer = setInterval(() => {
      this.sendHeartbeat();
    }, 15000);
  }

  public updateUser(user: Partial<ActivityUser>) {
    const prev = this.customUser || this.getCurrentUser();
    const effectiveEmail = user.userEmail !== undefined ? user.userEmail : (user.email !== undefined ? user.email : prev.email);
    const effectiveName = user.userName || user.name || prev.name || 'Utilisateur';
    this.customUser = {
      userId: user.userId || prev.userId,
      email: effectiveEmail,
      userEmail: effectiveEmail,
      name: effectiveName,
      userName: effectiveName,
      role: user.role || prev.role
    };
  }

  public getCurrentUser(): ActivityUser {
    if (this.customUser) {
      return this.customUser;
    }

    if (typeof window === 'undefined') {
      return { userId: 'gst_anon', name: 'Visiteur', role: 'guest' };
    }

    try {
      const adminEmail = localStorage.getItem('cvenligne_admin_email');
      const adminToken = localStorage.getItem('cvenligne_admin_token');
      if (adminEmail && adminToken) {
        return {
          userId: 'usr_admin_1',
          email: adminEmail,
          name: 'Lahcen Gelmim (Admin)',
          role: 'admin'
        };
      }

      const storedUser = localStorage.getItem('cvenligne_current_user') || localStorage.getItem('cvenligne_user') || localStorage.getItem('supabase.auth.token');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const email = parsed.email || parsed.user?.email;
        const name = parsed.user_metadata?.full_name || (parsed.firstName ? `${parsed.firstName} ${parsed.lastName || ''}`.trim() : (email ? email.split('@')[0] : 'Utilisateur'));
        return {
          userId: parsed.id || parsed.user?.id || 'usr_' + Math.random().toString(36).substring(2, 8),
          email,
          name,
          role: 'user'
        };
      }
    } catch {}

    return {
      userId: this.getGuestId(),
      name: 'Visiteur anonyme',
      role: 'guest'
    };
  }

  private getGuestId(): string {
    if (typeof window === 'undefined') return 'gst_server';
    let gid = localStorage.getItem('cvenligne_guest_id');
    if (!gid) {
      gid = 'gst_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('cvenligne_guest_id', gid);
    }
    return gid;
  }

  public async sendHeartbeat(pageOrAction?: string, actionOrDetails?: string, currentActionText?: string) {
    let page = typeof window !== 'undefined' ? window.location.pathname + (window.location.hash || '') : '/';
    let actionLabel = this.lastAction;

    if (pageOrAction && pageOrAction.startsWith('/')) {
      page = pageOrAction;
      if (currentActionText) {
        actionLabel = currentActionText;
      } else if (actionOrDetails) {
        actionLabel = actionOrDetails;
      }
    } else if (pageOrAction) {
      actionLabel = pageOrAction;
      if (actionOrDetails && actionOrDetails.startsWith('/')) {
        page = actionOrDetails;
      }
    }

    this.lastAction = actionLabel;
    const user = this.getCurrentUser();

    try {
      await fetch('/api/activity/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          userEmail: user.email,
          userName: user.name,
          role: user.role,
          currentAction: this.lastAction,
          page
        })
      });
    } catch {
      // Benign network silence in background
    }
  }

  public logEdit(actionLabel: string, details: string) {
    this.lastAction = actionLabel;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(async () => {
      const user = this.getCurrentUser();
      try {
        await fetch('/api/activity/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            userEmail: user.email,
            userName: user.name,
            action: 'cv_edit',
            actionLabel,
            details,
            status: 'info'
          })
        });
      } catch {}
    }, 1500);
  }

  public async logAction(action: string, actionLabel: string, details: string, status: 'success' | 'info' | 'warning' = 'info') {
    this.lastAction = actionLabel;
    const user = this.getCurrentUser();
    try {
      await fetch('/api/activity/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          userEmail: user.email,
          userName: user.name,
          action,
          actionLabel,
          details,
          status
        })
      });
    } catch {}
  }
}

export const activityTracker = new ActivityTracker();
