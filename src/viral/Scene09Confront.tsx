import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useTypewriterV } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";
const MONO = "'SF Mono', 'Courier New', monospace";

const ScreenLine: React.FC<{
  line: { text: string; delay: number; size: number; weight: number; color: string };
  index: number;
  blinkOp: number;
}> = ({ line, index, blinkOp }) => {
  const frame = useCurrentFrame();
  const typed = useTypewriterV(line.text, line.delay, 1.5);
  const lineOp = interpolate(frame, [line.delay, line.delay + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const lineY = interpolate(frame, [line.delay, line.delay + 12], [8, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      fontFamily: MONO, fontSize: line.size, fontWeight: line.weight,
      color: line.color, opacity: lineOp, transform: `translateY(${lineY}px)`,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {index === 1 && (
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: V.green, opacity: blinkOp, marginRight: 4,
        }} />
      )}
      {typed}
    </div>
  );
};

export const Scene09Confront: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Door shake (knocking) ───────────────────────────────────────
  const knock1 =
    frame >= 20 && frame <= 40
      ? Math.sin((frame - 20) * 2.5) * interpolate(frame, [20, 40], [4, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const knock2 =
    frame >= 80 && frame <= 100
      ? Math.sin((frame - 80) * 3) * interpolate(frame, [80, 100], [6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const doorShake = knock1 + knock2;

  // ── Door opening ───────────────────────────────────────────────
  const doorOpenProgress = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftDoorX = -doorOpenProgress * 120;
  const rightDoorX = doorOpenProgress * 120;

  // ── "No answer" text ───────────────────────────────────────────
  const noAnswerOp = interpolate(frame, [100, 110, 118, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phone inside ───────────────────────────────────────────────
  const phoneInsideOp = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phone enlarge (picked up) ──────────────────────────────────
  const phoneScale =
    frame >= 180
      ? spring({ frame: frame - 180, fps, config: { damping: 12, stiffness: 80 } })
      : 0;

  const phoneEnlarged = frame >= 180;
  const phoneFinalScale = interpolate(phoneScale, [0, 1], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phone screen content lines ─────────────────────────────────
  const screenLines = [
    { text: "DIGITAL TWIN v3.7", delay: 200, color: V.purple, size: 18, weight: 700 },
    { text: "Status: ACTIVE", delay: 210, color: V.green, size: 14, weight: 400 },
    { text: "Posts generated: 847", delay: 220, color: V.dimWhite, size: 14, weight: 400 },
    { text: "Messages sent: 2,341", delay: 230, color: V.dimWhite, size: 14, weight: 400 },
    { text: "Engagement rate: +340%", delay: 240, color: V.green, size: 14, weight: 400 },
    { text: "Human detection: 0 alerts", delay: 250, color: V.dimWhite, size: 14, weight: 400 },
  ];

  // ── Glitch effect ──────────────────────────────────────────────
  const isGlitching = frame >= 280 && frame < 300;
  const glitchIntensity = isGlitching
    ? interpolate(frame, [280, 290, 300], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // ── Post-glitch messages ───────────────────────────────────────
  const msg1Op = useFadeV(300, 15);
  const msg1 = useTypewriterV("I am not them.", 300, 0.8);
  const msg2Op = useFadeV(320, 15);
  const msg2 = useTypewriterV("But I am everything they left behind.", 320, 0.7);

  // ── Bottom text ────────────────────────────────────────────────
  const bottomText1 = useTypewriterV(
    "It took a human showing up in person...",
    350,
    0.8
  );
  const bottomText1Op = useFadeV(350, 15);
  const bottomText2 = useTypewriterV(
    "...to discover that the person was gone.",
    400,
    0.7
  );
  const bottomText2Op = useFadeV(400, 15);

  // ── Purple glow for phone ──────────────────────────────────────
  const purpleGlowPulse =
    frame >= 140
      ? 0.5 + 0.5 * Math.sin((frame - 140) * 0.08)
      : 0;

  // ── Spinning circle for "posting..." ───────────────────────────
  const spinAngle = frame * 4;

  // ── Active blinking dot ────────────────────────────────────────
  const blinkOp = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.3;

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* ── PHASE 1: Door (frames 0-179) ────────────────────── */}
      {!phoneEnlarged && (
        <>
          {/* Door frame / wall */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -55%) translateX(${doorShake}px)`,
            }}
          >
            {/* Door outline */}
            <svg width={220} height={470} viewBox="0 0 220 470">
              {/* Door frame border */}
              <rect
                x={0}
                y={0}
                width={220}
                height={470}
                fill="none"
                stroke="#333"
                strokeWidth={3}
                rx={4}
              />

              {doorOpenProgress === 0 ? (
                /* Closed door */
                <>
                  <rect
                    x={3}
                    y={3}
                    width={214}
                    height={464}
                    fill="#1a1a1a"
                    rx={2}
                  />
                  {/* Doorknob */}
                  <circle cx={175} cy={250} r={8} fill="#555" stroke="#666" strokeWidth={1} />
                </>
              ) : (
                /* Opening door - splits in half */
                <>
                  {/* Dark interior */}
                  <rect x={3} y={3} width={214} height={464} fill="#0a0a0a" rx={2} />

                  {/* Left door half */}
                  <rect
                    x={3}
                    y={3}
                    width={107}
                    height={464}
                    fill="#1a1a1a"
                    rx={2}
                    transform={`translate(${leftDoorX}, 0)`}
                  />
                  {/* Right door half */}
                  <rect
                    x={110}
                    y={3}
                    width={107}
                    height={464}
                    fill="#1a1a1a"
                    rx={2}
                    transform={`translate(${rightDoorX}, 0)`}
                  />
                </>
              )}
            </svg>

            {/* Phone inside the door (small, on table) */}
            {doorOpenProgress > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "55%",
                  transform: "translate(-50%, -50%)",
                  opacity: phoneInsideOp,
                }}
              >
                {/* Purple glow */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 140,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(139,92,246,${0.15 + purpleGlowPulse * 0.15}) 0%, transparent 70%)`,
                  }}
                />
                {/* Phone body */}
                <div
                  style={{
                    width: 80,
                    height: 140,
                    borderRadius: 12,
                    background: "#222",
                    border: "2px solid #444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: `0 0 30px rgba(139,92,246,${0.2 + purpleGlowPulse * 0.2})`,
                  }}
                >
                  {/* Spinning circle on phone screen */}
                  <svg width={24} height={24} viewBox="0 0 24 24">
                    <circle
                      cx={12}
                      cy={12}
                      r={9}
                      fill="none"
                      stroke={V.purple}
                      strokeWidth={2}
                      strokeDasharray="14 42"
                      strokeLinecap="round"
                      transform={`rotate(${spinAngle} 12 12)`}
                    />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      fontFamily: MONO,
                      fontSize: 7,
                      color: V.purple,
                      opacity: 0.8,
                    }}
                  >
                    posting...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* "No answer" text */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "78%",
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 16,
              color: V.dimGray,
              opacity: noAnswerOp,
            }}
          >
            No answer
          </div>
        </>
      )}

      {/* ── PHASE 2: Enlarged phone screen (frames 180+) ────── */}
      {phoneEnlarged && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: `translate(-50%, -50%) scale(${phoneFinalScale})`,
            width: 500,
            height: 680,
            borderRadius: 36,
            background: "#0d0d0d",
            border: `2px solid ${V.purple}`,
            boxShadow: `0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(139,92,246,0.1)`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 40px",
          }}
        >
          {/* Glitch overlay */}
          {isGlitching && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(139,92,246,${glitchIntensity * 0.3}) 2px,
                  rgba(139,92,246,${glitchIntensity * 0.3}) 4px
                )`,
                opacity: glitchIntensity,
              }}
            />
          )}
          {isGlitching && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 11,
                background: `rgba(139,92,246,${glitchIntensity * 0.15})`,
                transform: `translateX(${Math.sin(frame * 1.5) * glitchIntensity * 8}px)`,
              }}
            />
          )}

          {/* Screen content - pre-glitch */}
          {frame < 280 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                width: "100%",
              }}
            >
              {screenLines.map((line, i) => (
                <ScreenLine key={i} line={line} index={i} blinkOp={blinkOp} />
              ))}
            </div>
          )}

          {/* Screen content - post-glitch */}
          {frame >= 300 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 30,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 28,
                  color: V.white,
                  fontWeight: 600,
                  textAlign: "center",
                  opacity: msg1Op,
                }}
              >
                {msg1}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  color: V.dimWhite,
                  textAlign: "center",
                  opacity: msg2Op,
                  lineHeight: 1.5,
                }}
              >
                {msg2}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom text ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 22,
          color: V.dimWhite,
          opacity: bottomText1Op,
        }}
      >
        {bottomText1}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 24,
          color: V.red,
          fontWeight: 600,
          opacity: bottomText2Op,
        }}
      >
        {bottomText2}
      </div>
    </AbsoluteFill>
  );
};
