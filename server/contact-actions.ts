'use server';

/**
 * Server Action for the contact form.
 *
 * Like the order action, this is a public POST endpoint: input is validated
 * server-side and a honeypot field absorbs bot submissions.
 */

import { submitContactForm } from './contact';

export interface ContactActionInput {
  name: string;
  email: string;
  message: string;
  /** Honeypot: must stay empty. Hidden from real users. */
  company?: string;
}

export type ContactActionResult =
  | { ok: true }
  | { ok: false; errors: Partial<Record<'name' | 'email' | 'message', 'required' | 'email'>> }
  | { ok: false; error: 'generic' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendContactMessage(
  input: ContactActionInput,
): Promise<ContactActionResult> {
  try {
    // Honeypot tripped — report success so the bot learns nothing.
    if (input.company && input.company.trim().length > 0) {
      console.warn('[contact] honeypot triggered — dropping submission');
      return { ok: true };
    }

    const errors: Partial<Record<'name' | 'email' | 'message', 'required' | 'email'>> = {};
    if (!input.name?.trim()) errors.name = 'required';
    if (!input.email?.trim()) errors.email = 'required';
    else if (!EMAIL_RE.test(input.email.trim())) errors.email = 'email';
    if (!input.message?.trim()) errors.message = 'required';

    if (Object.keys(errors).length > 0) return { ok: false, errors };

    await submitContactForm({
      name: input.name.trim(),
      email: input.email.trim(),
      message: input.message.trim(),
    });
    return { ok: true };
  } catch (err) {
    console.error('[contact] sendContactMessage failed:', err);
    return { ok: false, error: 'generic' };
  }
}
