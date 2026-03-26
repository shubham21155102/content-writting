import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE - Cyberpunk Horror
// ═══════════════════════════════════════════════════════════════════════════════
export const COLORS = {
  bg: "#000008",
  bgDark: "#00030a",
  red: "#ff2244",
  redDark: "#aa1122",
  cyan: "#00ddee",
  cyanDim: "#008899",
  purple: "#8844ff",
  white: "#ffffff",
  gray: "#445566",
  grayDim: "#223344",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export function useFade(start: number, dur = 30, from = 0, to = 1) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSpring(delay = 0, damping = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
}

export function useTypewriter(text: string, startFrame: number, charsPerFrame = 0.5) {
  const frame = useCurrentFrame();
  const chars = Math.floor(Math.max(0, frame - startFrame) * charsPerFrame);
  return text.slice(0, chars);
}

export function useBreath(rate = 0.02, depth = 1, base = 0) {
  const frame = useCurrentFrame();
  return base + depth * Math.sin(frame * rate * Math.PI * 2);
}

export function useGlitch(intensity = 1) {
  const frame = useCurrentFrame();
  const glitch = Math.random() < 0.02 * intensity;
  return {
    x: glitch ? (Math.random() - 0.5) * 10 * intensity : 0,
    y: glitch ? (Math.random() - 0.5) * 4 * intensity : 0,
    scale: glitch ? 1 + Math.random() * 0.02 * intensity : 1,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKGROUND EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

// CRT scanlines effect
export const CRTScanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.4 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
      opacity,
    }}
  />
);

// Scanning beam effect
export const ScanBeam: React.FC<{ speed?: number }> = ({ speed = 3 }) => {
  const frame = useCurrentFrame();
  const beamY = (frame * speed) % 1920;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 3,
        top: beamY,
        background: "linear-gradient(to bottom, transparent, rgba(0,221,238,0.3), transparent)",
        pointerEvents: "none",
      }}
    />
  );
};

// Digital rain effect (Matrix-style)
const DIGITAL_CHARS = "01アイウエオカキクケコサシスセソAIX";

export const DigitalRain: React.FC<{ density?: number; opacity?: number }> = ({
  density = 15,
  opacity = 0.15
}) => {
  const frame = useCurrentFrame();

  const columns = Array.from({ length: density }, (_, i) => ({
    x: (i / density) * 100,
    speed: 2 + Math.random() * 3,
    offset: Math.random() * 100,
    chars: Array.from({ length: 8 + Math.floor(Math.random() * 10) }, (_, j) => ({
      char: DIGITAL_CHARS[Math.floor(Math.random() * DIGITAL_CHARS.length)],
      offset: j * 16,
    })),
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: 14,
        opacity,
        pointerEvents: "none",
      }}
    >
      {columns.map((col, ci) =>
        col.chars.map((item, ri) => {
          const y = ((frame * col.speed + col.offset + item.offset) % 1920) - 100;
          const charOpacity = ri === 0 ? 1 : 1 - ri / col.chars.length;
          const isHead = ri === 0;

          return (
            <div
              key={`${ci}-${ri}`}
              style={{
                position: "absolute",
                left: `${col.x}%`,
                top: y,
                color: isHead ? COLORS.white : COLORS.red,
                opacity: charOpacity,
                textShadow: isHead ? `0 0 10px ${COLORS.red}` : "none",
                fontWeight: isHead ? "bold" : "normal",
              }}
            >
              {item.char}
            </div>
          );
        })
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Glowing text with multi-layer shadow
export const GlowingText: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  glowIntensity?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  fontSize = 72,
  color = COLORS.white,
  glowColor = COLORS.red,
  glowIntensity = 1,
  style = {},
}) => (
  <div
    style={{
      fontSize,
      fontWeight: 700,
      fontFamily: "'Courier New', monospace",
      color,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      textShadow: `
        0 0 ${20 * glowIntensity}px ${glowColor}66,
        0 0 ${40 * glowIntensity}px ${glowColor}44,
        0 0 ${60 * glowIntensity}px ${glowColor}22
      `,
      ...style,
    }}
  >
    {children}
  </div>
);

// Letter-by-letter drop animation
export const AnimatedTitle: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  color?: string;
  glowColor?: string;
}> = ({ text, fontSize = 90, delay = 0, color = COLORS.white, glowColor = COLORS.red }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");

  return (
    <div style={{ display: "flex", gap: 2, fontFamily: "'Courier New', monospace" }}>
      {letters.map((char, i) => {
        const charDelay = delay + i * 3;
        const charSpring = spring({ frame: frame - charDelay, fps, config: { damping: 14 } });
        const charY = interpolate(charSpring, [0, 1], [-80, 0]);
        const charOp = interpolate(frame - charDelay, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${charY}px)`,
              opacity: charOp,
              fontSize,
              fontWeight: 900,
              letterSpacing: char === " " ? 0 : "0.05em",
              color,
              textShadow: `
                0 0 30px ${glowColor}88,
                0 0 60px ${glowColor}44
              `,
              width: char === " " ? 20 : "auto",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// Typewriter text effect
export const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, fontSize = 24, color = COLORS.gray, speed = 0.6, style = {} }) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(Math.max(0, frame - startFrame) * speed);
  const visibleText = text.slice(0, chars);
  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize,
        color,
        letterSpacing: "0.15em",
        opacity,
        ...style,
      }}
    >
      {visibleText}
      {frame > startFrame && chars < text.length && (
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: fontSize * 1.2,
            background: COLORS.red,
            marginLeft: 4,
            animation: "blink 1s infinite",
          }}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Terminal-style window
export const TerminalWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ children, title = "terminal", opacity = 1, style = {} }) => (
  <div
    style={{
      position: "absolute",
      top: 100,
      left: 60,
      right: 60,
      padding: "32px 40px",
      background: "rgba(0, 10, 20, 0.85)",
      border: "1px solid rgba(255, 34, 68, 0.3)",
      borderRadius: 6,
      backdropFilter: "blur(10px)",
      opacity,
      ...style,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid rgba(255, 34, 68, 0.15)",
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
      ))}
      <span
        style={{
          color: "rgba(255, 255, 255, 0.3)",
          fontSize: 12,
          marginLeft: 8,
          fontFamily: "monospace",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

// Stat box with glow
export const StatBox: React.FC<{
  value: string | number;
  label: string;
  delay?: number;
  color?: string;
}> = ({ value, label, delay = 0, color = COLORS.red }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const boxSpring = useSpring(delay);
  const scale = interpolate(boxSpring, [0, 1], [0.8, 1]);
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        padding: "40px 50px",
        background: "linear-gradient(145deg, rgba(10,15,25,0.95) 0%, rgba(0,5,15,0.98) 100%)",
        border: `2px solid ${color}33`,
        borderRadius: 8,
        textAlign: "center",
        boxShadow: `
          0 0 30px ${color}22,
          inset 0 0 60px rgba(0,0,0,0.5)
        `,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          fontFamily: "'Courier New', monospace",
          color,
          marginBottom: 12,
          textShadow: `0 0 40px ${color}88, 0 0 80px ${color}44`,
          letterSpacing: "0.05em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 18,
          color: COLORS.gray,
          fontFamily: "monospace",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Progress bar with glow
export const ProgressBar: React.FC<{
  label: string;
  progress: number;
  color?: string;
  delay?: number;
}> = ({ label, progress, color = COLORS.red, delay = 0 }) => {
  const frame = useCurrentFrame();
  const barWidth = Math.min(100, Math.max(0, progress));
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, margin: "20px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          fontFamily: "'Courier New', monospace",
          fontSize: 18,
          color: COLORS.white,
          letterSpacing: "0.1em",
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>{Math.floor(barWidth)}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "14px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
            borderRadius: 4,
            boxShadow: `0 0 20px ${color}88, inset 0 1px 2px rgba(255,255,255,0.3)`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

// System label (bottom status bar)
export const SystemLabel: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        fontFamily: "monospace",
        fontSize: 12,
        letterSpacing: "0.3em",
        color: `rgba(0, 221, 238, 0.4)`,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

// Gradient divider
export const GradientDivider: React.FC<{
  width?: number;
  delay?: number;
  color?: string;
}> = ({ width = 400, delay = 0, color = COLORS.cyan }) => {
  const frame = useCurrentFrame();
  const currentWidth = interpolate(frame - delay, [0, 40], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        height: 1,
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        opacity,
        width: currentWidth,
      }}
    />
  );
};
