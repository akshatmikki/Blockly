import { Suspense } from "react";
import MakeCodeClient from "./makecode-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading MakeCode editor...</div>}>
      <MakeCodeClient />
    </Suspense>
  );
}
