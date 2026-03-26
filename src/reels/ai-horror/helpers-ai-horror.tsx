import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// ===== COLORS =====
export const H = {
  bg: "#000000",
  bloodRed: "#FF0000",
  neonGreen: "#00FF00",
  white: "#FFFFFF",
  darkGray: "#1a1a1a",
  dim: "#666666",
};

export const font = "Impact, 'Arial Black', sans-serif";

// ===== ANIMATION HELPERS =====

// Fade in/out
export const useFade = (
  frame: number,
  fadeIn: number,
  fadeOut: number,
  duration: number
) => {
  return interpolate(
    frame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0]
  );
};

// Glitch effect
export const useGlitch = (frame: number, speed: number = 3) => {
  const isGlitch = Math.floor(frame / speed) % 2 === 0;
  const offset = Math.sin(frame * 0.8) * (isGlitch ? 5 : 0);
  const redChannel = isGlitch && Math.random() > 0.7 ? 255 : 0;

  return {
    isGlitch,
    offset,
    redChannel,
    style: {
      transform: `translateX(${offset}px)`,
      color: `rgb(${redChannel}, ${redChannel === 255 ? 0 : 255}, ${redChannel === 255 ? 0 : 255})`,
    },
  };
};

// Screen shake
export const useShake = (frame: number, intensity: number = 10) => {
  const x = Math.sin(frame * 0.5) * intensity;
  const y = Math.cos(frame * 0.3) * intensity;
  return { x, y };
};

// Heartbeat pulse
export const useHeartbeat = (frame: number) => {
  const beat = Math.sin(frame * 0.3);
  const scale = 1 + beat * 0.15;
  const opacity = 0.7 + beat * 0.3;
  return { scale, opacity };
};

// Typewriter effect
export const useTypewriter = (text: string, speed: number, startFrame: number = 0) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);
  const index = Math.floor(relativeFrame / speed);
  return text.slice(0, index);
};

// Count up animation
export const useCount = (
  startFrame: number,
  duration: number,
  max: number,
  currentFrame: number
) => {
  const progress = Math.min(1, Math.max(0, (currentFrame - startFrame) / duration));
  return Math.floor(progress * max);
};

// Strobe flash
export const useStrobe = (frame: number, speed: number = 5) => {
  return Math.floor(frame / speed) % 2 === 0;
};

// Zoom effect
export const useZoom = (frame: number, startScale: number, endScale: number, duration: number) => {
  return interpolate(frame, [0, duration], [startScale, endScale], {
    extrapolateRight: "clamp",
  });
};

// Slide in from bottom
export const useSlideIn = (frame: number, distance: number, duration: number) => {
  return interpolate(frame, [0, duration], [distance, 0], {
    extrapolateRight: "clamp",
  });
};

// ===== COMPONENTS =====

// Glitchy text component
export const GlitchText: React.FC<{
  children: string;
  fontSize?: number;
  color?: string;
  frame: number;
}> = ({ children, fontSize = 80, color = H.bloodRed, frame }) => {
  const glitch = useGlitch(frame);
  const shake = useShake(frame, glitch.isGlitch ? 8 : 0);

  return (
    <div
      style={{
        fontFamily: font,
        fontSize,
        fontWeight: 900,
        color,
        textAlign: "center",
        transform: `translate(${shake.x}px, ${shake.y}px)`,
        textShadow: glitch.isGlitch
          ? `0 0 ${20 + Math.random() * 30}px rgba(255, 0, 0, 0.8)`
          : "0 0 10px rgba(255, 0, 0, 0.5)",
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

// Data stream background
export const DataStream: React.FC<{ frame: number }> = ({ frame }) => {
  const lines = 30;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.15,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: lines }).map((_, i) => {
        const y = (frame * 3 + i * 50) % 1920;
        const opacity = Math.sin((frame + i * 10) * 0.05) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: y,
              left: Math.random() * 1080,
              fontFamily: "monospace",
              fontSize: 12,
              color: H.neonGreen,
              opacity,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"} {Math.random() > 0.5 ? "1" : "0"}{" "}
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        );
      })}
    </div>
  );
};

// Camera lens aperture
export const CameraAperture: React.FC<{ frame: number }> = ({ frame }) => {
  const scale = interpolate(frame, [0, 30], [2, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 30], [1, 0.3], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 600,
        height: 600,
        border: `8px solid ${H.bloodRed}`,
        borderRadius: "50%",
        opacity,
        boxShadow: `0 0 ${60}px ${H.bloodRed}`,
      }}
    />
  );
};

// Microphone icon with sound wave
export const Microphone: React.FC<{ frame: number }> = ({ frame }) => {
  const waveScale = 1 + Math.sin(frame * 0.3) * 0.3;

  return (
    <div
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 120, marginBottom: 20 }}>🎤</div>
      <div
        style={{
          width: 200,
          height: 100,
          border: "3px solid #00FF00",
          borderRadius: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const height = 20 + Math.sin((frame + i * 5) * 0.2) * 30;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: 0,
                left: i * 10,
                width: 8,
                height,
                backgroundColor: "#00FF00",
                opacity: 0.8,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Mirror effect
export const MirrorEffect: React.FC<{ frame: number }> = ({ frame }) => {
  const glitch = useGlitch(frame);
  const scale = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 400,
        height: 600,
        border: `4px solid ${H.white}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: `0 0 ${40 + Math.sin(frame * 0.2) * 20}px rgba(255, 255, 255, 0.3)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 200,
          opacity: 0.3 + Math.sin(frame * 0.15) * 0.2,
        }}
      >
        👤
      </div>
      {/* Glitch overlay */}
      {glitch.isGlitch && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(255, 0, 0, ${Math.random() * 0.3})`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

// Centered text container
export const CenterText: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  top?: number;
}> = ({ children, fontSize = 80, color = H.white, top = "50%" }) => {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        fontFamily: font,
        fontSize,
        fontWeight: 900,
        color,
        letterSpacing: "1px",
        textTransform: "uppercase",
        width: "100%",
        padding: "0 40px",
      }}
    >
      {children}
    </div>
  );
};
