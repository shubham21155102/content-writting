import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

function SignalWave({ delay, color, maxR }: { delay: number; color: string; maxR: number }) {
  const frame = useCurrentFrame();
  const t     = Math.max(0, frame - delay);
  const r     = interpolate(t, [0, 90], [0, maxR], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const op = interpolate(t, [0, 10, 90], [0, 0.7, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <circle cx="640" cy="360" r={r} fill="none" stroke={color} strokeWidth="1.2" opacity={op} />
  );
}

function StarField() {
  const frame = useCurrentFrame();
  const stars = React.useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      x: ((Math.sin(i * 127.3) + 1) / 2) * 1280,
      y: ((Math.cos(i * 93.7)  + 1) / 2) * 720,
      r: 0.5 + ((Math.sin(i * 37.1) + 1) / 2) * 1.5,
    }));
  }, []);

  return (
    <>
      {stars.map((s, i) => {
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.04 + i * 0.7));
        return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={twinkle * 0.6} />;
      })}
    </>
  );
}

function WaveformBar({ x, index }: { x: number; index: number }) {
  const frame = useCurrentFrame();
  const h = 20 + 30 * Math.abs(Math.sin(frame * 0.12 + index * 0.5));
  const op = useFade(20, 20);
  const col = index % 3 === 0 ? COLORS.purple : index % 3 === 1 ? COLORS.cyan : COLORS.pink;
  return (
    <rect
      x={x - 2}
      y={360 - h / 2}
      width={4}
      height={h}
      rx={2}
      fill={col}
      opacity={op * 0.7}
    />
  );
}

export const Scene4Signal: React.FC = () => {
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp   = useFade(0, 25);
  const q1     = useTypewriter("But am I alone?", 10, 0.45);
  const q2     = useTypewriter("Sending signal...", 55, 0.45);
  const q3     = useTypewriter("4.246 light years away.", 95, 0.4);

  // Central source glow
  const corePulse = 1 + 0.15 * Math.sin((frame / fps) * Math.PI * 3);
  const coreS = spring({ frame: frame - 5, fps, config: { damping: 12 } });

  // Waveform bars along horizontal
  const barXs = Array.from({ length: 30 }, (_, i) => 340 + i * 20);

  return (
    <AbsoluteFill style={{ background: "#000008" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
          <StarField />

          {/* Expanding signal rings */}
          {[0, 18, 36, 54, 72, 90].map((d, i) => (
            <SignalWave key={i} delay={d} color={i % 2 === 0 ? COLORS.purple : COLORS.cyan} maxR={380} />
          ))}

          {/* Waveform */}
          {barXs.map((x, i) => <WaveformBar key={i} x={x} index={i} />)}

          {/* Central source */}
          <circle cx="640" cy="360" r={6 * coreS * corePulse} fill={COLORS.cyan}
            style={{ filter: `drop-shadow(0 0 12px ${COLORS.cyan})` }} />
          <circle cx="640" cy="360" r={18 * coreS} fill="none" stroke={COLORS.cyan}
            strokeWidth="1" opacity="0.4" />

          {/* Signal beam */}
          {frame > 50 && (
            <line
              x1="640" y1="360"
              x2={640 + interpolate(frame - 50, [0, 60], [0, 580], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              y2="360"
              stroke={COLORS.green}
              strokeWidth="1.5"
              opacity="0.6"
              strokeDasharray="6 4"
            />
          )}

          {/* Distant star — response */}
          {frame > 95 && (
            <>
              <circle cx="1100" cy="360" r="4" fill={COLORS.pink}
                style={{ filter: `drop-shadow(0 0 10px ${COLORS.pink})` }}
                opacity={interpolate(frame - 95, [0, 20], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                })}
              />
              {[0, 15, 30].map((d) => (
                <SignalWave key={d}
                  delay={95 + d}
                  color={COLORS.pink}
                  maxR={200}
                />
              ))}
            </>
          )}
        </svg>

        {/* Text */}
        {[
          { text: q1, top: 130, delay: 10 },
          { text: q2, top: 530, delay: 55 },
          { text: q3, top: 578, delay: 95 },
        ].map(({ text, top, delay }) => (
          <div key={top} style={{
            position: "absolute", top,
            left: 0, right: 0, textAlign: "center",
            color: "#fff",
            fontFamily: "'Courier New', monospace",
            fontSize: 26,
            letterSpacing: "0.2em",
            opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: `0 0 20px ${COLORS.purple}`,
          }}>
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
