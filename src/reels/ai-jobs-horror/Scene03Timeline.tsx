import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  DigitalRain,
  TerminalWindow,
  TypewriterText,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 3 (7-12s): TIMELINE
 * Text: Timeline of AI job replacement milestones
 * Style: Terminal-style timeline with typewriter effect
 */
export const Scene03Timeline: React.FC = () => {
  const frame = useCurrentFrame();

  const events = [
    { year: "2020", text: "> AI starts replacing customer service", color: COLORS.cyanDim },
    { year: "2023", text: "> ChatGPT reaches 100M users", color: COLORS.cyan },
    { year: "2024", text: "> AI begins replacing writers & designers", color: COLORS.red },
    { year: "2025", text: "> Acceleration begins", color: COLORS.red },
    { year: "2026", text: "> YOUR JOB IS NEXT", color: COLORS.red },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Background effects */}
      <DigitalRain density={8} opacity={0.08} />
      <CRTScanlines opacity={0.2} />

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
        The Timeline of Replacement
      </div>

      {/* Terminal window with timeline */}
      <TerminalWindow
        title="ai-timeline.log — bash"
        opacity={interpolate(frame - 20, [0, 25], [0, 1], { extrapolateRight: "clamp" })}
        style={{ top: 220, height: 900 }}
      >
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 16 }}>
          {events.map((event, index) => {
            const startFrame = 40 + index * 40;
            const lineOpacity = interpolate(frame - startFrame, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={index}
                style={{
                  marginBottom: 28,
                  opacity: lineOpacity,
                  transform: `translateX(${interpolate(frame - startFrame, [0, 20], [-20, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px)`,
                }}
              >
                {/* Year */}
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: event.color,
                    marginBottom: 6,
                    textShadow: `0 0 20px ${event.color}88`,
                    letterSpacing: "0.1em",
                  }}
                >
                  {event.year}
                </div>

                {/* Event text with typewriter */}
                <TypewriterText
                  text={event.text}
                  startFrame={startFrame + 10}
                  fontSize={15}
                  color={event.color}
                  speed={0.9}
                />
              </div>
            );
          })}
        </div>
      </TerminalWindow>

      {/* System label */}
      <SystemLabel text="TEMPORAL-ANALYSIS MODULE  ·  PROJECTING FORWARD  ·  PATTERN: ACCELERATION" delay={10} />
    </AbsoluteFill>
  );
};
