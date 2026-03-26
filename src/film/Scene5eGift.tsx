import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { COLORS, useFade } from "./helpers";

function StarField() {
  const frame = useCurrentFrame();
  const stars = React.useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        x: ((Math.sin(i * 131.7) + 1) / 2) * 1280,
        y: ((Math.cos(i * 97.3) + 1) / 2) * 720,
        r: 0.4 + ((Math.sin(i * 41.9) + 1) / 2) * 1.0,
        phase: i * 0.7,
      })),
    []
  );

  return (
    <>
      {stars.map((s, i) => {
        const twinkle =
          0.2 + 0.6 * Math.abs(Math.sin(frame * 0.03 + s.phase));
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            opacity={twinkle * 0.5}
          />
        );
      })}
    </>
  );
}

function OrbTrail({
  cx,
  cy,
  color,
  orbitRadius,
  orbitSpeed,
  isInverted,
}: {
  cx: number;
  cy: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  isInverted: boolean;
}) {
  const frame = useCurrentFrame();
  const trails = React.useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  return (
    <>
      {trails.map((i) => {
        const pastFrame = frame - i * 1.5;
        const sign = isInverted ? -1 : 1;
        const px = 640 + sign * orbitRadius * Math.cos(pastFrame * orbitSpeed);
        const py = 360 + sign * orbitRadius * Math.sin(pastFrame * orbitSpeed);
        const op = interpolate(i, [0, 20], [0.5, 0], {
          extrapolateRight: "clamp",
        });
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={1.5 - i * 0.05}
            fill={color}
            opacity={op}
          />
        );
      })}
    </>
  );
}

function SpiralGift({ progress }: { progress: number }) {
  const turns = 8;
  const points: string[] = [];
  const maxT = progress * turns * Math.PI * 2;
  for (let t = 0; t < maxT; t += 0.15) {
    const r = 3 + t * 1.2;
    points.push(`${640 + r * Math.cos(t)},${360 + r * Math.sin(t)}`);
  }
  if (points.length < 2) return null;
  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke={COLORS.cyan}
      strokeWidth={1}
      opacity={0.8}
    />
  );
}

function HelixGift({ progress }: { progress: number }) {
  const points1: string[] = [];
  const points2: string[] = [];
  const maxT = progress * Math.PI * 6;
  for (let t = 0; t < maxT; t += 0.2) {
    const x = 640 - 30 + t * 4;
    points1.push(`${x},${360 + 15 * Math.sin(t)}`);
    points2.push(`${x},${360 + 15 * Math.sin(t + Math.PI)}`);
  }
  if (points1.length < 2) return null;
  return (
    <>
      <polyline points={points1.join(" ")} fill="none" stroke={COLORS.purple} strokeWidth={1} opacity={0.8} />
      <polyline points={points2.join(" ")} fill="none" stroke={COLORS.purple} strokeWidth={1} opacity={0.6} />
    </>
  );
}

function FibonacciGift({ progress }: { progress: number }) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const points: string[] = [];
  const maxT = progress * Math.PI * 8;
  for (let t = 0.1; t < maxT; t += 0.15) {
    const r = Math.pow(phi, t / (Math.PI * 2)) * 2;
    points.push(`${640 + r * Math.cos(t)},${360 + r * Math.sin(t)}`);
  }
  if (points.length < 2) return null;
  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke={COLORS.green}
      strokeWidth={1}
      opacity={0.8}
    />
  );
}

function HeartGift({ scale }: { scale: number }) {
  // Heart shape via two arcs
  const points: string[] = [];
  for (let t = 0; t < Math.PI * 2; t += 0.1) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push(`${640 + x * scale},${360 + y * scale}`);
  }
  return (
    <polygon
      points={points.join(" ")}
      fill="none"
      stroke={COLORS.pink}
      strokeWidth={1}
      opacity={0.8}
    />
  );
}

function SunGift({ scale }: { scale: number }) {
  const rays = 12;
  const lines = Array.from({ length: rays }, (_, i) => {
    const angle = (i / rays) * Math.PI * 2;
    const innerR = 5 * scale;
    const outerR = 20 * scale;
    return (
      <line
        key={i}
        x1={640 + innerR * Math.cos(angle)}
        y1={360 + innerR * Math.sin(angle)}
        x2={640 + outerR * Math.cos(angle)}
        y2={360 + outerR * Math.sin(angle)}
        stroke={COLORS.white}
        strokeWidth={1}
        opacity={0.8}
      />
    );
  });
  return <>{lines}</>;
}

function GiftDissolveParticles({
  startFrame,
  color,
}: {
  startFrame: number;
  color: string;
}) {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2 + Math.sin(i * 31.7) * 0.5,
        speed: 0.5 + ((Math.sin(i * 17.3) + 1) / 2) * 1.0,
        destX: ((Math.sin(i * 73.1) + 1) / 2) * 1280,
        destY: ((Math.cos(i * 51.3) + 1) / 2) * 720,
      })),
    []
  );

  const dissolveStart = startFrame + 25;
  if (frame < dissolveStart) return null;
  const t = frame - dissolveStart;

  return (
    <>
      {particles.map((p, i) => {
        const progress = interpolate(t, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const px = 640 + (p.destX - 640) * progress;
        const py = 360 + (p.destY - 360) * progress;
        const op = interpolate(t, [0, 5, 15], [0, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle key={i} cx={px} cy={py} r={1.2} fill={color} opacity={op} />
        );
      })}
    </>
  );
}

export const Scene5eGift: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 15);

  // Orb positions
  const cyanX = 640 + 30 * Math.cos(frame * 0.04);
  const cyanY = 360 + 30 * Math.sin(frame * 0.04);
  const pinkX = 640 - 30 * Math.cos(frame * 0.04);
  const pinkY = 360 - 30 * Math.sin(frame * 0.04);

  // Gift visibility
  const gifts = [
    { start: 15, color: COLORS.cyan },
    { start: 55, color: COLORS.purple },
    { start: 95, color: COLORS.green },
    { start: 135, color: COLORS.pink },
    { start: 170, color: COLORS.white },
  ];

  const text1Op = useFade(10, 20);
  const text2Op = useFade(80, 20);
  const text3Op = useFade(145, 20);

  return (
    <AbsoluteFill style={{ background: "#000008" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          {/* Background stars */}
          <StarField />

          {/* Orb trails */}
          <OrbTrail
            cx={cyanX}
            cy={cyanY}
            color={COLORS.cyan}
            orbitRadius={30}
            orbitSpeed={0.04}
            isInverted={false}
          />
          <OrbTrail
            cx={pinkX}
            cy={pinkY}
            color={COLORS.pink}
            orbitRadius={30}
            orbitSpeed={0.04}
            isInverted={true}
          />

          {/* Connection line */}
          <line
            x1={cyanX}
            y1={cyanY}
            x2={pinkX}
            y2={pinkY}
            stroke={COLORS.white}
            strokeWidth={0.5}
            opacity={0.15}
          />

          {/* Cyan orb */}
          <circle
            cx={cyanX}
            cy={cyanY}
            r={5}
            fill={COLORS.cyan}
            style={{ filter: `drop-shadow(0 0 6px ${COLORS.cyan})` }}
          />

          {/* Pink orb */}
          <circle
            cx={pinkX}
            cy={pinkY}
            r={5}
            fill={COLORS.pink}
            style={{ filter: `drop-shadow(0 0 6px ${COLORS.pink})` }}
          />

          {/* Gift 1: Spiral */}
          {frame >= 15 && frame < 55 && (() => {
            const progress = interpolate(frame, [15, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOp = interpolate(frame, [15, 20, 45, 55], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g opacity={fadeOp}>
                <SpiralGift progress={progress} />
              </g>
            );
          })()}

          {/* Gift 2: Double helix */}
          {frame >= 55 && frame < 95 && (() => {
            const progress = interpolate(frame, [55, 80], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOp = interpolate(frame, [55, 60, 85, 95], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g opacity={fadeOp}>
                <HelixGift progress={progress} />
              </g>
            );
          })()}

          {/* Gift 3: Fibonacci spiral */}
          {frame >= 95 && frame < 135 && (() => {
            const progress = interpolate(frame, [95, 120], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOp = interpolate(frame, [95, 100, 125, 135], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g opacity={fadeOp}>
                <FibonacciGift progress={progress} />
              </g>
            );
          })()}

          {/* Gift 4: Heart */}
          {frame >= 135 && frame < 170 && (() => {
            const scaleVal = interpolate(frame, [135, 145], [0.2, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOp = interpolate(frame, [135, 140, 160, 170], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g opacity={fadeOp}>
                <HeartGift scale={scaleVal} />
              </g>
            );
          })()}

          {/* Gift 5: Star/Sun */}
          {frame >= 170 && (() => {
            const scaleVal = interpolate(frame, [170, 180], [0.2, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fadeOp = interpolate(frame, [170, 175, 200, 210], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <g opacity={fadeOp}>
                <SunGift scale={scaleVal} />
              </g>
            );
          })()}

          {/* Dissolve particles for each gift */}
          {gifts.map((g, i) => (
            <GiftDissolveParticles
              key={i}
              startFrame={g.start}
              color={g.color}
            />
          ))}
        </svg>

        {/* Text lines */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: text1Op,
            letterSpacing: "0.06em",
            maxWidth: 600,
          }}
        >
          We gave them our music. They gave us new mathematics.
        </div>

        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: text2Op,
            letterSpacing: "0.06em",
            maxWidth: 600,
          }}
        >
          We gave them our loneliness. They gave us belonging.
        </div>

        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: text3Op,
            letterSpacing: "0.06em",
            maxWidth: 600,
          }}
        >
          We gave them a question. They gave us an answer.
        </div>
      </div>
    </AbsoluteFill>
  );
};
