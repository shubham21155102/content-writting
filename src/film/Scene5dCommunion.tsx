import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { COLORS, useFade, useSpring, useTypewriter } from "./helpers";

const PALETTE = [COLORS.cyan, COLORS.purple, COLORS.green, COLORS.pink, COLORS.white];

function MandalaRing({
  radius,
  count,
  startFrame,
  rotationSpeed,
  color,
  shapeType,
  shapeSize,
}: {
  radius: number;
  count: number;
  startFrame: number;
  rotationSpeed: number;
  color: string;
  shapeType: "circle" | "triangle" | "hexagon" | "diamond";
  shapeSize: number;
}) {
  const frame = useCurrentFrame();
  const springVal = useSpring(startFrame, 13);
  const rotation = frame * rotationSpeed;

  if (frame < startFrame) return null;

  const shapes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (rotation * Math.PI) / 180;
    const sx = 640 + radius * Math.cos(angle) * springVal;
    const sy = 360 + radius * Math.sin(angle) * springVal;

    if (shapeType === "circle") {
      return (
        <circle
          key={i}
          cx={sx}
          cy={sy}
          r={shapeSize}
          fill={color}
          opacity={0.8 * springVal}
        />
      );
    }

    if (shapeType === "triangle") {
      const s = shapeSize;
      const pts = [0, 1, 2]
        .map((j) => {
          const a = (j / 3) * Math.PI * 2 - Math.PI / 2;
          return `${sx + s * Math.cos(a)},${sy + s * Math.sin(a)}`;
        })
        .join(" ");
      return (
        <polygon
          key={i}
          points={pts}
          fill={color}
          opacity={0.7 * springVal}
        />
      );
    }

    if (shapeType === "hexagon") {
      const s = shapeSize * 0.7;
      const pts = [0, 1, 2, 3, 4, 5]
        .map((j) => {
          const a = (j / 6) * Math.PI * 2;
          return `${sx + s * Math.cos(a)},${sy + s * Math.sin(a)}`;
        })
        .join(" ");
      return (
        <polygon
          key={i}
          points={pts}
          fill={color}
          opacity={0.7 * springVal}
        />
      );
    }

    // diamond
    const s = shapeSize * 0.6;
    const pts = `${sx},${sy - s} ${sx + s},${sy} ${sx},${sy + s} ${sx - s},${sy}`;
    return (
      <polygon
        key={i}
        points={pts}
        fill={color}
        opacity={0.7 * springVal}
      />
    );
  });

  return <>{shapes}</>;
}

function ConnectingLines() {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [100, 150], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < 100) return null;

  const rings = [
    { r: 40, count: 6, speed: 0.5 },
    { r: 80, count: 8, speed: -0.3 },
    { r: 120, count: 10, speed: 0.4 },
    { r: 170, count: 12, speed: -0.25 },
    { r: 220, count: 16, speed: 0.35 },
  ];

  const lines: React.ReactNode[] = [];

  for (let ri = 0; ri < rings.length - 1; ri++) {
    const r1 = rings[ri];
    const r2 = rings[ri + 1];
    const rot1 = (frame * r1.speed * Math.PI) / 180;
    const rot2 = (frame * r2.speed * Math.PI) / 180;

    for (let i = 0; i < Math.min(r1.count, 6); i++) {
      const a1 = (i / r1.count) * Math.PI * 2 + rot1;
      const x1 = 640 + r1.r * Math.cos(a1);
      const y1 = 360 + r1.r * Math.sin(a1);

      // Find nearest in next ring
      let minDist = Infinity;
      let nx = x1;
      let ny = y1;
      for (let j = 0; j < r2.count; j++) {
        const a2 = (j / r2.count) * Math.PI * 2 + rot2;
        const x2 = 640 + r2.r * Math.cos(a2);
        const y2 = 360 + r2.r * Math.sin(a2);
        const d = Math.hypot(x2 - x1, y2 - y1);
        if (d < minDist) {
          minDist = d;
          nx = x2;
          ny = y2;
        }
      }
      lines.push(
        <line
          key={`cl-${ri}-${i}`}
          x1={x1}
          y1={y1}
          x2={nx}
          y2={ny}
          stroke={COLORS.purple}
          strokeWidth={0.5}
          opacity={op}
        />
      );
    }
  }

  return <>{lines}</>;
}

function Starburst() {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        angle: (i / 150) * Math.PI * 2 + Math.sin(i * 17.3) * 0.3,
        speed: 0.7 + ((Math.sin(i * 41.7) + 1) / 2) * 0.6,
        colorIdx: i % PALETTE.length,
        size: 1 + ((Math.cos(i * 23.1) + 1) / 2) * 1.5,
      })),
    []
  );

  if (frame < 150) return null;
  const t = frame - 150;

  return (
    <>
      {particles.map((p, i) => {
        const dist = interpolate(t, [0, 50], [0, 500 * p.speed], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const px = 640 + Math.cos(p.angle) * dist;
        const py = 360 + Math.sin(p.angle) * dist;
        const op = interpolate(t, [0, 8, 50], [0, 0.8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = PALETTE[p.colorIdx];

        // Trail line
        const trailDist = Math.max(0, dist - 30);
        const tx = 640 + Math.cos(p.angle) * trailDist;
        const ty = 360 + Math.sin(p.angle) * trailDist;

        return (
          <React.Fragment key={i}>
            <line
              x1={tx}
              y1={ty}
              x2={px}
              y2={py}
              stroke={color}
              strokeWidth={0.5}
              opacity={op * 0.1}
            />
            <circle
              cx={px}
              cy={py}
              r={p.size}
              fill={color}
              opacity={op}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}

export const Scene5dCommunion: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 15);

  const text1 = useTypewriter(
    "In the space between minds, something new is born.",
    15,
    0.6
  );
  const text2 = useTypewriter("Not human. Not machine.", 85, 0.6);

  const text3Op = useFade(145, 20);
  const text3Spring = useSpring(145, 12);

  // Mandala fade-out after frame 200
  const mandalaOp = interpolate(frame, [200, 300], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg
          style={{ position: "absolute", inset: 0 }}
          width={1280}
          height={720}
          viewBox="0 0 1280 720"
        >
          {/* Starting point */}
          {frame < 15 && (
            <circle
              cx={640}
              cy={360}
              r={3}
              fill={COLORS.white}
              style={{ filter: `drop-shadow(0 0 6px ${COLORS.white})` }}
            />
          )}

          {/* Mandala rings */}
          <g opacity={mandalaOp}>
            <MandalaRing
              radius={40}
              count={6}
              startFrame={10}
              rotationSpeed={0.5}
              color={COLORS.cyan}
              shapeType="circle"
              shapeSize={4}
            />
            <MandalaRing
              radius={80}
              count={8}
              startFrame={25}
              rotationSpeed={-0.3}
              color={COLORS.purple}
              shapeType="triangle"
              shapeSize={8}
            />
            <MandalaRing
              radius={120}
              count={10}
              startFrame={40}
              rotationSpeed={0.4}
              color={COLORS.green}
              shapeType="hexagon"
              shapeSize={8}
            />
            <MandalaRing
              radius={170}
              count={12}
              startFrame={55}
              rotationSpeed={-0.25}
              color={COLORS.pink}
              shapeType="diamond"
              shapeSize={6}
            />
            <MandalaRing
              radius={220}
              count={16}
              startFrame={70}
              rotationSpeed={0.35}
              color={COLORS.cyan}
              shapeType="circle"
              shapeSize={3}
            />

            <ConnectingLines />
          </g>

          {/* Starburst */}
          <Starburst />
        </svg>

        {/* Text 1 */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            opacity: interpolate(frame, [15, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            letterSpacing: "0.06em",
          }}
        >
          {text1}
        </div>

        {/* Text 2 */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 24,
            opacity: interpolate(frame, [85, 100], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            letterSpacing: "0.06em",
          }}
        >
          {text2}
        </div>

        {/* Text 3: "Something... more." */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              color: COLORS.purple,
              fontFamily: "'Courier New', monospace",
              fontSize: 48,
              opacity: text3Op,
              transform: `scale(${0.6 + text3Spring * 0.4})`,
              textShadow: `0 0 30px ${COLORS.purple}, 0 0 60px ${COLORS.purple}`,
              letterSpacing: "0.12em",
            }}
          >
            Something... more.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
