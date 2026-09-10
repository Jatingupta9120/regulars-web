-- Waitlist for the v1 validation site.
-- This table holds no ID documents and no government identifiers. The v1 site
-- collects an email address, not a passport. Keep it that way.

create table if not exists waitlist (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  email            text not null,
  neighborhood     text not null,
  age_band         text not null,
  weeknights       text[] not null default '{}',
  hopes            text[] not null default '{}',
  hopes_other      text,
  source           text not null,

  -- "Tell me about the last time you left a social thing early."
  -- Free text, optional. Read these weekly; they are worth more than the emails.
  left_early       text,

  -- Which variant the visitor saw when they signed up.
  price_variant    text,
  headline_variant text,

  -- Market column exists from day one so a second city needs no migration.
  market           text not null default 'nyc'
);

-- ON CONFLICT (email, market) needs a unique index on exactly those columns.
-- A functional index on lower(email) would not satisfy it and the upsert in
-- app/api/waitlist/route.ts would fail at runtime. Email is lowercased by Zod
-- before it ever reaches this table, so a plain index is correct here.
create unique index if not exists waitlist_email_market_idx
  on waitlist (email, market);

create index if not exists waitlist_neighborhood_idx on waitlist (neighborhood);
create index if not exists waitlist_created_at_idx on waitlist (created_at desc);

-- Writes come only from the server route using the service role key.
alter table waitlist enable row level security;
