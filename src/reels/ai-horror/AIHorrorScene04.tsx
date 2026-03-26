import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, useGlitch, Microphone, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 4 (8-12s): "Right Now"
 * Text: "IT'S LISTENING" (with microphone icon)
 * Visual: Microphone animation + sound wave
 * Audio: Phone microphone activation sound
 * Effect: Screen glitch + color distortion
 */
export const AIHorrorScene04: React.FC = () => {
  const frame = useCurrentFrame();

  const glitch = useGlitch(frame, 4);
  const textOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: glitch.isGlitch ? "#1a0000" : H.bg,
        transition: "background-color 0.1s",
      }}
    >
      {/* Microphone with sound wave */}
      <Microphone frame={frame} />

      {/* Main text */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "50%",
          transform: `translate(-50%, -50%) translateX(${glitch.offset}px)`,
          opacity: textOpacity,
        }}
      >
        <CenterText fontSize={110} color={H.bloodRed}>
          IT'S LISTENING
        </CenterText>
      </div>

      {/* Warning */}
      {frame > 40 && (
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 32,
              color: H.neonGreen,
              fontWeight: "bold",
              animation: "blink 0.5s infinite",
            }}
          >
            ⚠️ RIGHT NOW ⚠️
          </div>
        </div>
      )}

      {/* Glitch overlay */}
      {glitch.isGlitch && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(255, 0, 0, ${Math.random() * 0.2})`,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
