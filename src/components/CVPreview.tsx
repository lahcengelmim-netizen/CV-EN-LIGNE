import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CVData, LanguageCode, TemplateId } from '../types';
import { CVRenderer } from './templates/CVRenderer';
import { CVTemplateModern } from './CVTemplateModern';
import { exportCVToPDF, triggerNativePrint } from '../lib/pdf';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  RotateCcw,
  Sparkles,
  FileText,
  ShieldCheck,
  Check,
  Loader2
} from 'lucide-react';
import './CVPreview.css';

// Fixed standard ISO 216 A4 Dimensions (210mm x 297mm at 96 DPI)
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_PX = 794; // 210mm in px at 96dpi
export const A4_HEIGHT_PX = 1123; // 297mm in px at 96dpi

export const PRESET_COLORS = [
  { id: 'royal', label: 'Bleu Royal', value: '#2563eb' },
  { id: 'navy', label: 'Bleu Marine', value: '#1e3a8a' },
  { id: 'black', label: 'Noir Élégant', value: '#0f172a' },
  { id: 'emerald', label: 'Vert Émeraude', value: '#047857' },
  { id: 'burgundy', label: 'Bordeaux', value: '#881337' },
  { id: 'charcoal', label: 'Gris Anthracite', value: '#334155' },
  { id: 'indigo', label: 'Indigo / Violet', value: '#4338ca' },
];

export const DEFAULT_CV_PREVIEW: CVData = {
  id: 'cv_preview_sample',
  title: 'CV Professionnel',
  templateId: 'modern',
  isPaid: true,
  language: 'fr',
  theme: {
    primaryColor: '#1e3a8a',
    fontFamily: 'sans',
    spacing: 'normal',
    showPhoto: true,
  },
  personalInfo: {
    firstName: 'Alexandre',
    lastName: 'Martin',
    title: 'Chef de Projet Digital & Tech',
    email: 'alexandre.martin@email.com',
    phone: '+33 6 12 34 56 78',
    city: 'Paris',
    country: 'France',
    linkedin: 'linkedin.com/in/alexandremartin',
    website: 'alexandremartin.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  summary:
    "Professionnel expérimenté avec 6 ans d'expertise dans le pilotage de projets numériques et l'animation d'équipes agiles. Rigoureux, orienté résultats et doté d'une forte culture technique et UX.",
  experiences: [
    {
      id: 'exp-1',
      position: 'Chef de Projet Senior',
      company: 'Tech Solutions Paris',
      city: 'Paris',
      startDate: '2021',
      endDate: '',
      current: true,
      description: "Coordination d'équipes pluridisciplinaires de 8 personnes et gestion d'un budget annuel de 500k€.",
      tasks: [
        'Pilotage des sprints Agile/Scrum et livraison continue de solutions SaaS',
        'Amélioration de la satisfaction client de 30% grâce à une refonte orientée accessibilité',
      ],
    },
    {
      id: 'exp-2',
      position: 'Chef de Projet Junior',
      company: 'Digital Wave Agency',
      city: 'Lyon',
      startDate: '2018',
      endDate: '2021',
      current: false,
      description: 'Conception de cahiers des charges fonctionnels et coordination opérationnelle.',
      tasks: [
        'Gestion de la relation client et planification de plus de 20 projets web et mobiles',
      ],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'Master Management de Projets Digitaux',
      institution: 'Université Paris-Dauphine',
      city: 'Paris',
      startDate: '2016',
      endDate: '2018',
      current: false,
      description: 'Spécialisation transformation numérique et pilotage stratégique.',
    },
    {
      id: 'edu-2',
      degree: 'Licence Économie & Gestion',
      institution: 'Université Paris 1 Panthéon-Sorbonne',
      city: 'Paris',
      startDate: '2013',
      endDate: '2016',
      current: false,
      description: 'Gestion de projet, analyse financière et statistiques appliquées.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Master Management de Projets Digitaux',
      institution: 'Université Paris-Dauphine',
      city: 'Paris',
      startDate: '2016',
      endDate: '2018',
      current: false,
      description: 'Spécialisation transformation numérique et pilotage stratégique.',
    },
    {
      id: 'edu-2',
      degree: 'Licence Économie & Gestion',
      institution: 'Université Paris 1 Panthéon-Sorbonne',
      city: 'Paris',
      startDate: '2013',
      endDate: '2016',
      current: false,
      description: 'Gestion de projet, analyse financière et statistiques appliquées.',
    },
  ],
  skills: [
    { id: 's-1', name: 'Gestion de projet', level: 5 },
    { id: 's-2', name: 'Agile & Scrum', level: 5 },
    { id: 's-3', name: 'React / Next.js', level: 4 },
    { id: 's-4', name: 'UI/UX Design', level: 4 },
    { id: 's-5', name: 'Jira & Notion', level: 5 },
    { id: 's-6', name: 'Data Analytics', level: 4 },
  ],
  languages: [
    { id: 'l-1', language: 'Français', name: 'Français', level: 'Langue maternelle' },
    { id: 'l-2', language: 'Anglais', name: 'Anglais', level: 'Courant (C1)' },
    { id: 'l-3', language: 'Espagnol', name: 'Espagnol', level: 'Intermédiaire (B2)' },
  ],
  certifications: [],
  projects: [],
};

export const DEFAULT_CV = {
  fullName: `${DEFAULT_CV_PREVIEW.personalInfo.firstName} ${DEFAULT_CV_PREVIEW.personalInfo.lastName}`,
  jobTitle: DEFAULT_CV_PREVIEW.personalInfo.title,
  email: DEFAULT_CV_PREVIEW.personalInfo.email,
  phone: DEFAULT_CV_PREVIEW.personalInfo.phone,
  city: DEFAULT_CV_PREVIEW.personalInfo.city,
  linkedin: DEFAULT_CV_PREVIEW.personalInfo.linkedin,
  summary: DEFAULT_CV_PREVIEW.summary,
  experiences: DEFAULT_CV_PREVIEW.experiences.map((exp) => ({
    id: exp.id,
    title: exp.position,
    company: exp.company,
    period: `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate || ''}`,
    desc: exp.description,
    tasks: exp.tasks || [],
  })),
  education: (DEFAULT_CV_PREVIEW.education || []).map((edu) => ({
    id: edu.id,
    degree: edu.degree,
    school: edu.institution,
    period: `${edu.startDate} - ${edu.endDate || ''}`,
    desc: edu.description,
  })),
  skills: DEFAULT_CV_PREVIEW.skills.map((s) => s.name),
  languages: DEFAULT_CV_PREVIEW.languages.map((l) => ({
    language: l.name || l.language,
    level: l.level,
  })),
};

export interface CVPreviewProps {
  data?: CVData;
  cv?: CVData;
  formData?: any;
  themeColor?: string;
  onColorChange?: (color: string) => void;
  onDownloadPdf?: () => void;
  onPrint?: () => void;
  isDownloading?: boolean;
  showWatermark?: boolean;
  zoom?: number;
  scale?: number;
  onZoomChange?: (zoom: number) => void;
  showToolbar?: boolean;
  showZoomControls?: boolean;
  title?: string;
  lang?: LanguageCode;
  t?: (key: string, fallback?: string) => string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * IsolatedIframe Component
 * Crée un environnement DOM 100% étanche pour le Template de CV :
 * - Clone toutes les feuilles de styles (<link> et <style>) du document hôte
 * - Bloque tout style global ou héritage CSS parasite (reset parent, flex parent, etc.)
 * - Injecte une feuille de style stricte pour le format A4 (210mm x 297mm)
 * - Rendu via React Portal pour conserver réactivité et synchronisation d'état
 */
export interface IsolatedIframeProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  scale?: number;
  onHeightChange?: (height: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const IsolatedIframe: React.FC<IsolatedIframeProps> = ({
  children,
  width = A4_WIDTH_PX,
  height = A4_HEIGHT_PX,
  scale = 1,
  onHeightChange,
  className = '',
  style = {},
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // Synchronise les styles du document parent vers l'iframe
  const copyStylesToIframe = useCallback((targetDoc: Document) => {
    if (!targetDoc || !targetDoc.head) return;

    // 1. Balise base pour résoudre les chemins relatifs (images, polices)
    if (!targetDoc.querySelector('base')) {
      const base = targetDoc.createElement('base');
      base.href = window.location.origin;
      targetDoc.head.appendChild(base);
    }

    // 2. Cloner les liens de polices et feuilles de style externes
    const parentLinks = document.querySelectorAll(
      'link[rel="stylesheet"], link[rel="preconnect"], link[rel="dns-prefetch"], link[as="font"]'
    );
    parentLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !targetDoc.querySelector(`link[href="${href}"]`)) {
        const cloned = link.cloneNode(true) as HTMLLinkElement;
        targetDoc.head.appendChild(cloned);
      }
    });

    // 3. Cloner toutes les balises <style> (Tailwind, styles personnalisés)
    const parentStyles = document.querySelectorAll('style');
    parentStyles.forEach((style, idx) => {
      const styleKey = style.id || `parent-injected-style-${idx}`;
      let targetStyle = targetDoc.getElementById(styleKey) as HTMLStyleElement | null;
      if (!targetStyle) {
        targetStyle = targetDoc.createElement('style');
        targetStyle.id = styleKey;
        targetDoc.head.appendChild(targetStyle);
      }
      if (targetStyle.textContent !== style.textContent) {
        targetStyle.textContent = style.textContent;
      }
    });

    // 4. Injecter les règles CSS d'isolation stricte A4 (210mm x 297mm)
    let isolationStyle = targetDoc.getElementById('cv-preview-isolation-rules') as HTMLStyleElement | null;
    if (!isolationStyle) {
      isolationStyle = targetDoc.createElement('style');
      isolationStyle.id = 'cv-preview-isolation-rules';
      isolationStyle.textContent = `
        @page {
          size: 210mm 297mm;
          margin: 0;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html {
          margin: 0;
          padding: 0;
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          overflow: visible;
        }
        body {
          margin: 0;
          padding: 0;
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          overflow: visible;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        #cv-iframe-mount-root {
          width: 210mm;
          min-height: 297mm;
          margin: 0;
          padding: 0;
          background: #ffffff;
          display: block;
        }
        /* Garantit le respect absolu des dimensions A4 sur le conteneur du CV */
        .cv-a4-sheet,
        .cv-print-container,
        #cv-printable-document {
          width: 210mm !important;
          min-width: 210mm !important;
          max-width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          background-color: #ffffff !important;
        }
        @media print {
          body {
            background: transparent !important;
          }
        }
      `;
      targetDoc.head.appendChild(isolationStyle);
    }
  }, []);

  // Initialisation de l'iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Assure une structure HTML valide
        if (!doc.head || !doc.body) {
          doc.open();
          doc.write('<!DOCTYPE html><html><head></head><body></body></html>');
          doc.close();
        }

        copyStylesToIframe(doc);

        // Crée le nœud de montage pour le portail React
        let root = doc.getElementById('cv-iframe-mount-root');
        if (!root) {
          root = doc.createElement('div');
          root.id = 'cv-iframe-mount-root';
          doc.body.appendChild(root);
        }
        setMountNode(root);

        // Observer la hauteur réelle du document pour ajuster la page si multi-pages
        if (typeof ResizeObserver !== 'undefined' && onHeightChange) {
          const resizeObserver = new ResizeObserver(() => {
            const currentHeight = Math.max(
              doc.body?.scrollHeight || A4_HEIGHT_PX,
              doc.documentElement?.scrollHeight || A4_HEIGHT_PX,
              A4_HEIGHT_PX
            );
            onHeightChange(currentHeight);
          });
          resizeObserver.observe(doc.body);
          return () => resizeObserver.disconnect();
        }
      } catch (err) {
        console.error('Erreur configuration iframe CVPreview:', err);
      }
    };

    if (iframe.contentDocument?.readyState === 'complete') {
      setupIframe();
    } else {
      iframe.addEventListener('load', setupIframe);
      return () => iframe.removeEventListener('load', setupIframe);
    }
  }, [copyStylesToIframe, onHeightChange]);

  // Observer les changements dynamiques de styles dans le document parent (Vite HMR, etc.)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        copyStylesToIframe(doc);
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [copyStylesToIframe]);

  return (
    <iframe
      ref={iframeRef}
      title="Aperçu CV A4 Isolé"
      tabIndex={-1}
      className={`cv-preview-iframe ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        border: 'none',
        outline: 'none',
        display: 'block',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        backgroundColor: '#ffffff',
        pointerEvents: 'auto',
        ...style,
      }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
};

/**
 * CVPreview / ApercuCV
 * Composant principal d'Aperçu du CV avec isolation iframe,
 * dimensions fixes A4 (210mm x 297mm) et scaling adaptatif / contrôles de zoom.
 */
export const CVPreview: React.FC<CVPreviewProps> = ({
  data,
  cv,
  formData,
  themeColor = '#1e3a8a',
  onColorChange,
  onDownloadPdf,
  onPrint,
  isDownloading = false,
  showWatermark = false,
  zoom,
  scale: controlledScale,
  onZoomChange,
  showToolbar = true,
  showZoomControls = true,
  title,
  lang = 'fr',
  t = (key, fallback) => fallback || key,
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalScale, setInternalScale] = useState<number>(0.55);
  const [userZoom, setUserZoom] = useState<number | null>(null);
  const [docHeight, setDocHeight] = useState<number>(A4_HEIGHT_PX);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = useState<string>('');

  // 1. Calcul du scaling responsive A4 adaptatif (Auto-Fit)
  useEffect(() => {
    const updateAutoFit = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      if (containerWidth > 0) {
        // Prévoir marge intérieure de 32px
        const availWidth = Math.max(containerWidth - 32, 200);
        const widthScale = availWidth / A4_WIDTH_PX;

        let heightScale = widthScale;
        if (containerHeight > 100) {
          const availHeight = Math.max(containerHeight - 32, 200);
          heightScale = availHeight / A4_HEIGHT_PX;
        }

        // Échelle auto-fit qui permet d'afficher la page entière
        const computed = Math.min(widthScale, heightScale);
        const clampedScale = Number(Math.min(Math.max(computed, 0.28), 1.15).toFixed(3));

        if (userZoom === null && controlledScale === undefined) {
          setInternalScale(clampedScale);
        }
      }
    };

    updateAutoFit();

    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(updateAutoFit);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [userZoom, controlledScale]);

  // Échelle active finale
  const activeScale = controlledScale !== undefined
    ? controlledScale
    : userZoom !== null
    ? userZoom
    : (zoom !== undefined ? zoom : internalScale);

  const isAutoFit = userZoom === null && controlledScale === undefined && zoom === undefined;

  const handleZoomIn = () => {
    const next = Math.min(1.4, Number((activeScale + 0.08).toFixed(2)));
    setUserZoom(next);
    onZoomChange?.(next);
  };

  const handleZoomOut = () => {
    const next = Math.max(0.3, Number((activeScale - 0.08).toFixed(2)));
    setUserZoom(next);
    onZoomChange?.(next);
  };

  const handleResetAutoFit = () => {
    setUserZoom(null);
    if (controlledScale !== undefined && onZoomChange) {
      onZoomChange(internalScale);
    }
  };

  // 2. Fusion et préparation des données CV
  const activeCvData: CVData = useMemo(() => {
    const input = data || cv;
    if (input) {
      return {
        ...input,
        theme: {
          ...input.theme,
          primaryColor: themeColor || input.theme?.primaryColor || '#1e3a8a',
        },
      };
    }

    if (formData) {
      // Conversion adaptative depuis le format plat formData (compatibilité CVBuilder.jsx)
      const fullName =
        formData.fullName ||
        [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() ||
        DEFAULT_CV_PREVIEW.personalInfo.firstName + ' ' + DEFAULT_CV_PREVIEW.personalInfo.lastName;

      const [first, ...rest] = fullName.split(' ');
      const last = rest.join(' ');

      return {
        ...DEFAULT_CV_PREVIEW,
        personalInfo: {
          ...DEFAULT_CV_PREVIEW.personalInfo,
          firstName: first || DEFAULT_CV_PREVIEW.personalInfo.firstName,
          lastName: last || DEFAULT_CV_PREVIEW.personalInfo.lastName,
          title: formData.jobTitle || formData.title || DEFAULT_CV_PREVIEW.personalInfo.title,
          email: formData.email || DEFAULT_CV_PREVIEW.personalInfo.email,
          phone: formData.phone || DEFAULT_CV_PREVIEW.personalInfo.phone,
          city: formData.city || DEFAULT_CV_PREVIEW.personalInfo.city,
          linkedin: formData.linkedin || DEFAULT_CV_PREVIEW.personalInfo.linkedin,
          photoUrl: formData.photoUrl || DEFAULT_CV_PREVIEW.personalInfo.photoUrl,
        },
        summary: formData.summary || DEFAULT_CV_PREVIEW.summary,
        experiences:
          formData.experiences && formData.experiences.length > 0
            ? formData.experiences.map((exp: any, i: number) => ({
                id: exp.id || `exp-${i}`,
                position: exp.title || exp.position || 'Poste',
                company: exp.company || 'Entreprise',
                city: exp.city || '',
                startDate: exp.period?.split('-')?.[0]?.trim() || exp.startDate || '2020',
                endDate: exp.period?.split('-')?.[1]?.trim() || exp.endDate || '',
                current: exp.period?.includes('Présent') || exp.current || false,
                description: exp.desc || exp.description || '',
                tasks: exp.tasks || [],
              }))
            : DEFAULT_CV_PREVIEW.experiences,
        educations:
          formData.education && formData.education.length > 0
            ? formData.education.map((edu: any, i: number) => ({
                id: edu.id || `edu-${i}`,
                degree: edu.degree || 'Diplôme',
                institution: edu.school || edu.institution || 'Établissement',
                city: edu.city || '',
                startDate: edu.period?.split('-')?.[0]?.trim() || edu.startDate || '2016',
                endDate: edu.period?.split('-')?.[1]?.trim() || edu.endDate || '2018',
                current: false,
                description: edu.desc || edu.description || '',
              }))
            : DEFAULT_CV_PREVIEW.educations,
        education:
          formData.education && formData.education.length > 0
            ? formData.education.map((edu: any, i: number) => ({
                id: edu.id || `edu-${i}`,
                degree: edu.degree || 'Diplôme',
                institution: edu.school || edu.institution || 'Établissement',
                city: edu.city || '',
                startDate: edu.period?.split('-')?.[0]?.trim() || edu.startDate || '2016',
                endDate: edu.period?.split('-')?.[1]?.trim() || edu.endDate || '2018',
                current: false,
                description: edu.desc || edu.description || '',
              }))
            : DEFAULT_CV_PREVIEW.education,
        skills:
          formData.skills && formData.skills.length > 0
            ? formData.skills.map((s: any, i: number) =>
                typeof s === 'string'
                  ? { id: `sk-${i}`, name: s, level: 4 }
                  : { id: s.id || `sk-${i}`, name: s.name || s.skill || 'Compétence', level: s.level || 4 }
              )
            : DEFAULT_CV_PREVIEW.skills,
        languages:
          formData.languages && formData.languages.length > 0
            ? formData.languages.map((l: any, i: number) =>
                typeof l === 'string'
                  ? { id: `lang-${i}`, language: l, name: l, level: 'Courant' }
                  : { id: l.id || `lang-${i}`, language: l.language || l.name || 'Langue', name: l.name || l.language || 'Langue', level: l.level || 'Courant' }
              )
            : DEFAULT_CV_PREVIEW.languages,
        theme: {
          ...DEFAULT_CV_PREVIEW.theme,
          primaryColor: themeColor,
        },
      };
    }

    return DEFAULT_CV_PREVIEW;
  }, [data, cv, formData, themeColor]);

  // Action Téléchargement PDF
  const handleDownload = async () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }

    try {
      setIsExporting(true);
      setExportProgressText('Génération PDF...');
      const candidateName = `${activeCvData.personalInfo.firstName || ''}_${activeCvData.personalInfo.lastName || ''}`.trim().replace(/\s+/g, '_') || 'Candidat';
      const fileName = `VITAREY_CV_${candidateName}.pdf`;

      await exportCVToPDF({
        fileName,
        elementId: 'cv-printable-document',
        onProgress: (status) => setExportProgressText(status)
      });
    } catch (err) {
      console.error('Erreur export PDF:', err);
      triggerNativePrint();
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  // Action Impression
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      triggerNativePrint();
    }
  };

  return (
    <div className={`cv-preview-container select-none ${className}`}>
      {/* 1. BARRE D'OUTILS DE L'APERÇU */}
      {showToolbar && (
        <div className="cv-preview-toolbar">
          {/* Titre & Statut A4 */}
          <div className="cv-toolbar-section">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="cv-toolbar-label">
                {title || t('preview.liveTitle', 'Aperçu en direct (A4)')}
              </span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono font-medium hidden sm:inline-block">
                210 × 297 mm
              </span>
            </div>

            {/* Sélecteur de couleur thématique si activé */}
            {onColorChange && (
              <div className="cv-color-palette ml-2">
                {PRESET_COLORS.map((color) => {
                  const isActive = themeColor.toLowerCase() === color.value.toLowerCase();
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => onColorChange(color.value)}
                      className={`cv-color-swatch ${isActive ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.label}
                      title={color.label}
                    />
                  );
                })}

                <div className="cv-color-custom-wrapper" title={t('preview.customColor', 'Couleur personnalisée')}>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="cv-color-native-picker"
                    aria-label="Palette personnalisée"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contrôles de zoom & Actions PDF/Print */}
          <div className="cv-toolbar-section">
            {showZoomControls && (
              <div className="cv-zoom-controls">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="cv-zoom-btn"
                  title="Zoom arrière (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5 inline" />
                </button>

                <button
                  type="button"
                  onClick={handleResetAutoFit}
                  className={`cv-zoom-reset ${isAutoFit ? 'bg-blue-600 text-white font-bold' : ''}`}
                  title="Cliquer pour réajuster la page entière (Auto-fit)"
                >
                  {Math.round(activeScale * 100)}%{isAutoFit ? ' • Auto' : ''}
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="cv-zoom-btn"
                  title="Zoom avant (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5 inline" />
                </button>

                <button
                  type="button"
                  onClick={handleResetAutoFit}
                  className="cv-zoom-btn"
                  title="Ajuster la page entière au cadre disponible"
                >
                  <Maximize2 className="w-3.5 h-3.5 inline" />
                </button>
              </div>
            )}

            {/* Bouton d'impression */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Imprimer le CV au format A4"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Bouton Export PDF */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || isExporting}
              className="cv-export-btn cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              title="Télécharger le document au format PDF HD"
            >
              {isDownloading || isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isDownloading || isExporting
                  ? exportProgressText || t('buttons.exporting', 'Export en cours...')
                  : t('buttons.downloadPdf', 'Télécharger PDF')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 2. CADRE GRIS D'APERÇU AVEC SCALING STRICT A4 (210mm x 297mm) */}
      <div ref={containerRef} className="cv-preview-gray-canvas">
        {/* Conteneur dimensionné au ratio A4 exact à l'échelle pour éviter tout overflow */}
        <div
          className="preview-scale-wrapper-outer relative shrink-0 shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-black/5"
          style={{
            width: `${Math.round(A4_WIDTH_PX * activeScale)}px`,
            height: `${Math.round(docHeight * activeScale)}px`,
            transition: isAutoFit ? 'width 0.12s ease-out, height 0.12s ease-out' : 'none',
          }}
        >
          {/* IFRAME ISOLÉ : Strict isolation of template CSS, fonts, and layout */}
          <IsolatedIframe
            width={A4_WIDTH_PX}
            height={docHeight}
            scale={activeScale}
            onHeightChange={(h) => setDocHeight(h)}
          >
            {children ? (
              children
            ) : formData && !data && !cv ? (
              <CVTemplateModern
                data={{
                  fullName:
                    formData.fullName ||
                    `${activeCvData.personalInfo.firstName} ${activeCvData.personalInfo.lastName}`,
                  jobTitle: formData.jobTitle || activeCvData.personalInfo.title,
                  email: formData.email || activeCvData.personalInfo.email,
                  phone: formData.phone || activeCvData.personalInfo.phone,
                  city: formData.city || activeCvData.personalInfo.city,
                  linkedin: formData.linkedin || activeCvData.personalInfo.linkedin,
                  summary: formData.summary || activeCvData.summary,
                  experiences: formData.experiences || activeCvData.experiences,
                  education: formData.education || activeCvData.education,
                  skills: (formData.skills || []).map((s: any) =>
                    typeof s === 'string' ? s : s.name
                  ),
                  languages: (formData.languages || []).map((l: any) =>
                    typeof l === 'string'
                      ? { language: l, level: 'Courant' }
                      : { language: l.name || l.language, level: l.level || 'Courant' }
                  ),
                }}
                themeColor={themeColor}
                id="cv-printable-document"
              />
            ) : (
              <CVRenderer
                data={activeCvData}
                showWatermark={showWatermark}
                scale={1}
                id="cv-printable-document"
              />
            )}
          </IsolatedIframe>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
