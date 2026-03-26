import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { R, useFadeR, useSpringR, useTypeR } from "./helpers-reels";

export const R09Question: React.FC = () => {
  const frame = useCurrentFrame();

  // ── TOP SECTION: Two big stats (frames 0-100) ──

  // Stat 1: "4.7 hours/day" visible frames 5-45, then fades
  const stat1Op = interpolate(frame, [5, 15, 40, 50], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const stat1Scale = interpolate(frame, [5, 15], [0.8, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Stat 2: "23 minutes/day" visible frames 45-80, then both show
  const stat2Op = interpolate(frame, [45, 55, 75, 85], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const stat2Scale = interpolate(frame, [45, 55], [0.8, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Both bars visible (frames 80-100)
  const barsOp = interpolate(frame, [80, 88, 95, 105], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const longBarWidth = interpolate(frame, [80, 92], [0, 600], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const shortBarWidth = interpolate(frame, [85, 95], [0, 50], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── MIDDLE: The question (frames 100-180) ──
  const questionTyped = useTypeR("Which version did you actually know?", 105, 0.5);
  const questionOp = useFadeR(105, 12);

  // ── BOTTOM: Modal card (frames 180-280) ──
  const cardSpring = useSpringR(185, 12);
  const cardOp = interpolate(frame, [185, 195], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const inputTyped = useTypeR("Tell me something they never posted.", 195, 0.8);
  const responseOp = interpolate(frame, [225, 235], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const responseTyped = useTypeR("They were afraid of being forgotten.", 225, 0.6);

  // ── Very bottom line ──
  const closerTyped = useTypeR("The most human thing the AI ever said.", 260, 0.6);
  const closerOp = useFadeR(260, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>

      {/* Stat 1: 4.7 hours/day */}
      {frame < 85 && (
        <div style={{
          position: "absolute", top: 300, left: 0, right: 0,
          textAlign: "center", opacity: stat1Op,
          transform: `scale(${stat1Scale})`,
        }}>
          <div style={{
            fontFamily: R.font, fontSize: 56, fontWeight: "bold",
            color: R.white,
          }}>
            4.7 hours/day
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 18, color: R.dimGray, marginTop: 10,
          }}>
            crafting their digital self
          </div>
        </div>
      )}

      {/* Stat 2: 23 minutes/day */}
      {frame >= 45 && frame < 85 && (
        <div style={{
          position: "absolute", top: 300, left: 0, right: 0,
          textAlign: "center", opacity: stat2Op,
          transform: `scale(${stat2Scale})`,
        }}>
          <div style={{
            fontFamily: R.font, fontSize: 56, fontWeight: "bold",
            color: R.red,
          }}>
            23 minutes/day
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 18, color: R.dimGray, marginTop: 10,
          }}>
            with you, in person
          </div>
        </div>
      )}

      {/* Both bars comparison */}
      {frame >= 80 && frame < 110 && (
        <div style={{
          position: "absolute", top: 520, left: 0, right: 0,
          opacity: barsOp, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: longBarWidth, height: 12, borderRadius: 6,
              background: R.purple,
            }} />
            <div style={{
              fontFamily: R.font, fontSize: 14, color: R.dimGray, whiteSpace: "nowrap",
            }}>4.7 hrs</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: shortBarWidth, height: 12, borderRadius: 6,
              background: R.white,
            }} />
            <div style={{
              fontFamily: R.font, fontSize: 14, color: R.dimGray, whiteSpace: "nowrap",
            }}>23 min</div>
          </div>
        </div>
      )}

      {/* The question */}
      {frame >= 105 && (
        <div style={{
          position: "absolute", top: 750, left: 60, right: 60,
          textAlign: "center", opacity: questionOp,
          fontFamily: R.font, fontSize: 30, color: R.purple,
          textShadow: `0 0 20px rgba(139,92,246,0.4)`,
          lineHeight: 1.5,
        }}>
          {questionTyped}
          {questionTyped.length > 0 &&
            questionTyped.length < "Which version did you actually know?".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      )}

      {/* Modal card */}
      {frame >= 185 && (
        <div style={{
          position: "absolute", top: 1020, left: 50, right: 50,
          opacity: cardOp,
          transform: `translateY(${(1 - cardSpring) * 30}px)`,
          background: R.card, border: `1px solid ${R.cardBorder}`,
          borderRadius: 20, padding: 30,
        }}>
          {/* Input field */}
          <div style={{
            background: "#1a1a1a", border: "1px solid #333",
            borderRadius: 12, padding: 12, width: "100%",
            fontFamily: R.font, fontSize: 16, color: R.white,
            lineHeight: 1.5,
          }}>
            {inputTyped}
            {inputTyped.length > 0 &&
              inputTyped.length < "Tell me something they never posted.".length && (
                <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0, color: R.dimGray }}>|</span>
              )}
          </div>

          {/* AI response */}
          {frame >= 225 && (
            <div style={{
              marginTop: 20, fontFamily: R.font, fontSize: 20,
              color: R.purple, opacity: responseOp, lineHeight: 1.6,
            }}>
              {responseTyped}
              {responseTyped.length > 0 &&
                responseTyped.length < "They were afraid of being forgotten.".length && (
                  <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
                )}
            </div>
          )}
        </div>
      )}

      {/* Very bottom closer */}
      {frame >= 260 && (
        <div style={{
          position: "absolute", top: 1700, left: 60, right: 60,
          textAlign: "center", opacity: closerOp,
          fontFamily: R.font, fontSize: 20, color: R.dim,
          lineHeight: 1.5,
        }}>
          {closerTyped}
          {closerTyped.length > 0 &&
            closerTyped.length < "The most human thing the AI ever said.".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      )}
    </AbsoluteFill>
  );
};
