'use client';

import { useState, useTransition } from 'react';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { SOCIAL_LINKS } from '@/constants';
import { sendContactMessage, type ContactActionResult } from '@/server/contact-actions';
import { Container } from './ui/Container';

type FieldKey = 'name' | 'email' | 'message';
type Errors = Partial<Record<FieldKey, 'required' | 'email'>>;

/** /contact — contact details plus a working message form. */
export function ContactView() {
  const { locale } = useLocale();
  const dict = getDictionary(locale);
  const t = dict.contactPage;
  const c = dict.contact;

  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (key: FieldKey, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const result: ContactActionResult = await sendContactMessage({
        ...fields,
        company: honeypot,
      });
      if (result.ok) {
        setSent(true);
        setFields({ name: '', email: '', message: '' });
        return;
      }
      if ('errors' in result) {
        setErrors(result.errors);
        return;
      }
      setFormError(t.error);
    });
  };

  const label = (key: FieldKey) => ({ name: c.name, email: c.email, message: c.message })[key];

  return (
    <section className="py-12 md:py-16">
      <Container>
        <h1 className="font-heading text-[40px] font-bold uppercase tracking-[1px] text-heading md:text-[56px]">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl text-subtle">{t.lead}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-md border border-border bg-panel p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {(['name', 'email'] as FieldKey[]).map((key) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
                    {label(key)}
                  </span>
                  <input
                    data-testid={`contact-${key}`}
                    type={key === 'email' ? 'email' : 'text'}
                    value={fields[key]}
                    onChange={(e) => set(key, e.target.value)}
                    aria-invalid={Boolean(errors[key])}
                    className={`w-full rounded-[4px] border bg-bg px-3 py-2.5 font-body text-sm text-body outline-none focus:border-accent ${
                      errors[key] ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors[key] ? (
                    <span className="mt-1 block text-xs text-red-500">
                      {t.errors[errors[key]!]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-subtle">
                {c.message}
              </span>
              <textarea
                data-testid="contact-message"
                rows={5}
                value={fields.message}
                onChange={(e) => set('message', e.target.value)}
                aria-invalid={Boolean(errors.message)}
                className={`w-full rounded-[4px] border bg-bg px-3 py-2.5 font-body text-sm text-body outline-none focus:border-accent ${
                  errors.message ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.message ? (
                <span className="mt-1 block text-xs text-red-500">
                  {t.errors[errors.message]}
                </span>
              ) : null}
            </label>

            {/* Honeypot — hidden from users, catches bots. */}
            <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label>
                Company
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            {sent ? (
              <p
                role="status"
                data-testid="contact-success"
                className="mt-4 font-heading text-sm font-semibold uppercase tracking-wide text-accent-text"
              >
                ✓ {t.success}
              </p>
            ) : null}
            {formError ? (
              <p role="alert" className="mt-4 text-sm text-red-500">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              data-testid="contact-submit"
              className="mt-5 inline-flex h-[52px] items-center justify-center rounded-[4px] bg-accent px-6 font-heading text-sm font-semibold uppercase tracking-wide text-cream transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? t.sending : c.send}
            </button>
          </form>

          <aside className="h-fit rounded-md border border-border bg-panel p-5">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-subtle">
              {t.followUs}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-body transition-colors hover:text-accent-text"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </section>
  );
}
