import { timingSafeEqual } from 'node:crypto';
import { serverClient } from '@/lib/supabase';
import { pageTitle } from '@/lib/brand';
import { NEIGHBORHOODS } from '@/lib/neighborhoods';

export const metadata = {
  title: pageTitle('Waitlist'),
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

interface Row {
  id: string;
  created_at: string;
  neighborhood: string;
  age_band: string;
  weeknights: string[];
  left_early: string | null;
  price_variant: string | null;
  headline_variant: string | null;
}

// Six people in one neighborhood and age band is a runnable cohort.
const COHORT_SIZE = 6;

function name(slug: string): string {
  return NEIGHBORHOODS.find((n) => n.slug === slug)?.name ?? slug;
}

/** Constant-time compare so the token cannot be guessed a character at a time. */
function tokenMatches(given: string | undefined, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function tally<T extends string>(rows: Row[], key: (r: Row) => T): Array<[T, number]> {
  const counts = new Map<T, number>();
  for (const r of rows) {
    const k = key(r);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { token?: string };
}): Promise<JSX.Element> {
  const expected = process.env.DASHBOARD_TOKEN;
  if (!expected || !tokenMatches(searchParams.token, expected)) {
    return (
      <div className="mx-auto max-w-measure px-5 py-16">
        <h1 className="text-h2 font-bold">Not here</h1>
        <p className="mt-3 text-body">
          This page needs a token. Append <code>?token=</code> and the value of DASHBOARD_TOKEN.
        </p>
      </div>
    );
  }

  const { data, error } = await serverClient()
    .from('waitlist')
    .select('id,created_at,neighborhood,age_band,weeknights,left_early,price_variant,headline_variant')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-measure px-5 py-16">
        <h1 className="text-h2 font-bold">The waitlist table did not respond</h1>
        <p className="mt-3 text-small text-flag">{error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as Row[];
  const byHood = tally(rows, (r) => r.neighborhood);
  const byAge = tally(rows, (r) => r.age_band);
  const byHeadline = tally(rows, (r) => r.headline_variant ?? 'unassigned');
  const byPrice = tally(rows, (r) => r.price_variant ?? 'unassigned');
  const stories = rows.filter((r) => r.left_early && r.left_early.length > 0);

  // The number that decides where you launch: a neighborhood + age band pair
  // with six or more people in it is a cohort you can actually run.
  const pairs = new Map<string, number>();
  for (const r of rows) {
    const k = `${r.neighborhood}|${r.age_band}`;
    pairs.set(k, (pairs.get(k) ?? 0) + 1);
  }
  const runnable = [...pairs.entries()]
    .filter(([, n]) => n >= COHORT_SIZE)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto w-full max-w-shell px-5 py-12 md:px-8">
      <h1 className="text-h2 font-bold tracking-[-0.02em]">Waitlist</h1>
      <p className="mt-2 text-small text-dim">
        {rows.length} signups · {stories.length} answered the &ldquo;left early&rdquo; question
      </p>

      <section className="mt-10 rule-top pt-3">
        <p className="label">Cohorts you could run today</p>
        {runnable.length === 0 ? (
          <p className="mt-3 text-body">
            No neighborhood and age band yet has {COHORT_SIZE} people in it. That pair is the unit,
            not the raw signup count.
          </p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {runnable.map(([key, count]) => {
              const [hood, age] = key.split('|');
              return (
                <li key={key} className="flex justify-between border-b border-rule py-1.5">
                  <span>
                    {name(hood ?? '')} · {age}
                  </span>
                  <span className="tabular font-display font-semibold text-mark">{count}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Tally title="By neighborhood" rows={byHood.map(([k, v]) => [name(k), v])} />
        <Tally title="By age band" rows={byAge} />
        <Tally title="Headline variant" rows={byHeadline} />
        <Tally title="Price variant" rows={byPrice} />
      </div>

      <section className="mt-12 rule-top pt-3">
        <p className="label">The last time they left something early</p>
        <div className="mt-4 space-y-5">
          {stories.slice(0, 40).map((r) => (
            <blockquote
              key={r.id}
              className="border-l-2 border-mark pl-4 text-body"
            >
              <p>{r.left_early}</p>
              <cite className="label mt-1.5 block not-italic">
                {name(r.neighborhood)} · {r.age_band}
              </cite>
            </blockquote>
          ))}
          {stories.length === 0 ? <p className="text-body">Nothing yet.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Tally({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}): JSX.Element {
  const max = rows[0]?.[1] ?? 1;
  return (
    <section>
      <p className="label border-b border-rule pb-2">{title}</p>
      <ul className="mt-3 space-y-2">
        {rows.map(([label, count]) => (
          <li key={label} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <span className="text-small">{label}</span>
            <span className="tabular font-display text-small font-semibold">{count}</span>
            <span
              className="col-span-2 h-1 bg-mark"
              style={{ width: `${Math.round((count / max) * 100)}%` }}
              aria-hidden="true"
            />
          </li>
        ))}
        {rows.length === 0 ? <li className="text-small text-dim">Nothing yet.</li> : null}
      </ul>
    </section>
  );
}
