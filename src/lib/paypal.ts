import type {
  PayPalButtonsOptions,
  PayPalButtonsComponent,
  PayPalCaptureDetails
} from '../vite-env';

/**
 * PayPal Sandbox Integration Constants
 * Placeholder: YOUR_SANDBOX_CLIENT_ID
 * Default Currency: USD
 */
export const PAYPAL_SANDBOX_CLIENT_ID = 'YOUR_SANDBOX_CLIENT_ID';
export const PAYPAL_CURRENCY = 'USD';

export interface InitPayPalButtonOptions {
  container: string | HTMLElement;
  amount: number;
  currency?: string;
  planName?: string;
  planType?: string;
  cvId?: string;
  userId?: string;
  userEmail?: string;
  onSuccess: (captureDetails: PayPalCaptureDetails, planType: string) => void;
  onError?: (error: Error | unknown) => void;
  onCancel?: () => void;
}

/**
 * Checks if the PayPal SDK is loaded on the window object
 */
export function isPayPalSdkLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.paypal?.Buttons === 'function';
}

/**
 * Renders PayPal Sandbox Buttons into the specified container element.
 * Handles order creation (createOrder) and payment capture (onApprove).
 */
export async function renderPayPalSandboxButtons({
  container,
  amount,
  currency = PAYPAL_CURRENCY,
  planName = 'Pass Téléchargement CV',
  planType = 'single_cv',
  cvId = 'cv_default',
  userId = 'guest',
  userEmail = '',
  onSuccess,
  onError,
  onCancel
}: InitPayPalButtonOptions): Promise<PayPalButtonsComponent | null> {
  const paypalSdk = typeof window !== 'undefined' ? window.paypal : undefined;

  if (!paypalSdk || typeof paypalSdk.Buttons !== 'function') {
    const errorMsg = 'Le SDK PayPal n\'est pas chargé. Vérifiez que la balise <script> PayPal est présente dans index.html.';
    console.warn('[PayPal]', errorMsg);
    if (onError) onError(new Error(errorMsg));
    return null;
  }

  // Clear previous buttons from container if string selector is used
  if (typeof container === 'string') {
    const el = document.querySelector(container);
    if (el) {
      el.innerHTML = '';
    }
  } else if (container instanceof HTMLElement) {
    container.innerHTML = '';
  }

  const buttonsConfig: PayPalButtonsOptions = {
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'pay',
      height: 44
    },

    // 1. Order Creation Handler
    createOrder: async (data, actions) => {
      try {
        // Attempt backend creation first if server is available
        const serverResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cvId,
            cvTitle: planName,
            planType,
            userId,
            userEmail
          })
        });

        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          if (serverData.orderId) {
            return serverData.orderId;
          }
        }
      } catch (err) {
        console.warn('[PayPal] Backend order creation unavailable, falling back to client-side actions:', err);
      }

      // Standard PayPal SDK actions.order.create fallback
      return actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `${planName} (${planType})`,
            custom_id: JSON.stringify({ cvId, planType, userId }),
            amount: {
              currency_code: currency,
              value: amount.toFixed(2)
            }
          }
        ]
      });
    },

    // 2. Order Approval & Capture Handler
    onApprove: async (data, actions) => {
      try {
        let captureData: PayPalCaptureDetails;

        // Try server-side capture first
        try {
          const serverCapture = await fetch('/api/payment/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderID,
              cvId,
              planType,
              userId,
              userEmail
            })
          });

          if (serverCapture.ok) {
            const serverResult = await serverCapture.json();
            if (serverResult.verified && serverResult.status === 'COMPLETED') {
              captureData = {
                id: serverResult.reference || data.orderID,
                status: 'COMPLETED'
              };
              onSuccess(captureData, planType);
              return;
            }
          }
        } catch (serverErr) {
          console.warn('[PayPal] Server capture unavailable, falling back to actions.order.capture:', serverErr);
        }

        // Direct SDK actions capture
        captureData = await actions.order.capture();

        if (captureData.status === 'COMPLETED') {
          onSuccess(captureData, planType);
        } else {
          throw new Error(`Statut de paiement PayPal non finalisé : ${captureData.status}`);
        }
      } catch (err) {
        console.error('[PayPal] Capture error:', err);
        if (onError) onError(err);
      }
    },

    onError: (err) => {
      console.error('[PayPal SDK Error]:', err);
      if (onError) onError(err);
    },

    onCancel: (data) => {
      console.info('[PayPal] Paiement annulé par l\'utilisateur:', data);
      if (onCancel) onCancel();
    }
  };

  const buttonInstance = paypalSdk.Buttons(buttonsConfig as any);
  await buttonInstance.render(container);
  return buttonInstance;
}
