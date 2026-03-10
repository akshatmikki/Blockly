export type PxtSimulatorStatus = "idle" | "loading" | "ready" | "running" | "stopped" | "error";

export type PxtSimulatorControl = {
  run: (code: string) => void;
  restart: () => void;
  stop: () => void;
};

type SimulatorMessage =
  | { type: "simulateproject"; project: string }
  | { type: "restartsimulator" }
  | { type: "stopsimulator" };

const DEFAULT_PXT_HOST = "http://localhost:3232";

export function getPxtSimulatorHost() {
  const raw = process.env.NEXT_PUBLIC_PXT_SIM_HOST?.trim();
  return raw || DEFAULT_PXT_HOST;
}

export function getPxtSimulatorUrl() {
  const host = getPxtSimulatorHost();
  return `${host}/run.html?server=1&fullscreen=1&single=1`;
}

export function buildPxtProjectFiles(code: string) {
  const mainTs = code?.trim() || "basic.showString(\"Hello\")";
  return {
    "pxt.json": JSON.stringify(
      {
        name: "blockly-project",
        dependencies: {
          device: "*"
        }
      },
      null,
      2
    ),
    "main.ts": mainTs
  };
}

export function postToSimulator(iframe: HTMLIFrameElement, message: SimulatorMessage) {
  const frameWindow = iframe.contentWindow;
  if (!frameWindow) return false;
  frameWindow.postMessage(message, "*");
  return true;
}
