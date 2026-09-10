import { z } from 'zod';
import { AGE_BANDS, HOPES, NEIGHBORHOOD_SLUGS, SOURCES, WEEKNIGHTS } from './neighborhoods';

const nonEmpty = <T extends string>(values: readonly T[]) =>
  z.enum(values as unknown as [T, ...T[]]);

export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('That email address does not look complete.'),
  neighborhood: z
    .string()
    .refine((v) => NEIGHBORHOOD_SLUGS.includes(v), 'Pick a neighborhood from the list.'),
  ageBand: nonEmpty(AGE_BANDS),
  weeknights: z
    .array(nonEmpty(WEEKNIGHTS))
    .min(1, 'Pick at least one night that works.'),
  hopes: z.array(nonEmpty(HOPES)).max(HOPES.length).default([]),
  hopesOther: z.string().trim().max(500).optional().default(''),
  source: nonEmpty(SOURCES),
  // The research question. Optional, unlimited, and the most valuable field here.
  leftEarly: z.string().trim().max(5000).optional().default(''),
  // Honeypot — real people never fill this.
  website: z.string().max(0).optional().default(''),
  priceVariant: z.enum(['per-session', 'total']).optional(),
  headlineVariant: z.enum(['outcome', 'recognition']).optional(),
});

export type WaitlistInput = z.input<typeof waitlistSchema>;
export type WaitlistEntry = z.output<typeof waitlistSchema>;

export interface WaitlistRow {
  email: string;
  neighborhood: string;
  age_band: string;
  weeknights: string[];
  hopes: string[];
  hopes_other: string | null;
  source: string;
  left_early: string | null;
  price_variant: string | null;
  headline_variant: string | null;
}

export function toRow(entry: WaitlistEntry): WaitlistRow {
  return {
    email: entry.email,
    neighborhood: entry.neighborhood,
    age_band: entry.ageBand,
    weeknights: entry.weeknights,
    hopes: entry.hopes,
    hopes_other: entry.hopesOther || null,
    source: entry.source,
    left_early: entry.leftEarly || null,
    price_variant: entry.priceVariant ?? null,
    headline_variant: entry.headlineVariant ?? null,
  };
}
