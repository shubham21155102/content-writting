import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, CX, useFadeR, useTypeR } from "./helpers-reels";

const PostCard: React.FC<{
  text: string;
  likes: number;
  delay: number;
  y: number;
  purple?: boolean;
}> = ({ text, likes, delay, y, purple }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const op = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: CX - 400,
        width: 800,
        opacity: op,
        transform: `scale(${0.85 + s * 0.15}) translateY(${(1 - s) * 30}px)`,
      }}
    >
      <div
        style={{
          background: R.card,
          borderRadius: 12,
          padding: 14,
          border: purple ? `1px solid ${R.purple}` : `1px solid ${R.cardBorder}`,
          fontFamily: R.font,
        }}
      >
        <div style={{ color: R.white, fontSize: 17, lineHeight: 1.5 }}>{text}</div>
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            color: purple ? R.purple : R.dimGray,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>❤️</span>
          <span>{likes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export const R05Perfect: React.FC = () => {
  const frame = useCurrentFrame();

  // YOUR POSTS label
  const yourLabelOp = useFadeR(2, 10);
  // AI POSTS label
  const aiLabelOp = useFadeR(35, 10);
  // Divider
  const dividerOp = useFadeR(30, 15);

  // Bottom text
  const text1 = useTypeR("It never posted at 3am.", 120, 0.9);
  const text2 = useTypeR("Never made mistakes.", 145, 0.9);
  const text3 = useTypeR("It was the you you pretended to be.", 170, 0.8);
  const text1Op = useFadeR(120, 12);
  const text2Op = useFadeR(145, 12);
  const text3Op = useFadeR(170, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* YOUR POSTS label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 14,
          color: R.white,
          letterSpacing: "0.3em",
          opacity: yourLabelOp,
        }}
      >
        YOUR POSTS
      </div>

      {/* Your 3 post cards */}
      <PostCard text="cant believe its monday ughhh" likes={12} delay={5} y={160} />
      <PostCard text="3am thoughts: does anyone care" likes={5} delay={15} y={320} />
      <PostCard text="feeling meh tbh" likes={8} delay={25} y={480} />

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: CX - 300,
          width: 600,
          height: 1,
          background: R.white,
          opacity: 0.1 * dividerOp,
        }}
      />

      {/* AI'S POSTS label */}
      <div
        style={{
          position: "absolute",
          top: 750,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 14,
          color: R.purple,
          letterSpacing: "0.3em",
          opacity: aiLabelOp,
        }}
      >
        AI'S POSTS
      </div>

      {/* AI's 3 post cards */}
      <PostCard
        text="Monday motivation: fresh start 🌟"
        likes={247}
        delay={40}
        y={810}
        purple
      />
      <PostCard
        text="Grateful for quiet moments ✨"
        likes={389}
        delay={52}
        y={970}
        purple
      />
      <PostCard
        text="Hardest days teach best lessons 💪"
        likes={512}
        delay={64}
        y={1130}
        purple
      />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          padding: "0 80px",
        }}
      >
        <div style={{ fontSize: 22, color: R.dim, opacity: text1Op, marginBottom: 14 }}>
          {text1}
          {text1.length > 0 && text1.length < "It never posted at 3am.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
        <div style={{ fontSize: 22, color: R.dim, opacity: text2Op, marginBottom: 14 }}>
          {text2}
          {text2.length > 0 && text2.length < "Never made mistakes.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
        <div style={{ fontSize: 24, color: R.red, opacity: text3Op }}>
          {text3}
          {text3.length > 0 &&
            text3.length < "It was the you you pretended to be.".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
