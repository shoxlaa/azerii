import 'server-only';

/**
 * Contact form handling (server-only).
 *
 * Forwards the submitted message by email.
 *
 * Unlike an order, a contact message is stored nowhere: e-mail is the only
 * delivery. So a failed send has to be reported rather than swallowed — the
 * sender must learn to reach us another way instead of assuming the message
 * arrived. This is the opposite of the rule in `orders.ts`, where the order
 * already exists and a failed notification must not fail the checkout.
 */

import { sendMail } from './mail';

/** Where contact messages land. Override per environment. */
const CONTACT_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'iismailov@azerii.com';

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

/** Handle a contact-form submission. Throws when the message was not sent. */
export async function submitContactForm(input: ContactFormInput): Promise<{ ok: true }> {
  const result = await sendMail({
    to: CONTACT_EMAIL,
    subject: `Contact form: ${input.name}`,
    body: `${input.email}\n\n${input.message}`,
  });

  if (!result.ok) {
    // Caught by sendContactMessage, which turns it into the form's generic error.
    throw new Error(`contact mail not sent: ${result.error ?? 'unknown error'}`);
  }

  return { ok: true };
}
