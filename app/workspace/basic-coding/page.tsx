import { Suspense } from "react";
import BasicCodingPage from "./basic-coding-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicCodingPage />
    </Suspense>
  );
}
