import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade } from "./helpers";

// Two sine waves representing two civilizations talking
function DualWave() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 1280, CY = 360;
  const POINTS = 200;

  // Wave A (Earth — cyan) and Wave B (Proxima — pink)
  // They start separated, then merge toward center as dialogue deepens

  const mergeProgress = spring({ frame: frame - 20, fps, config: { damping: 20 } });

  const waveA: string[] = [];
  const waveB: string[] = [];
  const merged: string[] = [];

  for (let p = 0; p <= POINTS; p++) {
    const x   = (p / POINTS) * W;
    const t   = frame / fps;
    const xNorm = p / POINTS;

    // Wave A: Earth's signal — primes encoded as bumps
    const freqA = 2 + 3 * Math.sin(xNorm * Math.PI * 4);
    const yA = CY - 60 + 50 * Math.sin(freqA * t + xNorm * Math.PI * 6) * (1 - mergeProgress * 0.5);

    // Wave B: Response — harmonics, slightly offset rhythm
    const freqB = 3 + 2 * Math.cos(xNorm * Math.PI * 5);
    const yB = CY + 60 + 50 * Math.sin(freqB * t * 1.1 + xNorm * Math.PI * 7 + 1.2) * (1 - mergeProgress * 0.5);

    // Merged: interference pattern
    const yM  = CY + 45 * Math.sin(freqA * t + xNorm * Math.PI * 6) * Math.cos(freqB * t * 0.8 + xNorm * 2);

    waveA.push(`${x},${yA}`);
    waveB.push(`${x},${yB}`);
    merged.push(`${x},${yM}`);
  }

  const waveAOp  = interpolate(frame, [0, 20, 70, 90], [0, 0.8, 0.8, 0.2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const waveBOp  = interpolate(frame, [8, 28, 70, 90], [0, 0.8, 0.8, 0.2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const mergedOp = interpolate(frame, [40, 65], [0, 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <svg style={{ position: "absolute", inset: 0 }} width={W} height={720} viewBox={`0 0 ${W} 720`}>
      <defs>
        <filter id="wave-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Earth wave */}
      <polyline
        points={waveA.join(" ")}
        fill="none" stroke={COLORS.cyan} strokeWidth="2"
        opacity={waveAOp} filter="url(#wave-glow)"
      />
      {/* Proxima wave */}
      <polyline
        points={waveB.join(" ")}
        fill="none" stroke={COLORS.pink} strokeWidth="2"
        opacity={waveBOp} filter="url(#wave-glow)"
      />
      {/* Merged dialogue wave */}
      <polyline
        points={merged.join(" ")}
        fill="none" stroke={COLORS.purple} strokeWidth="2.5"
        opacity={mergedOp} filter="url(#wave-glow)"
      />

      {/* Dividing line */}
      <line x1={0} y1={CY} x2={W} y2={CY}
        stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="8 8" />

      {/* Source labels */}
      <text x={30} y={CY - 75} fill={COLORS.cyan} fontSize={11}
        fontFamily="monospace" opacity={waveAOp * 0.8} letterSpacing="3">
        EARTH
      </text>
      <text x={30} y={CY + 85} fill={COLORS.pink} fontSize={11}
        fontFamily="monospace" opacity={waveBOp * 0.8} letterSpacing="3">
        PROXIMA b
      </text>
    </svg>
  );
}

// Prime number sequence display (first shared language)
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

function PrimeDisplay() {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: "absolute", top: 60,
      left: 0, right: 0, textAlign: "center",
      fontFamily: "monospace",
      display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap",
      padding: "0 120px",
    }}>
      {PRIMES.map((p, i) => {
        const op = interpolate(frame - i * 4, [0, 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <span key={p} style={{
            color: COLORS.cyan,
            fontSize: 22,
            fontWeight: 700,
            opacity: op * 0.7,
            textShadow: `0 0 12px ${COLORS.cyan}`,
          }}>
            {p}
          </span>
        );
      })}
    </div>
  );
}

const DIALOGUE = [
  { earth: "We send primes.",        proxima: "We confirm primes.",   frame: 5  },
  { earth: "We send mathematics.",   proxima: "We return theorems.",  frame: 35 },
  { earth: "We send music.",         proxima: "We return harmony.",   frame: 65 },
  { earth: "We send ...",            proxima: "We understand.",       frame: 95 },
];

export const Scene5bFirstWords: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp  = useFade(0, 20);

  const currentDialogue = DIALOGUE.reduce((acc, d) => (frame >= d.frame ? d : acc), DIALOGUE[0]);
  const dialogueOp = interpolate(frame % 30, [0, 8, 22, 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#00000c" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>

        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${COLORS.purple}0a 0%, transparent 70%)`,
        }} />

        <PrimeDisplay />
        <DualWave />

        {/* Dialogue */}
        <div style={{
          position: "absolute", bottom: 80,
          left: 0, right: 0,
          display: "flex", justifyContent: "space-between",
          padding: "0 80px",
          fontFamily: "'Courier New', monospace",
          opacity: dialogueOp,
        }}>
          <div style={{ color: COLORS.cyan, fontSize: 20, maxWidth: 400, letterSpacing: "0.1em" }}>
            {currentDialogue.earth}
          </div>
          <div style={{ color: COLORS.pink, fontSize: 20, maxWidth: 400, textAlign: "right", letterSpacing: "0.1em" }}>
            {currentDialogue.proxima}
          </div>
        </div>

        {/* Center separator */}
        <div style={{
          position: "absolute", bottom: 90,
          left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.2)",
          fontFamily: "monospace", fontSize: 18, letterSpacing: "0.3em",
        }}>
          ···
        </div>
      </div>
    </AbsoluteFill>
  );
};
