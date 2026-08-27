import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TEMPLATES_CATALOG, getTemplateById } from '../../lib/templatesData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Star,
  Zap,
  Layout,
  Award,
  Layers,
  FileCheck
} from 'lucide-react';

interface HeroSectionProps {
  onStartCV: (templateId?: TemplateId) => void;
  lang?: LanguageCode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartCV, lang = 'fr' }) => {
  const [heroTemplateId, setHeroTemplateId] = useState<TemplateId>('modern');
  const activeTemplate = getTemplateById(heroTemplateId);
  const sample = activeTemplate.sampleCV;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs (6.5 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-blue-800 text-xs font-bold border border-blue-200/80 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Générateur de CV certifié ATS & Assistant IA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Le CV parfait pour <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                décrocher votre prochain job.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Créez un CV professionnel, percutant et 100% conforme aux filtres ATS en moins de 10 minutes. Optimisé par l'IA pour valoriser vos réelles réussites professionnelles.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onStartCV(heroTemplateId)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>Créer mon CV maintenant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#templates-section"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layout className="w-4 h-4 text-slate-500" />
                <span>Explorer les 10 modèles</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Conforme filtres ATS RH</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Format A4 PDF Haute Résolution</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Dès 2,00 $ (1 CV) & Formules Illimitées</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real CV Showcase with depth & floating cards (5.5 / 6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center">
            {/* Template Switcher Bar above the Mockup */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-1 mb-4 z-20 overflow-x-auto">
              {TEMPLATES_CATALOG.map((t) => {
                const isSelected = heroTemplateId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setHeroTemplateId(t.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t.title}
                  </button>
                );
              })}
            </div>

            {/* Depth & Stacked Mockup Wrapper */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative stacked back card (depth illusion) */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-3xl transform rotate-2 blur-xs opacity-70"></div>
              <div className="absolute -inset-1 bg-white/60 rounded-3xl transform -rotate-1 border border-slate-200/80 shadow-md"></div>

              {/* Main Active Realistic CV Document Card */}
              <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 text-slate-800 font-sans space-y-4 z-10 transition-all duration-300">
                {/* CV Header */}
                <div
                  className="p-4 rounded-2xl text-white flex items-center justify-between shadow-xs transition-colors"
                  style={{ backgroundColor: activeTemplate.defaultColor }}
                >
                  <div className="flex items-center gap-3">
                    {sample.personalInfo.photoUrl ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 shadow-xs shrink-0">
                        <img
                          src={sample.personalInfo.photoUrl}
                          alt="Portrait"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm uppercase shrink-0">
                        {sample.personalInfo.firstName[0]}
                        {sample.personalInfo.lastName[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-black text-base tracking-tight leading-tight">
                        {sample.personalInfo.firstName} {sample.personalInfo.lastName}
                      </div>
                      <div className="text-xs text-white/90 font-medium">
                        {sample.personalInfo.title}
                      </div>
                      <div className="text-[10px] text-white/70 mt-0.5">
                        {sample.personalInfo.city} • {sample.personalInfo.email}
                      </div>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    {activeTemplate.badge}
                  </span>
                </div>

                {/* AI Value Enhancement Callout */}
                <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Valorisation IA certifiée
                    </span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                      Score ATS : {activeTemplate.atsScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    « {sample.summary.slice(0, 155)}... »
                  </p>
                </div>

                {/* Experience snippet */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Dernière expérience marquante
                  </div>
                  {sample.experiences.slice(0, 1).map((exp) => (
                    <div key={exp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{exp.position}</span>
                        <span className="text-[10px] font-bold text-blue-600">{exp.company}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-tight">
                        {exp.tasks[0] || exp.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Skills tags */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Compétences & Mots-clés ATS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sample.skills.slice(0, 4).map((s) => (
                      <span
                        key={s.id}
                        className="text-[10px] px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-lg"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => onStartCV(heroTemplateId)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <span>Personnaliser ce modèle ({activeTemplate.name})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Floating review card bottom left */}
              <div className="hidden sm:flex absolute -bottom-5 -left-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-3 z-30">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                  ★ 4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">12 400+ CVs créés</div>
                  <div className="text-[10px] text-slate-500 font-medium">94% d'entretiens décrochés</div>
                </div>
              </div>

              {/* Floating format badge top right */}
              <div className="hidden sm:flex absolute -top-4 -right-6 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-200/80 items-center gap-1.5 text-xs font-bold text-slate-800 z-30">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Format A4 Universel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
