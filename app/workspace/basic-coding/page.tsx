import { Suspense } from "react";
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const BasicCodingClient = dynamicImport(
  () => import("./basic-coding-client"),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BasicCodingClient />
    </Suspense>
  );
}
