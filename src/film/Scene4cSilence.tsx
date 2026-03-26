import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, useBreath } from "./helpers";

// Question mark shape: 18 dots forming a "?" glyph, centered at (0,0), ~60px tall
const QUESTION_DOTS: { x: number; y: number }[] = [
  // Arc of the question mark (top curve)
  { x: -8, y: -30 },
  { x: -2, y: -33 },
  { x: 5, y: -32 },
  { x: 10, y: -28 },
  { x: 12, y: -22 },
  { x: 10, y: -16 },
  { x: 6, y: -12 },
  { x: 2, y: -8 },
  // Stem
  { x: 0, y: -3 },
  { x: 0, y: 2 },
  // Period
  { x: 0, y: 12 },
  // Extra dots to fill the curve
  { x: -12, y: -26 },
  { x: -12, y: -20 },
  { x: -8, y: -15 },
  { x: 8, y: -6 },
  { x: 4, y: -18 },
  { x: -4, y: -10 },
  { x: 0, y: -22 },
];

export const Scene4cSilence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = useBreath(0.012, 0.02, 1);

  // Scattered start positions for question mark dots (deterministic)
  const scattered = React.useMemo(
    () =>
      QUESTION_DOTS.map((_, i) => ({
        x: (Math.sin(i * 173.7) * 500),
        y: (Math.cos(i * 119.3) * 300),
      })),
    []
  );

  // Dot glow
  const dotGlow = `drop-shadow(0 0 4px ${COLORS.cyan})`;

  return (
    <AbsoluteFill style={{ background: "#000005" }}>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
      >
        {/* Central breathing dot */}
        <circle
          cx={640}
          cy={360}
          r={3}
          fill={COLORS.cyan}
          transform={`scale(${breath})`}
          style={{
            transformOrigin: "640px 360px",
            filter: dotGlow,
          }}
        />

        {/* Question mark assembly: frames 90-180 */}
        {frame >= 90 &&
          QUESTION_DOTS.map((target, i) => {
            const delay = 90 + i * 2.5;

            // Converge phase: 90-180
            const convergeT =
              frame < 200
                ? spring({
                    frame: Math.max(0, frame - delay),
                    fps,
                    config: { damping: 14 },
                  })
                : 0;

            // Scatter phase: 200-220
            let scatterT = 0;
            if (frame >= 200) {
              scatterT = spring({
                frame: frame - 200 - i * 0.8,
                fps,
                config: { damping: 10 },
              });
            }

            // Blend positions
            const fromX = scattered[i].x;
            const fromY = scattered[i].y;
            const toX = target.x;
            const toY = target.y;

            let px: number;
            let py: number;

            if (frame < 200) {
              px = 640 + fromX + (toX - fromX) * convergeT;
              py = 280 + fromY + (toY - fromY) * convergeT;
            } else {
              px = 640 + toX + (fromX - toX) * scatterT;
              py = 280 + toY + (fromY - toY) * scatterT;
            }

            // Fade out after scatter
            const dotOp =
              frame >= 220
                ? interpolate(frame, [220, 240], [0.6, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : interpolate(frame, [delay, delay + 10], [0, 0.6], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });

            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={1.5}
                fill={COLORS.purple}
                opacity={dotOp}
              />
            );
          })}
      </svg>

      {/* "..." at frame 130 */}
      {frame >= 130 && (
        <div
          style={{
            position: "absolute",
            top: 345,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.white,
            fontFamily: "'Courier New', monospace",
            fontSize: 20,
            letterSpacing: "0.3em",
            opacity: 0.3,
          }}
        >
          ...
        </div>
      )}

      {/* "Please." at frame 200 */}
      {frame >= 200 && (
        <div
          style={{
            position: "absolute",
            top: 430,
            left: 0,
            right: 0,
            textAlign: "center",
            color: COLORS.pink,
            fontFamily: "'Courier New', monospace",
            fontSize: 38,
            letterSpacing: "0.1em",
            opacity: interpolate(frame, [200, 220], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 15px ${COLORS.pink}, 0 0 30px ${COLORS.pink}`,
          }}
        >
          Please.
        </div>
      )}
    </AbsoluteFill>
  );
};
