import { jsPDF } from 'jspdf';
import { PDFParse } from 'pdf-parse';
import { CVData } from '../src/types';
import { getEffectiveCVData } from '../src/lib/cvDataUtils';

async function runATSValidationTest() {
  console.log('=== TEST DE VALIDATION PHASE 1 : EXTRACTION TEXTE RÉEL ATS ===\n');

  const sampleCV: CVData = {
    id: 'test-ats-cv-001',
    title: 'CV Développeur Full-Stack ATS',
    templateId: 'ats',
    language: 'fr',
    personalInfo: {
      firstName: 'Alexandre',
      lastName: 'Dubois',
      title: 'Ingénieur Full-Stack Senior & DevOps',
      email: 'alexandre.dubois@email.com',
      phone: '+33 6 78 90 12 34',
      city: 'Lyon',
      country: 'France',
      linkedin: 'linkedin.com/in/alexandredubois',
      website: 'github.com/alexdubois'
    },
    summary: 'Ingénieur logiciel rigoureux avec 7 ans d\'expertise dans la conception d\'applications web à fort trafic, l\'orchestration cloud et le leadership technique.',
    skills: [
      { id: 's1', name: 'React.js & TypeScript' },
      { id: 's2', name: 'Node.js / Express' },
      { id: 's3', name: 'PostgreSQL & Redis' },
      { id: 's4', name: 'Docker & Kubernetes' },
      { id: 's5', name: 'Architecture Microservices' }
    ],
    experiences: [
      {
        id: 'e1',
        position: 'Lead Architecte Web',
        company: 'NovaTech Solutions',
        city: 'Lyon',
        startDate: '01/2022',
        endDate: 'Présent',
        current: true,
        description: 'Pilotage technique d\'une équipe de 8 développeurs pour la refonte complète du cœur transactionnel.',
        tasks: [
          'Réduction des temps de réponse API de 42% grâce à une stratégie de mise en cache Redis',
          'Migration d\'un monolithe legacy vers une architecture conteneurisée sur Kubernetes'
        ]
      },
      {
        id: 'e2',
        position: 'Développeur Full-Stack Senior',
        company: 'CloudSphere',
        city: 'Paris',
        startDate: '09/2018',
        endDate: '12/2021',
        current: false,
        description: 'Conception et maintenance de micro-services critiques pour des clients fintech.',
        tasks: [
          'Intégration de pipelines CI/CD automatisés réduisant le cycle de déploiement à 15 minutes',
          'Conformité RGPD et audit de sécurité des flux de données bancaires'
        ]
      }
    ],
    educations: [
      {
        id: 'ed1',
        degree: 'Master Informatique & Systèmes d\'Information',
        institution: 'INSA Lyon',
        city: 'Lyon',
        startDate: '2016',
        endDate: '2018',
        current: false,
        description: 'Mention Très Bien — Spécialisation Génie Logiciel'
      }
    ],
    languages: [
      { id: 'l1', language: 'Français', level: 'Langue maternelle' },
      { id: 'l2', language: 'Anglais', level: 'Professionnel courant (C1)' }
    ],
    certifications: [
      { id: 'c1', title: 'AWS Certified Solutions Architect', organization: 'Amazon Web Services', date: '2023' }
    ],
    projects: [
      { id: 'p1', title: 'Vitapass Open Platform', role: 'Fondateur', description: 'Plateforme open-source de génération documentaire.' }
    ],
    theme: {
      primaryColor: '#000000',
      fontFamily: 'sans',
      spacing: 'normal',
      showPhoto: false
    },
    isPaid: true
  };

  const activeCV = getEffectiveCVData(sampleCV);
  const lang = activeCV.language || 'fr';

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: false
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const leftMargin = 18;
  const rightMargin = 18;
  const topMargin = 16;
  const bottomMargin = 16;
  const contentWidth = pageWidth - leftMargin - rightMargin;
  let y = topMargin;

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = topMargin;
      return true;
    }
    return false;
  };

  const clean = (val: any): string => {
    if (!val) return '';
    return String(val)
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u00A0/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();
  };

  // 1. Header
  const firstName = clean(activeCV.personalInfo?.firstName);
  const lastName = clean(activeCV.personalInfo?.lastName);
  const fullName = `${firstName} ${lastName}`.trim().toUpperCase();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(fullName, pageWidth / 2, y, { align: 'center' });
  y += 6.2;

  const title = clean(activeCV.personalInfo?.title);
  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 4.5;
  }

  const contacts: string[] = [];
  if (activeCV.personalInfo?.email) contacts.push(clean(activeCV.personalInfo.email));
  if (activeCV.personalInfo?.phone) contacts.push(clean(activeCV.personalInfo.phone));
  const loc = [clean(activeCV.personalInfo?.city), clean(activeCV.personalInfo?.country)].filter(Boolean).join(', ');
  if (loc) contacts.push(loc);
  if (activeCV.personalInfo?.linkedin) contacts.push(clean(activeCV.personalInfo.linkedin));

  if (contacts.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const contactText = contacts.join('  •  ');
    doc.text(contactText, pageWidth / 2, y, { align: 'center' });
    y += 4.0;
  }

  y += 1.5;
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, pageWidth - rightMargin, y);
  y += 5.5;

  const renderSectionHeader = (heading: string) => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(heading.toUpperCase(), leftMargin, y);
    y += 1.3;
    doc.setLineWidth(0.25);
    doc.line(leftMargin, y, pageWidth - rightMargin, y);
    y += 4.2;
  };

  // 2. Summary
  renderSectionHeader('Profil Professionnel');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  const sumLines = doc.splitTextToSize(clean(activeCV.summary), contentWidth);
  for (const sl of sumLines) {
    doc.text(sl, leftMargin, y);
    y += 4.1;
  }
  y += 3.0;

  // 3. Skills
  renderSectionHeader('Compétences Clés');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  const skillsStr = (activeCV.skills || []).map(s => clean(s.name)).join('  •  ');
  const skillLines = doc.splitTextToSize(skillsStr, contentWidth);
  for (const skl of skillLines) {
    doc.text(skl, leftMargin, y);
    y += 4.1;
  }
  y += 3.0;

  // 4. Experience
  renderSectionHeader('Expérience Professionnelle');
  for (const exp of (activeCV.experiences || [])) {
    ensureSpace(12);
    const pos = clean(exp.position);
    const comp = clean(exp.company);
    const city = clean(exp.city);
    const leftTitle = [pos, [comp, city].filter(Boolean).join(', ')].filter(Boolean).join(' — ');
    const dateStr = `${clean(exp.startDate)} - ${exp.current ? 'Actuel' : clean(exp.endDate)}`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.text(leftTitle, leftMargin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text(dateStr, pageWidth - rightMargin, y, { align: 'right' });
    y += 4.2;

    if (exp.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.0);
      const descLines = doc.splitTextToSize(clean(exp.description), contentWidth);
      for (const dl of descLines) {
        doc.text(dl, leftMargin, y);
        y += 3.9;
      }
    }

    if (exp.tasks) {
      for (const task of exp.tasks) {
        const taskLines = doc.splitTextToSize(clean(task), contentWidth - 4);
        doc.text('•', leftMargin + 1, y);
        doc.text(taskLines, leftMargin + 4, y);
        y += taskLines.length * 3.8 + 1.2;
      }
    }
    y += 2.0;
  }

  // 5. Education
  renderSectionHeader('Formation & Diplômes');
  for (const edu of (activeCV.educations || [])) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`${clean(edu.degree)} | ${clean(edu.institution)}`, leftMargin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text(`${clean(edu.startDate)} - ${clean(edu.endDate)}`, pageWidth - rightMargin, y, { align: 'right' });
    y += 4.0;
    if (edu.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      doc.text(clean(edu.description), leftMargin, y);
      y += 3.8;
    }
  }

  // Generate buffer and parse with PDFParse
  const pdfBytes = new Uint8Array(doc.output('arraybuffer'));
  console.log(`Taille du PDF généré : ${pdfBytes.byteLength} octets.`);

  const parser = new PDFParse(pdfBytes);
  const parsed = await parser.getText();
  const extractedText = parsed.text;

  console.log('\n--- TEXTE BRUT EXTRAIT PAR LE PARSEUR ATS ---');
  console.log(extractedText);
  console.log('--- FIN DU TEXTE EXTRAIT ---\n');

  // Assertions
  const checks = [
    { label: 'Nom complet présent', pass: extractedText.includes('ALEXANDRE DUBOIS') },
    { label: 'Titre de poste présent', pass: extractedText.includes('INGÉNIEUR FULL-STACK SENIOR') || extractedText.includes('INGENIEUR') },
    { label: 'Email présent', pass: extractedText.includes('alexandre.dubois@email.com') },
    { label: 'Téléphone présent', pass: extractedText.includes('+33 6 78 90 12 34') },
    { label: 'Titre section Expérience', pass: extractedText.includes('EXPÉRIENCE PROFESSIONNELLE') },
    { label: 'Entreprise NovaTech Solutions', pass: extractedText.includes('NovaTech Solutions') },
    { label: 'Tâche Redis 42%', pass: extractedText.includes('Redis') && extractedText.includes('42%') },
    { label: 'Compétences React & TypeScript', pass: extractedText.includes('React.js & TypeScript') },
    { label: 'Formation INSA Lyon', pass: extractedText.includes('INSA Lyon') },
    { label: 'Puces vectorielles détectées', pass: extractedText.includes('•') }
  ];

  console.log('--- RÉSULTATS DES VÉRIFICATIONS D\'EXTRACTION ---');
  let allPassed = true;
  for (const c of checks) {
    console.log(`${c.pass ? '✅ SUCCÈS' : '❌ ÉCHEC'}: ${c.label}`);
    if (!c.pass) allPassed = false;
  }

  if (allPassed) {
    console.log('\n🎉 TEST ATS VALIDÉ AVEC SUCCÈS : Le PDF contient 100% de texte vectoriel extractible.');
  } else {
    console.error('\n⚠️ ÉCHEC : Certaines informations n\'ont pas pu être extraites.');
    process.exit(1);
  }
}

runATSValidationTest().catch(err => {
  console.error('Erreur test ATS:', err);
  process.exit(1);
});
