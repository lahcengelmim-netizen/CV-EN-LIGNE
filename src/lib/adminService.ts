import { AdminStats, AdminUser, AdminCV, AdminPayment, AdminMessage, AdminTemplateInfo, AdminSettings } from '../types';

const ADMIN_EMAIL = 'lahcengelmim@gmail.com';
const TOKEN_KEY = 'cvenligne_admin_token';
const ADMIN_EMAIL_KEY = 'cvenligne_admin_email';

export const adminService = {
  isAdminEmail(email?: string | null): boolean {
    if (!email) return false;
    return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredAdminEmail(): string | null {
    return localStorage.getItem(ADMIN_EMAIL_KEY);
  },

  setAdminSession(token: string, email: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
  },

  clearAdminSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_EMAIL_KEY);
  },

  getHeaders(): Record<string, string> {
    const token = this.getStoredToken() || '';
    const email = this.getStoredAdminEmail() || '';
    return {
      'Content-Type': 'application/json',
      'x-admin-email': email,
      'x-admin-token': token,
      'Authorization': `Bearer ${token}`
    };
  },

  async verifyAdmin(email: string, password?: string): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setAdminSession(data.token, email);
        return { success: true, token: data.token, user: data.user };
      }
      return { success: false, error: data.error || 'Identifiants administrateur non valides (mot de passe incorrect).' };
    } catch (err: any) {
      console.error('Admin authentication request error:', err);
      return { success: false, error: 'Connexion au serveur impossible. Veuillez vérifier votre connexion.' };
    }
  },

  async getStats(): Promise<AdminStats | null> {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      return null;
    }
  },

  async getUsers(params?: { search?: string; status?: string; plan?: string; page?: number; limit?: number }): Promise<{ users: AdminUser[]; total: number } | null> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      if (params?.plan) query.set('plan', params.plan);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`/api/admin/users?${query.toString()}`, {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { users: json.users, total: json.pagination.total };
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin users:', err);
      return null;
    }
  },

  async getCVs(params?: { search?: string; template?: string; status?: string }): Promise<AdminCV[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.template) query.set('template', params.template);
      if (params?.status) query.set('status', params.status);

      const res = await fetch(`/api/admin/cvs?${query.toString()}`, {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.cvs;
      }
      return [];
    } catch (err) {
      console.error('Error fetching admin cvs:', err);
      return [];
    }
  },

  async getPayments(params?: { search?: string; status?: string }): Promise<{ payments: AdminPayment[]; summary: any } | null> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);

      const res = await fetch(`/api/admin/payments?${query.toString()}`, {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { payments: json.payments, summary: json.summary };
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin payments:', err);
      return null;
    }
  },

  async getRevenue(): Promise<any | null> {
    try {
      const res = await fetch('/api/admin/revenue', {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin revenue:', err);
      return null;
    }
  },

  async getAIAnalytics(): Promise<any | null> {
    try {
      const res = await fetch('/api/admin/ai', {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin ai analytics:', err);
      return null;
    }
  },

  async getTemplates(): Promise<AdminTemplateInfo[]> {
    try {
      const res = await fetch('/api/admin/templates', {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.templates;
      }
      return [];
    } catch (err) {
      console.error('Error fetching admin templates:', err);
      return [];
    }
  },

  async toggleTemplate(templateId: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/templates/toggle', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ templateId })
      });
      const json = await res.json();
      return Boolean(res.ok && json.success);
    } catch (err) {
      console.error('Error toggling template:', err);
      return false;
    }
  },

  async getMessages(status: string = 'all'): Promise<{ messages: AdminMessage[]; counts: any } | null> {
    try {
      const res = await fetch(`/api/admin/messages?status=${status}`, {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { messages: json.messages, counts: json.counts };
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin messages:', err);
      return null;
    }
  },

  async updateMessage(id: string, status: string, notes?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, notes })
      });
      const json = await res.json();
      return Boolean(res.ok && json.success);
    } catch (err) {
      console.error('Error updating admin message:', err);
      return false;
    }
  },

  async replyMessage(id: string, replyContent: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ replyContent })
      });
      const json = await res.json();
      return Boolean(res.ok && json.success);
    } catch (err) {
      console.error('Error sending admin reply:', err);
      return false;
    }
  },

  async getSettings(): Promise<AdminSettings | null> {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: this.getHeaders()
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.settings;
      }
      return null;
    } catch (err) {
      console.error('Error fetching admin settings:', err);
      return null;
    }
  },

  async updateSettings(settings: Partial<AdminSettings>): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(settings)
      });
      const json = await res.json();
      return Boolean(res.ok && json.success);
    } catch (err) {
      console.error('Error updating admin settings:', err);
      return false;
    }
  },

  async resetStats(): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/admin/reset-stats', {
        method: 'POST',
        headers: this.getHeaders()
      });
      const json = await res.json();
      return { success: Boolean(res.ok && json.success), message: json.message };
    } catch (err) {
      console.error('Error resetting admin stats:', err);
      return { success: false, message: 'Erreur de connexion au serveur.' };
    }
  }
};
