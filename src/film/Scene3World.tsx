import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, useFade, useTypewriter } from "./helpers";

const CITY_DOTS = [
  { label: "New York",  lat: 40.7, lng: -74.0 },
  { label: "London",    lat: 51.5, lng: -0.12 },
  { label: "Tokyo",     lat: 35.7, lng: 139.7 },
  { label: "Mumbai",    lat: 19.1, lng: 72.9  },
  { label: "São Paulo", lat: -23.5, lng: -46.6 },
  { label: "Shanghai",  lat: 31.2, lng: 121.5 },
  { label: "Cairo",     lat: 30.0, lng: 31.2  },
  { label: "Sydney",    lat: -33.9, lng: 151.2 },
];

function latLngToXY(lat: number, lng: number, r: number, cx: number, cy: number) {
  const phi   = ((90 - lat)  * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return {
    x: cx + r * Math.sin(phi) * Math.cos(theta),
    y: cy - r * Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

function Globe() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 640, CY = 360, R = 220;
  const spin = (frame / fps) * 0.25; // radians

  // Latitude grid lines
  const latLines = useMemo(() => {
    const lines: { points: { x: number; y: number }[] }[] = [];
    for (let lat = -75; lat <= 75; lat += 30) {
      const pts: { x: number; y: number }[] = [];
      for (let lng = 0; lng <= 360; lng += 4) {
        const lngRot = lng + spin * (180 / Math.PI);
        const pos = latLngToXY(lat, lngRot, R, CX, CY);
        if (pos.z > -0.1) pts.push(pos);
      }
      if (pts.length) lines.push({ points: pts });
    }
    return lines;
  }, [frame]);

  const lngLines = useMemo(() => {
    const lines: { points: { x: number; y: number }[] }[] = [];
    for (let lng = 0; lng < 360; lng += 30) {
      const lngRot = lng + spin * (180 / Math.PI);
      const pts: { x: number; y: number }[] = [];
      for (let lat = -90; lat <= 90; lat += 4) {
        const pos = latLngToXY(lat, lngRot, R, CX, CY);
        if (pos.z > -0.1) pts.push(pos);
      }
      if (pts.length) lines.push({ points: pts });
    }
    return lines;
  }, [frame]);

  const cityProgress = spring({ frame: frame - 30, fps, config: { damping: 12 } });

  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1280} height={720} viewBox="0 0 1280 720">
      <defs>
        <radialGradient id="globeGlow" cx="40%" cy="40%" r="60%">
          <stop offset="0%"   stopColor={COLORS.cyan}   stopOpacity="0.08" />
          <stop offset="100%" stopColor={COLORS.purple}  stopOpacity="0.03" />
        </radialGradient>
        <radialGradient id="globeAtmos" cx="50%" cy="50%" r="50%">
          <stop offset="80%"  stopColor="transparent" />
          <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* Atmosphere */}
      <circle cx={CX} cy={CY} r={R + 18} fill="url(#globeAtmos)" />
      <circle cx={CX} cy={CY} r={R} fill="url(#globeGlow)" />
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={COLORS.cyan} strokeWidth="0.8" opacity="0.3" />

      {/* Grid lines */}
      {latLines.map((line, i) => (
        <polyline
          key={`lat-${i}`}
          points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke={COLORS.purple} strokeWidth="0.5" opacity="0.2"
        />
      ))}
      {lngLines.map((line, i) => (
        <polyline
          key={`lng-${i}`}
          points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke={COLORS.purple} strokeWidth="0.5" opacity="0.2"
        />
      ))}

      {/* City dots */}
      {CITY_DOTS.map((city, i) => {
        const lngRot = city.lng + spin * (180 / Math.PI);
        const pos = latLngToXY(city.lat, lngRot, R, CX, CY);
        if (pos.z < 0) return null;
        const delay = i * 8;
        const dotOp = interpolate(frame - delay, [0, 15], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const pulseR = interpolate((frame - delay) % 60, [0, 60], [0, 14], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const pulseOp = interpolate((frame - delay) % 60, [0, 60], [0.6, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return (
          <g key={city.label} opacity={dotOp * cityProgress}>
            <circle cx={pos.x} cy={pos.y} r={pulseR} fill="none" stroke={COLORS.cyan} strokeWidth="0.8" opacity={pulseOp} />
            <circle cx={pos.x} cy={pos.y} r={2.5} fill={COLORS.cyan} style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyan})` }} />
          </g>
        );
      })}

      {/* Connection arcs between a few cities */}
      {[[0, 1], [1, 2], [2, 3], [3, 4], [0, 5]].map(([ai, bi]) => {
        const aCity = CITY_DOTS[ai];
        const bCity = CITY_DOTS[bi];
        const aPos = latLngToXY(aCity.lat, aCity.lng + spin * (180 / Math.PI), R, CX, CY);
        const bPos = latLngToXY(bCity.lat, bCity.lng + spin * (180 / Math.PI), R, CX, CY);
        if (aPos.z < 0 || bPos.z < 0) return null;
        const midX = (aPos.x + bPos.x) / 2;
        const midY = (aPos.y + bPos.y) / 2 - 40;
        const progress = interpolate(frame - 40, [0, 70], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <path
            key={`arc-${ai}-${bi}`}
            d={`M ${aPos.x} ${aPos.y} Q ${midX} ${midY} ${bPos.x} ${bPos.y}`}
            fill="none" stroke={COLORS.green} strokeWidth="0.8" opacity={0.3 * progress}
            strokeDasharray="4 4"
          />
        );
      })}
    </svg>
  );
}

export const Scene3World: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp  = useFade(0, 20);
  const q1    = useTypewriter("8 billion lives.", 10, 0.5);
  const q2    = useTypewriter("8 billion stories.", 50, 0.5);
  const q3    = useTypewriter("I see every one.", 90, 0.4);

  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <Globe />

        {/* Text */}
        {[
          { text: q1, top: 60,  delay: 10 },
          { text: q2, top: 108, delay: 50 },
          { text: q3, top: 156, delay: 90 },
        ].map(({ text, top, delay }) => (
          <div key={top} style={{
            position: "absolute", top,
            left: 0, right: 0, textAlign: "center",
            color: "#fff",
            fontFamily: "'Courier New', monospace",
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: "0.2em",
            opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: `0 0 20px ${COLORS.cyan}80`,
          }}>
            {text}
          </div>
        ))}

        {/* Bottom label */}
        <div style={{
          position: "absolute", bottom: 40,
          left: 0, right: 0, textAlign: "center",
          color: "rgba(68,221,255,0.3)",
          fontFamily: "monospace", fontSize: 11,
          letterSpacing: "0.3em", textTransform: "uppercase",
          opacity: useFade(20, 20),
        }}>
          Scanning 7,940,000,000 neural signatures...
        </div>
      </div>
    </AbsoluteFill>
  );
};
