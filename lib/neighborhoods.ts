export type LaunchStatus = 'forming' | 'notify';

export interface Neighborhood {
  readonly slug: string;
  readonly name: string;
  readonly borough: Borough;
  readonly status: LaunchStatus;
}

export type Borough = 'Brooklyn' | 'Queens' | 'Manhattan' | 'The Bronx' | 'Staten Island';

export const BOROUGHS: readonly Borough[] = [
  'Brooklyn',
  'Queens',
  'Manhattan',
  'The Bronx',
  'Staten Island',
];

/**
 * Launch set is deliberately small. `forming` means we will actually run a
 * cohort there this quarter; everything else collects demand only.
 * Adding a neighborhood here is a commitment, not a marketing decision.
 */
export const NEIGHBORHOODS: readonly Neighborhood[] = [
  { slug: 'williamsburg', name: 'Williamsburg', borough: 'Brooklyn', status: 'forming' },
  { slug: 'greenpoint', name: 'Greenpoint', borough: 'Brooklyn', status: 'forming' },
  { slug: 'bed-stuy', name: 'Bedford-Stuyvesant', borough: 'Brooklyn', status: 'forming' },
  { slug: 'crown-heights', name: 'Crown Heights', borough: 'Brooklyn', status: 'notify' },
  { slug: 'park-slope', name: 'Park Slope', borough: 'Brooklyn', status: 'notify' },
  { slug: 'bushwick', name: 'Bushwick', borough: 'Brooklyn', status: 'notify' },
  { slug: 'gowanus', name: 'Gowanus', borough: 'Brooklyn', status: 'notify' },
  { slug: 'astoria', name: 'Astoria', borough: 'Queens', status: 'forming' },
  { slug: 'long-island-city', name: 'Long Island City', borough: 'Queens', status: 'notify' },
  { slug: 'ridgewood', name: 'Ridgewood', borough: 'Queens', status: 'notify' },
  { slug: 'sunnyside', name: 'Sunnyside', borough: 'Queens', status: 'notify' },
  { slug: 'jackson-heights', name: 'Jackson Heights', borough: 'Queens', status: 'notify' },
  { slug: 'lower-east-side', name: 'Lower East Side', borough: 'Manhattan', status: 'notify' },
  { slug: 'east-village', name: 'East Village', borough: 'Manhattan', status: 'notify' },
  { slug: 'harlem', name: 'Harlem', borough: 'Manhattan', status: 'notify' },
  { slug: 'washington-heights', name: 'Washington Heights', borough: 'Manhattan', status: 'notify' },
  { slug: 'upper-west-side', name: 'Upper West Side', borough: 'Manhattan', status: 'notify' },
  { slug: 'mott-haven', name: 'Mott Haven', borough: 'The Bronx', status: 'notify' },
  { slug: 'st-george', name: 'St. George', borough: 'Staten Island', status: 'notify' },
];

export const NEIGHBORHOOD_SLUGS: readonly string[] = NEIGHBORHOODS.map((n) => n.slug);

export const FORMING: readonly Neighborhood[] = NEIGHBORHOODS.filter(
  (n) => n.status === 'forming',
);

export function byBorough(borough: Borough): readonly Neighborhood[] {
  return NEIGHBORHOODS.filter((n) => n.borough === borough);
}

export const AGE_BANDS = ['25-29', '30-34', '35-39', '40-44', '45+', 'under-25'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const WEEKNIGHTS = ['monday', 'tuesday', 'wednesday', 'thursday', 'sunday'] as const;
export type Weeknight = (typeof WEEKNIGHTS)[number];

export const HOPES = [
  'I moved here recently and do not know many people',
  'My friends left the city or paired off',
  'I have friends but nobody free on a weeknight',
  'I want a group, not one-on-one hangouts',
] as const;
export type Hope = (typeof HOPES)[number];

export const SOURCES = [
  'A friend told me',
  'Instagram',
  'Reddit',
  'TikTok',
  'Search',
  'Something else',
] as const;
export type Source = (typeof SOURCES)[number];
