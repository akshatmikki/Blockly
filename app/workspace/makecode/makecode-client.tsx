"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";

const MAKECODE_URL = "https://makecode.microbit.org/#editor";

export default function MakeCodeClient() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const title = useMemo(() => {
    if (!projectId) return "Micro:bit MakeCode";
    return `Micro:bit MakeCode - Project ${projectId}`;
  }, [projectId]);

  return (
    <main className="flex h-screen w-full flex-col bg-slate-100 text-slate-900">
      <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-cyan-800 px-4 text-white">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
          <p className="text-[11px] text-cyan-100 sm:text-xs">
            Use MakeCode menu: Download, Pair device, Connect device
          </p>
        </div>

        <a
          href={MAKECODE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded bg-white px-3 py-1.5 text-xs font-semibold text-cyan-900 hover:bg-cyan-50 sm:text-sm"
        >
          Open Full Editor
          <ExternalLink className="h-4 w-4" />
        </a>
      </header>

      <section className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_330px]">
        <div className="min-h-0 border-r border-slate-300 bg-white">
          <iframe
            title="microbit-makecode-editor"
            src={MAKECODE_URL}
            className="h-full w-full"
            allow="usb; serial; clipboard-read; clipboard-write"
          />
        </div>

        <aside className="border-t border-slate-300 bg-white p-4 lg:border-l lg:border-t-0">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">Connect Micro:bit</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>micro:bit ko USB cable se laptop se connect karo.</li>
            <li>MakeCode editor me top-right menu se `...` open karo.</li>
            <li>`Connect Device` ya `Pair Device` select karo.</li>
            <li>Browser permission popup me micro:bit allow karo.</li>
            <li>`Download` click karo to direct flash ho jayega.</li>
          </ol>

          <p className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            Agar iframe me connect issue aaye, `Open Full Editor` button se MakeCode ko new tab me kholkar pair karein.
          </p>
        </aside>
      </section>
    </main>
  );
}
