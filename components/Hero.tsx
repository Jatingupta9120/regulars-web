import { CohortFigure } from './CohortFigure';
import { CtaLink } from './CtaLink';
import { HEADLINES, HEADLINE_VARIANTS } from '@/lib/experiments';

/**
 * Server component. Both headline variants are rendered; the boot script in
 * <head> stamps the winner on <html> and CSS hides the other before first
 * paint. No client JavaScript touches the LCP element.
 */
export function Hero(): JSX.Element {
  return (
    <section className="pt-10 md:pt-14">
      <div className="grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
        <div>
          <p className="label marginal mb-5">New York · cohorts forming for October</p>

          {/*
            Both variants ship in the markup. The losing one is display:none,
            which takes it out of the accessibility tree entirely, so screen
            readers encounter exactly one h1.
          */}
          {HEADLINE_VARIANTS.map((variant) => (
            <div key={variant} data-variant={variant}>
              <h1 className="text-h1 font-bold tracking-[-0.035em]">{HEADLINES[variant].head}</h1>
              <p className="mt-6 max-w-[46ch] text-lede text-body">{HEADLINES[variant].sub}</p>
            </div>
          ))}

          <div className="mt-8">
            <CtaLink
              position="hero"
              className="inline-block bg-mark px-6 py-3.5 font-display text-[0.95rem] font-semibold text-markInk"
            >
              Join the Williamsburg waitlist
            </CtaLink>
            <p className="label mt-3 normal-case tracking-normal">
              ID-verified before anyone sees anyone. One charge, no auto-renewal.
            </p>
          </div>
        </div>

        <figure className="border border-rule bg-surface p-4 md:p-5">
          <CohortFigure />
          <figcaption className="label mt-3 border-t border-rule pt-2 leading-relaxed">
            Fig. 1 — One cohort at week four. Six people who did not know each other in week one.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
