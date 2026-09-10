import Link from 'next/link';
import { brand, pageTitle } from '@/lib/brand';

export const metadata = { title: pageTitle('Privacy') };

export default function Privacy(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-measure px-5 pb-24 pt-10 md:px-8">
      <Link href="/" className="label">
        ← {brand.name}
      </Link>
      <h1 className="mt-6 text-h2 font-bold tracking-[-0.02em]">Privacy</h1>
      <p className="mt-2 text-small text-dim">Last updated 10 September 2026.</p>

      <div className="mt-8 space-y-5">
        <h2 className="text-h3 font-semibold">What this page collects</h2>
        <p>
          Your email address, your neighborhood, your age band, which nights you are free, what you
          are hoping for, how you heard about us, and anything you write in the optional question
          at the end. That is the entire list.
        </p>

        <h2 className="text-h3 font-semibold">What this page does not collect</h2>
        <p>
          No ID documents. No date of birth. No phone number. No payment details. Joining the
          waitlist asks for an email address, not a passport.
        </p>

        <h2 className="text-h3 font-semibold">Identity verification, later</h2>
        <p>
          If a cohort forms near you, we will ask you to verify your identity through a third-party
          verification provider. Your ID image is submitted to that provider and is not stored by
          us. We retain only the outcome, the document type, and a reference number, which is what
          lets a removal stay attached to a person rather than to an email address. We keep that
          record for as long as you are a member and for two years afterward.
        </p>

        <h2 className="text-h3 font-semibold">Analytics</h2>
        <p>
          We use Plausible, which sets no cookies and collects no personal data. We can see that a
          page was viewed and that a button was clicked. We cannot see who did it.
        </p>

        <h2 className="text-h3 font-semibold">Who else sees your data</h2>
        <p>
          Our hosting provider and our database provider, because the site runs on them. Our
          verification provider, only at the point of verification. Nobody else. We do not sell
          anything to anyone and we do not run advertising.
        </p>

        <h2 className="text-h3 font-semibold">Deleting it</h2>
        <p>
          Write to{' '}
          <a href={`mailto:${brand.email.privacy}`} className="text-ink underline">
            {brand.email.privacy}
          </a>{' '}
          and we will delete your record within seven days and confirm when it is done. One
          exception: if you were removed from a cohort for a safety reason, we keep the removal
          record, because deleting it would let the removal be undone with a new email address.
        </p>
      </div>
    </div>
  );
}
