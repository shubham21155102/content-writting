import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, useHeartbeat, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 3 (5-8s): "It Knows"
 * Text: "WHERE YOU LIVE", "WHAT YOU FEAR", "WHO YOU LOVE" (appears one by one)
 * Visual: Dark background, text pulses with heartbeat
 * Audio: Heartbeat sound getting louder
 * Effect: Chromatic aberration on text
 */
export const AIHorrorScene03: React.FC = () => {
  const frame = useCurrentFrame();

  const heartbeat = useHeartbeat(frame);

  const texts = [
    "WHERE YOU LIVE",
    "WHAT YOU FEAR",
    "WHO YOU LOVE",
  ];

  const currentTextIndex = Math.min(Math.floor(frame / 30), texts.length - 1);
  const currentText = texts[currentTextIndex];

  const textOpacity = interpolate(frame % 30, [0, 10, 20, 30], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      {/* Main text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: textOpacity,
        }}
      >
        <CenterText fontSize={100} color={H.bloodRed}>
          {currentText}
        </CenterText>
      </div>

      {/* Heartbeat visual */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 150,
          opacity: heartbeat.opacity,
          transform: `translateX(-50%) scale(${heartbeat.scale})`,
        }}
      >
        ❤️
      </div>

      {/* Label */}
      {frame > 10 && (
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              color: H.dim,
              letterSpacing: "2px",
            }}
          >
            AI KNOWS EVERYTHING
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
