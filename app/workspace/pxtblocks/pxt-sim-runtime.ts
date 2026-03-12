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

// Use the embedded static editor path so the simulator loads from localhost:3000.
const DEFAULT_PXT_HOST = "/pxt-editor";

export function getPxtSimulatorHost() {
  return DEFAULT_PXT_HOST;
}

export function getPxtSimulatorUrl() {
  const host = getPxtSimulatorHost();
  if (host.startsWith("http://") || host.startsWith("https://")) {
    return `${host}/run.html?server=1&fullscreen=1&single=1&simTop=-150`;
  }
  return `${host}/run.html?server=1&fullscreen=1&single=1&simTop=-150`;
}

export function buildPxtProjectFiles(code: string) {

  const mainTs = code?.trim() || "basic.showString('Hello')";

  return {
    "pxt.json": JSON.stringify(
      {
        name: "blockly-project",
        description: "",
        dependencies: {
          core: "*"
        },
        files: [
          "main.ts"
        ],
        target: "microbit",
        targetVersion: "7.0.13"
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
