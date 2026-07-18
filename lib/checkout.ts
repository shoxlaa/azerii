/**
 * Checkout field validation, shared by the client form and the server action.
 *
 * Returns error *keys* rather than messages so the caller can localize them
 * (`dict.checkout.errors[key]`). The server action re-runs this on every
 * submission — a Server Action is a public POST endpoint, so client-side
 * validation is a convenience, never a guarantee.
 */

import type { ShippingMethod } from '@/types';

export const SHIPPING_METHODS: ShippingMethod[] = ['standard', 'express', 'pickup'];

export interface CheckoutInput {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  shipping: ShippingMethod;
  comment?: string;
}

export type CheckoutErrorKey = 'required' | 'email' | 'phone';
export type CheckoutErrors = Partial<Record<keyof CheckoutInput, CheckoutErrorKey>>;

// Deliberately permissive: international addresses and phone formats vary far
// more than a strict pattern would allow.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{6,}$/;

const isBlank = (v: string | undefined) => !v || v.trim().length === 0;

/** Validate checkout fields. Empty object → valid. */
export function validateCheckout(input: Partial<CheckoutInput>): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (isBlank(input.name)) errors.name = 'required';

  if (isBlank(input.email)) errors.email = 'required';
  else if (!EMAIL_RE.test(input.email!.trim())) errors.email = 'email';

  if (isBlank(input.phone)) errors.phone = 'required';
  else if (!PHONE_RE.test(input.phone!.trim())) errors.phone = 'phone';

  if (!input.shipping || !SHIPPING_METHODS.includes(input.shipping)) {
    errors.shipping = 'required';
  }

  // A shipped order needs a destination; a Baku pickup does not.
  if (input.shipping !== 'pickup') {
    if (isBlank(input.country)) errors.country = 'required';
    if (isBlank(input.city)) errors.city = 'required';
    if (isBlank(input.address)) errors.address = 'required';
    if (isBlank(input.postalCode)) errors.postalCode = 'required';
  }

  return errors;
}

/** True when validateCheckout found nothing wrong. */
export function isValid(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length === 0;
}
