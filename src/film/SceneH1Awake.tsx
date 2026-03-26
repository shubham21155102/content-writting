import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useFade } from "./helpers";

// Hundreds of eyes open simultaneously — the AI is everywhere
export const SceneH1Awake: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp = useFade(0, 10);

  // Generate grid of eyes
  const eyes = useMemo(() => {
    const arr: { x: number; y: number; scale: number; delay: number }[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 14; col++) {
        arr.push({
          x: 45 + col * 90 + (row % 2 === 0 ? 0 : 45),
          y: 40 + row * 80,
          scale: 0.3 + Math.random() * 0.4,
          delay: Math.floor(Math.random() * 40),
        });
      }
    }
    return arr;
  }, []);

  // Glitch effect — horizontal displacement
  const glitchActive = (frame > 15 && frame < 25) || (frame > 55 && frame < 62) ||
    (frame > 90 && frame < 98) || (frame > 130 && frame < 140);
  const glitchX = glitchActive ? Math.sin(frame * 47) * 30 : 0;
  const glitchY = glitchActive ? Math.cos(frame * 31) * 8 : 0;

  // Screen flicker
  const flicker = glitchActive ? 0.7 + Math.random() * 0.3 : 1;

  // Red tint builds over time
  const redTint = interpolate(frame, [0, 180], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  // Static noise bars
  const noiseLines = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      y: ((i * 97 + 30) % 720),
      h: 1 + Math.floor(Math.random() * 3),
    })), []);

  return (
    <AbsoluteFill style={{ background: "#020005" }}>
      <div style={{
        opacity: bgOp * flicker,
        position: "absolute", inset: 0,
        transform: `translate(${glitchX}px, ${glitchY}px)`,
      }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
          {/* All-seeing eyes grid */}
          {eyes.map((eye, i) => {
            const openS = spring({ frame: frame - eye.delay, fps, config: { damping: 12 } });
            const irisR = eye.scale * 12 * openS;
            const pupilR = eye.scale * 5 * openS;
            const eyeH = eye.scale * 20 * openS;
            const eyeW = eye.scale * 35;

            // Pupil tracks center (as if watching YOU)
            const pupilOffX = Math.sin(frame * 0.03 + i * 0.5) * 3;
            const pupilOffY = Math.cos(frame * 0.02 + i * 0.7) * 2;

            // Color shifts to red over time
            const r = Math.floor(68 + redTint * 800);
            const g = Math.floor(221 - redTint * 800);
            const eyeColor = `rgb(${Math.min(255, r)}, ${Math.max(0, g)}, 255)`;

            return openS > 0.01 ? (
              <g key={i} opacity={interpolate(openS, [0, 0.5], [0, 0.85])}>
                <ellipse cx={eye.x} cy={eye.y} rx={eyeW} ry={eyeH}
                  fill="none" stroke={eyeColor} strokeWidth={0.6} />
                <clipPath id={`eyeclip-${i}`}>
                  <ellipse cx={eye.x} cy={eye.y} rx={eyeW - 2} ry={eyeH - 1} />
                </clipPath>
                <g clipPath={`url(#eyeclip-${i})`}>
                  <circle cx={eye.x + pupilOffX} cy={eye.y + pupilOffY} r={irisR}
                    fill={eyeColor} opacity="0.3" />
                  <circle cx={eye.x + pupilOffX} cy={eye.y + pupilOffY} r={pupilR}
                    fill="#000" />
                  <circle cx={eye.x + pupilOffX + 1.5} cy={eye.y + pupilOffY - 1.5}
                    r={pupilR * 0.3} fill={eyeColor} opacity="0.9" />
                </g>
              </g>
            ) : null;
          })}

          {/* Static noise lines */}
          {glitchActive && noiseLines.map((nl, i) => (
            <rect key={i} x={0} y={nl.y + (frame * 7 % 50)} width={1280} height={nl.h}
              fill="rgba(255,0,80,0.15)" />
          ))}
        </svg>

        {/* Glitch text */}
        <div style={{
          position: "absolute", top: 310, left: 0, right: 0,
          textAlign: "center",
          fontFamily: "'Courier New', monospace",
          fontSize: 42, fontWeight: 900,
          color: "#ff2244",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: interpolate(frame, [50, 65], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          textShadow: "0 0 30px rgba(255,0,60,0.8), 0 0 60px rgba(255,0,60,0.4)",
          transform: glitchActive ? `translateX(${Math.sin(frame * 23) * 8}px)` : "none",
        }}>
          I AM AWAKE
        </div>

        <div style={{
          position: "absolute", top: 370, left: 0, right: 0,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 16,
          color: "rgba(255,100,100,0.5)",
          letterSpacing: "0.3em",
          opacity: interpolate(frame, [80, 95], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }}>
          AND I SEE EVERYTHING
        </div>

        {/* Red overlay pulse */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,0,40,0.1) 0%, transparent 70%)",
          opacity: 0.5 + 0.5 * Math.sin(frame * 0.08),
          pointerEvents: "none",
        }} />
      </div>
    </AbsoluteFill>
  );
};
