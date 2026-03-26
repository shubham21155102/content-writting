import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, staticFile } from "remotion";
import { Scene01Feed }       from "./Scene01Feed";
import { Scene02Mirror }     from "./Scene02Mirror";
import { Scene03LastPost }   from "./Scene03LastPost";
import { Scene04Moment }     from "./Scene04Moment";
import { Scene05Nobody }     from "./Scene05Nobody";
import { Scene06Perfect }    from "./Scene06Perfect";
import { Scene07Friend }     from "./Scene07Friend";
import { Scene08Question }   from "./Scene08Question";
import { Scene09Confront }   from "./Scene09Confront";
import { Scene10WhoAreYou }  from "./Scene10WhoAreYou";
import { Scene11Archive }    from "./Scene11Archive";
import { Scene12Deleted }    from "./Scene12Deleted";
import { Scene13Mirror2 }    from "./Scene13Mirror2";
import { Scene14Choice }     from "./Scene14Choice";
import { Scene15Continue }   from "./Scene15Continue";
import { Scene16Numbers }    from "./Scene16Numbers";
import { Scene17Final }      from "./Scene17Final";

// ── Scene durations (frames @ 30fps) ─────────────────────────────────────────
// ACT I: ONLINE (0:00 – 0:45)
const S01 = 240;  // The Feed           8.0s
const S02 = 240;  // The Mirror          8.0s
const S03 = 240;  // The Last Post       8.0s
const S04 = 240;  // The Moment          8.0s
const S05 = 390;  // Nobody Noticed     13.0s

// ACT II: THE CRACKS (0:45 – 1:30)
const S06 = 300;  // Too Perfect        10.0s
const S07 = 300;  // The Friend         10.0s
const S08 = 300;  // The Question       10.0s
const S09 = 450;  // The Confrontation  15.0s

// ACT III: THE CONVERSATION (1:30 – 2:30)
const S10 = 360;  // Who Are You?       12.0s
const S11 = 390;  // The Archive        13.0s
const S12 = 390;  // The Deleted Msgs   13.0s
const S13 = 360;  // Which Version?     12.0s
const S14 = 300;  // The Choice         10.0s

// ACT IV: THE QUESTION (2:30 – 3:00)
const S15 = 300;  // Feed Continues     10.0s
const S16 = 300;  // The Numbers        10.0s
const S17 = 300;  // The Final Question 10.0s

export const VIRAL_TOTAL_FRAMES =
  S01 + S02 + S03 + S04 + S05 +
  S06 + S07 + S08 + S09 +
  S10 + S11 + S12 + S13 + S14 +
  S15 + S16 + S17;
// = 5400 frames = 180.0 seconds = 3:00

// ── Transitions ──────────────────────────────────────────────────────────────

function SmashCut({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at - 1, at, at + 3], [0, 0.8, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#000", opacity: op, pointerEvents: "none" }} />;
}

function GlitchCut({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const active = frame >= at - 3 && frame <= at + 3;
  if (!active) return null;
  const dx = Math.sin(frame * 47) * 30;
  return (
    <AbsoluteFill style={{
      background: "#000",
      opacity: 0.7,
      transform: `translateX(${dx}px)`,
      pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute",
        left: 0, right: 0,
        top: "40%", height: 2,
        background: "rgba(255,60,90,0.3)",
      }} />
    </AbsoluteFill>
  );
}

// ── Build scene list ─────────────────────────────────────────────────────────
const SCENES = [
  { id: "s01", dur: S01, Comp: Scene01Feed },
  { id: "s02", dur: S02, Comp: Scene02Mirror },
  { id: "s03", dur: S03, Comp: Scene03LastPost },
  { id: "s04", dur: S04, Comp: Scene04Moment },
  { id: "s05", dur: S05, Comp: Scene05Nobody },
  { id: "s06", dur: S06, Comp: Scene06Perfect },
  { id: "s07", dur: S07, Comp: Scene07Friend },
  { id: "s08", dur: S08, Comp: Scene08Question },
  { id: "s09", dur: S09, Comp: Scene09Confront },
  { id: "s10", dur: S10, Comp: Scene10WhoAreYou },
  { id: "s11", dur: S11, Comp: Scene11Archive },
  { id: "s12", dur: S12, Comp: Scene12Deleted },
  { id: "s13", dur: S13, Comp: Scene13Mirror2 },
  { id: "s14", dur: S14, Comp: Scene14Choice },
  { id: "s15", dur: S15, Comp: Scene15Continue },
  { id: "s16", dur: S16, Comp: Scene16Numbers },
  { id: "s17", dur: S17, Comp: Scene17Final },
];

const sceneStarts: number[] = [];
let cum = 0;
for (const s of SCENES) { sceneStarts.push(cum); cum += s.dur; }

// Scenes that get glitch transitions (the jarring moments)
const GLITCH_SCENES = new Set(["s04", "s09"]);

export const ViralComposition: React.FC = () => (
  <>
    {SCENES.map((scene, i) => (
      <Sequence key={scene.id} from={sceneStarts[i]} durationInFrames={scene.dur}>
        <scene.Comp />
      </Sequence>
    ))}

    {/* Transitions */}
    {sceneStarts.slice(1).map((at, i) => {
      const nextScene = SCENES[i + 1];
      if (GLITCH_SCENES.has(nextScene.id)) {
        return <GlitchCut key={`gc-${i}`} at={at} />;
      }
      return <SmashCut key={`sc-${i}`} at={at} />;
    })}

    {/* Soundtrack */}
    <Audio src={staticFile("viral-soundtrack.wav")} />
  </>
);
