import { GoogleGenAI } from '@google/genai';

/**
 * Helper to initialize the Google Gen AI client with Vite's client-side environment variable.
 * Note: Exposing API keys on the client bundle (VITE_*) is convenient for client-side apps,
 * but for production apps handling private keys, prefer a server-side route (/api/...).
 */
const getAiClient = () => {
  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY));

  if (!apiKey) {
    throw new Error(
      'VITE_GEMINI_API_KEY ou GEMINI_API_KEY non définie. Veuillez ajouter votre clé dans votre fichier .env ou .env.local.'
    );
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates 4-5 high-impact, ATS-compliant resume tasks for a given job title.
 *
 * @param {string} jobTitle - The job title or prompt (e.g., "Web Developer", "Technicien IT")
 * @param {string} [language='fr'] - Target language code ('fr' for French, 'en' for English)
 * @returns {Promise<string[]>} Array of cleaned task description strings
 */
export async function generateResumeTasks(jobTitle, language = 'fr') {
  if (!jobTitle || typeof jobTitle !== 'string' || !jobTitle.trim()) {
    console.warn('[generateResumeTasks] Valid job title is required.');
    return [];
  }

  try {
    const ai = getAiClient();

    const systemInstruction = `You are a certified executive resume writer and ATS optimization specialist.
Generate 4 to 5 high-impact, results-driven professional tasks/bullet points for the specified job title.
Guidelines:
- Each bullet point MUST begin with a strong action verb.
- Highlight concrete responsibilities, methodologies, or quantifiable achievements.
- Adhere strictly to ATS standards.
- Write exclusively in ${language === 'fr' ? 'French' : language === 'en' ? 'English' : language}.
- Do NOT include conversational preambles, introductory greetings, or postscripts.
- Return each task on a new line starting with a bullet ("• ").`;

    const prompt = `Poste / Métier : "${jobTitle.trim()}". Génère 4-5 tâches professionnelles adaptées pour un CV moderne.`;

    console.info(`[generateResumeTasks] Requesting Gemini (gemini-3.6-flash) for: "${jobTitle}"...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';

    // Parse and clean bullets into an array of clean task strings
    const tasks = rawText
      .split('\n')
      .map((line) => line.replace(/^[\s*•\-–—\d.)]+/, '').replace(/\*\*/g, '').trim())
      .filter((task) => task.length > 5);

    console.info(`[generateResumeTasks] Successfully generated ${tasks.length} tasks.`);
    return tasks;
  } catch (error) {
    console.error('[generateResumeTasks] Failed to generate resume tasks:', {
      message: error?.message,
      stack: error?.stack,
      errorObj: error,
    });
    throw error;
  }
}
