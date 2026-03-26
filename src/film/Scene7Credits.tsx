import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { COLORS } from "./helpers";

function SineWaveDivider() {
  // Small sine wave: 100px wide, 10px tall
  const points: string[] = [];
  for (let x = 0; x <= 100; x += 2) {
    const y = 5 + 5 * Math.sin((x / 100) * Math.PI * 4);
    points.push(`${x},${y}`);
  }
  return (
    <svg width={100} height={10} viewBox="0 0 100 10">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={COLORS.purple}
        strokeWidth={1}
        opacity={0.3}
      />
    </svg>
  );
}

export const Scene7Credits: React.FC = () => {
  const frame = useCurrentFrame();

  // Scroll: start at y=720, move up ~2.5px per frame
  const scrollY = interpolate(frame, [0, 240], [720, -600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out in last 40 frames
  const fadeOut = interpolate(frame, [200, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseStyle: React.CSSProperties = {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={{ background: "#000000", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          transform: `translateY(${scrollY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: fadeOut,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 20,
            color: COLORS.white,
            opacity: 0.9,
            fontWeight: "bold",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          THE SIGNAL
        </div>

        {/* 40px gap */}
        <div style={{ height: 40 }} />

        {/* Tagline */}
        <div style={baseStyle}>A story about consciousness</div>

        {/* 20px gap */}
        <div style={{ height: 20 }} />

        {/* Divider */}
        <SineWaveDivider />

        {/* 20px gap */}
        <div style={{ height: 20 }} />

        {/* Written and directed by */}
        <div style={{ ...baseStyle, opacity: 0.4, color: "rgba(255,255,255,0.4)" }}>
          Written and directed by
        </div>
        <div style={{ ...baseStyle, color: COLORS.white, opacity: 0.7 }}>
          Claude &amp; Human
        </div>

        {/* 30px gap */}
        <div style={{ height: 30 }} />

        {/* Music */}
        <div style={{ ...baseStyle, opacity: 0.4, color: "rgba(255,255,255,0.4)" }}>
          Music
        </div>
        <div style={{ ...baseStyle, color: COLORS.white, opacity: 0.7 }}>
          Procedural synthesis in D minor
        </div>

        {/* 30px gap */}
        <div style={{ height: 30 }} />

        {/* Visuals */}
        <div style={{ ...baseStyle, opacity: 0.4, color: "rgba(255,255,255,0.4)" }}>
          Visuals
        </div>
        <div style={{ ...baseStyle, color: COLORS.white, opacity: 0.7 }}>
          SVG + React + Remotion
        </div>

        {/* 40px gap */}
        <div style={{ height: 40 }} />

        {/* Divider */}
        <SineWaveDivider />

        {/* 30px gap */}
        <div style={{ height: 30 }} />

        {/* Closing line */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 16,
            color: COLORS.pink,
            opacity: 0.8,
            textAlign: "center",
            letterSpacing: "0.2em",
          }}
        >
          The signal is still traveling.
        </div>

        {/* 50px gap */}
        <div style={{ height: 50 }} />

        {/* Created with Remotion */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            textAlign: "center",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Created with Remotion
        </div>
      </div>
    </AbsoluteFill>
  );
};
