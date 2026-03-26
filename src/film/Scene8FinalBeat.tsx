import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

export const Scene8FinalBeat: React.FC = () => {
  const frame = useCurrentFrame();

  // Dot fades in: frames 150-170 (0 → 1)
  // Dot holds: frames 170-220 (1)
  // Dot fades out: frames 220-240 (1 → 0)
  const dotOpacity = interpolate(
    frame,
    [150, 170, 220, 240],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width={1280}
        height={720}
        viewBox="0 0 1280 720"
      >
        {/* Faint radial glow */}
        <defs>
          <radialGradient id="finalGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle
          cx={640}
          cy={360}
          r={40}
          fill="url(#finalGlow)"
          opacity={dotOpacity}
        />

        {/* The dot */}
        <circle
          cx={640}
          cy={360}
          r={1.5}
          fill="#ffffff"
          opacity={dotOpacity}
        />
      </svg>
    </AbsoluteFill>
  );
};
