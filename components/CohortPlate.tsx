export interface CohortMember {
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly anchor: 'start' | 'middle' | 'end';
  readonly labelY: number;
}

/**
 * The resolved cohort — six matched people, week four.
 * This renders immediately on load and is the permanent treatment on mobile.
 * The WebGL scene layers on top of it on desktop; it never replaces it.
 */
export const COHORT: readonly CohortMember[] = [
  { label: 'Astoria · 31 · new to NYC', x: 160, y: 46, anchor: 'middle', labelY: 30 },
  { label: 'Bed-Stuy · 28', x: 258, y: 102, anchor: 'end', labelY: 92 },
  { label: 'Ridgewood · 34', x: 258, y: 214, anchor: 'end', labelY: 238 },
  { label: 'Greenpoint · 29 · career switch', x: 160, y: 214, anchor: 'middle', labelY: 240 },
  { label: 'Crown Hts · 33', x: 62, y: 214, anchor: 'start', labelY: 238 },
  { label: 'Lower East Side · 27', x: 62, y: 102, anchor: 'start', labelY: 92 },
];

function edges(): string {
  const parts: string[] = [];
  for (let i = 0; i < COHORT.length; i += 1) {
    for (let j = i + 1; j < COHORT.length; j += 1) {
      const a = COHORT[i];
      const b = COHORT[j];
      if (!a || !b) continue;
      parts.push(`M${a.x} ${a.y} L${b.x} ${b.y}`);
    }
  }
  return parts.join(' ');
}

export function CohortPlate({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 320 258"
      role="img"
      aria-label="Six labelled people from different neighborhoods, connected into one group at week four"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <path d={edges()} fill="none" stroke="var(--mark)" strokeWidth="1.1" opacity="0.5" />
      {COHORT.map((m) => (
        <circle key={m.label} cx={m.x} cy={m.y} r={6} fill="var(--mark)" />
      ))}
      <g
        fontFamily="var(--font-display), system-ui, sans-serif"
        fontSize="9.5"
        fill="var(--dim)"
        letterSpacing="0.4"
      >
        {COHORT.map((m) => (
          <text key={m.label} x={m.x} y={m.labelY} textAnchor={m.anchor}>
            {m.label}
          </text>
        ))}
      </g>
    </svg>
  );
}
