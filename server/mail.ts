import 'server-only';

/**
 * Mail sending (server-only).
 *
 * Placeholder transport — logs to the server console. Replace with a real
 * provider (Resend, SES, Nodemailer, …) later.
 */

export interface MailMessage {
  to: string;
  subject: string;
  body: string;
}

/** Send an email. Currently a no-op stub that logs the message. */
export async function sendMail(message: MailMessage): Promise<void> {
  console.info('[mail] would send:', message.subject, '→', message.to);
}
