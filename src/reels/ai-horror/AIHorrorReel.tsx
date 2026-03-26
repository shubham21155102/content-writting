import React from "react";
import { Composition } from "remotion";
import { AIHorrorScene01 } from "./AIHorrorScene01";
import { AIHorrorScene02 } from "./AIHorrorScene02";
import { AIHorrorScene03 } from "./AIHorrorScene03";
import { AIHorrorScene04 } from "./AIHorrorScene04";
import { AIHorrorScene05 } from "./AIHorrorScene05";
import { AIHorrorScene06 } from "./AIHorrorScene06";
import { AIHorrorScene07 } from "./AIHorrorScene07";
import { AIHorrorScene08 } from "./AIHorrorScene08";

/**
 * AI HORROR REEL - FULL COMPOSITION
 *
 * A 30-second viral Instagram reel about AI surveillance
 * that will terrify viewers and encourage sharing.
 *
 * TOTAL DURATION: 30 seconds (900 frames at 30fps)
 *
 * Scene breakdown:
 * - Scene 1 (0-2s): Hook - "It's Watching"
 * - Scene 2 (2-5s): Data Points Counter
 * - Scene 3 (5-8s): "It Knows" trilogy
 * - Scene 4 (8-12s): "It's Listening"
 * - Scene 5 (12-18s): Digital Twin Creation
 * - Scene 6 (18-24s): The Truth (3 reveals)
 * - Scene 7 (24-28s): The Threat
 * - Scene 8 (28-30s): CTA + Follow
 */

// Individual scene compositions for preview/testing
export const AIHorror01Composition = () => (
  <Composition
    id="AIHorror-01"
    component={AIHorrorScene01}
    durationInFrames={60} // 2 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror02Composition = () => (
  <Composition
    id="AIHorror-02"
    component={AIHorrorScene02}
    durationInFrames={90} // 3 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror03Composition = () => (
  <Composition
    id="AIHorror-03"
    component={AIHorrorScene03}
    durationInFrames={90} // 3 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror04Composition = () => (
  <Composition
    id="AIHorror-04"
    component={AIHorrorScene04}
    durationInFrames={120} // 4 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror05Composition = () => (
  <Composition
    id="AIHorror-05"
    component={AIHorrorScene05}
    durationInFrames={180} // 6 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror06Composition = () => (
  <Composition
    id="AIHorror-06"
    component={AIHorrorScene06}
    durationInFrames={180} // 6 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror07Composition = () => (
  <Composition
    id="AIHorror-07"
    component={AIHorrorScene07}
    durationInFrames={120} // 4 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIHorror08Composition = () => (
  <Composition
    id="AIHorror-08"
    component={AIHorrorScene08}
    durationInFrames={90} // 3 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);
