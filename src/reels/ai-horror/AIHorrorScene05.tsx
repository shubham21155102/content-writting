import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, MirrorEffect, CenterText, useGlitch } from "./helpers-ai-horror";

/**
 * SCENE 5 (12-18s): "Your Digital Twin"
 * Text: "CREATING YOUR CLONE"
 * Visual: Mirror reflection showing AI version of person
 * Audio: Mechanical/robotic sounds
 * Effect: Mirror glitch, face morph effect
 */
export const AIHorrorScene05: React.FC = () => {
  const frame = useCurrentFrame();

  const glitch = useGlitch(frame, 6);
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      {/* Mirror effect */}
      <MirrorEffect frame={frame} />

      {/* Top label */}
      {frame > 20 && (
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              color: H.dim,
              letterSpacing: "3px",
            }}
          >
            DIGITAL TWIN TECHNOLOGY
          </div>
        </div>
      )}

      {/* Main text */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          left: "50%",
          transform: `translate(-50%, -50%) translateX(${glitch.offset}px)`,
          opacity: textOpacity,
        }}
      >
        <CenterText fontSize={90} color={H.white}>
          CREATING YOUR
        </CenterText>
        <CenterText fontSize={110} color={H.bloodRed} top="60%">
          CLONE
        </CenterText>
      </div>

      {/* Progress indicator */}
      {frame > 60 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 40,
              color: H.neonGreen,
            }}
          >
            PROCESSING: {Math.min(100, Math.floor(((frame - 60) / 30) * 100))}%
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
