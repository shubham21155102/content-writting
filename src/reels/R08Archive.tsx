import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { R, CX, useFadeR, useTypeR } from "./helpers-reels";

interface StatItem {
  number: string;
  label: string;
  color: string;
  startFrame: number;
}

const STATS: StatItem[] = [
  { number: "127,439", label: "messages sent", color: R.white, startFrame: 5 },
  { number: "34,891", label: "photos taken", color: R.white, startFrame: 35 },
  { number: "2,847", label: "songs played on repeat", color: R.white, startFrame: 65 },
  { number: "491", label: "times they typed 'I love you'", color: R.green, startFrame: 95 },
  { number: "67", label: "times they typed it and deleted it", color: R.red, startFrame: 125 },
];

const Stat: React.FC<{
  stat: StatItem;
  isActive: boolean;
  isFading: boolean;
}> = ({ stat, isActive, isFading }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - stat.startFrame,
    fps,
    config: { damping: 12 },
  });

  const activeOp = interpolate(frame - stat.startFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale down + fade when next stat appears
  const fadeScale = isFading
    ? interpolate(frame - (stat.startFrame + 25), [0, 10], [1, 0.9], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const fadeOp = isFading
    ? interpolate(frame - (stat.startFrame + 25), [0, 10], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  if (!isActive && !isFading) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 700,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: R.font,
        opacity: activeOp * fadeOp,
        transform: `scale(${(0.85 + s * 0.15) * fadeScale})`,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: "bold",
          color: stat.color,
          marginBottom: 16,
        }}
      >
        {stat.number}
      </div>
      <div style={{ fontSize: 18, color: R.dimGray }}>
        {stat.label}
      </div>
    </div>
  );
};

const DeletedMessage: React.FC<{
  text: string;
  typeStart: number;
  dissolveStart: number;
  y: number;
  dissolveDuration?: number;
}> = ({ text, typeStart, dissolveStart, y, dissolveDuration = 15 }) => {
  const frame = useCurrentFrame();
  const typed = useTypeR(text, typeStart, 1.0);

  const showOp = interpolate(frame - typeStart, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Turn red before dissolving
  const redPhase = interpolate(frame, [dissolveStart - 3, dissolveStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dissolve: blur + fade + float upward
  const dissolveProgress = interpolate(
    frame,
    [dissolveStart, dissolveStart + dissolveDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dissolveOp = 1 - dissolveProgress;
  const blur = dissolveProgress * 10;
  const floatUp = dissolveProgress * -40;

  const color = redPhase > 0 ? R.red : R.white;

  if (frame < typeStart) return null;

  return (
    <>
      {/* Actively typing / visible message */}
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.mono,
          fontSize: 24,
          color,
          opacity: showOp * dissolveOp,
          filter: `blur(${blur}px)`,
          transform: `translateY(${floatUp}px)`,
          letterSpacing: "0.03em",
        }}
      >
        {typed}
        {frame < dissolveStart && typed.length > 0 && typed.length < text.length && (
          <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
        )}
      </div>

      {/* Ghost residue — faint echo floating above */}
      {dissolveProgress > 0.5 && (
        <div
          style={{
            position: "absolute",
            top: y - 60,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: R.mono,
            fontSize: 20,
            color: R.dim,
            opacity: 0.1,
            filter: "blur(4px)",
            letterSpacing: "0.05em",
          }}
        >
          {text}
        </div>
      )}
    </>
  );
};

export const R08Archive: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which stat is active
  const getStatState = (index: number) => {
    const stat = STATS[index];
    const nextStat = STATS[index + 1];
    const isLast = index === STATS.length - 1;

    const appeared = frame >= stat.startFrame;
    const nextAppeared = nextStat ? frame >= nextStat.startFrame : false;

    // Active: appeared but next hasn't fully taken over
    const isActive = appeared && (!nextAppeared || (nextAppeared && frame < nextStat.startFrame + 10));
    // Fading: next stat is appearing
    const isFading = appeared && nextAppeared && frame < stat.startFrame + 40;

    return { isActive: isActive || (isLast && appeared && frame < 155), isFading };
  };

  // Section 2 visibility
  const section2Op = useFadeR(155, 15);

  // Text input mock
  const inputOp = useFadeR(155, 15);

  // Bottom text
  const text1 = useTypeR("The version of you the world saw...", 275, 0.8);
  const text2 = useTypeR("...was never the whole story.", 290, 0.8);
  const text1Op = useFadeR(275, 10);
  const text2Op = useFadeR(290, 10);

  // Section 1 fade out
  const section1Op = interpolate(frame, [150, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: R.bg }}>
      {/* SECTION 1: Stats — full screen, one at a time */}
      <div style={{ opacity: section1Op }}>
        {STATS.map((stat, i) => {
          const { isActive, isFading } = getStatState(i);
          return (
            <Stat key={i} stat={stat} isActive={isActive} isFading={isFading} />
          );
        })}
      </div>

      {/* SECTION 2: Deleted Messages */}
      {frame >= 155 && (
        <div style={{ opacity: section2Op }}>
          {/* Text input mock */}
          <div
            style={{
              position: "absolute",
              top: 900,
              left: CX - 400,
              width: 800,
              height: 50,
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: 25,
              opacity: inputOp,
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              fontFamily: R.font,
              fontSize: 14,
              color: R.dimGray,
            }}
          >
            {frame < 160 && "Type a message..."}
          </div>

          {/* Deleted messages — type in then dissolve */}
          <DeletedMessage
            text="I miss you"
            typeStart={160}
            dissolveStart={180}
            y={830}
            dissolveDuration={12}
          />
          <DeletedMessage
            text="I'm sorry for what I said"
            typeStart={185}
            dissolveStart={210}
            y={830}
            dissolveDuration={14}
          />
          <DeletedMessage
            text="I don't think I'm okay"
            typeStart={215}
            dissolveStart={240}
            y={830}
            dissolveDuration={20}
          />
          <DeletedMessage
            text="I love you more than I know how to say"
            typeStart={245}
            dissolveStart={270}
            y={830}
            dissolveDuration={28}
          />
        </div>
      )}

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          top: 1650,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: R.font,
          padding: "0 60px",
        }}
      >
        <div style={{ fontSize: 24, color: R.dim, opacity: text1Op, marginBottom: 14 }}>
          {text1}
          {text1.length > 0 &&
            text1.length < "The version of you the world saw...".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
        <div
          style={{
            fontSize: 26,
            color: R.white,
            fontWeight: "bold",
            opacity: text2Op,
          }}
        >
          {text2}
          {text2.length > 0 &&
            text2.length < "...was never the whole story.".length && (
              <span style={{ opacity: Math.floor(frame / 7) % 2 === 0 ? 1 : 0 }}>|</span>
            )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
