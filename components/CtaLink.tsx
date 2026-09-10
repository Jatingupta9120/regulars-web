'use client';

import { track } from '@/lib/analytics';
import { currentAssignment } from '@/lib/experiments';

/**
 * The only interactive part of the hero. Kept separate so the heading and copy
 * stay server-rendered.
 */
export function CtaLink({
  position,
  children,
  className,
}: {
  position: 'hero' | 'mid' | 'bottom';
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <a
      href="#waitlist"
      className={className}
      onClick={() => {
        const { headline, price } = currentAssignment();
        track('cta_click', { position, headline, price });
      }}
    >
      {children}
    </a>
  );
}
