import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// ===== COLORS (Documentary Style) =====
export const D = {
  bg: "#0a0a0a",           // Nearly black (not pure black)
  white: "#ffffff",
  red: "#ff4444",           // Warning red (not blood red)
  blue: "#4a90e2",          // Professional blue
  gray: "#888888",
  darkGray: "#333333",
  dim: "#4a4a4a",
  black: "#000000",
};

export const font = "Inter, -apple-system, BlinkMacSystemFont, sans-serif";

// ===== CLEAN, PROFESSIONAL ANIMATIONS =====

// Smooth fade in
export const useFadeIn = (frame: number, duration: number) => {
  return Math.min(1, frame / duration);
};

// Smooth fade out
export const useFadeOut = (frame: number, startFrame: number, duration: number) => {
  if (frame < startFrame) return 1;
  return Math.max(0, 1 - (frame - startFrame) / duration);
};

// Count up smoothly
export const useCountUp = (
  startFrame: number,
  duration: number,
  max: number,
  currentFrame: number
) => {
  if (currentFrame < startFrame) return 0;
  const progress = Math.min(1, (currentFrame - startFrame) / duration);
  // Ease out cubic
  const eased = 1 - Math.pow(1 - progress, 3);
  return Math.floor(eased * max);
};

// Slide in from left (clean, professional)
export const useSlideIn = (frame: number, distance: number, duration: number) => {
  return interpolate(frame, [0, duration], [distance, 0], {
    extrapolateRight: "clamp",
  });
};

// Progress bar fill
export const useProgressFill = (frame: number, startFrame: number, duration: number) => {
  if (frame < startFrame) return 0;
  const progress = Math.min(1, (frame - startFrame) / duration);
  return progress * 100;
};

// ===== COMPONENTS =====

// Clean, professional text container
export const TextContainer: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  top?: string | number;
  textAlign?: "left" | "center" | "right";
  maxWidth?: number;
}> = ({
  children,
  fontSize = 60,
  color = D.white,
  top = "50%",
  textAlign = "center",
  maxWidth = 900,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign,
        fontFamily: font,
        fontSize,
        fontWeight: 600,
        color,
        maxWidth,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </div>
  );
};

// Documentary-style stat box
export const StatBox: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  frame: number;
  delay?: number;
}> = ({ label, value, subtext, color = D.red, frame, delay = 0 }) => {
  const opacity = useFadeIn(frame - delay, 30);
  const slideIn = useSlideIn(frame - delay, 50, 40);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateX(${slideIn}px)`,
        opacity,
        textAlign: "center",
        backgroundColor: "#1a1a1a",
        border: `1px solid ${color}`,
        borderRadius: 12,
        padding: "60px 80px",
        minWidth: 700,
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: D.gray,
          marginBottom: 20,
          fontWeight: 400,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 100,
          fontWeight: 700,
          color,
          marginBottom: 10,
        }}
      >
        {value}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: 28,
            color: D.dim,
            fontWeight: 500,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

// Warning banner
export const WarningBanner: React.FC<{
  text: string;
  frame: number;
}> = ({ text, frame }) => {
  const opacity = useFadeIn(frame, 30);

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        backgroundColor: D.red,
        padding: "20px 0",
        opacity,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: font,
          fontSize: 32,
          fontWeight: 600,
          color: D.white,
          letterSpacing: "0.05em",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Progress bar (for job replacement percentages)
export const ProgressBar: React.FC<{
  label: string;
  percentage: number;
  color?: string;
  frame: number;
  delay?: number;
}> = ({ label, percentage, color = D.red, frame, delay = 0 }) => {
  const effectiveFrame = frame - delay;
  const opacity = useFadeIn(effectiveFrame, 30);
  const fill = useProgressFill(effectiveFrame, 0, 60);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity,
        width: 800,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          fontFamily: font,
          fontSize: 36,
          fontWeight: 600,
          color: D.white,
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>{fill.toFixed(0)}%</span>
      </div>
      <div
        style={{
          height: 40,
          backgroundColor: "#1a1a1a",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill}%`,
            backgroundColor: color,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
};

// Job list with fade-in items
export const JobList: React.FC<{
  jobs: string[];
  title: string;
  frame: number;
}> = ({ jobs, title, frame }) => {
  const titleOpacity = useFadeIn(frame, 20);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 900,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: font,
          fontSize: 40,
          fontWeight: 600,
          color: D.white,
          marginBottom: 60,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      {jobs.map((job, index) => {
        const itemFrame = frame - 30 - index * 15;
        const opacity = useFadeIn(itemFrame, 20);
        const slideIn = useSlideIn(itemFrame, 30, 30);

        if (itemFrame < 0) return null;

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateX(${slideIn}px)`,
              fontFamily: font,
              fontSize: 36,
              fontWeight: 500,
              color: D.gray,
              marginBottom: 20,
              paddingLeft: 40,
              borderLeft: `4px solid ${D.red}`,
            }}
          >
            {job}
          </div>
        );
      })}
    </div>
  );
};

// Timeline graphic
export const Timeline: React.FC<{
  events: { year: string; text: string }[];
  frame: number;
}> = ({ events, frame }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 50,
        right: 50,
        transform: "translateY(-50%)",
      }}
    >
      {events.map((event, index) => {
        const itemFrame = frame - index * 25;
        const opacity = itemFrame > 0 ? Math.min(1, itemFrame / 30) : 0;

        if (itemFrame < 0) return null;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              marginBottom: 50,
              opacity,
            }}
          >
            <div
              style={{
                width: 150,
                fontFamily: font,
                fontSize: 40,
                fontWeight: 700,
                color: D.red,
                textAlign: "right",
                paddingRight: 40,
              }}
            >
              {event.year}
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: font,
                fontSize: 32,
                fontWeight: 500,
                color: D.white,
                paddingTop: 5,
              }}
            >
              {event.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Final CTA box
export const CTABox: React.FC<{
  mainText: string;
  subText: string;
  frame: number;
}> = ({ mainText, subText, frame }) => {
  const opacity = useFadeIn(frame, 40);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: font,
          fontSize: 70,
          fontWeight: 700,
          color: D.white,
          marginBottom: 30,
        }}
      >
        {mainText}
      </div>
      <div
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 500,
          color: D.gray,
        }}
      >
        {subText}
      </div>
    </div>
  );
};
