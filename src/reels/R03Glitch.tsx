import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, H, CY, useFadeR } from "./helpers-reels";

const AI_NOTIFS = [
  { text: "📤 Scheduled post published", y: 700, delay: 90 },
  { text: "↩️ Auto-reply sent", y: 770, delay: 102 },
  { text: "📸 Story shared", y: 840, delay: 112 },
  // Accelerated burst
  { text: "📊 Analytics updated", y: 930, delay: 118 },
  { text: "💬 Comment replied", y: 1000, delay: 121 },
  { text: "🔄 Repost scheduled", y: 1090, delay: 123 },
  { text: "📱 Status updated", y: 1180, delay: 125 },
  { text: "🎯 Engagement optimized", y: 1280, delay: 127 },
  { text: "📈 Followers acquired", y: 1400, delay: 129 },
];

export const R03Glitch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glitch displacement
  let screenX = 0;
  if (frame >= 55 && frame < 58) screenX = 30;
  if (frame >= 60 && frame < 63) screenX = -50;

  // Screen tear effect
  const showTear = (frame >= 55 && frame < 58) || (frame >= 60 && frame < 63);

  // Post card opacity (visible frames 0-54)
  const postOp = interpolate(frame, [0, 5, 50, 55], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Heart fade
  const heartOp = useFadeR(20, 10);

  // AI notifications visible after frame 90
  const showAI = frame >= 90;

  // Freeze at frame 125
  const isFrozen = frame >= 125 && frame < 130;

  // Final text
  const finalTextSpring = spring({
    frame: frame - 130,
    fps,
    config: { damping: 12 },
  });
  const finalTextOp = interpolate(frame, [130, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${screenX}px)`,
        }}
      >
        {/* Social post card (frames 0-54) */}
        {frame < 65 && (
          <div
            style={{
              position: "absolute",
              top: 400,
              left: 40,
              right: 40,
              backgroundColor: R.card,
              border: `1px solid ${R.cardBorder}`,
              borderRadius: 16,
              padding: 20,
              opacity: postOp,
              fontFamily: R.font,
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#333",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ color: R.white, fontSize: 16, fontWeight: "bold" }}>You</div>
                <div style={{ color: R.dimGray, fontSize: 12 }}>Just now</div>
              </div>
            </div>

            {/* Post content */}
            <div style={{ color: R.dim, fontSize: 18, lineHeight: 1.5, marginBottom: 14 }}>
              Beautiful sunset tonight 🌅
            </div>

            {/* Like count */}
            <div style={{ color: R.red, fontSize: 15, opacity: heartOp }}>
              ❤️ 103
            </div>
          </div>
        )}

        {/* Static noise overlay during glitch */}
        {showTear && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.1,
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.3) 2px, rgba(255,0,0,0.3) 4px)",
            }}
          />
        )}

        {/* Red scanline during glitch */}
        {showTear && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 3,
              top: interpolate(
                frame % 8,
                [0, 8],
                [0, H],
                { extrapolateRight: "clamp" }
              ),
              backgroundColor: R.red,
              opacity: 0.6,
            }}
          />
        )}

        {/* AI notifications (after blackout) */}
        {showAI &&
          !isFrozen &&
          AI_NOTIFS.map((notif, i) => {
            const nOp = interpolate(
              frame - notif.delay,
              [0, 8],
              [0, i < 3 ? 0.7 : 0.3 + Math.random() * 0.2],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: notif.y,
                  left: 80,
                  right: 80,
                  textAlign: "center",
                  fontFamily: R.font,
                  fontSize: i < 3 ? 16 : 14,
                  color: i < 3 ? R.dimGray : R.purple,
                  opacity: frame >= 125 ? nOp : nOp,
                }}
              >
                {notif.text}
              </div>
            );
          })}
      </div>

      {/* Final text */}
      {frame >= 130 && (
        <div
          style={{
            position: "absolute",
            top: CY - 20,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: R.font,
            fontSize: 32,
            fontWeight: "bold",
            color: R.white,
            opacity: finalTextOp,
            transform: `scale(${0.8 + finalTextSpring * 0.2})`,
          }}
        >
          But your phone didn't.
        </div>
      )}
    </AbsoluteFill>
  );
};
