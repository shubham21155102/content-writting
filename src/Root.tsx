import "./index.css";
import { Composition, Folder } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";
import { ViralComposition, VIRAL_TOTAL_FRAMES } from "./viral/ViralComposition";
import { ReelsComposition, REELS_TOTAL } from "./reels/ReelsComposition";
import {
  AIHorror01Composition,
  AIHorror02Composition,
  AIHorror03Composition,
  AIHorror04Composition,
  AIHorror05Composition,
  AIHorror06Composition,
  AIHorror07Composition,
  AIHorror08Composition,
} from "./reels/ai-horror/AIHorrorReel";
import {
  AIJobsHorrorFullComposition,
  AIJobsHorror01Composition,
  AIJobsHorror02Composition,
  AIJobsHorror03Composition,
  AIJobsHorror04Composition,
  AIJobsHorror05Composition,
  AIJobsHorror06Composition,
  AIJobsHorror07Composition,
} from "./reels/ai-jobs-horror/AIJobsHorror";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Films">
        <Composition
          id="TheSignal"
          component={MyComposition}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="IDied"
          component={ViralComposition}
          durationInFrames={VIRAL_TOTAL_FRAMES}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="IDiedReels"
          component={ReelsComposition}
          durationInFrames={REELS_TOTAL}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="AI-Jobs-Horror-FULL-VIDEO">
        <AIJobsHorrorFullComposition />
      </Folder>

      <Folder name="AI-Jobs-Preview-Scenes">
        <AIJobsHorror01Composition />
        <AIJobsHorror02Composition />
        <AIJobsHorror03Composition />
        <AIJobsHorror04Composition />
        <AIJobsHorror05Composition />
        <AIJobsHorror06Composition />
        <AIJobsHorror07Composition />
      </Folder>

      <Folder name="AI-Horror-Reel-Old">
        <AIHorror01Composition />
        <AIHorror02Composition />
        <AIHorror03Composition />
        <AIHorror04Composition />
        <AIHorror05Composition />
        <AIHorror06Composition />
        <AIHorror07Composition />
        <AIHorror08Composition />
      </Folder>
    </>
  );
};
