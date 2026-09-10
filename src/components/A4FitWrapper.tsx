import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const DEFAULT_MIN_SCALE = 0.70;

export interface A4FitWrapperProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  dataDependency?: any;
  minScale?: number;
  showWarning?: boolean;
  warningMessage?: string;
  onScaleChange?: (scale: number) => void;
  disableFit?: boolean;
  outerScale?: number;
}

/**
 * A4FitWrapper - Composant universel de garantie A4 mono-page.
 *
 * Mesure dynamiquement la hauteur réelle du document (CV, lettre de motivation).
 * Si la hauteur dépasse A4_HEIGHT (1123px), calcule une échelle exacte :
 *   contentScale = A4_HEIGHT / measuredHeight (bornée par minScale, défaut 0.70)
 * Applique :
 *   - transform: scale(contentScale) avec transformOrigin: 'top left'
 *   - largeur interne = A4_WIDTH / contentScale pour conserver 794px affichés
 *   - conteneur extérieur strict A4 (794px x 1123px, overflow: hidden)
 *   - avertissement discret si le contenu dépasse la limite basse minScale
 */
export const A4FitWrapper: React.FC<A4FitWrapperProps> = ({
  id,
  className = '',
  style = {},
  children,
  dataDependency,
  minScale = DEFAULT_MIN_SCALE,
  showWarning = true,
  warningMessage,
  onScaleChange,
  disableFit = false,
  outerScale,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [contentScale, setContentScale] = useState<number>(1);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const scaleRef = useRef<number>(1);
  const isMeasuringRef = useRef<boolean>(false);
  const lastMeasuredHeightRef = useRef<number>(0);

  const measureAndFit = useCallback(() => {
    if (disableFit) {
      if (scaleRef.current !== 1) {
        scaleRef.current = 1;
        setContentScale(1);
        setIsOverflowing(false);
        onScaleChange?.(1);
      }
      return;
    }

    const inner = innerRef.current;
    const content = contentRef.current;
    if (!inner || !content) return;

    if (isMeasuringRef.current) return;
    isMeasuringRef.current = true;

    try {
      // Mesure temporaire à l'échelle 1 et largeur standard 794px (sans transformation)
      const prevTransform = inner.style.transform;
      const prevWidth = inner.style.width;

      inner.style.transform = 'none';
      inner.style.width = `${A4_WIDTH_PX}px`;

      // Forcer la lecture géométrique sans CSS transform
      const naturalHeight = Math.max(
        content.scrollHeight || 0,
        content.offsetHeight || 0,
        inner.scrollHeight || 0,
        inner.offsetHeight || 0
      );

      // Restaurer immédiatement avant tout cycle de rendu
      inner.style.transform = prevTransform;
      inner.style.width = prevWidth;

      if (naturalHeight <= 0) return;

      lastMeasuredHeightRef.current = naturalHeight;

      let targetScale = 1;
      let overflowing = false;

      if (naturalHeight > A4_HEIGHT_PX) {
        const rawScale = A4_HEIGHT_PX / naturalHeight;
        targetScale = Number(Math.max(minScale, Math.min(1, rawScale)).toFixed(3));
        overflowing = naturalHeight * minScale > A4_HEIGHT_PX + 8;
      } else {
        targetScale = 1;
        overflowing = false;
      }

      // Éviter tout re-render si le changement est négligeable (< 0.005)
      if (Math.abs(targetScale - scaleRef.current) >= 0.005) {
        scaleRef.current = targetScale;
        setContentScale(targetScale);
        onScaleChange?.(targetScale);
      }

      setIsOverflowing(overflowing);
    } finally {
      isMeasuringRef.current = false;
    }
  }, [disableFit, minScale, onScaleChange]);

  // Mesure synchrone avant le premier affichage pour éviter tout saut visuel
  useLayoutEffect(() => {
    measureAndFit();
  }, [measureAndFit, dataDependency]);

  // Observer les changements dynamiques (chargement asynchrone des polices, images, DOM)
  useEffect(() => {
    const handleRecalculate = () => {
      measureAndFit();
    };

    // Polices web
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(handleRecalculate).catch(() => {});
    }

    // Images
    const content = contentRef.current;
    if (content) {
      const images = content.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', handleRecalculate, { once: true });
          img.addEventListener('error', handleRecalculate, { once: true });
        }
      });
    }

    // Délai de sécurisation
    const timer = setTimeout(handleRecalculate, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [measureAndFit, dataDependency]);

  // ResizeObserver sur le conteneur de contenu
  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === 'undefined') return;

    let rafId: number | null = null;
    const observer = new ResizeObserver(() => {
      if (isMeasuringRef.current) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        measureAndFit();
      });
    });

    observer.observe(content);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [measureAndFit]);

  // Réinitialiser le masquage de l'avertissement si le contenu change
  useEffect(() => {
    setIsDismissed(false);
  }, [dataDependency]);

  const innerWidth = contentScale < 1 ? `${Math.round(A4_WIDTH_PX / contentScale)}px` : `${A4_WIDTH_PX}px`;
  const innerTransform = contentScale < 1 ? `scale(${contentScale})` : 'none';

  return (
    <div
      id={id}
      ref={outerRef}
      data-a4-fit-outer="true"
      data-content-scale={contentScale}
      className={`a4-fit-outer relative bg-white select-text ${className}`}
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        maxHeight: `${A4_HEIGHT_PX}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        ...(outerScale && outerScale !== 1
          ? {
              transform: `scale(${outerScale})`,
              transformOrigin: 'top center',
            }
          : {}),
        ...style,
      }}
    >
      {/* Conteneur interne avec mise à l'échelle A4 automatique */}
      <div
        ref={innerRef}
        data-a4-fit-inner="true"
        className="a4-fit-inner"
        style={{
          width: innerWidth,
          transform: innerTransform,
          transformOrigin: 'top left',
          minHeight: `${A4_HEIGHT_PX}px`,
          boxSizing: 'border-box',
          display: 'flow-root',
        }}
      >
        <div ref={contentRef} className="a4-fit-content w-full h-auto" style={{ boxSizing: 'border-box' }}>
          {children}
        </div>
      </div>

      {/* Avertissement discret si le contenu dépasse même après le seuil minimum (ex. 0.70) */}
      {isOverflowing && showWarning && !isDismissed && (
        <div
          data-html2canvas-ignore="true"
          className="no-print absolute bottom-3 right-3 z-50 bg-amber-500/95 hover:bg-amber-600/95 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 cursor-pointer transition-all duration-200 border border-amber-400/40 select-none animate-in fade-in"
          onClick={() => setIsDismissed(true)}
          title="Cliquez pour masquer cet avertissement"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-100" />
          <span className="truncate max-w-[320px]">
            {warningMessage || 'Contenu volumineux — pensez à raccourcir certaines sections'}
          </span>
          <span className="text-[10px] text-amber-200 ml-0.5 hover:text-white">✕</span>
        </div>
      )}
    </div>
  );
};
