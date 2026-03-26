import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { R, useFadeR, useSpringR, useTypeR, Bubble } from "./helpers-reels";

const TypingDots: React.FC<{ y: number; startFrame: number; endFrame: number }> = ({
  y,
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 50,
        display: "flex",
        gap: 8,
        padding: "14px 20px",
        background: "#2A2A2E",
        borderRadius: 22,
        width: 80,
      }}
    >
      {[0, 1, 2].map((i) => {
        const dotOp = interpolate(
          Math.sin((frame - startFrame + i * 8) * 0.2),
          [-1, 1],
          [0.2, 1]
        );
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: R.dimGray,
              opacity: dotOp,
            }}
          />
        );
      })}
    </div>
  );
};

const DateDivider: React.FC<{ text: string; y: number; showFrame: number }> = ({
  text,
  y,
  showFrame,
}) => {
  const op = useFadeR(showFrame, 10);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: R.font,
        fontSize: 12,
        color: R.dimGray,
        opacity: op,
      }}
    >
      {text}
    </div>
  );
};

export const R06Friend: React.FC = () => {
  const frame = useCurrentFrame();

  // Header
  const headerOp = useFadeR(0, 10);

  // Bottom text
  const text1 = useTypeR("It could mimic your words.", 190, 0.8);
  const text2 = useTypeR("But it couldn't show up.", 210, 0.8);
  const text1Op = useFadeR(190, 12);
  const text2Op = useFadeR(210, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* Header — Sarah */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          opacity: headerOp,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18, color: R.white, fontWeight: "bold" }}>Sarah</span>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: R.green,
          }}
        />
      </div>

      {/* Chat bubbles */}
      <Bubble text="Wanna grab coffee Saturday?" sent={false} delay={8} y={180} />
      <Bubble text="I'd love to! Been so busy 😊" sent={true} delay={22} y={270} />

      <DateDivider text="Saturday" y={360} showFrame={35} />

      <Bubble text="I'm here! Where are you?" sent={false} delay={40} y={400} />
      <Bubble text="Something came up. Rain check? 🙏" sent={true} delay={55} y={490} />

      <DateDivider text="3 weeks later" y={580} showFrame={70} />

      <Bubble
        text="Are you okay? Haven't seen you in months"
        sent={false}
        delay={80}
        y={620}
      />
      <Bubble
        text="I called. Straight to voicemail."
        sent={false}
        delay={95}
        y={720}
      />

      {/* THE KEY MESSAGE — slightly larger via wrapper */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 50,
          right: 200,
          opacity: interpolate(frame - 115, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `scale(${0.88 + useSpringR(115, 14) * 0.12})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            background: "#2A2A2E",
            borderRadius: 22,
            padding: "16px 22px",
            fontFamily: R.font,
            fontSize: 20,
            color: R.white,
            lineHeight: 1.5,
            fontWeight: "bold",
            border: `1px solid ${R.dimGray}`,
          }}
        >
          {useTypeR("Send me a voice note. I need to hear your voice.", 115, 1.2)}
        </div>
      </div>

      {/* Typing dots */}
      <TypingDots y={950} startFrame={135} endFrame={158} />

      {/* Final reply */}
      <Bubble
        text="Dealing with stuff. Give me time? 💙"
        sent={true}
        delay={160}
        y={950}
      />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1650,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          padding: "0 80px",
        }}
      >
        <div style={{ fontSize: 24, color: R.dim, opacity: text1Op, marginBottom: 16 }}>
          {text1}
          {text1.length > 0 && text1.length < "It could mimic your words.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
        <div
          style={{
            fontSize: 26,
            color: R.red,
            fontWeight: "bold",
            opacity: text2Op,
          }}
        >
          {text2}
          {text2.length > 0 && text2.length < "But it couldn't show up.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
