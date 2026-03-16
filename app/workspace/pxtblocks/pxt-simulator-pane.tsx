"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildPxtProjectFiles,
  getPxtSimulatorHost,
  getPxtSimulatorUrl,
  postToSimulator,
  type PxtSimulatorControl,
  type PxtSimulatorStatus
} from "./pxt-sim-runtime";
import * as React from "react";

type Props = {
  code: string;
};

export default function PxtSimulatorPane({ code }: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const pendingCodeRef = useRef<string | null>(null);
  const latestCodeRef = useRef<string>(code);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);
  const projectAckRef = useRef(false);

  const [status, setStatus] = useState<PxtSimulatorStatus>("loading");
  const [autoRun, setAutoRun] = useState(true);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [simReady, setSimReady] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [useUrlMode, setUseUrlMode] = useState(false);

  const simulatorUrl = useMemo(() => getPxtSimulatorUrl(), []);
  const simulatorHost = useMemo(() => getPxtSimulatorHost(), []);

  const simulatorOrigin = useMemo(() => {
    try {
      return new URL(simulatorHost).origin;
    } catch {
      if (typeof window !== "undefined") return window.location.origin;
      return null;
    }
  }, [simulatorHost]);

  const sendProject = useCallback((tsCode: string) => {
    const iframe = iframeRef.current;
    if (!iframe) {
      console.log("[PXT Sim Pane] No iframe to send project");
      return false;
    }

    const files = buildPxtProjectFiles(tsCode);

    const sent = postToSimulator(iframe, {
      type: "simulateproject",
      project: JSON.stringify(files)
    });
    console.log("[PXT Sim Pane] Sent simulateproject:", sent);
    return sent;
  }, []);

  const buildUrlModeSrc = useCallback(
    (tsCode: string) => {
      const files = buildPxtProjectFiles(tsCode);
      const encodedCode = encodeURIComponent(files["main.ts"] || "");

      return `${simulatorHost}/run.html?fullscreen=1&code=${encodedCode}`;
    },
    [simulatorHost]
  );

  const controls: PxtSimulatorControl = useMemo(
    () => ({
      run: (tsCode: string) => {
        if (useUrlMode) {
          setFrameLoaded(false);
          setSimReady(false);
          setFrameKey((k) => k + 1);
          return;
        }

        if (!simReady) {
          pendingCodeRef.current = tsCode;
          setStatus("loading");
          return;
        }

        const sent = sendProject(tsCode);
        if (sent) setStatus("running");
      },

      restart: () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        postToSimulator(iframe, {
          type: "restartsimulator"
        });

        setStatus("running");
      },

      stop: () => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        postToSimulator(iframe, {
          type: "stopsimulator"
        });

        setStatus("stopped");
      }
    }),
    [sendProject, simReady, useUrlMode]
  );

  const stopRetry = useCallback(() => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
  }, []);

  const sendWithRetry = useCallback(
    (tsCode: string) => {
      projectAckRef.current = false;
      stopRetry();

      // Send immediately, then retry a few times in case the iframe isn't listening yet.
      const sentNow = sendProject(tsCode);
      if (sentNow) setStatus("running");

      retryTimerRef.current = window.setInterval(() => {
        if (projectAckRef.current || retryCountRef.current >= 5) {
          stopRetry();
          return;
        }
        retryCountRef.current += 1;
        sendProject(tsCode);
      }, 1000);
    },
    [sendProject, stopRetry]
  );

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  useEffect(() => {
    if (!frameLoaded) return;
    setStatus("ready");
  }, [frameLoaded]);

  useEffect(() => {
    if (!frameLoaded || !autoRun) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      controls.run(code);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code, autoRun, frameLoaded, controls]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (
        simulatorOrigin &&
        typeof event.origin === "string" &&
        event.origin !== simulatorOrigin
      )
        return;

      const data = event.data;
      console.log("[PXT Sim Pane] Received message:", data);

      // Echo broadcast messages (like radio packets) back to the simulators
      // so boards can communicate with each other.
      // We add a 'fromHost' flag to avoid infinite loops.
      if (data.broadcast && !data.fromHost && iframeRef.current) {
        // Ensure the serial number is passed along for simulation purposes
        const echoed = { ...data, fromHost: true };
        iframeRef.current.contentWindow?.postMessage(echoed, "*");
      }

      if (data.type === "radiopacket") {
        console.log("[PXT Sim Pane] Full Radio Packet Data received by Host:", data);
        // Sometimes group is nested in payload
        if (data.payload) {
          console.log("[PXT Sim Pane] Payload:", data.payload);
        }
      }

      const isReadyMsg = data.type === "simulator" || data.type === "ready";
      if (isReadyMsg) {
        setSimReady(true);

        if (data.command === "project-received") {
          projectAckRef.current = true;
          stopRetry();
        } else if (pendingCodeRef.current) {
          const pending = pendingCodeRef.current;
          pendingCodeRef.current = null;
          sendWithRetry(pending);
        } else if (data.command === "ready" && status !== "running") {
          // Only send if we are not already running to avoid restart loops
          // when multiple boards report ready.
          sendWithRetry(latestCodeRef.current);
        }
      }

      if (data.type === "messagepacket" && data.state === "stopped") {
        setStatus("stopped");
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [sendProject, simulatorOrigin, sendWithRetry, stopRetry]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-1.5">
        <h2 className="text-sm font-semibold">PXT Simulator</h2>

        <div className="flex gap-2">
          <button
            onClick={() => controls.run(code)}
            className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
          >
            Run
          </button>

          <button
            onClick={controls.restart}
            className="bg-gray-600 text-white px-2 py-1 text-xs rounded"
          >
            Restart
          </button>

          <button
            onClick={controls.stop}
            className="bg-red-500 text-white px-2 py-1 text-xs rounded"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="flex justify-between border-b px-3 py-0.5 text-xs">
        <span>Status: {status}</span>

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
          />
          Auto Run
        </label>
      </div>

      <div className="flex-1 bg-gray-100">
        <iframe
          key={frameKey}
          ref={iframeRef}
          src={
            useUrlMode
              ? buildUrlModeSrc(code)
              : `${simulatorUrl}?v=${frameKey}`
          }
          onLoad={() => {
            setFrameLoaded(true);
            setSimReady(true);
            setStatus("ready");

            if (pendingCodeRef.current) {
              const pending = pendingCodeRef.current;
              pendingCodeRef.current = null;
              sendWithRetry(pending);
            } else if (autoRun) {
              sendWithRetry(latestCodeRef.current);
            }
          }}
          className="w-full h-full border-0"
          title="PXT Simulator"
        />
      </div>
    </section>
  );
}
