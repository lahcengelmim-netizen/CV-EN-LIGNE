import React, { useState, useEffect } from 'react';
import { CVData, LanguageCode, PlanType } from '../../types';
import { translations } from '../../lib/translations';
import { PRICING_PLANS, getPlanDetails } from '../../lib/pricingConfig';
import { passService } from '../../lib/passService';
import { ENABLE_PAYMENTS } from '../../config/features';
import { Check, ShieldCheck, Lock, Loader2, X, Star, Crown, Zap, FileText, AlertTriangle, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

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
  if (!ENABLE_PAYMENTS || !isOpen) {
    return null;
  }

  const t = translations[lang] || translations.fr;
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [error, setError] = useState<string | null>(null);
  const [serverConfig, setServerConfig] = useState<{ configured: boolean; clientId: string; mode: string } | null>(null);
  const [checkingConfig, setCheckingConfig] = useState(true);
  const directContainerRef = React.useRef<HTMLDivElement>(null);
  const [useDirectSdk, setUseDirectSdk] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.paypal?.Buttons === 'function') {
      setUseDirectSdk(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/payment/config')
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setServerConfig(data);
          setCheckingConfig(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch payment config:', err);
        if (active) {
          setCheckingConfig(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const currentPlan = getPlanDetails(selectedPlan);
  const rawClientId = ((import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || (import.meta.env.PAYPAL_CLIENT_ID as string) || serverConfig?.clientId || '').trim();
  const isConfigured = Boolean(serverConfig?.configured && rawClientId);

  useEffect(() => {
    if (!isOpen || step !== 'checkout' || !useDirectSdk || !directContainerRef.current) return;

    if (typeof window !== 'undefined' && window.paypal?.Buttons) {
      directContainerRef.current.innerHTML = '';
      try {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: selectedPlan === 'yearly' ? 'gold' : 'blue',
            shape: 'rect',
            label: 'pay',
            height: 44
          },
          createOrder: async () => {
            if (!isConfigured) {
              const errText = 'Sandbox PayPal non configurée : veuillez définir PAYPAL_CLIENT_ID et PAYPAL_SECRET dans les variables d\'environnement.';
              setError(errText);
              throw new Error(errText);
            }
            setError(null);
            setLoading(true);

            try {
              const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cvId: cvData?.id || 'cv_unlimited',
                  cvTitle: cvData ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} - CV` : currentPlan.name,
                  planType: selectedPlan
                })
              });

              const data = await res.json();
              if (!res.ok || !data.orderId) {
                const errMsg = data.error || 'Impossible d\'initier la commande PayPal.';
                setError(errMsg);
                throw new Error(errMsg);
              }

              return data.orderId;
            } catch (err: any) {
              setError(err.message || 'Erreur lors de l\'initialisation de la commande.');
              setLoading(false);
              throw err;
            }
          },
          onApprove: async (data) => {
            setLoading(true);
            setStep('processing');
            try {
              const res = await fetch('/api/payment/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderID,
                  cvId: cvData?.id || 'cv_unlimited',
                  planType: selectedPlan
                })
              });

              const captureData = await res.json();

              if (!res.ok || !captureData.verified || captureData.status !== 'COMPLETED') {
                throw new Error(captureData.error || 'La capture PayPal n\'a pas pu être validée comme COMPLETED. Aucun crédit accordé.');
              }

              passService.activatePurchasedPass(selectedPlan, {
                downloadCredits: captureData.downloadCredits,
                passExpiresAt: captureData.subscriptionEnd
              });

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
              setError(err.message || 'Erreur lors de la validation du paiement PayPal.');
              setStep('checkout');
            } finally {
              setLoading(false);
            }
          },
          onError: (err) => {
            console.error('[PayPal SDK Error]:', err);
            setError('Une erreur est survenue lors de la communication avec PayPal. Veuillez réessayer.');
            setLoading(false);
          }
        }).render(directContainerRef.current);
      } catch (err) {
        console.warn('Failed to render direct PayPal buttons:', err);
      }
    }
  }, [isOpen, step, selectedPlan, isConfigured, useDirectSdk]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              PayPal Orders v2
            </span>

            {/* Requirement 4: Visible badge whenever PayPal keys are missing */}
            {!isConfigured && (
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3 h-3 text-slate-950" />
                Mode test — paiement non actif
              </span>
            )}
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
            <div className="space-y-5">
              {/* Requirement 4: Prominent Notice when PayPal is not configured */}
              {!isConfigured && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Mode test — paiement non actif</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                      Sandbox non configurée
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Les clés <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-semibold text-amber-950">PAYPAL_CLIENT_ID</code> et <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-semibold text-amber-950">PAYPAL_SECRET</code> ne sont pas encore définies. Aucun débit bancaire réel ne sera effectué et aucun crédit de téléchargement ne sera délivré tant que les clés ne sont pas configurées.
                  </p>
                </div>
              )}

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

              {/* Requirement 1: Official PayPal JS SDK Buttons */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Paiement Sécurisé PayPal
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>PayPal SSL 256-bit</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Information de transaction</div>
                      <div className="mt-0.5">{error}</div>
                    </div>
                  </div>
                )}

                <div className="w-full relative min-h-[50px]">
                  {useDirectSdk ? (
                    <div ref={directContainerRef} id="paypal-modal-direct-container" className="w-full min-h-[44px]"></div>
                  ) : (
                    <PayPalScriptProvider
                      options={{
                        clientId: rawClientId || 'test',
                        currency: 'USD',
                        intent: 'capture',
                        components: 'buttons'
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: 'vertical',
                          color: selectedPlan === 'yearly' ? 'gold' : 'blue',
                          shape: 'rect',
                          label: 'pay',
                          height: 44
                        }}
                        disabled={loading || !isConfigured}
                        forceReRender={[selectedPlan, isConfigured, rawClientId]}
                        createOrder={async () => {
                          if (!isConfigured) {
                            const errText = 'Sandbox PayPal non configurée : veuillez définir PAYPAL_CLIENT_ID et PAYPAL_SECRET dans les variables d\'environnement.';
                            setError(errText);
                            throw new Error(errText);
                          }

                          setError(null);
                          setLoading(true);

                          try {
                            const res = await fetch('/api/payment/create-order', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                cvId: cvData?.id || 'cv_unlimited',
                                cvTitle: cvData ? `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName} - CV` : currentPlan.name,
                                planType: selectedPlan
                              })
                            });

                            const data = await res.json();
                            if (!res.ok || !data.orderId) {
                              const errMsg = data.error || 'Impossible d\'initier la commande PayPal.';
                              setError(errMsg);
                              throw new Error(errMsg);
                            }

                            return data.orderId;
                          } catch (err: any) {
                            setError(err.message || 'Erreur lors de l\'initialisation de la commande.');
                            setLoading(false);
                            throw err;
                          }
                        }}
                        onApprove={async (data) => {
                          setLoading(true);
                          setStep('processing');
                          try {
                            const res = await fetch('/api/payment/capture-order', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                orderId: data.orderID,
                                cvId: cvData?.id || 'cv_unlimited',
                                planType: selectedPlan
                              })
                            });

                            const captureData = await res.json();

                            // Requirement 3: Strictly ensure COMPLETED before granting any credit
                            if (!res.ok || !captureData.verified || captureData.status !== 'COMPLETED') {
                              throw new Error(captureData.error || 'La capture PayPal n\'a pas pu être validée comme COMPLETED. Aucun crédit accordé.');
                            }

                            // Activate pass & credits locally & globally
                            passService.activatePurchasedPass(selectedPlan, {
                              downloadCredits: captureData.downloadCredits,
                              passExpiresAt: captureData.subscriptionEnd
                            });

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
                            setError(err.message || 'Erreur lors de la validation du paiement PayPal.');
                            setStep('checkout');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        onError={(err) => {
                          console.error('[PayPal SDK Error]:', err);
                          if (!isConfigured) {
                            setError('Mode test — paiement non actif : les identifiants PAYPAL_CLIENT_ID et PAYPAL_SECRET doivent être configurés pour autoriser les paiements.');
                          } else {
                            setError('Une erreur est survenue lors de la communication avec PayPal. Veuillez réessayer.');
                          }
                          setLoading(false);
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement sécurisé par PayPal • Satisfait ou Remboursé (14 jours)</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="text-base font-bold text-slate-800">
                Validation du paiement PayPal ({currentPlan.priceDisplay})...
              </div>
              <p className="text-xs text-slate-500 max-w-xs">
                Capture de la transaction en cours et déblocage de vos crédits de téléchargement...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Paiement PayPal validé avec succès !</h4>
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
