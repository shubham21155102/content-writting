import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useTypewriterV } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

const yourPosts = [
  { text: "cant believe its monday ughhh", likes: 12 },
  { text: "3am thoughts: does anyone actually care", likes: 5 },
  { text: "sory for the rant. bad day.", likes: 3 },
  { text: "feeling meh tbh", likes: 8 },
];

const aiPosts = [
  { text: "Monday motivation: every week is a fresh start 🌟", likes: 247 },
  { text: "Grateful for the quiet moments that shape us ✨", likes: 389 },
  { text: "Sometimes the hardest days teach the best lessons 💪", likes: 512 },
  { text: "Feeling thankful for all of you today 💙", likes: 634 },
];

const PostCard: React.FC<{
  text: string;
  likes: number;
  delay: number;
  x: number;
  y: number;
  purple?: boolean;
}> = ({ text, likes, delay, x, y, purple }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  const op = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const likeCount = Math.floor(
    interpolate(frame, [delay + 10, delay + 50], [0, likes], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 300,
        opacity: op,
        transform: `translateY(${(1 - s) * 25}px)`,
        background: V.card,
        border: `1px solid ${purple ? V.purple : V.cardBorder}`,
        borderRadius: 14,
        padding: "14px 18px",
        fontFamily: FONT,
        boxShadow: purple
          ? `0 0 20px rgba(139,92,246,0.25), 0 0 40px rgba(139,92,246,0.1)`
          : "none",
      }}
    >
      <div
        style={{
          color: V.dimWhite,
          fontSize: 14,
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        {text}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: V.red,
          fontSize: 13,
        }}
      >
        <span>❤️</span>
        <span>{likeCount}</span>
      </div>
    </div>
  );
};

export const Scene06Perfect: React.FC = () => {
  const frame = useCurrentFrame();

  // Headers
  const headerOp = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Engagement chart points (ascending line)
  const chartProgress = interpolate(frame, [80, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartPoints = [
    { x: 0, y: 80 },
    { x: 30, y: 65 },
    { x: 60, y: 55 },
    { x: 90, y: 35 },
    { x: 120, y: 15 },
    { x: 150, y: 0 },
  ];

  const visiblePoints = chartPoints.filter(
    (_, i) => i <= Math.floor(chartProgress * (chartPoints.length - 1))
  );
  const pathD = visiblePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Vertical divider
  const dividerOp = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom text
  const text1 = useTypewriterV("It never posted at 3am.", 160, 0.8);
  const text1Op = useFadeV(160, 15);
  const text2 = useTypewriterV("Never overshared. Never made mistakes.", 200, 0.8);
  const text2Op = useFadeV(200, 15);
  const text3 = useTypewriterV(
    "It was the you that you always pretended to be.",
    250,
    0.8
  );
  const text3Op = useFadeV(250, 15);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Left header */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 60,
          opacity: headerOp,
          color: V.white,
          fontSize: 14,
          fontFamily: FONT,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 600,
          width: 300,
          textAlign: "center",
        }}
      >
        YOUR POSTS
      </div>

      {/* Right header */}
      <div
        style={{
          position: "absolute",
          left: 950,
          top: 60,
          opacity: headerOp,
          color: V.purple,
          fontSize: 14,
          fontFamily: FONT,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontWeight: 600,
          width: 300,
          textAlign: "center",
        }}
      >
        AI'S POSTS
      </div>

      {/* Left column - your posts */}
      {yourPosts.map((post, i) => (
        <PostCard
          key={`yours-${i}`}
          text={post.text}
          likes={post.likes}
          delay={20 + i * 18}
          x={300}
          y={110 + i * 110}
          purple={false}
        />
      ))}

      {/* Right column - AI posts */}
      {aiPosts.map((post, i) => (
        <PostCard
          key={`ai-${i}`}
          text={post.text}
          likes={post.likes}
          delay={30 + i * 18}
          x={950}
          y={110 + i * 110}
          purple={true}
        />
      ))}

      {/* Center vertical line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 80,
          width: 1,
          height: 460,
          background: `linear-gradient(to bottom, transparent, ${V.cardBorder}, transparent)`,
          opacity: dividerOp,
          transform: "translateX(-50%)",
        }}
      />

      {/* Engagement chart at center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 250,
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [70, 90], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <svg width={160} height={90} viewBox="-5 -5 160 90">
          {pathD.length > 0 && (
            <path
              d={pathD}
              fill="none"
              stroke={V.green}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* Arrow at end */}
          {chartProgress > 0.9 && (
            <polygon
              points="145,-5 155,0 145,5"
              fill={V.green}
              opacity={interpolate(frame, [145, 155], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          )}
        </svg>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 22,
          color: V.dimWhite,
          opacity: text1Op,
        }}
      >
        {text1}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 22,
          color: V.dimWhite,
          opacity: text2Op,
        }}
      >
        {text2}
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
          opacity: text3Op,
        }}
      >
        {text3}
      </div>
    </AbsoluteFill>
  );
};
