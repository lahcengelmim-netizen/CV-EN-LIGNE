import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ServerUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  plan: 'free' | 'single_cv' | 'flash' | 'pro' | 'monthly' | 'yearly' | 'annual';
  activePass: 'none' | 'flash' | 'pro' | 'monthly' | 'annual' | 'single_cv' | 'yearly';
  downloadCredits: number;
  passExpiresAt?: string;
  totalDownloads: number;
  unlockedCoverLetters: boolean;
  canEdit: boolean;
  subscriptionStatus: 'none' | 'active' | 'expired' | 'trial';
  subscriptionStart?: string;
  subscriptionEnd?: string;
  cvCount: number;
  status: 'active' | 'suspended';
  role: 'user' | 'admin';
  lastLogin?: string;
}

export interface ServerPaymentRecord {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  cvId?: string;
  cvTitle?: string;
  planType: 'single_cv' | 'flash' | 'pro' | 'monthly' | 'yearly' | 'annual';
  planName: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  reference: string;
  createdAt: string;
  paymentMethod: string;
}

export interface ServerAILogRecord {
  id: string;
  endpoint: 'enhance-experience' | 'enhance-summary' | 'suggest-skills' | 'generate-cover-letter';
  userId: string;
  userEmail?: string;
  timestamp: string;
  success: boolean;
}

export interface ServerMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'nouveau' | 'lu' | 'traite';
  createdAt: string;
  repliedAt?: string;
  notes?: string;
}

export interface ServerCVRecord {
  id: string;
  userId: string;
  title: string;
  userName: string;
  userEmail: string;
  templateId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  downloadCount: number;
  cvData?: any;
}

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private users: ServerUserRecord[] = [];
  private payments: ServerPaymentRecord[] = [];
  private aiLogs: ServerAILogRecord[] = [];
  private messages: ServerMessageRecord[] = [];
  private cvs: ServerCVRecord[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initSupabaseClient();
  }

  private initSupabaseClient() {
    const rawUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
    const rawKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

    const isUrlValid = rawUrl.startsWith('http') && !rawUrl.includes('your-project') && !rawUrl.includes('placeholder');
    const isKeyValid = rawKey.length > 10 && rawKey !== 'your-anon-key' && rawKey !== 'your-service-role-key';

    if (isUrlValid && isKeyValid) {
      try {
        this.supabase = createClient(rawUrl, rawKey, {
          auth: { persistSession: false }
        });
        console.log('✅ [DATABASE] Supabase serveur connecté avec succès (' + rawUrl.split('//')[1]?.split('.')[0] + ')');
      } catch (err) {
        console.warn('⚠️ [DATABASE] Impossible d\'initialiser le client Supabase:', err);
        this.supabase = null;
      }
    } else {
      console.log('ℹ️ [DATABASE] Supabase non configuré ou clés génériques : persistance in-memory active.');
    }
  }

  public isSupabaseConnected(): boolean {
    return this.supabase !== null;
  }

  public async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.supabase) return;

    try {
      // 1. Charger les utilisateurs
      const { data: usersData, error: usersErr } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!usersErr && Array.isArray(usersData) && usersData.length > 0) {
        this.users = usersData.map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.first_name || '',
          lastName: u.last_name || '',
          createdAt: u.created_at || new Date().toISOString(),
          plan: u.plan || 'free',
          activePass: u.active_pass || 'none',
          downloadCredits: u.download_credits || 0,
          passExpiresAt: u.pass_expires_at,
          totalDownloads: u.total_downloads || 0,
          unlockedCoverLetters: Boolean(u.unlocked_cover_letters),
          canEdit: u.can_edit !== false,
          subscriptionStatus: u.subscription_status || 'none',
          subscriptionStart: u.subscription_start,
          subscriptionEnd: u.subscription_end,
          cvCount: u.cv_count || 0,
          status: u.status || 'active',
          role: u.role || 'user',
          lastLogin: u.last_login
        }));
        console.log(`📦 [DATABASE] ${this.users.length} utilisateur(s) chargés depuis Supabase.`);
      }

      // 2. Charger les paiements
      const { data: paymentsData, error: payErr } = await this.supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!payErr && Array.isArray(paymentsData) && paymentsData.length > 0) {
        this.payments = paymentsData.map(p => ({
          id: p.id,
          orderId: p.order_id,
          userId: p.user_id,
          userEmail: p.user_email,
          userName: p.user_name || '',
          cvId: p.cv_id,
          cvTitle: p.cv_title,
          planType: p.plan_type,
          planName: p.plan_name,
          amount: Number(p.amount) || 0,
          currency: p.currency || 'USD',
          status: p.status,
          reference: p.reference,
          createdAt: p.created_at,
          paymentMethod: p.payment_method || 'paypal'
        }));
        console.log(`📦 [DATABASE] ${this.payments.length} paiement(s) chargés depuis Supabase.`);
      }

      // 3. Charger les logs IA
      const { data: aiData, error: aiErr } = await this.supabase
        .from('ai_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(200);

      if (!aiErr && Array.isArray(aiData) && aiData.length > 0) {
        this.aiLogs = aiData.map(l => ({
          id: l.id,
          endpoint: l.endpoint,
          userId: l.user_id,
          userEmail: l.user_email,
          timestamp: l.timestamp,
          success: l.success !== false
        }));
        console.log(`📦 [DATABASE] ${this.aiLogs.length} log(s) IA chargés depuis Supabase.`);
      }

      // 4. Charger les messages
      const { data: msgData, error: msgErr } = await this.supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!msgErr && Array.isArray(msgData) && msgData.length > 0) {
        this.messages = msgData.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: m.status || 'nouveau',
          createdAt: m.created_at,
          repliedAt: m.replied_at,
          notes: m.notes
        }));
        console.log(`📦 [DATABASE] ${this.messages.length} message(s) chargés depuis Supabase.`);
      }

      // 5. Charger les CVs
      const { data: cvData, error: cvErr } = await this.supabase
        .from('cvs')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!cvErr && Array.isArray(cvData) && cvData.length > 0) {
        this.cvs = cvData.map(c => {
          const cvObj = c.cv_data || {};
          const pInfo = cvObj.personalInfo || {};
          return {
            id: c.id,
            userId: c.user_id,
            title: c.title || cvObj.title || 'Mon CV',
            userName: `${pInfo.firstName || ''} ${pInfo.lastName || ''}`.trim() || 'Utilisateur',
            userEmail: pInfo.email || '',
            templateId: c.template_id || cvObj.templateId || 'modern',
            status: c.is_paid ? 'payé' : 'brouillon',
            createdAt: c.created_at || cvObj.createdAt || new Date().toISOString(),
            updatedAt: c.updated_at || cvObj.updatedAt || new Date().toISOString(),
            isPaid: Boolean(c.is_paid),
            downloadCount: c.is_paid ? 1 : 0,
            cvData: cvObj
          };
        });
        console.log(`📦 [DATABASE] ${this.cvs.length} CV(s) chargés depuis Supabase.`);
      }
    } catch (err) {
      console.warn('⚠️ [DATABASE] Erreur lors de l\'hydratation initiale Supabase:', err);
    }
  }

  // --- USERS ---
  public getUsers(): ServerUserRecord[] {
    return this.users;
  }

  public findUser(predicate: (u: ServerUserRecord) => boolean): ServerUserRecord | undefined {
    return this.users.find(predicate);
  }

  public async upsertUser(user: ServerUserRecord): Promise<void> {
    const idx = this.users.findIndex(u => u.id === user.id || (u.email && u.email.toLowerCase() === user.email.toLowerCase()));
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user };
    } else {
      this.users.unshift(user);
    }

    if (this.supabase) {
      try {
        await this.supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          plan: user.plan,
          active_pass: user.activePass,
          download_credits: user.downloadCredits,
          pass_expires_at: user.passExpiresAt,
          total_downloads: user.totalDownloads,
          unlocked_cover_letters: user.unlockedCoverLetters,
          can_edit: user.canEdit,
          subscription_status: user.subscriptionStatus,
          subscription_start: user.subscriptionStart,
          subscription_end: user.subscriptionEnd,
          cv_count: user.cvCount,
          status: user.status,
          role: user.role,
          last_login: user.lastLogin,
          created_at: user.createdAt,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase upsert user error:', err);
      }
    }
  }

  public async updateUser(id: string, updates: Partial<ServerUserRecord>): Promise<ServerUserRecord | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;

    Object.assign(user, updates);

    if (this.supabase) {
      try {
        const mappedUpdates: Record<string, any> = {
          updated_at: new Date().toISOString()
        };
        if (updates.plan !== undefined) mappedUpdates.plan = updates.plan;
        if (updates.activePass !== undefined) mappedUpdates.active_pass = updates.activePass;
        if (updates.downloadCredits !== undefined) mappedUpdates.download_credits = updates.downloadCredits;
        if (updates.passExpiresAt !== undefined) mappedUpdates.pass_expires_at = updates.passExpiresAt;
        if (updates.subscriptionStatus !== undefined) mappedUpdates.subscription_status = updates.subscriptionStatus;
        if (updates.status !== undefined) mappedUpdates.status = updates.status;
        if (updates.role !== undefined) mappedUpdates.role = updates.role;
        if (updates.cvCount !== undefined) mappedUpdates.cv_count = updates.cvCount;

        await this.supabase.from('users').update(mappedUpdates).eq('id', id);
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase update user error:', err);
      }
    }

    return user;
  }

  // --- PAYMENTS ---
  public getPayments(): ServerPaymentRecord[] {
    return this.payments;
  }

  public async addPayment(payment: ServerPaymentRecord): Promise<void> {
    this.payments.unshift(payment);

    if (this.supabase) {
      try {
        await this.supabase.from('payments').insert({
          id: payment.id,
          order_id: payment.orderId,
          user_id: payment.userId,
          user_email: payment.userEmail,
          user_name: payment.userName,
          cv_id: payment.cvId,
          cv_title: payment.cvTitle,
          plan_type: payment.planType,
          plan_name: payment.planName,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          reference: payment.reference,
          payment_method: payment.paymentMethod,
          created_at: payment.createdAt
        });
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase insert payment error:', err);
      }
    }
  }

  // --- AI LOGS ---
  public getAILogs(): ServerAILogRecord[] {
    return this.aiLogs;
  }

  public async addAILog(log: ServerAILogRecord): Promise<void> {
    this.aiLogs.unshift(log);

    if (this.supabase) {
      try {
        await this.supabase.from('ai_logs').insert({
          id: log.id,
          endpoint: log.endpoint,
          user_id: log.userId,
          user_email: log.userEmail,
          timestamp: log.timestamp,
          success: log.success
        });
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase insert AI log error:', err);
      }
    }
  }

  // --- MESSAGES ---
  public getMessages(): ServerMessageRecord[] {
    return this.messages;
  }

  public async addMessage(msg: ServerMessageRecord): Promise<void> {
    this.messages.unshift(msg);

    if (this.supabase) {
      try {
        await this.supabase.from('messages').insert({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          status: msg.status,
          created_at: msg.createdAt,
          replied_at: msg.repliedAt,
          notes: msg.notes
        });
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase insert message error:', err);
      }
    }
  }

  public async updateMessage(id: string, updates: Partial<ServerMessageRecord>): Promise<ServerMessageRecord | null> {
    const msg = this.messages.find(m => m.id === id);
    if (!msg) return null;

    Object.assign(msg, updates);

    if (this.supabase) {
      try {
        const mappedUpdates: Record<string, any> = {};
        if (updates.status) mappedUpdates.status = updates.status;
        if (updates.notes !== undefined) mappedUpdates.notes = updates.notes;
        if (updates.repliedAt) mappedUpdates.replied_at = updates.repliedAt;

        await this.supabase.from('messages').update(mappedUpdates).eq('id', id);
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase update message error:', err);
      }
    }

    return msg;
  }

  // --- CVS ---
  public getCVs(): ServerCVRecord[] {
    return this.cvs;
  }

  public async addCV(cv: ServerCVRecord): Promise<void> {
    const idx = this.cvs.findIndex(c => c.id === cv.id);
    if (idx >= 0) {
      this.cvs[idx] = { ...this.cvs[idx], ...cv };
    } else {
      this.cvs.unshift(cv);
    }

    if (this.supabase) {
      try {
        await this.supabase.from('cvs').upsert({
          id: cv.id,
          user_id: cv.userId,
          title: cv.title,
          template_id: cv.templateId,
          is_paid: cv.isPaid,
          cv_data: cv.cvData,
          updated_at: cv.updatedAt
        });
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase upsert cv error:', err);
      }
    }
  }

  public async resetAllData(): Promise<void> {
    this.users = [];
    this.payments = [];
    this.aiLogs = [];
    this.messages = [];
    this.cvs = [];

    if (this.supabase) {
      try {
        await Promise.allSettled([
          this.supabase.from('ai_logs').delete().neq('id', ''),
          this.supabase.from('messages').delete().neq('id', ''),
          this.supabase.from('payments').delete().neq('id', '')
        ]);
      } catch (err) {
        console.warn('⚠️ [DATABASE] Supabase reset error:', err);
      }
    }
  }
}

export const db = new DatabaseService();
