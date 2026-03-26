import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { R, useFadeR, useSpringR, useTypeR } from "./helpers-reels";

export const R11Final: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Notification card (frames 0-70) ──
  const notifOp = interpolate(frame, [0, 15, 60, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const notifSpring = useSpringR(5, 14);
  const subOp = interpolate(frame, [30, 42, 60, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Title words (frame 90+) ──
  const word1 = useSpringR(90, 14);  // I
  const word2 = useSpringR(95, 14);  // DIED.
  const word3 = useSpringR(105, 14); // MY
  const word4 = useSpringR(110, 14); // AI
  const word5 = useSpringR(115, 14); // KEPT
  const word6 = useSpringR(120, 14); // POSTING.

  const titleOp = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Divider (frame 140) ──
  const dividerWidth = interpolate(frame, [140, 155], [0, 400], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dividerOp = useFadeR(140, 10);

  // ── CTA (frame 155) ──
  const ctaOp = useFadeR(155, 12);
  const ctaTyped = useTypeR("Share this before your AI does.", 155, 0.7);

  // ── Follow (frame 180) ──
  const followOp = useFadeR(180, 12);

  // ── Purple glow pulse (frame 200+) ──
  const glowPulse = frame >= 200
    ? 0.03 + Math.sin((frame - 200) * 0.06) * 0.015
    : 0;

  // ── Final fade out (last 30 frames) ──
  const fadeOut = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const wordStyle = (s: number): React.CSSProperties => ({
    display: "inline-block",
    transform: `translateY(${(1 - s) * 30}px)`,
    opacity: s,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg, opacity: fadeOut }}>

      {/* Purple glow behind title */}
      {frame >= 200 && (
        <div style={{
          position: "absolute", top: 500, left: 0, right: 0, bottom: 500,
          background: `radial-gradient(ellipse 600px 400px at 50% 50%, rgba(139,92,246,${glowPulse}), transparent)`,
        }} />
      )}

      {/* Notification card */}
      {frame < 70 && (
        <div style={{
          position: "absolute", top: 770, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
          opacity: notifOp,
        }}>
          <div style={{
            transform: `translateY(${(1 - notifSpring) * 20}px)`,
            background: R.card, border: `1px solid ${R.cardBorder}`,
            borderRadius: 16, padding: "14px 20px",
            fontFamily: R.font, fontSize: 16, color: R.white,
          }}>
            {"📱"} Posted 1 minute ago
          </div>
          <div style={{
            marginTop: 12, fontFamily: R.font, fontSize: 13,
            color: R.dimGray, opacity: subOp,
          }}>
            Or was it you?
          </div>
        </div>
      )}

      {/* Title */}
      {frame >= 90 && (
        <div style={{
          position: "absolute", top: 700, left: 0, right: 0,
          textAlign: "center", opacity: titleOp,
          fontFamily: R.font, fontWeight: "bold", fontSize: 52,
          color: R.white, letterSpacing: "0.08em",
          lineHeight: 1.4,
        }}>
          <div>
            <span style={wordStyle(word1)}>I </span>
            <span style={wordStyle(word2)}>DIED.</span>
          </div>
          <div>
            <span style={wordStyle(word3)}>MY </span>
            <span style={wordStyle(word4)}>AI </span>
            <span style={wordStyle(word5)}>KEPT </span>
            <span style={wordStyle(word6)}>POSTING.</span>
          </div>
        </div>
      )}

      {/* Divider */}
      {frame >= 140 && (
        <div style={{
          position: "absolute", top: 900, left: 0, right: 0,
          display: "flex", justifyContent: "center", opacity: dividerOp,
        }}>
          <div style={{
            width: dividerWidth, height: 1,
            background: "rgba(255,255,255,0.1)",
          }} />
        </div>
      )}

      {/* CTA */}
      {frame >= 155 && (
        <div style={{
          position: "absolute", top: 940, left: 60, right: 60,
          textAlign: "center", opacity: ctaOp,
          fontFamily: R.font, fontSize: 18, color: R.purple,
          letterSpacing: "0.2em", lineHeight: 1.5,
        }}>
          {ctaTyped}
          {ctaTyped.length > 0 &&
            ctaTyped.length < "Share this before your AI does.".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      )}

      {/* Follow */}
      {frame >= 180 && (
        <div style={{
          position: "absolute", top: 1010, left: 0, right: 0,
          textAlign: "center", opacity: followOp,
          fontFamily: R.font, fontSize: 14, color: R.dimGray,
        }}>
          Follow for more
        </div>
      )}
    </AbsoluteFill>
  );
};
