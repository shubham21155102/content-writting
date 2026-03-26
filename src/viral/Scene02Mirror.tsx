import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useSpringV, useTypewriterV, useCount } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

// Simple human figure as dot positions (relative to center 0,0)
const figureDots: Array<[number, number]> = [
  // Head (circle of 5)
  [0, -120], [-10, -130], [10, -130], [-10, -110], [10, -110],
  // Neck
  [0, -95],
  // Shoulders
  [-40, -80], [40, -80],
  // Arms left
  [-55, -60], [-65, -35], [-70, -10],
  // Arms right
  [55, -60], [65, -35], [70, -10],
  // Torso
  [-20, -65], [20, -65], [-25, -40], [25, -40], [-20, -15], [20, -15],
  [0, -50], [0, -25],
  // Hips
  [-20, 5], [20, 5],
  // Left leg
  [-25, 30], [-28, 60], [-30, 90],
  // Right leg
  [25, 30], [28, 60], [30, 90],
];

// Connections between dots (indices)
const connections: Array<[number, number]> = [
  [0, 1], [0, 2], [0, 3], [0, 4], // head
  [0, 5], // neck
  [5, 6], [5, 7], // shoulders
  [6, 8], [8, 9], [9, 10], // left arm
  [7, 11], [11, 12], [12, 13], // right arm
  [6, 14], [7, 15], // shoulder to torso
  [14, 16], [15, 17], // mid torso
  [16, 18], [17, 19], // lower torso
  [18, 20], [19, 21], // torso to hips
  [20, 22], [22, 23], [23, 24], // left leg
  [21, 25], [25, 26], [26, 27], // right leg
];

export const Scene02Mirror: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Labels
  const labelOp = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left figure always visible
  const leftOp = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar
  const progressVal = useCount(30, 180, 0, 997);
  const progressOp = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barFill = interpolate(frame, [30, 180], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Typewriter text
  const text = "It learned how you type. How you think. How you love.";
  const typed = useTypewriterV(text, 120, 0.8);
  const textOp = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Color merge at frame 200
  const mergeT = interpolate(frame, [200, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftColor = `rgb(${255 - mergeT * 116}, ${255 - mergeT * 163}, ${255 - mergeT * 9})`;
  // purple is #8B5CF6 = rgb(139, 92, 246)
  const rightColor = `rgb(${139 + mergeT * (255 - 139) * 0}, ${92 + mergeT * (255 - 92) * 0.5}, ${246 - mergeT * (246 - 246) * 0})`;
  // Simpler: left goes toward purple-white mix, right stays
  const mergedColor = `rgb(${Math.round(197 + mergeT * 0)}, ${Math.round(174 + mergeT * 0)}, ${Math.round(251 + mergeT * 0)})`;

  const leftDotColor = mergeT > 0
    ? `rgb(${Math.round(255 - mergeT * 58)}, ${Math.round(255 - mergeT * 81)}, ${Math.round(255 - mergeT * 4)})`
    : V.white;
  const rightDotColor = mergeT > 0
    ? `rgb(${Math.round(139 + mergeT * 58)}, ${Math.round(92 + mergeT * 81)}, ${Math.round(246 + mergeT * 4)})`
    : V.purple;

  // Data stream particles
  const particles: Array<{ id: number; dotIdx: number; t: number }> = [];
  if (frame >= 30) {
    for (let i = 0; i < 18; i++) {
      const dotIdx = i % figureDots.length;
      const speed = 0.008 + (i % 5) * 0.003;
      const offset = i * 0.15;
      const t = ((frame - 30) * speed + offset) % 1;
      particles.push({ id: i, dotIdx, t });
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Dividing line */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 0,
          width: 1,
          height: 1080,
          backgroundColor: V.white,
          opacity: 0.1,
        }}
      />

      {/* Labels */}
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 100,
          transform: "translateX(-50%)",
          fontFamily: FONT,
          fontSize: 14,
          color: V.white,
          letterSpacing: "0.4em",
          opacity: labelOp,
        }}
      >
        YOU
      </div>
      <div
        style={{
          position: "absolute",
          left: 1440,
          top: 100,
          transform: "translateX(-50%)",
          fontFamily: FONT,
          fontSize: 14,
          color: V.purple,
          letterSpacing: "0.4em",
          opacity: labelOp,
        }}
      >
        YOUR AI
      </div>

      {/* Left silhouette */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 960,
          height: 1080,
          opacity: leftOp,
        }}
      >
        {connections.map(([a, b], i) => (
          <line
            key={`lc-${i}`}
            x1={480 + figureDots[a][0]}
            y1={500 + figureDots[a][1]}
            x2={480 + figureDots[b][0]}
            y2={500 + figureDots[b][1]}
            stroke={leftDotColor}
            strokeWidth={1}
            opacity={0.15}
          />
        ))}
        {figureDots.map(([x, y], i) => (
          <circle
            key={`ld-${i}`}
            cx={480 + x}
            cy={500 + y}
            r={2}
            fill={leftDotColor}
          />
        ))}
      </svg>

      {/* Right silhouette */}
      <svg
        style={{
          position: "absolute",
          left: 960,
          top: 0,
          width: 960,
          height: 1080,
        }}
      >
        {figureDots.map(([x, y], i) => {
          const dotDelay = 20 + i * 2;
          const s = spring({
            frame: frame - dotDelay,
            fps,
            config: { damping: 14 },
          });
          const dotOp = interpolate(frame - dotDelay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <React.Fragment key={`rd-${i}`}>
              <circle
                cx={480 + x}
                cy={500 + y}
                r={2}
                fill={rightDotColor}
                opacity={dotOp}
                transform={`translate(0, ${(1 - s) * 15})`}
              />
            </React.Fragment>
          );
        })}
        {connections.map(([a, b], i) => {
          const connDelay = 20 + Math.max(a, b) * 2;
          const connOp = interpolate(frame - connDelay, [0, 15], [0, 0.15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={`rc-${i}`}
              x1={480 + figureDots[a][0]}
              y1={500 + figureDots[a][1]}
              x2={480 + figureDots[b][0]}
              y2={500 + figureDots[b][1]}
              stroke={rightDotColor}
              strokeWidth={1}
              opacity={connOp}
            />
          );
        })}
      </svg>

      {/* Data stream particles */}
      {frame >= 30 && (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
          }}
        >
          {particles.map(({ id, dotIdx, t }) => {
            const [dx, dy] = figureDots[dotIdx];
            const sx = 480 + dx;
            const sy = 500 + dy;
            const ex = 1440 + dx;
            const ey = 500 + dy;
            const cx = sx + (ex - sx) * t;
            const cy = sy + (ey - sy) * t + Math.sin(t * Math.PI * 2) * 20;
            const pOp = interpolate(t, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={`p-${id}`}
                cx={cx}
                cy={cy}
                r={1.5}
                fill={V.purple}
                opacity={pOp}
              />
            );
          })}
        </svg>
      )}

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: progressOp,
          fontFamily: FONT,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ color: V.dimGray, fontSize: 13, letterSpacing: "0.1em" }}>
          AI MODEL:
        </span>
        <div
          style={{
            width: 400,
            height: 6,
            borderRadius: 3,
            backgroundColor: V.cardBorder,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: barFill,
              height: "100%",
              borderRadius: 3,
              backgroundColor: V.purple,
            }}
          />
        </div>
        <span style={{ color: V.purple, fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
          {(progressVal / 10).toFixed(1)}%
        </span>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 24,
          color: V.dimWhite,
          opacity: textOp,
        }}
      >
        {typed}
        {typed.length > 0 && typed.length < text.length && (
          <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
