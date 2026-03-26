import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useSpringV, useTypewriterV } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

// Scattered notification texts for the flood
const floodTexts = [
  "Reply sent", "Post liked", "Story viewed", "Message read", "Photo shared",
  "Comment posted", "Status updated", "Tweet published", "Story reacted",
  "DM replied", "Post scheduled", "Photo uploaded", "Check-in shared",
  "Event RSVP'd", "Article shared", "Profile updated", "Reel posted",
  "Thread replied", "Poll voted", "Link shared", "Emoji reacted",
  "Group posted", "Memory shared", "Review posted",
];

// Pre-computed random positions and sizes for flood notifications
const floodItems = floodTexts.map((text, i) => ({
  text,
  x: 80 + ((i * 347 + 123) % 1700),
  y: 60 + ((i * 251 + 77) % 900),
  size: 10 + ((i * 13) % 7),
  opacity: 0.3 + ((i * 17) % 4) * 0.1,
  delay: 140 + ((i * 7) % 60),
}));

// Ordered early notifications
const earlyNotifications = [
  { text: "📤 Scheduled post published", frame: 60 },
  { text: "↩️ Auto-reply sent", frame: 85 },
  { text: "📸 Story shared", frame: 105 },
  { text: "💬 Comment posted", frame: 120 },
];

// Accelerating notifications (frames 130-140)
const accelNotifications = [
  { text: "📱 Status updated", frame: 130, y: 300 },
  { text: "❤️ Post liked", frame: 133, y: 450 },
  { text: "🔄 Repost shared", frame: 136, y: 200 },
  { text: "📝 Draft published", frame: 138, y: 600 },
];

export const Scene04Moment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress bar at bottom — AI takeover
  const barWidth = interpolate(frame, [60, 200], [0, 1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barOp = interpolate(frame, [60, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final text
  const finalText = "But your phone didn't.";
  const finalOp = interpolate(frame, [210, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalScale = spring({
    frame: frame - 210,
    fps,
    config: { damping: 12 },
  });

  // Freeze at frame 200
  const isFrozen = frame >= 200 && frame < 210;

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* PURE BLACK for first 60 frames — nothing rendered */}

      {/* Early notifications — center, one at a time */}
      {earlyNotifications.map((n, i) => {
        const fadeIn = interpolate(frame, [n.frame, n.frame + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(frame, [n.frame + 15, n.frame + 30], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const glow = interpolate(
          Math.sin((frame - n.frame) * 0.15),
          [-1, 1],
          [0.5, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        // Don't show during flood or freeze
        if (frame >= 140) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: FONT,
              fontSize: 14,
              color: V.dimGray,
              opacity: fadeIn * fadeOut * glow,
              whiteSpace: "nowrap",
            }}
          >
            {n.text}
          </div>
        );
      })}

      {/* Accelerating notifications (130-140) */}
      {frame >= 130 && frame < 200 &&
        accelNotifications.map((n, i) => {
          const op = interpolate(frame, [n.frame, n.frame + 5, 195, 200], [0, 0.6, 0.6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`acc-${i}`}
              style={{
                position: "absolute",
                top: n.y,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: FONT,
                fontSize: 13,
                color: V.purple,
                opacity: op,
                whiteSpace: "nowrap",
              }}
            >
              {n.text}
            </div>
          );
        })}

      {/* THE FLOOD: frames 140-200 */}
      {frame >= 140 && !isFrozen &&
        floodItems.map((item, i) => {
          const itemOp = interpolate(frame, [item.delay, item.delay + 5], [0, item.opacity], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // Gentle downward drift
          const drift = interpolate(frame, [item.delay, item.delay + 60], [0, 30], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`flood-${i}`}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y + drift,
                fontFamily: FONT,
                fontSize: item.size,
                color: V.purple,
                opacity: itemOp,
                whiteSpace: "nowrap",
              }}
            >
              {item.text}
            </div>
          );
        })}

      {/* Frozen flood at frame 200-210 */}
      {isFrozen &&
        floodItems.map((item, i) => {
          const frozenOp = item.delay <= 200 ? item.opacity : 0;
          const drift = interpolate(200, [item.delay, item.delay + 60], [0, 30], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={`frozen-${i}`}
              style={{
                position: "absolute",
                left: item.x,
                top: item.y + drift,
                fontFamily: FONT,
                fontSize: item.size,
                color: V.purple,
                opacity: frozenOp,
                whiteSpace: "nowrap",
              }}
            >
              {item.text}
            </div>
          );
        })}

      {/* Purple takeover line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: barWidth,
          height: 2,
          backgroundColor: V.purple,
          opacity: barOp,
        }}
      />

      {/* Final text: "But your phone didn't." */}
      {frame >= 210 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${0.8 + finalScale * 0.2})`,
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 700,
            color: V.white,
            opacity: finalOp,
            whiteSpace: "nowrap",
          }}
        >
          But your phone didn't.
        </div>
      )}
    </AbsoluteFill>
  );
};
