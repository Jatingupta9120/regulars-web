import type { PriceVariant } from './pricing';

export type HeadlineVariant = 'outcome' | 'recognition';

export interface Assignment {
  readonly headline: HeadlineVariant;
  readonly price: PriceVariant;
}

export const HEADLINE_KEY = 'exp.headline';
export const PRICE_KEY = 'exp.price';

export const DEFAULT_ASSIGNMENT: Assignment = { headline: 'outcome', price: 'per-session' };

/**
 * Runs in <head> before first paint, so the winning variant is already stamped
 * on <html> when the first frame is composited. Both variants are
 * server-rendered and CSS hides the loser, which means the LCP heading is never
 * swapped after hydration and there is no flash of the control.
 *
 * Kept as a hand-written string because it must be inline and tiny. If it
 * throws — private windows, blocked site data — the attributes are simply not
 * set and the defaults in globals.css apply.
 */
export const VARIANT_BOOT_SCRIPT = `(function(){try{
var d=document.documentElement,s=localStorage;
function pick(k,a,b){var v=s.getItem(k);if(v!==a&&v!==b){v=Math.random()<0.5?a:b;s.setItem(k,v);}return v;}
d.setAttribute('data-headline',pick('${HEADLINE_KEY}','outcome','recognition'));
d.setAttribute('data-price',pick('${PRICE_KEY}','per-session','total'));
}catch(e){}})();`;

/**
 * Reads back what the boot script decided. Never assigns — assignment happens
 * once, in <head>. Callers on the server, or before the script has run, get the
 * control, which is exactly what the page rendered.
 */
export function currentAssignment(): Assignment {
  if (typeof document === 'undefined') return DEFAULT_ASSIGNMENT;
  const root = document.documentElement;
  const headline = root.getAttribute('data-headline');
  const price = root.getAttribute('data-price');
  return {
    headline: headline === 'recognition' ? 'recognition' : 'outcome',
    price: price === 'total' ? 'total' : 'per-session',
  };
}

export const HEADLINES: Record<HeadlineVariant, { readonly head: string; readonly sub: string }> = {
  outcome: {
    head: 'Six people. Four Thursdays. One group chat that outlives us.',
    sub: 'You are matched with five other people in your neighborhood, near your age, at a similar point in life. You meet four times around something you do with your hands. Then you keep each other and we stop charging.',
  },
  recognition: {
    head: 'The hard part was never the first time. It is going back a second time.',
    sub: 'So we built the second time in. Six verified people from your neighborhood, the same six every week, four Thursdays around a real activity. By week three you stop introducing yourself.',
  },
};

export const HEADLINE_VARIANTS: readonly HeadlineVariant[] = ['outcome', 'recognition'];
export const PRICE_VARIANTS: readonly PriceVariant[] = ['per-session', 'total'];
