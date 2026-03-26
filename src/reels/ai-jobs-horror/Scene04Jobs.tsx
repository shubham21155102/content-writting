import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  COLORS,
  CRTScanlines,
  DigitalRain,
  TerminalWindow,
  SystemLabel,
} from "./helpers-cyberpunk";

/**
 * SCENE 4 (12-17s): JOBS BEING REPLACED
 * Text: List of jobs currently being replaced
 * Style: Terminal-style job list with status indicators
 */
export const Scene04Jobs: React.FC = () => {
  const frame = useCurrentFrame();

  const jobs = [
    { title: "Customer Service", status: "REPLACING", severity: "high" },
    { title: "Content Writers", status: "REPLACING", severity: "high" },
    { title: "Graphic Designers", status: "REPLACING", severity: "high" },
    { title: "Data Entry", status: "REPLACED", severity: "critical" },
  ];

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case "critical": return COLORS.red;
      case "high": return "#ff6644";
      case "medium": return COLORS.cyan;
      default: return COLORS.gray;
    }
  };

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
        Jobs Being Replaced RIGHT NOW
      </div>

      {/* Terminal window with job list */}
      <TerminalWindow
        title="job-targets.log — bash"
        opacity={interpolate(frame - 20, [0, 25], [0, 1], { extrapolateRight: "clamp" })}
        style={{ top: 220, height: 1200 }}
      >
        <div style={{ fontFamily: "'Courier New', monospace" }}>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "35px 1fr 100px",
              gap: "12px",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255, 34, 68, 0.3)",
              fontSize: 12,
              color: COLORS.gray,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            <div>#</div>
            <div>Job Title</div>
            <div>Status</div>
          </div>

          {/* Job list */}
          {jobs.map((job, index) => {
            const delay = 40 + index * 20;
            const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const translateX = interpolate(frame - delay, [0, 20], [-30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const statusColor = getStatusColor(job.severity);

            return (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "35px 1fr 100px",
                  gap: "12px",
                  marginBottom: 24,
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  alignItems: "center",
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: COLORS.grayDim,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Job title */}
                <div
                  style={{
                    fontSize: 15,
                    color: COLORS.white,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {job.title}
                </div>

                {/* Status badge */}
                <div
                  style={{
                    fontSize: 10,
                    color: statusColor,
                    padding: "6px 8px",
                    background: `${statusColor}22`,
                    border: `1px solid ${statusColor}44`,
                    borderRadius: 4,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    textAlign: "center",
                    textShadow: `0 0 10px ${statusColor}66`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {job.status}
                </div>
              </div>
            );
          })}
        </div>
      </TerminalWindow>

      {/* System label */}
      <SystemLabel text="TARGET-ACQUISITION SYSTEM  ·  4 ACTIVE TARGETS  ·  REPLACEMENT PROTOCOL: ENGAGED" delay={10} />
    </AbsoluteFill>
  );
};
