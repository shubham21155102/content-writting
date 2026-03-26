import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, DataStream, CenterText, useCount } from "./helpers-ai-horror";

/**
 * SCENE 2 (2-5s): "Your Digital Shadow"
 * Text: "847,293 DATA POINTS" (counting up rapidly)
 * Visual: Scrolling data stream (like Matrix but subtle)
 * Audio: Digital glitch sounds + ticking
 * Effect: Text flickers like broken screen
 */
export const AIHorrorScene02: React.FC = () => {
  const frame = useCurrentFrame();

  const count = useCount(0, 90, 847293, frame);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const flicker = Math.random() > 0.9;

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      {/* Data stream background */}
      <DataStream frame={frame} />

      {/* Label */}
      {frame > 20 && (
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 32,
              color: H.dim,
              letterSpacing: "4px",
              marginBottom: 20,
            }}
          >
            YOUR DIGITAL SHADOW
          </div>
        </div>
      )}

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity,
          filter: flicker ? "brightness(1.5)" : "brightness(1)",
        }}
      >
        <CenterText fontSize={120} color={H.neonGreen}>
          {count.toLocaleString()}
        </CenterText>
      </div>

      {/* Data points label */}
      {frame > 60 && (
        <div
          style={{
            position: "absolute",
            top: 1100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 40,
              color: H.white,
              fontWeight: "bold",
            }}
          >
            DATA POINTS COLLECTED
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
