/// <reference types="vite/client" />

/**
 * PayPal JS SDK Global Types and Interfaces
 */
export interface PayPalAmount {
  currency_code: string;
  value: string;
  breakdown?: {
    item_total?: { currency_code: string; value: string };
    shipping?: { currency_code: string; value: string };
    handling?: { currency_code: string; value: string };
    tax_total?: { currency_code: string; value: string };
    discount?: { currency_code: string; value: string };
  };
}

export interface PayPalPurchaseUnit {
  reference_id?: string;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  amount: PayPalAmount;
}

export interface PayPalCreateOrderActions {
  order: {
    create: (orderPayload: {
      intent?: 'CAPTURE' | 'AUTHORIZE';
      purchase_units: PayPalPurchaseUnit[];
    }) => Promise<string>;
  };
}

export interface PayPalCaptureDetails {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
  payer?: {
    name?: { given_name?: string; surname?: string };
    email_address?: string;
    payer_id?: string;
  };
  purchase_units?: Array<{
    reference_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: PayPalAmount;
        create_time?: string;
        update_time?: string;
      }>;
    };
  }>;
  [key: string]: unknown;
}

export interface PayPalCaptureOrderActions {
  order: {
    capture: () => Promise<PayPalCaptureDetails>;
    get: () => Promise<PayPalCaptureDetails>;
    authorize?: () => Promise<any>;
  };
}

export interface PayPalButtonsStyle {
  layout?: 'vertical' | 'horizontal';
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
  shape?: 'rect' | 'pill';
  label?: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment';
  tagline?: boolean;
  height?: number;
}

export interface PayPalButtonsOptions {
  style?: PayPalButtonsStyle;
  createOrder?: (
    data: Record<string, unknown>,
    actions: PayPalCreateOrderActions
  ) => Promise<string>;
  onApprove?: (
    data: {
      orderID: string;
      payerID?: string;
      paymentID?: string;
      subscriptionID?: string;
      facilitatorAccessToken?: string;
      [key: string]: unknown;
    },
    actions: PayPalCaptureOrderActions
  ) => Promise<void> | void;
  onError?: (err: unknown) => void;
  onCancel?: (data: Record<string, unknown>) => void;
  onClick?: (data: Record<string, unknown>, actions: any) => Promise<void> | void;
  onInit?: (data: Record<string, unknown>, actions: any) => void;
}

export interface PayPalButtonsComponent {
  render: (container: string | HTMLElement) => Promise<void>;
  isEligible?: () => boolean;
  close?: () => Promise<void>;
}

export interface PayPalNamespace {
  Buttons: (options?: PayPalButtonsOptions) => PayPalButtonsComponent;
  version?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
  const paypal: PayPalNamespace | undefined;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_PAYPAL_CLIENT_ID?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
