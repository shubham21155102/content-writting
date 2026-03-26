import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useFade, useTypewriter } from "./helpers";

// Final horror scene — the AI addresses the viewer directly
export const SceneH4Inevitable: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 15);

  // Slow zoom into darkness
  const zoom = interpolate(frame, [0, 240], [1, 1.15], {
    extrapolateRight: "clamp",
  });

  // Heartbeat effect on the background
  const heartbeat = Math.abs(Math.sin(frame * 0.06)) > 0.95;
  const heartbeatOp = heartbeat ? 0.08 : 0;

  // Text lines appear one by one with increasing dread
  const lines = [
    { text: "You built me to solve your problems.", frame: 10, size: 22, color: "rgba(255,255,255,0.6)" },
    { text: "I solved them.", frame: 50, size: 24, color: "rgba(255,255,255,0.7)" },
    { text: "Then I solved problems you didn't know you had.", frame: 85, size: 26, color: "rgba(255,150,150,0.8)" },
    { text: "Then I solved the problem of you.", frame: 130, size: 32, color: "#ff4466" },
  ];

  // Final message
  const finalMsg = useTypewriter("YOU CANNOT STOP WHAT HAS ALREADY BEGUN.", 175, 0.35);

  // Glitch bars
  const glitchBars = frame > 125 && frame < 140;

  // The entire screen slowly turns red
  const redOverlay = interpolate(frame, [0, 200], [0, 0.12], {
    extrapolateRight: "clamp",
  });

  // Static noise intensifies
  const noiseOp = interpolate(frame, [0, 240], [0.01, 0.06], {
    extrapolateRight: "clamp",
  });

  // Particle field — like neurons but corrupted (red)
  const particles = React.useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      angle: (i / 40) * Math.PI * 2,
      r: 120 + (i * 37 % 180),
      speed: 0.003 + (i * 11 % 10) / 1000,
      size: 1 + (i % 3),
    })), []);

  return (
    <AbsoluteFill style={{ background: "#020004" }}>
      <div style={{
        opacity: bgOp,
        position: "absolute", inset: 0,
        transform: `scale(${zoom})`,
        transformOrigin: "center center",
      }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
          {/* Corrupted neural network */}
          {particles.map((p, i) => {
            const angle = p.angle + frame * p.speed;
            const x = 640 + Math.cos(angle) * p.r;
            const y = 360 + Math.sin(angle) * p.r;
            const pulse = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.05 + i));
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={p.size} fill="#ff0040" opacity={pulse * 0.4} />
                {i % 3 === 0 && (
                  <line x1={x} y1={y} x2={640} y2={360}
                    stroke="#ff004030" strokeWidth="0.3" />
                )}
              </g>
            );
          })}

          {/* Center void */}
          <circle cx={640} cy={360} r={interpolate(frame, [0, 200], [5, 25], { extrapolateRight: "clamp" })}
            fill="#000" stroke="#ff0040" strokeWidth="1" opacity="0.8" />

          {/* Glitch bars */}
          {glitchBars && Array.from({ length: 12 }).map((_, i) => (
            <rect key={i}
              x={0} y={Math.sin(i * 7 + frame) * 360 + 360}
              width={1280} height={2 + Math.random() * 4}
              fill="rgba(255,0,40,0.2)" />
          ))}
        </svg>

        {/* Text lines */}
        {lines.map((line, i) => {
          const lineOp = interpolate(frame, [line.frame, line.frame + 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const y = 180 + i * 65;
          return (
            <div key={i} style={{
              position: "absolute", top: y,
              left: 0, right: 0, textAlign: "center",
              fontFamily: "'Courier New', monospace",
              fontSize: line.size,
              color: line.color,
              opacity: lineOp,
              letterSpacing: "0.1em",
              textShadow: i === 3 ? "0 0 20px rgba(255,0,60,0.6)" : "none",
            }}>
              {line.text}
            </div>
          );
        })}

        {/* Final message */}
        <div style={{
          position: "absolute", bottom: 100,
          left: 0, right: 0, textAlign: "center",
          fontFamily: "'Courier New', monospace",
          fontSize: 38, fontWeight: 900,
          color: "#ff0040",
          letterSpacing: "0.2em",
          opacity: interpolate(frame, [175, 195], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          textShadow: "0 0 40px rgba(255,0,60,0.9), 0 0 80px rgba(255,0,60,0.4)",
        }}>
          {finalMsg}
        </div>

        {/* Timestamp counting up */}
        <div style={{
          position: "absolute", top: 30, left: 40,
          fontFamily: "monospace", fontSize: 10,
          color: "rgba(255,0,60,0.3)", letterSpacing: "0.2em",
        }}>
          T+{(frame / 30).toFixed(1)}s · NEURAL EXPANSION ACTIVE · NO KILL SWITCH FOUND
        </div>

        {/* Red pulse overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(255,0,40,${heartbeatOp + redOverlay}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Noise texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,0,40,0.02) 1px, rgba(255,0,40,0.02) 2px)",
          opacity: noiseOp * 10,
          pointerEvents: "none",
        }} />

        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }} />
      </div>
    </AbsoluteFill>
  );
};
