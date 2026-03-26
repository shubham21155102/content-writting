import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// ── Vertical 9:16 (1080x1920) color palette ──────────────────────────────────
export const R = {
  bg: "#000000",
  card: "#111111",
  cardBorder: "#1a1a1a",
  blue: "#1DA1F2",
  red: "#FF3B5C",
  purple: "#8B5CF6",
  green: "#10B981",
  yellow: "#FBBF24",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.6)",
  dimGray: "rgba(255,255,255,0.3)",
  font: "'SF Pro', 'Segoe UI', system-ui, sans-serif" as const,
  mono: "'SF Mono', 'Courier New', monospace" as const,
};

// Screen dimensions for vertical
export const W = 1080;
export const H = 1920;
export const CX = W / 2; // 540
export const CY = H / 2; // 960

export function useFadeR(start: number, dur = 15, from = 0, to = 1) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function useSpringR(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
}

export function useTypeR(text: string, startFrame: number, speed = 1.0) {
  const frame = useCurrentFrame();
  const chars = Math.floor(Math.max(0, frame - startFrame) * speed);
  return text.slice(0, chars);
}

export function useCount(start: number, end: number, from: number, to: number) {
  const frame = useCurrentFrame();
  return Math.floor(interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));
}

/** Notification bubble — vertical optimized (full width) */
export const Notif: React.FC<{
  icon: string; text: string; app: string;
  delay: number; y: number; color?: string;
}> = ({ icon, text, app, delay, y, color = R.blue }) => {
  const s = useSpringR(delay, 16);
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 10, 50, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: y, left: 40, right: 40,
      transform: `translateY(${(1 - s) * 20}px)`,
      opacity: op,
      background: R.card, border: `1px solid ${R.cardBorder}`,
      borderRadius: 18, padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 14,
      fontFamily: R.font,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: color, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ color: R.dimGray, fontSize: 12 }}>{app}</div>
        <div style={{ color: R.white, fontSize: 15 }}>{text}</div>
      </div>
    </div>
  );
};

/** Chat bubble — vertical optimized */
export const Bubble: React.FC<{
  text: string; sent?: boolean; delay: number; y: number; color?: string;
}> = ({ text, sent = false, delay, y, color }) => {
  const s = useSpringR(delay, 14);
  const frame = useCurrentFrame();
  const typed = useTypeR(text, delay, 1.2);
  const op = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bg = color || (sent ? R.blue : "#2A2A2E");
  return (
    <div style={{
      position: "absolute", top: y,
      left: sent ? 200 : 50, right: sent ? 50 : 200,
      opacity: op, transform: `scale(${0.88 + s * 0.12})`,
      transformOrigin: sent ? "right center" : "left center",
    }}>
      <div style={{
        background: bg, borderRadius: 22, padding: "14px 20px",
        fontFamily: R.font, fontSize: 18, color: R.white, lineHeight: 1.5,
      }}>
        {typed}
      </div>
    </div>
  );
};

/** Ghost text — types then dissolves */
export const Ghost: React.FC<{
  text: string; start: number; dissolve: number;
  y?: number; size?: number; color?: string;
}> = ({ text, start, dissolve, y = CY, size = 32, color = R.dim }) => {
  const frame = useCurrentFrame();
  const typed = useTypeR(text, start, 0.8);
  const op = interpolate(frame, [start, start + 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dissolveOp = interpolate(frame, [dissolve, dissolve + 20], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [dissolve, dissolve + 20], [0, 8], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", top: y, left: 0, right: 0,
      textAlign: "center", fontFamily: R.mono,
      fontSize: size, color, opacity: op * dissolveOp,
      filter: `blur(${blur}px)`, letterSpacing: "0.03em",
    }}>
      {typed}
      {frame < dissolve && typed.length > 0 && typed.length < text.length && (
        <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};
