import { Composition } from "@/models/composition.model";
import { StaveComponent } from "./StaveComponent/StaveComponent";
import { useCompositionStore } from "@/store/composition.store";

export const CompositionComponent = ({
  composition,
}: {
  composition: Composition;
}) => {
  return (
    <div>
      <h2>{composition.title}</h2>

      <StaveComponent composition={composition} />
    </div>
  );
};
