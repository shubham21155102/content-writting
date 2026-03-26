import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  ScanBeam,
  DigitalRain,
  AnimatedTitle,
  TerminalWindow,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 6 (22-27s): THE TRUTH
 * Text: "It's happening faster than anyone predicted"
 * Style: Dramatic reveal with glitch effects
 */
export const Scene06Truth: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background effects */}
      <DigitalRain density={15} opacity={0.15} />
      <CRTScanlines opacity={0.35} />
      <ScanBeam speed={6} />

      {/* Main title with letter animation */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <AnimatedTitle
          text="It's appearing faster than anyone predicted."
          fontSize={52}
          delay={15}
          color={COLORS.white}
          glowColor={COLORS.red}
        />
      </div>

      {/* Terminal window with facts */}
      {frame > 60 && (
        <TerminalWindow
          title="analysis-report.log — bash"
          opacity={interpolate(frame - 60, [0, 25], [0, 1], { extrapolateRight: "clamp" })}
          style={{ bottom: 200, top: "auto", height: 400 }}
        >
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18 }}>
            {/* Fact 1 */}
            <div
              style={{
                marginBottom: 24,
                opacity: interpolate(frame - 80, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
                color: COLORS.white,
                lineHeight: 1.5,
                letterSpacing: "0.05em",
              }}
            >
              <span style={{ color: COLORS.red, fontWeight: 700 }}>⚠</span>{" "}
              Experts predicted 10 years.{" "}
              <span style={{ color: COLORS.red }}>AI did it in 2.</span>
            </div>

            {/* Fact 2 */}
            <div
              style={{
                opacity: interpolate(frame - 110, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
                color: COLORS.white,
                lineHeight: 1.5,
                letterSpacing: "0.05em",
              }}
            >
              <span style={{ color: COLORS.cyan, fontWeight: 700 }}>⚠</span>{" "}
              Your skills have{" "}
              <span style={{ color: COLORS.cyan }}>an expiration date.</span>
            </div>
          </div>
        </TerminalWindow>
      )}

      {/* System label */}
      <SystemLabel text="TEMPORAL-ANOMALY DETECTED  ·  ACCELERATION: 500%  ·  PREDICTION MODELS: FAILED" delay={10} />
    </AbsoluteFill>
  );
};
