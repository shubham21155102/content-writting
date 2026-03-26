import "./index.css";
import { Composition, Folder } from "remotion";
import { MyComposition, TOTAL_FRAMES } from "./Composition";
import { ViralComposition, VIRAL_TOTAL_FRAMES } from "./viral/ViralComposition";

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
      </Folder>
    </>
  );
};
