import { Composition } from "@/models/composition.model";
import { CompositionPage } from "@/pages/CompositionPage";
import { compositionsList } from "@/tools/composition.list";

export default async function Page({ params }) {
  const { compositionId } = await params;

  return <CompositionPage compositionId={compositionId} />;
}
