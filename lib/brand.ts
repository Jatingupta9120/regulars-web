/**
 * Brand identity, read from the environment so the name is one variable and
 * not a search-and-replace across the codebase.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so changing the name means a
 * rebuild, not just a restart. That is fine: the name changes once.
 */
const NAME = process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || 'Regulars';
const DOMAIN = process.env.NEXT_PUBLIC_BRAND_DOMAIN?.trim() || 'regulars.nyc';

export const brand = {
  name: NAME,
  domain: DOMAIN,
  email: {
    hello: `hello@${DOMAIN}`,
    safety: `safety@${DOMAIN}`,
    privacy: `privacy@${DOMAIN}`,
  },
} as const;

/** Page titles: "Privacy — Regulars". Pass nothing for the home page title. */
export function pageTitle(section?: string): string {
  return section ? `${section} — ${NAME}` : NAME;
}
