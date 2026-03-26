import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, CX, useFadeR, useTypeR } from "./helpers-reels";

const PhoneLine: React.FC<{
  text: string;
  showFrame: number;
  color?: string;
  blink?: boolean;
}> = ({ text, showFrame, color = R.white, blink }) => {
  const frame = useCurrentFrame();
  const op = useFadeR(showFrame, 8);

  return (
    <div
      style={{
        fontFamily: R.mono,
        fontSize: 16,
        color,
        opacity: op,
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {text}
      {blink && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: R.green,
            opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.3,
          }}
        />
      )}
    </div>
  );
};

export const R07Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Door knocking — oscillation
  const knock1 =
    frame >= 10 && frame <= 25
      ? Math.sin((frame - 10) * 2.5) * interpolate(frame, [10, 25], [6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const knock2 =
    frame >= 40 && frame <= 55
      ? Math.sin((frame - 40) * 3) * interpolate(frame, [40, 55], [10, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const doorShake = knock1 + knock2;

  // Door open animation — splits at frame 80
  const doorOpenProgress = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftDoorX = -doorOpenProgress * 150;
  const rightDoorX = doorOpenProgress * 150;

  // "No answer" text
  const noAnswerOp = useFadeR(60, 12);
  const noAnswerFadeOut = interpolate(frame, [75, 82], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone appearance
  const phoneScale = frame >= 90 ? spring({ frame: frame - 90, fps, config: { damping: 12 } }) : 0;

  // Glitch effect
  const glitchActive = frame >= 150 && frame < 160;
  const glitchOp = glitchActive
    ? interpolate(frame, [150, 155, 160], [0, 0.6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Screen clear text
  const clearTextOp = useFadeR(160, 10);
  const subTextOp = useFadeR(175, 10);

  // Bottom text
  const text1 = useTypeR("It took showing up in person...", 195, 0.8);
  const text2 = useTypeR("...to discover they were gone.", 215, 0.8);
  const text1Op = useFadeR(195, 12);
  const text2Op = useFadeR(215, 12);

  // Door visibility — fade out after phone appears
  const doorOp = interpolate(frame, [90, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* DOOR SECTION */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          height: 600,
          opacity: doorOp,
        }}
      >
        {/* Left half of door */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: CX - 125,
            width: 125,
            height: 500,
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "4px 0 0 4px",
            transform: `translateX(${doorShake + leftDoorX}px)`,
          }}
        />
        {/* Right half of door */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: CX,
            width: 125,
            height: 500,
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "0 4px 4px 0",
            transform: `translateX(${doorShake + rightDoorX}px)`,
          }}
        >
          {/* Doorknob */}
          <div
            style={{
              position: "absolute",
              top: 260,
              left: 100 - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#555",
            }}
          />
        </div>

        {/* No answer text */}
        <div
          style={{
            position: "absolute",
            top: 530,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: R.font,
            fontSize: 16,
            color: R.dimGray,
            opacity: noAnswerOp * noAnswerFadeOut,
          }}
        >
          No answer.
        </div>
      </div>

      {/* PHONE SECTION */}
      {frame >= 90 && (
        <div
          style={{
            position: "absolute",
            top: 400,
            left: CX - 140,
            width: 280,
            height: 500,
            transform: `scale(${phoneScale})`,
            transformOrigin: "center center",
          }}
        >
          {/* Phone body */}
          <div
            style={{
              width: 280,
              height: 500,
              background: "#0a0a0a",
              border: "2px solid #333",
              borderRadius: 30,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            {/* Terminal-style content (before glitch clears it) */}
            {frame < 160 && (
              <div style={{ width: "100%", padding: "0 12px" }}>
                <PhoneLine text="DIGITAL TWIN v3.7" showFrame={100} color={R.purple} />
                <PhoneLine text="STATUS: ACTIVE" showFrame={110} blink />
                <PhoneLine text="Posts: 847" showFrame={118} color={R.dim} />
                <PhoneLine text="Messages: 2,341" showFrame={124} color={R.dim} />
                <PhoneLine text="Detection: 0 alerts" showFrame={130} color={R.dim} />
              </div>
            )}

            {/* Glitch overlay */}
            {glitchActive && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: R.purple,
                  opacity: glitchOp,
                  mixBlendMode: "overlay",
                }}
              />
            )}

            {/* After glitch — clear screen */}
            {frame >= 160 && (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: R.font,
                    fontSize: 20,
                    color: R.white,
                    opacity: clearTextOp,
                    marginBottom: 16,
                  }}
                >
                  I am not them.
                </div>
                <div
                  style={{
                    fontFamily: R.font,
                    fontSize: 16,
                    color: R.dim,
                    opacity: subTextOp,
                    lineHeight: 1.5,
                  }}
                >
                  But I am everything
                  <br />
                  they left behind.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1600,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          padding: "0 80px",
        }}
      >
        <div style={{ fontSize: 22, color: R.dim, opacity: text1Op, marginBottom: 14 }}>
          {text1}
          {text1.length > 0 &&
            text1.length < "It took showing up in person...".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
        <div style={{ fontSize: 22, color: R.red, opacity: text2Op }}>
          {text2}
          {text2.length > 0 &&
            text2.length < "...to discover they were gone.".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
