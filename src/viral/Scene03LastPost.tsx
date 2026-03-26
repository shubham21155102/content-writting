import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useTypewriterV, SocialPost } from "./helpers-viral";

const FONT = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

export const Scene03LastPost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Engagement
  const engageOp1 = useFadeV(40, 15);
  const engageOp2 = useFadeV(60, 15);
  const engageOp3 = useFadeV(75, 15);

  // Glitch effects
  const glitch1Active = frame >= 140 && frame < 143;
  const glitch2Active = frame >= 145 && frame < 149;

  const glitchOffsetX = glitch1Active
    ? 20
    : glitch2Active
    ? interpolate(frame, [145, 147, 149], [-40, 30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Scanline
  const scanlineY = glitch1Active
    ? interpolate(frame, [140, 143], [0, 1080], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : -100;

  // Screen tear slices for glitch2
  const tearSlices = glitch2Active
    ? [
        { top: 0, height: 200, offset: -25 },
        { top: 200, height: 180, offset: 35 },
        { top: 380, height: 220, offset: -15 },
        { top: 600, height: 200, offset: 40 },
        { top: 800, height: 280, offset: -30 },
      ]
    : null;

  // Static noise overlay
  const showStatic = frame >= 140 && frame < 150;

  // "Last active" text
  const lastActiveOp = useFadeV(160, 15);

  // Bottom text
  const fullText = "And then, one day, you stopped.";
  const typed = useTypewriterV(fullText, 170, 0.8);
  const textOp = useFadeV(170, 15);

  // Split "stopped" in red
  const stoppedIndex = fullText.indexOf("stopped");
  const renderTypedText = () => {
    if (typed.length <= stoppedIndex) {
      return <span>{typed}</span>;
    }
    const before = typed.slice(0, stoppedIndex);
    const stoppedPart = typed.slice(stoppedIndex);
    return (
      <>
        <span>{before}</span>
        <span style={{ color: V.red }}>{stoppedPart}</span>
      </>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Main content layer — shifted by glitch */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          transform: `translateX(${glitchOffsetX}px)`,
        }}
      >
        {/* Social Post */}
        <SocialPost
          name="You"
          time={frame >= 155 ? "Last active: now" : "Just now"}
          content="Beautiful sunset tonight \u{1F305}"
          likes={103}
          delay={10}
          y={250}
        />

        {/* Engagement */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            fontFamily: FONT,
          }}
        >
          <div style={{ opacity: engageOp1, color: V.dimWhite, fontSize: 14, marginBottom: 10 }}>
            <span>❤️</span> Sarah, Alex, and 101 others
          </div>
          <div
            style={{
              opacity: engageOp2,
              color: V.dimGray,
              fontSize: 13,
              marginBottom: 6,
              paddingLeft: 8,
            }}
          >
            gorgeous!! 😍
          </div>
          <div
            style={{
              opacity: engageOp3,
              color: V.dimGray,
              fontSize: 13,
              paddingLeft: 8,
            }}
          >
            where is this??
          </div>
        </div>

        {/* Last active indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 200,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: lastActiveOp,
            fontFamily: FONT,
            fontSize: 12,
            color: V.green,
          }}
        >
          Last active: now
        </div>
      </div>

      {/* Red scanline */}
      {glitch1Active && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: scanlineY,
            width: 1920,
            height: 3,
            backgroundColor: V.red,
            opacity: 0.7,
          }}
        />
      )}

      {/* Screen tear overlay for glitch 2 */}
      {tearSlices &&
        tearSlices.map((slice, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: slice.top,
              left: slice.offset,
              width: 1920,
              height: slice.height,
              backgroundColor: "transparent",
              borderBottom: `1px solid rgba(255, 59, 92, 0.3)`,
              borderTop: i === 0 ? "none" : `1px solid rgba(255, 59, 92, 0.2)`,
            }}
          />
        ))}

      {/* Static noise overlay */}
      {showStatic && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1920,
            height: 1080,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame}'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
      )}

      {/* Bottom typewriter text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 26,
          color: V.dimWhite,
          opacity: textOp,
        }}
      >
        {renderTypedText()}
        {typed.length > 0 && typed.length < fullText.length && (
          <span style={{ opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>
    </AbsoluteFill>
  );
};
