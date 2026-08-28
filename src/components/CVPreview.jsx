import React from 'react';

/**
 * PALETTE DE COULEURS PROFESSIONNELLES PRÉDÉFINIES
 */
export const PRESET_COLORS = [
  { id: 'navy', label: 'Bleu Marine', value: '#1e3a8a' },
  { id: 'royal', label: 'Bleu Pro', value: '#2563eb' },
  { id: 'black', label: 'Noir Élégant', value: '#0f172a' },
  { id: 'emerald', label: 'Vert Émeraude', value: '#047857' },
  { id: 'burgundy', label: 'Bordeaux', value: '#881337' },
  { id: 'charcoal', label: 'Gris Anthracite', value: '#334155' },
  { id: 'indigo', label: 'Indigo / Violet', value: '#4338ca' },
];

/**
 * CVPreview.jsx - Aperçu A4 100% Isolé via <iframe> avec srcDoc & Scaling strict
 * Rendu au format A4 réel (794px × 1123px) redimensionné à l'échelle pour s'intégrer
 * parfaitement dans la colonne droite sans déformation ni écrasement.
 */
export const CVPreview = ({
  formData = {},
  themeColor = '#2563eb',
  onColorChange,
  onDownloadPdf,
  isDownloading = false,
  t = (key, fallback) => fallback || key,
}) => {
  const {
    fullName = '',
    firstName = '',
    lastName = '',
    jobTitle = '',
    email = '',
    phone = '',
    city = '',
    country = '',
    summary = '',
    sectionTitles = {},
    experiences = [],
    educations = [],
    skills = [],
    languages = [],
  } = formData;

  const displayName = fullName || [firstName, lastName].filter(Boolean).join(' ') || 'Alexandre Martin';
  const displayTitle = jobTitle || formData.title || 'Développeur Full-Stack Senior';

  // Obtenir les initiales
  const getInitials = (name) => {
    if (!name) return 'CV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Formatage des expériences
  const experiencesHtml = experiences && experiences.length > 0
    ? experiences.map(exp => `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 13px; color: #0f172a;">${exp.position || exp.role || ''}</strong>
            <span style="font-size: 11px; color: #64748b; white-space: nowrap;">${exp.startDate || ''} ${exp.endDate ? `— ${exp.endDate}` : (exp.current ? '— Présent' : '')}</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: ${themeColor}; margin-top: 1px;">
            ${exp.company || ''} ${exp.city ? `• ${exp.city}` : ''}
          </div>
          ${exp.description ? `<p style="font-size: 11.5px; color: #475569; margin-top: 3px; line-height: 1.4;">${exp.description}</p>` : ''}
          ${exp.tasks && exp.tasks.length > 0 ? `
            <ul style="margin-top: 4px; padding-left: 16px; font-size: 11px; color: #475569; line-height: 1.4;">
              ${exp.tasks.map(task => `<li style="margin-bottom: 2px;">${task}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')
    : (typeof formData.experience === 'string' && formData.experience ? `<p style="font-size: 12px; line-height: 1.5; color: #475569;">${formData.experience}</p>` : `<p style="font-size: 12px; color: #94a3b8; font-style: italic;">Aucune expérience ajoutée</p>`);

  // Formatage des formations
  const educationsHtml = educations && educations.length > 0
    ? educations.map(edu => `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 13px; color: #0f172a;">${edu.degree || ''}</strong>
            <span style="font-size: 11px; color: #64748b;">${edu.startDate || ''} — ${edu.endDate || ''}</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: ${themeColor};">
            ${edu.institution || ''} ${edu.city ? `• ${edu.city}` : ''}
          </div>
          ${edu.description ? `<p style="font-size: 11px; color: #475569; margin-top: 2px;">${edu.description}</p>` : ''}
        </div>
      `).join('')
    : (typeof formData.education === 'string' && formData.education ? `<p style="font-size: 12px; line-height: 1.5; color: #475569;">${formData.education}</p>` : `<p style="font-size: 12px; color: #94a3b8; font-style: italic;">Aucune formation ajoutée</p>`);

  // Formatage des compétences
  const skillsHtml = skills && skills.length > 0
    ? `
      <div style="margin-top: 20px;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.95); border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 10px;">
          ${sectionTitles?.skills || "Compétences"}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${skills.map(s => {
            const skillName = typeof s === 'string' ? s : (s.name || s);
            return `<div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #ffffff;">${skillName}</div>`;
          }).join('')}
        </div>
      </div>
    `
    : '';

  // Formatage des langues
  const languagesHtml = languages && languages.length > 0
    ? `
      <div style="margin-top: 20px;">
        <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.95); border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 10px;">
          ${sectionTitles?.languages || "Langues"}
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${languages.map(l => `
            <div style="display: flex; justify-content: space-between; font-size: 11px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 3px;">
              <strong>${l.language || l.name || ''}</strong>
              <span style="opacity: 0.8;">${l.level || ''}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `
    : '';

  const cvHtmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: #e2e8f0;
            height: 100vh;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }
          .cv-a4-sheet {
            width: 794px;
            min-width: 794px;
            max-width: 794px;
            height: 1123px;
            min-height: 1123px;
            max-height: 1123px;
            transform: scale(0.56);
            transform-origin: top center;
            background: #ffffff;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            margin-top: 15px;
            display: flex;
            flex-direction: row;
            overflow: hidden;
            box-sizing: border-box;
          }
          .sidebar {
            width: 32%;
            min-width: 32%;
            background-color: ${themeColor};
            color: #ffffff;
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            word-break: break-word;
          }
          .avatar {
            width: 65px;
            height: 65px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.2);
            border: 2px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: bold;
            color: #ffffff;
            margin: 0 auto 10px auto;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            margin-bottom: 6px;
            line-height: 1.35;
          }
          .main-content {
            width: 68%;
            min-width: 68%;
            padding: 36px 30px;
            color: #333333;
            display: flex;
            flex-direction: column;
            gap: 16px;
            word-break: break-word;
          }
          .header-name {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 4px;
            line-height: 1.2;
            word-break: break-word;
          }
          .header-title {
            font-size: 14px;
            font-weight: 700;
            color: ${themeColor};
            margin-bottom: 12px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${themeColor};
            border-bottom: 2px solid ${themeColor};
            padding-bottom: 3px;
            margin-top: 10px;
            margin-bottom: 8px;
          }
          p, li {
            font-size: 12px;
            line-height: 1.5;
            color: #334155;
            word-break: break-word;
          }
          @media print {
            body { background: transparent; padding: 0; }
            .cv-a4-sheet {
              transform: none;
              box-shadow: none;
              border-radius: 0;
              margin: 0;
              width: 210mm;
              height: 297mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="cv-a4-sheet">
          <!-- SIDEBAR GAUCHE -->
          <div class="sidebar">
            <div class="avatar">${getInitials(displayName)}</div>
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1.5px solid rgba(255,255,255,0.3); padding-bottom: 4px; margin-bottom: 8px;">
              ${sectionTitles?.contact || "Contact"}
            </div>
            ${email ? `<div class="contact-item">✉ ${email}</div>` : ''}
            ${phone ? `<div class="contact-item">📞 ${phone}</div>` : ''}
            ${(city || country) ? `<div class="contact-item">📍 ${[city, country].filter(Boolean).join(', ')}</div>` : ''}
            ${skillsHtml}
            ${languagesHtml}
          </div>

          <!-- CONTENU PRINCIPAL DROIT -->
          <div class="main-content">
            <div style="border-bottom: 2px solid ${themeColor}; padding-bottom: 10px;">
              <h1 class="header-name">${displayName}</h1>
              <div class="header-title">${displayTitle}</div>
            </div>

            ${summary ? `
              <div>
                <div class="section-title">${sectionTitles?.profile || "Profil Professionnel"}</div>
                <p>${summary}</p>
              </div>
            ` : ''}

            <div>
              <div class="section-title">${sectionTitles?.experience || "Expérience Professionnelle"}</div>
              ${experiencesHtml}
            </div>

            <div>
              <div class="section-title">${sectionTitles?.education || "Formation & Diplômes"}</div>
              ${educationsHtml}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. BARRE D'OUTILS : COULEURS ET BOUTON EXPORT */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          width: '100%',
          marginBottom: '16px',
          padding: '12px 20px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('preview.themeColor', 'Couleur')} :
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {PRESET_COLORS.map((color) => {
              const isSelected = themeColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  onClick={() => onColorChange && onColorChange(color.value)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '9999px',
                    backgroundColor: color.value,
                    border: '2px solid #ffffff',
                    boxShadow: isSelected ? '0 0 0 2px #0f172a' : '0 0 0 1px #cbd5e1',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label={color.label}
                />
              );
            })}

            {/* Sélecteur libre */}
            <div
              style={{
                position: 'relative',
                width: '28px',
                height: '28px',
                borderRadius: '9999px',
                border: '1px dashed #94a3b8',
                background: 'conic-gradient(from 180deg at 50% 50%, #f43f5e, #8b5cf6, #3b82f6, #10b981, #eab308, #f43f5e)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={t('preview.customColor', 'Couleur personnalisée')}
            >
              <input
                type="color"
                value={themeColor}
                onChange={(e) => onColorChange && onColorChange(e.target.value)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
                aria-label="Custom color picker"
              />
            </div>
          </div>
        </div>

        {onDownloadPdf && (
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '10px',
              border: 'none',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              opacity: isDownloading ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isDownloading ? t('buttons.exporting', 'Export...') : t('buttons.downloadPdf', 'Télécharger PDF')}</span>
          </button>
        )}
      </div>

      {/* 2. LE CADRE GRIS PARENT AVEC IFRAME TOTALEMENT ISOLÉ */}
      <div
        style={{
          width: '100%',
          height: '680px',
          minHeight: '680px',
          backgroundColor: '#e2e8f0',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <iframe
          title="CV Preview"
          srcDoc={cvHtmlContent}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '680px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </div>
  );
};

export default CVPreview;
