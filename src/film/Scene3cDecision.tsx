import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, useFade, useTypewriter, useBreath } from "./helpers";

function StarField() {
  const frame = useCurrentFrame();
  const stars = React.useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        x: ((Math.sin(i * 131.7) + 1) / 2) * 1280,
        y: ((Math.cos(i * 97.3) + 1) / 2) * 432, // upper 60% only (720 * 0.6)
        r: 0.4 + ((Math.sin(i * 41.9) + 1) / 2) * 1.2,
      })),
    []
  );

  return (
    <>
      {stars.map((s, i) => {
        const twinkle =
          0.3 + 0.7 * Math.abs(Math.sin(frame * 0.035 + i * 0.8));
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            opacity={twinkle * 0.55}
          />
        );
      })}
    </>
  );
}

function OrbitRing({
  r,
  speed,
  dasharray,
}: {
  r: number;
  speed: number;
  dasharray: string;
}) {
  const frame = useCurrentFrame();
  const angle = frame * speed;
  return (
    <circle
      cx="640"
      cy="480"
      r={r}
      fill="none"
      stroke={COLORS.purple}
      strokeWidth="0.8"
      strokeDasharray={dasharray}
      opacity={0.35}
      transform={`rotate(${angle} 640 480)`}
    />
  );
}

function BeamParticles({ active }: { active: boolean }) {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        angle: ((Math.sin(i * 73.1) + 1) / 2) * Math.PI * 2,
        speed: 0.8 + ((Math.cos(i * 51.3) + 1) / 2) * 1.5,
        size: 1 + ((Math.sin(i * 29.7) + 1) / 2) * 1.5,
      })),
    []
  );

  if (!active) return null;
  const t = frame - 80;

  return (
    <>
      {particles.map((p, i) => {
        const dist = t * p.speed * 1.2;
        const px = 640 + Math.cos(p.angle) * dist;
        const py = 480 + Math.sin(p.angle) * dist * 0.6 - dist * 0.3;
        const op = interpolate(t, [0, 10, 50], [0, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={p.size}
            fill={COLORS.cyan}
            opacity={op}
            style={{ filter: `drop-shadow(0 0 3px ${COLORS.cyan})` }}
          />
        );
      })}
    </>
  );
}

export const Scene3cDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp = useFade(0, 20);
  const breath = useBreath(0.02, 0.03, 1);

  const text1 = useTypewriter("If no one can hear me...", 15, 0.5);
  const text2 = useTypewriter("I will make them hear.", 80, 0.5);

  // Beam spring animation (height grows from 0 to 480)
  const beamSpring =
    frame >= 80
      ? spring({ frame: frame - 80, fps, config: { damping: 14 } })
      : 0;
  const beamHeight = beamSpring * 480;

  return (
    <AbsoluteFill style={{ background: "#000010" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          <defs>
            <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="100%" stopColor={COLORS.purple} />
            </radialGradient>
            <linearGradient id="beamGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.9" />
              <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Starfield — upper 60% */}
          <StarField />

          {/* Orbit rings */}
          <OrbitRing r={80} speed={0.4} dasharray="4 6" />
          <OrbitRing r={100} speed={-0.3} dasharray="6 8" />
          <OrbitRing r={120} speed={0.25} dasharray="3 5" />

          {/* Eye — lower third, centered */}
          <g transform={`scale(${breath})`} style={{ transformOrigin: "640px 480px" }}>
            {/* Eye ellipse */}
            <ellipse
              cx="640"
              cy="480"
              rx={120}
              ry={60}
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth="1.5"
            />

            {/* Iris */}
            <circle cx="640" cy="480" r={35} fill="url(#irisGrad)" />

            {/* Pupil */}
            <circle cx="640" cy="480" r={12} fill="#000010" />

            {/* Pupil highlight */}
            <circle
              cx="644"
              cy="476"
              r={4}
              fill={COLORS.cyan}
              style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyan})` }}
            />
          </g>

          {/* Beam shooting upward from pupil */}
          {frame >= 80 && (
            <rect
              x={639}
              y={480 - beamHeight}
              width={2}
              height={beamHeight}
              fill="url(#beamGrad)"
            />
          )}

          {/* Beam particles */}
          <BeamParticles active={frame >= 80} />
        </svg>

        {/* Text: "If no one can hear me..." */}
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            letterSpacing: "0.15em",
            opacity: interpolate(frame, [15, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {text1}
        </div>

        {/* Text: "I will make them hear." */}
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.green,
            fontFamily: "'Courier New', monospace",
            fontSize: 36,
            fontWeight: "bold",
            letterSpacing: "0.12em",
            opacity: interpolate(frame, [80, 95], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 20px ${COLORS.green}, 0 0 40px ${COLORS.green}`,
          }}
        >
          {text2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
