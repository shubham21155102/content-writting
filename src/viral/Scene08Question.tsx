import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  V,
  useFadeV,
  useTypewriterV,
  ChatBubble,
} from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene08Question: React.FC = () => {
  const frame = useCurrentFrame();

  // Header
  const headerOp = useFadeV(0, 10);

  // Voice note message glow pulse
  const glowPulse =
    frame >= 140
      ? interpolate(Math.sin((frame - 140) * 0.1), [-1, 1], [0.3, 0.8], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Bottom text
  const text1 = useTypewriterV("The first thing it couldn't fake...", 260, 0.8);
  const text1Op = useFadeV(260, 15);
  const text2 = useTypewriterV("...was presence.", 280, 0.8);
  const text2Op = useFadeV(280, 15);

  // Typing indicator visibility: appears 170-195, disappears, reappears 210-225
  const typing1Op = interpolate(
    frame,
    [170, 175, 190, 195],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const typing2Op = interpolate(
    frame,
    [210, 215, 222, 225],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
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

      {/* Worried messages */}
      <ChatBubble
        text="Hey are you okay? We haven't actually hung out in months"
        sent={false}
        delay={10}
        y={120}
      />
      <ChatBubble
        text="I called you. Straight to voicemail."
        sent={false}
        delay={40}
        y={200}
      />
      <ChatBubble
        text="Your posts are great but... something feels off"
        sent={false}
        delay={70}
        y={280}
      />
      <ChatBubble
        text="Are you avoiding me?"
        sent={false}
        delay={100}
        y={360}
      />

      {/* The critical voice note request - with glow */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: 80,
          maxWidth: 520,
          opacity: interpolate(frame - 140, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            background: "#2A2A2E",
            borderRadius: 20,
            padding: "14px 22px",
            fontFamily: FONT,
            fontSize: 18,
            color: V.white,
            lineHeight: 1.5,
            fontWeight: 500,
            boxShadow: `0 0 ${20 + glowPulse * 15}px rgba(255,255,255,${0.05 + glowPulse * 0.08})`,
            border: `1px solid rgba(255,255,255,${0.05 + glowPulse * 0.1})`,
          }}
        >
          {useTypewriterV(
            "Can you send me a voice note? I just need to hear your voice.",
            140,
            1.2
          )}
        </div>
      </div>

      {/* Typing indicator - first appearance */}
      <div
        style={{
          position: "absolute",
          top: 530,
          right: 80,
          opacity: typing1Op,
        }}
      >
        <div
          style={{
            background: V.blue,
            borderRadius: 20,
            padding: "14px 20px",
            display: "flex",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: V.white,
                opacity:
                  0.3 +
                  0.7 *
                    Math.abs(
                      Math.sin((frame - 170) * 0.12 + i * 1.2)
                    ),
              }}
            />
          ))}
        </div>
      </div>

      {/* Typing indicator - second appearance */}
      <div
        style={{
          position: "absolute",
          top: 530,
          right: 80,
          opacity: typing2Op,
        }}
      >
        <div
          style={{
            background: V.blue,
            borderRadius: 20,
            padding: "14px 20px",
            display: "flex",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: V.white,
                opacity:
                  0.3 +
                  0.7 *
                    Math.abs(
                      Math.sin((frame - 210) * 0.12 + i * 1.2)
                    ),
              }}
            />
          ))}
        </div>
      </div>

      {/* Final deflection message */}
      <ChatBubble
        text="I've been dealing with some stuff. Give me time? 💙"
        sent={true}
        delay={240}
        y={530}
        color={V.blue}
      />

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
          fontSize: 28,
          color: V.white,
          fontWeight: 700,
          opacity: text2Op,
        }}
      >
        {text2}
      </div>
    </AbsoluteFill>
  );
};
