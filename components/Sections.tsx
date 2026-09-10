import { PRICE_COPY, RETURNING_PRICE_USD } from '@/lib/pricing';
import { PRICE_VARIANTS } from '@/lib/experiments';
import { BOROUGHS, byBorough } from '@/lib/neighborhoods';

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section id={id} className="mt-section rule-top pt-3" aria-labelledby={`${id}-heading`}>
      <p className="label">{eyebrow}</p>
      <h2 id={`${id}-heading`} className="mt-1 max-w-[24ch] text-h2 font-bold tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------- problem */

export function Problem(): JSX.Element {
  return (
    <section className="mt-section max-w-measure" aria-label="Why this exists">
      <p className="text-lede text-ink">
        You have three people you would text about something serious and nobody you would text
        about a Tuesday. The group thread from your old job still exists and nothing happens in
        it. You have gone to the thing, made pleasant conversation with someone you liked, and
        then never seen them again, because there was no second time.
      </p>
      <p className="mt-5 text-body">
        Making a friend at 31 in New York is not a matching problem. It is an attendance problem.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ how it works */

const STEPS = [
  {
    n: '01',
    title: 'Verified intake',
    body: 'Government ID and a liveness check, then twelve questions about how your week actually looks.',
    detail:
      'Nobody sees anybody until both sides clear verification. We keep the decision, never the document.',
  },
  {
    n: '02',
    title: 'A cohort of six',
    body: 'Matched on neighborhood, a five-year age band, and roughly where you are in life.',
    detail:
      'The gender composition is stated before you pay and is never approximated to fill a seat.',
  },
  {
    n: '03',
    title: 'Four sessions, one activity each',
    body: 'Pottery in Greenpoint. A ramen class. A Saturday pantry shift in Bushwick. Bouldering in Gowanus.',
    detail:
      'Side by side with your hands busy, never a loud restaurant table where nobody hears the far end.',
  },
  {
    n: '04',
    title: 'You graduate',
    body: 'Week four ends with your own group chat, and no further charge from us.',
    detail: 'The business only works if you leave. We would rather be recommended than renewed.',
  },
] as const;

export function HowItWorks(): JSX.Element {
  return (
    <Section id="how" eyebrow="The sequence" title="Four Thursdays, in order">
      <RouteDiagram />
      <ol className="mt-9 rule-top">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="grid gap-x-5 gap-y-2 border-b border-rule py-6 md:grid-cols-[54px_1fr_1fr]"
          >
            <span className="tabular font-display text-2xl font-bold text-mark">{s.n}</span>
            <div>
              <h3 className="text-h3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-body">{s.body}</p>
            </div>
            <p className="text-small italic text-dim md:mt-0">{s.detail}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function RouteDiagram(): JSX.Element {
  const stops = [
    { x: 60, week: 'WEEK 1', what: 'POTTERY · GREENPOINT' },
    { x: 260, week: 'WEEK 2', what: 'RAMEN CLASS' },
    { x: 460, week: 'WEEK 3', what: 'PANTRY SHIFT' },
    { x: 660, week: 'WEEK 4', what: 'BOULDERING' },
  ] as const;

  return (
    <div className="overflow-x-auto border border-rule bg-surface p-4">
      <svg
        viewBox="0 0 720 150"
        role="img"
        aria-label="Four weekly sessions running from week one to week four, ending in one formed group"
        style={{ width: '100%', minWidth: '520px', height: 'auto', display: 'block' }}
      >
        <line x1="60" y1="76" x2="660" y2="76" stroke="var(--mark)" strokeWidth="8" />
        {stops.map((s, i) => (
          <g key={s.week}>
            <circle
              cx={s.x}
              cy={76}
              r={i === stops.length - 1 ? 15 : 11}
              fill={i === stops.length - 1 ? 'var(--mark)' : 'var(--surface)'}
              stroke="var(--ink)"
              strokeWidth="3.5"
            />
            <text
              x={s.x}
              y={124}
              textAnchor="middle"
              fill="var(--ink)"
              fontFamily="var(--font-display), sans-serif"
              fontSize="13"
              letterSpacing="1.4"
            >
              {s.week}
            </text>
            <text
              x={s.x}
              y={40}
              textAnchor="middle"
              fill="var(--dim)"
              fontFamily="var(--font-display), sans-serif"
              fontSize="12"
              letterSpacing="1.2"
            >
              {s.what}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------- compare */

const ALTERNATIVES = [
  {
    kind: 'Friendship apps that work like dating apps',
    fair: 'They are free, and the supply of people is enormous.',
    problem:
      'You match, you text, and one of you does not follow through. The burden of turning a match into a meeting is entirely on you, every single time.',
  },
  {
    kind: 'Dinners with a table of strangers',
    fair: 'Genuinely good nights. Low commitment, and you meet people you would never otherwise meet.',
    problem:
      'A new table every time. Reviewers say it plainly: one-off groups do not become friendships. There is also nobody hosting, which is where the safety complaints come from.',
  },
  {
    kind: 'Interest groups and event listings',
    fair: 'Free, enormous range, and the recurring ones do produce real friendships.',
    problem:
      'Group size is unbounded and unverified, nobody is matched to you, and the burden of showing up alone to a room of forty people falls on the most anxious person there.',
  },
] as const;

export function Compare(): JSX.Element {
  return (
    <Section id="compare" eyebrow="Honestly" title="Why not the things that already exist">
      <div className="grid gap-6 md:grid-cols-3">
        {ALTERNATIVES.map((a) => (
          <article key={a.kind} className="border-t border-rule pt-4">
            <h3 className="text-h3 font-semibold">{a.kind}</h3>
            <p className="mt-2 text-small text-dim">
              <span className="label mr-1.5 normal-case tracking-normal text-mark">Fair:</span>
              {a.fair}
            </p>
            <p className="mt-2 text-small text-body">
              <span className="label mr-1.5 normal-case tracking-normal text-flag">But:</span>
              {a.problem}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- pricing */

export function Pricing(): JSX.Element {
  return (
    <Section id="cost" eyebrow="What it costs" title="One charge. Nothing recurring.">
      {PRICE_VARIANTS.map((variant) => {
        const copy = PRICE_COPY[variant];
        return (
          <div key={variant} data-variant={variant}>
            <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="tabular font-display text-[3.4rem] font-bold leading-none text-ink">
                {copy.headline}
              </span>
              <span className="pb-2 font-display text-h3 text-dim">{copy.unit}</span>
            </div>
            <p className="mt-4 max-w-measure text-body">{copy.support}</p>
          </div>
        );
      })}
      <ul className="mt-7 max-w-measure space-y-3 border-t border-rule pt-5 text-small">
        <li>
          <strong className="text-ink">We do not auto-renew you.</strong> There is no subscription
          to find and cancel later. When the four weeks end, the charging ends.
        </li>
        <li>
          <strong className="text-ink">If your cohort does not fill as promised,</strong> you are
          refunded in full and we do not run it.
        </li>
        <li>
          <strong className="text-ink">A second cohort later costs ${RETURNING_PRICE_USD}.</strong>{' '}
          That is the only discount we offer, and it exists because coming back is the only proof
          this works.
        </li>
      </ul>
    </Section>
  );
}

/* --------------------------------------------------------- neighborhoods */

export function Neighborhoods(): JSX.Element {
  return (
    <Section id="neighborhoods" eyebrow="Where" title="Three neighborhoods now, the rest on request">
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {BOROUGHS.map((b) => {
          const list = byBorough(b);
          if (list.length === 0) return null;
          return (
            <div key={b} className="border-t border-rule pt-3">
              <h3 className="label mb-2">{b}</h3>
              <ul className="space-y-1.5 text-small">
                {list.map((n) => (
                  <li key={n.slug} className="flex items-baseline justify-between gap-3">
                    <span className={n.status === 'forming' ? 'text-ink' : 'text-dim'}>
                      {n.name}
                    </span>
                    <span
                      className={`label shrink-0 ${n.status === 'forming' ? 'text-mark' : ''}`}
                    >
                      {n.status === 'forming' ? 'Forming' : 'Notify me'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-7 max-w-measure text-small text-dim">
        A neighborhood only moves to Forming when we can actually run a cohort there this quarter.
        Everything else is us counting how many of you there are.
      </p>
    </Section>
  );
}

