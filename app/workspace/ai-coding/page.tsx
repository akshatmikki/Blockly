import { Suspense } from "react";
import AICodingPage from "./ai-coding-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AICodingPage />
    </Suspense>
  );
}
