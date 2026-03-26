import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, useFadeR, useTypeR } from "./helpers-reels";

const DAYS = [
  { label: "DAY 1", frame: 0, post: "Morning coffee ☕ Ready for the day!", likes: 127 },
  { label: "DAY 7", frame: 30, post: "Sunday vibes. Grateful 💫", likes: 234 },
  { label: "DAY 30", frame: 70, post: "New month, new goals 🔥", likes: 389 },
  { label: "DAY 60", frame: 120, post: "Travel plans coming together ✈️", likes: 512 },
  { label: "DAY 90", frame: 170, post: "Life is beautiful. Never forget 🌻", likes: 743 },
];

const COMMENTS = [
  { text: "You seem happier lately!", frame: 80 },
  { text: "Love your energy! 🙌", frame: 130 },
];

export const R04Nobody: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine current day index
  let currentDayIdx = 0;
  for (let i = DAYS.length - 1; i >= 0; i--) {
    if (frame >= DAYS[i].frame) {
      currentDayIdx = i;
      break;
    }
  }

  const currentDay = DAYS[currentDayIdx];
  const nextDay = DAYS[currentDayIdx + 1];

  // Day label animation
  const daySpring = spring({
    frame: frame - currentDay.frame,
    fps,
    config: { damping: 14 },
  });

  // Fade out when next day arrives
  const dayOpacity = nextDay
    ? interpolate(frame, [nextDay.frame - 8, nextDay.frame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Card animation
  const cardSpring = spring({
    frame: frame - currentDay.frame,
    fps,
    config: { damping: 16 },
  });

  const cardOpacity = nextDay
    ? interpolate(frame, [nextDay.frame - 8, nextDay.frame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Bottom text
  const line1 = useTypeR("For 90 days, nobody noticed you were gone.", 185, 0.9);
  const line1Op = useFadeR(185, 12);
  const line2 = useTypeR("The AI was better at being you.", 215, 0.9);
  const line2Op = useFadeR(215, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* Day counter */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 64,
          fontWeight: "bold",
          color: R.white,
          letterSpacing: "0.1em",
          opacity: dayOpacity,
          transform: `scale(${0.9 + daySpring * 0.1})`,
        }}
      >
        {currentDay.label}
      </div>

      {/* Post card */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 50,
          right: 50,
          backgroundColor: R.card,
          border: `1px solid ${R.cardBorder}`,
          borderRadius: 14,
          padding: 20,
          fontFamily: R.font,
          opacity: cardOpacity,
          transform: `scale(${0.9 + cardSpring * 0.1})`,
          transformOrigin: "center top",
        }}
      >
        {/* Avatar line */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "#333",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ color: R.white, fontSize: 14, fontWeight: "bold" }}>You</div>
            <div style={{ color: R.dimGray, fontSize: 11 }}>{currentDay.label}</div>
          </div>
        </div>

        {/* Post text */}
        <div
          style={{
            color: R.dim,
            fontSize: 16,
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {currentDay.post}
        </div>

        {/* Likes */}
        <div style={{ color: R.red, fontSize: 14 }}>
          ❤️ {currentDay.likes}
        </div>
      </div>

      {/* Comments */}
      {COMMENTS.map((comment, i) => {
        const cOp = interpolate(frame - comment.frame, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const cSpring = spring({
          frame: frame - comment.frame,
          fps,
          config: { damping: 14 },
        });
        // Fade out comment eventually
        const cFade = interpolate(
          frame,
          [comment.frame + 40, comment.frame + 50],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 780 + i * 60,
              left: 70,
              right: 70,
              textAlign: "center",
              fontFamily: R.font,
              fontSize: 14,
              color: R.dimGray,
              opacity: cOp * cFade,
              transform: `translateY(${(1 - cSpring) * 15}px)`,
            }}
          >
            {comment.text}
          </div>
        );
      })}

      {/* Bottom line 1 */}
      <div
        style={{
          position: "absolute",
          top: 1550,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 24,
          color: R.white,
          padding: "0 50px",
          opacity: line1Op,
          lineHeight: 1.5,
        }}
      >
        {line1}
        {line1.length > 0 &&
          line1.length < "For 90 days, nobody noticed you were gone.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
      </div>

      {/* Bottom line 2 */}
      <div
        style={{
          position: "absolute",
          top: 1650,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 20,
          color: R.red,
          padding: "0 50px",
          opacity: line2Op,
          lineHeight: 1.5,
        }}
      >
        {line2}
        {line2.length > 0 &&
          line2.length < "The AI was better at being you.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
      </div>
    </AbsoluteFill>
  );
};
