import React from "react";
import { Composition } from "remotion";
import { AIJobsHorrorFull, AIJobsHorrorFullWithAudio } from "./AIJobsHorrorFull";
import { Scene01Hook } from "./Scene01Hook";
import { Scene02Stats } from "./Scene02Stats";
import { Scene03Timeline } from "./Scene03Timeline";
import { Scene04Jobs } from "./Scene04Jobs";
import { Scene05Industries } from "./Scene05Industries";
import { Scene06Truth } from "./Scene06Truth";
import { Scene07CTA } from "./Scene07CTA";

/**
 * AI JOBS HORROR REEL - DOCUMENTARY STYLE
 *
 * A realistic, documentary-style Instagram reel about AI job replacement
 * that scares viewers because it's TRUE and happening NOW.
 *
 * TOTAL DURATION: 30 seconds (900 frames at 30fps)
 *
 * Scene breakdown:
 * - Scene 1 (0-3s): Hook - "Your job is next"
 * - Scene 2 (3-7s): Statistics - "85 million jobs by 2025"
 * - Scene 3 (7-12s): Timeline - AI replacement progression
 * - Scene 4 (12-17s): Job list - Jobs being replaced NOW
 * - Scene 5 (17-22s): Industries - Automation risk by industry
 * - Scene 6 (22-27s): Truth - "Faster than predicted"
 * - Scene 7 (27-30s): CTA - "Adapt or be replaced"
 */

// 🎬 RENDER THIS - Full combined video (all scenes in one)
// NOTE: Includes documentary-style audio
export const AIJobsHorrorFullComposition = () => (
  <Composition
    id="AIJobs-Horror-FULL"
    component={AIJobsHorrorFullWithAudio}
    durationInFrames={900} // 30 seconds (all scenes combined)
    fps={30}
    width={1080}
    height={1920}
  />
);

// Individual scene compositions (for preview/testing only)
export const AIJobsHorror01Composition = () => (
  <Composition
    id="AIJobs-Horror-01-Preview"
    component={Scene01Hook}
    durationInFrames={90} // 3 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror02Composition = () => (
  <Composition
    id="AIJobs-Horror-02-Preview"
    component={Scene02Stats}
    durationInFrames={120} // 4 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror03Composition = () => (
  <Composition
    id="AIJobs-Horror-03-Preview"
    component={Scene03Timeline}
    durationInFrames={150} // 5 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror04Composition = () => (
  <Composition
    id="AIJobs-Horror-04-Preview"
    component={Scene04Jobs}
    durationInFrames={150} // 5 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror05Composition = () => (
  <Composition
    id="AIJobs-Horror-05-Preview"
    component={Scene05Industries}
    durationInFrames={150} // 5 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror06Composition = () => (
  <Composition
    id="AIJobs-Horror-06-Preview"
    component={Scene06Truth}
    durationInFrames={150} // 5 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);

export const AIJobsHorror07Composition = () => (
  <Composition
    id="AIJobs-Horror-07-Preview"
    component={Scene07CTA}
    durationInFrames={90} // 3 seconds
    fps={30}
    width={1080}
    height={1920}
  />
);
