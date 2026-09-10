import Link from 'next/link';
import { brand } from '@/lib/brand';
import { Hero } from '@/components/Hero';
import { WaitlistForm } from '@/components/WaitlistForm';
import { Compare, HowItWorks, Neighborhoods, Pricing, Problem } from '@/components/Sections';
import { Faq, Safety } from '@/components/SectionsClient';

export default function Home(): JSX.Element {
  return (
    <>
      <a
        href="#waitlist"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-mark focus:px-4 focus:py-2 focus:text-markInk"
      >
        Skip to the waitlist
      </a>

      <div className="mx-auto w-full max-w-shell px-5 pb-24 pt-8 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-3.5">
          <span className="font-display text-[1.1rem] font-bold tracking-[-0.02em] text-ink">
            {brand.name}
          </span>
          <nav aria-label="Sections" className="label flex flex-wrap gap-5">
            <a href="#how">How it works</a>
            <a href="#safety">Safety</a>
            <a href="#neighborhoods">Neighborhoods</a>
            <a href="#cost">What it costs</a>
          </nav>
        </header>

        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <Safety />
          <Compare />
          <Pricing />
          <Neighborhoods />
          <Faq />
          <WaitlistForm />
        </main>

        <footer className="mt-section border-t border-rule pt-6 text-small text-dim">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
            <p className="max-w-[38ch]">
              {brand.name} is run by two people in Brooklyn. Write to us at{' '}
              <a href={`mailto:${brand.email.hello}`} className="text-ink underline">
                {brand.email.hello}
              </a>
              .
            </p>
            <nav aria-label="Legal" className="flex flex-wrap gap-5">
              <Link href="/privacy">Privacy</Link>
              <Link href="/safety-notice">New York safety notice</Link>
            </nav>
          </div>
          <p className="mt-5 max-w-measure">
            New York law requires services that introduce New Yorkers to each other to provide a
            safety notice. Ours is linked above and shown again before you ever pay.
          </p>
        </footer>
      </div>
    </>
  );
}
