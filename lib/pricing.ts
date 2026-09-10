/**
 * One charge per cohort. No subscription, no auto-renewal.
 *
 * The two variants below are the second A/B test: does leading with the
 * per-session number convert better than leading with the total? Same money
 * either way — only the framing changes.
 */
export const SESSIONS_PER_COHORT = 4;
export const COHORT_PRICE_USD = 140;
export const PER_SESSION_USD = COHORT_PRICE_USD / SESSIONS_PER_COHORT; // 35
export const RETURNING_PRICE_USD = 99;

export type PriceVariant = 'per-session' | 'total';

export interface PriceCopy {
  readonly headline: string;
  readonly unit: string;
  readonly support: string;
}

export const PRICE_COPY: Record<PriceVariant, PriceCopy> = {
  'per-session': {
    headline: `$${PER_SESSION_USD}`,
    unit: 'a session',
    support: `Charged once as $${COHORT_PRICE_USD} for all four. About what a pottery class or a bouldering day pass costs on its own.`,
  },
  total: {
    headline: `$${COHORT_PRICE_USD}`,
    unit: 'for the whole cohort',
    support: `Four sessions, one charge, ${'$'}${PER_SESSION_USD} a night. Nothing recurring.`,
  },
};
