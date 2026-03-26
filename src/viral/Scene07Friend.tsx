import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  V,
  useFadeV,
  useTypewriterV,
  ChatBubble,
  TypingIndicator,
} from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene07Friend: React.FC = () => {
  const frame = useCurrentFrame();

  // Header opacity
  const headerOp = useFadeV(0, 10);

  // Cancelled counter
  const cancelCount = frame < 130 ? 0 : frame < 185 ? 1 : frame < 220 ? 2 : 3;
  const counterOp = interpolate(frame, [130, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom text
  const text1 = useTypewriterV("It could mimic your words.", 240, 0.8);
  const text1Op = useFadeV(240, 15);
  const text2 = useTypewriterV("But it couldn't show up.", 270, 0.8);
  const text2Op = useFadeV(270, 15);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Subtle top gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to bottom, rgba(30,30,30,0.6), transparent)",
        }}
      />

      {/* Chat header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: headerOp,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 600,
            color: V.white,
          }}
        >
          Sarah
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: V.green,
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 12,
              color: V.green,
            }}
          >
            Active now
          </span>
        </div>
      </div>

      {/* Round 1 */}
      <ChatBubble
        text="Hey! Wanna grab coffee Saturday?"
        sent={false}
        delay={10}
        y={160}
      />
      <ChatBubble
        text="I'd love to! Been so busy lately 😊"
        sent={true}
        delay={30}
        y={230}
        color={V.blue}
      />
      <ChatBubble
        text="Same place?"
        sent={false}
        delay={45}
        y={300}
      />
      <ChatBubble
        text="You know it! Can't wait ❤️"
        sent={true}
        delay={55}
        y={370}
        color={V.blue}
      />

      {/* Saturday divider */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 12,
          color: V.dimGray,
          opacity: interpolate(frame, [80, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Saturday
      </div>

      {/* Round 2 */}
      <ChatBubble
        text="I'm here! Where are you?"
        sent={false}
        delay={90}
        y={460}
      />
      <TypingIndicator delay={110} y={530} duration={20} />
      <ChatBubble
        text="So sorry! Something came up. Rain check? 🙏"
        sent={true}
        delay={130}
        y={530}
        color={V.blue}
      />

      {/* 2 weeks later divider */}
      <div
        style={{
          position: "absolute",
          top: 590,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 12,
          color: V.dimGray,
          opacity: interpolate(frame, [155, 165], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        2 weeks later
      </div>

      {/* Round 3 */}
      <ChatBubble
        text="Coffee tomorrow? Miss you!"
        sent={false}
        delay={165}
        y={620}
      />
      <ChatBubble
        text="Swamped this week! Soon, promise! 💕"
        sent={true}
        delay={185}
        y={690}
        color={V.blue}
      />

      {/* Cancelled counter */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          right: 100,
          fontFamily: FONT,
          fontSize: 14,
          color: V.red,
          opacity: counterOp,
        }}
      >
        Cancelled: {cancelCount > 0 ? Array.from({ length: cancelCount }, (_, i) => i + 1).join("... ") + "..." : ""}
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 24,
          color: V.dimWhite,
          opacity: text1Op,
        }}
      >
        {text1}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 26,
          color: V.red,
          fontWeight: 700,
          opacity: text2Op,
        }}
      >
        {text2}
      </div>
    </AbsoluteFill>
  );
};
