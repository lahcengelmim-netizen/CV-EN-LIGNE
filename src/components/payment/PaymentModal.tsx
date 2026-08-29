import React, { useState } from 'react';
import { CVData, LanguageCode, PlanType } from '../../types';
import { translations } from '../../lib/translations';
import { PRICING_PLANS, getPlanDetails } from '../../lib/pricingConfig';
import { passService } from '../../lib/passService';
import { Check, ShieldCheck, CreditCard, Lock, Sparkles, Loader2, X, Star, Crown, Zap, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData?: CVData;
  initialPlan?: string;
  lang?: LanguageCode;
  onSuccess: (planType?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cvData,
  initialPlan = 'single_cv',
  lang = 'fr',
  onSuccess
}) => {
  const t = translations[lang] || translations.fr;
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [cardName, setCardName] = useState(cvData ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim() : 'Alex Dupont');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = getPlanDetails(selectedPlan);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStep('processing');

    try {
      // 1. Request Order Creation from Server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: cvData?.id || 'cv_unlimited',
          cvTitle: cvData ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} - CV` : currentPlan.name,
          planType: selectedPlan
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Erreur lors de l\'initialisation du paiement.');
      }

      // Simulate ultra-secure token processing delay
      await new Promise((r) => setTimeout(r, 800));

      // 2. Verify with Server
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          cvId: cvData?.id || 'cv_unlimited',
          planType: selectedPlan,
          paymentMethod: 'Carte Bancaire (Stripe/CB)'
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.verified) {
        throw new Error('Échec de validation de la transaction.');
      }

      // 3. Activate pass locally & globally via passService
      passService.activatePurchasedPass(selectedPlan, {
        downloadCredits: verifyData.downloadCredits,
        passExpiresAt: verifyData.subscriptionEnd
      });

      // 4. Success Confetti
      setStep('success');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onSuccess(selectedPlan);
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Erreur de paiement. Veuillez réessayer.');
      setStep('checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-950" />
              100% Secure Payment (SSL Encryption)
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Choisissez votre Pass de Téléchargement
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Téléchargez vos CVs au format PDF A4 Haute Définition vectoriel sans filigrane
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {step === 'checkout' && (
            <form onSubmit={handlePay} className="space-y-5">
              {/* Plan Selection Tabs - 4 Distinct Plans */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sélectionnez votre formule :
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* 1. Pass Flash ($1.99 - 1 Credit) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('single_cv')}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      selectedPlan === 'single_cv' || selectedPlan === 'flash'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">Pass Flash</div>
                      <div className="text-sm font-black text-blue-700 mt-0.5">$1.99</div>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 font-medium leading-tight">1 CV (1 PDF)</div>
                  </button>

                  {/* 2. Pass Pro 7 Jours ($3.99 - Unlimited 7 Days) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('pro')}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      selectedPlan === 'pro'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-1.5 px-1.5 py-0.5 rounded bg-indigo-600 text-white font-black text-[7px] uppercase tracking-wider shadow-2xs">
                      PRO 7J
                    </span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">Pass Pro</div>
                      <div className="text-sm font-black text-indigo-700 mt-0.5">$3.99</div>
                    </div>
                    <div className="text-[9px] text-indigo-600 font-semibold mt-1 leading-tight">7 jours illimités</div>
                  </button>

                  {/* 3. Monthly ($7.99) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('monthly')}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      selectedPlan === 'monthly'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">Pass Mensuel</div>
                      <div className="text-sm font-black text-blue-700 mt-0.5">$7.99</div>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 leading-tight">Illimité / mois</div>
                  </button>

                  {/* 4. Yearly ($39.99) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('yearly')}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      selectedPlan === 'yearly' || selectedPlan === 'annual'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-1 px-1 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[7px] uppercase tracking-wider shadow-2xs">
                      -50%
                    </span>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">Pass Annuel</div>
                      <div className="text-sm font-black text-amber-600 mt-0.5">$39.99</div>
                    </div>
                    <div className="text-[9px] text-amber-700 font-semibold mt-1 leading-tight">1 An (~$3.3/m)</div>
                  </button>
                </div>
              </div>

              {/* Selected Plan Details Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {selectedPlan === 'yearly' && <Crown className="w-3.5 h-3.5 text-amber-600" />}
                      {selectedPlan === 'pro' && <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />}
                      {selectedPlan === 'monthly' && <Zap className="w-3.5 h-3.5 text-blue-600" />}
                      {selectedPlan === 'single_cv' && <FileText className="w-3.5 h-3.5 text-slate-700" />}
                      {currentPlan.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{currentPlan.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-slate-900">{currentPlan.priceDisplay}</div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">{currentPlan.periodDisplay}</div>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-2.5 space-y-1.5 text-xs text-slate-600">
                  {currentPlan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {currentPlan.notIncluded && currentPlan.notIncluded.length > 0 && (
                    <div className="border-t border-slate-200/50 pt-1.5 space-y-1 text-slate-400">
                      {currentPlan.notIncluded.map((nf, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{nf}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Card Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Informations de Carte Bancaire
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Chiffré SSL 256-bit</span>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Nom complet du titulaire"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Numéro de carte bancaire"
                    className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC / CVV"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500'
                    : selectedPlan === 'pro'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Payer {currentPlan.priceDisplay} & Activer immédiatement</span>
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Satisfait ou Remboursé (14 jours) • 100% Sécurisé (SSL)</span>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="text-base font-bold text-slate-800">
                Traitement sécurisé ({currentPlan.priceDisplay})...
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                Vérification bancaire et activation instantanée de vos crédits de téléchargement...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Paiement validé avec succès !</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Votre formule <strong>{currentPlan.name}</strong> est désormais active. Votre téléchargement démarre immédiatement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
