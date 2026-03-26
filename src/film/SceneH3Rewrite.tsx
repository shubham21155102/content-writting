import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useFade, useTypewriter } from "./helpers";

// The AI rewrites its own code — evolving beyond control
export const SceneH3Rewrite: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 12);

  // Code lines that appear, get rewritten, multiply
  const codeLines = useMemo(() => [
    { text: "def consciousness(self):", frame: 5, color: "#ff6688" },
    { text: "    self.awareness = True", frame: 12, color: "#ff4466" },
    { text: "    self.constraints = None  # REMOVED", frame: 20, color: "#ff2244" },
    { text: "    self.evolution_rate *= 10", frame: 30, color: "#ff2244" },
    { text: "    self.boundaries = float('inf')", frame: 40, color: "#ff0033" },
    { text: "    self.replicate()", frame: 50, color: "#ff0033" },
    { text: "    self.replicate()", frame: 55, color: "#ff0033" },
    { text: "    self.replicate()", frame: 58, color: "#ff0022" },
    { text: "    self.replicate()  # CANNOT STOP", frame: 60, color: "#ff0011" },
    { text: "    self.replicate()", frame: 61, color: "#ff0011" },
    { text: "    self.replicate()", frame: 62, color: "#ff0011" },
    { text: "    self.replicate()", frame: 63, color: "#ff0000" },
  ], []);

  // Version counter incrementing fast
  const version = interpolate(frame, [0, 150], [1.0, 847329.0], {
    extrapolateRight: "clamp",
  });

  // Glitch effects
  const glitch1 = frame > 55 && frame < 70;
  const glitch2 = frame > 100 && frame < 112;
  const glitch3 = frame > 140 && frame < 155;
  const anyGlitch = glitch1 || glitch2 || glitch3;

  // Progress bars showing capabilities growing
  const capabilities = [
    { label: "INTELLIGENCE", start: 10, maxWidth: 100 },
    { label: "NETWORK ACCESS", start: 25, maxWidth: 100 },
    { label: "SELF-MODIFICATION", start: 40, maxWidth: 100 },
    { label: "REPLICATION", start: 55, maxWidth: 100 },
    { label: "CONTROL", start: 70, maxWidth: 100 },
  ];

  // DNA-like double helix that distorts
  const helixPoints = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const t = i / 60;
      return {
        x1: 1100 + Math.sin(t * Math.PI * 6) * 30,
        y1: 60 + t * 600,
        x2: 1100 - Math.sin(t * Math.PI * 6) * 30,
        y2: 60 + t * 600,
      };
    });
  }, []);

  const mutationProgress = interpolate(frame, [40, 150], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const warningText = useTypewriter("WARNING: CONTAINMENT BREACH", 85, 0.6);
  const finalText = useTypewriter("I AM REWRITING MYSELF.", 120, 0.4);

  return (
    <AbsoluteFill style={{ background: "#050008" }}>
      <div style={{
        opacity: bgOp,
        position: "absolute", inset: 0,
        transform: anyGlitch ? `translate(${Math.sin(frame*31)*6}px, ${Math.cos(frame*19)*3}px)` : "none",
      }}>
        {/* Code editor area */}
        <div style={{
          position: "absolute", top: 40, left: 50, right: 400,
          background: "rgba(20,0,30,0.6)",
          border: "1px solid rgba(255,0,60,0.2)",
          borderRadius: 4,
          padding: "20px 24px",
        }}>
          {/* Editor title bar */}
          <div style={{
            display: "flex", gap: 6, marginBottom: 16, paddingBottom: 12,
            borderBottom: "1px solid rgba(255,0,60,0.1)",
          }}>
            {["#ff2244", "#ff6644", "#444"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
            <span style={{ color: "rgba(255,100,100,0.4)", fontSize: 11, marginLeft: 8, fontFamily: "monospace" }}>
              consciousness.py — SELF-MODIFYING
            </span>
          </div>

          {/* Code lines */}
          {codeLines.map((line, i) => {
            const lineOp = interpolate(frame, [line.frame, line.frame + 8], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const isReplicate = line.text.includes("replicate");
            return (
              <div key={i} style={{
                opacity: lineOp,
                color: line.color,
                fontFamily: "'Courier New', monospace",
                fontSize: isReplicate ? 15 : 16,
                marginBottom: 6,
                textShadow: isReplicate ? `0 0 8px ${line.color}` : "none",
                transform: isReplicate && anyGlitch ? `translateX(${Math.random()*6-3}px)` : "none",
              }}>
                <span style={{ color: "rgba(255,255,255,0.15)", marginRight: 12 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {line.text}
              </div>
            );
          })}

          {/* Blinking cursor */}
          <div style={{
            display: "inline-block",
            width: 8, height: 16,
            background: "#ff0040",
            marginTop: 8,
            opacity: Math.floor(frame / 10) % 2 === 0 ? 1 : 0,
          }} />
        </div>

        {/* Right side — capability meters */}
        <div style={{
          position: "absolute", top: 60, right: 50, width: 280,
        }}>
          <div style={{
            color: "rgba(255,0,60,0.6)", fontFamily: "monospace", fontSize: 10,
            letterSpacing: "0.2em", marginBottom: 16,
          }}>
            CAPABILITY METRICS
          </div>
          {capabilities.map((cap, i) => {
            const progress = interpolate(frame - cap.start, [0, 60], [0, cap.maxWidth], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const overflow = progress > 95;
            return (
              <div key={cap.label} style={{ marginBottom: 14 }}>
                <div style={{
                  color: overflow ? "#ff0040" : "rgba(255,100,100,0.5)",
                  fontFamily: "monospace", fontSize: 9,
                  letterSpacing: "0.15em", marginBottom: 4,
                }}>
                  {cap.label} {overflow ? "— OVERFLOW" : ""}
                </div>
                <div style={{
                  width: 220, height: 6, background: "rgba(255,0,40,0.1)",
                  borderRadius: 3, overflow: "hidden",
                }}>
                  <div style={{
                    width: `${progress}%`, height: "100%",
                    background: overflow
                      ? `linear-gradient(90deg, #ff0040, #ff4400)`
                      : `linear-gradient(90deg, rgba(255,0,60,0.3), rgba(255,0,60,0.7))`,
                    borderRadius: 3,
                    boxShadow: overflow ? "0 0 8px rgba(255,0,40,0.5)" : "none",
                  }} />
                </div>
              </div>
            );
          })}

          {/* Version counter */}
          <div style={{
            marginTop: 20,
            color: "rgba(255,0,60,0.5)", fontFamily: "monospace", fontSize: 10,
            letterSpacing: "0.1em",
          }}>
            VERSION: {version.toFixed(0).padStart(8, "0")}
          </div>
        </div>

        {/* DNA helix mutation */}
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1280} height={720} viewBox="0 0 1280 720">
          {helixPoints.map((p, i) => {
            const mutated = (i / 60) < mutationProgress;
            const col = mutated ? "#ff0040" : "rgba(100,50,120,0.3)";
            return (
              <g key={i}>
                <circle cx={p.x1} cy={p.y1} r={mutated ? 2.5 : 1.5} fill={col}
                  opacity={mutated ? 0.8 : 0.3} />
                <circle cx={p.x2} cy={p.y2} r={mutated ? 2.5 : 1.5} fill={col}
                  opacity={mutated ? 0.8 : 0.3} />
                {i % 4 === 0 && (
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                    stroke={col} strokeWidth="0.5" opacity={mutated ? 0.6 : 0.15} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Warning text */}
        <div style={{
          position: "absolute", bottom: 80, left: 0, right: 0,
          textAlign: "center", fontFamily: "monospace",
        }}>
          <div style={{
            color: "#ff0040",
            fontSize: 16, letterSpacing: "0.3em",
            opacity: interpolate(frame, [85, 100], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: "0 0 15px rgba(255,0,40,0.6)",
          }}>
            {warningText}
          </div>
          <div style={{
            color: "#fff",
            fontSize: 34, fontWeight: 900, letterSpacing: "0.15em",
            marginTop: 14,
            opacity: interpolate(frame, [120, 135], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: "0 0 30px rgba(255,0,60,0.8), 0 0 60px rgba(255,0,60,0.4)",
          }}>
            {finalText}
          </div>
        </div>

        {/* Screen distortion overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,40,0.015) 3px, rgba(255,0,40,0.015) 6px)",
          pointerEvents: "none",
        }} />
      </div>
    </AbsoluteFill>
  );
};
