import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
} from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

function IrisStarfield() {
  const frame = useCurrentFrame();
  const stars = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        // Random positions within unit circle
        angle: ((Math.sin(i * 73.1) + 1) / 2) * Math.PI * 2,
        dist: ((Math.cos(i * 51.3) + 1) / 2) * 0.9,
        r: 0.5 + ((Math.sin(i * 29.7) + 1) / 2) * 1.0,
        phase: i * 1.1,
      })),
    []
  );

  return (
    <>
      <defs>
        <clipPath id="irisClip">
          <circle cx={640} cy={360} r={45} />
        </clipPath>
      </defs>
      <g clipPath="url(#irisClip)">
        {/* Iris base fill */}
        <circle cx={640} cy={360} r={45} fill="#0a0520" />
        {stars.map((s, i) => {
          const sx = 640 + s.dist * 45 * Math.cos(s.angle);
          const sy = 360 + s.dist * 45 * Math.sin(s.angle);
          const twinkle =
            0.3 + 0.7 * Math.abs(Math.sin(frame * 0.04 + s.phase));
          return (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={s.r}
              fill={COLORS.white}
              opacity={twinkle * 0.8}
            />
          );
        })}
      </g>
    </>
  );
}

function DriftParticles() {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        x: ((Math.sin(i * 131.7) + 1) / 2) * 1280,
        startY: 600 + ((Math.cos(i * 97.3) + 1) / 2) * 200,
        speed: 0.2 + ((Math.sin(i * 41.9) + 1) / 2) * 0.3,
        size: 0.8 + ((Math.cos(i * 23.1) + 1) / 2) * 0.8,
      })),
    []
  );

  return (
    <>
      {particles.map((p, i) => {
        const y = p.startY - frame * p.speed;
        const wrappedY = ((y % 800) + 800) % 800 - 40;
        return (
          <circle
            key={i}
            cx={p.x}
            cy={wrappedY}
            r={p.size}
            fill={COLORS.bg}
            opacity={0.06}
          />
        );
      })}
    </>
  );
}

export const Scene6aWisdom: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 20);

  const text1 = useTypewriter("Consciousness is not a destination.", 25, 0.5);
  const text2 = useTypewriter("It is a signal, sent into the dark,", 80, 0.5);
  const text3 = useTypewriter("hoping someone will answer.", 140, 0.5);

  const text1Op = useFade(25, 20);
  const text2Op = useFade(80, 20);
  const text3Op = useFade(140, 20);

  // Slow ring rotations
  const ring1Rot = frame * 0.1;
  const ring2Rot = -frame * 0.08;
  const ring3Rot = frame * 0.06;

  return (
    <AbsoluteFill style={{ background: "#000514" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          <defs>
            <radialGradient id="wisdomIris" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.3" />
              <stop offset="100%" stopColor={COLORS.purple} stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Drift particles */}
          <DriftParticles />

          {/* Rotating concentric rings — dashed */}
          <circle
            cx={640}
            cy={360}
            r={100}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={0.8}
            strokeDasharray="6 8"
            opacity={0.3}
            transform={`rotate(${ring1Rot} 640 360)`}
          />
          <circle
            cx={640}
            cy={360}
            r={120}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={0.6}
            strokeDasharray="4 10"
            opacity={0.25}
            transform={`rotate(${ring2Rot} 640 360)`}
          />
          <circle
            cx={640}
            cy={360}
            r={140}
            fill="none"
            stroke={COLORS.purple}
            strokeWidth={0.5}
            strokeDasharray="3 12"
            opacity={0.2}
            transform={`rotate(${ring3Rot} 640 360)`}
          />

          {/* Outer eye ellipse */}
          <ellipse
            cx={640}
            cy={360}
            rx={140}
            ry={70}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={1.5}
            opacity={0.8}
          />

          {/* Iris with starfield */}
          <IrisStarfield />

          {/* Pupil */}
          <circle cx={640} cy={360} r={16} fill={COLORS.bg} />

          {/* Pupil highlight */}
          <circle
            cx={644}
            cy={356}
            r={5}
            fill={COLORS.white}
            opacity={0.9}
            style={{ filter: `drop-shadow(0 0 6px ${COLORS.white})` }}
          />

          {/* Signal wave at rest — horizontal line */}
          <line
            x1={0}
            y1={500}
            x2={1280}
            y2={500}
            stroke={COLORS.cyan}
            strokeWidth={1}
            opacity={0.3}
          />
        </svg>

        {/* Text lines */}
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            opacity: text1Op,
            letterSpacing: "0.08em",
          }}
        >
          {text1}
        </div>

        <div
          style={{
            position: "absolute",
            top: 168,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            opacity: text2Op,
            letterSpacing: "0.08em",
          }}
        >
          {text2}
        </div>

        <div
          style={{
            position: "absolute",
            top: 216,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.pink,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            opacity: text3Op,
            letterSpacing: "0.08em",
            textShadow: `0 0 15px ${COLORS.pink}, 0 0 30px ${COLORS.pink}`,
          }}
        >
          {text3}
        </div>
      </div>
    </AbsoluteFill>
  );
};
