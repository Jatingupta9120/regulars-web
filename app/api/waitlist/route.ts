import { NextResponse } from 'next/server';
import { brand } from '@/lib/brand';
import { serverClient } from '@/lib/supabase';
import { toRow, waitlistSchema } from '@/lib/waitlist';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'We could not read that submission. Try again.' }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? 'Something in the form is not valid.',
        field: first?.path[0] ?? null,
      },
      { status: 422 },
    );
  }

  // Honeypot filled means a bot. Return the success shape so it learns nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const supabase = serverClient();
    const { error } = await supabase
      .from('waitlist')
      .upsert(toRow(parsed.data), { onConflict: 'email,market', ignoreDuplicates: false });

    if (error) {
      console.error('waitlist insert failed', error);
      return NextResponse.json(
        {
          error:
            `We could not save that. Email us at ${brand.email.hello} and we will add you by hand.`,
        },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error('waitlist route failed', cause);
    return NextResponse.json(
      {
        error: `The waitlist is temporarily down. Email ${brand.email.hello} and we will add you.`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
