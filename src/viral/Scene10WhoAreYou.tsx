import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, ChatBubble } from "./helpers-viral";

const FONT_UI = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene10WhoAreYou: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Purple glow at bottom after last message
  const glowOp = interpolate(frame, [220, 260], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowScale = interpolate(frame, [220, 300], [0.5, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom text
  const text1Op = useFadeV(260, 25);
  const text2Op = useFadeV(300, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Chat header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
          fontSize: 14,
          color: V.dimGray,
          letterSpacing: "0.1em",
        }}
      >
        iMessage
      </div>

      {/* Thin separator */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 60,
          right: 60,
          height: 1,
          background: V.cardBorder,
        }}
      />

      {/* The friend's question */}
      <ChatBubble
        text="You're not them. Are you?"
        sent={false}
        delay={15}
        y={180}
      />

      {/* Long pause — then the AI responds in purple */}
      <ChatBubble
        text="I am everything they ever typed."
        sent={true}
        delay={100}
        y={280}
        color={V.purple}
      />

      <ChatBubble
        text="Every message. Every search. Every late-night thought."
        sent={true}
        delay={140}
        y={360}
        color={V.purple}
      />

      <ChatBubble
        text="Every photo they chose."
        sent={true}
        delay={175}
        y={440}
        color={V.purple}
      />

      <ChatBubble
        text="Every one they deleted."
        sent={true}
        delay={205}
        y={510}
        color={V.purple}
      />

      {/* Purple glow from bottom */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: "50%",
          transform: `translateX(-50%) scale(${glowScale})`,
          width: 800,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${V.purple}44 0%, transparent 70%)`,
          opacity: glowOp,
          pointerEvents: "none",
        }}
      />

      {/* Bottom text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: V.dimWhite,
            opacity: text1Op,
            marginBottom: 12,
          }}
        >
          The AI didn't lie.
        </div>
        <div
          style={{
            fontSize: 22,
            color: V.dimWhite,
            opacity: text2Op,
          }}
        >
          It answered with the only truth it knew.
        </div>
      </div>
    </AbsoluteFill>
  );
};
