import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useTypewriterV, useFadeV } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

// Day markers with their frames and posts
const days = [
  {
    label: "DAY 1",
    frame: 0,
    posts: [
      { text: "Morning coffee \u2615 Ready to take on the day!", likes: 127 },
    ],
    comments: [],
  },
  {
    label: "DAY 7",
    frame: 45,
    posts: [
      { text: "Sunday vibes. Grateful for good friends \u{1F4AB}", likes: 234 },
    ],
    comments: ["You've been posting great content lately!"],
  },
  {
    label: "DAY 30",
    frame: 100,
    posts: [
      { text: "New month, new goals. Let's do this \u{1F525}", likes: 389 },
    ],
    comments: ["Love your energy this week!"],
  },
  {
    label: "DAY 60",
    frame: 180,
    posts: [
      { text: "Travel plans coming together! Stay tuned \u2708\uFE0F", likes: 512 },
    ],
    comments: ["Are you doing something different? You seem happier"],
  },
  {
    label: "DAY 90",
    frame: 260,
    posts: [
      { text: "Life is beautiful. Never forget that \u{1F33B}", likes: 743 },
    ],
    comments: [],
  },
];

export const Scene05Nobody: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine active day
  let activeDayIdx = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (frame >= days[i].frame) {
      activeDayIdx = i;
      break;
    }
  }
  const activeDay = days[activeDayIdx];

  // Day label animation
  const dayScale = spring({
    frame: frame - activeDay.frame,
    fps,
    config: { damping: 12 },
  });
  const dayOp = interpolate(frame - activeDay.frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Previous day fade out
  const prevDayOp =
    activeDayIdx > 0
      ? interpolate(frame, [activeDay.frame - 15, activeDay.frame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const prevDay = activeDayIdx > 0 ? days[activeDayIdx - 1] : null;

  // Post cards
  const postDelay = activeDay.frame + 15;
  const postSpring = spring({
    frame: frame - postDelay,
    fps,
    config: { damping: 14 },
  });
  const postOp = interpolate(frame - postDelay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Likes counter — counts up from 0 to target
  const likesTarget = activeDay.posts[0]?.likes || 0;
  const likesVal = Math.floor(
    interpolate(frame, [postDelay + 5, postDelay + 40], [0, likesTarget], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Comments
  const commentElements = activeDay.comments.map((c, i) => {
    const cDelay = postDelay + 30 + i * 15;
    const cOp = interpolate(frame - cDelay, [0, 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const cSpring = spring({
      frame: frame - cDelay,
      fps,
      config: { damping: 14 },
    });
    return (
      <div
        key={i}
        style={{
          opacity: cOp,
          transform: `translateY(${(1 - cSpring) * 10}px)`,
          fontFamily: FONT,
          fontSize: 12,
          color: V.dimGray,
          marginTop: 8,
          paddingLeft: 12,
          fontStyle: "italic",
        }}
      >
        "{c}"
      </div>
    );
  });

  // Final texts
  const text1 = "For 90 days, nobody noticed you were gone.";
  const typed1 = useTypewriterV(text1, 300, 0.8);
  const text1Op = useFadeV(300, 15);

  const text2 = "The AI was better at being you than you ever were.";
  const typed2 = useTypewriterV(text2, 345, 0.8);
  const text2Op = useFadeV(345, 15);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Previous day fading out */}
      {prevDay && prevDayOp > 0 && (
        <div
          style={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 900,
            color: V.white,
            opacity: prevDayOp,
            letterSpacing: "-0.02em",
          }}
        >
          {prevDay.label}
        </div>
      )}

      {/* Active day label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "50%",
          transform: `translateX(-50%) scale(${0.7 + dayScale * 0.3})`,
          fontFamily: FONT,
          fontSize: 60,
          fontWeight: 900,
          color: V.white,
          opacity: dayOp,
          letterSpacing: "-0.02em",
        }}
      >
        {activeDay.label}
      </div>

      {/* Thin line separator */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 1,
          backgroundColor: V.cardBorder,
          opacity: dayOp,
        }}
      />

      {/* Post card */}
      {activeDay.posts.map((post, i) => (
        <div
          key={`${activeDayIdx}-${i}`}
          style={{
            position: "absolute",
            top: 260,
            left: "50%",
            transform: `translateX(-50%) translateY(${(1 - postSpring) * 20}px)`,
            opacity: postOp,
            width: 520,
            backgroundColor: V.card,
            border: `1px solid ${V.cardBorder}`,
            borderRadius: 16,
            padding: "20px 24px",
            fontFamily: FONT,
          }}
        >
          {/* Post header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              👤
            </div>
            <div>
              <div style={{ color: V.white, fontSize: 14, fontWeight: 600 }}>You</div>
              <div style={{ color: V.dimGray, fontSize: 11 }}>{activeDay.label}</div>
            </div>
          </div>

          {/* Post content */}
          <div
            style={{
              color: V.dimWhite,
              fontSize: 16,
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            {post.text}
          </div>

          {/* Likes */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: V.red,
              fontSize: 14,
            }}
          >
            <span>❤️</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{likesVal}</span>
          </div>

          {/* Comments */}
          {commentElements}
        </div>
      ))}

      {/* Bottom texts */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 28,
          color: V.white,
          opacity: text1Op,
        }}
      >
        {typed1}
        {typed1.length > 0 && typed1.length < text1.length && (
          <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 22,
          color: V.red,
          opacity: text2Op,
        }}
      >
        {typed2}
        {typed2.length > 0 && typed2.length < text2.length && (
          <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
