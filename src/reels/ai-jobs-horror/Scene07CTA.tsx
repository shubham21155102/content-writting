import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  DigitalRain,
  AnimatedTitle,
  GradientDivider,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 7 (27-30s): CTA - Call to Action
 * Text: "Adapt or be replaced."
 * Style: Dramatic finale with follow CTA
 */
export const Scene07CTA: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background effects */}
      <DigitalRain density={18} opacity={0.12} />
      <CRTScanlines opacity={0.3} />

      {/* Main CTA with letter animation */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <AnimatedTitle
          text="Adapt or be replaced."
          fontSize={80}
          delay={10}
          color={COLORS.white}
          glowColor={COLORS.red}
        />
      </div>

      {/* Subtext */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: "'Courier New', monospace",
          fontSize: 24,
          color: COLORS.gray,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textShadow: `0 0 20px ${COLORS.red}44`,
        }}
      >
        Learn AI before AI replaces you
      </div>

      {/* Gradient divider */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <GradientDivider width={500} delay={40} color={COLORS.cyan} />
      </div>

      {/* Follow CTA card */}
      {frame > 60 && (
        <div
          style={{
            position: "absolute",
            bottom: 180,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: interpolate(frame - 60, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
            padding: "40px 60px",
            background: "linear-gradient(145deg, rgba(10,15,25,0.95) 0%, rgba(0,5,15,0.98) 100%)",
            border: `2px solid ${COLORS.red}44`,
            borderRadius: 8,
            boxShadow: `
              0 0 40px ${COLORS.red}22,
              inset 0 0 60px rgba(0,0,0,0.5)
            `,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 28,
              color: COLORS.white,
              fontWeight: 700,
              marginBottom: 16,
              textAlign: "center",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: `0 0 30px ${COLORS.red}66`,
            }}
          >
            Follow to learn how to adapt
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 16,
              color: COLORS.gray,
              textAlign: "center",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            #ai #jobreplacement #futureofwork #automation #careers
          </div>
        </div>
      )}

      {/* System label */}
      <SystemLabel text="FINAL TRANSMISSION  ·  END OF LINE  ·  SYSTEM STATUS: TERMINATED" delay={10} />
    </AbsoluteFill>
  );
};
