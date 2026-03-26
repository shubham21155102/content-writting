import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export function useFade(start: number, dur = 25, from = 0, to = 1) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSpring(delay = 0, damping = 13) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
}

export function useTypewriter(text: string, startFrame: number, charsPerFrame = 0.6) {
  const frame = useCurrentFrame();
  const chars = Math.floor(Math.max(0, frame - startFrame) * charsPerFrame);
  return text.slice(0, chars);
}

export function useBreath(rate = 0.03, depth = 0.05, base = 1) {
  const frame = useCurrentFrame();
  return base + depth * Math.sin(frame * rate * Math.PI * 2);
}

export const COLORS = {
  bg: "#00000a",
  purple: "#7755ff",
  cyan: "#44ddff",
  pink: "#ff44aa",
  green: "#44ffaa",
  white: "#ffffff",
};
