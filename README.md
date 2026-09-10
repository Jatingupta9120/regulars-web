# Regulars — v1 validation site

A single-page marketing and waitlist site for a New York service that forms small recurring
friend groups. Six ID-verified people, matched by neighborhood and age band, meeting four
Thursdays around a real activity, then graduating into their own group chat.

**This site has one job: validate demand.** It is not a brochure. Every design decision that
costs conversion loses.

The brand name lives in one place: `NEXT_PUBLIC_BRAND_NAME` and `NEXT_PUBLIC_BRAND_DOMAIN`,
read by `lib/brand.ts`. Nothing else in the codebase hardcodes the name, the domain, or the
`hello@` / `safety@` / `privacy@` addresses. Both are inlined at build time, so changing the name
means a rebuild rather than a restart.

## Stack

- Next.js 14 App Router, TypeScript strict with `noUncheckedIndexedAccess`, no `any`
- Server components throughout. Only four components ship client JavaScript: the hero figure,
  the CTA link, the safety section's dwell timer, and the waitlist form.
- Tailwind for layout only — every color and type value maps to a token in `app/globals.css`
- Supabase Postgres for waitlist writes, via a server route using the service role key
- Plausible for analytics, no cookies, no consent banner needed
- Three.js for the hero scene, loaded after first paint, desktop only

## Running it

```bash
cp .env.example .env.local   # fill in Supabase and Plausible
npm install
npm run dev
```

Apply `supabase/schema.sql` in the Supabase SQL editor before the first submission.

## Where waitlist data lands

The `waitlist` table in Supabase. One row per email per market. The route at
`app/api/waitlist/route.ts` validates with Zod, drops honeypot submissions silently, and upserts.

The internal dashboard is at `/dashboard?token=<DASHBOARD_TOKEN>`. It shows signups by
neighborhood and age band, both A/B variant splits, and every answer to the "left early"
question. Read those answers weekly. They are worth more than the email addresses.

**No ID documents are collected by this site.** The waitlist takes an email, not a passport.
Verification happens later, through a third-party provider, and only the outcome is stored.

## The design

Direction A, "Field guide". Archivo for display, Source Serif 4 for body text, a deep ink blue
as the single accent. Ruled dividers and a numbered sequence, because the product genuinely is a
sequence. One bold move — the numbered rule set and the plate figure — and everything else quiet.

The four-week route diagram is lifted from Direction B, which explained the product more clearly
than anything else in the deck.

### The 3D layer

`components/CohortScene.tsx` animates six nodes from scattered to connected as the hero scrolls.
It is an enhancement layered on top of `CohortPlate`, never a replacement. It does not run when
the viewport is under 900px, the pointer is coarse, `prefers-reduced-motion` is set, WebGL is
unavailable, or the Three.js import fails. The static plate is the permanent mobile treatment,
not a fallback. The render loop pauses off-screen and on tab blur.

## A/B tests

Two run at once, assigned per browser and sticky in `localStorage`. See `lib/experiments.ts`.

Both variants are server-rendered and a small blocking script in `<head>` stamps the winner on
`<html>` before the first paint; CSS hides the loser. Nothing swaps after hydration, so the LCP
heading never changes and there is no flash of the control. If `localStorage` throws, no
attribute is set and the control renders.

1. **Headline** — outcome-led ("Six people. Four Thursdays.") against recognition-led ("The hard
   part was never the first time").
2. **Price framing** — `$35 a session` against `$140 for the whole cohort`. Same money. This is
   the second test; let the headline settle first if traffic is thin.

## Pricing, and why it is not a subscription

One charge per cohort. No auto-renewal, nothing to cancel. Subscription revenue whose value ends
when the product works will always be tempted to stall, and auto-renewal complaints are endemic
in this category. "We do not auto-renew you" is a line the competition cannot write.

`$140` and `$99` in `lib/pricing.ts` are placeholders pending unit economics. Decide whether the
price includes activity fees before locking it; that choice moves margin more than the headline
number does.

## Kill criteria

Write the real numbers in before launch and do not move them afterward. Moving the goalposts once
data arrives is how a failed test becomes a two-year detour.

- **Positioning fails** if fewer than **4%** of visitors from Williamsburg, Greenpoint, Bed-Stuy
  or Astoria join the waitlist after **1,000** qualified visitors from those neighborhoods.
- **Liquidity fails** if no single neighborhood and age band pair reaches **6** people after
  **400** total signups. That pair is the unit. Raw signup count is a vanity number.
- **The audience is wrong** if fewer than **55%** of signups are women, given that the safety
  proposition is aimed squarely at them.
- **The proposition is not landing** if fewer than **35%** of visitors who reach the safety
  section stay in it for four seconds. That section is the conversion argument, not a footnote.

If the site clears all four, the next step is still twenty NYC interviews, fifteen of them women.
Public-review evidence over-represents bad experiences and is strong on failure modes, weak on
base rates.

## Accessibility and performance budget

- Lighthouse 95+ performance and 100 accessibility on mobile, measured with the 3D shipped
- LCP under 2.0s on simulated 4G — first render never waits on WebGL
- WCAG 2.2 AA, full keyboard path, visible focus rings, correct heading order
- Light and dark both designed at token level, complete light palette on bare `:root`
- No horizontal scroll at 360px

Verify the reduced-motion path and the JavaScript-disabled path by hand before every deploy. The
page must be fully readable and the waitlist fully usable with the 3D layer dead.

Run `npm run lint` and `npm run typecheck` before pushing. Both are clean today.

Still unverified because they need a real browser: Lighthouse scores, the 360px layout, and the
reduced-motion path. Nothing else on this list is outstanding.

## Legal

`/safety-notice` carries the New York GBL §394-CC notice and is linked from the footer. It is
written on the assumption that the statute applies to a paid service that introduces New Yorkers
to each other. Have a New York lawyer review the wording and the privacy policy before taking
money.
