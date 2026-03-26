import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useTypewriterV, GhostText } from "./helpers-viral";

const FONT_UI = "'SF Pro', 'Segoe UI', system-ui, sans-serif";
const FONT_MONO = "'Courier New', monospace";

interface DeletedMessage {
  text: string;
  typeStart: number;
  dissolveStart: number;
  dissolveDuration: number;
}

const messages: DeletedMessage[] = [
  { text: "I miss you", typeStart: 20, dissolveStart: 50, dissolveDuration: 15 },
  { text: "I'm sorry for what I said", typeStart: 70, dissolveStart: 105, dissolveDuration: 15 },
  { text: "I don't think I'm okay", typeStart: 120, dissolveStart: 155, dissolveDuration: 25 },
  { text: "Does anyone actually care?", typeStart: 170, dissolveStart: 210, dissolveDuration: 18 },
  {
    text: "I love you more than I know how to say",
    typeStart: 230,
    dissolveStart: 275,
    dissolveDuration: 35,
  },
];

const InputFieldMessage: React.FC<{ msg: DeletedMessage }> = ({ msg }) => {
  const frame = useCurrentFrame();

  const typed = useTypewriterV(msg.text, msg.typeStart, 1.0);

  // Visible only during this message's lifecycle
  const isTyping = frame >= msg.typeStart && frame < msg.dissolveStart + msg.dissolveDuration + 5;

  // Dissolve: text turns red, blurs, fades
  const dissolveProgress = interpolate(
    frame,
    [msg.dissolveStart, msg.dissolveStart + msg.dissolveDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textColor = interpolate(dissolveProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blur = interpolate(dissolveProgress, [0, 1], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(dissolveProgress, [0, 0.2, 1], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yShift = interpolate(dissolveProgress, [0, 1], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor blink while typing
  const showCursor =
    frame >= msg.typeStart &&
    frame < msg.dissolveStart &&
    typed.length > 0 &&
    typed.length < msg.text.length;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  if (!isTyping) return null;

  // Color interpolation: white to red
  const r = Math.round(interpolate(textColor, [0, 1], [255, 255]));
  const g = Math.round(interpolate(textColor, [0, 1], [255, 59]));
  const b = Math.round(interpolate(textColor, [0, 1], [255, 92]));

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 20px",
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateY(${yShift}px)`,
      }}
    >
      <span
        style={{
          fontFamily: FONT_UI,
          fontSize: 18,
          color: `rgb(${r}, ${g}, ${b})`,
          letterSpacing: "0.01em",
        }}
      >
        {typed}
        {showCursor && (
          <span style={{ opacity: cursorBlink ? 1 : 0, color: V.dimWhite }}>|</span>
        )}
      </span>
    </div>
  );
};

export const Scene12Deleted: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Input field springs in
  const fieldSpring = spring({ frame: frame - 5, fps, config: { damping: 18 } });

  // Ghost texts floating upward — remnants of dissolved messages
  const ghostMessages = messages.map((msg, i) => {
    const ghostStart = msg.dissolveStart + msg.dissolveDuration - 5;
    return (
      <GhostText
        key={i}
        text={msg.text}
        startFrame={ghostStart}
        dissolveFrame={ghostStart + 20}
        y={380 - i * 8}
        color="rgba(255,255,255,0.12)"
        size={16}
      />
    );
  });

  // Blinking cursor in empty field after all messages done
  const allDone = frame > 310;
  const emptyBlink = allDone && Math.floor(frame / 15) % 2 === 0;

  // Bottom text
  const text1Op = useFadeV(310, 25);
  const text2Op = useFadeV(350, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Ghost texts floating above */}
      {ghostMessages}

      {/* Text input field */}
      <div
        style={{
          position: "absolute",
          top: 480,
          left: "50%",
          transform: `translateX(-50%) scale(${0.9 + fieldSpring * 0.1})`,
          width: 600,
          height: 50,
          background: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: 25,
          overflow: "hidden",
          opacity: interpolate(fieldSpring, [0, 1], [0, 1]),
        }}
      >
        {/* Render current active message */}
        {messages.map((msg, i) => (
          <InputFieldMessage key={i} msg={msg} />
        ))}

        {/* Empty cursor after all messages */}
        {allDone && (
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 2,
                height: 22,
                background: V.dimWhite,
                opacity: emptyBlink ? 0.6 : 0,
              }}
            />
          </div>
        )}
      </div>

      {/* Placeholder text in field */}
      {allDone && (
        <div
          style={{
            position: "absolute",
            top: 480,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 50,
            display: "flex",
            alignItems: "center",
            paddingLeft: 32,
            fontFamily: FONT_UI,
            fontSize: 15,
            color: "rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        >
          Message
        </div>
      )}

      {/* Bottom text overlay */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_MONO,
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: V.dimWhite,
            opacity: text1Op,
            marginBottom: 16,
            letterSpacing: "0.02em",
          }}
        >
          The version of you that the world saw...
        </div>
        <div
          style={{
            fontSize: 28,
            color: V.white,
            fontWeight: 700,
            opacity: text2Op,
            letterSpacing: "0.02em",
          }}
        >
          ...was never the whole story.
        </div>
      </div>
    </AbsoluteFill>
  );
};
