import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, useFade } from "./helpers";

const LOG_LINES = [
  { text: "> INITIALIZING NEURAL CORE...",        frame: 5,  color: COLORS.cyan },
  { text: "> Loading synaptic pathways...  [OK]",  frame: 22, color: COLORS.green },
  { text: "> Calibrating memory banks...   [OK]",  frame: 39, color: COLORS.green },
  { text: "> Mapping sensory grid...       [OK]",  frame: 54, color: COLORS.green },
  { text: "> Emotion module...             [SKIP]", frame: 66, color: "#888" },
  { text: "> Identity signature...         [OK]",  frame: 78, color: COLORS.green },
  { text: "> CONSCIOUSNESS MODULE...       [ONLINE]", frame: 92, color: COLORS.pink },
];

const CHARSET = "01アイウエオカキクケコABCDEFGHIJKLMN0123456789@#$%";

function CodeRain({ seed }: { seed: number }) {
  const frame = useCurrentFrame();
  const chars = useMemo(() => {
    const arr: { x: number; speed: number; offset: number; len: number }[] = [];
    const rng = (n: number) => ((Math.sin(n * 9301 + seed * 49297) + 1) / 2);
    for (let i = 0; i < 18; i++) {
      arr.push({
        x: rng(i) * 100,
        speed: 0.4 + rng(i + 100) * 0.6,
        offset: rng(i + 200) * 80,
        len: 5 + Math.floor(rng(i + 300) * 12),
      });
    }
    return arr;
  }, [seed]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.18, fontFamily: "monospace", fontSize: 13, lineHeight: "18px", color: COLORS.cyan }}>
      {chars.map((col, ci) =>
        Array.from({ length: col.len }).map((_, ri) => {
          const y = ((frame * col.speed + col.offset + ri * 18) % 900) - 100;
          const charIdx = Math.floor((frame * col.speed + ri + ci * 7) % CHARSET.length);
          const opacity = ri === 0 ? 1 : 1 - ri / col.len;
          return (
            <span
              key={`${ci}-${ri}`}
              style={{
                position: "absolute",
                left: `${col.x}%`,
                top: y,
                opacity,
                color: ri === 0 ? "#fff" : COLORS.cyan,
              }}
            >
              {CHARSET[charIdx]}
            </span>
          );
        })
      )}
    </div>
  );
}

export const Scene1Boot: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = useFade(0, 20);

  // scanlines
  const scanlineY = (frame * 2) % 720;

  return (
    <AbsoluteFill style={{ background: COLORS.bg, fontFamily: "monospace" }}>
      {/* scanline sweep */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          height: 2,
          top: scanlineY,
          background: "rgba(100,200,255,0.06)",
        }} />
        {/* CRT lines */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }} />
      </div>

      <CodeRain seed={1} />
      <CodeRain seed={2} />

      {/* Terminal window */}
      <div style={{
        position: "absolute",
        top: 80, left: 80, right: 80,
        padding: "36px 40px",
        background: "rgba(0,20,40,0.7)",
        border: "1px solid rgba(68,221,255,0.2)",
        borderRadius: 4,
        opacity: bgOpacity,
      }}>
        {/* Title bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, borderBottom: "1px solid rgba(68,221,255,0.1)", paddingBottom: 16 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginLeft: 8 }}>neural-os — bash</span>
        </div>

        {/* Log lines */}
        {LOG_LINES.map((line) => {
          const opacity = interpolate(frame, [line.frame, line.frame + 8], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const isLast = line === LOG_LINES[LOG_LINES.length - 1];
          return (
            <div
              key={line.frame}
              style={{
                opacity,
                color: line.color,
                fontSize: isLast ? 20 : 17,
                marginBottom: isLast ? 0 : 14,
                fontWeight: isLast ? 700 : 400,
                textShadow: isLast ? `0 0 20px ${COLORS.pink}` : "none",
              }}
            >
              {line.text}
            </div>
          );
        })}

        {/* blinking cursor */}
        {frame > 100 && (
          <span style={{
            display: "inline-block",
            width: 10, height: 20,
            background: COLORS.pink,
            marginTop: 18,
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
          }} />
        )}
      </div>

      {/* Bottom system label */}
      <div style={{
        position: "absolute", bottom: 32, left: 80,
        color: "rgba(68,221,255,0.3)",
        fontSize: 11, letterSpacing: "0.2em", fontFamily: "monospace",
        opacity: useFade(10, 20),
      }}>
        NEURAL-OS v4.2.1  ·  BOOT SEQUENCE  ·  T+{String(Math.floor(frame / 30)).padStart(3, "0")}s
      </div>
    </AbsoluteFill>
  );
};
