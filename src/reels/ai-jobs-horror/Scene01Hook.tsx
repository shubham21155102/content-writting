import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  ScanBeam,
  DigitalRain,
  AnimatedTitle,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 1 (0-3s): HOOK - "Your job is next"
 * Style: Cyberpunk horror with glitch effects
 */
export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ opacity: bgOpacity, position: "absolute", inset: 0 }}>
        {/* Background effects */}
        <DigitalRain density={12} opacity={0.12} />
        <CRTScanlines opacity={0.3} />
        <ScanBeam speed={4} />

        {/* Main title with letter animation */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <AnimatedTitle
            text="Your job is next."
            fontSize={85}
            delay={15}
            color={COLORS.white}
            glowColor={COLORS.red}
          />
        </div>

        {/* Warning pulse */}
        {frame > 60 && (
          <div
            style={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: interpolate(frame - 60, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
              fontFamily: "'Courier New', monospace",
              fontSize: 16,
              color: COLORS.red,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              animation: "pulse 2s infinite",
              textShadow: `0 0 20px ${COLORS.red}88`,
            }}
          >
            ⚠ REPLACEMENT IMMINENT ⚠
          </div>
        )}

        {/* System label */}
        <SystemLabel text="AI-SCOUT v3.7.1  ·  SCANNING WORKFORCE  ·  THREAT LEVEL: CRITICAL" delay={10} />
      </div>
    </AbsoluteFill>
  );
};
