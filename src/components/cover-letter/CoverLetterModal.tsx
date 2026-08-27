import React, { useState } from 'react';
import { CVData, LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { FileText, Sparkles, Copy, Check, Loader2, X, AlertCircle, Send } from 'lucide-react';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  lang?: LanguageCode;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  isOpen,
  onClose,
  cvData,
  lang = 'fr'
}) => {
  const [targetJob, setTargetJob] = useState(cvData.personalInfo.title || '');
  const [companyName, setCompanyName] = useState('');
  const [recipientName, setRecipientName] = useState('Responsable du Recrutement');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [letterResult, setLetterResult] = useState<{
    subject: string;
    content: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: cvData.userId || 'anonymous_user',
          candidateName: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`,
          candidateEmail: cvData.personalInfo.email,
          candidatePhone: cvData.personalInfo.phone,
          candidateCity: cvData.personalInfo.city,
          jobTitle: targetJob,
          companyName,
          recipientName,
          cvSummary: cvData.summary,
          experiences: cvData.experiences,
          skills: cvData.skills.map((s) => s.name),
          lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération.');
      }

      setLetterResult(data.data);
      if (typeof data.remainingUses === 'number') {
        setRemainingUses(data.remainingUses);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de génération.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letterResult) return;
    const fullText = `${letterResult.subject}\n\n${letterResult.content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileText className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assistant Lettre de Motivation IA</h3>
              <p className="text-xs text-purple-200">
                Génération ciblée basée sur votre CV (Inclus : 2 générations gratuites)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {!letterResult ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Sur-mesure et prête pour votre candidature</span>
                </div>
                <p className="text-purple-700 leading-relaxed">
                  L'IA va croiser vos expériences et compétences réelles avec l'entreprise et le poste ciblés.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Poste ciblé <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder="Ex : Chef de Projet Digital, Comptable Unique..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex : L'Oréal, BNP Paribas, Startup XYZ..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Destinataire (optionnel)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ex : Madame la Directrice des RH"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                )}
                <span>Rédiger ma lettre de motivation</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Objet : <span className="text-slate-900">{letterResult.subject}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
                </button>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {letterResult.content}
              </div>

              {typeof remainingUses === 'number' && (
                <div className="text-xs text-slate-400 text-center">
                  Générations restantes sur votre quota : <strong>{remainingUses} / 2</strong>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setLetterResult(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Générer pour une autre entreprise
                </button>
                <button
                  onClick={handleCopy}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copier et fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
