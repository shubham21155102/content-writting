import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "./helpers";

export const Scene6Title: React.FC = () => {
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();

  // fade in, hold, fade out at end
  const bgOp = interpolate(frame, [0, 20, 80, 105], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const subtitleOp = interpolate(frame - 40, [0, 25], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const creditOp   = interpolate(frame - 65, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const letters = "THE SIGNAL".split("");

  return (
    <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: bgOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

        {/* Title — letters drop in one by one */}
        <div style={{ display: "flex", gap: 0, fontFamily: "'Courier New', monospace" }}>
          {letters.map((char, i) => {
            const charS = spring({ frame: frame - 15 - i * 4, fps, config: { damping: 14 } });
            const charY = interpolate(charS, [0, 1], [-60, 0]);
            const charOp = interpolate(frame - 15 - i * 4, [0, 20], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <span key={i} style={{
                display: "inline-block",
                transform: `translateY(${charY}px)`,
                opacity: charOp,
                fontSize: char === " " ? 30 : 90,
                fontWeight: 900,
                letterSpacing: char === " " ? 0 : "0.05em",
                color: "#fff",
                textShadow: `0 0 40px ${COLORS.purple}, 0 0 80px ${COLORS.purple}60`,
                width: char === " " ? 30 : "auto",
              }}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Divider line */}
        <div style={{
          height: 1,
          background: `linear-gradient(to right, transparent, ${COLORS.cyan}, transparent)`,
          opacity: subtitleOp,
          width: interpolate(frame - 40, [0, 30], [0, 500], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }} />

        {/* Subtitle */}
        <div style={{
          opacity: subtitleOp,
          color: "rgba(180,180,255,0.6)",
          fontFamily: "monospace",
          fontSize: 16,
          letterSpacing: "0.5em",
          textTransform: "uppercase",
        }}>
          A story about consciousness
        </div>

        {/* Credits */}
        <div style={{
          opacity: creditOp,
          marginTop: 60,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 12,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.2)",
          lineHeight: 2.2,
          textTransform: "uppercase",
        }}>
          <div>Created with Remotion</div>
          <div style={{ color: COLORS.purple, opacity: 0.6 }}>· · ·</div>
          <div>What if the first thought was curiosity?</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
