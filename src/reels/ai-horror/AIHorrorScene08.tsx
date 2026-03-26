import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { H, CenterText } from "./helpers-ai-horror";

/**
 * SCENE 8 (28-30s): "The Twist/CTA"
 * Text: "DELETE EVERYTHING. NOW." (then fades to) "Follow if you're scared"
 * Visual: Screen goes black, text appears white
 * Audio: Sudden silence → "Follow for more"
 * Effect: Final flash to black
 */
export const AIHorrorScene08: React.FC = () => {
  const frame = useCurrentFrame();

  const mainTextOpacity = interpolate(frame, [0, 30, 60], [1, 1, 0]);
  const ctaOpacity = interpolate(frame, [45, 60, 90], [0, 1, 1]);
  const flashOpacity = interpolate(frame, [0, 15], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      {/* Flash effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#FFFFFF",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Main warning text */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: mainTextOpacity,
        }}
      >
        <CenterText fontSize={100} color={H.bloodRed}>
          DELETE EVERYTHING.
        </CenterText>
        <CenterText fontSize={120} color={H.white} top="55%">
          NOW.
        </CenterText>
      </div>

      {/* CTA text */}
      {frame > 45 && (
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 40,
              color: H.white,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            👇 FOLLOW FOR MORE 👇
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              color: H.dim,
              letterSpacing: "1px",
            }}
          >
            Before it's too late...
          </div>
        </div>
      )}

      {/* Hashtags */}
      {frame > 60 && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 20,
              color: H.dim,
            }}
          >
            #ai #artificialintelligence #tech #scary #horror #viral
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
