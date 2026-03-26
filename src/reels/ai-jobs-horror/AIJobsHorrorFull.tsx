import React from "react";
import { AbsoluteFill, useCurrentFrame, Audio, staticFile } from "remotion";
import { Scene01Hook } from "./Scene01Hook";
import { Scene02Stats } from "./Scene02Stats";
import { Scene03Timeline } from "./Scene03Timeline";
import { Scene04Jobs } from "./Scene04Jobs";
import { Scene05Industries } from "./Scene05Industries";
import { Scene06Truth } from "./Scene06Truth";
import { Scene07CTA } from "./Scene07CTA";

/**
 * AI JOBS HORROR - FULL COMBINED VIDEO
 *
 * This is THE single video you render - all 7 scenes combined into one.
 * Duration: 30 seconds (900 frames at 30fps)
 */

export const AIJobsHorrorFull: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene timing (cumulative frames)
  const scene1End = 90;   // 0-3s: Scene 1
  const scene2End = 210;  // 3-7s: Scene 2
  const scene3End = 360;  // 7-12s: Scene 3
  const scene4End = 510;  // 12-17s: Scene 4
  const scene5End = 660;  // 17-22s: Scene 5
  const scene6End = 810;  // 22-27s: Scene 6
  const scene7End = 900;  // 27-30s: Scene 7

  // Render appropriate scene based on current frame
  if (frame < scene1End) {
    return <Scene01Hook />;
  }

  if (frame < scene2End) {
    return <Scene02Stats />;
  }

  if (frame < scene3End) {
    return <Scene03Timeline />;
  }

  if (frame < scene4End) {
    return <Scene04Jobs />;
  }

  if (frame < scene5End) {
    return <Scene05Industries />;
  }

  if (frame < scene6End) {
    return <Scene06Truth />;
  }

  return <Scene07CTA />;
};

// Wrap with Audio - ASMR-style satisfying sounds
export const AIJobsHorrorFullWithAudio: React.FC = () => {
  return (
    <>
      <AIJobsHorrorFull />
      <Audio src={staticFile("audio/ai-jobs-asmr.wav")} />
    </>
  );
};
