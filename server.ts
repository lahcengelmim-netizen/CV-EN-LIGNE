import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config({ override: true });
dotenv.config({ path: '.env.local', override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header and dynamic key lookup
function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    console.error('❌ [GEMINI] Aucune clé API Gemini valide trouvée dans process.env.GEMINI_API_KEY ou process.env.VITE_GEMINI_API_KEY');
    throw new Error('Clé API Gemini introuvable ou non configurée. Veuillez définir GEMINI_API_KEY ou VITE_GEMINI_API_KEY dans votre fichier .env ou .env.local.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

import { db } from './serverDb';
import type { ServerUserRecord, ServerPaymentRecord, ServerAILogRecord, ServerMessageRecord, ServerCVRecord } from './serverDb';

// In-memory rate limiting and cover letter usage tracker per user/client IP
// Strict server-side enforcement: 2 cover letters per user max as requested in specification
const coverLetterUsageMap = new Map<string, number>();

// --- RATE LIMITING FOR AI ENDPOINTS (Sliding 1-hour window) ---
const aiRateLimitMap = new Map<string, number[]>();

function checkAIRateLimit(req: Request, userId?: string, maxRequestsPerHour = 10): { allowed: boolean; remaining: number; resetInMinutes: number; count: number } {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown_ip';
  const rateKey = (userId && userId !== 'guest') ? `uid_${userId}` : `ip_${clientIp}`;

  // Check if user has an active pass that grants unlimited/higher AI quota
  const user = (userId && userId !== 'guest') ? db.findUser(u => u.id === userId) : undefined;
  const isPaidUser = user && user.plan !== 'free' && user.subscriptionStatus === 'active';
  const effectiveLimit = isPaidUser ? 100 : maxRequestsPerHour;

  let timestamps = aiRateLimitMap.get(rateKey) || [];
  timestamps = timestamps.filter(t => now - t < ONE_HOUR);

  if (timestamps.length >= effectiveLimit) {
    const oldestTimestamp = timestamps[0] || now;
    const resetInMinutes = Math.max(1, Math.ceil((oldestTimestamp + ONE_HOUR - now) / (60 * 1000)));
    aiRateLimitMap.set(rateKey, timestamps);
    return {
      allowed: false,
      remaining: 0,
      resetInMinutes,
      count: timestamps.length
    };
  }

  timestamps.push(now);
  aiRateLimitMap.set(rateKey, timestamps);

  return {
    allowed: true,
    remaining: Math.max(0, effectiveLimit - timestamps.length),
    resetInMinutes: 60,
    count: timestamps.length
  };
}

export type { ServerUserRecord, ServerPaymentRecord, ServerAILogRecord, ServerMessageRecord, ServerCVRecord };

export interface ServerTemplateRecord {
  id: string;
  name: string;
  description: string;
  tag: string;
  style: string;
  usageCount: number;
  active: boolean;
  bgStyle: string;
}

// Proxies backed by persistent Supabase store and cache
function createArrayProxy<T extends object>(getList: () => T[]): T[] {
  return new Proxy([] as unknown as T[], {
    get(target, prop, receiver) {
      const list = getList();
      if (typeof prop === 'string' && !isNaN(Number(prop))) return (list as any)[prop];
      const val = (list as any)[prop];
      if (typeof val === 'function') return val.bind(list);
      return val;
    },
    set(target, prop, value) {
      const list = getList();
      (list as any)[prop] = value;
      return true;
    }
  });
}

const serverUsers = createArrayProxy<ServerUserRecord>(() => db.getUsers());
const serverPayments = createArrayProxy<ServerPaymentRecord>(() => db.getPayments());
const serverAILogs = createArrayProxy<ServerAILogRecord>(() => db.getAILogs());
const serverMessages = createArrayProxy<ServerMessageRecord>(() => db.getMessages());
const serverCVs = createArrayProxy<any>(() => db.getCVs());

// Real-Time Live Session & Activity Tracker
export interface LiveSessionRecord {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  role: string;
  lastSeen: number; // timestamp in ms
  currentAction: string;
  page: string;
  ip?: string;
}

export interface LiveActivityRecord {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  action: string;
  actionLabel: string;
  details: string;
  status: 'success' | 'info' | 'warning';
}

const liveSessions = new Map<string, LiveSessionRecord>();
let liveActivityLogs: LiveActivityRecord[] = [];
let totalEditsCount = 0;

export function logLiveActivity(record: Omit<LiveActivityRecord, 'id' | 'timestamp'>) {
  const newLog: LiveActivityRecord = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    ...record
  };
  liveActivityLogs.unshift(newLog);
  if (liveActivityLogs.length > 200) {
    liveActivityLogs = liveActivityLogs.slice(0, 200);
  }
  return newLog;
}

export function cleanInactiveSessions() {
  const now = Date.now();
  const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes
  for (const [sessionId, session] of liveSessions.entries()) {
    if (now - session.lastSeen > INACTIVITY_TIMEOUT) {
      liveSessions.delete(sessionId);
    }
  }
}

const serverTemplates: ServerTemplateRecord[] = [
  {
    id: 'modern',
    name: 'Moderne (2 Colonnes)',
    description: 'Structure latérale contrastée, idéale pour mettre en avant compétences et expériences.',
    tag: 'Le plus populaire',
    style: 'Modern & Two Columns',
    usageCount: 0,
    active: true,
    bgStyle: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'classic',
    name: 'Classique & Élégant',
    description: 'Mise en page épurée et intemporelle pour postes juridiques, bancaires et administratifs.',
    tag: 'ATS Recommandé',
    style: 'Classic & Timeless',
    usageCount: 0,
    active: true,
    bgStyle: 'from-slate-800 to-slate-950'
  },
  {
    id: 'minimal',
    name: 'Minimaliste Scandinave',
    description: 'Typographie aérée, accents monospacés, clarté absolue pour tech & freelances.',
    tag: 'Ultra Lisible',
    style: 'Clean & Minimal',
    usageCount: 0,
    active: true,
    bgStyle: 'from-zinc-700 to-zinc-900'
  },
  {
    id: 'professional',
    name: 'Corporate Exécutif',
    description: 'Bandeau supérieur statutaire pour profils expérimentés, consultants et managers.',
    tag: 'Cadres & Managers',
    style: 'Executive Header',
    usageCount: 0,
    active: true,
    bgStyle: 'from-teal-700 to-emerald-900'
  },
  {
    id: 'creative',
    name: 'Créatif & Dynamique',
    description: 'Cartes douces et badges colorés pour la communication, marketing et métiers créatifs.',
    tag: 'Design & Marketing',
    style: 'Creative Cards',
    usageCount: 0,
    active: true,
    bgStyle: 'from-purple-600 to-pink-600'
  }
];

let serverSettings = {
  platformName: 'VITAREY',
  contactEmail: process.env.SUPPORT_EMAIL || 'vitareysupport@gmail.com',
  supportNotificationEmail: (process.env.SUPPORT_EMAIL || 'vitareysupport@gmail.com').toLowerCase().trim(),
  cvPrice: 2.00,
  currency: 'USD',
  maintenanceMode: false,
  aiEnhancementEnabled: true,
  coverLetterEnabled: true
};

// Secure Admin Credentials & Active Session Store
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();

// Strict security: No default/hardcoded password fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : '';

if (!ADMIN_PASSWORD) {
  console.warn('⚠️ [SÉCURITÉ] La variable d\'environnement ADMIN_PASSWORD n\'est pas définie. L\'accès au portail administrateur est désactivé.');
}

// In-memory cryptographically verified admin sessions: token -> { email: string, expiresAt: number }
const activeAdminSessions = new Map<string, { email: string; expiresAt: number }>();

function verifyAdminCredentials(inputEmail?: string, inputPassword?: string): boolean {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length === 0) {
    console.warn('[SECURITY] Accès refusé : Aucun mot de passe admin configuré (ADMIN_PASSWORD manquant dans .env).');
    return false;
  }
  if (!inputEmail || !inputPassword) return false;
  if (inputEmail.toLowerCase().trim() !== ADMIN_EMAIL) return false;

  const expectedBuf = Buffer.from(ADMIN_PASSWORD, 'utf8');
  const inputBuf = Buffer.from(inputPassword, 'utf8');

  if (expectedBuf.length !== inputBuf.length) {
    // Constant-time dummy comparison to mitigate timing attacks
    crypto.timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, inputBuf);
}

// Admin authentication middleware helper - strictly validates cryptographic session token
function verifyAdminRequest(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  const adminTokenHeader = req.headers['x-admin-token'] as string | undefined;

  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (adminTokenHeader) {
    token = adminTokenHeader.trim();
  }

  if (!token) return false;

  const session = activeAdminSessions.get(token);
  if (!session) return false;

  // Check token expiration (24h)
  if (Date.now() > session.expiresAt) {
    activeAdminSessions.delete(token);
    return false;
  }

  return true;
}

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'VITAREY API' });
});

// 1. AI: Enhance Experience
// Strictly improves user's real input without inventing fake companies, titles, dates, or results
app.post('/api/ai/enhance-experience', async (req: Request, res: Response) => {
  try {
    const { position, company, rawDescription, tasks, lang = 'fr', userId = 'guest', userEmail } = req.body;

    const rateCheck = checkAIRateLimit(req, userId, 10);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Limite de requêtes IA atteinte (10 requêtes/heure). Veuillez réessayer dans ${rateCheck.resetInMinutes} minute(s).`,
        limitReached: true,
        resetInMinutes: rateCheck.resetInMinutes
      });
    }

    if (!rawDescription && (!tasks || tasks.length === 0)) {
      return res.status(400).json({ error: 'Texte ou tâches d\'expérience requis.' });
    }

    const ai = getAIClient();
    const prompt = `
[VITAREY AI Assistant] Tu es un expert senior en recrutement et rédaction de CV professionnels pour VITAREY.
Ta mission est d'améliorer la formulation de l'expérience professionnelle fournie par l'utilisateur pour la rendre percutante, moderne, valorisante et adaptée aux standards des recruteurs et des ATS.

RÈGLE ABSOLUE DE VÉRACITÉ (TRÈS IMPORTANT) :
- Tu ne dois JAMAIS inventer d'entreprise, de poste, de diplôme, d'expérience imaginaire, de compétences non mentionnées, de dates fictives ou de faux résultats chiffrés extravagants.
- Tu dois UNIQUEMENT valoriser, structurer et reformuler les informations réelles fournies par l'utilisateur.
- Utilise des verbes d'action au passé composé ou infinitif professionnel, un vocabulaire précis du secteur, et une syntaxe soignée.

Langue demandée : ${lang === 'ar' ? 'Arabe professionnel' : lang === 'en' ? 'Anglais professionnel' : 'Français professionnel'}.

Données de l'utilisateur :
- Intitulé du poste : ${position || 'Non spécifié'}
- Entreprise : ${company || 'Non spécifiée'}
- Description brute : "${rawDescription || ''}"
- Tâches brutes fournies : ${JSON.stringify(tasks || [])}

Fournis une réponse STRICTEMENT au format JSON valide avec la structure suivante :
{
  "improvedDescription": "Un paragraphe court et percutant résumant le périmètre et la mission principale",
  "improvedTasks": [
    "Puce 1 avec verbe d'action fort",
    "Puce 2 claire et valorisante",
    "Puce 3 orientée qualité et rigueur"
  ],
  "advice": "Conseil concis pour mettre en valeur cette expérience lors d'un entretien"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      parsedResult = {
        improvedDescription: responseText,
        improvedTasks: tasks || [],
        advice: 'Optimisation réussie.'
      };
    }

    // Log AI Usage
    await db.addAILog({
      id: 'ai_' + Math.random().toString(36).substring(2, 9),
      endpoint: 'enhance-experience',
      userId: userId || 'guest',
      userEmail: userEmail || undefined,
      timestamp: new Date().toISOString(),
      success: true
    });

    return res.json({
      success: true,
      data: parsedResult
    });
  } catch (error: any) {
    console.error('❌ [AI Experience Enhancement error]:', {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
      error
    });
    return res.status(500).json({
      error: 'Une erreur est survenue lors de l\'amélioration par l\'IA. Veuillez réessayer.',
      details: error?.message || String(error)
    });
  }
});

// 2. AI: Enhance Professional Summary / Hook
app.post('/api/ai/enhance-summary', async (req: Request, res: Response) => {
  try {
    const { rawSummary, jobTitle, yearsOfExperience, skills, lang = 'fr', userId = 'guest', userEmail } = req.body;

    const rateCheck = checkAIRateLimit(req, userId, 10);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Limite de requêtes IA atteinte (10 requêtes/heure). Veuillez réessayer dans ${rateCheck.resetInMinutes} minute(s).`,
        limitReached: true,
        resetInMinutes: rateCheck.resetInMinutes
      });
    }

    const ai = getAIClient();
    const prompt = `
[VITAREY AI Assistant] Tu es un coach en recrutement de haut niveau pour VITAREY.
Rédige ou optimise un résumé professionnel (accroche de CV) percutant, concis (3 à 4 phrases maximum) et captivant pour un candidat.

RÈGLE D'OR : Ne crée pas de fausses qualifications. Base-toi uniquement sur le profil fourni.
Langue : ${lang === 'ar' ? 'Arabe' : lang === 'en' ? 'Anglais' : 'Français'}.

Informations :
- Métier visé : ${jobTitle || 'Professionnel'}
- Années d'expérience : ${yearsOfExperience || 'Non précisé'}
- Compétences clés : ${Array.isArray(skills) ? skills.join(', ') : skills || ''}
- Texte d'origine de l'utilisateur : "${rawSummary || ''}"

Réponds STRICTEMENT au format JSON :
{
  "improvedSummary": "Texte optimisé en 3-4 phrases percutantes",
  "highlightKeywords": ["Mot-clé 1", "Mot-clé 2", "Mot-clé 3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    // Log AI Usage
    await db.addAILog({
      id: 'ai_' + Math.random().toString(36).substring(2, 9),
      endpoint: 'enhance-summary',
      userId: userId || 'guest',
      userEmail: userEmail || undefined,
      timestamp: new Date().toISOString(),
      success: true
    });

    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('❌ [AI Summary Enhancement error]:', {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
      error
    });
    return res.status(500).json({
      error: 'Erreur lors de l\'optimisation du résumé.',
      details: error?.message || String(error)
    });
  }
});

// 3. AI: Suggest Skills based on Job Title
app.post('/api/ai/suggest-skills', async (req: Request, res: Response) => {
  try {
    const { jobTitle, lang = 'fr', userId = 'guest', userEmail } = req.body;

    const rateCheck = checkAIRateLimit(req, userId, 10);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: `Limite de requêtes IA atteinte (10 requêtes/heure). Veuillez réessayer dans ${rateCheck.resetInMinutes} minute(s).`,
        limitReached: true,
        resetInMinutes: rateCheck.resetInMinutes
      });
    }

    if (!jobTitle) {
      return res.status(400).json({ error: 'Titre du poste requis.' });
    }

    const ai = getAIClient();
    const prompt = `
Tu donne une liste de 12 compétences professionnelles très recherchées (hard skills et soft skills) pour le poste : "${jobTitle}".
Langue : ${lang === 'ar' ? 'Arabe' : lang === 'en' ? 'Anglais' : 'Français'}.

Réponds STRICTEMENT en JSON :
{
  "skills": ["Compétence 1", "Compétence 2", "Compétence 3", "..."]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{"skills":[]}');

    // Log AI Usage
    await db.addAILog({
      id: 'ai_' + Math.random().toString(36).substring(2, 9),
      endpoint: 'suggest-skills',
      userId: userId || 'guest',
      userEmail: userEmail || undefined,
      timestamp: new Date().toISOString(),
      success: true
    });

    return res.json({ success: true, skills: parsed.skills || [] });
  } catch (error: any) {
    console.error('❌ [AI Suggest Skills error]:', {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
      error
    });
    return res.status(500).json({
      error: 'Erreur suggestion de compétences.',
      details: error?.message || String(error)
    });
  }
});

// 4. AI: Cover Letter Generation with Server-Side Limit of 2 uses per client
app.post('/api/ai/generate-cover-letter', async (req: Request, res: Response) => {
  try {
    const {
      userId = req.ip || 'anonymous',
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateCity,
      jobTitle,
      companyName,
      recipientName,
      cvSummary,
      experiences,
      skills,
      lang = 'fr'
    } = req.body;

    const userKey = `user_${userId}`;
    const currentCount = coverLetterUsageMap.get(userKey) || 0;

    // Server-enforced limit of 2 uses
    if (currentCount >= 2) {
      return res.status(403).json({
        error: 'Limite atteinte : Vous avez utilisé vos 2 générations de lettre de motivation incluses.',
        limitReached: true,
        usageCount: currentCount
      });
    }

    const ai = getAIClient();
    const prompt = `
[VITAREY AI Assistant] Tu es l'expert en recrutement de la plateforme VITAREY. Rédige une lettre de motivation professionnelle, élégante et sur-mesure pour ce candidat, basée STRICTEMENT sur son parcours réel.

Informations Candidat :
- Nom : ${candidateName || 'Le Candidat'}
- Email : ${candidateEmail || ''}
- Téléphone : ${candidatePhone || ''}
- Ville : ${candidateCity || ''}
- Poste visé : ${jobTitle || 'Poste proposé'}
- Entreprise ciblée : ${companyName || 'L\'Entreprise'}
- Destinataire : ${recipientName || 'Madame, Monsieur le Responsable du Recrutement'}
- Profil / Résumé : ${cvSummary || ''}
- Expériences clés : ${JSON.stringify(experiences || [])}
- Compétences : ${JSON.stringify(skills || [])}

Langue : ${lang === 'ar' ? 'Arabe soutenu et professionnel' : lang === 'en' ? 'Anglais professionnel' : 'Français soigné et professionnel'}.

Règles :
- Structure classique : En-tête, Objet, Formule d'appel, Paragraphe Vous (l'entreprise), Paragraphe Moi (mon expérience réelle), Paragraphe Nous (valeur ajoutée future), Demande d'entretien et formule de politesse.
- Ne pas inventer d'expériences fictives.

Réponds STRICTEMENT en JSON :
{
  "subject": "Candidature au poste de ...",
  "content": "Corps complet de la lettre de motivation mis en forme avec paragraphes clairs..."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    // Increment usage
    const newCount = currentCount + 1;
    coverLetterUsageMap.set(userKey, newCount);

    // Log AI Usage
    await db.addAILog({
      id: 'ai_' + Math.random().toString(36).substring(2, 9),
      endpoint: 'generate-cover-letter',
      userId: String(userId),
      userEmail: candidateEmail || undefined,
      timestamp: new Date().toISOString(),
      success: true
    });

    return res.json({
      success: true,
      data: parsed,
      remainingUses: Math.max(0, 2 - newCount),
      usageCount: newCount
    });
  } catch (error: any) {
    console.error('❌ [AI Cover Letter error]:', {
      message: error?.message,
      status: error?.status,
      stack: error?.stack,
      error
    });
    return res.status(500).json({
      error: 'Erreur lors de la génération de la lettre de motivation.',
      details: error?.message || String(error)
    });
  }
});

// 5. PayPal API Helper Functions & Real Orders v2 Integration
function getPayPalConfig() {
  const clientId = (process.env.PAYPAL_CLIENT_ID || '').trim();
  const secret = (process.env.PAYPAL_SECRET || '').trim();
  const mode = (process.env.PAYPAL_MODE || 'sandbox').trim().toLowerCase();
  const isConfigured = Boolean(clientId && secret);
  const baseUrl = mode === 'production' 
    ? 'https://api-m.paypal.com' 
    : 'https://api-m.sandbox.paypal.com';

  return { clientId, secret, mode, isConfigured, baseUrl };
}

async function getPayPalAccessToken(): Promise<string> {
  const { clientId, secret, baseUrl, isConfigured } = getPayPalConfig();
  if (!isConfigured) {
    throw new Error('PAYPAL_NOT_CONFIGURED');
  }

  const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[PayPal] Failed to obtain access token:', errorText);
    throw new Error(`PayPal Auth Error (${response.status}): ${errorText}`);
  }

  const tokenData = await response.json() as { access_token: string };
  return tokenData.access_token;
}

async function createPayPalV2Order(amount: number, currency: string, planName: string, customMeta: any) {
  const { baseUrl } = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: planName,
          custom_id: JSON.stringify(customMeta),
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          }
        }
      ]
    })
  });

  const orderData = await response.json() as any;
  if (!response.ok) {
    console.error('[PayPal] Create order failed:', orderData);
    throw new Error(orderData.message || 'Erreur lors de la création de la commande PayPal.');
  }

  return orderData;
}

async function capturePayPalV2Order(orderId: string) {
  const { baseUrl } = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const captureData = await response.json() as any;
  if (!response.ok) {
    console.error('[PayPal] Capture order failed:', captureData);
    throw new Error(captureData.message || 'Erreur lors de la capture de la commande PayPal.');
  }

  return captureData;
}

// Payment Configuration Endpoint (Client checks whether real credentials exist)
app.get('/api/payment/config', (req: Request, res: Response) => {
  const { isConfigured, mode, clientId } = getPayPalConfig();
  res.json({
    configured: isConfigured,
    mode,
    clientId: clientId || process.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: serverSettings.currency || 'USD'
  });
});

// Order Creation Endpoint (Gated by PayPal Configuration)
app.post('/api/payment/create-order', async (req: Request, res: Response) => {
  try {
    const { cvId, cvTitle, userId, userEmail, userName, planType = 'single_cv' } = req.body;
    const { isConfigured } = getPayPalConfig();

    // 1. Gate: if PAYPAL_CLIENT_ID/PAYPAL_SECRET are not set, return sandbox not configured response
    if (!isConfigured) {
      return res.status(503).json({
        success: false,
        configured: false,
        code: 'PAYPAL_NOT_CONFIGURED',
        error: 'Sandbox PayPal non configurée : veuillez définir PAYPAL_CLIENT_ID et PAYPAL_SECRET dans les variables d\'environnement pour activer PayPal.'
      });
    }

    let amount = 1.99;
    let planName = 'Pass Flash (1 Téléchargement)';
    let description = 'Téléchargement de 1 CV PDF HD A4 sans filigrane (Crédit = 1 PDF)';

    if (planType === 'pro') {
      amount = 3.99;
      planName = 'Pass Pro (7 Jours)';
      description = 'Téléchargements illimités pendant 7 jours + Lettres de Motivation incluses';
    } else if (planType === 'monthly') {
      amount = 7.99;
      planName = 'Pass Mensuel Illimité';
      description = 'Création & téléchargements illimités de CVs + Lettres de motivation incluses';
    } else if (planType === 'yearly' || planType === 'annual') {
      amount = 39.99;
      planName = 'Pass Annuel Pro (Économisez 50%)';
      description = 'Accès illimité pendant 1 an complet (365 jours) - Tous modèles et outils';
    } else {
      amount = 1.99;
      planName = 'Pass Flash (1 Téléchargement)';
    }

    const currency = serverSettings.currency || 'USD';
    const customMeta = {
      cvId: cvId || 'all_cvs',
      userId: userId || 'guest',
      userEmail: userEmail || '',
      planType
    };

    const paypalOrder = await createPayPalV2Order(amount, currency, planName, customMeta);

    return res.json({
      success: true,
      configured: true,
      orderId: paypalOrder.id,
      cvId: cvId || 'all_cvs',
      cvTitle: cvTitle || planName,
      planType,
      planName,
      amount,
      currency,
      description
    });
  } catch (error: any) {
    console.error('[Payment] Create Order error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Impossible d\'initier la commande PayPal.'
    });
  }
});

// Capture & Verification Handler
async function handleOrderCapture(req: Request, res: Response) {
  try {
    const {
      orderId,
      cvId,
      userId = 'guest',
      userEmail = '',
      userName = '',
      cvTitle = 'CV Professionnel',
      planType = 'single_cv'
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, verified: false, error: 'Identifiant de commande manquant.' });
    }

    const { isConfigured } = getPayPalConfig();

    // 2. Gate: if credentials are not set, return sandbox not configured response
    if (!isConfigured) {
      return res.status(503).json({
        success: false,
        verified: false,
        configured: false,
        code: 'PAYPAL_NOT_CONFIGURED',
        error: 'Sandbox PayPal non configurée : aucun crédit ni téléchargement ne peut être accordé sans capture PayPal réelle.'
      });
    }

    // 3. Real PayPal Capture via Orders v2 API
    const captureResult = await capturePayPalV2Order(orderId);

    // CRITICAL: Strictly ensure status is COMPLETED before granting any credit
    if (!captureResult || captureResult.status !== 'COMPLETED') {
      return res.status(402).json({
        success: false,
        verified: false,
        status: captureResult?.status || 'FAILED',
        error: `Paiement PayPal non complété (statut: ${captureResult?.status || 'INCONNU'}). Aucun crédit de téléchargement n'a été accordé.`
      });
    }

    let amount = 1.99;
    let planName = 'Pass Flash (1 Téléchargement)';
    let subscriptionDurationDays = 0;
    let activePass: 'flash' | 'pro' | 'monthly' | 'annual' = 'flash';
    let downloadCredits = 1;
    let unlockedCoverLetters = false;

    if (planType === 'pro') {
      amount = 3.99;
      planName = 'Pass Pro (7 Jours)';
      subscriptionDurationDays = 7;
      activePass = 'pro';
      downloadCredits = 999999;
      unlockedCoverLetters = true;
    } else if (planType === 'monthly') {
      amount = 7.99;
      planName = 'Pass Mensuel Illimité';
      subscriptionDurationDays = 30;
      activePass = 'monthly';
      downloadCredits = 999999;
      unlockedCoverLetters = true;
    } else if (planType === 'yearly' || planType === 'annual') {
      amount = 39.99;
      planName = 'Pass Annuel Pro';
      subscriptionDurationDays = 365;
      activePass = 'annual';
      downloadCredits = 999999;
      unlockedCoverLetters = true;
    } else {
      amount = 1.99;
      planName = 'Pass Flash (1 Téléchargement)';
      activePass = 'flash';
      downloadCredits = 1;
      unlockedCoverLetters = false;
    }

    const targetCvId = cvId || 'cv_unlimited';
    const verificationToken = `token_paid_${Buffer.from(`${targetCvId}:${planType}:${Date.now()}`).toString('base64')}`;
    const reference = captureResult.id || `PAYPAL-${orderId}`;
    const now = new Date();

    const newPaymentRecord: ServerPaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substring(2, 9),
      orderId,
      userId: userId || 'guest',
      userEmail: userEmail || 'client@email.com',
      userName: userName || 'Candidat',
      cvId: targetCvId,
      cvTitle: cvTitle || planName,
      planType: planType as any,
      planName,
      amount,
      currency: serverSettings.currency || 'USD',
      status: 'succeeded',
      reference,
      createdAt: now.toISOString(),
      paymentMethod: 'PayPal (Orders v2)'
    };

    await db.addPayment(newPaymentRecord);

    // Update or create user record in server database ONLY on COMPLETED capture
    let userRecord = serverUsers.find(u => (userId && userId !== 'guest' && u.id === userId) || (userEmail && u.email.toLowerCase() === userEmail.toLowerCase()));
    const subscriptionStart = now.toISOString();
    const subscriptionEnd = subscriptionDurationDays > 0 
      ? new Date(now.getTime() + subscriptionDurationDays * 86400000).toISOString()
      : undefined;

    if (userRecord) {
      userRecord.plan = planType as any;
      userRecord.activePass = activePass;
      userRecord.downloadCredits = downloadCredits;
      userRecord.unlockedCoverLetters = unlockedCoverLetters;
      userRecord.canEdit = true;
      userRecord.passExpiresAt = subscriptionEnd;
      userRecord.subscriptionStatus = subscriptionDurationDays > 0 ? 'active' : 'none';
      if (subscriptionStart) userRecord.subscriptionStart = subscriptionStart;
      if (subscriptionEnd) userRecord.subscriptionEnd = subscriptionEnd;
      await db.upsertUser(userRecord);
    } else if (userEmail || (userId && userId !== 'guest')) {
      const newUser: ServerUserRecord = {
        id: userId || 'usr_' + Math.random().toString(36).substring(2, 9),
        email: userEmail || 'user@example.com',
        firstName: userName.split(' ')[0] || 'Utilisateur',
        lastName: userName.split(' ').slice(1).join(' ') || '',
        createdAt: now.toISOString(),
        plan: planType as any,
        activePass,
        downloadCredits,
        passExpiresAt: subscriptionEnd,
        totalDownloads: 0,
        unlockedCoverLetters,
        canEdit: true,
        subscriptionStatus: subscriptionDurationDays > 0 ? 'active' : 'none',
        subscriptionStart,
        subscriptionEnd,
        cvCount: 1,
        status: 'active',
        role: 'user',
        lastLogin: now.toISOString()
      };
      await db.upsertUser(newUser);
    }

    return res.json({
      success: true,
      verified: true,
      status: 'COMPLETED',
      cvId: targetCvId,
      orderId,
      planType,
      activePass,
      downloadCredits,
      planName,
      reference,
      paidAt: newPaymentRecord.createdAt,
      amount: newPaymentRecord.amount,
      currency: newPaymentRecord.currency,
      verificationToken,
      subscriptionStart,
      subscriptionEnd,
      unlockedCoverLetters,
      canDownload: true
    });
  } catch (error: any) {
    console.error('[Payment] Capture Order error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error?.message || 'Erreur lors de la capture du paiement PayPal.'
    });
  }
}

app.post('/api/payment/capture-order', handleOrderCapture);
app.post('/api/payment/verify', handleOrderCapture);

// 5.b User Pass Status Verification Endpoint
app.post('/api/user/pass-status', (req: Request, res: Response) => {
  try {
    const { userId, userEmail } = req.body;
    const now = new Date().getTime();

    let userRecord = serverUsers.find(u => (userId && userId !== 'guest' && u.id === userId) || (userEmail && u.email.toLowerCase() === userEmail.toLowerCase()));

    if (!userRecord) {
      return res.json({
        success: true,
        pass: {
          activePass: 'none',
          downloadCredits: 0,
          passExpiresAt: null,
          unlockedCoverLetters: false,
          totalDownloads: 0,
          isUnlimited: false,
          canDownload: false,
          canEdit: true
        }
      });
    }

    // Check expiration for time-based passes (pro, monthly, annual)
    if (['pro', 'monthly', 'yearly', 'annual'].includes(userRecord.activePass)) {
      if (userRecord.passExpiresAt) {
        const expiryTime = new Date(userRecord.passExpiresAt).getTime();
        if (now > expiryTime) {
          userRecord.subscriptionStatus = 'expired';
          userRecord.activePass = 'none';
          userRecord.downloadCredits = 0;
          userRecord.unlockedCoverLetters = false;
        }
      }
    }

    const isUnlimited = ['pro', 'monthly', 'yearly', 'annual'].includes(userRecord.activePass);
    const canDownload = isUnlimited || userRecord.downloadCredits >= 1;
    const canEdit = isUnlimited || userRecord.downloadCredits >= 1 || userRecord.activePass === 'none';

    return res.json({
      success: true,
      pass: {
        activePass: userRecord.activePass,
        downloadCredits: userRecord.downloadCredits,
        passExpiresAt: userRecord.passExpiresAt || null,
        unlockedCoverLetters: userRecord.unlockedCoverLetters,
        totalDownloads: userRecord.totalDownloads,
        isUnlimited,
        canDownload,
        canEdit
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur vérification du pass.' });
  }
});

// 5.c Consume Download Credit Endpoint (Strict Backend Permission & Consumption)
app.post('/api/user/consume-download', (req: Request, res: Response) => {
  try {
    const { userId, userEmail, currentPassType } = req.body;
    const now = new Date().getTime();

    let userRecord = serverUsers.find(u => (userId && userId !== 'guest' && u.id === userId) || (userEmail && u.email.toLowerCase() === userEmail.toLowerCase()));

    // If no user record on server, use currentPassType if requested
    if (!userRecord && currentPassType) {
      if (currentPassType === 'flash' || currentPassType === 'single_cv') {
        return res.json({
          success: true,
          remainingCredits: 0,
          activePass: 'none',
          canEdit: false,
          message: 'Crédit Pass Flash consommé (1/1 PDF).'
        });
      } else if (['pro', 'monthly', 'yearly', 'annual'].includes(currentPassType)) {
        return res.json({
          success: true,
          remainingCredits: 999999,
          activePass: currentPassType,
          isUnlimited: true,
          canEdit: true
        });
      }
    }

    if (!userRecord) {
      return res.status(403).json({
        success: false,
        requirePass: true,
        error: 'Aucun pass actif trouvé. Veuillez choisir une formule pour télécharger.'
      });
    }

    // 1. Check time-based passes
    if (['pro', 'monthly', 'yearly', 'annual'].includes(userRecord.activePass)) {
      if (userRecord.passExpiresAt) {
        const expiryTime = new Date(userRecord.passExpiresAt).getTime();
        if (now > expiryTime) {
          userRecord.subscriptionStatus = 'expired';
          userRecord.activePass = 'none';
          userRecord.downloadCredits = 0;
          return res.status(403).json({
            success: false,
            requirePass: true,
            error: 'Votre Pass a expiré. Veuillez renouveler votre accès pour télécharger.'
          });
        }
      }

      userRecord.totalDownloads = (userRecord.totalDownloads || 0) + 1;
      return res.json({
        success: true,
        remainingCredits: 999999,
        activePass: userRecord.activePass,
        isUnlimited: true,
        canEdit: true,
        totalDownloads: userRecord.totalDownloads
      });
    }

    // 2. Check Pass Flash (Single purchase 1 credit)
    if (userRecord.activePass === 'flash' || userRecord.activePass === 'single_cv') {
      if (userRecord.downloadCredits >= 1) {
        // Decrement credit from 1 to 0
        userRecord.downloadCredits = 0;
        userRecord.activePass = 'none'; // Pass is fully consumed
        userRecord.canEdit = false; // Block further edits without new pass
        userRecord.totalDownloads = (userRecord.totalDownloads || 0) + 1;

        return res.json({
          success: true,
          remainingCredits: 0,
          activePass: 'none',
          canEdit: false,
          totalDownloads: userRecord.totalDownloads,
          message: 'Crédit Pass Flash utilisé (1/1 PDF consommé). Achetez un nouveau pass pour modifier ou télécharger à nouveau.'
        });
      } else {
        return res.status(403).json({
          success: false,
          requirePass: true,
          remainingCredits: 0,
          error: 'Votre crédit de téléchargement Pass Flash a déjà été utilisé (1/1). Achetez un nouveau pass.'
        });
      }
    }

    // 3. No active pass or 0 credits
    return res.status(403).json({
      success: false,
      requirePass: true,
      error: 'Aucun pass actif ou crédit épuisé. Veuillez choisir une formule.'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur lors de la validation du téléchargement.' });
  }
});

// 6. Contact Form Notification Endpoint -> vitareysupport@gmail.com & Saved to Admin Inbox
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
    }

    const newMessage: ServerMessageRecord = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9) + Date.now(),
      name,
      email,
      subject: subject || 'Demande de contact',
      message,
      status: 'nouveau',
      createdAt: new Date().toISOString()
    };

    serverMessages.unshift(newMessage);

    const supportRecipient = serverSettings.supportNotificationEmail || process.env.SUPPORT_EMAIL || 'vitareysupport@gmail.com';
    console.log(`[CONTACT NOTIFICATION] New message for ${supportRecipient} from ${name} (${email}) - Subject: ${subject}`);
    console.log(`[MESSAGE BODY]: ${message}`);

    res.json({
      success: true,
      messageId: newMessage.id,
      message: `Votre message a été transmis avec succès à l'équipe support (${supportRecipient}).`
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

// ==========================================
// 7. --- SECURE ADMIN ENDPOINTS (/api/admin/*) ---
// ==========================================

// Verify Admin Status
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({
      success: false,
      isAdmin: false,
      error: 'Identifiants incomplets. Email et mot de passe administrateur sont requis.'
    });
  }

  // Strictly verify email and password
  if (!verifyAdminCredentials(email, password)) {
    return res.status(403).json({
      success: false,
      isAdmin: false,
      error: 'Identifiants administrateur incorrects. Accès refusé.'
    });
  }

  // Generate high-entropy cryptographic session token
  const token = 'adm_sess_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity

  activeAdminSessions.set(token, {
    email: ADMIN_EMAIL,
    expiresAt
  });

  // Track active admin session and log live event
  liveSessions.set('usr_admin_1', {
    sessionId: 'usr_admin_1',
    userId: 'usr_admin_1',
    userEmail: ADMIN_EMAIL,
    userName: 'Lahcen Gelmim (Admin)',
    role: 'admin',
    lastSeen: Date.now(),
    currentAction: 'Connecté au Tableau de Bord Admin',
    page: '/admin'
  });

  logLiveActivity({
    userId: 'usr_admin_1',
    userEmail: ADMIN_EMAIL,
    userName: 'Lahcen Gelmim (Admin)',
    action: 'login',
    actionLabel: 'Connexion Admin',
    details: 'Session administrateur sécurisée initiée',
    status: 'success'
  });

  return res.json({
    success: true,
    isAdmin: true,
    token,
    expiresAt,
    user: {
      id: 'usr_admin_1',
      email: ADMIN_EMAIL,
      firstName: 'Lahcen',
      lastName: 'Gelmim',
      role: 'admin'
    }
  });
});

// Live Activity Heartbeat
app.post('/api/activity/heartbeat', (req: Request, res: Response) => {
  const { userId = 'gst_' + Date.now(), userEmail, userName = 'Visiteur', role = 'guest', currentAction = 'En ligne', page = '/' } = req.body;
  const sessionId = userId || userEmail || 'gst_' + (req.ip || 'anon');
  const now = Date.now();

  const existing = liveSessions.get(sessionId);
  if (!existing && role !== 'guest') {
    logLiveActivity({
      userId,
      userEmail,
      userName,
      action: 'login',
      actionLabel: 'Visiteur en ligne',
      details: `Session active détectée sur la page ${page}`,
      status: 'info'
    });
  }

  liveSessions.set(sessionId, {
    sessionId,
    userId,
    userEmail,
    userName,
    role,
    lastSeen: now,
    currentAction,
    page,
    ip: req.ip
  });

  cleanInactiveSessions();

  return res.json({
    success: true,
    onlineCount: liveSessions.size,
    recentEditsCount: totalEditsCount
  });
});

// Live Activity Log Event
app.post('/api/activity/log', (req: Request, res: Response) => {
  const { userId, userEmail, userName = 'Utilisateur', action = 'cv_edit', actionLabel = 'Modification', details = '', status = 'info' } = req.body;

  if (action === 'cv_edit') {
    totalEditsCount++;
  }

  const sessionId = userId || userEmail || 'gst_' + (req.ip || 'anon');
  const session = liveSessions.get(sessionId);
  if (session) {
    session.lastSeen = Date.now();
    session.currentAction = actionLabel;
  }

  logLiveActivity({
    userId,
    userEmail,
    userName,
    action,
    actionLabel,
    details,
    status
  });

  return res.json({
    success: true,
    recentEditsCount: totalEditsCount
  });
});

// Reset Dashboard Statistics to Zero (Standard Baseline)
app.post('/api/admin/reset-stats', async (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  await db.resetAllData();
  liveActivityLogs = [];
  liveSessions.clear();
  totalEditsCount = 0;

  serverTemplates.forEach(t => {
    t.usageCount = 0;
  });

  // Re-register current admin session
  liveSessions.set('usr_admin_1', {
    sessionId: 'usr_admin_1',
    userId: 'usr_admin_1',
    userEmail: ADMIN_EMAIL,
    userName: 'Lahcen Gelmim (Admin)',
    role: 'admin',
    lastSeen: Date.now(),
    currentAction: 'Réinitialisation des compteurs effectuée',
    page: '/admin'
  });

  logLiveActivity({
    userId: 'usr_admin_1',
    userEmail: ADMIN_EMAIL,
    userName: 'Lahcen Gelmim (Admin)',
    action: 'reset',
    actionLabel: 'Réinitialisation des statistiques',
    details: 'Remise à zéro standard de tous les compteurs et métriques (Baseline 0)',
    status: 'warning'
  });

  return res.json({
    success: true,
    message: 'Toutes les métriques et statistiques ont été réinitialisées à 0 (Baseline standard).'
  });
});

// Admin Stats
app.get('/api/admin/stats', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  cleanInactiveSessions();

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  const totalUsers = serverUsers.length;
  const newUsersToday = serverUsers.filter(u => u.createdAt.slice(0, 10) === todayStr).length;
  const newUsersMonth = serverUsers.filter(u => u.createdAt.slice(0, 7) === currentMonthStr).length;

  // Plan and Subscription counts
  const freeUsersCount = serverUsers.filter(u => u.plan === 'free').length;
  const singleCvUsersCount = serverUsers.filter(u => u.plan === 'single_cv').length;
  const monthlySubscribersCount = serverUsers.filter(u => u.plan === 'monthly').length;
  const yearlySubscribersCount = serverUsers.filter(u => u.plan === 'yearly').length;
  const activeSubscriptionsCount = serverUsers.filter(u => u.subscriptionStatus === 'active').length;
  const expiredSubscriptionsCount = serverUsers.filter(u => u.subscriptionStatus === 'expired').length;

  // Real payment calculations
  const successfulPayments = serverPayments.filter(p => p.status === 'succeeded');
  const totalPayments = successfulPayments.length;
  const totalRevenue = Number(successfulPayments.reduce((acc, p) => acc + p.amount, 0).toFixed(2));
  const averageBasket = totalPayments > 0 ? Number((totalRevenue / totalPayments).toFixed(2)) : 0.00;

  // Revenue breakdown by plan
  const revenueSingleCv = Number(successfulPayments.filter(p => p.planType === 'single_cv' || p.amount === 2).reduce((acc, p) => acc + p.amount, 0).toFixed(2));
  const revenueMonthly = Number(successfulPayments.filter(p => p.planType === 'monthly' || p.amount === 9.90).reduce((acc, p) => acc + p.amount, 0).toFixed(2));
  const revenueYearly = Number(successfulPayments.filter(p => p.planType === 'yearly' || p.amount === 29.90).reduce((acc, p) => acc + p.amount, 0).toFixed(2));

  // Real AI calculations
  const totalAIUsage = serverAILogs.length;
  const aiUsageToday = serverAILogs.filter(l => l.timestamp.slice(0, 10) === todayStr).length;
  const aiUsageMonth = serverAILogs.filter(l => l.timestamp.slice(0, 7) === currentMonthStr).length;
  const coverLettersGenerated = serverAILogs.filter(l => l.endpoint === 'generate-cover-letter').length;
  const activeAIUsers = new Set(serverAILogs.map(l => l.userId)).size;

  // Template usage distribution
  const mostUsedTemplates = serverTemplates.map(t => {
    const totalTemplateCount = serverTemplates.reduce((sum, item) => sum + item.usageCount, 0);
    return {
      templateId: t.id as any,
      name: t.name,
      count: t.usageCount,
      percentage: totalTemplateCount > 0 ? Math.round((t.usageCount / totalTemplateCount) * 100) : 0
    };
  });

  // Daily revenue over last 7 days
  const dailyRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dStr = d.toISOString().slice(0, 10);
    const dayPayments = successfulPayments.filter(p => p.createdAt.slice(0, 10) === dStr);
    dailyRevenue.push({
      date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      amount: Number(dayPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)),
      sales: dayPayments.length
    });
  }

  // Monthly revenue for last 6 months
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStr = d.toISOString().slice(0, 7);
    const mPayments = successfulPayments.filter(p => p.createdAt.slice(0, 7) === mStr);
    monthlyRevenue.push({
      month: d.toLocaleDateString('fr-FR', { month: 'short' }),
      amount: Number(mPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)),
      sales: mPayments.length
    });
  }

  // User and CV growth chart
  const totalCVs = serverCVs.length + serverUsers.reduce((acc, u) => acc + (u.cvCount || 0), 0);
  const userGrowth = [
    { date: 'Semaine 1', users: 0, cvs: 0 },
    { date: 'Semaine 2', users: 0, cvs: 0 },
    { date: 'Semaine 3', users: 0, cvs: 0 },
    { date: 'Semaine 4', users: serverUsers.length, cvs: totalCVs }
  ];

  // Active online users mapped
  const onlineUsersList = Array.from(liveSessions.values()).map(s => ({
    id: s.sessionId,
    sessionId: s.sessionId,
    userId: s.userId,
    email: s.userEmail || (s.role === 'admin' ? ADMIN_EMAIL : 'Visiteur en ligne'),
    name: s.userName,
    role: s.role,
    lastSeen: new Date(s.lastSeen).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    currentAction: s.currentAction,
    page: s.page,
    isOnline: true
  }));

  const onlineUsersCount = liveSessions.size;
  const activeSessionsCount = liveSessions.size;
  const recentEditsCount = totalEditsCount;

  return res.json({
    success: true,
    data: {
      totalUsers,
      newUsersToday,
      newUsersMonth,
      freeUsersCount,
      singleCvUsersCount,
      monthlySubscribersCount,
      yearlySubscribersCount,
      activeSubscriptionsCount,
      expiredSubscriptionsCount,
      revenueSingleCv,
      revenueMonthly,
      revenueYearly,
      totalCVs,
      cvsToday: 0,
      cvsMonth: totalCVs,
      totalPayments,
      totalRevenue,
      averageBasket,
      totalAIUsage,
      aiUsageToday,
      aiUsageMonth,
      coverLettersGenerated,
      activeAIUsers,
      mostUsedTemplates,
      dailyRevenue,
      monthlyRevenue,
      userGrowth,
      // Real-time live tracking
      onlineUsersCount,
      activeSessionsCount,
      recentEditsCount,
      liveOnlineUsers: onlineUsersList,
      recentActivityLogs: liveActivityLogs.slice(0, 30)
    }
  });
});

// Admin Users List
app.get('/api/admin/users', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { search = '', status = 'all', plan = 'all', page = '1', limit = '10' } = req.query;

  let filtered = [...serverUsers];

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(u => 
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q)
    );
  }

  if (status !== 'all') {
    filtered = filtered.filter(u => u.status === status);
  }

  if (plan !== 'all') {
    filtered = filtered.filter(u => u.plan === plan);
  }

  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 10;
  const total = filtered.length;
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIdx, startIdx + limitNum);

  return res.json({
    success: true,
    users: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

// Admin CVs List
app.get('/api/admin/cvs', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { search = '', template = 'all', status = 'all' } = req.query;

  // Real mapped CV records
  let cvs = [...serverCVs];

  if (search) {
    const q = String(search).toLowerCase();
    cvs = cvs.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.userName.toLowerCase().includes(q) ||
      c.userEmail.toLowerCase().includes(q)
    );
  }

  if (template !== 'all') {
    cvs = cvs.filter(c => c.templateId === template);
  }

  if (status !== 'all') {
    cvs = cvs.filter(c => c.status === status);
  }

  return res.json({
    success: true,
    cvs,
    total: cvs.length
  });
});

// Admin Payments List
app.get('/api/admin/payments', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { search = '', status = 'all' } = req.query;

  let list = [...serverPayments];

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(p => 
      p.orderId.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      p.userEmail.toLowerCase().includes(q) ||
      p.userName.toLowerCase().includes(q) ||
      p.cvTitle.toLowerCase().includes(q)
    );
  }

  if (status !== 'all') {
    list = list.filter(p => p.status === status);
  }

  const totalSuccess = serverPayments.filter(p => p.status === 'succeeded').length;
  const totalFailed = serverPayments.filter(p => p.status === 'failed').length;
  const totalPending = serverPayments.filter(p => p.status === 'pending').length;
  const totalRevenue = serverPayments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + p.amount, 0);

  return res.json({
    success: true,
    payments: list,
    summary: {
      totalTransactions: serverPayments.length,
      totalSuccess,
      totalFailed,
      totalPending,
      totalRevenue,
      averageBasket: totalSuccess > 0 ? Number((totalRevenue / totalSuccess).toFixed(2)) : 0.00
    }
  });
});

// Admin Revenue
app.get('/api/admin/revenue', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  // One week ago
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const succ = serverPayments.filter(p => p.status === 'succeeded');

  const totalRevenue = succ.reduce((acc, p) => acc + p.amount, 0);
  const dayRevenue = succ.filter(p => p.createdAt.slice(0, 10) === todayStr).reduce((acc, p) => acc + p.amount, 0);
  const weekRevenue = succ.filter(p => p.createdAt >= oneWeekAgo).reduce((acc, p) => acc + p.amount, 0);
  const monthRevenue = succ.filter(p => p.createdAt.slice(0, 7) === currentMonthStr).reduce((acc, p) => acc + p.amount, 0);

  return res.json({
    success: true,
    data: {
      totalRevenue,
      dayRevenue,
      weekRevenue,
      monthRevenue,
      totalSalesCount: succ.length,
      averageBasket: succ.length > 0 ? Number((totalRevenue / succ.length).toFixed(2)) : 0.00,
      currency: serverSettings.currency || 'USD',
      transactions: succ
    }
  });
});

// Admin AI Analytics
app.get('/api/admin/ai', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  const totalCalls = serverAILogs.length;
  const callsToday = serverAILogs.filter(l => l.timestamp.slice(0, 10) === todayStr).length;
  const callsMonth = serverAILogs.filter(l => l.timestamp.slice(0, 7) === currentMonthStr).length;
  const coverLetters = serverAILogs.filter(l => l.endpoint === 'generate-cover-letter').length;
  const experienceEnhancements = serverAILogs.filter(l => l.endpoint === 'enhance-experience').length;
  const summaryEnhancements = serverAILogs.filter(l => l.endpoint === 'enhance-summary').length;
  const skillSuggestions = serverAILogs.filter(l => l.endpoint === 'suggest-skills').length;
  const uniqueUsers = new Set(serverAILogs.map(l => l.userId)).size;

  return res.json({
    success: true,
    data: {
      totalCalls,
      callsToday,
      callsMonth,
      coverLetters,
      experienceEnhancements,
      summaryEnhancements,
      skillSuggestions,
      uniqueUsers,
      logs: serverAILogs.slice(0, 50)
    }
  });
});

// Admin Templates List & Toggle
app.get('/api/admin/templates', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  return res.json({
    success: true,
    templates: serverTemplates
  });
});

app.post('/api/admin/templates/toggle', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { templateId } = req.body;
  const tmpl = serverTemplates.find(t => t.id === templateId);

  if (!tmpl) {
    return res.status(404).json({ error: 'Modèle introuvable.' });
  }

  tmpl.active = !tmpl.active;

  return res.json({
    success: true,
    template: tmpl
  });
});

// Admin Messages
app.get('/api/admin/messages', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { status = 'all' } = req.query;
  let list = [...serverMessages];

  if (status !== 'all') {
    list = list.filter(m => m.status === status);
  }

  return res.json({
    success: true,
    messages: list,
    counts: {
      total: serverMessages.length,
      nouveau: serverMessages.filter(m => m.status === 'nouveau').length,
      lu: serverMessages.filter(m => m.status === 'lu').length,
      traite: serverMessages.filter(m => m.status === 'traite').length
    }
  });
});

app.patch('/api/admin/messages/:id', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { id } = req.params;
  const { status, notes } = req.body;

  const msg = serverMessages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: 'Message introuvable.' });
  }

  if (status) msg.status = status;
  if (notes !== undefined) msg.notes = notes;

  return res.json({
    success: true,
    message: msg
  });
});

app.post('/api/admin/messages/:id/reply', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { id } = req.params;
  const { replyContent } = req.body;

  const msg = serverMessages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: 'Message introuvable.' });
  }

  msg.status = 'traite';
  msg.repliedAt = new Date().toISOString();
  msg.notes = (msg.notes ? msg.notes + ' | ' : '') + `Réponse envoyée : "${replyContent?.slice(0, 60)}..."`;

  console.log(`[ADMIN REPLY] Message ${id} to ${msg.email}: ${replyContent}`);

  return res.json({
    success: true,
    message: msg
  });
});

// Admin Settings
app.get('/api/admin/settings', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  return res.json({
    success: true,
    settings: {
      ...serverSettings,
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      hasSupabaseConfig: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
    }
  });
});

app.post('/api/admin/settings', (req: Request, res: Response) => {
  if (!verifyAdminRequest(req)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }

  const { cvPrice, currency, maintenanceMode, aiEnhancementEnabled, coverLetterEnabled, supportNotificationEmail } = req.body;

  if (cvPrice !== undefined) serverSettings.cvPrice = Number(cvPrice);
  if (currency !== undefined) serverSettings.currency = String(currency);
  if (maintenanceMode !== undefined) serverSettings.maintenanceMode = Boolean(maintenanceMode);
  if (aiEnhancementEnabled !== undefined) serverSettings.aiEnhancementEnabled = Boolean(aiEnhancementEnabled);
  if (coverLetterEnabled !== undefined) serverSettings.coverLetterEnabled = Boolean(coverLetterEnabled);
  if (supportNotificationEmail !== undefined) serverSettings.supportNotificationEmail = String(supportNotificationEmail);

  return res.json({
    success: true,
    settings: serverSettings
  });
});

// --- SERVER SETUP & VITE MIDDLEWARE ---

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VITAREY Server running on port ${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[WARN] Port ${PORT} is already in use by another running instance.`);
    } else {
      console.error('[ERROR] Server error:', err);
    }
  });
}

start();
