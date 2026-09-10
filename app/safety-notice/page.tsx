import Link from 'next/link';
import { brand, pageTitle } from '@/lib/brand';

export const metadata = { title: pageTitle('New York safety notice') };

/**
 * NY GBL §394-CC safety notice. We assume the statute applies to a paid service
 * that introduces New Yorkers to each other, and comply rather than argue.
 * This page is linked from the entry page and shown again at registration.
 * Have a New York lawyer review the final wording before launch.
 */
export default function SafetyNotice(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-measure px-5 pb-24 pt-10 md:px-8">
      <Link href="/" className="label">
        ← {brand.name}
      </Link>
      <h1 className="mt-6 text-h2 font-bold tracking-[-0.02em]">Safety notice</h1>
      <p className="mt-2 text-small text-dim">
        Provided under New York General Business Law §394-CC. Last updated 10 September 2026.
      </p>

      <div className="mt-8 space-y-5">
        <p>
          {brand.name} does not conduct criminal background checks on its members. We verify
          identity using a government-issued photo ID and a liveness check, which confirms that a
          member is who they say they are. Identity verification is not a criminal background check and does
          not guarantee anyone&rsquo;s conduct.
        </p>
        <p className="border-l-2 border-mark pl-4">
          You should be aware that meeting people you do not know carries risk. Take reasonable
          precautions.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Meet for the first time in a public place, which is where all of our sessions are held.</li>
          <li>Tell a friend or family member where you are going and when you expect to be back.</li>
          <li>Arrange your own transportation to and from every session.</li>
          <li>
            Do not share your home address, financial details, or account information with anyone
            you have met through this service.
          </li>
          <li>
            Anyone who asks you for money has broken our rules. Report them and we will remove
            them.
          </li>
        </ul>
        <p>
          If someone makes you uncomfortable, tell us in the private check-in that follows every
          session, or write to{' '}
          <a href={`mailto:${brand.email.safety}`} className="text-ink underline">
            {brand.email.safety}
          </a>
          . Two credible reports result in removal from the service.
        </p>
        <p>
          If you are in immediate danger, call 911. The New York City Anti-Violence Project and
          Safe Horizon both operate 24-hour hotlines.
        </p>
      </div>
    </div>
  );
}
