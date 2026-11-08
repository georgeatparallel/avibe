import type { ReactNode } from 'react';

import './elevation.css';
import './elevation-v2.css';

/** Which proposal to draw: v1 (levels, state, glow; ./elevation.css), or v2 on top of it (borderless
 *  edges and the freshness kit; ./elevation-v2.css) at its restrained (`v2a`) or expressive (`v2b`)
 *  level. */
export type ElevationVersion = 'v1' | 'v2a' | 'v2b';

/** Draws its children under the proposed elevation system (ui/design: system/elevation/*,
 *  system/elevation-v2/*). The stylesheets apply only while this marker is in the document, portals
 *  included, so a frame without it, and the canvas around the frames, render as shipped. */
export function ElevationProposal({ version = 'v1', children }: { version?: ElevationVersion; children: ReactNode }) {
  return (
    <div data-elevation-proposal={version} className="contents">
      {children}
    </div>
  );
}
