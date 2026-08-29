import React from 'react';

/**
 * CVTemplateModern.jsx - COMPOSANT DE RENDU UNIQUE (SHARED A4 CANVAS)
 * Utilisé à la fois pour l'aperçu dynamique à l'écran et l'exportation PDF haute fidélité.
 * Dimensions A4 strictes : 794px x 1123px (Ratio 1 : 1.414 / 210mm x 297mm à 96 DPI).
 */
export const CVTemplateModern = ({
  data = {},
  themeColor = '#1e3a8a',
  id = 'cv-printable-document',
}) => {
  const {
    fullName = 'Alexandre Martin',
    jobTitle = 'Chef de Projet Digital',
    email = 'alexandre.martin@email.com',
    phone = '+33 6 12 34 56 78',
    city = 'Paris, France',
    linkedin = 'linkedin.com/in/alexandremartin',
    summary = '',
    experiences = [],
    education = [],
    skills = [],
    languages = [],
    sectionTitles = {
      contact: 'Coordonnées',
      profile: 'Profil Professionnel',
      experience: 'Expérience Professionnelle',
      education: 'Formation & Diplômes',
      skills: 'Compétences',
      languages: 'Langues',
    },
  } = data;

  // Calcul des initiales pour l'avatar
  const getInitials = (name) => {
    if (!name) return 'AM';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      id={id}
      className="cv-a4-sheet"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        color: '#1e293b',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* =========================================================================
          1. SIDEBAR GAUCHE (30% de largeur, couleur dynamique themeColor)
          ========================================================================= */}
      <aside
        style={{
          width: '240px',
          minWidth: '240px',
          maxWidth: '240px',
          backgroundColor: themeColor,
          color: '#ffffff',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar avec initiales */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 auto 6px auto',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            }}
          >
            {getInitials(fullName)}
          </div>

          {/* Section Coordonnées */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#ffffff',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.35)',
                paddingBottom: '4px',
                marginBottom: '10px',
              }}
            >
              {sectionTitles.contact || 'Coordonnées'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '11px' }}>
              {email && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', wordBreak: 'break-all' }}>
                  <span style={{ opacity: 0.9 }}>✉</span>
                  <span style={{ color: '#f8fafc', lineHeight: '1.35' }}>{email}</span>
                </div>
              )}
              {phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: 0.9 }}>📞</span>
                  <span style={{ color: '#f8fafc' }}>{phone}</span>
                </div>
              )}
              {city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ opacity: 0.9 }}>📍</span>
                  <span style={{ color: '#f8fafc' }}>{city}</span>
                </div>
              )}
              {linkedin && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', wordBreak: 'break-all' }}>
                  <span style={{ opacity: 0.9 }}>🔗</span>
                  <span style={{ color: '#f8fafc', lineHeight: '1.35' }}>{linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section Compétences */}
          {skills && skills.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#ffffff',
                  borderBottom: '1.5px solid rgba(255, 255, 255, 0.35)',
                  paddingBottom: '4px',
                  marginBottom: '10px',
                }}
              >
                {sectionTitles.skills || 'Compétences'}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((skill, idx) => {
                  const skillName = typeof skill === 'string' ? skill : (skill.name || skill.label || '');
                  if (!skillName) return null;
                  return (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        border: '1px solid rgba(255, 255, 255, 0.28)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        color: '#ffffff',
                        fontWeight: 600,
                        lineHeight: '1.3',
                      }}
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section Langues */}
          {languages && languages.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#ffffff',
                  borderBottom: '1.5px solid rgba(255, 255, 255, 0.35)',
                  paddingBottom: '4px',
                  marginBottom: '8px',
                }}
              >
                {sectionTitles.languages || 'Langues'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {languages.map((lang, idx) => {
                  const langName = typeof lang === 'string' ? lang : (lang.language || lang.name || '');
                  const langLevel = typeof lang === 'object' ? lang.level : '';
                  if (!langName) return null;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        fontSize: '11px',
                        color: '#ffffff',
                        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
                        paddingBottom: '3px',
                      }}
                    >
                      <strong style={{ fontWeight: 600 }}>{langName}</strong>
                      {langLevel && <span style={{ opacity: 0.85, fontSize: '10px' }}>{langLevel}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pied de sidebar */}
        <div style={{ fontSize: '9.5px', opacity: 0.65, textAlign: 'center', letterSpacing: '0.05em' }}>
          CV-EN-LIGNE • FORMAT STANDARD A4
        </div>
      </aside>

      {/* =========================================================================
          2. CORPS PRINCIPAL DROIT (70% de largeur)
          ========================================================================= */}
      <main
        style={{
          flex: 1,
          padding: '38px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* En-tête : Nom & Titre avec ligne de couleur */}
        <div
          style={{
            borderBottom: `2.5px solid ${themeColor}`,
            paddingBottom: '12px',
            marginBottom: '4px',
          }}
        >
          <h1
            style={{
              fontSize: '25px',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              margin: '0 0 3px 0',
              lineHeight: '1.15',
            }}
          >
            {fullName}
          </h1>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: themeColor,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {jobTitle}
          </div>
        </div>

        {/* Section Profil Professionnel */}
        {summary && (
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: themeColor,
                borderBottom: `1.5px solid ${themeColor}`,
                paddingBottom: '3px',
                marginBottom: '6px',
              }}
            >
              {sectionTitles.profile || 'Profil Professionnel'}
            </div>
            <p
              style={{
                fontSize: '11.5px',
                lineHeight: '1.55',
                color: '#334155',
                margin: 0,
                textAlign: 'justify',
              }}
            >
              {summary}
            </p>
          </div>
        )}

        {/* Section Expériences Professionnelles */}
        {experiences && experiences.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: themeColor,
                borderBottom: `1.5px solid ${themeColor}`,
                paddingBottom: '3px',
                marginBottom: '8px',
              }}
            >
              {sectionTitles.experience || 'Expérience Professionnelle'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {experiences.map((exp, idx) => {
                const expTitle = exp.title || exp.position || exp.role || 'Poste';
                const expCompany = exp.company || '';
                const expPeriod =
                  exp.period ||
                  (exp.startDate
                    ? `${exp.startDate} ${exp.endDate ? `— ${exp.endDate}` : (exp.current ? '— Présent' : '')}`
                    : exp.endDate || '');
                const expCity = exp.city ? `• ${exp.city}` : '';
                const expDesc = exp.desc || exp.description || '';
                const expTasks = Array.isArray(exp.tasks) ? exp.tasks : [];

                return (
                  <div key={exp.id || idx} style={{ pageBreakInside: 'avoid' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '1px',
                      }}
                    >
                      <strong style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 700 }}>
                        {expTitle}
                      </strong>
                      {expPeriod && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: '#64748b',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {expPeriod}
                        </span>
                      )}
                    </div>

                    {expCompany && (
                      <div
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: themeColor,
                          marginBottom: '3px',
                        }}
                      >
                        {expCompany} {expCity}
                      </div>
                    )}

                    {expDesc && (
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#334155',
                          lineHeight: '1.45',
                          margin: '0 0 3px 0',
                        }}
                      >
                        {expDesc}
                      </p>
                    )}

                    {expTasks.length > 0 && (
                      <ul
                        style={{
                          margin: '3px 0 0 0',
                          paddingLeft: '16px',
                          fontSize: '10.5px',
                          color: '#475569',
                          lineHeight: '1.4',
                        }}
                      >
                        {expTasks.map((task, tIdx) => (
                          <li key={tIdx} style={{ marginBottom: '2px' }}>
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section Formations & Diplômes */}
        {education && education.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: themeColor,
                borderBottom: `1.5px solid ${themeColor}`,
                paddingBottom: '3px',
                marginBottom: '8px',
              }}
            >
              {sectionTitles.education || 'Formation & Diplômes'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map((edu, idx) => {
                const eduDegree = edu.degree || edu.title || 'Diplôme';
                const eduSchool = edu.school || edu.institution || '';
                const eduPeriod =
                  edu.period ||
                  (edu.startDate
                    ? `${edu.startDate} — ${edu.endDate || (edu.current ? 'Présent' : '')}`
                    : edu.endDate || '');
                const eduDesc = edu.desc || edu.description || '';

                return (
                  <div key={edu.id || idx} style={{ pageBreakInside: 'avoid' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '1px',
                      }}
                    >
                      <strong style={{ fontSize: '12px', color: '#0f172a', fontWeight: 700 }}>
                        {eduDegree}
                      </strong>
                      {eduPeriod && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: '#64748b',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {eduPeriod}
                        </span>
                      )}
                    </div>

                    {eduSchool && (
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: themeColor,
                          marginBottom: '2px',
                        }}
                      >
                        {eduSchool}
                      </div>
                    )}

                    {eduDesc && (
                      <p
                        style={{
                          fontSize: '10.5px',
                          color: '#475569',
                          lineHeight: '1.4',
                          margin: 0,
                        }}
                      >
                        {eduDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CVTemplateModern;
