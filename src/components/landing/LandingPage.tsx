import React, { useState } from 'react';
import { LanguageCode, TemplateId } from '../../types';
import { translations } from '../../lib/translations';
import { ContactSection } from '../contact/ContactSection';
import { HeroSection } from './HeroSection';
import { TemplatesGallery } from '../templates/TemplatesGallery';
import { Pricing } from '../Pricing';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Star,
  Users,
  Award,
  Zap,
  Lock,
  ChevronDown,
  Layout,
  Check,
  X as XIcon,
  HelpCircle,
  Clock,
  Laptop
} from 'lucide-react';

interface LandingPageProps {
  onStartCV: (templateId?: TemplateId) => void;
  lang?: LanguageCode;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCV, lang = 'fr' }) => {
  const t = translations[lang] || translations.fr;
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Combien coûte la création et le téléchargement de mon CV ?',
      a: 'Nous proposons 4 formules transparentes sans frais cachés : le Pass Flash à $1.99 (achat unique avec ATS check basique), le Pass Pro à $3.99 (accès 7 jours illimité + IA ATS Check), le Monthly Pass à $7.99/mois, et l\'Annual Pass à $39.99/an (Économisez 50%). Vous pouvez créer et prévisualiser votre CV gratuitement avant tout téléchargement.'
    },
    {
      q: 'Comment l\'IA améliore-t-elle mes expériences sans mentir ?',
      a: 'Notre intelligence artificielle agit comme un coach en recrutement : elle analyse vos véritables missions et les reformule avec des verbes d\'action percutants et un vocabulaire adapté à votre secteur. Elle a pour consigne stricte de ne JAMAIS inventer d\'entreprises, de dates ou de faux diplômes.'
    },
    {
      q: 'Mon CV est-il compatible avec les logiciels ATS des recruteurs ?',
      a: 'Oui, absolument. Tous nos 10 modèles professionnels sont conçus selon les critères stricts de lisibilité des systèmes de suivi des candidatures (ATS) : hiérarchie HTML claire, polices standards et structure optimisée.'
    },
    {
      q: 'Puis-je modifier mon CV après l\'avoir téléchargé ?',
      a: 'Oui, votre CV est conservé dans votre espace. Vous pouvez revenir à tout moment pour modifier vos informations ou changer de modèle gratuitement.'
    },
    {
      q: 'La lettre de motivation est-elle incluse ?',
      a: 'Oui ! Notre plateforme inclut 2 générations complètes de lettres de motivation personnalisées générées par l\'IA en fonction de votre CV et de l\'entreprise que vous ciblez.'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION WITH REALISTIC CV SHOWCASE */}
      <HeroSection onStartCV={onStartCV} lang={lang} />

      {/* 2. 4-STEP WORKFLOW */}
      <section id="workflow-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Processus simple et ultra rapide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Comment créer votre CV en 4 étapes simples
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Pas besoin de compétences en mise en page : vous fournissez les faits, nous nous chargeons du reste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Renseignez vos infos',
              desc: 'Saisissez simplement votre parcours, vos diplômes et coordonnées via notre formulaire guidé pas à pas.'
            },
            {
              step: '02',
              title: 'Boostez avec l\'IA',
              desc: 'En 1 clic, notre assistant reformule vos missions avec des verbes d\'action valorisants sans rien inventer.'
            },
            {
              step: '03',
              title: 'Choisissez un design',
              desc: 'Sélectionnez parmi 10 modèles graphiques certifiés ATS et ajustez vos couleurs favorites.'
            },
            {
              step: '04',
              title: 'Téléchargez en PDF HD',
              desc: 'Exportez votre CV A4 haute définition sans filigrane avec modifications illimitées.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 hover:shadow-md transition-all relative group"
            >
              <div className="text-3xl font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                {item.step}
              </div>
              <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TEMPLATES GALLERY WITH DOMAIN / CATEGORY FILTERS & HIGH RES PREVIEWS */}
      <TemplatesGallery onSelectTemplate={(templateId) => onStartCV(templateId)} lang={lang} />

      {/* 4. AI TRUTH & NO-HALLUCINATION GUARANTEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl p-8 sm:p-12 border border-blue-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantie de véracité & Éthique IA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Une IA qui valorise vos réelles compétences sans jamais inventer d'informations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Contrairement à des générateurs génériques qui inventent des postes ou des diplômes fictifs (hallucinations), notre modèle respecte scrupuleusement la réalité de votre parcours. Il structure, clarifie et enrichit votre vocabulaire pour maximiser vos chances auprès des recruteurs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verbes d'action ciblés pour chaque secteur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mots-clés pertinents pour les filtres ATS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zéro fausse certification inventée</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation humaine avant d'appliquer</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-blue-200/80 shadow-md space-y-4 text-xs">
              <div className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
                <span>Exemple d'optimisation IA</span>
                <span className="text-blue-600 font-semibold">Avant / Après</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Votre saisie brute :</span>
                <p className="p-2.5 bg-slate-50 text-slate-600 rounded-lg italic">
                  « Je préparais les commandes dans l'entrepôt et vérifiais les stocks. »
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600">Formulation valorisée par l'IA :</span>
                <p className="p-2.5 bg-blue-50/70 text-slate-900 rounded-lg font-medium border border-blue-100">
                  « Gestion et préparation rigoureuse des commandes logistiques, optimisation de la rotation des stocks et respect des cadences d'expédition. »
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pourquoi choisir CV EN LIGNE ?</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comparez notre solution avec les méthodes classiques et les abonnements coûteux.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-4 sm:p-5 font-bold">Critères</th>
                <th className="p-4 sm:p-5 font-bold text-slate-400">Word / Modèle manuel</th>
                <th className="p-4 sm:p-5 font-bold text-slate-400">Sites à abonnement (29€/mois)</th>
                <th className="p-4 sm:p-5 font-bold text-blue-600 bg-blue-50/60">CV EN LIGNE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Prix transparent</td>
                <td className="p-4 sm:p-5 text-slate-500">Gratuit mais difficile</td>
                <td className="p-4 sm:p-5 text-red-500 font-semibold">Abonnement reconduit automatiquement</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">$1.99 Pass Flash (Achat Unique)</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Assistant IA de valorisation</td>
                <td className="p-4 sm:p-5"><XIcon className="w-4 h-4 text-slate-300" /></td>
                <td className="p-4 sm:p-5 text-slate-500">Souvent basique ou absent</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30"><Check className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Mise en page automatique A4</td>
                <td className="p-4 sm:p-5"><XIcon className="w-4 h-4 text-slate-300" /></td>
                <td className="p-4 sm:p-5"><Check className="w-4 h-4 text-emerald-600" /></td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30"><Check className="w-4 h-4 text-emerald-600" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Lettre de motivation IA incluse</td>
                <td className="p-4 sm:p-5"><XIcon className="w-4 h-4 text-slate-300" /></td>
                <td className="p-4 sm:p-5 text-slate-400">Option payante supplémentaire</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">Inclus (2 générations)</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-semibold text-slate-900">Modifications gratuites futures</td>
                <td className="p-4 sm:p-5"><Check className="w-4 h-4 text-emerald-600" /></td>
                <td className="p-4 sm:p-5 text-red-500">Bloqué si l'abonnement expire</td>
                <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">Illimitées à vie</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TESTIMONIALS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
            <span>Note moyenne de 4.9/5 basée sur +12 000 recrutements</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ils ont décroché leur job avec CV EN LIGNE</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Découvrez comment notre outil a aidé des étudiants, des diplômés et des professionnels en reconversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah M.',
              role: 'Étudiante en Master Marketing',
              review: '« J’ai décroché mon stage de fin d’études en seulement deux semaines ! L’IA a parfaitement formulé mes expériences universitaires avec des verbes valorisants. »',
              rating: 5,
              badge: 'Stage validé'
            },
            {
              name: 'Thomas B.',
              role: 'Développeur Junior',
              review: '« Pour $1.99, c’est le meilleur investissement de ma recherche d’emploi. Le PDF est parfaitement calibré A4, lisible sur mobile et approuvé par les ATS. »',
              rating: 5,
              badge: 'Premier CDI'
            },
            {
              name: 'Fatima Z.',
              role: 'Reconversion Chef de Projet',
              review: '« Je ne savais pas comment valoriser mes 8 ans dans le commerce. L’accroche et les compétences suggérées par l’IA ont fait toute la différence lors des entretiens. »',
              rating: 5,
              badge: 'Reconversion réussie'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  {item.review}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {item.name[0]}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PRICING SECTION (4 FORMULAS: PASS FLASH $1.99, PASS PRO $3.99, MONTHLY $7.99, ANNUAL $39.99) */}
      <Pricing onSelectPlan={() => onStartCV()} />

      {/* 8. FAQ */}
      <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Vos questions</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Foire Aux Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'transform rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT SUPPORT SECTION */}
      <ContactSection lang={lang} />
    </div>
  );
};
