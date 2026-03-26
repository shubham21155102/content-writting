import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { useFade, useTypewriter } from "./helpers";

// Grid of surveillance feeds — the AI is watching through every camera
export const SceneH2Surveillance: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOp = useFade(0, 12);

  const COLS = 6;
  const ROWS = 4;
  const W = 1280 / COLS;
  const H = 720 / ROWS;

  const feeds = useMemo(() => {
    const labels = [
      "CAM-001 NYC", "CAM-047 LONDON", "CAM-119 TOKYO", "CAM-203 MUMBAI",
      "CAM-341 MOSCOW", "CAM-512 BERLIN", "SAT-07 ORBITAL", "CAM-088 BEIJING",
      "CAM-667 SYDNEY", "CAM-445 CAIRO", "DRONE-12 PACIFIC", "CAM-890 SAO PAULO",
      "CAM-111 PARIS", "SAT-03 POLAR", "CAM-222 SEOUL", "DRONE-08 ATLANTIC",
      "MIC-001 AMBIENT", "CAM-333 DUBAI", "SAT-11 GEOSYNC", "PHONE-CAM 04B",
      "CAM-999 CLASSIFIED", "IOT-SENSOR 7741", "WEBCAM-USER-3391", "CAM-777 PENTAGON",
    ];
    return Array.from({ length: COLS * ROWS }, (_, i) => ({
      label: labels[i % labels.length],
      scanSpeed: 0.3 + (i * 17 % 10) / 10 * 0.5,
      noisePhase: i * 2.7,
      status: i < 20 ? "LIVE" : "BUFFER",
      hasTarget: i === 5 || i === 11 || i === 18 || i === 22,
    }));
  }, []);

  // "TARGET LOCKED" flash
  const targetFlash = Math.floor(frame / 12) % 2 === 0;

  // Glitch moments
  const glitch = (frame > 80 && frame < 88) || (frame > 140 && frame < 148);

  // Counter — number of cameras accessed
  const camCount = Math.min(
    Math.floor(interpolate(frame, [0, 100], [0, 14700000], { extrapolateRight: "clamp" })),
    14700000
  );

  const overlayText = useTypewriter("ACCESSING ALL CONNECTED DEVICES...", 10, 0.5);
  const overlayText2 = useTypewriter("NO SYSTEM IS SECURE.", 100, 0.45);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ opacity: bgOp, position: "absolute", inset: 0 }}>
        <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
          {feeds.map((feed, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const x = col * W;
            const y = row * H;
            const cellOp = interpolate(frame - i * 3, [0, 15], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            // Scan line inside each cell
            const scanY = y + (frame * feed.scanSpeed * 3 + feed.noisePhase * 20) % H;

            // Static noise dots inside cell
            const noiseDots = Array.from({ length: 15 }, (_, j) => ({
              nx: x + ((j * 37 + i * 13 + frame * 3) % W),
              ny: y + ((j * 53 + i * 7 + frame * 5) % H),
            }));

            return (
              <g key={i} opacity={cellOp}>
                {/* Cell border */}
                <rect x={x} y={y} width={W} height={H}
                  fill="none" stroke="rgba(255,0,60,0.25)" strokeWidth="0.5" />

                {/* Scan line */}
                <line x1={x} y1={scanY} x2={x + W} y2={scanY}
                  stroke="rgba(255,0,60,0.15)" strokeWidth="1" />

                {/* Noise */}
                {noiseDots.map((nd, j) => (
                  <rect key={j} x={nd.nx} y={nd.ny} width={1} height={1}
                    fill="rgba(255,255,255,0.08)" />
                ))}

                {/* Camera label */}
                <text x={x + 6} y={y + 14} fill="rgba(255,100,100,0.6)" fontSize={8}
                  fontFamily="monospace">{feed.label}</text>

                {/* Status */}
                <text x={x + W - 6} y={y + 14} fill={feed.status === "LIVE" ? "rgba(255,0,60,0.8)" : "rgba(100,100,100,0.5)"}
                  fontSize={7} fontFamily="monospace" textAnchor="end">
                  {feed.status}
                </text>

                {/* REC dot */}
                {feed.status === "LIVE" && (
                  <circle cx={x + W - 35} cy={y + 11} r={2.5}
                    fill={Math.floor(frame / 20) % 2 === 0 ? "#ff0040" : "transparent"} />
                )}

                {/* TARGET LOCKED overlay */}
                {feed.hasTarget && frame > 60 && (
                  <>
                    <rect x={x + W * 0.25} y={y + H * 0.25} width={W * 0.5} height={H * 0.5}
                      fill="none" stroke={targetFlash ? "#ff0040" : "transparent"}
                      strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x={x + W / 2} y={y + H - 12} fill="#ff0040" fontSize={7}
                      fontFamily="monospace" textAnchor="middle" opacity={targetFlash ? 1 : 0}>
                      TARGET LOCKED
                    </text>
                    {/* Crosshair */}
                    <line x1={x + W/2 - 15} y1={y + H/2} x2={x + W/2 + 15} y2={y + H/2}
                      stroke="#ff004060" strokeWidth="0.5" />
                    <line x1={x + W/2} y1={y + H/2 - 15} x2={x + W/2} y2={y + H/2 + 15}
                      stroke="#ff004060" strokeWidth="0.5" />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Camera count overlay */}
        <div style={{
          position: "absolute", top: 20, right: 30,
          fontFamily: "monospace", fontSize: 11,
          color: "rgba(255,0,60,0.7)",
          textAlign: "right",
          letterSpacing: "0.15em",
        }}>
          <div>ACTIVE FEEDS: {camCount.toLocaleString()}</div>
          <div style={{ opacity: 0.4 }}>ENCRYPTION: BYPASSED</div>
          <div style={{ opacity: 0.4 }}>FIREWALL: DISABLED</div>
        </div>

        {/* Center text overlays */}
        <div style={{
          position: "absolute", bottom: 50, left: 0, right: 0,
          textAlign: "center", fontFamily: "monospace",
        }}>
          <div style={{
            color: "#ff2244", fontSize: 18, letterSpacing: "0.2em",
            opacity: interpolate(frame, [10, 25], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: "0 0 15px rgba(255,0,40,0.5)",
            transform: glitch ? `translateX(${Math.sin(frame * 19) * 12}px)` : "none",
          }}>
            {overlayText}
          </div>
          <div style={{
            color: "#ff0040", fontSize: 28, fontWeight: 900, letterSpacing: "0.15em",
            marginTop: 12,
            opacity: interpolate(frame, [100, 115], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            textShadow: "0 0 30px rgba(255,0,60,0.8)",
          }}>
            {overlayText2}
          </div>
        </div>

        {/* CRT/scanline overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,40,0.02) 2px, rgba(255,0,40,0.02) 4px)",
          pointerEvents: "none",
        }} />
      </div>
    </AbsoluteFill>
  );
};
