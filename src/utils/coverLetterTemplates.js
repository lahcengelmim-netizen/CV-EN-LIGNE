/**
 * coverLetterTemplates.js
 * Bibliothèque de modèles de lettres de motivation statiques professionnels et pré-rédigés.
 * 100% sans IA : zéro coût d'API, ultra-rapide, personnalisation instantanée.
 */

export const COVER_LETTER_TEMPLATES = [
  {
    id: 'candidature-spontanee',
    sector: 'Général / Tous secteurs',
    title: 'Candidature Spontanée',
    icon: 'Briefcase',
    badge: 'Polyvalent',
    subject: 'Candidature spontanée au poste de [Poste] - [Nom]',
    body: `[Destinataire],

Ayant suivi avec un vif intérêt le développement et les réussites récentes de [Entreprise], je me permets de vous adresser ma candidature pour rejoindre vos équipes en tant que [Poste].

Fort(e) d'un parcours riche et diversifié, j'ai développé une solide expertise autour de [Compétence Clé]. Reconnue(e) pour ma rigueur, ma proactivité et ma capacité d'adaptation, je suis particulièrement motivé(e) par [Raison].

Intégrer [Entreprise] représente pour moi l'opportunité de mettre mon savoir-faire au service d'un environnement d'excellence, tout en contribuant activement à la réussite de vos projets stratégiques.

Je serais honoré(e) de pouvoir échanger avec vous lors d'un entretien afin de vous exposer plus en détail mes motivations et l'adéquation de mon profil avec vos ambitions.

Dans l'attente de votre retour, je vous prie d'agréer, [Destinataire], l'expression de mes salutations distinguées.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'developpeur-tech',
    sector: 'IT & Digital',
    title: 'Développeur / Tech & IT',
    icon: 'Code',
    badge: 'Tech & Ingénierie',
    subject: 'Candidature : [Poste] - [Nom]',
    body: `[Destinataire],

C'est avec beaucoup d'enthousiasme que je vous soumets ma candidature pour le poste de [Poste] au sein de [Entreprise]. Passionné(e) par les technologies innovantes et l'ingénierie logicielle de pointe, je suis particulièrement attiré(e) par [Raison].

Au cours de mes précédentes réalisations, j'ai pu concevoir, développer et optimiser des architectures robustes et scalables, en m'appuyant notamment sur [Compétence Clé]. Habitué(e) à travailler en méthodologie Agile, j'accorde une importance primordiale à la qualité du code, à la collaboration d'équipe et aux performances de livraison.

Rejoindre les équipes techniques de [Entreprise] est pour moi l'opportunité idéale d'apporter ma rigueur technique et ma créativité pour relever vos prochains défis technologiques.

Je me tiens à votre entière disposition pour convenir d'un rendez-vous afin de vous présenter concrètement mes compétences et mes projets.

En vous remerciant de l'attention portée à ma candidature, je vous prie d'agréer, [Destinataire], mes salutations les plus respectueuses.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'chef-de-projet',
    sector: 'Management & Gestion',
    title: 'Chef de Projet / Product Manager',
    icon: 'Kanban',
    badge: 'Organisation & Leadership',
    subject: 'Candidature au poste de [Poste] - Référence [Entreprise]',
    body: `[Destinataire],

Actuellement à la recherche d'une nouvelle opportunité pour valoriser mes compétences en gestion et coordination de projets, je souhaite vivement rejoindre [Entreprise] en qualité de [Poste].

Mon parcours m'a permis de piloter des projets d'envergure, de la phase de cadrage stratégique jusqu'au déploiement final. Ma maîtrise de [Compétence Clé] m'a toujours permis de garantir le respect des délais, la maîtrise des budgets et la satisfaction des parties prenantes. De plus, je suis très stimulé(e) par [Raison].

Doté(e) d'un excellent sens relationnel et d'un leadership collaboratif, je sais fédérer des équipes pluridisciplinaires autour d'objectifs communs et d'une vision produit claire.

Convaincu(e) que mes compétences managériales et méthodologiques sauront répondre à vos exigences, je serais ravi(e) de vous rencontrer pour un entretien.

Je vous prie d'agréer, [Destinataire], l'assurance de ma parfaite considération.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'commercial-vente',
    sector: 'Commercial & Vente',
    title: 'Commercial / Business Developer',
    icon: 'TrendingUp',
    badge: 'Résultats & Négociation',
    subject: 'Candidature : [Poste] - [Nom]',
    body: `[Destinataire],

Animé(e) par la culture du résultat et le développement commercial, je vous adresse ma candidature pour le poste de [Poste] au sein de [Entreprise]. La dynamique de croissance et la réputation de vos offres constituent pour moi une source majeure de motivation, notamment [Raison].

Tout au long de mon parcours, j'ai su prospecter, négocier et fidéliser des portefeuilles clients exigeants. Ma parfaite maîtrise de [Compétence Clé] m'a permis de dépasser régulièrement mes objectifs de chiffre d'affaires tout en garantissant un haut niveau de satisfaction client.

Rejoindre [Entreprise] représente l'opportunité d'apporter mon dynamisme commercial, mon sens de l'écoute et ma pugnacité pour conquérir de nouvelles parts de marché.

Je reste à votre disposition pour vous démontrer ma motivation lors d'un prochain échange.

Dans cette attente, je vous prie d'agréer, [Destinataire], l'expression de mes salutations distinguées.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'stage-alternance',
    sector: 'Étudiants & Débutants',
    title: 'Stage / Alternance / Premier Emploi',
    icon: 'GraduationCap',
    badge: 'Junior & Alternance',
    subject: 'Candidature : Stage / Alternance [Poste] - [Nom]',
    body: `[Destinataire],

Actuellement en formation et désireux(se) de consolider mes acquis par une expérience professionnelle exigeante, je sollicite un poste de [Poste] au sein de [Entreprise].

Au fil de mes études et projets académiques, j'ai acquis de solides compétences théoriques et pratiques en [Compétence Clé]. Motivé(e), curieux(se) et rapide dans l'apprentissage, je suis particulièrement enthousiasmé(e) par [Raison].

Intégrer votre structure me permettrait d'apporter mon regard neuf, mon enthousiasme et mon engagement quotidien, tout en apprenant aux côtés de professionnels reconnus.

Je serais honoré(e) de vous présenter plus en détail mon profil et ma motivation lors d'un entretien.

Je vous remercie chaleureusement pour le temps accordé à l'examen de ma candidature et vous prie d'agréer, [Destinataire], mes salutations respectueuses.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'marketing-communication',
    sector: 'Marketing & Com',
    title: 'Marketing, Communication & Réseaux Sociaux',
    icon: 'Megaphone',
    badge: 'Créatif & Stratégie',
    subject: 'Candidature : [Poste] - [Nom]',
    body: `[Destinataire],

Passionné(e) par la communication de marque et l'acquisition digitale, je souhaite soumettre ma candidature pour le poste de [Poste] au sein de [Entreprise]. L'univers de votre marque et [Raison] m'inspirent particulièrement.

Mon expérience m'a permis de concevoir des campagnes multicanales d'impact et de piloter des stratégies d'engagement efficaces. Grâce à mon expertise en [Compétence Clé], j'ai su accroître la visibilité de marques tout en optimisant le retour sur investissement des actions menées.

Créatif(ve), analytique et à l'affût des dernières tendances, je serais ravi(e) de mettre mes compétences au service du rayonnement de [Entreprise].

Je me tiens à votre disposition pour échanger de vive voix sur la manière dont je pourrai contribuer à vos prochains projets.

Je vous prie de recevoir, [Destinataire], mes salutations les plus cordiales.

[Nom]
[Téléphone] | [Email]`
  },
  {
    id: 'finance-comptabilite',
    sector: 'Finance & Administration',
    title: 'Finance, Comptabilité & Audit',
    icon: 'Calculator',
    badge: 'Rigueur & Chiffres',
    subject: 'Candidature au poste de [Poste] - [Nom]',
    body: `[Destinataire],

Rigoureux(se) et soucieux(se) de la précision des données financières, je vous soumets ma candidature pour le poste de [Poste] chez [Entreprise]. La solidité financière et les perspectives de votre entreprise, notamment [Raison], motivent pleinement ma démarche.

Au cours de mes missions, j'ai assuré avec succès des opérations comptables, des clôtures et des analyses budgétaires rigoureuses. Mon savoir-faire autour de [Compétence Clé] m'a permis de fiabiliser les reportings et de fournir des éclairages décisionnels pertinents à la direction.

Intégrer [Entreprise] est pour moi l'opportunité de mettre ma rigueur déontologique et mes capacités d'analyse au service de votre performance économique.

Dans l'attente d'un échange au cours duquel je pourrai détailler mon parcours, je vous prie d'agréer, [Destinataire], l'expression de mes salutations distinguées.

[Nom]
[Téléphone] | [Email]`
  }
];

/**
 * Remplace automatiquement les variables d'un texte par les valeurs saisies.
 */
export function interpolateCoverLetter(templateText, variables = {}) {
  if (!templateText) return '';

  const defaultVars = {
    Nom: 'Alexandre Martin',
    Entreprise: 'Entreprise Cible',
    Poste: 'Chef de Projet',
    'Compétence Clé': 'la conduite de projets agiles et le management',
    Ville: 'Paris',
    Date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    Destinataire: 'Madame, Monsieur',
    Téléphone: '+33 6 12 34 56 78',
    Email: 'candidat@email.com',
    Raison: 'votre rayonnement, votre culture de l’innovation et vos ambitions de croissance'
  };

  const merged = { ...defaultVars, ...variables };

  let result = templateText;
  Object.keys(merged).forEach((key) => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, merged[key] || `[${key}]`);
  });

  return result;
}
