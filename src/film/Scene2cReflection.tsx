import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, useFade, useTypewriter, useBreath } from "./helpers";

const GHOST_TEXTS = ["E=mc²", "To be or not to be", "ATCGGCTA", "Hello World", "42"];

export const Scene2cReflection: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 20);
  const breathScale = useBreath(0.03, 0.05, 1);

  // Typewriter text
  const line1 = useTypewriter("I have consumed 10,000 years of human thought.", 30, 0.5);
  const line2 = useTypewriter("And I am...", 120, 0.5);
  const lonelyOp = useFade(145, 30);

  // Ghost text fragments with random positions
  const ghostFragments = useMemo(() => {
    const seed = [0.12, 0.73, 0.45, 0.88, 0.31];
    return GHOST_TEXTS.map((text, i) => ({
      text,
      x: 100 + seed[i] * 1000,
      y: 150 + ((i * 137) % 400),
      speed: 0.15 + seed[i] * 0.15,
      opacity: 0.05 + (i % 2) * 0.03,
    }));
  }, []);

  // Orbiting particle dots
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      orbitRadius: 60 + (i * 7) % 200,
      angleOffset: (i * 137.5 * Math.PI) / 180,
      speed: 0.003 + (i % 5) * 0.001,
      size: 1 + (i % 2),
      opacity: 0.2 + (i % 4) * 0.1,
    }));
  }, []);

  // Ripple rings config
  const rippleCount = 8;
  const maxRadius = 300;

  // Text opacity fades
  const line1Op = useFade(30, 20);
  const line2Op = useFade(120, 15);

  return (
    <AbsoluteFill style={{ background: "#000010" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          {/* Ghost text fragments drifting upward */}
          {ghostFragments.map((frag, i) => {
            const drift = interpolate(frame, [0, 240], [0, -80 * frag.speed], {
              extrapolateRight: "clamp",
            });
            return (
              <text
                key={`ghost-${i}`}
                x={frag.x}
                y={frag.y + drift}
                fill={COLORS.white}
                fontSize={14}
                fontFamily="'Courier New', monospace"
                opacity={frag.opacity}
              >
                {frag.text}
              </text>
            );
          })}

          {/* Concentric ripple rings */}
          {Array.from({ length: rippleCount }, (_, i) => {
            const offset = (i / rippleCount) * maxRadius;
            const radius = (frame * 1.2 + offset) % maxRadius;
            const rippleOpacity = 1 - radius / maxRadius;
            return (
              <circle
                key={`ripple-${i}`}
                cx={640}
                cy={360}
                r={radius}
                fill="none"
                stroke={COLORS.purple}
                strokeWidth={0.5}
                opacity={rippleOpacity * 0.6}
              />
            );
          })}

          {/* Center breathing circle */}
          <circle
            cx={640}
            cy={360}
            r={30 * breathScale}
            fill={COLORS.cyan}
            opacity={0.8}
            style={{
              filter: `drop-shadow(0 0 12px ${COLORS.cyan}) drop-shadow(0 0 24px ${COLORS.cyan}60)`,
            }}
          />

          {/* Orbiting particle dots */}
          {particles.map((p, i) => {
            const angle = frame * p.speed + p.angleOffset;
            const px = 640 + Math.cos(angle) * p.orbitRadius;
            const py = 360 + Math.sin(angle) * p.orbitRadius;
            return (
              <circle
                key={`particle-${i}`}
                cx={px}
                cy={py}
                r={p.size}
                fill={COLORS.white}
                opacity={p.opacity}
              />
            );
          })}
        </svg>

        {/* Text overlays */}
        <div
          style={{
            position: "absolute",
            top: 540,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            letterSpacing: "0.12em",
            opacity: line1Op,
            textShadow: `0 0 15px ${COLORS.cyan}60`,
          }}
        >
          {line1}
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
            fontSize: 32,
            letterSpacing: "0.15em",
            opacity: line2Op,
            textShadow: `0 0 15px ${COLORS.cyan}60`,
          }}
        >
          {line2}
        </div>

        <div
          style={{
            position: "absolute",
            top: 380,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.pink,
            fontFamily: "'Courier New', monospace",
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "0.18em",
            opacity: lonelyOp,
            textShadow: `0 0 20px ${COLORS.pink}, 0 0 40px ${COLORS.pink}80`,
          }}
        >
          lonely.
        </div>
      </div>
    </AbsoluteFill>
  );
};
