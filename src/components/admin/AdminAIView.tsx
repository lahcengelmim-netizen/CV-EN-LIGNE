import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  FileCheck,
  ShieldCheck,
  Activity,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { adminService } from '../../lib/adminService';

export const AdminAIView: React.FC = () => {
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAI = async () => {
    setLoading(true);
    const data = await adminService.getAIAnalytics();
    setAiData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAI();
  }, []);

  if (loading || !aiData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Chargement de la télémétrie IA...</span>
        </div>
      </div>
    );
  }

  const endpointBreakdown = [
    {
      name: 'Amélioration Expérience',
      endpoint: '/api/ai/enhance-experience',
      count: aiData.experienceEnhancements,
      desc: 'Formulation percutante sans invention d\'entreprises ou dates fictives'
    },
    {
      name: 'Optimisation Résumé / Accroche',
      endpoint: '/api/ai/enhance-summary',
      count: aiData.summaryEnhancements,
      desc: 'Accroches concises de 3-4 phrases percutantes avec mots-clés ATS'
    },
    {
      name: 'Suggestion Compétences',
      endpoint: '/api/ai/suggest-skills',
      count: aiData.skillSuggestions,
      desc: '12 compétences clés adaptées aux métiers ciblés'
    },
    {
      name: 'Lettres de Motivation (Max 2/user)',
      endpoint: '/api/ai/generate-cover-letter',
      count: aiData.coverLetters,
      desc: 'Rédaction personnalisée avec limite stricte de 2 générations par utilisateur'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Télémétrie & Utilisation de l'IA (Gemini 3.7 Flash)
          </h2>
          <p className="text-xs text-slate-400">
            Suivi des requêtes IA, respect des règles anti-hallucination et contrôle des quotas de lettres de motivation
          </p>
        </div>

        <button
          onClick={fetchAI}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-b from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Total Appels IA</div>
          <div className="text-3xl font-black text-white">{aiData.totalCalls}</div>
          <div className="text-[11px] text-purple-300 mt-2">Tous endpoints confondus</div>
        </div>

        <div className="p-5 bg-gradient-to-b from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Appels Aujourd'hui</div>
          <div className="text-3xl font-black text-blue-400">{aiData.callsToday}</div>
          <div className="text-[11px] text-slate-400 mt-2">Dernières 24 heures</div>
        </div>

        <div className="p-5 bg-gradient-to-b from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Utilisateurs Actifs IA</div>
          <div className="text-3xl font-black text-emerald-400">{aiData.uniqueUsers}</div>
          <div className="text-[11px] text-slate-400 mt-2">Comptes uniques assistés</div>
        </div>

        <div className="p-5 bg-gradient-to-b from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 mb-1">Lettres Générées</div>
          <div className="text-3xl font-black text-amber-400">{aiData.coverLetters}</div>
          <div className="text-[11px] text-slate-400 mt-2">Limite : 2 max par utilisateur</div>
        </div>
      </div>

      {/* Breakdown by Feature */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold text-base text-white mb-4">Répartition par Fonctionnalité IA</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {endpointBreakdown.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100">{item.name}</span>
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs font-bold rounded-lg">
                  {item.count} appels
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                {item.endpoint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anti-Hallucination & Ethical AI Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Charte Éthique & Règles Anti-Hallucination</h3>
            <p className="text-xs text-slate-400">Garanties de conformité intégrées dans les prompts système</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Zéro invention d'entreprises ou de diplômes :</strong> L'IA reformule uniquement les informations réelles renseignées par le candidat.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Verbes d'action professionnels :</strong> Utilisation systématique de termes précis et valorisants conformes aux standards RH.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Plafond de sécurité pour les lettres de motivation :</strong> Restriction stricte à 2 générations par utilisateur pour préserver les ressources API et garantir la pertinence de chaque envoi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
