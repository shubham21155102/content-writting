import React from "react";
import { useCurrentFrame } from "remotion";

// Colors
export const D = {
  bg: "#0a0a0a",
  white: "#ffffff",
  red: "#ff4444",
  gray: "#888888",
  dim: "#4a4a4a",
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3D ANIMATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

// 3D container with perspective
export const ThreeDContainer: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      perspective: "1200px",
      perspectiveOrigin: "50% 50%",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// 3D card with depth and shadow
export const ThreeDCard: React.FC<{
  children: React.ReactNode;
  rotateX?: number;
  rotateY?: number;
  translateZ?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  rotateX = 0,
  rotateY = 0,
  translateZ = 0,
  shadow = true,
  style = {},
}) => (
  <div
    style={{
      transformStyle: "preserve-3d",
      transform: `translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      boxShadow: shadow
        ? `0 25px 50px -12px rgba(0, 0, 0, 0.8),
           0 0 0 1px rgba(255, 255, 255, 0.1),
           0 0 100px rgba(255, 68, 68, 0.1)`
        : "none",
      borderRadius: "20px",
      background: "linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(10,10,10,0.95) 100%)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: "40px",
      ...style,
    }}
  >
    {children}
  </div>
);

// Floating 3D text
export const ThreeDText: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  fontSize = 80,
  color = D.white,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  shadow = true,
  style = {},
}) => (
  <div
    style={{
      fontSize,
      color,
      fontWeight: 700,
      fontFamily: "Inter, -apple-system, sans-serif",
      textAlign: "center",
      transformStyle: "preserve-3d",
      transform: `translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      textShadow: shadow
        ? `0 0 40px rgba(255, 68, 68, 0.3),
           0 4px 8px rgba(0, 0, 0, 0.5),
           0 0 80px rgba(255, 255, 255, 0.1)`
        : "none",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      ...style,
    }}
  >
    {children}
  </div>
);

// 3D layered background with floating particles
export const ThreeDBackground: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(ellipse at 20% 30%, rgba(255, 68, 68, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(100, 100, 255, 0.1) 0%, transparent 50%),
        linear-gradient(180deg, #0a0a0a 0%, #111111 100%)
      `,
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </div>
);

// Floating particle
export const FloatingParticle: React.FC<{
  delay: number;
  x: number;
  y: number;
  size?: number;
}> = ({ delay, x, y, size = 4 }) => {
  const frame = useCurrentFrame();
  const floatY = Math.sin((frame + delay) * 0.02) * 20;
  const opacity = 0.3 + Math.sin((frame + delay) * 0.01) * 0.2;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y + floatY}px`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255, 68, 68, 0.6)",
        boxShadow: `0 0 ${size * 2}px rgba(255, 68, 68, 0.8)`,
        opacity,
        transform: "translateZ(50px)",
      }}
    />
  );
};

// 3D progress bar with depth
export const ThreeDProgressBar: React.FC<{
  progress: number;
  label: string;
  color?: string;
  delay?: number;
}> = ({ progress, label, color = D.red, delay = 0 }) => {
  const frame = useCurrentFrame();
  const animatedProgress = Math.min(100, Math.max(0, progress));
  const barWidth = (animatedProgress / 100) * 100;
  const rotateY = Math.sin((frame + delay) * 0.03) * 3;

  return (
    <div
      style={{
        margin: "20px 0",
        transformStyle: "preserve-3d",
        transform: `translateZ(30px) rotateY(${rotateY}deg)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          color: D.white,
          fontSize: 24,
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <span>{label}</span>
        <span>{animatedProgress}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "16px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            borderRadius: "10px",
            boxShadow: `0 0 20px ${color}88, inset 0 1px 2px rgba(255,255,255,0.3)`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

// 3D stat box with hover effect
export const ThreeDStatBox: React.FC<{
  value: string;
  label: string;
  delay?: number;
  color?: string;
}> = ({ value, label, delay = 0, color = D.red }) => {
  const frame = useCurrentFrame();
  const rotateY = Math.sin((frame + delay) * 0.025) * 5;
  const translateY = Math.sin((frame + delay) * 0.02) * 10;
  const opacity = Math.min(1, Math.max(0, (frame - delay) / 30));

  return (
    <ThreeDCard
      rotateY={rotateY}
      translateZ={50}
      style={{
        opacity,
        transform: `translateY(${translateY}px) translateZ(50px) rotateY(${rotateY}deg)`,
        padding: "30px",
        minWidth: "280px",
        background: `linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color,
          fontFamily: "Inter, sans-serif",
          marginBottom: "10px",
          textShadow: `0 0 30px ${color}66`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 20,
          color: D.gray,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </ThreeDCard>
  );
};

// 3D timeline with depth
export const ThreeDTimelineItem: React.FC<{
  year: string;
  event: string;
  delay?: number;
  index: number;
}> = ({ year, event, delay = 0, index }) => {
  const frame = useCurrentFrame();
  const translateZ = 20 + index * 15;
  const rotateY = Math.sin((frame + delay + index * 10) * 0.02) * 3;
  const opacity = Math.min(1, Math.max(0, (frame - delay - index * 10) / 25));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "25px 0",
        opacity,
        transformStyle: "preserve-3d",
        transform: `translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      }}
    >
      <div
        style={{
          width: "120px",
          fontSize: 32,
          fontWeight: 700,
          color: D.white,
          fontFamily: "Inter, sans-serif",
          textAlign: "right",
          paddingRight: "20px",
          textShadow: "0 0 20px rgba(255,255,255,0.3)",
        }}
      >
        {year}
      </div>
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: D.red,
          boxShadow: `0 0 20px ${D.red}88, 0 0 40px ${D.red}44`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: 28,
          color: D.gray,
          fontFamily: "Inter, sans-serif",
          paddingLeft: "20px",
          fontWeight: 500,
        }}
      >
        {event}
      </div>
    </div>
  );
};
