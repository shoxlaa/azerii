import 'server-only';

/**
 * Mail sending (server-only).
 *
 * Uses Resend when RESEND_API_KEY is configured. Without a key it falls back
 * to logging the message, so local development and a not-yet-configured
 * deployment keep working instead of failing checkout.
 *
 * `sendMail` never throws. A failed notification must not fail an order that
 * has already been recorded — the customer would be told their order failed
 * while it actually exists, and would order again.
 */

import { Resend } from 'resend';

export interface MailMessage {
  to: string;
  subject: string;
  body: string;
}

/**
 * Sender address. Must be on a domain verified in Resend; their shared
 * onboarding sender works out of the box for testing.
 */
const FROM = process.env.MAIL_FROM || 'AZERII <onboarding@resend.dev>';

/** Created lazily so a missing key never breaks module import. */
let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

/** Outcome of one send, so callers can record *why* a notification failed. */
export interface MailResult {
  ok: boolean;
  /** Short reason when `ok` is false — safe to store and show in the admin. */
  error?: string;
}

/** Trim a provider error to something storable. */
function reason(value: unknown): string {
  if (!value) return 'unknown error';
  if (typeof value === 'string') return value.slice(0, 200);
  const e = value as { name?: string; message?: string };
  return `${e.name ?? 'error'}: ${e.message ?? JSON.stringify(value)}`.slice(0, 200);
}

/** Send an email. Never throws; reports whether it was dispatched and why not. */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const resend = getClient();

  if (!resend) {
    console.warn(
      `[mail] RESEND_API_KEY not set — not sending "${message.subject}" to ${message.to}`,
    );
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: message.to,
      subject: message.subject,
      text: message.body,
    });

    if (error) {
      console.error('[mail] send failed:', message.subject, '→', message.to, error);
      return { ok: false, error: reason(error) };
    }

    console.info('[mail] sent', data?.id, message.subject, '→', message.to);
    return { ok: true };
  } catch (err) {
    console.error('[mail] send threw:', message.subject, '→', message.to, err);
    return { ok: false, error: reason(err) };
  }
}
