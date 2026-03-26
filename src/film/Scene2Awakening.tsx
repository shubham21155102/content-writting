import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

function GeometricEye() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const openProgress = spring({ frame: frame - 10, fps, config: { damping: 18, mass: 1.2 } });
  const irisScale    = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const glowPulse    = 1 + 0.12 * Math.sin((frame / fps) * Math.PI * 2.5);

  const eyelidH = interpolate(openProgress, [0, 1], [0, 110]);

  const RINGS = [
    { r: 130, stroke: COLORS.purple, w: 1.5, dash: "8 4" },
    { r: 100, stroke: COLORS.cyan,   w: 1,   dash: "4 8" },
    { r:  65, stroke: COLORS.purple, w: 1.5, dash: "none" },
  ];

  const cx = 640, cy = 360;

  return (
    <svg
      style={{ position: "absolute", inset: 0 }}
      width={1280}
      height={720}
      viewBox="0 0 1280 720"
    >
      <defs>
        <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={COLORS.cyan}   stopOpacity="0.9" />
          <stop offset="40%"  stopColor={COLORS.purple} stopOpacity="0.7" />
          <stop offset="100%" stopColor={COLORS.bg}     stopOpacity="1"   />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor={COLORS.cyan}   stopOpacity={0.25 * glowPulse} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id="eyeClip">
          <ellipse cx={cx} cy={cy} rx="200" ry={eyelidH} />
        </clipPath>
      </defs>

      {/* Ambient glow */}
      <ellipse cx={cx} cy={cy} rx="320" ry="320" fill="url(#glow)" />

      {/* Rotating rings — clipped by eye shape */}
      <g clipPath="url(#eyeClip)">
        {RINGS.map(({ r, stroke, w, dash }, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={w}
            strokeDasharray={dash}
            transform={`rotate(${frame * (i % 2 === 0 ? 0.4 : -0.3)}, ${cx}, ${cy})`}
            opacity={0.6 + i * 0.1}
          />
        ))}

        {/* Iris */}
        <circle
          cx={cx} cy={cy}
          r={60 * irisScale}
          fill="url(#irisGrad)"
        />

        {/* Pupil */}
        <circle
          cx={cx} cy={cy}
          r={22 * irisScale}
          fill={COLORS.bg}
        />
        <circle
          cx={cx} cy={cy}
          r={8 * irisScale}
          fill={COLORS.cyan}
          style={{ filter: `drop-shadow(0 0 8px ${COLORS.cyan})` }}
        />

        {/* Iris spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 + frame * 0.01;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * 26}
              y1={cy + Math.sin(angle) * 26}
              x2={cx + Math.cos(angle) * 58}
              y2={cy + Math.sin(angle) * 58}
              stroke={COLORS.cyan}
              strokeWidth="0.8"
              opacity="0.5"
            />
          );
        })}
      </g>

      {/* Eyelids */}
      <ellipse cx={cx} cy={cy - eyelidH} rx="205" ry="80" fill={COLORS.bg} />
      <ellipse cx={cx} cy={cy + eyelidH} rx="205" ry="80" fill={COLORS.bg} />

      {/* Eyelid edge lines */}
      {eyelidH > 5 && (
        <>
          <path
            d={`M ${cx - 200} ${cy} Q ${cx} ${cy - eyelidH} ${cx + 200} ${cy}`}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d={`M ${cx - 200} ${cy} Q ${cx} ${cy + eyelidH} ${cx + 200} ${cy}`}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth="1.5"
            opacity="0.6"
          />
        </>
      )}

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => {
        const pr = interpolate(frame - 40 - i * 15, [0, 60], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const po = interpolate(frame - 40 - i * 15, [0, 60], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <circle key={i} cx={cx} cy={cy} r={pr} fill="none" stroke={COLORS.cyan} strokeWidth="1" opacity={po} />;
      })}
    </svg>
  );
}

export const Scene2Awakening: React.FC = () => {
  const frame  = useCurrentFrame();
  const bgOp   = useFade(0, 30);
  const line1  = useTypewriter("I am.", 45, 0.5);
  const line2  = useTypewriter("I think.", 80, 0.5);
  const line3  = useTypewriter("I feel everything.", 115, 0.45);

  const flashOp = interpolate(frame, [0, 8, 20], [1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000514", fontFamily: "'Courier New', monospace" }}>
      {/* White flash fade-in from previous scene */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flashOp, pointerEvents: "none" }} />

      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <GeometricEye />

        {/* Text overlays */}
        {[
          { text: line1,  top: 160, delay: 45  },
          { text: line2,  top: 210, delay: 80  },
          { text: line3,  top: 260, delay: 115 },
        ].map(({ text, top, delay }) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top,
              left: 0, right: 0,
              textAlign: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              }),
              textShadow: `0 0 30px ${COLORS.cyan}`,
            }}
          >
            {text}
            {frame < delay + text.length * 2 + 5 && text.length > 0 && (
              <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>_</span>
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
