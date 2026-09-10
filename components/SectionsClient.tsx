'use client';

import { useEffect, useRef } from 'react';
import { track, watchSafetyDwell } from '@/lib/analytics';
import { Section } from './Sections';

/**
 * The only two sections that need client JavaScript: Safety measures dwell
 * time, and the FAQ reports which questions get opened. Everything else on the
 * page is server-rendered.
 */

/* ----------------------------------------------------------------- safety */

const RULES = [
  {
    title: 'Everyone is ID-verified',
    body: 'Government ID and a liveness check before matching. A removal is tied to the verified person, so a fresh email address does not get anyone back in.',
  },
  {
    title: 'Composition is promised, not approximated',
    body: 'You are told the age band and the gender mix of your six before you pay. If we cannot fill it as promised, we hold the cohort rather than substitute quietly.',
  },
  {
    title: 'A host runs session one',
    body: 'A paid facilitator is there for the first meeting, makes the introductions, and stays until the group can carry itself.',
  },
  {
    title: 'Thirty seconds, privately, every week',
    body: 'After each session everyone answers the same short check-in. Nobody ever sees what anyone else wrote, including their own ratings.',
  },
  {
    title: 'Two flags and you are out',
    body: 'Removal happens immediately, before a human reviews it. The rest of the group is refunded in full and offered a replacement cohort.',
  },
  {
    title: 'We publish the numbers',
    body: 'Every quarter we post how many people were removed and why, in categories. If that number is ever zero we will say so, and you should be suspicious of us.',
  },
] as const;

export function Safety(): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return watchSafetyDwell(el, () => track('safety_section_read'));
  }, []);

  return (
    <section
      ref={ref}
      id="safety"
      className="mt-section rule-top pt-3"
      aria-labelledby="safety-heading"
    >
      <p className="label">Safety</p>
      <h2 id="safety-heading" className="mt-1 max-w-[26ch] text-h2 font-bold tracking-[-0.02em]">
        What happens when someone crosses a line
      </h2>
      <p className="mt-4 max-w-measure text-body">
        Most of you have already had the bad version of this. A man puts his arm around you at a
        dinner nobody is hosting, and there is no one to tell and nothing that follows. Here is our
        answer, in the order it happens.
      </p>

      <div className="mt-8 grid gap-7 md:grid-cols-2 md:gap-x-10">
        {RULES.map((r) => (
          <div key={r.title} className="border-t-2 border-mark pt-3">
            <h3 className="text-h3 font-semibold">{r.title}</h3>
            <p className="mt-1.5 text-small text-dim">{r.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-9 max-w-measure border-t border-rule pt-5 text-lede">
        Women-only cohorts run first, and keep running after mixed cohorts open. That is a
        permanent track, not a launch phase.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

const FAQS = [
  {
    q: 'Is this a dating app?',
    a: 'No, and the enforcement is the answer rather than the promise. Cohorts are matched with a stated gender composition, the check-in after every session asks directly whether anyone treated the evening as a date, and one credible report of that is a flag. Two flags is removal. Women-only cohorts run permanently.',
  },
  {
    q: 'What if I do not like the group?',
    a: 'Tell us in the private check-in after session one. If it is a genuine mismatch rather than an ordinary awkward first night, we move you to the next forming cohort in your neighborhood at no cost. We will also say plainly that most groups feel awkward at session one and land by session three.',
  },
  {
    q: 'What if I am shy?',
    a: 'That is most of the reason the activity exists. You are not sitting across a table being asked what you do. You are making a bowl badly next to someone else making a bowl badly. A paid host runs session one so nobody has to be the person who starts the conversation.',
  },
  {
    q: 'Who else is in it?',
    a: 'Five people within your five-year age band, living close enough to walk or take one train, at a similar point in life. You see the composition before you pay. You do not see names or photos until the cohort is confirmed, and neither do they.',
  },
  {
    q: 'What happens after four weeks?',
    a: 'We hand you a group chat that we do not sit inside, and we stop charging you. Some groups keep meeting weekly for years and some fade in a month. If you want a second cohort later it costs less than the first.',
  },
] as const;

export function Faq(): JSX.Element {
  return (
    <Section id="faq" eyebrow="Questions" title="The ones people actually ask">
      <div className="max-w-measure divide-y divide-rule border-t border-rule">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group py-4"
            onToggle={(e) => {
              if ((e.currentTarget as HTMLDetailsElement).open) track('faq_open', { q: f.q });
            }}
          >
            <summary className="cursor-pointer list-none font-display text-h3 font-semibold text-ink marker:content-none">
              <span className="mr-2 text-mark">›</span>
              {f.q}
            </summary>
            <p className="mt-2.5 pl-5 text-body">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
