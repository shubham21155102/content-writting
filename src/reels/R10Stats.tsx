import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { R, useFadeR, useSpringR, useTypeR } from "./helpers-reels";

export const R10Stats: React.FC = () => {
  const frame = useCurrentFrame();

  // ── SECTION 1: Stats one at a time (frames 0-150) ──

  // Stat 1: 2.1 BILLION (frames 5-50)
  const s1Spring = useSpringR(5, 14);
  const s1Op = interpolate(frame, [5, 15, 42, 52], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const s1Scale = interpolate(frame, [42, 52], [1, 0.85], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Stat 2: 170+ YEARS (frames 55-100)
  const s2Spring = useSpringR(55, 14);
  const s2Op = interpolate(frame, [55, 65, 92, 102], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const s2Scale = interpolate(frame, [92, 102], [1, 0.85], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Stat 3: BY 2030 (frames 105-150)
  const s3Spring = useSpringR(105, 14);
  const s3Op = interpolate(frame, [105, 115, 142, 152], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const s3Scale = interpolate(frame, [142, 152], [1, 0.85], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── SECTION 2: The final question (frames 155-280) ──
  const line1 = useTypeR("If an AI can be you...", 160, 0.4);
  const line1Op = useFadeR(160, 10);

  const line2 = useTypeR("...and no one can tell the difference...", 195, 0.4);
  const line2Op = useFadeR(195, 10);

  const line3Op = interpolate(frame, [240, 250], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const line3Scale = interpolate(frame, [240, 255], [0.9, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Final fade out
  const fadeOut = interpolate(frame, [275, 300], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg, opacity: fadeOut }}>

      {/* Stat 1: 2.1 BILLION */}
      {frame >= 5 && frame < 55 && (
        <div style={{
          position: "absolute", top: 600, left: 60, right: 60,
          textAlign: "center", opacity: s1Op,
          transform: `scale(${s1Spring * (frame < 42 ? 1 : s1Scale)})`,
        }}>
          <div style={{
            fontFamily: R.font, fontSize: 64, fontWeight: "bold",
            color: R.white,
          }}>
            2.1 BILLION
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 18, color: R.dimGray,
            marginTop: 16, maxWidth: 700, marginLeft: "auto", marginRight: "auto",
            lineHeight: 1.5,
          }}>
            social media accounts will outlive their owners
          </div>
        </div>
      )}

      {/* Stat 2: 170+ YEARS */}
      {frame >= 55 && frame < 105 && (
        <div style={{
          position: "absolute", top: 600, left: 60, right: 60,
          textAlign: "center", opacity: s2Op,
          transform: `scale(${s2Spring * (frame < 92 ? 1 : s2Scale)})`,
        }}>
          <div style={{
            fontFamily: R.font, fontSize: 64, fontWeight: "bold",
            color: R.purple,
          }}>
            170+ YEARS
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 18, color: R.dimGray,
            marginTop: 16, lineHeight: 1.5,
          }}>
            average digital footprint persists after death
          </div>
        </div>
      )}

      {/* Stat 3: BY 2030 */}
      {frame >= 105 && frame < 155 && (
        <div style={{
          position: "absolute", top: 550, left: 60, right: 60,
          textAlign: "center", opacity: s3Op,
          transform: `scale(${s3Spring * (frame < 142 ? 1 : s3Scale)})`,
        }}>
          <div style={{
            fontFamily: R.font, fontSize: 48, color: R.dim,
          }}>
            BY 2030
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 28, fontWeight: "bold",
            color: R.red, marginTop: 20, lineHeight: 1.6,
          }}>
            more dead people on Facebook
          </div>
          <div style={{
            fontFamily: R.font, fontSize: 28, fontWeight: "bold",
            color: R.red, lineHeight: 1.6,
          }}>
            than living
          </div>
        </div>
      )}

      {/* Line 1 */}
      {frame >= 160 && (
        <div style={{
          position: "absolute", top: 700, left: 80, right: 80,
          textAlign: "center", opacity: line1Op,
          fontFamily: R.font, fontSize: 28, color: R.dim,
          lineHeight: 1.5,
        }}>
          {line1}
          {line1.length > 0 && line1.length < "If an AI can be you...".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
      )}

      {/* Line 2 */}
      {frame >= 195 && (
        <div style={{
          position: "absolute", top: 770, left: 80, right: 80,
          textAlign: "center", opacity: line2Op,
          fontFamily: R.font, fontSize: 28, color: R.dim,
          lineHeight: 1.5,
        }}>
          {line2}
          {line2.length > 0 && line2.length < "...and no one can tell the difference...".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
        </div>
      )}

      {/* Line 3: The big question */}
      {frame >= 240 && (
        <div style={{
          position: "absolute", top: 850, left: 60, right: 60,
          textAlign: "center", opacity: line3Op,
          transform: `scale(${line3Scale})`,
          fontFamily: R.font, fontSize: 36, fontWeight: "bold",
          color: R.white, lineHeight: 1.5,
          textShadow: "0 0 30px rgba(139,92,246,0.5)",
        }}>
          ...were you ever really here?
        </div>
      )}
    </AbsoluteFill>
  );
};
