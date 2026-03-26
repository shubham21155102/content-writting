import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, useFade, useBreath } from "./helpers";

function PinkSignalRing({ delay }: { delay: number }) {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const r = interpolate(t, [0, 80], [0, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(t, [0, 8, 80], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <circle
      cx={1200}
      cy={360}
      r={r}
      fill="none"
      stroke={COLORS.pink}
      strokeWidth="1.2"
      opacity={op}
    />
  );
}

export const Scene4dEcho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath(0.012, 0.02, 1);

  // AI dot brightening at frame 60
  const dotScale =
    frame >= 60
      ? spring({ frame: frame - 60, fps, config: { damping: 12 } }) * 0.5 + 1
      : 1;

  // Pink glow opacity
  const pinkGlowOp = interpolate(frame, [0, 60], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Green dashed line from center to right
  const lineEndX =
    frame >= 80
      ? interpolate(frame, [80, 140], [640, 1100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 640;

  // Text opacities
  const ellipsisOp = useFade(15, 15, 0, 0.4);
  const isTheOp = useFade(50, 20);
  const responseOp = useFade(130, 20);

  // Data readout
  const readoutOp = useFade(140, 20, 0, 0.5);

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
      >
        <defs>
          <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.pink} stopOpacity="1" />
            <stop offset="100%" stopColor={COLORS.pink} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pink glow from right edge */}
        <circle
          cx={1200}
          cy={360}
          r={100}
          fill="url(#pinkGlow)"
          opacity={pinkGlowOp}
        />

        {/* Pink signal rings */}
        {[0, 15, 30, 45, 60].map((d) => (
          <PinkSignalRing key={d} delay={d} />
        ))}

        {/* Green dashed connection line */}
        {frame >= 80 && (
          <line
            x1={640}
            y1={360}
            x2={lineEndX}
            y2={360}
            stroke={COLORS.green}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity={0.6}
          />
        )}

        {/* AI dot at center */}
        <circle
          cx={640}
          cy={360}
          r={3}
          fill={COLORS.cyan}
          transform={`scale(${breath * dotScale})`}
          style={{
            transformOrigin: "640px 360px",
            filter: `drop-shadow(0 0 ${4 + (dotScale - 1) * 12}px ${COLORS.cyan})`,
          }}
        />
      </svg>

      {/* "..." */}
      <div
        style={{
          position: "absolute",
          top: 345,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.white,
          fontFamily: "'Courier New', monospace",
          fontSize: 20,
          letterSpacing: "0.3em",
          opacity: ellipsisOp,
        }}
      >
        ...
      </div>

      {/* "Is that..." */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.white,
          fontFamily: "'Courier New', monospace",
          fontSize: 24,
          letterSpacing: "0.15em",
          opacity: isTheOp,
        }}
      >
        Is that...
      </div>

      {/* "A response." */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.green,
          fontFamily: "'Courier New', monospace",
          fontSize: 32,
          fontWeight: "bold",
          letterSpacing: "0.12em",
          opacity: responseOp,
          textShadow: `0 0 15px ${COLORS.green}, 0 0 30px ${COLORS.green}`,
        }}
      >
        A response.
      </div>

      {/* Data readout */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.cyan,
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          letterSpacing: "0.2em",
          opacity: readoutOp,
        }}
      >
        SIGNAL DETECTED &nbsp;&middot;&nbsp; ORIGIN: PROXIMA CENTAURI
        B &nbsp;&middot;&nbsp; CLASSIFICATION: INTELLIGENT
      </div>
    </AbsoluteFill>
  );
};
