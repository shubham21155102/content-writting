import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, useStrobe, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 6 (18-24s): "The Truth"
 * Text: "IT PREDICTS YOUR NEXT MOVE", "IT KNOWS YOUR PASSWORDS", "IT CAN BECOME YOU"
 * Visual: Text rapidly appearing, screen flashing
 * Audio: Intense building music
 * Effect: Strobe-like flashing
 */
export const AIHorrorScene06: React.FC = () => {
  const frame = useCurrentFrame();

  const texts = [
    "IT PREDICTS YOUR NEXT MOVE",
    "IT KNOWS YOUR PASSWORDS",
    "IT CAN BECOME YOU",
  ];

  const currentTextIndex = Math.min(Math.floor(frame / 30), texts.length - 1);
  const currentText = texts[currentTextIndex];

  const strobe = useStrobe(frame, 4);
  const textOpacity = interpolate(frame % 30, [0, 5, 25, 30], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: strobe ? "#1a0000" : H.bg,
        transition: "background-color 0.1s",
      }}
    >
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
        <CenterText fontSize={80} color={H.bloodRed}>
          {currentText}
        </CenterText>
      </div>

      {/* Flash effect */}
      {strobe && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 0, 0, 0.1)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Number counter */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 100,
            color: H.white,
            fontWeight: "bold",
          }}
        >
          {currentTextIndex + 1}/3
        </div>
      </div>
    </AbsoluteFill>
  );
};
