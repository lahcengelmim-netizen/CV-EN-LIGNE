import React, { useState, useEffect } from 'react';
import {
  Palette,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sparkles,
  Layers,
  RefreshCw
} from 'lucide-react';
import { AdminTemplateInfo } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<AdminTemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    const data = await adminService.getTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleToggle = async (templateId: string) => {
    const success = await adminService.toggleTemplate(templateId);
    if (success) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === templateId ? { ...t, active: !t.active } : t))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            Gestion des Modèles de CV
          </h2>
          <p className="text-xs text-slate-400">
            Activation/Désactivation en direct et suivi de popularité des 5 modèles certifiés ATS
          </p>
        </div>

        <button
          onClick={fetchTemplates}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`bg-slate-900 border rounded-3xl overflow-hidden transition-all duration-200 ${
              tpl.active ? 'border-slate-800 hover:border-slate-700' : 'border-red-900/40 opacity-75'
            }`}
          >
            {/* Visual Header / Banner */}
            <div className={`h-28 bg-gradient-to-r ${tpl.bgStyle} p-4 flex flex-col justify-between relative`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-black/40 backdrop-blur-md text-white font-bold text-[10px] rounded-full">
                  {tpl.tag}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    tpl.active ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {tpl.active ? 'Actif sur le site' : 'Désactivé'}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white">{tpl.name}</h3>
                <p className="text-[11px] text-white/80">{tpl.style}</p>
              </div>
            </div>

            {/* Template Body Card */}
            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-300 text-xs leading-relaxed min-h-[36px]">
                {tpl.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Utilisations</span>
                  <div className="text-base font-black text-white">{tpl.usageCount} CVs</div>
                </div>

                <button
                  onClick={() => handleToggle(tpl.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                    tpl.active
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                >
                  {tpl.active ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Désactiver</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Activer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
