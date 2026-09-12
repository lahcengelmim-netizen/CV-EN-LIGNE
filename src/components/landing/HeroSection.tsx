import React, { useState } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TEMPLATES_CATALOG, getTemplateById } from '../../lib/templatesData';
import { CVRenderer } from '../templates/CVRenderer';
import { ENABLE_PAYMENTS } from '../../config/features';
import { useLanguage } from '../../context/LanguageContext';
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
  onImportCV?: () => void;
  lang?: LanguageCode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartCV, onImportCV, lang = 'fr' }) => {
  const { t } = useLanguage();
  const [heroTemplateId, setHeroTemplateId] = useState<TemplateId>('stockholm-modern');
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
              <span>{t('hero.badge', 'Générateur de CV certifié ATS & Assistant IA')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              {t('hero.titleLine1', 'Le CV parfait pour')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                {t('hero.titleLine2', 'décrocher votre prochain job.')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('hero.subtitle', "Créez un CV professionnel, percutant et 100% conforme aux filtres ATS en moins de 10 minutes. Optimisé par l'IA pour valoriser vos réelles réussites professionnelles.")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onStartCV(heroTemplateId)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span>{t('hero.ctaPrimary', 'Créer mon CV maintenant')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#templates-section"
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-sm border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layout className="w-4 h-4 text-slate-500" />
                <span>{t('hero.ctaSecondary', 'Explorer les 10 modèles')}</span>
              </a>

              {onImportCV && (
                <button
                  type="button"
                  onClick={onImportCV}
                  className="w-full sm:w-auto px-6 py-4 bg-blue-50/80 hover:bg-blue-100 text-blue-700 rounded-2xl font-bold text-sm border border-blue-200/80 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Importer un PDF</span>
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('hero.badgeAts', 'Conforme filtres ATS RH')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('hero.badgeA4', 'Format A4 PDF Haute Résolution')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-xl border border-slate-200/60 shadow-2xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>
                  {ENABLE_PAYMENTS
                    ? t('hero.guaranteePrice', 'Dès $1.99 (Pass Flash) & Formules Illimitées')
                    : t('hero.freeAccess', 'Accès 100% Gratuit (Période Test)')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real CV Showcase with depth & floating cards (5.5 / 6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center">
            {/* Template Switcher Bar above the Mockup */}
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-1 mb-4 z-20 overflow-x-auto">
              {([
                'stockholm-modern',
                'zurich-executive',
                'casablanca-bilingual',
                'silicon-tech',
                'modern'
              ] as TemplateId[]).map((id) => {
                const tpl = getTemplateById(id);
                const isSelected = heroTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setHeroTemplateId(tpl.id)}
                    className={`py-1.5 px-3 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tpl.title}
                  </button>
                );
              })}
            </div>

            {/* Depth & Stacked Mockup Wrapper */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative stacked back card (depth illusion) */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-teal-600/20 to-blue-600/20 rounded-3xl transform rotate-2 blur-xs opacity-70"></div>
              <div className="absolute -inset-1 bg-white/60 rounded-3xl transform -rotate-1 border border-slate-200/80 shadow-md"></div>

              {/* Main Active Realistic CV Document Card */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 text-slate-800 font-sans z-10 transition-all duration-300 h-[580px] sm:h-[620px] flex flex-col justify-between">
                {/* Real Live Scaled Document - strictly LTR independent from page UI language */}
                <div 
                  className="w-full flex-1 overflow-hidden relative bg-slate-100/50 flex justify-center items-start pt-2"
                  dir="ltr"
                >
                  <div
                    className="bg-white origin-top pointer-events-none shrink-0 shadow-md"
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                      transform: 'scale(0.50)',
                      transformOrigin: 'top center',
                    }}
                  >
                    <CVRenderer data={sample} showWatermark={false} />
                  </div>
                </div>

                {/* Bottom Bar overlay with CTA */}
                <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0 z-20">
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate">
                      {activeTemplate.name}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{t('templates.atsScore', 'Score ATS')} : {activeTemplate.atsScore}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartCV(heroTemplateId)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-blue-500/25 shrink-0"
                  >
                    <span>{t('templates.useTemplate', 'Créer ce CV')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Floating review card bottom left */}
              <div className="hidden sm:flex absolute -bottom-5 -left-8 bg-white p-3 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-3 z-30">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                  ★ 4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('hero.reviewsCount', '12 400+ CVs créés')}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{t('hero.interviewsWon', "94% d'entretiens décrochés")}</div>
                </div>
              </div>

              {/* Floating format badge top right */}
              <div className="hidden sm:flex absolute -top-4 -right-6 bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-200/80 items-center gap-1.5 text-xs font-bold text-slate-800 z-30">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('hero.formatUniversal', 'Format A4 Universel')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
