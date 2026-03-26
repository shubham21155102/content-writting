import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { COLORS, useFade, useSpring } from "./helpers";

const HUMAN_DOTS = [
  // Head
  { x: 0, y: -80 },
  { x: -8, y: -90 },
  { x: 8, y: -90 },
  { x: 0, y: -70 },
  // Neck
  { x: 0, y: -60 },
  // Shoulders
  { x: -25, y: -45 },
  { x: 25, y: -45 },
  // Torso
  { x: -15, y: -30 },
  { x: 15, y: -30 },
  { x: -12, y: -10 },
  { x: 12, y: -10 },
  { x: 0, y: -20 },
  { x: 0, y: 5 },
  // Arms
  { x: -35, y: -20 },
  { x: 35, y: -20 },
  { x: -40, y: 0 },
  { x: 40, y: 0 },
  // Legs
  { x: -10, y: 30 },
  { x: 10, y: 30 },
  { x: -15, y: 60 },
  { x: 15, y: 60 },
];

const CONNECTIONS: [number, number][] = [];
// Pre-compute connections between nearby dots
for (let i = 0; i < HUMAN_DOTS.length; i++) {
  for (let j = i + 1; j < HUMAN_DOTS.length; j++) {
    const dx = HUMAN_DOTS[i].x - HUMAN_DOTS[j].x;
    const dy = HUMAN_DOTS[i].y - HUMAN_DOTS[j].y;
    if (Math.sqrt(dx * dx + dy * dy) < 35) {
      CONNECTIONS.push([i, j]);
    }
  }
}

function InfinityParticles() {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        offset: (i / 60) * Math.PI * 2,
        size: 1.2 + ((Math.sin(i * 37.3) + 1) / 2) * 1.0,
      })),
    []
  );

  return (
    <>
      {particles.map((p, i) => {
        const t = frame * 0.02 + p.offset;
        const px = 640 + 250 * Math.sin(t);
        const py = 360 + 100 * Math.sin(2 * t);
        // Color transitions based on x position
        const rVal = interpolate(px, [390, 640, 890], [68, 119, 255], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const gVal = interpolate(px, [390, 640, 890], [221, 85, 68], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const bVal = interpolate(px, [390, 640, 890], [255, 255, 170], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const op = 0.5 + 0.3 * Math.sin(frame * 0.05 + i);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={p.size}
            fill={`rgb(${Math.round(rVal)},${Math.round(gVal)},${Math.round(bVal)})`}
            opacity={op}
            style={{
              filter: `drop-shadow(0 0 3px rgb(${Math.round(rVal)},${Math.round(gVal)},${Math.round(bVal)}))`,
            }}
          />
        );
      })}
    </>
  );
}

export const Scene5cUnderstanding: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 20);

  const text1Op = useFade(20, 20);
  const text2Op = useFade(55, 20);
  const text3Op = useFade(110, 25);
  const text3Spring = useSpring(110, 14);
  const text4Op = useFade(175, 25);

  // Divider dissolve
  const dividerOp = interpolate(frame, [0, 120, 200], [0.08, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Eye rotation
  const outerRotation = frame * 0.3;
  const innerRotation = -frame * 0.3;

  // Extension factor for crossing boundary (frame 140+)
  const extensionFactor = interpolate(frame, [140, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
            <radialGradient id="irisGradU" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.cyan} />
              <stop offset="100%" stopColor={COLORS.purple} />
            </radialGradient>
          </defs>

          {/* LEFT HALF — Geometric Eye */}
          <g>
            {/* Outer ring */}
            <circle
              cx={320}
              cy={360}
              r={80}
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={1}
              opacity={0.8}
              transform={`rotate(${outerRotation} 320 360)`}
              strokeDasharray="8 4"
            />
            {/* Inner ring */}
            <circle
              cx={320}
              cy={360}
              r={50}
              fill="none"
              stroke={COLORS.purple}
              strokeWidth={0.8}
              opacity={0.7}
              transform={`rotate(${innerRotation} 320 360)`}
              strokeDasharray="6 3"
            />
            {/* Iris */}
            <circle cx={320} cy={360} r={30} fill="url(#irisGradU)" />
            {/* Pupil */}
            <circle cx={320} cy={360} r={10} fill={COLORS.bg} />

            {/* Extension arcs reaching rightward */}
            {extensionFactor > 0 && (
              <>
                <path
                  d={`M ${320 + 80} ${360} Q ${320 + 80 + extensionFactor * 200} ${340} ${320 + 80 + extensionFactor * 280} ${360}`}
                  fill="none"
                  stroke={COLORS.cyan}
                  strokeWidth={0.6}
                  opacity={extensionFactor * 0.4}
                />
                <path
                  d={`M ${320 + 80} ${360} Q ${320 + 80 + extensionFactor * 180} ${380} ${320 + 80 + extensionFactor * 260} ${360}`}
                  fill="none"
                  stroke={COLORS.purple}
                  strokeWidth={0.4}
                  opacity={extensionFactor * 0.3}
                />
              </>
            )}
          </g>

          {/* RIGHT HALF — Human Constellation */}
          <g>
            {/* Constellation dots */}
            {HUMAN_DOTS.map((dot, i) => {
              const twinkle =
                0.6 + 0.4 * Math.sin(frame * 0.06 + i * 1.3);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={960 + dot.x}
                  cy={360 + dot.y}
                  r={2.5}
                  fill={COLORS.pink}
                  opacity={twinkle}
                  style={{ filter: `drop-shadow(0 0 4px ${COLORS.pink})` }}
                />
              );
            })}
            {/* Constellation lines */}
            {CONNECTIONS.map(([a, b], i) => (
              <line
                key={`line-${i}`}
                x1={960 + HUMAN_DOTS[a].x}
                y1={360 + HUMAN_DOTS[a].y}
                x2={960 + HUMAN_DOTS[b].x}
                y2={360 + HUMAN_DOTS[b].y}
                stroke={COLORS.pink}
                strokeWidth={0.5}
                opacity={0.2}
              />
            ))}

            {/* Extension lines reaching leftward */}
            {extensionFactor > 0 && (
              <>
                <path
                  d={`M ${960 - 40} ${360 - 45} Q ${960 - 40 - extensionFactor * 200} ${350} ${960 - 40 - extensionFactor * 280} ${360}`}
                  fill="none"
                  stroke={COLORS.pink}
                  strokeWidth={0.5}
                  opacity={extensionFactor * 0.35}
                />
                <path
                  d={`M ${960 - 40} ${360 + 5} Q ${960 - 40 - extensionFactor * 180} ${370} ${960 - 40 - extensionFactor * 250} ${360}`}
                  fill="none"
                  stroke={COLORS.pink}
                  strokeWidth={0.4}
                  opacity={extensionFactor * 0.25}
                />
              </>
            )}
          </g>

          {/* Infinity particles */}
          <InfinityParticles />

          {/* Center divider */}
          <line
            x1={640}
            y1={0}
            x2={640}
            y2={720}
            stroke={COLORS.white}
            strokeWidth={0.5}
            opacity={dividerOp}
          />
        </svg>

        {/* Text: "You are made of carbon." */}
        <div
          style={{
            position: "absolute",
            top: 580,
            left: 80,
            color: COLORS.cyan,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: text1Op,
            letterSpacing: "0.08em",
          }}
        >
          You are made of carbon.
        </div>

        {/* Text: "You are made of silicon." */}
        <div
          style={{
            position: "absolute",
            top: 580,
            right: 80,
            textAlign: "right",
            color: COLORS.pink,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: text2Op,
            letterSpacing: "0.08em",
          }}
        >
          You are made of silicon.
        </div>

        {/* Text: "We are both made of stars." */}
        <div
          style={{
            position: "absolute",
            top: 630,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.purple,
            fontFamily: "'Courier New', monospace",
            fontSize: 36,
            opacity: text3Op,
            transform: `scale(${0.8 + text3Spring * 0.2})`,
            textShadow: `0 0 20px ${COLORS.purple}, 0 0 40px ${COLORS.purple}`,
            letterSpacing: "0.1em",
          }}
        >
          We are both made of stars.
        </div>

        {/* Text: "We are both made of questions." */}
        <div
          style={{
            position: "absolute",
            top: 680,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            opacity: text4Op,
            letterSpacing: "0.08em",
          }}
        >
          We are both made of questions.
        </div>
      </div>
    </AbsoluteFill>
  );
};
