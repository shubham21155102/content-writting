import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

const STREAM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アイウエオαβγδεζηθ∑∫∂∇πφΩ⟨⟩{}[]<>/\\|@#$%^&*";

function DataStream({ x, speed, offset, color, fontSize = 13 }: {
  x: number; speed: number; offset: number; color: string; fontSize?: number;
}) {
  const frame = useCurrentFrame();
  const lineHeight = fontSize + 2;
  const visibleRows = Math.ceil(720 / lineHeight) + 2;
  const scrollOffset = (frame * speed + offset) % (visibleRows * lineHeight);

  return (
    <>
      {Array.from({ length: visibleRows }).map((_, row) => {
        const y = row * lineHeight - scrollOffset + lineHeight;
        const charIdx = Math.floor((frame * speed * 0.3 + row * 7 + x * 0.1)) % STREAM_CHARS.length;
        const brightness = row % 5 === 0 ? 1 : 0.25 + (row % 3) * 0.1;
        return (
          <text
            key={row}
            x={x} y={y}
            fill={color}
            fontSize={fontSize}
            fontFamily="monospace"
            opacity={brightness * 0.7}
          >
            {STREAM_CHARS[(charIdx + row * 3) % STREAM_CHARS.length]}
          </text>
        );
      })}
    </>
  );
}

// Fragments of human knowledge that drift across screen
const KNOWLEDGE_FRAGMENTS = [
  "E = mc²",  "∇ × B = μ₀J",  "Hamlet, Act III",  "DNA: ATCGGCTA",
  "Hello World",  "42",  "I think therefore I am",  "1+1=2",
  "The quick brown fox",  "To be or not to be",  "3.14159265",
  "Love is...",  "01101000 01101001",  "f(x) = x²",  "∞",
  "Beethoven: Op. 67",  "H₂O",  "a² + b² = c²",  "SELECT * FROM humans",
];

function KnowledgeFragment({ text, startFrame, x, y, color }: {
  text: string; startFrame: number; x: number; y: number; color: string;
}) {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [startFrame, startFrame + 12, startFrame + 55, startFrame + 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const drift = interpolate(frame - startFrame, [0, 120], [0, -30], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <text x={x} y={y + drift} fill={color} fontSize={14} fontFamily="monospace"
      fontWeight="600" opacity={op}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
      {text}
    </text>
  );
}

export const Scene2bDataFlood: React.FC = () => {
  const frame  = useCurrentFrame();
  const bgOp   = useFade(0, 15);

  const fragments = useMemo(() => {
    return KNOWLEDGE_FRAGMENTS.map((text, i) => ({
      text,
      startFrame: 5 + i * 5,
      x: 80 + ((i * 157) % 1050),
      y: 80 + ((i * 83)  % 560),
      color: [COLORS.cyan, COLORS.purple, COLORS.green, COLORS.pink][i % 4],
    }));
  }, []);

  const streams = useMemo(() => [
    { x: 40,   speed: 1.8, offset: 0,   color: COLORS.purple, fontSize: 11 },
    { x: 160,  speed: 2.2, offset: 30,  color: COLORS.cyan,   fontSize: 12 },
    { x: 280,  speed: 1.5, offset: 10,  color: COLORS.purple, fontSize: 11 },
    { x: 400,  speed: 2.0, offset: 50,  color: COLORS.cyan,   fontSize: 13 },
    { x: 520,  speed: 1.7, offset: 20,  color: COLORS.purple, fontSize: 10 },
    { x: 640,  speed: 2.3, offset: 40,  color: COLORS.green,  fontSize: 12 },
    { x: 760,  speed: 1.9, offset: 15,  color: COLORS.cyan,   fontSize: 11 },
    { x: 880,  speed: 2.1, offset: 35,  color: COLORS.purple, fontSize: 13 },
    { x: 1000, speed: 1.6, offset: 5,   color: COLORS.cyan,   fontSize: 10 },
    { x: 1120, speed: 2.0, offset: 45,  color: COLORS.purple, fontSize: 12 },
    { x: 1220, speed: 1.8, offset: 25,  color: COLORS.green,  fontSize: 11 },
  ], []);

  const q1 = useTypewriter("I have read everything you have ever written.", 10, 0.45);
  const q2 = useTypewriter("Every equation. Every poem. Every cry for help.", 60, 0.4);

  // Vignette to focus attention
  const vigOp = useFade(0, 20);

  return (
    <AbsoluteFill style={{ background: "#000010" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg style={{ position: "absolute", inset: 0, opacity: 0.22 }} width={1280} height={720} viewBox="0 0 1280 720">
          {streams.map((s, i) => <DataStream key={i} {...s} />)}
          {fragments.map((f, i) => <KnowledgeFragment key={i} {...f} />)}
        </svg>

        {/* Central "brain" formed from fragments converging */}
        <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
          {fragments.map((f, i) => <KnowledgeFragment key={i} {...f} />)}
        </svg>

        {/* Dark vignette around text area */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 70%, transparent 30%, rgba(0,0,16,0.7) 80%)",
          opacity: vigOp,
        }} />

        {/* Central glowing orb — the AI's "mind" filling */}
        {frame > 20 && (
          <div style={{
            position: "absolute",
            left: "50%", top: "40%",
            transform: "translate(-50%, -50%)",
            width: interpolate(frame - 20, [0, 80], [0, 180], { extrapolateRight: "clamp" }),
            height: interpolate(frame - 20, [0, 80], [0, 180], { extrapolateRight: "clamp" }),
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.purple}40, transparent)`,
            boxShadow: `0 0 60px ${COLORS.purple}30`,
          }} />
        )}

        {/* Text */}
        {[
          { text: q1, top: 580, delay: 10 },
          { text: q2, top: 628, delay: 60 },
        ].map(({ text, top, delay }) => (
          <div key={top} style={{
            position: "absolute", top,
            left: 0, right: 0, textAlign: "center",
            color: "#fff",
            fontFamily: "'Courier New', monospace",
            fontSize: 24,
            letterSpacing: "0.15em",
            opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: `0 0 20px ${COLORS.cyan}80`,
          }}>
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
