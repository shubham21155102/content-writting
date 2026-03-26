import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useTypewriterV } from "./helpers-viral";

const FONT_UI = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene13Mirror2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Stat 1: 4.7 hours/day ──
  const s1Spring = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const s1FadeIn = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1FadeOut = interpolate(frame, [70, 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1Op = s1FadeIn * (frame < 120 ? s1FadeOut : 0);

  // ── Stat 2: 23 minutes/day ──
  const s2Spring = spring({ frame: frame - 80, fps, config: { damping: 16 } });
  const s2FadeIn = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2FadeOut = interpolate(frame, [110, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2Op = s2FadeIn * (frame < 160 ? s2FadeOut : 0);

  // ── Comparison mode (frames 120-155) ──
  const compFadeIn = interpolate(frame, [120, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const compFadeOut = interpolate(frame, [150, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const compOp = compFadeIn * compFadeOut;

  // Bar widths for comparison
  const longBarW = interpolate(frame, [120, 140], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shortBarW = interpolate(frame, [125, 140], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── AI Question (frame 160) ──
  const questionText = "Which version did you actually know?";
  const typed = useTypewriterV(questionText, 160, 0.7);
  const qOp = useFadeV(160, 20);

  // Purple glow for the question
  const qGlow = interpolate(frame, [180, 220], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom text ──
  const bt1Op = useFadeV(260, 25);
  const bt2Op = useFadeV(300, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Stat 1 — solo */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s1Op,
          transform: `scale(${0.8 + s1Spring * 0.2})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: 64,
            fontWeight: 900,
            color: V.white,
            letterSpacing: "-0.02em",
          }}
        >
          4.7 hours/day
        </div>
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: 20,
            color: V.dimGray,
            marginTop: 12,
          }}
        >
          crafting their digital self
        </div>
      </div>

      {/* Stat 2 — solo */}
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: s2Op,
          transform: `scale(${0.8 + s2Spring * 0.2})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: 64,
            fontWeight: 900,
            color: V.red,
            letterSpacing: "-0.02em",
          }}
        >
          23 minutes/day
        </div>
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: 20,
            color: V.dimGray,
            marginTop: 12,
          }}
        >
          with you, in person
        </div>
      </div>

      {/* Comparison bars */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          opacity: compOp,
        }}
      >
        {/* Left: 4.7 hours */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30, paddingLeft: 80 }}>
          <div
            style={{
              fontFamily: FONT_UI,
              fontSize: 18,
              color: V.dimWhite,
              width: 160,
              textAlign: "right",
              marginRight: 20,
            }}
          >
            4.7 hours/day
          </div>
          <div
            style={{
              width: longBarW,
              height: 32,
              background: `linear-gradient(90deg, ${V.purple}, ${V.purple}aa)`,
              borderRadius: 6,
            }}
          />
        </div>

        {/* Right: 23 minutes */}
        <div style={{ display: "flex", alignItems: "center", paddingLeft: 80 }}>
          <div
            style={{
              fontFamily: FONT_UI,
              fontSize: 18,
              color: V.dimWhite,
              width: 160,
              textAlign: "right",
              marginRight: 20,
            }}
          >
            23 min/day
          </div>
          <div
            style={{
              width: shortBarW,
              height: 32,
              background: V.white,
              borderRadius: 6,
            }}
          />
        </div>

        {/* Disparity label */}
        <div
          style={{
            textAlign: "center",
            marginTop: 30,
            fontFamily: FONT_UI,
            fontSize: 14,
            color: V.dimGray,
            letterSpacing: "0.2em",
          }}
        >
          THE DISPARITY
        </div>
      </div>

      {/* AI Question */}
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: qOp,
        }}
      >
        <div
          style={{
            fontFamily: FONT_UI,
            fontSize: 32,
            color: V.purple,
            fontWeight: 600,
            textShadow: `0 0 ${qGlow}px ${V.purple}, 0 0 ${qGlow * 2}px ${V.purple}44`,
            letterSpacing: "0.02em",
          }}
        >
          {typed}
          {frame >= 160 && typed.length < questionText.length && typed.length > 0 && (
            <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
        }}
      >
        <div style={{ fontSize: 22, color: V.dimWhite, opacity: bt1Op, marginBottom: 12 }}>
          The AI didn't just mimic a person.
        </div>
        <div style={{ fontSize: 22, color: V.dimWhite, opacity: bt2Op }}>
          It held up a mirror to everyone who knew them.
        </div>
      </div>
    </AbsoluteFill>
  );
};
