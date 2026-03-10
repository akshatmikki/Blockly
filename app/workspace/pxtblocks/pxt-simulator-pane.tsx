"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPxtProjectFiles,
  getPxtSimulatorHost,
  getPxtSimulatorUrl,
  postToSimulator,
  type PxtSimulatorControl,
  type PxtSimulatorStatus
} from "./pxt-sim-runtime";

type PxtSimulatorPaneProps = {
  code: string;
};

export default function PxtSimulatorPane({ code }: PxtSimulatorPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [status, setStatus] = useState<PxtSimulatorStatus>("loading");
  const [autoRun, setAutoRun] = useState(true);
  const [frameLoaded, setFrameLoaded] = useState(false);

  const simulatorUrl = useMemo(() => getPxtSimulatorUrl(), []);
  const simulatorHost = useMemo(() => getPxtSimulatorHost(), []);

  const controls: PxtSimulatorControl = useMemo(
    () => ({
      run: (tsCode: string) => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const files = buildPxtProjectFiles(tsCode);
        const sent = postToSimulator(iframe, {
          type: "simulateproject",
          project: JSON.stringify(files)
        });
        if (sent) setStatus("running");
      },
      restart: () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const sent = postToSimulator(iframe, { type: "restartsimulator" });
        if (sent) setStatus("running");
      },
      stop: () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const sent = postToSimulator(iframe, { type: "stopsimulator" });
        if (sent) setStatus("stopped");
      }
    }),
    []
  );

  useEffect(() => {
    if (!frameLoaded) return;
    setStatus("ready");
  }, [frameLoaded]);

  useEffect(() => {
    if (!frameLoaded || !autoRun) return;
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      controls.run(code);
    }, 550);
    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [autoRun, code, controls, frameLoaded]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (typeof event.origin === "string" && !event.origin.startsWith(simulatorHost)) return;
      const data = event.data as { type?: string; state?: string };
      if (data.type === "simulator") {
        setStatus("running");
      }
      if (data.type === "messagepacket" && data.state === "stopped") {
        setStatus("stopped");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [simulatorHost]);

  return (
    <section className="flex min-h-0 flex-col border-r border-slate-300 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-slate-300 px-3 py-2">
        <h2 className="text-sm font-semibold text-slate-800">PXT Simulator</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => controls.run(code)}
            className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-500"
          >
            Run
          </button>
          <button
            type="button"
            onClick={controls.restart}
            className="rounded bg-slate-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-500"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={controls.stop}
            className="rounded bg-rose-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-400"
          >
            Stop
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-1.5 text-xs text-slate-600">
        <p>Status: {status}</p>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          Auto Run
        </label>
      </div>
      <div className="min-h-0 flex-1 bg-slate-100">
        <iframe
          ref={iframeRef}
          src={simulatorUrl}
          onLoad={() => setFrameLoaded(true)}
          className="h-full w-full border-0"
          title="PXT Simulator"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </section>
  );
}
