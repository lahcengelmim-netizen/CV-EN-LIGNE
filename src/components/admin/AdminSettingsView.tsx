import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Save,
  CheckCircle2,
  DollarSign,
  Mail,
  ToggleLeft,
  ToggleRight,
  Database,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { AdminSettings } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const data = await adminService.getSettings();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const ok = await adminService.updateSettings(settings);
    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Configuration & Paramètres de la Plateforme
          </h2>
          <p className="text-xs text-slate-400">
            Gestion du prix unitaire par CV (2,00 $), emails de notification administrative et connecteurs
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Pricing & Monetization */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Tarification & Paiement</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Prix de Téléchargement par CV ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.50"
                value={settings.cvPrice || 2.00}
                onChange={(e) => setSettings({ ...settings, cvPrice: parseFloat(e.target.value) })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Tarif fixe facturé pour chaque téléchargement HD en PDF A4.
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Devise Principale</label>
              <input
                type="text"
                disabled
                value={settings.currency || 'USD'}
                className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-bold cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Devise standard internationale ($).
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Administrative Emails */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Mail className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Notifications & Contact Administrateur</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Email de Notification Support (Admin Principal)</label>
              <input
                type="email"
                value={settings.supportNotificationEmail || 'lahcengelmim@gmail.com'}
                onChange={(e) => setSettings({ ...settings, supportNotificationEmail: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Toutes les alertes et messages du formulaire de contact sont envoyés à cette adresse.
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Nom Public de la Plateforme</label>
              <input
                type="text"
                value={settings.platformName || 'CV EN LIGNE'}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Feature Toggles */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Contrôle des Modules & IA</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Moteur d'assistance IA (Gemini 3.7 Flash)</span>
                <p className="text-slate-400 text-[11px]">Active les suggestions d'expérience et d'accroches pour les utilisateurs</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, aiEnhancementEnabled: !settings.aiEnhancementEnabled })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  settings.aiEnhancementEnabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {settings.aiEnhancementEnabled !== false ? 'Activé' : 'Désactivé'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="font-bold text-slate-200">Générateur de lettre de motivation</span>
                <p className="text-slate-400 text-[11px]">Autorise les utilisateurs à générer jusqu'à 2 lettres de motivation</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, coverLetterEnabled: !settings.coverLetterEnabled })}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  settings.coverLetterEnabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {settings.coverLetterEnabled !== false ? 'Activé' : 'Désactivé'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paramètres enregistrés avec succès !</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
