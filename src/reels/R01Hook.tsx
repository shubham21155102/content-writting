import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { R, useFadeR, useTypeR, useCount, Notif } from "./helpers-reels";

export const R01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = useTypeR(
    "Every day, you create a digital version of yourself.",
    80,
    0.9
  );

  const counterValue = useCount(5, 120, 0, 847293);

  const labelOp = useFadeR(60, 20);
  const counterOp = useFadeR(5, 15);
  const bottomOp = useFadeR(80, 15);

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* Stacked notifications */}
      <Notif icon="💬" text="Sarah sent a message" app="Messages" delay={3} y={120} color={R.green} />
      <Notif icon="❤️" text="alex liked your photo" app="Instagram" delay={11} y={210} color={R.red} />
      <Notif icon="📧" text="Meeting at 3pm" app="Gmail" delay={19} y={300} color={R.blue} />
      <Notif icon="🐦" text="+47 followers" app="Twitter" delay={27} y={390} color={R.blue} />
      <Notif icon="📱" text="Mom is calling..." app="Phone" delay={35} y={480} color={R.green} />
      <Notif icon="💰" text="Payment: $2,847" app="Bank" delay={43} y={570} color={R.green} />
      <Notif icon="🎵" text="Your Wrapped is ready" app="Spotify" delay={51} y={660} />
      <Notif icon="📸" text="New story mention" app="Instagram" delay={59} y={750} color={R.red} />

      {/* Counter section */}
      <div
        style={{
          position: "absolute",
          top: 880,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          opacity: labelOp,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: R.dimGray,
            letterSpacing: "0.3em",
            marginBottom: 12,
          }}
        >
          YOUR DIGITAL FOOTPRINT
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: R.white,
            opacity: counterOp,
          }}
        >
          {counterValue.toLocaleString()}
        </div>
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1650,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          fontSize: 22,
          color: R.dim,
          padding: "0 60px",
          opacity: bottomOp,
          lineHeight: 1.5,
        }}
      >
        {typed}
        {typed.length > 0 &&
          typed.length < "Every day, you create a digital version of yourself.".length && (
            <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
          )}
      </div>
    </AbsoluteFill>
  );
};
