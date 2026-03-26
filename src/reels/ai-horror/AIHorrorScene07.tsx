import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, useShake, useZoom, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 7 (24-28s): "The Threat"
 * Text: "YOUR DIGITAL TWIN IS READY" (huge)
 * Visual: Dark red background, text zooms in
 * Audio: Music peaks + bass drop
 * Effect: Screen shake intensifies
 */
export const AIHorrorScene07: React.FC = () => {
  const frame = useCurrentFrame();

  const shake = useShake(frame, 15);
  const scale = useZoom(frame, 0.8, 1.3, 120);
  const textOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const bgOpacity = interpolate(frame, [0, 60], [0, 0.3], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(26, 0, 0, ${bgOpacity})`,
      }}
    >
      {/* Warning glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle, rgba(255,0,0,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${shake.x}px, ${shake.y}px) scale(${scale})`,
          opacity: textOpacity,
        }}
      >
        <CenterText fontSize={130} color={H.bloodRed}>
          YOUR DIGITAL TWIN
        </CenterText>
        <CenterText fontSize={110} color={H.white} top="62%">
          IS READY
        </CenterText>
      </div>

      {/* Bottom warning */}
      {frame > 40 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 36,
              color: H.white,
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            ⚠️ IT CAN REPLACE YOU ⚠️
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
