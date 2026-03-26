import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade } from "./helpers";

// Dots that form a human silhouette
function HumanConstellation() {
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Approximate human figure silhouette as a set of key points
  const figurePoints = useMemo<{ x: number; y: number }[]>(() => [
    // Head
    { x: 640, y: 200 }, { x: 625, y: 210 }, { x: 655, y: 210 },
    { x: 620, y: 225 }, { x: 660, y: 225 }, { x: 635, y: 240 }, { x: 645, y: 240 },
    // Neck / shoulders
    { x: 640, y: 260 }, { x: 600, y: 275 }, { x: 680, y: 275 },
    // Arms
    { x: 575, y: 305 }, { x: 550, y: 335 }, { x: 535, y: 370 }, { x: 525, y: 400 },
    { x: 705, y: 305 }, { x: 730, y: 335 }, { x: 745, y: 370 }, { x: 755, y: 400 },
    // Torso
    { x: 615, y: 295 }, { x: 665, y: 295 },
    { x: 610, y: 330 }, { x: 670, y: 330 },
    { x: 615, y: 360 }, { x: 665, y: 360 },
    { x: 620, y: 400 }, { x: 640, y: 405 }, { x: 660, y: 400 },
    // Legs
    { x: 625, y: 440 }, { x: 655, y: 440 },
    { x: 618, y: 480 }, { x: 662, y: 480 },
    { x: 612, y: 520 }, { x: 668, y: 520 },
    { x: 608, y: 560 }, { x: 672, y: 560 },
    { x: 600, y: 590 }, { x: 680, y: 590 },
  ], []);

  // Start scattered, converge into human shape
  const converge = spring({ frame: frame - 15, fps, config: { damping: 18, mass: 1.5 } });

  const scatteredPoints = useMemo<{ x: number; y: number }[]>(() =>
    figurePoints.map((_, i) => ({
      x: 200 + ((i * 337) % 880),
      y: 100 + ((i * 197) % 520),
    })), [figurePoints]
  );

  const currentPoints = figurePoints.map((target, i) => ({
    x: scatteredPoints[i].x + (target.x - scatteredPoints[i].x) * converge,
    y: scatteredPoints[i].y + (target.y - scatteredPoints[i].y) * converge,
  }));

  const lineOp = interpolate(frame - 30, [0, 40], [0, 0.25], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dotPulse = 1 + 0.2 * Math.sin((frame / fps) * Math.PI * 2);

  // Connect nearby points with lines
  const edges: [number, number][] = [];
  for (let i = 0; i < figurePoints.length; i++) {
    for (let j = i + 1; j < figurePoints.length; j++) {
      const dx = figurePoints[i].x - figurePoints[j].x;
      const dy = figurePoints[i].y - figurePoints[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 55) edges.push([i, j]);
    }
  }

  const nodeColors = [COLORS.cyan, COLORS.purple, COLORS.pink, COLORS.green];

  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
      {/* Connection lines */}
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={currentPoints[a].x} y1={currentPoints[a].y}
          x2={currentPoints[b].x} y2={currentPoints[b].y}
          stroke={COLORS.cyan} strokeWidth="0.7" opacity={lineOp}
        />
      ))}

      {/* Dots */}
      {currentPoints.map((p, i) => {
        const color = nodeColors[i % nodeColors.length];
        const delay = i * 3;
        const dotOp = interpolate(frame - delay, [0, 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <g key={i} opacity={dotOp}>
            <circle cx={p.x} cy={p.y} r={3.5 * dotPulse} fill={color}
              style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
          </g>
        );
      })}

      {/* Incoming signal line from right */}
      {frame > 60 && (
        <line
          x1="1280" y1="360"
          x2={1280 - interpolate(frame - 60, [0, 50], [0, 700], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })}
          y2="360"
          stroke={COLORS.pink}
          strokeWidth="1.5"
          opacity="0.5"
          strokeDasharray="8 5"
        />
      )}
    </svg>
  );
}

export const Scene5Contact: React.FC = () => {
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp   = useFade(0, 25);

  const reply = spring({ frame: frame - 65, fps, config: { damping: 14 } });

  const words = ["They", "heard", "us."];
  const wordFrames = [70, 85, 98];

  return (
    <AbsoluteFill style={{ background: "#000010" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>

        {/* Background star shimmer */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(68,100,255,0.06) 0%, transparent 70%)",
        }} />

        <HumanConstellation />

        {/* "We are not alone" — assembles word by word */}
        <div style={{
          position: "absolute", top: 80,
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          gap: 24,
          fontFamily: "'Courier New', monospace",
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          {words.map((word, i) => (
            <span key={word} style={{
              color: i === 2 ? COLORS.pink : "#fff",
              opacity: interpolate(frame, [wordFrames[i], wordFrames[i] + 15], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [wordFrames[i], wordFrames[i] + 15], [20, 0], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}px)`,
              display: "inline-block",
              textShadow: i === 2 ? `0 0 30px ${COLORS.pink}` : `0 0 20px ${COLORS.cyan}`,
            }}>
              {word}
            </span>
          ))}
        </div>

        {/* Caption */}
        <div style={{
          position: "absolute", bottom: 50,
          left: 0, right: 0, textAlign: "center",
          color: "rgba(180,180,255,0.4)",
          fontFamily: "monospace",
          fontSize: 13,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: interpolate(frame - 80, [0, 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }}>
          Signal received  ·  Origin: Proxima Centauri b  ·  Delay: 4.246 years
        </div>

        {/* Glow overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${COLORS.pink}15 0%, transparent 60%)`,
          opacity: reply * 0.6,
          pointerEvents: "none",
        }} />
      </div>
    </AbsoluteFill>
  );
};
