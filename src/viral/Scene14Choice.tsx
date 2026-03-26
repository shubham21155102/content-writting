import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useTypewriterV } from "./helpers-viral";

const FONT_UI = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene14Choice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Modal spring in
  const modalSpring = spring({ frame: frame - 3, fps, config: { damping: 16 } });
  const modalOp = interpolate(frame, [3, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Warning icon
  const iconOp = useFadeV(5, 10);
  // Title
  const titleOp = useFadeV(15, 10);
  // Subtitle
  const subOp = useFadeV(25, 10);
  // Buttons
  const btnOp = useFadeV(35, 12);

  // Cursor movement between buttons (frames 50-130)
  // Oscillates between YES (left) and NO (right)
  const cursorActive = frame >= 50 && frame <= 130;
  const cursorOp = interpolate(frame, [50, 55, 125, 130], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor X: oscillate between YES button (~-70) and NO button (~70)
  const cursorPhase = frame >= 50 ? (frame - 50) * 0.04 : 0;
  const cursorBaseX = Math.sin(cursorPhase) * 70;
  // Trembling
  const trembleX = Math.sin(frame * 0.7) * 2 + Math.cos(frame * 1.1) * 1.5;
  const trembleY = Math.cos(frame * 0.9) * 1.5 + Math.sin(frame * 1.3) * 1;
  const cursorX = cursorBaseX + trembleX;
  const cursorY = trembleY;

  // New text input below modal (frame 140+)
  const inputSpring = spring({ frame: frame - 140, fps, config: { damping: 18 } });
  const inputOp = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Friend types into input
  const friendText = "Tell me something they never posted. Something real.";
  const friendTyped = useTypewriterV(friendText, 145, 0.9);
  const friendCursorShow =
    frame >= 145 && friendTyped.length > 0 && friendTyped.length < friendText.length;

  // AI response (frame 200)
  const aiResponseOp = useFadeV(200, 25);
  const aiText = "They were afraid of being forgotten.";
  const aiTyped = useTypewriterV(aiText, 200, 0.6);

  // Bottom text
  const bottomOp = useFadeV(250, 25);

  // Modal fades slightly when input appears
  const modalDim = interpolate(frame, [140, 160], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Modal dialog */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: `translateX(-50%) scale(${0.85 + modalSpring * 0.15})`,
          width: 500,
          background: "#111",
          border: "1px solid #333",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          opacity: modalOp * modalDim,
          fontFamily: FONT_UI,
        }}
      >
        {/* Warning icon */}
        <div style={{ fontSize: 48, marginBottom: 16, opacity: iconOp }}>
          ⚠️
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: V.white,
            marginBottom: 10,
            opacity: titleOp,
          }}
        >
          DELETE DIGITAL TWIN?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 14,
            color: V.dimGray,
            marginBottom: 30,
            opacity: subOp,
          }}
        >
          This action cannot be undone.
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            opacity: btnOp,
            position: "relative",
          }}
        >
          <div
            style={{
              padding: "12px 36px",
              borderRadius: 10,
              background: V.red,
              color: V.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            YES
          </div>
          <div
            style={{
              padding: "12px 36px",
              borderRadius: 10,
              background: "transparent",
              border: `1px solid ${V.white}`,
              color: V.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            NO
          </div>

          {/* Hovering cursor */}
          {cursorActive && (
            <div
              style={{
                position: "absolute",
                top: 45 + cursorY,
                left: `calc(50% + ${cursorX}px)`,
                opacity: cursorOp,
                fontSize: 16,
                transform: "rotate(-20deg)",
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}
            >
              ▲
            </div>
          )}
        </div>
      </div>

      {/* Text input below modal */}
      <div
        style={{
          position: "absolute",
          top: 530,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - inputSpring) * 20}px)`,
          width: 520,
          opacity: inputOp,
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #444",
            borderRadius: 14,
            padding: "14px 20px",
            fontFamily: FONT_UI,
            fontSize: 16,
            color: V.white,
            minHeight: 24,
          }}
        >
          {friendTyped}
          {friendCursorShow && (
            <span
              style={{
                opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                color: V.dimWhite,
              }}
            >
              |
            </span>
          )}
        </div>

        {/* AI response */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: FONT_UI,
            fontSize: 22,
            color: V.purple,
            opacity: aiResponseOp,
            letterSpacing: "0.01em",
            textShadow: `0 0 20px ${V.purple}44`,
          }}
        >
          {aiTyped}
          {frame >= 200 && aiTyped.length > 0 && aiTyped.length < aiText.length && (
            <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
          fontSize: 24,
          color: V.dimWhite,
          opacity: bottomOp,
          letterSpacing: "0.04em",
          fontStyle: "italic",
        }}
      >
        And that was the most human thing the AI ever said.
      </div>
    </AbsoluteFill>
  );
};
