import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useTypewriterV } from "./helpers-viral";

export const Scene17Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Line 1: "If an AI can be you..." ────────────────────────────────────────
  const line1 = useTypewriterV("If an AI can be you...", 15, 0.5);
  const line1Op = interpolate(frame, [15, 25, 200, 215], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Line 2: "...and no one can tell the difference..." ─────────────────────
  const line2 = useTypewriterV("...and no one can tell the difference...", 65, 0.5);
  const line2Op = interpolate(frame, [65, 75, 200, 215], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Line 3: "...were you ever really here?" ────────────────────────────────
  const line3Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const line3Scale = interpolate(line3Spring, [0, 1], [0.85, 1]);
  const line3Op = interpolate(frame, [150, 160, 200, 215], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Full fade to black at frame 210 ─────────────────────────────────────────
  const blackout = interpolate(frame, [210, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Notification card at frame 230 ──────────────────────────────────────────
  const notifSpring = spring({
    frame: frame - 230,
    fps,
    config: { damping: 16 },
  });
  const notifScale = interpolate(notifSpring, [0, 1], [0.8, 1]);
  const notifOp = interpolate(frame, [230, 240, 285, 292], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title at frame 255 ─────────────────────────────────────────────────────
  const titleSpring = spring({
    frame: frame - 255,
    fps,
    config: { damping: 14 },
  });
  const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);
  const titleOp = interpolate(frame, [255, 265, 285, 292], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Subtitle at frame 275 ──────────────────────────────────────────────────
  const subOp = interpolate(frame, [275, 282, 285, 292], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Final fade to black at 290 ─────────────────────────────────────────────
  const finalBlack = interpolate(frame, [290, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: V.bg }}>
      {/* Phase 1: The questions (frame 15-210) */}
      {frame < 225 && (
        <>
          {/* Line 1 */}
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: line1Op,
              fontFamily: "'Courier New', monospace",
              fontSize: 28,
              color: V.dimWhite,
              letterSpacing: "0.03em",
            }}
          >
            {line1}
            {frame >= 15 && frame < 60 && line1.length < 22 && (
              <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
          </div>

          {/* Line 2 */}
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: line2Op,
              fontFamily: "'Courier New', monospace",
              fontSize: 28,
              color: V.dimWhite,
              letterSpacing: "0.03em",
            }}
          >
            {line2}
            {frame >= 65 && frame < 145 && line2.length < 40 && line2.length > 0 && (
              <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
          </div>

          {/* Line 3 — the big question */}
          <div
            style={{
              position: "absolute",
              top: "54%",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: line3Op,
              transform: `scale(${line3Scale})`,
              fontFamily: "'Courier New', monospace",
              fontSize: 36,
              fontWeight: 700,
              color: V.white,
              letterSpacing: "0.03em",
              textShadow: `0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.15)`,
            }}
          >
            ...were you ever really here?
          </div>
        </>
      )}

      {/* Blackout overlay for transition */}
      {frame >= 210 && frame < 225 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: V.bg,
            opacity: blackout,
          }}
        />
      )}

      {/* Phase 2: Notification + Title (frame 230+) */}
      {frame >= 225 && (
        <>
          {/* Notification card */}
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${notifScale})`,
              opacity: notifOp,
              background: V.card,
              border: `1px solid ${V.cardBorder}`,
              borderRadius: 16,
              padding: "16px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
            }}
          >
            <div style={{ fontSize: 16, color: V.white }}>
              {"📱 Posted 1 minute ago"}
            </div>
            <div style={{ fontSize: 12, color: V.dimGray }}>Or was it you?</div>
          </div>

          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: "52%",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: titleOp,
              transform: `scale(${titleScale})`,
              fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 700,
              color: V.white,
              letterSpacing: "0.1em",
            }}
          >
            I DIED. MY AI KEPT POSTING.
          </div>

          {/* Subtitle */}
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: subOp,
              fontFamily: "'SF Pro', 'Segoe UI', system-ui, sans-serif",
              fontSize: 16,
              color: V.purple,
              letterSpacing: "0.2em",
            }}
          >
            Share this before your AI does.
          </div>
        </>
      )}

      {/* Final fade to black */}
      {frame >= 288 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: V.bg,
            opacity: finalBlack,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
