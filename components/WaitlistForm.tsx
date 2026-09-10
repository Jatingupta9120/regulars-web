'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { currentAssignment } from '@/lib/experiments';
import { brand } from '@/lib/brand';
import {
  AGE_BANDS,
  BOROUGHS,
  HOPES,
  SOURCES,
  WEEKNIGHTS,
  byBorough,
} from '@/lib/neighborhoods';

type Status = 'idle' | 'sending' | 'done';

const NIGHT_LABEL: Record<(typeof WEEKNIGHTS)[number], string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  sunday: 'Sunday',
};

const AGE_LABEL: Record<(typeof AGE_BANDS)[number], string> = {
  'under-25': 'Under 25',
  '25-29': '25 to 29',
  '30-34': '30 to 34',
  '35-39': '35 to 39',
  '40-44': '40 to 44',
  '45+': '45 and over',
};

export function WaitlistForm(): JSX.Element {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [nights, setNights] = useState<string[]>([]);
  const [hopes, setHopes] = useState<string[]>([]);
  const started = useRef(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === 'done') successRef.current?.focus();
  }, [status]);

  function onFirstInput(): void {
    if (started.current) return;
    started.current = true;
    track('form_start');
  }

  function toggle(list: string[], value: string, set: (v: string[]) => void): void {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError('');

    if (nights.length === 0) {
      setError('Pick at least one night that works for you.');
      track('form_error', { field: 'weeknights' });
      return;
    }

    const form = new FormData(event.currentTarget);
    const variants = currentAssignment();
    setStatus('sending');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          neighborhood: String(form.get('neighborhood') ?? ''),
          ageBand: String(form.get('ageBand') ?? ''),
          weeknights: nights,
          hopes,
          hopesOther: String(form.get('hopesOther') ?? ''),
          source: String(form.get('source') ?? ''),
          leftEarly: String(form.get('leftEarly') ?? ''),
          website: String(form.get('website') ?? ''),
          priceVariant: variants.price,
          headlineVariant: variants.headline,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(
          data.error ??
            `That did not save. Try once more, or email ${brand.email.hello}.`,
        );
        track('form_error', { status: response.status });
        setStatus('idle');
        return;
      }

      track('form_submit', { neighborhood: String(form.get('neighborhood') ?? '') });
      setStatus('done');
    } catch {
      setError(
        `Your connection dropped before we saved that. Try again, or email ${brand.email.hello}.`,
      );
      track('form_error', { status: 'network' });
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <section id="waitlist" className="mt-section rule-top pt-3" aria-labelledby="done-heading">
        <p className="label">You are on the list</p>
        <div
          ref={successRef}
          tabIndex={-1}
          className="mt-4 max-w-measure border border-mark bg-surface p-6"
        >
          <h2 id="done-heading" className="text-h2 font-bold tracking-[-0.02em]">
            That is it. Nothing else to do.
          </h2>
          <p className="mt-3 text-body">
            You will hear from us within two weeks, whether or not a cohort forms near you. If one
            does, the next email asks you to verify your ID and confirm a night. If one does not,
            we will tell you that plainly and say how many people we are short.
          </p>
          <p className="mt-3 text-small text-dim">
            We send nothing else. No newsletter, no launch countdown.
          </p>
        </div>
      </section>
    );
  }

  const field = 'w-full border border-rule bg-surface px-3 py-2.5 text-base text-ink';
  const legend = 'label mb-2 block';

  return (
    <section id="waitlist" className="mt-section rule-top pt-3" aria-labelledby="waitlist-heading">
      <p className="label">Join</p>
      <h2 id="waitlist-heading" className="mt-1 max-w-[24ch] text-h2 font-bold tracking-[-0.02em]">
        Tell us where you live and when you are free
      </h2>
      <p className="mt-4 max-w-measure text-body">
        This is how we decide which neighborhood runs first. Six of you in one place is a cohort.
      </p>

      <form onSubmit={onSubmit} onInput={onFirstInput} className="mt-8 max-w-[46rem]" noValidate>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={legend}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className={legend}>
              Neighborhood
            </label>
            <select id="neighborhood" name="neighborhood" required defaultValue="" className={field}>
              <option value="" disabled>
                Choose one
              </option>
              {BOROUGHS.map((b) => (
                <optgroup key={b} label={b}>
                  {byBorough(b).map((n) => (
                    <option key={n.slug} value={n.slug}>
                      {n.name}
                      {n.status === 'forming' ? ' — forming now' : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ageBand" className={legend}>
              Age band
            </label>
            <select id="ageBand" name="ageBand" required defaultValue="" className={field}>
              <option value="" disabled>
                Choose one
              </option>
              {AGE_BANDS.map((a) => (
                <option key={a} value={a}>
                  {AGE_LABEL[a]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="source" className={legend}>
              How you heard about us
            </label>
            <select id="source" name="source" required defaultValue="" className={field}>
              <option value="" disabled>
                Choose one
              </option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="mt-7 border-t border-rule pt-5">
          <legend className={legend}>Which nights work</legend>
          <div className="flex flex-wrap gap-2">
            {WEEKNIGHTS.map((n) => {
              const on = nights.includes(n);
              return (
                <label
                  key={n}
                  htmlFor={`night-${n}`}
                  className={`cursor-pointer border px-3.5 py-2 font-display text-small ${
                    on ? 'border-mark bg-mark text-markInk' : 'border-rule text-body'
                  }`}
                >
                  <input
                    id={`night-${n}`}
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => toggle(nights, n, setNights)}
                  />
                  {NIGHT_LABEL[n]}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-7 border-t border-rule pt-5">
          <legend className={legend}>What you are hoping for</legend>
          <div className="space-y-2">
            {HOPES.map((h) => (
              <label key={h} htmlFor={`hope-${h.slice(0, 12)}`} className="flex gap-2.5 text-small">
                <input
                  id={`hope-${h.slice(0, 12)}`}
                  type="checkbox"
                  checked={hopes.includes(h)}
                  onChange={() => toggle(hopes, h, setHopes)}
                  className="mt-1 accent-[var(--mark)]"
                />
                <span>{h}</span>
              </label>
            ))}
          </div>
          <label htmlFor="hopesOther" className="label mt-4 block normal-case tracking-normal">
            Something else, if none of those fit
          </label>
          <input id="hopesOther" name="hopesOther" type="text" className={`${field} mt-1.5`} />
        </fieldset>

        <div className="mt-7 border-t-2 border-mark pt-5">
          <label htmlFor="leftEarly" className="block font-display text-h3 font-semibold text-ink">
            Tell me about the last time you left a social thing early.
          </label>
          <p className="mt-1.5 text-small text-dim">
            Optional, and the most useful thing you can give us. No length limit. A real person
            reads every one of these.
          </p>
          <textarea id="leftEarly" name="leftEarly" rows={5} className={`${field} mt-3 font-text`} />
        </div>

        {/* Honeypot. Off-screen rather than display:none so bots still see it. */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="website">Leave this empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {error ? (
          <p role="alert" className="mt-6 border-l-2 border-flag pl-3 text-small text-flag">
            {error}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-mark px-6 py-3.5 font-display text-[0.95rem] font-semibold text-markInk disabled:opacity-60"
          >
            {status === 'sending' ? 'Adding you…' : 'Join the waitlist'}
          </button>
          <p className="text-small text-dim">
            No ID needed today. We ask for that only if a cohort forms near you.
          </p>
        </div>
      </form>
    </section>
  );
}
