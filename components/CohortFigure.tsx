'use client';

import { useCallback, useState } from 'react';
import { CohortPlate } from './CohortPlate';
import { CohortScene } from './CohortScene';

/**
 * The static plate is the page's real content and renders on the server.
 * The WebGL layer fades it back only once it has drawn a frame, so a failed
 * import or a missing WebGL context leaves a complete figure on screen.
 */
export function CohortFigure(): JSX.Element {
  const [sceneLive, setSceneLive] = useState(false);
  const onReady = useCallback(() => setSceneLive(true), []);

  return (
    <div className="relative">
      <div className="transition-opacity duration-700" style={{ opacity: sceneLive ? 0.12 : 1 }}>
        <CohortPlate />
      </div>
      <CohortScene onReady={onReady} />
    </div>
  );
}
