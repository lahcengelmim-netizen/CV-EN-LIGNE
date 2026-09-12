/**
 * Next.js App Router API Route: /api/parse-cv
 * Compatible with Next.js 13/14/15/16 App Router (app/api/parse-cv/route.ts)
 * 
 * Multi-page PDF Resume Parser using @google/generative-ai and gemini-1.5-flash.
 * Filters out blank/empty pages and cleans output (strips nulls, empty items, empty strings).
 */

import { GoogleGenAI, Type } from '@google/genai';
import type { ParsedResumeData } from '../../types/resumeParser';
import { sortExperiencesByDate } from '../../lib/dateSorter';

// Next.js App Router compatible Web Standard types
type NextRequest = Request;
const NextResponse = {
  json: (data: any, init?: ResponseInit) => Response.json(data, init),
};

// Robust Gemini API key resolver with console diagnostics for Next.js API route
function getGeminiApiKeyForRoute(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.VITE_GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.error('================================================================');
    console.error('❌ [API ROUTE ERROR] Clé API Gemini manquante dans /api/parse-cv');
    console.error('   process.env.GEMINI_API_KEY : ' + (process.env.GEMINI_API_KEY ? 'définie mais vide ou placeholder' : 'indéfinie'));
    console.error('   process.env.VITE_GEMINI_API_KEY : ' + (process.env.VITE_GEMINI_API_KEY ? 'définie mais vide ou placeholder' : 'indéfinie'));
    console.error('   💡 Pour résoudre ce problème :');
    console.error('   1. Ajoutez GEMINI_API_KEY="votre_cle" dans votre fichier .env.local');
    console.error('   2. Redémarrez le serveur de développement.');
    console.error('================================================================');

    throw new Error('Clé API Gemini introuvable ou non configurée. Veuillez définir GEMINI_API_KEY dans votre fichier .env.local.');
  }

  return apiKey;
}

// Strict Response Schema definition for gemini-3.6-flash
const resumeResponseSchema = {
  type: Type.OBJECT,
  description: 'Parsed resume data extracted strictly from pages containing relevant resume content.',
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      description: 'Candidate personal and contact information',
      properties: {
        fullName: { type: Type.STRING, description: 'Full candidate name' },
        email: { type: Type.STRING, description: 'Email address' },
        phone: { type: Type.STRING, description: 'Phone number' },
        address: { type: Type.STRING, description: 'Address, city, or country' },
        jobTitle: { type: Type.STRING, description: 'Current professional title or targeted job role' },
        summary: { type: Type.STRING, description: 'Executive summary or professional bio' },
      },
      required: ['fullName', 'email', 'phone', 'address', 'jobTitle', 'summary'],
    },
    workExperience: {
      type: Type.ARRAY,
      description: 'List of professional work experience entries across all relevant pages',
      items: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING, description: 'Job title or role' },
          company: { type: Type.STRING, description: 'Company or organization name' },
          startDate: { type: Type.STRING, description: 'Start date (e.g. Month Year or Year)' },
          endDate: { type: Type.STRING, description: 'End date or Present/Current' },
          description: { type: Type.STRING, description: 'Detailed duties, achievements, and responsibilities' },
        },
        required: ['jobTitle', 'company', 'startDate', 'endDate', 'description'],
      },
    },
    education: {
      type: Type.ARRAY,
      description: 'List of degrees, certifications, and educational credentials',
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING, description: 'Degree, diploma, or certification name' },
          institution: { type: Type.STRING, description: 'School, university, or institution name' },
          startDate: { type: Type.STRING, description: 'Start date or year' },
          endDate: { type: Type.STRING, description: 'Graduation date or year' },
        },
        required: ['degree', 'institution', 'startDate', 'endDate'],
      },
    },
    skills: {
      type: Type.ARRAY,
      description: 'List of hard, soft, and domain-specific skills',
      items: { type: Type.STRING },
    },
    languages: {
      type: Type.ARRAY,
      description: 'Languages spoken or written with proficiency levels if indicated',
      items: { type: Type.STRING },
    },
  },
  required: ['personalInfo', 'workExperience', 'education', 'skills', 'languages'],
};

/**
 * Strips out empty strings, null values, blank objects, and empty entries from the parsed JSON.
 */
function cleanAndFilterResumeData(raw: any, fileName: string): ParsedResumeData {
  const cleanStr = (val: any): string => (typeof val === 'string' ? val.trim() : '');

  // 1. Personal Info
  const personalInfo = {
    fullName: cleanStr(raw?.personalInfo?.fullName),
    email: cleanStr(raw?.personalInfo?.email),
    phone: cleanStr(raw?.personalInfo?.phone),
    address: cleanStr(raw?.personalInfo?.address),
    jobTitle: cleanStr(raw?.personalInfo?.jobTitle),
    summary: cleanStr(raw?.personalInfo?.summary),
  };

  // 2. Work Experience - omit entries that have no title and no company, or are entirely blank & sort reverse chronological
  const rawWork = Array.isArray(raw?.workExperience) ? raw.workExperience : [];
  const workExperience = sortExperiencesByDate(
    rawWork
      .map((item: any) => ({
        jobTitle: cleanStr(item?.jobTitle),
        company: cleanStr(item?.company),
        startDate: cleanStr(item?.startDate),
        endDate: cleanStr(item?.endDate),
        description: cleanStr(item?.description),
      }))
      .filter((item: any) => Boolean(item.jobTitle || item.company || item.description))
  );

  // 3. Education - omit entries that have no degree and no institution
  const rawEdu = Array.isArray(raw?.education) ? raw.education : [];
  const education = rawEdu
    .map((item: any) => ({
      degree: cleanStr(item?.degree),
      institution: cleanStr(item?.institution),
      startDate: cleanStr(item?.startDate),
      endDate: cleanStr(item?.endDate),
    }))
    .filter((item: any) => Boolean(item.degree || item.institution));

  // 4. Skills - filter out empty strings, nulls, duplicates
  const rawSkills = Array.isArray(raw?.skills) ? raw.skills : [];
  const skills: string[] = Array.from(
    new Set<string>(
      rawSkills
        .map((s: any) => cleanStr(s))
        .filter((s: string) => s.length > 0 && s.toLowerCase() !== 'null' && s.toLowerCase() !== 'n/a')
    )
  );

  // 5. Languages - filter out empty strings, nulls, duplicates
  const rawLangs = Array.isArray(raw?.languages) ? raw.languages : [];
  const languages: string[] = Array.from(
    new Set<string>(
      rawLangs
        .map((l: any) => cleanStr(l))
        .filter((l: string) => l.length > 0 && l.toLowerCase() !== 'null' && l.toLowerCase() !== 'n/a')
    )
  );

  return {
    personalInfo,
    workExperience,
    education,
    skills,
    languages,
    importedAt: new Date().toISOString(),
    sourceFileName: fileName,
  };
}

export async function POST(req: NextRequest) {
  try {
    let pdfBuffer: Buffer | null = null;
    let fileName = 'resume.pdf';

    const contentType = req.headers.get('content-type') || '';

    // 1. Handle multipart/form-data upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'Aucun fichier PDF fourni dans le champ "file".' },
          { status: 400 }
        );
      }

      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: 'Seuls les fichiers PDF sont acceptés.' },
          { status: 400 }
        );
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } 
    // 2. Handle JSON with base64 encoded PDF
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      const base64Input = body.fileBase64 || body.pdfBase64;
      if (!base64Input) {
        return NextResponse.json(
          { success: false, error: 'Veuillez fournir le paramètre fileBase64 ou pdfBase64.' },
          { status: 400 }
        );
      }
      const cleanBase64 = base64Input.replace(/^data:application\/pdf;base64,/, '');
      pdfBuffer = Buffer.from(cleanBase64, 'base64');
      if (body.fileName) fileName = body.fileName;
    } else {
      return NextResponse.json(
        { success: false, error: 'Content-Type non supporté. Utilisez multipart/form-data ou application/json.' },
        { status: 415 }
      );
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le fichier PDF est vide ou corrompu.' },
        { status: 400 }
      );
    }

    // Verify PDF header %PDF
    const header = pdfBuffer.subarray(0, 5).toString('ascii');
    if (!header.includes('%PDF')) {
      return NextResponse.json(
        { success: false, error: 'Le fichier transmis n\'est pas un document PDF valide.' },
        { status: 400 }
      );
    }

    // Initialize GoogleGenAI with gemini-3.6-flash
    const apiKey = getGeminiApiKeyForRoute();
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const pdfBase64 = pdfBuffer.toString('base64');

    // System prompt instructing multi-page handling and blank-page skipping
    const prompt = `You are a world-class HR and recruitment document parser specializing in multi-page resumes and CVs.
Analyze the attached multi-page PDF resume thoroughly with the following strict instructions:

1. MULTI-PAGE & BLANK PAGE FILTERING:
- Process all pages of the document, but extract data ONLY from pages containing actual relevant resume content.
- Completely ignore and skip any blank pages, decorative pages, cover sheets, separator pages, overflow margins, or trailing empty pages with no substantive candidate data.
- Seamlessly combine and synthesize work history, education, skills, and languages across all legitimate content pages into a single chronological timeline.

2. MANDATORY REVERSE CHRONOLOGICAL ORDER FOR WORK EXPERIENCE:
- CRITICAL: Automatically sort the extracted "workExperience" array in strict reverse chronological order (newest / most recent job first at index 0, oldest job at the bottom).
- Any current or ongoing job ("Present", "Current", "En cours", "Actuel", or open end date) MUST always be placed at the very top of the list.
- Followed by past jobs ordered from newest end date to oldest end date.

3. STRICT CLEAN OUTPUT (NO EMPTY / NULL VALUES):
- Extract factual details without inventing or hallucinating information.
- Strip out any empty strings, null values, placeholder markers ("N/A", "None", "Unknown"), or empty entries.
- If any workExperience item has no jobTitle and no company, omit that item completely.
- If any education item has no degree and no institution, omit that item completely.
- Return only non-empty, distinct skills and languages.

4. STRICT RESPONSE SCHEMA:
- personalInfo: fullName, email, phone, address, jobTitle, summary
- workExperience: array of { jobTitle, company, startDate, endDate, description } (MUST be pre-sorted: newest first, oldest last)
- education: array of { degree, institution, startDate, endDate }
- skills: array of strings
- languages: array of strings`;

    let responseText = '{}';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            inlineData: {
              data: pdfBase64,
              mimeType: 'application/pdf',
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: resumeResponseSchema,
          temperature: 0.1,
        },
      });
      responseText = response.text || '{}';
    } catch (primaryErr: any) {
      console.warn('[API /api/parse-cv] Retrying with gemini-3.8-flash fallback...', primaryErr?.message);
      const fallbackRes = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              data: pdfBase64,
              mimeType: 'application/pdf',
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: resumeResponseSchema,
          temperature: 0.1,
        },
      });
      responseText = fallbackRes.text || '{}';
    }

    let rawParsed: any;
    try {
      rawParsed = JSON.parse(responseText);
    } catch {
      const sanitized = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      rawParsed = JSON.parse(sanitized);
    }

    // Filter out blank pages artifacts, empty arrays, null values, or blank items
    const cleanedData = cleanAndFilterResumeData(rawParsed, fileName);

    return NextResponse.json({
      success: true,
      data: cleanedData,
      metadata: {
        fileName,
        sizeBytes: pdfBuffer.length,
        model: 'gemini-3.6-flash',
      },
    });
  } catch (error: any) {
    console.error('[API /api/parse-cv] Error parsing resume with gemini-1.5-flash:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Une erreur inattendue est survenue lors de l\'analyse du CV.',
      },
      { status: 500 }
    );
  }
}

