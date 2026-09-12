import React, { useRef, useState } from 'react';
import { PersonalInfo, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Mail, Phone, MapPin, Globe, Linkedin, Upload, Trash2, CheckCircle2, Circle, Square } from 'lucide-react';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../lib/defaultAvatar';

interface Props {
  info: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  lang?: LanguageCode;
}

export const StepPersonalInfo: React.FC<Props> = ({ info, onChange }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...info, [field]: value });
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleChange('photoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const currentShape = info.photoShape || 'rounded';
  const shapeContainerClass = currentShape === 'circle' 
    ? 'rounded-full' 
    : 'rounded-2xl sm:rounded-3xl';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t('form.personal.title', '1. Informations Personnelles')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('form.personal.subtitle', 'Renseignez vos coordonnées de base pour permettre aux recruteurs de vous contacter facilement.')}
        </p>
      </div>

      {/* Photo Uploader (150px - 180px Large Container with Clean Upload Overlay & Shape Controls) */}
      <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Main Photo Box (160px - 176px width/height) */}
          <div className="flex flex-col items-center shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`relative group cursor-pointer w-[160px] h-[160px] sm:w-[176px] sm:h-[176px] ${shapeContainerClass} overflow-hidden border-2 transition-all duration-200 select-none shadow-sm ${
                isDragging 
                  ? 'border-blue-500 ring-4 ring-blue-500/20 bg-blue-50 scale-[1.02]' 
                  : 'border-slate-300 hover:border-blue-500 bg-white'
              }`}
              title={t('form.personal.changePhoto', 'Cliquez pour télécharger ou faites glisser votre image')}
            >
              {info.photoUrl ? (
                <>
                  <img
                    src={info.photoUrl}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                  {/* Clean Responsive Upload Overlay on Hover / Active Drag */}
                  <div
                    className={`absolute inset-0 bg-slate-900/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 text-center transition-opacity duration-200 ${
                      isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center mb-1.5 shadow-sm">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-white leading-snug max-w-[140px]">
                      Cliquez pour télécharger ou faites glisser votre image
                    </p>
                    <span className="text-[9px] text-white/80 mt-1">
                      JPG, PNG ou WebP
                    </span>
                  </div>
                </>
              ) : (
                /* Empty Upload Prompt Overlay */
                <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-100/70 hover:bg-blue-50/50 transition-colors">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 shadow-xs transition-transform group-hover:scale-105 ${
                    isDragging ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-slate-200'
                  }`}>
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight max-w-[140px]">
                    Cliquez pour télécharger ou faites glisser votre image
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1">
                    JPG, PNG ou WebP (max 10 Mo)
                  </span>
                </div>
              )}

              {/* Quick Floating Camera Badge for Visual Guidance */}
              <div className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-md pointer-events-none group-hover:scale-105 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Right Details & Configuration */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <div className="font-bold text-sm sm:text-base text-slate-900 flex items-center justify-center md:justify-start gap-2">
                <span>{t('form.personal.photo', 'Photo de profil')}</span>
                {info.photoUrl && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('common.configured', 'Active')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                {t('form.personal.photoHint', 'Format JPG ou PNG conseillé. Une photo nette avec un cadrage soigné valorise votre candidature auprès des recruteurs.')}
              </p>
            </div>

            {/* Shape Options (Subtle rounded corners vs Full circular) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Style du cadrage sur le CV
              </label>
              <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl gap-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleChange('photoShape', 'rounded')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentShape === 'rounded'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Angles adoucis modernes"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Coins arrondis</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('photoShape', 'circle')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentShape === 'circle'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Format portrait circulaire"
                >
                  <Circle className="w-3.5 h-3.5" />
                  <span>Cercle complet</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 hover:border-slate-400 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>{info.photoUrl ? t('form.personal.changePhoto', 'Changer la photo') : t('form.personal.importPhoto', 'Importer une photo')}</span>
              </button>

              {info.photoUrl && (
                <button
                  type="button"
                  onClick={() => handleChange('photoUrl', '')}
                  className="text-xs font-semibold px-3 py-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('form.personal.removePhoto', 'Retirer la photo')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.firstName', 'Prénom')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={info.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Ex : Alexandre"
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.lastName', 'Nom')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={info.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Ex : Dubois"
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.jobTitle', 'Titre du poste visé')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={info.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('form.personal.jobTitlePlaceholder', 'Ex : Développeur Web Full Stack, Assistant Administratif, Chef de Projet...')}
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.email', 'Adresse email')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={info.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="votre.email@domaine.com"
              className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.phone', 'Téléphone')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              required
              value={info.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.city', 'Ville')}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Paris, Lyon, Marseille..."
              className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.country', 'Pays')}
          </label>
          <input
            type="text"
            value={info.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="France, Belgique, Suisse, Maroc..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.linkedin', 'Profil LinkedIn')}
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/prenom-nom"
              className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('form.personal.website', 'Site web / Portfolio')}
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={info.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="mon-site.fr"
              className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
