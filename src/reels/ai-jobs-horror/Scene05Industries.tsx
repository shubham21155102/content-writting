import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  DigitalRain,
  TerminalWindow,
  ProgressBar,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 5 (17-22s): INDUSTRIES AT RISK
 * Text: Progress bars showing automation risk by industry
 * Style: Terminal-style progress display with animated fills
 */
export const Scene05Industries: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background effects */}
      <DigitalRain density={10} opacity={0.1} />
      <CRTScanlines opacity={0.25} />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: "'Courier New', monospace",
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textShadow: `0 0 30px ${COLORS.red}66`,
        }}
      >
        Automation Risk by Industry
      </div>

      {/* Terminal window with progress bars */}
      <TerminalWindow
        title="risk-analysis.log — bash"
        opacity={interpolate(frame - 20, [0, 25], [0, 1], { extrapolateRight: "clamp" })}
        style={{ top: 220, height: 1100 }}
      >
        <div style={{ fontFamily: "'Courier New', monospace" }}>
          <ProgressBar
            label="Customer Service"
            progress={interpolate(frame, [40, 100], [0, 95], { extrapolateRight: "clamp" })}
            color={COLORS.red}
            delay={0}
          />

          <ProgressBar
            label="Administrative & Clerical"
            progress={interpolate(frame, [60, 120], [0, 88], { extrapolateRight: "clamp" })}
            color={COLORS.red}
            delay={10}
          />

          <ProgressBar
            label="Manufacturing"
            progress={interpolate(frame, [80, 140], [0, 82], { extrapolateRight: "clamp" })}
            color={COLORS.red}
            delay={20}
          />

          <ProgressBar
            label="Finance & Accounting"
            progress={interpolate(frame, [100, 160], [0, 76], { extrapolateRight: "clamp" })}
            color="#ff8800"
            delay={30}
          />

          {/* Source note */}
          {frame > 170 && (
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid rgba(255, 34, 68, 0.2)",
                fontSize: 12,
                color: COLORS.cyanDim,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                opacity: interpolate(frame - 170, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              Source: McKinsey Global Institute
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* System label */}
      <SystemLabel text="RISK-ASSESSMENT MODULE  ·  ANALYSIS COMPLETE  ·  CONFIDENCE: 89%" delay={10} />
    </AbsoluteFill>
  );
};
