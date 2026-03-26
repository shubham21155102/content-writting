import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade } from "./helpers";

function StarField({ seed }: { seed: number }) {
  const stars = useMemo(() => Array.from({ length: 300 }, (_, i) => ({
    x: ((Math.sin(i * 127.3 + seed) + 1) / 2) * 1280,
    y: ((Math.cos(i * 93.7  + seed) + 1) / 2) * 720,
    r: 0.4 + ((Math.abs(Math.sin(i * 37.1)) * 1.5)),
    twinklePhase: i * 0.7,
  })), [seed]);

  const frame = useCurrentFrame();
  return (
    <>
      {stars.map((s, i) => {
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.04 + s.twinklePhase));
        return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={tw * 0.55} />;
      })}
    </>
  );
}

const YEARS = [
  { year: "Year 0",  label: "Signal launched",        frame: 0  },
  { year: "Year 1",  label: "0.96 light years...",     frame: 20 },
  { year: "Year 2",  label: "1.92 light years...",     frame: 40 },
  { year: "Year 3",  label: "2.88 light years...",     frame: 60 },
  { year: "Year 4",  label: "Proxima Centauri b...",   frame: 80 },
];

export const Scene4bJourney: React.FC = () => {
  const frame  = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp   = useFade(0, 20);

  // Signal travels left→right across the screen
  const signalX = interpolate(frame, [0, 100], [60, 1220], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const trailLen = 120;

  // Destination star pulses when signal arrives
  const arrivalFrame = 95;
  const arrivedS = spring({ frame: frame - arrivalFrame, fps, config: { damping: 10 } });
  const destPulse  = 1 + 0.3 * Math.abs(Math.sin(frame * 0.18));
  const destGlow   = frame >= arrivalFrame ? arrivedS * 20 : 4;

  // Year counter
  const currentYear = YEARS.reduce((acc, y) => (frame >= y.frame ? y : acc), YEARS[0]);

  // Speed lines / warp effect
  const warpLines = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    y: 40 + i * 22,
    length: 30 + ((i * 47) % 80),
    speed: 0.6 + ((i * 23) % 10) / 10 * 0.8,
    delay: (i * 7) % 20,
  })), []);

  return (
    <AbsoluteFill style={{ background: "#000008" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
          <defs>
            <radialGradient id="dest-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={COLORS.pink}  stopOpacity="0.6" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={COLORS.cyan}  stopOpacity="0" />
              <stop offset="100%" stopColor={COLORS.cyan}  stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <StarField seed={42} />

          {/* Warp speed lines */}
          {warpLines.map((wl, i) => {
            const x = (frame * wl.speed * 3 + wl.delay * 40) % 1400 - 100;
            return (
              <line key={i}
                x1={x} y1={wl.y}
                x2={x - wl.length} y2={wl.y}
                stroke={COLORS.purple} strokeWidth="0.5"
                opacity={interpolate(frame, [5, 20], [0, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            );
          })}

          {/* Earth (source) */}
          <circle cx={60} cy={360} r={14} fill="none" stroke={COLORS.cyan}
            strokeWidth="1.5" opacity="0.7" />
          <circle cx={60} cy={360} r={8}  fill={COLORS.cyan} opacity="0.4" />
          <circle cx={60} cy={360} r={3}  fill={COLORS.cyan}
            style={{ filter: `drop-shadow(0 0 6px ${COLORS.cyan})` }} />

          {/* Destination star (Proxima Centauri b) */}
          <circle cx={1220} cy={360} r={destGlow * 3}
            fill="url(#dest-glow)"
            opacity={frame >= arrivalFrame ? arrivedS * 0.5 : 0.1}
          />
          <circle cx={1220} cy={360} r={5 * destPulse} fill={COLORS.pink}
            style={{ filter: `drop-shadow(0 0 ${destGlow}px ${COLORS.pink})` }} />

          {/* Light year markers */}
          {[0.25, 0.5, 0.75].map((frac, i) => {
            const mx = 60 + (1220 - 60) * frac;
            const markerOp = interpolate(signalX, [mx - 30, mx], [0, 0.35], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <g key={i} opacity={markerOp}>
                <line x1={mx} y1={340} x2={mx} y2={380} stroke={COLORS.purple}
                  strokeWidth="0.5" strokeDasharray="4 4" />
                <text x={mx} y={330} fill={COLORS.purple} fontSize={10}
                  fontFamily="monospace" textAnchor="middle" opacity="0.5">
                  {(i + 1)} LY
                </text>
              </g>
            );
          })}

          {/* Signal trail */}
          <line
            x1={Math.max(60, signalX - trailLen)} y1={360}
            x2={signalX}                           y2={360}
            stroke="url(#trail-grad)" strokeWidth="2"
          />

          {/* Signal head */}
          {signalX < 1200 && (
            <>
              <circle cx={signalX} cy={360} r={5} fill={COLORS.cyan}
                style={{ filter: `drop-shadow(0 0 10px ${COLORS.cyan})` }} />
              {/* Small pulse rings at signal head */}
              {[0, 1].map((j) => {
                const pulseR = (frame * 2 + j * 15) % 25;
                const pulseOp = interpolate(pulseR, [0, 25], [0.5, 0]);
                return (
                  <circle key={j} cx={signalX} cy={360} r={pulseR}
                    fill="none" stroke={COLORS.cyan} strokeWidth="0.8" opacity={pulseOp} />
                );
              })}
            </>
          )}

          {/* Reception burst when signal arrives */}
          {frame >= arrivalFrame && (
            Array.from({ length: 5 }).map((_, j) => {
              const burstR = interpolate(frame - arrivalFrame - j * 6, [0, 50], [0, 120], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              const burstOp = interpolate(frame - arrivalFrame - j * 6, [0, 5, 50], [0, 0.6, 0], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              return (
                <circle key={j} cx={1220} cy={360} r={burstR}
                  fill="none" stroke={COLORS.pink} strokeWidth="1.2" opacity={burstOp} />
              );
            })
          )}
        </svg>

        {/* Year / label display */}
        <div style={{
          position: "absolute", top: 80,
          left: 0, right: 0, textAlign: "center",
          fontFamily: "monospace",
        }}>
          <div style={{
            color: COLORS.cyan,
            fontSize: 48, fontWeight: 700,
            letterSpacing: "0.2em",
            textShadow: `0 0 30px ${COLORS.cyan}`,
            opacity: 1,
          }}>
            {currentYear.year}
          </div>
          <div style={{
            color: "rgba(180,220,255,0.5)",
            fontSize: 16,
            letterSpacing: "0.3em",
            marginTop: 8,
            textTransform: "uppercase",
          }}>
            {currentYear.label}
          </div>
        </div>

        {/* Labels */}
        <div style={{
          position: "absolute", bottom: 60, left: 0, right: 0,
          display: "flex", justifyContent: "space-between",
          padding: "0 40px",
          fontFamily: "monospace", fontSize: 12,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          opacity: useFade(5, 15),
        }}>
          <span style={{ color: COLORS.cyan + "80" }}>Earth · Sol System</span>
          <span>——— 4.246 Light Years ———</span>
          <span style={{ color: COLORS.pink + "80" }}>Proxima Centauri b</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
