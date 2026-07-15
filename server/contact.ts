import 'server-only';

/**
 * Contact form handling (server-only).
 *
 * Placeholder logic that forwards the submitted message by email.
 */

import { sendMail } from './mail';

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

/** Handle a contact-form submission. */
export async function submitContactForm(
  input: ContactFormInput,
): Promise<{ ok: true }> {
  await sendMail({
    to: 'info@azerii.example',
    subject: `Contact form: ${input.name}`,
    body: `${input.email}\n\n${input.message}`,
  });
  return { ok: true };
}
