import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, useGlitch, CameraAperture, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 1 (0-2s): HOOK - "The Eye"
 * Text: "IT'S WATCHING" (huge, blood red)
 * Visual: Black background, camera lens aperture animation
 * Audio: Deep bass hit + digital hum
 * Effect: Subtle screen shake
 */
export const AIHorrorScene01: React.FC = () => {
  const frame = useCurrentFrame();

  const textOpacity = Math.min(1, frame / 15);
  const shake = useGlitch(frame, 5);

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      {/* Camera aperture */}
      <CameraAperture frame={frame} />

      {/* Main text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateX(${shake.offset}px)`,
          opacity: textOpacity,
        }}
      >
        <CenterText fontSize={140} color={H.bloodRed}>
          IT'S WATCHING
        </CenterText>
      </div>

      {/* Bottom hint */}
      {frame > 30 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            color: H.dim,
            opacity: Math.min(1, (frame - 30) / 20),
          }}
        >
          Your digital footprint starts here
        </div>
      )}
    </AbsoluteFill>
  );
};
