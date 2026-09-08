import React, { useRef } from 'react';
import { PersonalInfo, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Mail, Phone, MapPin, Globe, Linkedin, Upload, Trash2 } from 'lucide-react';
import { DEFAULT_AVATAR_PLACEHOLDER } from '../../lib/defaultAvatar';

interface Props {
  info: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  lang?: LanguageCode;
}

export const StepPersonalInfo: React.FC<Props> = ({ info, onChange }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange('photoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

      {/* Photo Uploader */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-400">
            {info.photoUrl ? (
              <img src={info.photoUrl} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <img src={DEFAULT_AVATAR_PLACEHOLDER} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
            title={t('form.personal.changePhoto', 'Changer la photo')}
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="font-semibold text-sm text-slate-800">
            {t('form.personal.photo', 'Photo de profil professionnelle')}
          </div>
          <p className="text-xs text-slate-500">
            {t('form.personal.photoHint', 'Format JPG ou PNG conseillé. Une photo soignée et souriante augmente le taux de retour.')}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('form.personal.importPhoto', 'Importer une photo')}</span>
            </button>
            {info.photoUrl && (
              <button
                type="button"
                onClick={() => handleChange('photoUrl', '')}
                className="text-xs font-semibold px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('form.personal.removePhoto', 'Retirer')}</span>
              </button>
            )}
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
