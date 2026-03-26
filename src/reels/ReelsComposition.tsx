import React from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, interpolate, staticFile } from "remotion";
import { R01Hook }     from "./R01Hook";
import { R02Mirror }   from "./R02Mirror";
import { R03Glitch }   from "./R03Glitch";
import { R04Nobody }   from "./R04Nobody";
import { R05Perfect }  from "./R05Perfect";
import { R06Friend }   from "./R06Friend";
import { R07Reveal }   from "./R07Reveal";
import { R08Archive }  from "./R08Archive";
import { R09Question } from "./R09Question";
import { R10Stats }    from "./R10Stats";
import { R11Final }    from "./R11Final";

const SCENES = [
  { id: "r01", dur: 150,  Comp: R01Hook },     // 5.0s
  { id: "r02", dur: 210,  Comp: R02Mirror },    // 7.0s
  { id: "r03", dur: 150,  Comp: R03Glitch },    // 5.0s
  { id: "r04", dur: 240,  Comp: R04Nobody },    // 8.0s
  { id: "r05", dur: 210,  Comp: R05Perfect },   // 7.0s
  { id: "r06", dur: 240,  Comp: R06Friend },    // 8.0s
  { id: "r07", dur: 240,  Comp: R07Reveal },    // 8.0s
  { id: "r08", dur: 300,  Comp: R08Archive },   // 10.0s
  { id: "r09", dur: 300,  Comp: R09Question },  // 10.0s
  { id: "r10", dur: 300,  Comp: R10Stats },     // 10.0s
  { id: "r11", dur: 300,  Comp: R11Final },     // 10.0s  — removed 60 excess frames
];

export const REELS_TOTAL = SCENES.reduce((sum, s) => sum + s.dur, 0);
// = 2640 frames = 88 seconds

const starts: number[] = [];
let c = 0;
for (const s of SCENES) { starts.push(c); c += s.dur; }

function SmashCut({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at - 1, at, at + 2], [0, 0.9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#000", opacity: op, pointerEvents: "none" }} />;
}

export const ReelsComposition: React.FC = () => (
  <>
    {SCENES.map((scene, i) => (
      <Sequence key={scene.id} from={starts[i]} durationInFrames={scene.dur}>
        <scene.Comp />
      </Sequence>
    ))}
    {starts.slice(1).map((at, i) => (
      <SmashCut key={`cut-${i}`} at={at} />
    ))}
    <Audio src={staticFile("reels-soundtrack.wav")} />
  </>
);
