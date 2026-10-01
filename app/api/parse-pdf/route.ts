import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sortExperiencesByDate, sortEducationByDate } from '../../../src/lib/dateSorter';

/**
 * Expected Structured JSON Output Interface for Parsed CV Details
 */
export interface ParsedCVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    jobTitle: string;
    summary: string;
    links?: string[];
  };
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate: string;
    grade?: string;
  }>;
  skills: string[];
  languages: string[];
  certifications?: string[];
}

/**
 * Helper to clean Markdown code block wrappers (` ```json ... ``` `)
 * from Gemini's raw output string to ensure valid JSON parsing.
 */
function extractRawJsonString(rawText: string): string {
  let cleaned = rawText.trim();

  // Remove leading ```json or ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '');
  }

  // Remove trailing ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/i, '');
  }

  // Fallback: If there are still enclosing braces, locate outermost { ... }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

/**
 * Helper to safely sanitize extracted strings, stripping "null", "N/A", etc.
 */
function cleanStr(val: unknown): string {
  if (typeof val !== 'string') return '';
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();
  const placeholders = [
    'null', 'undefined', 'n/a', 'na', 'none', 'aucun', 'aucune',
    'not provided', 'not specified', 'unknown', 'inconnu',
    'non renseigné', 'non renseigne', 'non fourni', 'non spécifié',
    'non specifie', 'n/d', 'n.d.', '-', '--', '...', 'sans objet'
  ];
  if (placeholders.includes(lower)) {
    return '';
  }
  return trimmed;
}

/**
 * Next.js App Router POST Handler: /api/parse-pdf
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Gemini API Key configuration
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.error('❌ [API /api/parse-pdf] Missing GEMINI_API_KEY environment variable.');
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in your .env.local file.',
        },
        { status: 500 }
      );
    }

    // 2. Extract Base64 PDF Data (supporting both JSON payload & multipart/form-data)
    let pdfBase64 = '';
    let fileName = 'resume.pdf';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // Body payload: { pdfBase64: string, fileName?: string }
      const body = await req.json().catch(() => null);
      if (!body) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid JSON request body.',
          },
          { status: 400 }
        );
      }

      const rawBase64 = body.pdfBase64 || body.fileBase64 || body.base64;
      if (!rawBase64 || typeof rawBase64 !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required "pdfBase64" property in request body.',
          },
          { status: 400 }
        );
      }

      // Strip potential Data URI scheme prefix (e.g. data:application/pdf;base64,)
      pdfBase64 = rawBase64.replace(/^data:application\/pdf;base64,/, '').trim();
      if (body.fileName && typeof body.fileName === 'string') {
        fileName = body.fileName;
      }
    } else if (contentType.includes('multipart/form-data')) {
      // Form-data upload: file field containing PDF
      const formData = await req.formData().catch(() => null);
      if (!formData) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid multipart/form-data request.',
          },
          { status: 400 }
        );
      }

      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json(
          {
            success: false,
            error: 'No file found in the "file" form-data field.',
          },
          { status: 400 }
        );
      }

      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        return NextResponse.json(
          {
            success: false,
            error: 'Uploaded file must be a PDF document (.pdf).',
          },
          { status: 400 }
        );
      }

      fileName = file.name;
      const arrayBuffer = await file.arrayBuffer();
      pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported Content-Type. Please use application/json or multipart/form-data.',
        },
        { status: 415 }
      );
    }

    // 3. Validate extracted Base64 content
    if (!pdfBase64 || pdfBase64.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'PDF data is empty or invalid.',
        },
        { status: 400 }
      );
    }

    // Quick verification: check if decoded buffer starts with PDF magic number "%PDF"
    const prefixBuffer = Buffer.from(pdfBase64.slice(0, 32), 'base64');
    if (!prefixBuffer.toString('ascii').includes('%PDF')) {
      return NextResponse.json(
        {
          success: false,
          error: 'The provided data is not a valid PDF document (missing %PDF header).',
        },
        { status: 400 }
      );
    }

    // 4. Initialize Google Generative AI SDK with modern Gemini model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const extractionPrompt = `You are an expert HR recruitment specialist and resume parser.
Analyze this resume/CV PDF document and extract all key candidate details into a clean, structured JSON object.

Follow these strict extraction guidelines:
1. Extract data ONLY from legitimate content pages. Skip any blank, decorative, or trailing empty pages.
2. Structure the output strictly matching this JSON schema:
{
  "personalInfo": {
    "fullName": "Candidate full name",
    "email": "Email address",
    "phone": "Phone number",
    "address": "City, Country or Address",
    "jobTitle": "Current or targeted professional title",
    "summary": "Professional executive summary / bio",
    "links": ["Portfolio, LinkedIn, GitHub, etc."]
  },
  "workExperience": [
    {
      "jobTitle": "Job Title",
      "company": "Company Name",
      "location": "City, Country or Remote (optional)",
      "startDate": "Start Date (e.g. Month Year)",
      "endDate": "End Date or Present",
      "description": "Responsibilities, achievements, and impact"
    }
  ],
  "education": [
    {
      "degree": "Degree / Diploma / Certification",
      "institution": "University / School",
      "location": "City, Country (optional)",
      "startDate": "Start Year / Date",
      "endDate": "End Year / Date"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "languages": ["Language 1", "Language 2"],
  "certifications": ["Certification 1"]
}
3. MANDATORY REVERSE CHRONOLOGICAL ORDER: Sort BOTH "workExperience" AND "education" in strict reverse chronological order (newest first, oldest at the bottom). Any current/ongoing job or study must be at the very top.
4. If a field is not present in the document, use an empty string "" or empty array []. Do not output "null", "N/A", or "Not provided".
5. Return strictly the JSON object.`;

    // 5. Call Gemini 1.5 Flash with the PDF base64 inline data
    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBase64,
          mimeType: 'application/pdf',
        },
      },
      extractionPrompt,
    ]);

    const candidateResponse = result.response;
    const rawResponseText = candidateResponse.text();

    if (!rawResponseText || rawResponseText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Gemini returned an empty response. The document might be password-protected or unreadable.',
        },
        { status: 500 }
      );
    }

    // 6. Clean raw response: Strip markdown code blocks (```json ... ```)
    const cleanedJsonText = extractRawJsonString(rawResponseText);

    // 7. Parse the cleaned JSON string
    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanedJsonText);
    } catch (parseError: any) {
      console.error('❌ [API /api/parse-pdf] Failed to parse JSON from Gemini output:', {
        raw: rawResponseText.slice(0, 300),
        cleaned: cleanedJsonText.slice(0, 300),
        error: parseError?.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse structured JSON from the AI response.',
          rawOutput: rawResponseText.slice(0, 500),
        },
        { status: 500 }
      );
    }

    // 8. Sanitize and structure final result
    const rawWorkExperience = Array.isArray(parsedData?.workExperience)
      ? parsedData.workExperience
          .map((exp: any) => ({
            jobTitle: cleanStr(exp?.jobTitle),
            company: cleanStr(exp?.company),
            location: cleanStr(exp?.location),
            startDate: cleanStr(exp?.startDate),
            endDate: cleanStr(exp?.endDate),
            description: cleanStr(exp?.description),
          }))
          .filter((exp: any) => Boolean(exp.jobTitle || exp.company || exp.description))
      : [];

    const rawEducation = Array.isArray(parsedData?.education)
      ? parsedData.education
          .map((edu: any) => ({
            degree: cleanStr(edu?.degree),
            institution: cleanStr(edu?.institution),
            location: cleanStr(edu?.location),
            startDate: cleanStr(edu?.startDate),
            endDate: cleanStr(edu?.endDate),
          }))
          .filter((edu: any) => Boolean(edu.degree || edu.institution))
      : [];

    const sanitizedResult: ParsedCVData = {
      personalInfo: {
        fullName: cleanStr(parsedData?.personalInfo?.fullName),
        email: cleanStr(parsedData?.personalInfo?.email),
        phone: cleanStr(parsedData?.personalInfo?.phone),
        address: cleanStr(parsedData?.personalInfo?.address),
        jobTitle: cleanStr(parsedData?.personalInfo?.jobTitle),
        summary: cleanStr(parsedData?.personalInfo?.summary),
        links: Array.isArray(parsedData?.personalInfo?.links)
          ? parsedData.personalInfo.links.map(cleanStr).filter(Boolean)
          : [],
      },
      workExperience: sortExperiencesByDate(rawWorkExperience),
      education: sortEducationByDate(rawEducation),
      skills: Array.isArray(parsedData?.skills)
        ? Array.from(new Set(parsedData.skills.map(cleanStr).filter(Boolean)))
        : [],
      languages: Array.isArray(parsedData?.languages)
        ? Array.from(new Set(parsedData.languages.map(cleanStr).filter(Boolean)))
        : [],
      certifications: Array.isArray(parsedData?.certifications)
        ? Array.from(new Set(parsedData.certifications.map(cleanStr).filter(Boolean)))
        : [],
    };

    // 9. Always return structured JSON response
    return NextResponse.json(
      {
        success: true,
        data: sanitizedResult,
        metadata: {
          fileName,
          model: 'gemini-1.5-flash',
          parsedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // 10. Strict catch-all: NEVER return an HTML error page, always return valid JSON
    console.error('❌ [API /api/parse-pdf] Server error during PDF processing:', error);

    const errorMessage = error?.message || 'An unexpected error occurred while processing the PDF.';
    const statusCode = error?.status && typeof error.status === 'number' && error.status >= 400 && error.status < 600
      ? error.status
      : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
