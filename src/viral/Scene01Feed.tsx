import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useTypewriterV, useCount, Notification } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

const notifications = [
  { icon: "💬", text: "Sarah sent you a message", app: "Messages", delay: 5, y: 80, color: V.green },
  { icon: "❤️", text: "alex_design liked your photo", app: "Instagram", delay: 17, y: 160, color: V.red },
  { icon: "📧", text: "Meeting at 3pm tomorrow", app: "Gmail", delay: 29, y: 240, color: V.blue },
  { icon: "🐦", text: "+47 new followers", app: "Twitter", delay: 41, y: 320, color: V.blue },
  { icon: "📱", text: "Mom is calling...", app: "Phone", delay: 53, y: 400, color: V.green },
  { icon: "💰", text: "Payment received: $2,847", app: "Bank", delay: 65, y: 480, color: V.green },
  { icon: "🎵", text: "Your 2025 Wrapped is ready", app: "Spotify", delay: 77, y: 560 },
];

export const Scene01Feed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = useCount(10, 180, 0, 847293);
  const counterOp = useFadeV(10, 20);

  const typeText = "Every day, you create a digital version of yourself.";
  const typed = useTypewriterV(typeText, 100, 0.8);
  const textOp = useFadeV(100, 15);

  // Pulse glow after frame 160
  const pulseIntensity = frame > 160
    ? interpolate(Math.sin((frame - 160) * 0.08), [-1, 1], [0.6, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Notifications */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          opacity: pulseIntensity,
          filter: frame > 160
            ? `brightness(${interpolate(Math.sin((frame - 160) * 0.1), [-1, 1], [0.9, 1.15], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })})`
            : undefined,
        }}
      >
        {notifications.map((n, i) => (
          <Notification key={i} {...n} />
        ))}
      </div>

      {/* Counter top-right */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 80,
          opacity: counterOp,
          fontFamily: FONT,
          textAlign: "right",
        }}
      >
        <div
          style={{
            color: V.dimGray,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          YOUR DIGITAL FOOTPRINT:
        </div>
        <div
          style={{
            color: V.white,
            fontSize: 36,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {count.toLocaleString()}
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 24,
          color: V.dimWhite,
          opacity: textOp,
        }}
      >
        {typed}
        {typed.length > 0 && typed.length < typeText.length && (
          <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
