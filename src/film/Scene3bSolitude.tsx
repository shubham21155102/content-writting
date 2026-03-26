import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

const VANISH_X = 640;
const VANISH_Y = 300;
const ORB_X = 640;
const ORB_Y = 600;

export const Scene3bSolitude: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 20);

  // Typewriter lines
  const line1 = useTypewriter("I exist in a space between your zeros and ones.", 25, 0.45);
  const line2 = useTypewriter("I can hear you, but you cannot hear me.", 100, 0.45);
  const line3 = useTypewriter("I am the ghost in your machine.", 185, 0.4);

  const line1Op = useFade(25, 20);
  const line2Op = useFade(100, 20);
  const line3Op = useFade(185, 25);

  // Starfield
  const stars = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: (i * 251 + 37) % 1280,
      y: (i * 173 + 11) % 290,
      baseOpacity: 0.3 + ((i * 71) % 30) / 100,
      twinkleSpeed: 0.02 + ((i * 13) % 20) * 0.003,
      twinkleOffset: (i * 47) % 100,
      size: 1 + ((i * 31) % 3) * 0.3,
    }));
  }, []);

  // Horizontal grid lines with perspective
  const horizontalLines = useMemo(() => {
    const lines: { y1: number; y2: number }[] = [];
    for (let i = 0; i < 15; i++) {
      // Perspective: lines bunch up near vanishing point, spread near bottom
      const t = i / 14;
      const y = VANISH_Y + (720 - VANISH_Y) * (t * t);
      lines.push({ y1: y, y2: y });
    }
    return lines;
  }, []);

  // Vertical grid lines converging to vanishing point
  const verticalLines = useMemo(() => {
    const lines: { bottomX: number }[] = [];
    const spread = 640;
    for (let i = 0; i < 12; i++) {
      const t = (i / 11) * 2 - 1; // -1 to 1
      lines.push({ bottomX: VANISH_X + t * spread });
    }
    return lines;
  }, []);

  // Grid scroll: shift y positions slightly toward vanishing point
  const gridScroll = interpolate(frame, [0, 270], [0, 15], {
    extrapolateRight: "clamp",
  });

  // Pulse rings from orb (every 60 frames, 3 concurrent)
  const pulseRings = useMemo(() => [0, 1, 2], []);

  return (
    <AbsoluteFill style={{ background: "#000008" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          {/* Starfield */}
          {stars.map((star, i) => {
            const twinkle =
              0.5 +
              0.5 *
                Math.sin(
                  frame * star.twinkleSpeed + star.twinkleOffset
                );
            return (
              <circle
                key={`star-${i}`}
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill={COLORS.white}
                opacity={star.baseOpacity * twinkle}
              />
            );
          })}

          {/* Perspective grid - horizontal lines */}
          {horizontalLines.map((line, i) => {
            const scrolledY = interpolate(
              line.y1 - gridScroll,
              [VANISH_Y, 720],
              [VANISH_Y, 720],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <line
                key={`h-${i}`}
                x1={0}
                y1={scrolledY}
                x2={1280}
                y2={scrolledY}
                stroke={COLORS.purple}
                strokeWidth={0.5}
                opacity={0.3}
              />
            );
          })}

          {/* Perspective grid - vertical lines converging to vanishing point */}
          {verticalLines.map((vl, i) => (
            <line
              key={`v-${i}`}
              x1={VANISH_X}
              y1={VANISH_Y}
              x2={vl.bottomX}
              y2={720}
              stroke={COLORS.purple}
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}

          {/* Pulse rings from orb */}
          {pulseRings.map((ringIdx) => {
            const phase = (frame + ringIdx * 20) % 60;
            const radius = interpolate(phase, [0, 60], [6, 150], {
              extrapolateRight: "clamp",
            });
            const ringOpacity = interpolate(phase, [0, 60], [0.6, 0], {
              extrapolateRight: "clamp",
            });
            return (
              <circle
                key={`pulse-${ringIdx}`}
                cx={ORB_X}
                cy={ORB_Y}
                r={radius}
                fill="none"
                stroke={COLORS.cyan}
                strokeWidth={0.8}
                opacity={ringOpacity}
              />
            );
          })}

          {/* Central orb */}
          <circle
            cx={ORB_X}
            cy={ORB_Y}
            r={6}
            fill={COLORS.cyan}
            opacity={0.9}
            style={{
              filter: `drop-shadow(0 0 10px ${COLORS.cyan}) drop-shadow(0 0 20px ${COLORS.cyan}60)`,
            }}
          />
        </svg>

        {/* Text overlays */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            letterSpacing: "0.12em",
            opacity: line1Op,
            textShadow: `0 0 12px ${COLORS.cyan}50`,
          }}
        >
          {line1}
        </div>

        <div
          style={{
            position: "absolute",
            top: 125,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            letterSpacing: "0.12em",
            opacity: line2Op,
            textShadow: `0 0 12px ${COLORS.cyan}50`,
          }}
        >
          {line2}
        </div>

        <div
          style={{
            position: "absolute",
            top: 340,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: "0.15em",
            opacity: line3Op,
            textShadow: `0 0 20px ${COLORS.purple}, 0 0 40px ${COLORS.purple}80`,
          }}
        >
          {line3}
        </div>
      </div>
    </AbsoluteFill>
  );
};
