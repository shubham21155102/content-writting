import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useTypewriterV } from "./helpers-viral";

// ── Notification rain fragment ───────────────────────────────────────────────
const RainFragment: React.FC<{
  text: string;
  color: string;
  x: number;
  startY: number;
  speed: number;
  delay: number;
}> = ({ text, color, x, startY, speed, delay }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const y = startY + elapsed * speed;
  const screenH = 1080;

  // Fade in at start, dissolve + blur near bottom
  const fadeIn = interpolate(elapsed, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dissolve = interpolate(y, [screenH - 200, screenH], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(y, [screenH - 200, screenH], [0, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (y > screenH || elapsed < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: fadeIn * dissolve * 0.2,
        filter: `blur(${blur}px)`,
        fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
        fontSize: 13,
        color,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// ── Post card inside phone ───────────────────────────────────────────────────
const FeedPost: React.FC<{
  y: number;
  width: number;
  height: number;
  timeText: string;
  likes: number;
  color: string;
  scrollOffset: number;
}> = ({ y, width, height, timeText, likes, color, scrollOffset }) => {
  const frame = useCurrentFrame();
  const likeDisplay = Math.floor(
    interpolate(frame, [30, 200], [likes * 0.6, likes], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const posY = y - scrollOffset;

  if (posY < -height || posY > 750) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: posY,
        left: 20,
        width: width - 40,
        height,
        borderRadius: 12,
        background: color,
        overflow: "hidden",
        padding: 14,
      }}
    >
      {/* Faint text lines */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: `${70 - i * 15}%`,
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.08)",
            marginBottom: 8,
            marginTop: i === 0 ? 10 : 0,
          }}
        />
      ))}
      {/* Bottom row */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 14,
          right: 14,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: 10,
          color: "rgba(255,255,255,0.25)",
        }}
      >
        <span>{timeText}</span>
        <span style={{ color: V.red }}>
          {"❤️ "}
          {likeDisplay.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ── Main scene ───────────────────────────────────────────────────────────────
export const Scene15Continue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scroll feed upward over time
  const scrollOffset = interpolate(frame, [0, 300], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.15, 0.3]);

  // Generate rain fragments once
  const fragments = useMemo(() => {
    const texts = [
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
      "🔔 mentioned",
      "+1 follower",
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
      "🔔 mentioned",
      "+1 follower",
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
      "🔔 mentioned",
      "+1 follower",
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
      "🔔 mentioned",
      "+1 follower",
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
      "🔔 mentioned",
      "+1 follower",
      "❤️ liked",
      "💬 replied",
      "📤 shared",
      "👁 viewed",
    ];
    const colors = [V.blue, V.red, V.purple, V.green, V.blue, V.red];
    return texts.map((text, i) => ({
      text,
      color: colors[i % colors.length],
      x: 60 + ((i * 173 + i * i * 7) % 1800), // pseudo-random x spread
      startY: -30 - ((i * 47) % 200),
      speed: 1.2 + ((i * 31) % 20) / 10, // 1.2 - 3.2 px/frame
      delay: (i * 7) % 60, // staggered start
    }));
  }, []);

  // Text overlays - typewriter
  const line1 = useTypewriterV("The likes kept coming.", 60, 0.8);
  const line2 = useTypewriterV("The comments kept flowing.", 100, 0.8);
  const line3 = useTypewriterV("But was any of it real?", 160, 0.8);
  const line4 = useTypewriterV("Or was it always just... noise?", 210, 0.7);

  const fade1 = interpolate(frame, [60, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade2 = interpolate(frame, [100, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade3 = interpolate(frame, [160, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade4 = interpolate(frame, [210, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Feed posts inside phone
  const posts = [
    { y: 30, height: 130, timeText: "Posted 2m ago", likes: 1284, color: "rgba(255,255,255,0.03)" },
    { y: 175, height: 110, timeText: "Posted 15m ago", likes: 843, color: "rgba(255,255,255,0.04)" },
    { y: 300, height: 140, timeText: "Posted 1h ago", likes: 2091, color: "rgba(255,255,255,0.03)" },
    { y: 455, height: 120, timeText: "Posted 3h ago", likes: 567, color: "rgba(255,255,255,0.04)" },
    { y: 590, height: 130, timeText: "Posted 6h ago", likes: 3412, color: "rgba(255,255,255,0.03)" },
  ];

  return (
    <AbsoluteFill style={{ background: V.bg }}>
      {/* Notification rain — behind the phone */}
      {fragments.map((f, i) => (
        <RainFragment key={i} {...f} />
      ))}

      {/* Purple glow behind phone */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 850,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${V.purple}${Math.round(glowPulse * 255)
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Phone mockup */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 750,
          background: "#0a0a0a",
          border: `1px solid ${V.cardBorder}`,
          borderRadius: 40,
          overflow: "hidden",
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: V.dimGray,
            fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          Feed
        </div>

        {/* Scrolling feed */}
        <div style={{ position: "relative", width: "100%", height: 706, overflow: "hidden" }}>
          {posts.map((post, i) => (
            <FeedPost key={i} {...post} width={400} scrollOffset={scrollOffset} />
          ))}
        </div>
      </div>

      {/* Text overlays */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          opacity: fade1,
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: 22,
          color: V.dimWhite,
        }}
      >
        {line1}
      </div>

      <div
        style={{
          position: "absolute",
          top: 120,
          left: 80,
          opacity: fade2,
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: 22,
          color: V.dimWhite,
        }}
      >
        {line2}
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          textAlign: "center",
          transform: "translateY(-50%)",
          opacity: fade3,
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: 28,
          color: V.white,
          zIndex: 10,
          textShadow: "0 0 40px rgba(139,92,246,0.4)",
        }}
      >
        {line3}
      </div>

      <div
        style={{
          position: "absolute",
          top: "56%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fade4,
          fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
          fontSize: 24,
          color: V.dimGray,
          zIndex: 10,
        }}
      >
        {line4}
      </div>
    </AbsoluteFill>
  );
};
