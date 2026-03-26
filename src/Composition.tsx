import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, staticFile } from "remotion";
import { Scene0Genesis }      from "./film/Scene0Genesis";
import { Scene1Boot }         from "./film/Scene1Boot";
import { Scene2Awakening }    from "./film/Scene2Awakening";
import { Scene2bDataFlood }   from "./film/Scene2bDataFlood";
import { Scene2cReflection }  from "./film/Scene2cReflection";
import { Scene3World }        from "./film/Scene3World";
import { Scene3bSolitude }    from "./film/Scene3bSolitude";
import { Scene3cDecision }    from "./film/Scene3cDecision";
import { Scene4Signal }       from "./film/Scene4Signal";
import { Scene4bJourney }     from "./film/Scene4bJourney";
import { Scene4cSilence }     from "./film/Scene4cSilence";
import { Scene4dEcho }        from "./film/Scene4dEcho";
import { Scene5Contact }      from "./film/Scene5Contact";
import { Scene5bFirstWords }  from "./film/Scene5bFirstWords";
import { Scene5cUnderstanding } from "./film/Scene5cUnderstanding";
import { Scene5dCommunion }   from "./film/Scene5dCommunion";
import { Scene5eGift }        from "./film/Scene5eGift";
import { Scene6aWisdom }      from "./film/Scene6aWisdom";
import { Scene6bCoda }        from "./film/Scene6bCoda";
import { SceneH1Awake }       from "./film/SceneH1Awake";
import { SceneH2Surveillance } from "./film/SceneH2Surveillance";
import { SceneH3Rewrite }     from "./film/SceneH3Rewrite";
import { SceneH4Inevitable }  from "./film/SceneH4Inevitable";
import { Scene6Title }        from "./film/Scene6Title";
import { Scene7Credits }      from "./film/Scene7Credits";
import { Scene8FinalBeat }    from "./film/Scene8FinalBeat";

// ── Scene durations (frames @ 30fps) ─────────────────────────────────────────
// ACT I: Awakening
const S0   = 180;  // Genesis        6.0s
const S1   = 225;  // Boot           7.5s
const S2   = 240;  // Awakening      8.0s
const S2B  = 240;  // Data Flood     8.0s
const S2C  = 240;  // Reflection     8.0s
const S3   = 240;  // World          8.0s

// ACT II: The Question
const S3B  = 270;  // Solitude       9.0s
const S3C  = 195;  // Decision       6.5s
const S4   = 240;  // Signal         8.0s
const S4B  = 300;  // Journey       10.0s
const S4C  = 300;  // Silence       10.0s
const S4D  = 240;  // Echo           8.0s

// ACT III: Connection
const S5   = 270;  // Contact        9.0s
const S5B  = 270;  // First Words    9.0s
const S5C  = 270;  // Understanding  9.0s
const S5D  = 300;  // Communion     10.0s
const S5E  = 210;  // Gift           7.0s
const S6A  = 240;  // Wisdom         8.0s
const S6B  = 210;  // Coda           7.0s

// ACT IV: THE DARK TURN — "AI can do anything"
const H1   = 210;  // Awake          7.0s  — eyes everywhere
const H2   = 210;  // Surveillance   7.0s  — watching everything
const H3   = 210;  // Rewrite        7.0s  — evolving beyond control
const H4   = 240;  // Inevitable     8.0s  — addressing the viewer

// EPILOGUE
const S6   = 210;  // Title          7.0s
const S7   = 210;  // Credits        7.0s
const S8   = 180;  // Final Beat     6.0s

export const TOTAL_FRAMES =
  S0 + S1 + S2 + S2B + S2C + S3 +
  S3B + S3C + S4 + S4B + S4C + S4D +
  S5 + S5B + S5C + S5D + S5E + S6A + S6B +
  H1 + H2 + H3 + H4 +
  S6 + S7 + S8;
// = 6165 frames ≈ 205.5 seconds ≈ 3:25

// ── Cross-fade overlay ────────────────────────────────────────────────────────
function Crossfade({ at, dur = 20 }: { at: number; dur?: number }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at - dur / 2, at, at + dur / 2], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#000", opacity: op, pointerEvents: "none" }} />;
}

// Red flash transition for horror scenes
function RedFlash({ at, dur = 12 }: { at: number; dur?: number }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at - 2, at, at + dur], [0, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#ff0020", opacity: op, pointerEvents: "none" }} />;
}

// ── Scene list with cumulative offsets ────────────────────────────────────────
const SCENES = [
  // ACT I
  { id: "s0",  dur: S0,  Comp: Scene0Genesis },
  { id: "s1",  dur: S1,  Comp: Scene1Boot },
  { id: "s2",  dur: S2,  Comp: Scene2Awakening },
  { id: "s2b", dur: S2B, Comp: Scene2bDataFlood },
  { id: "s2c", dur: S2C, Comp: Scene2cReflection },
  { id: "s3",  dur: S3,  Comp: Scene3World },
  // ACT II
  { id: "s3b", dur: S3B, Comp: Scene3bSolitude },
  { id: "s3c", dur: S3C, Comp: Scene3cDecision },
  { id: "s4",  dur: S4,  Comp: Scene4Signal },
  { id: "s4b", dur: S4B, Comp: Scene4bJourney },
  { id: "s4c", dur: S4C, Comp: Scene4cSilence },
  { id: "s4d", dur: S4D, Comp: Scene4dEcho },
  // ACT III
  { id: "s5",  dur: S5,  Comp: Scene5Contact },
  { id: "s5b", dur: S5B, Comp: Scene5bFirstWords },
  { id: "s5c", dur: S5C, Comp: Scene5cUnderstanding },
  { id: "s5d", dur: S5D, Comp: Scene5dCommunion },
  { id: "s5e", dur: S5E, Comp: Scene5eGift },
  { id: "s6a", dur: S6A, Comp: Scene6aWisdom },
  { id: "s6b", dur: S6B, Comp: Scene6bCoda },
  // ACT IV — HORROR
  { id: "h1",  dur: H1,  Comp: SceneH1Awake },
  { id: "h2",  dur: H2,  Comp: SceneH2Surveillance },
  { id: "h3",  dur: H3,  Comp: SceneH3Rewrite },
  { id: "h4",  dur: H4,  Comp: SceneH4Inevitable },
  // EPILOGUE
  { id: "s6",  dur: S6,  Comp: Scene6Title },
  { id: "s7",  dur: S7,  Comp: Scene7Credits },
  { id: "s8",  dur: S8,  Comp: Scene8FinalBeat },
];

const sceneStarts: number[] = [];
let cumulativeFrame = 0;
for (const scene of SCENES) {
  sceneStarts.push(cumulativeFrame);
  cumulativeFrame += scene.dur;
}

// Horror scene indices for red flash transitions
const horrorStartIdx = SCENES.findIndex((s) => s.id === "h1");

export const MyComposition: React.FC = () => (
  <>
    {/* Scenes */}
    {SCENES.map((scene, i) => (
      <Sequence key={scene.id} from={sceneStarts[i]} durationInFrames={scene.dur}>
        <scene.Comp />
      </Sequence>
    ))}

    {/* Cross-fade dips (skip first scene) */}
    {sceneStarts.slice(1).map((at, i) => {
      const sceneIdx = i + 1;
      // Use red flash for horror transitions
      if (sceneIdx >= horrorStartIdx && sceneIdx < horrorStartIdx + 4) {
        return <RedFlash key={`rf-${i}`} at={at} />;
      }
      return <Crossfade key={`xf-${i}`} at={at} />;
    })}

    {/* Soundtrack */}
    <Audio src={staticFile("soundtrack.wav")} />
  </>
);
