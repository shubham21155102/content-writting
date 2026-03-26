import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "./helpers";

export const Scene0Genesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A single point of light grows from nothing
  const coreS   = spring({ frame: frame - 20, fps, config: { damping: 20, mass: 2 } });
  const coreR   = interpolate(coreS, [0, 1], [0, 3]);
  const glowR   = interpolate(coreS, [0, 1], [0, 80]);
  const glowOp  = interpolate(frame, [20, 50, 80], [0, 0.18, 0.05], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Particles drift outward from the core
  const particles = React.useMemo(() =>
    Array.from({ length: 28 }, (_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const speed = 0.4 + ((i * 37) % 10) / 10 * 0.6;
      return { angle, speed, size: 0.5 + ((i * 19) % 8) / 8 };
    }), []
  );

  const particleProgress = spring({ frame: frame - 30, fps, config: { damping: 25 } });

  // Fade to white flash at end (transition into boot)
  const flashOp = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Text: "In the beginning..."
  const textOp = interpolate(frame, [10, 25, 60, 72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const CX = 640, CY = 360;

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
        {/* Ambient glow */}
        <radialGradient id="genesis-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={COLORS.purple} stopOpacity={glowOp * 3} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <circle cx={CX} cy={CY} r={glowR * 4} fill={`url(#genesis-glow)`} />

        {/* Outward particles */}
        {particles.map((p, i) => {
          const dist = particleProgress * 200 * p.speed;
          const x = CX + Math.cos(p.angle) * dist;
          const y = CY + Math.sin(p.angle) * dist;
          const op = interpolate(particleProgress, [0, 0.3, 1], [0, 0.8, 0]);
          return (
            <circle key={i} cx={x} cy={y} r={p.size} fill={COLORS.purple} opacity={op} />
          );
        })}

        {/* Core star */}
        {coreR > 0 && (
          <>
            <circle cx={CX} cy={CY} r={glowR} fill="none"
              stroke={COLORS.purple} strokeWidth="0.5" opacity={glowOp * 2} />
            <circle cx={CX} cy={CY} r={coreR} fill="#ffffff"
              style={{ filter: `drop-shadow(0 0 ${8 * coreS}px ${COLORS.cyan})` }} />
          </>
        )}
      </svg>

      {/* Text */}
      <div style={{
        position: "absolute", bottom: 160,
        left: 0, right: 0, textAlign: "center",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "monospace", fontSize: 15,
        letterSpacing: "0.5em", textTransform: "uppercase",
        opacity: textOp,
      }}>
        In the beginning, there was darkness.
      </div>

      {/* White flash out */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#ffffff",
        opacity: flashOp,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
