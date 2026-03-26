import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V } from "./helpers-viral";

// ── Single stat block ────────────────────────────────────────────────────────
const StatBlock: React.FC<{
  value: string;
  valueSize?: number;
  valueColor?: string;
  label: string;
  labelSize?: number;
  labelColor?: string;
  labelBold?: boolean;
  enterFrame: number;
  exitFrame: number;
}> = ({
  value,
  valueSize = 72,
  valueColor = V.white,
  label,
  labelSize = 18,
  labelColor = V.dimGray,
  labelBold = false,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring in
  const springIn = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const scaleIn = interpolate(springIn, [0, 1], [0.7, 1]);
  const opIn = interpolate(frame, [enterFrame, enterFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade + scale out
  const scaleOut = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opOut = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Only render in range
  if (frame < enterFrame - 5 || frame > exitFrame + 5) return null;

  const scale = frame < exitFrame - 15 ? scaleIn : scaleOut;
  const opacity = opIn * opOut;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: valueSize,
          fontWeight: 900,
          color: valueColor,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: labelSize,
          color: labelColor,
          fontWeight: labelBold ? 700 : 400,
          marginTop: 20,
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.5,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── Main scene ───────────────────────────────────────────────────────────────
export const Scene16Numbers: React.FC = () => {
  const frame = useCurrentFrame();

  // Anchor line opacity
  const lineOp = interpolate(frame, [0, 20], [0, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: V.bg }}>
      {/* Visual anchor — thin horizontal line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 1,
          background: V.white,
          opacity: lineOp,
        }}
      />

      {/* Stat 1: frame 5-80 */}
      <StatBlock
        value="2.1 BILLION"
        valueSize={72}
        valueColor={V.white}
        label="people have social media accounts that will outlive them"
        enterFrame={5}
        exitFrame={80}
      />

      {/* Stat 2: frame 85-170 */}
      <StatBlock
        value="170+ YEARS"
        valueSize={72}
        valueColor={V.purple}
        label="the average digital footprint persists after death"
        enterFrame={85}
        exitFrame={170}
      />

      {/* Stat 3: frame 175-260 */}
      <StatBlock
        value="By 2030"
        valueSize={40}
        valueColor={V.dimWhite}
        label="there will be more dead people on Facebook than living"
        labelSize={24}
        labelColor={V.red}
        labelBold
        enterFrame={175}
        exitFrame={260}
      />
    </AbsoluteFill>
  );
};
