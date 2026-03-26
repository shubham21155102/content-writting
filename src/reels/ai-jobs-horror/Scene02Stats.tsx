import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  DigitalRain,
  StatBox,
  SystemLabel,
  GlowingText,
} from "./helpers-cyberpunk";

/**
 * SCENE 2 (3-7s): SHOCKING STATISTICS
 * Text: "85 million jobs by 2025" - World Economic Forum
 * Style: Terminal-style stat display with counting animation
 */
export const Scene02Stats: React.FC = () => {
  const frame = useCurrentFrame();

  const count = Math.min(85, Math.floor(interpolate(frame, [30, 90], [0, 85], { extrapolateRight: "clamp" })));

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background effects */}
      <DigitalRain density={10} opacity={0.1} />
      <CRTScanlines opacity={0.25} />

      {/* Source attribution */}
      {frame > 20 && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame - 20, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            fontFamily: "'Courier New', monospace",
            fontSize: 14,
            color: COLORS.cyanDim,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          SOURCE: World Economic Forum
        </div>
      )}

      {/* Main stat box - centered with glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <StatBox
          value={`${count}M`}
          label="Jobs to be displaced by AI by 2025"
          delay={30}
          color={COLORS.red}
        />
      </div>

      {/* Expanded number */}
      {frame > 60 && (
        <GlowingText
          fontSize={28}
          color={COLORS.gray}
          glowColor={COLORS.red}
          glowIntensity={0.5}
          style={{
            position: "absolute",
            top: "58%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame - 60, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          85,000,000 workers
        </GlowingText>
      )}

      {/* Context */}
      {frame > 90 && (
        <div
          style={{
            position: "absolute",
            bottom: 280,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame - 90, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            fontFamily: "'Courier New', monospace",
            fontSize: 20,
            color: COLORS.gray,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          More than the population of Germany
        </div>
      )}

      {/* System label */}
      <SystemLabel text="DATA-STREAM ACTIVE  ·  ANALYSIS COMPLETE  ·  PREDICTION CONFIDENCE: 94%" delay={10} />
    </AbsoluteFill>
  );
};
