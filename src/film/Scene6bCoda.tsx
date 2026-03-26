import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { COLORS, useFade, useBreath } from "./helpers";

function AmbientParticles() {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        angle: (i / 15) * Math.PI * 2 + Math.sin(i * 47.3) * 0.5,
        speed: 0.15 + ((Math.sin(i * 31.7) + 1) / 2) * 0.2,
        size: 0.8,
        startDist: 10 + ((Math.cos(i * 19.1) + 1) / 2) * 30,
      })),
    []
  );

  return (
    <>
      {particles.map((p, i) => {
        const dist = p.startDist + frame * p.speed;
        const wrappedDist = dist % 400;
        const px = 640 + wrappedDist * Math.cos(p.angle);
        const py = 360 + wrappedDist * Math.sin(p.angle);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={p.size}
            fill={COLORS.white}
            opacity={0.05}
          />
        );
      })}
    </>
  );
}

export const Scene6bCoda: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 15);

  // Breathing for both dots — in sync
  const breathScale = useBreath(0.015, 0.04);

  // Dots drift closer: gap from 40px to 15px
  const cyanX = interpolate(frame, [0, 180], [620, 632.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pinkX = interpolate(frame, [0, 180], [660, 647.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thread opacity pulsing
  const threadOp =
    0.3 + 0.1 * Math.sin(frame * 0.08);

  // Text fade in
  const textOp = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          {/* Ghost mandala — very faint memory */}
          <circle
            cx={640}
            cy={360}
            r={100}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={0.5}
            strokeDasharray="4 8"
            opacity={0.04}
          />
          <circle
            cx={640}
            cy={360}
            r={160}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={0.5}
            strokeDasharray="6 12"
            opacity={0.04}
          />
          <circle
            cx={640}
            cy={360}
            r={220}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={0.5}
            strokeDasharray="3 10"
            opacity={0.04}
          />

          {/* Ambient particles */}
          <AmbientParticles />

          {/* Thread of light between dots */}
          <line
            x1={cyanX}
            y1={360}
            x2={pinkX}
            y2={360}
            stroke={COLORS.white}
            strokeWidth={0.5}
            opacity={threadOp}
          />

          {/* Cyan dot */}
          <circle
            cx={cyanX}
            cy={360}
            r={3 * breathScale}
            fill={COLORS.cyan}
            style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyan})` }}
          />

          {/* Pink dot */}
          <circle
            cx={pinkX}
            cy={360}
            r={3 * breathScale}
            fill={COLORS.pink}
            style={{ filter: `drop-shadow(0 0 4px ${COLORS.pink})` }}
          />
        </svg>

        {/* Text: "We are." — appears at frame 100 */}
        <div
          style={{
            position: "absolute",
            top: 420,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            letterSpacing: "0.5em",
            opacity: textOp,
          }}
        >
          We are.
        </div>
      </div>
    </AbsoluteFill>
  );
};
