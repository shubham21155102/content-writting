import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { V, useFadeV, useSpringV, useCount, GhostText } from "./helpers-viral";

const FONT_UI = "'SF Pro', 'Segoe UI', system-ui, sans-serif";

interface StatConfig {
  value: number;
  label: string;
  startFrame: number;
  color: string;
}

const stats: StatConfig[] = [
  { value: 127439, label: "MESSAGES SENT", startFrame: 20, color: V.white },
  { value: 34891, label: "PHOTOS TAKEN", startFrame: 60, color: V.white },
  { value: 2847, label: "SONGS PLAYED ON REPEAT", startFrame: 100, color: V.white },
  { value: 491, label: "TIMES THEY TYPED 'I LOVE YOU'", startFrame: 140, color: V.green },
  { value: 67, label: "TIMES THEY TYPED IT AND DELETED IT", startFrame: 185, color: V.red },
];

const AnimatedStat: React.FC<{
  stat: StatConfig;
  index: number;
  nextStart: number;
}> = ({ stat, index, nextStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - stat.startFrame,
    fps,
    config: { damping: 16 },
  });

  const countEnd = stat.startFrame + 35;
  const counted = Math.floor(
    interpolate(frame, [stat.startFrame, countEnd], [0, stat.value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Fade in
  const fadeIn = interpolate(frame, [stat.startFrame, stat.startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out when next stat comes (except the last one which stays longer)
  const fadeOut =
    index < stats.length - 1
      ? interpolate(frame, [nextStart - 10, nextStart + 5], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [310, 340], [1, 0.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // Scale down when fading out
  const scaleOut =
    index < stats.length - 1
      ? interpolate(frame, [nextStart - 10, nextStart + 5], [1, 0.85], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const op = fadeIn * fadeOut;

  return (
    <div
      style={{
        position: "absolute",
        top: 320,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: op,
        transform: `scale(${(0.8 + s * 0.2) * scaleOut})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 72,
          fontWeight: 900,
          color: stat.color,
          letterSpacing: "-0.02em",
        }}
      >
        {counted.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 16,
          color: V.dimGray,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: 14,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

export const Scene11Archive: React.FC = () => {
  const frame = useCurrentFrame();

  // Title
  const titleOp = useFadeV(5, 20);

  // Ghost "I love you" messages after stat 5
  const ghost1Start = 230;
  const ghost2Start = 255;
  const ghost3Start = 280;

  // Bottom text
  const bottomTextOp = useFadeV(330, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: V.bg }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
          fontSize: 14,
          color: V.purple,
          letterSpacing: "0.5em",
          opacity: titleOp * 0.6,
        }}
      >
        THE ARCHIVE
      </div>

      {/* Stats */}
      {stats.map((stat, i) => (
        <AnimatedStat
          key={i}
          stat={stat}
          index={i}
          nextStart={i < stats.length - 1 ? stats[i + 1].startFrame : 999}
        />
      ))}

      {/* Ghost "I love you" messages — dissolved memories */}
      <GhostText
        text="I love you"
        startFrame={ghost1Start}
        dissolveFrame={ghost1Start + 15}
        y={470}
        color={V.dimWhite}
        size={24}
      />
      <GhostText
        text="I love you"
        startFrame={ghost2Start}
        dissolveFrame={ghost2Start + 15}
        y={460}
        color={V.dimWhite}
        size={22}
      />
      <GhostText
        text="I love you"
        startFrame={ghost3Start}
        dissolveFrame={ghost3Start + 15}
        y={475}
        color={V.dimWhite}
        size={26}
      />

      {/* Bottom text */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_UI,
          fontSize: 24,
          color: V.dimWhite,
          opacity: bottomTextOp,
        }}
      >
        It remembered the things you were too afraid to send.
      </div>
    </AbsoluteFill>
  );
};
