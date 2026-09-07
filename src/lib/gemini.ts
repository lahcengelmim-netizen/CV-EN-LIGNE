import { GoogleGenAI } from '@google/genai';

/**
 * Service Client Gemini (@google/genai)
 *
 * Utilise le SDK officiel @google/genai
 * Clé d'API : import.meta.env.VITE_GEMINI_API_KEY ou process.env.GEMINI_API_KEY
 * Modèle par défaut : gemini-2.5-flash (avec repli automatique sur gemini-3.6-flash si 2.5 n'est plus distribué)
 */

const PRIMARY_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-3.6-flash';

/**
 * Initialise l'instance GoogleGenAI avec gestion d'erreurs et types stricts
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined'
      ? process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY
      : undefined);

  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    const errorMsg =
      'Clé API manquante. Veuillez définir VITE_GEMINI_API_KEY dans votre fichier .env.local.';
    console.error('❌ [Gemini SDK]', errorMsg);
    throw new Error(errorMsg);
  }

  return new GoogleGenAI({ apiKey });
}

// Alias de rétrocompatibilité
export const getClientAI = getGeminiClient;

/**
 * Exécute une génération avec tentative sur le modèle principal puis repli sur le modèle alternatif
 */
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  options?: {
    systemInstruction?: string;
    temperature?: number;
    jsonSchema?: boolean;
    preferredModel?: string;
  }
): Promise<string> {
  const preferredModel = options?.preferredModel || PRIMARY_MODEL;
  const config: Record<string, any> = {
    temperature: options?.temperature ?? 0.4,
  };

  if (options?.jsonSchema) {
    config.responseMimeType = 'application/json';
  }

  if (options?.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }

  try {
    const response = await ai.models.generateContent({
      model: preferredModel,
      contents: prompt,
      config,
    });
    return response.text || '';
  } catch (err: any) {
    const isModelUnavailable =
      err?.status === 404 ||
      err?.message?.includes('no longer available') ||
      err?.message?.includes('not found') ||
      err?.message?.includes('is not supported');

    if (isModelUnavailable && preferredModel !== FALLBACK_MODEL) {
      console.warn(
        `⚠️ [Gemini SDK] Modèle ${preferredModel} indisponible, bascule automatique sur ${FALLBACK_MODEL}...`
      );
      const fallbackResponse = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
        config,
      });
      return fallbackResponse.text || '';
    }

    throw err;
  }
}

/* =========================================================================
   1. AMÉLIORATION DU PROFIL / RÉSUMÉ PROFESSIONNEL
   ========================================================================= */

export interface EnhanceProfileParams {
  jobTitle?: string;
  skills?: string[];
  currentSummary?: string;
  language?: string; // 'fr' | 'en' | 'ar'
}

export interface EnhanceProfileResult {
  improvedSummary: string;
  highlightKeywords: string[];
}

// Type d'entrée rétrocompatible
export interface SummaryEnhanceInput {
  rawSummary: string;
  jobTitle?: string;
  skills?: string[];
  lang?: string;
}

export interface SummaryEnhanceOutput {
  improvedSummary: string;
  highlightKeywords: string[];
}

/**
 * Améliore ou génère une accroche de profil percutante selon le poste et les compétences
 */
export async function enhanceProfileSummary(
  params: EnhanceProfileParams
): Promise<EnhanceProfileResult> {
  const {
    jobTitle = 'Professionnel',
    skills = [],
    currentSummary = '',
    language = 'fr',
  } = params;

  try {
    const ai = getGeminiClient();

    const langLabel =
      language === 'ar' ? 'Arabe' : language === 'en' ? 'Anglais' : 'Français';

    const systemInstruction = `[VITAREY AI Assistant] Tu es l'intelligence artificielle experte de VITAREY, spécialiste du recrutement certifié ATS. Rédige des résumés professionnels captivants, concis (3 à 4 phrases d'impact) et optimisés pour les algorithmes de recrutement. Ne fabrique aucune fausse expérience. Réponds toujours en ${langLabel}.`;

    const prompt = `
Optimise le profil professionnel suivant pour un CV percutant :
- Métier visé : "${jobTitle}"
- Compétences clés : ${skills.length > 0 ? skills.join(', ') : 'Non spécifiées'}
- Texte actuel (s'il existe) : "${currentSummary.trim() || 'Aucun texte fourni, génère une excellente présentation type adaptée au métier.'}"

Format de réponse OBLIGATOIRE en JSON valide :
{
  "improvedSummary": "Texte complet du résumé professionnel en 3-4 phrases fluides et valorisantes.",
  "highlightKeywords": ["Mot-clé 1", "Mot-clé 2", "Mot-clé 3", "Mot-clé 4"]
}
`;

    console.info('[Gemini SDK] Optimisation du profil professionnel en cours...');
    const rawOutput = await callGeminiWithFallback(ai, prompt, {
      systemInstruction,
      jsonSchema: true,
      temperature: 0.3,
    });

    const parsed: EnhanceProfileResult = JSON.parse(rawOutput || '{}');

    if (!parsed.improvedSummary) {
      throw new Error('Format de réponse invalide reçu de Gemini.');
    }

    return {
      improvedSummary: parsed.improvedSummary.trim(),
      highlightKeywords: parsed.highlightKeywords || [],
    };
  } catch (error: any) {
    console.error('❌ [Gemini SDK] Erreur enhanceProfileSummary :', {
      message: error?.message,
      status: error?.status,
      error,
    });
    throw error;
  }
}

// Fonction de rétrocompatibilité pour les composants existants
export async function optimizeSummaryClient(
  input: SummaryEnhanceInput
): Promise<SummaryEnhanceOutput> {
  return enhanceProfileSummary({
    jobTitle: input.jobTitle,
    skills: input.skills,
    currentSummary: input.rawSummary,
    language: input.lang,
  });
}

/* =========================================================================
   2. RÉÉCRITURE DES MISSIONS EN PUCES OPTIMISÉES ATS
   ========================================================================= */

export interface OptimizeExperienceTasksParams {
  position: string;
  company?: string;
  tasks: string[];
  description?: string;
  language?: string;
}

export interface OptimizeExperienceTasksResult {
  improvedTasks: string[];
  improvedDescription?: string;
  advice?: string;
}

/**
 * Réécrit et formate les tâches d'une expérience en puces d'action percutantes selon les normes ATS
 */
export async function formatExperienceTasks(
  params: OptimizeExperienceTasksParams
): Promise<OptimizeExperienceTasksResult> {
  const {
    position,
    company = '',
    tasks = [],
    description = '',
    language = 'fr',
  } = params;

  try {
    const ai = getGeminiClient();

    const langLabel =
      language === 'ar' ? 'Arabe' : language === 'en' ? 'Anglais' : 'Français';

    const cleanTasks = tasks.filter((t) => t && t.trim().length > 0);

    const systemInstruction = `[VITAREY AI Assistant] Tu es l'assistant de recrutement intelligent de VITAREY, spécialiste des normes ATS (Applicant Tracking Systems). Tu transformes les listes de tâches passives en puces de réalisations percutantes : Verbe d'action à l'infinitif + Contexte/Outil + Impact/Résultat mesurable ou méthode. Langue de rédaction : ${langLabel}.`;

    const prompt = `
Optimise les missions de l'expérience professionnelle suivante pour un CV de haut niveau :
- Intitulé du poste : "${position}"
- Entreprise / Contexte : "${company}"
- Description générale : "${description}"
- Missions actuelles saisies : ${
      cleanTasks.length > 0
        ? JSON.stringify(cleanTasks)
        : 'Aucune tâche spécifique saisie, génère 4 à 5 tâches réalistes et percutantes pour ce métier.'
    }

Règles de style ATS :
- Chaque puce commence par un verbe d'action fort à l'infinitif (ex: Concevoir, Développer, Piloter, Optimiser, Négocier).
- Intègre des technologies ou méthodes appropriées pour le poste.
- Pas de puces vagues comme "Travail d'équipe" ou "Aide aux collègues".
- Génère 4 à 5 puces complètes et concrètes.

Réponds STRICTEMENT sous forme de JSON valide :
{
  "improvedTasks": [
    "Puce 1 optimisée avec verbe d'action fort et contexte",
    "Puce 2 optimisée",
    "Puce 3 optimisée",
    "Puce 4 optimisée"
  ],
  "improvedDescription": "Courte synthèse globale de la mission (1 phrase)",
  "advice": "Un conseil court pour l'entretien d'embauche sur cette expérience"
}
`;

    console.info(`[Gemini SDK] Optimisation ATS des missions pour : "${position}"...`);
    const rawOutput = await callGeminiWithFallback(ai, prompt, {
      systemInstruction,
      jsonSchema: true,
      temperature: 0.4,
    });

    const parsed: OptimizeExperienceTasksResult = JSON.parse(rawOutput || '{}');

    if (!Array.isArray(parsed.improvedTasks) || parsed.improvedTasks.length === 0) {
      throw new Error("L'IA n'a pas retourné de liste de tâches valide.");
    }

    // Nettoyage supplémentaire des puces (suppression des tirets résiduels ou astérisques)
    const cleanedList = parsed.improvedTasks.map((t) =>
      t.replace(/^[\s*•\-–—\d.)]+/, '').replace(/\*\*/g, '').trim()
    );

    return {
      improvedTasks: cleanedList,
      improvedDescription: parsed.improvedDescription?.trim(),
      advice: parsed.advice?.trim(),
    };
  } catch (error: any) {
    console.error('❌ [Gemini SDK] Erreur formatExperienceTasks :', {
      message: error?.message,
      status: error?.status,
      error,
    });
    throw error;
  }
}

/* =========================================================================
   3. GÉNÉRATION DE LETTRE DE MOTIVATION
   ========================================================================= */

export interface GenerateCoverLetterParams {
  fullName?: string;
  jobTitle: string;
  companyName?: string;
  skills?: string[];
  experienceSummary?: string;
  userExperience?: string;
  jobOfferText?: string;
  tone?: 'professional' | 'dynamic' | 'creative';
  language?: 'fr' | 'ar' | 'en' | string;
  lang?: 'fr' | 'ar' | 'en' | string;
}

export interface GenerateCoverLetterResult {
  subject: string;
  content: string;
}

/**
 * Rédige une lettre de motivation personnalisée, fluide et adaptée au poste visé.
 * Supporte à la fois la signature positionnelle (jobTitle, companyName, userExperience, lang) -> Promise<string>
 * et la signature par objet (params) -> Promise<GenerateCoverLetterResult>.
 */
export async function generateCoverLetter(
  jobTitle: string,
  companyName?: string,
  userExperience?: string,
  lang?: 'fr' | 'ar' | 'en' | string
): Promise<string>;
export async function generateCoverLetter(
  params: GenerateCoverLetterParams
): Promise<GenerateCoverLetterResult>;
export async function generateCoverLetter(
  jobTitleOrParams: string | GenerateCoverLetterParams,
  companyNameArg?: string,
  userExperienceArg?: string,
  langArg?: 'fr' | 'ar' | 'en' | string
): Promise<string | GenerateCoverLetterResult> {
  let isPositionalCall = false;
  let fullName = 'Candidat';
  let jobTitle = '';
  let companyName = "l'entreprise";
  let skills: string[] = [];
  let experienceSummary = '';
  let jobOfferText = '';
  let tone: 'professional' | 'dynamic' | 'creative' = 'professional';
  let language: 'fr' | 'ar' | 'en' | string = 'fr';

  if (typeof jobTitleOrParams === 'string') {
    isPositionalCall = true;
    jobTitle = jobTitleOrParams;
    companyName = companyNameArg || "l'entreprise";
    experienceSummary = userExperienceArg || '';
    language = (langArg as any) || 'fr';
  } else {
    fullName = jobTitleOrParams.fullName || 'Candidat';
    jobTitle = jobTitleOrParams.jobTitle;
    companyName = jobTitleOrParams.companyName || "l'entreprise";
    skills = jobTitleOrParams.skills || [];
    experienceSummary =
      jobTitleOrParams.experienceSummary ||
      jobTitleOrParams.userExperience ||
      '';
    jobOfferText = jobTitleOrParams.jobOfferText || '';
    tone = jobTitleOrParams.tone || 'professional';
    language =
      jobTitleOrParams.language || jobTitleOrParams.lang || 'fr';
  }

  try {
    const ai = getGeminiClient();

    const langLabel =
      language === 'ar' ? 'Arabe' : language === 'en' ? 'Anglais' : 'Français';

    const toneInstruction =
      tone === 'dynamic'
        ? 'Ton moderne, proactif, orienté impact et énergie.'
        : tone === 'creative'
        ? 'Ton original, engageant, mettant en avant l innovation.'
        : 'Ton formel, soigné, élégant et très professionnel.';

    const systemInstruction = `[VITAREY AI Assistant] Tu es l'expert en rédaction professionnelle de VITAREY (créateur de CV et lettres de motivation d'exception). Rédige une lettre de motivation captivante, personnalisée et soignée, adaptée aux standards de recrutement actuels. La lettre doit comporter une formule de politesse adaptée, un développement argumenté valorisant les compétences et expériences en rapport avec le poste et l'entreprise, et une formule de conclusion polie. Langue de rédaction : ${langLabel}.`;

    const prompt = `
Rédige une lettre de motivation sur-mesure pour ce profil :
- Métier / Poste visé : ${jobTitle || 'Professionnel qualifié'}
- Entreprise ciblée : ${companyName || 'Entreprise d accueil'}
- Parcours / Expériences et compétences : ${experienceSummary || skills.join(', ') || 'Expérience solide et polyvalence'}
${fullName && fullName !== 'Candidat' ? `- Nom du candidat : ${fullName}` : ''}
${jobOfferText ? `- Détails de l'annonce : ${jobOfferText}` : ''}
- Ton : ${toneInstruction}

Réponds STRICTEMENT sous format JSON valide avec la structure suivante :
{
  "subject": "Objet précis de la candidature (ex: Candidature au poste de ...)",
  "content": "Corps complet et fluide de la lettre de motivation (séparer les paragraphes par des sauts de ligne \\n\\n)"
}
`;

    console.info(`[Gemini SDK] Appel gemini-2.5-flash pour lettre de motivation ("${jobTitle}")...`);
    const rawOutput = await callGeminiWithFallback(ai, prompt, {
      systemInstruction,
      jsonSchema: true,
      temperature: 0.5,
      preferredModel: 'gemini-2.5-flash',
    });

    const parsed = JSON.parse(rawOutput || '{}');

    const resultSubject = parsed.subject ? parsed.subject.trim() : `Candidature - ${jobTitle}`;
    const resultContent = parsed.content ? parsed.content.trim() : rawOutput.trim();

    if (!resultContent) {
      throw new Error('Aucun texte de lettre de motivation généré.');
    }

    if (isPositionalCall) {
      return resultContent;
    }

    return {
      subject: resultSubject,
      content: resultContent,
    };
  } catch (error: any) {
    console.error('❌ [Gemini SDK] Erreur generateCoverLetter :', {
      message: error?.message,
      status: error?.status,
      error,
    });
    throw error;
  }
}
