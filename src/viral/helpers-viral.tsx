import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// ── Color palette — dark mode social media aesthetic ─────────────────────────
export const V = {
  bg: "#000000",
  card: "#111111",
  cardBorder: "#222222",
  blue: "#1DA1F2",     // notification blue
  red: "#FF3B5C",      // like/heart red
  purple: "#8B5CF6",   // AI purple
  green: "#10B981",    // online/active green
  yellow: "#FBBF24",   // warning
  white: "#FFFFFF",
  gray: "#6B7280",
  dimWhite: "rgba(255,255,255,0.6)",
  dimGray: "rgba(255,255,255,0.3)",
  ghostText: "rgba(255,255,255,0.08)",
};

// ── Animation helpers ────────────────────────────────────────────────────────
export function useFadeV(start: number, dur = 20, from = 0, to = 1) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function useSpringV(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
}

export function useTypewriterV(text: string, startFrame: number, charsPerFrame = 0.8) {
  const frame = useCurrentFrame();
  const chars = Math.floor(Math.max(0, frame - startFrame) * charsPerFrame);
  return text.slice(0, chars);
}

export function useCount(startFrame: number, endFrame: number, from: number, to: number) {
  const frame = useCurrentFrame();
  return Math.floor(interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));
}

// ── Reusable UI components ───────────────────────────────────────────────────

/** Phone notification bubble */
export const Notification: React.FC<{
  icon: string; text: string; app: string;
  delay: number; y?: number; color?: string;
}> = ({ icon, text, app, delay, y = 0, color = V.blue }) => {
  const s = useSpringV(delay, 16);
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 15, 60, 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: y, left: "50%",
      transform: `translateX(-50%) translateY(${(1 - s) * 30}px) scale(${0.9 + s * 0.1})`,
      opacity: op,
      background: V.card, border: `1px solid ${V.cardBorder}`,
      borderRadius: 16, padding: "14px 22px",
      display: "flex", alignItems: "center", gap: 14,
      width: 420, fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: V.dimGray, fontSize: 11, marginBottom: 3 }}>{app}</div>
        <div style={{ color: V.white, fontSize: 14 }}>{text}</div>
      </div>
    </div>
  );
};

/** iMessage-style chat bubble */
export const ChatBubble: React.FC<{
  text: string; sent?: boolean; delay: number; y?: number; color?: string;
}> = ({ text, sent = false, delay, y = 0, color }) => {
  const s = useSpringV(delay, 14);
  const frame = useCurrentFrame();
  const displayed = useTypewriterV(text, delay, 1.2);
  const op = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bgColor = color || (sent ? V.blue : "#2A2A2E");

  return (
    <div style={{
      position: "absolute", top: y,
      left: sent ? "auto" : 80, right: sent ? 80 : "auto",
      maxWidth: 500,
      opacity: op,
      transform: `scale(${0.85 + s * 0.15})`,
      transformOrigin: sent ? "right center" : "left center",
    }}>
      <div style={{
        background: bgColor, borderRadius: 20,
        padding: "12px 20px",
        fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
        fontSize: 17, color: V.white, lineHeight: 1.5,
      }}>
        {displayed}
      </div>
    </div>
  );
};

/** Typing indicator (...) */
export const TypingIndicator: React.FC<{
  delay: number; y?: number; duration?: number;
}> = ({ delay, y = 0, duration = 60 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [delay, delay + 10, delay + duration - 10, delay + duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: y, left: 80,
      opacity: op,
    }}>
      <div style={{
        background: "#2A2A2E", borderRadius: 20,
        padding: "14px 20px",
        display: "flex", gap: 5,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: V.dimWhite,
            opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame - delay) * 0.12 + i * 1.2)),
          }} />
        ))}
      </div>
    </div>
  );
};

/** Social media post card */
export const SocialPost: React.FC<{
  avatar?: string; name: string; time: string; content: string;
  likes?: number; delay: number; y?: number;
}> = ({ avatar = "👤", name, time, content, likes = 0, delay, y = 0 }) => {
  const s = useSpringV(delay, 14);
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const likeCount = useCount(delay + 20, delay + 80, 0, likes);

  return (
    <div style={{
      position: "absolute", top: y, left: "50%",
      transform: `translateX(-50%) translateY(${(1 - s) * 20}px)`,
      opacity: op, width: 500,
      background: V.card, border: `1px solid ${V.cardBorder}`,
      borderRadius: 16, padding: "18px 22px",
      fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "#333", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>{avatar}</div>
        <div>
          <div style={{ color: V.white, fontSize: 15, fontWeight: 600 }}>{name}</div>
          <div style={{ color: V.dimGray, fontSize: 12 }}>{time}</div>
        </div>
      </div>
      <div style={{ color: V.dimWhite, fontSize: 16, lineHeight: 1.5, marginBottom: 14 }}>
        {content}
      </div>
      {likes > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: V.red, fontSize: 14 }}>
          <span>❤️</span>
          <span>{likeCount.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

/** Ghost text — types then dissolves */
export const GhostText: React.FC<{
  text: string; startFrame: number; dissolveFrame: number;
  y?: number; color?: string; size?: number;
}> = ({ text, startFrame, dissolveFrame, y = 360, color = V.dimWhite, size = 28 }) => {
  const frame = useCurrentFrame();
  const typed = useTypewriterV(text, startFrame, 0.7);
  const dissolveOp = interpolate(frame, [dissolveFrame, dissolveFrame + 25], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const typeOp = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [dissolveFrame, dissolveFrame + 25], [0, 8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      position: "absolute", top: y,
      left: 0, right: 0, textAlign: "center",
      fontFamily: "'Courier New', monospace",
      fontSize: size, color,
      opacity: typeOp * dissolveOp,
      filter: `blur(${blur}px)`,
      letterSpacing: "0.05em",
    }}>
      {typed}
      {frame < dissolveFrame && typed.length > 0 && typed.length < text.length && (
        <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};

/** Large stat number with label */
export const StatNumber: React.FC<{
  value: string; label: string; delay: number; y?: number; color?: string;
}> = ({ value, label, delay, y = 300, color = V.white }) => {
  const s = useSpringV(delay, 16);
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: y,
      left: 0, right: 0, textAlign: "center",
      opacity: op,
      transform: `scale(${0.8 + s * 0.2})`,
    }}>
      <div style={{
        fontFamily: "'SF Pro', system-ui, sans-serif",
        fontSize: 72, fontWeight: 900, color,
        letterSpacing: "-0.02em",
      }}>{value}</div>
      <div style={{
        fontFamily: "'SF Pro', system-ui, sans-serif",
        fontSize: 18, color: V.dimGray,
        letterSpacing: "0.15em", textTransform: "uppercase",
        marginTop: 12,
      }}>{label}</div>
    </div>
  );
};
