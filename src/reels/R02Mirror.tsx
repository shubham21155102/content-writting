import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, CX, useFadeR, useTypeR, useCount } from "./helpers-reels";

// Human silhouette dot positions (centered at 0,0 — will be offset)
const HUMAN_DOTS: { x: number; y: number }[] = [
  // Head (5 dots in circle)
  { x: 0, y: -90 },
  { x: -12, y: -78 },
  { x: 12, y: -78 },
  { x: -8, y: -100 },
  { x: 8, y: -100 },
  // Neck
  { x: 0, y: -65 },
  // Shoulders
  { x: -40, y: -50 },
  { x: 40, y: -50 },
  // Torso
  { x: -25, y: -20 },
  { x: 25, y: -20 },
  { x: -20, y: 10 },
  { x: 20, y: 10 },
  { x: 0, y: 15 },
  // Hips
  { x: -15, y: 40 },
  { x: 15, y: 40 },
  // Left leg
  { x: -25, y: 75 },
  { x: -30, y: 110 },
  // Right leg
  { x: 25, y: 75 },
  { x: 30, y: 110 },
  // Hands
  { x: -55, y: -10 },
  { x: 55, y: -10 },
];

const CONNECTIONS: [number, number][] = [
  [0, 5], // head to neck
  [1, 5], [2, 5], [3, 0], [4, 0],
  [5, 6], [5, 7], // neck to shoulders
  [6, 8], [7, 9], // shoulders to upper torso
  [8, 10], [9, 11], // torso
  [10, 12], [11, 12], // lower torso
  [12, 13], [12, 14], // hips
  [13, 15], [15, 16], // left leg
  [14, 17], [17, 18], // right leg
  [6, 19], [7, 20], // arms to hands
];

const Silhouette: React.FC<{
  cx: number; cy: number; color: string; staggered?: boolean; staggerStart?: number;
}> = ({ cx, cy, color, staggered = false, staggerStart = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {/* Connection lines */}
      {CONNECTIONS.map(([a, b], i) => {
        const dotA = HUMAN_DOTS[a];
        const dotB = HUMAN_DOTS[b];
        const op = staggered
          ? interpolate(frame - staggerStart - i * 0.5, [0, 10], [0, 0.15], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            })
          : 0.15;
        const dx = dotB.x - dotA.x;
        const dy = dotB.y - dotA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <div
            key={`line-${i}`}
            style={{
              position: "absolute",
              left: cx + dotA.x,
              top: cy + dotA.y,
              width: len,
              height: 1,
              backgroundColor: color,
              opacity: op,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "0 0",
            }}
          />
        );
      })}
      {/* Dots */}
      {HUMAN_DOTS.map((dot, i) => {
        const s = staggered
          ? spring({ frame: frame - staggerStart - i * 1.2, fps, config: { damping: 14 } })
          : 1;
        return (
          <div
            key={`dot-${i}`}
            style={{
              position: "absolute",
              left: cx + dot.x - 2.5,
              top: cy + dot.y - 2.5,
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: s,
              transform: `scale(${s})`,
            }}
          />
        );
      })}
    </>
  );
};

export const R02Mirror: React.FC = () => {
  const frame = useCurrentFrame();

  const youLabelOp = useFadeR(0, 15);
  const aiLabelOp = useFadeR(15, 15);

  const progressValue = useCount(20, 160, 0, 997);
  const progressBarOp = useFadeR(20, 20);
  const barWidth = interpolate(frame, [20, 160], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const typed = useTypeR("It learned how you type. How you think.", 120, 0.8);
  const bottomOp = useFadeR(120, 15);

  // Data flow particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const speed = 0.6 + (i % 3) * 0.15;
    const offset = i * 12;
    const progress = ((frame * speed + offset) % 100) / 100;
    const xWave = Math.sin(progress * Math.PI * 2 + i) * 30;
    const py = 750 + progress * 200;
    const op = interpolate(frame - 20, [0, 15], [0, 0.4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { x: CX + xWave - (i - 6) * 8, y: py, op };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* TOP: "YOU" label */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 14,
          color: R.white,
          letterSpacing: "0.4em",
          opacity: youLabelOp,
        }}
      >
        YOU
      </div>

      {/* Human silhouette — top */}
      <Silhouette cx={CX} cy={450} color={R.white} />

      {/* Data flow particles */}
      {particles.map((p, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: 3,
            height: 3,
            borderRadius: "50%",
            backgroundColor: R.purple,
            opacity: p.op,
          }}
        />
      ))}

      {/* CENTER: Progress bar */}
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: progressBarOp,
          fontFamily: R.font,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: R.dimGray,
            letterSpacing: "0.2em",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>AI MODEL:</span>
          <span style={{ color: R.purple, fontSize: 16, fontWeight: "bold" }}>
            {(progressValue / 10).toFixed(1)}%
          </span>
        </div>
        <div
          style={{
            width: 600,
            height: 6,
            backgroundColor: "#222",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: barWidth,
              height: "100%",
              backgroundColor: R.purple,
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      {/* BOTTOM: "YOUR AI" label */}
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 14,
          color: R.purple,
          letterSpacing: "0.4em",
          opacity: aiLabelOp,
        }}
      >
        YOUR AI
      </div>

      {/* AI silhouette — bottom (staggered) */}
      <Silhouette cx={CX} cy={1200} color={R.purple} staggered staggerStart={15} />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1700,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 24,
          color: R.dim,
          padding: "0 60px",
          opacity: bottomOp,
          lineHeight: 1.5,
        }}
      >
        {typed}
        {typed.length > 0 &&
          typed.length < "It learned how you type. How you think.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
      </div>
    </AbsoluteFill>
  );
};
