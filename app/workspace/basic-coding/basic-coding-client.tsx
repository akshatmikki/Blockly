"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import 'blockly/msg/en';
import 'blockly/blocks';
// ❌ REMOVED: import Sk from 'skulpt';
// ❌ REMOVED: import 'skulpt/dist/skulpt-stdlib.js';
import { useSearchParams } from "next/navigation"
import { javascriptGenerator } from "blockly/javascript";
import { createTurtle } from "@/lib/turtleEngine";

const turtleEngineRef = { current: null as any };
const variablesRef = { current: {} as Record<string, any> }

function DBG(label: string, data?: any) {
  console.log(`🔵 [${label}]`, data || "");
}

function appendConsole(text: string) {
  console.log(text)
}

function showInputPrompt(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const value = window.prompt(prompt) ?? ""
    resolve(value)
  })
}

// Custom Blockly Blocks Definitions
const defineBlocks = () => {
  // NOTE: Include all your block definitions here
  // I'm showing just a few for brevity - use your complete set from the original file
  
  Blockly.Blocks['speak_text'] = {
    init: function () {
      this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Speak");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(20);
      this.setTooltip("Speak the given text");
    }
  };
  
  // ... Include ALL your other block definitions from the original file ...
  // (turtle_create, turtle_forward, sprite_show, file_upload, etc.)
};

function BasicCodingPage() {
  const searchParams = useSearchParams()
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [view, setView] = useState<'blocks' | 'code' | 'canvas'>('blocks');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  
  // FIX 1: Blockly initialization state
  const [blocklyInitialized, setBlocklyInitialized] = useState(false);
  
  // FIX 2: Skulpt loading state
  const [skulptLoaded, setSkulptLoaded] = useState(false);
  const [skulptError, setSkulptError] = useState<string | null>(null);

  // FIX 2: Load Skulpt dynamically
  useEffect(() => {
    const loadSkulpt = async () => {
      try {
        DBG('Loading Skulpt');
        
        // Check if already loaded
        if (typeof window !== 'undefined' && (window as any).Sk) {
          DBG('Skulpt already loaded');
          setSkulptLoaded(true);
          return;
        }

        // Dynamic import
        const skulpt = await import('skulpt');
        await import('skulpt/dist/skulpt-stdlib.js');
        
        // Make globally available
        if (typeof window !== 'undefined') {
          (window as any).Sk = skulpt.default || skulpt;
        }
        
        DBG('✅ Skulpt loaded successfully');
        setSkulptLoaded(true);
      } catch (error) {
        console.error('❌ Skulpt load error:', error);
        setSkulptError('Failed to load Python interpreter');
      }
    };

    loadSkulpt();
  }, []);

  // Helper to get Skulpt from window
  const getSkulpt = () => {
    if (typeof window === 'undefined') return null;
    return (window as any).Sk;
  };

  const toolbox = useMemo(() => ({
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        categorystyle: "logic_category",
        contents: [
          { kind: "block", type: "controls_if" },
          { kind: "block", type: "logic_compare" },
          { kind: "block", type: "logic_operation" },
          { kind: "block", type: "logic_negate" },
          { kind: "block", type: "logic_boolean" },
        ]
      },
      {
        kind: "category",
        name: "Loops",
        categorystyle: "loop_category",
        contents: [
          { kind: "block", type: "controls_repeat_ext" },
          { kind: "block", type: "controls_whileUntil" },
          { kind: "block", type: "controls_for" },
        ]
      },
      {
        kind: "category",
        name: "Math",
        categorystyle: "math_category",
        contents: [
          { kind: "block", type: "math_number" },
          { kind: "block", type: "math_arithmetic" },
          { kind: "block", type: "math_single" },
        ]
      },
      {
        kind: "category",
        name: "Text",
        categorystyle: "text_category",
        contents: [
          { kind: "block", type: "text" },
          { kind: "block", type: "text_print" },
          { kind: "block", type: "text_join" },
        ]
      },
      {
        kind: "category",
        name: "Variables",
        categorystyle: "variable_category",
        custom: "VARIABLE"
      },
      {
        kind: "category",
        name: "Turtle",
        colour: "330",
        contents: [
          { kind: "block", type: "turtle_create" },
          { kind: "block", type: "turtle_forward" },
          { kind: "block", type: "turtle_right" },
          { kind: "block", type: "turtle_left" },
        ]
      },
      {
        kind: "category",
        name: "Speak",
        colour: "20",
        contents: [{ kind: "block", type: "speak_text" }]
      },
      {
        kind: "category",
        name: "Sprite",
        colour: "200",
        contents: [{ kind: "block", type: "sprite_show" }]
      },
    ]
  }), []);

  // FIX 1: Initialize Blockly with retry logic
  useEffect(() => {
    DBG("Blockly init useEffect fired", {
      hasBlocklyDiv: !!blocklyDiv.current,
      blocklyInitialized
    });

    // Skip if already initialized
    if (blocklyInitialized) {
      DBG("Blockly already initialized, skipping");
      return;
    }

    // Wait for the DOM element to be ready
    if (!blocklyDiv.current) {
      DBG("⏳ blocklyDiv.current not ready yet, will retry");
      const timer = setTimeout(() => {
        DBG("Retrying Blockly initialization");
        setBlocklyInitialized(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    try {
      DBG("✅ Initializing Blockly workspace");
      
      defineBlocks();

      const workspace = Blockly.inject(blocklyDiv.current, {
        toolbox,
        zoom: {
          controls: true,
          wheel: false,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        }
      });

      workspaceRef.current = workspace;
      setBlocklyInitialized(true);
      DBG("✅ Blockly workspace created successfully");

      workspace.addChangeListener(() => {
        const newCode = pythonGenerator.workspaceToCode(workspace);
        setCode(newCode);
      });

    } catch (error) {
      console.error("❌ Error initializing Blockly:", error);
      setBlocklyInitialized(false);
    }

    return () => {
      if (workspaceRef.current) {
        DBG("Disposing Blockly workspace");
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [toolbox, blocklyInitialized]);

  // Load activity/project data - only after Blockly is ready
  useEffect(() => {
    const mode = searchParams.get("mode")
    const activityId = searchParams.get("activityId")
    const projectId = searchParams.get("projectId")

    DBG("Loader useEffect fired", {
      mode,
      activityId,
      projectId,
      workspaceReady: !!workspaceRef.current,
      blocklyDiv: !!blocklyDiv.current,
      blocklyInitialized
    });

    if (!workspaceRef.current || !blocklyInitialized) {
      DBG("⏳ Waiting for workspaceReady");
      return;
    }

    DBG("✅ Workspace ready, proceeding with loading");

    if (mode === "ACTIVITY" && activityId) {
      DBG(`Loading activity ${activityId}`);
      // Your activity loading logic here
    } else if (mode === "PROJECT" && projectId) {
      DBG(`Loading project ${projectId}`);
      // Your project loading logic here
    }

  }, [searchParams, blocklyInitialized]);

  const runCode = () => {
    const Sk = getSkulpt();
    
    if (!Sk || !skulptLoaded) {
      setOutput('⏳ Python interpreter is loading. Please wait a moment and try again...');
      return;
    }

    setOutput('');
    
    const cleanedCode = code.replace(/turtle\.__[a-z]+/g, '');
    const usesTurtle = code.includes('turtle.');

    let initCode = `
import sys

class PseudoFile:
    def __init__(self):
        self.content = []
    def write(self, text):
        self.content.append(str(text))
    def flush(self):
        pass

sys.stdout = PseudoFile()
sys.stderr = PseudoFile()
`;

    Sk.configure({
      output: (text: string) => {
        setOutput((prev) => prev + text);
      },
      read: (filename: string) => {
        if (Sk.builtinFiles?.files?.[filename]) {
          return Sk.builtinFiles.files[filename];
        }
        throw new Error(`File not found: ${filename}`);
      },
      inputfun: (prompt: string) => {
        return showInputPrompt(prompt);
      },
      inputfunTakesPrompt: true
    });

    if (usesTurtle) {
      if (!canvasContainerRef.current) {
        setOutput("Canvas container not ready");
        return;
      }

      canvasContainerRef.current.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = canvasContainerRef.current.clientWidth - 20;
      canvas.height = canvasContainerRef.current.clientHeight - 20;
      canvasContainerRef.current.appendChild(canvas);

      const turtle = createTurtle(canvas, (msg) => {
        setOutput((prev) => prev + "\n" + msg);
      });

      turtleEngineRef.current = turtle;

      requestAnimationFrame(() => {
        const ws = workspaceRef.current;

        if (!ws) {
          setOutput("Blockly workspace not ready");
          return;
        }

        const jsCode = javascriptGenerator.workspaceToCode(ws);

        try {
          new Function("__turtle", jsCode)(turtle);
          setOutput((prev) => prev + "\nTurtle executed successfully!");
        } catch (e) {
          console.error("Canvas turtle error", e);
          setOutput((prev) => prev + "\nTurtle execution error");
        }
      });

      return;
    }
    
    if (!usesTurtle) {
      const fullCode = initCode + cleanedCode;

      const myPromise = Sk.misceval.asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, fullCode, true);
      });

      myPromise.then(
        () => {
          setOutput((prev) => prev + "\nCode executed successfully!");
        },
        (err: any) => {
          let errorMessage = "Unknown execution error";

          if (err?.tp$str) errorMessage = err.tp$str();
          if (err?.args?.v?.length) {
            errorMessage += ": " + err.args.v.map((x: any) => x.v).join(", ");
          }

          setOutput((prev) => prev + "\nError: " + errorMessage);
        }
      );
    }
  };

  const runWorkspace = async (ws: Blockly.Workspace) => {
    // Your existing runWorkspace implementation
  };

  function handleFileUpload(e: any) {
    const Sk = getSkulpt();
    if (!Sk) return;
    
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (!Sk.builtinFiles) {
        Sk.builtinFiles = { files: {} };
      }

      Sk.builtinFiles["files"][file.name] = reader.result;
      alert(`File "${file.name}" uploaded successfully`);
    };

    reader.readAsText(file);
  }

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setIsWebcamActive(false);
  };

  const resetWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
    }
    setCode('');
    setOutput('');
    stopWebcam();
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = '';
    }
  };

  // Show loading state while Skulpt or Blockly is loading
  if (!skulptLoaded && !skulptError) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        background: "#7C88CC",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <div style={{ fontSize: "20px" }}>Loading Python interpreter...</div>
        </div>
      </div>
    );
  }

  if (skulptError) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        background: "#7C88CC",
        color: "white"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
        <div style={{ fontSize: "20px", marginBottom: "20px" }}>{skulptError}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: "12px 24px",
            fontSize: "16px",
            background: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            height: "60px",
            background: "#7C88CC",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "10px"
          }}
        >
          <button style={{ padding: "8px 16px", background: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold" }}>
            ☰
          </button>

          <button onClick={resetWorkspace} style={{ padding: "8px 16px", background: "#fff", border: "none", borderRadius: "4px" }}>
            🔄 Reset
          </button>

          <button
            onClick={runCode}
            style={{
              padding: "8px 24px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold"
            }}
          >
            ▶ Run
          </button>

          <button
            onClick={async () => {
              if (!workspaceRef.current) return;
              setOutput("");
              await runWorkspace(workspaceRef.current);
            }}
            style={{
              padding: "8px 24px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold"
            }}
          >
            ▶ Run tutorials
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            {["blocks", "code", "canvas"].map(v => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                style={{
                  padding: "8px 16px",
                  background: view === v ? "#fff" : "#9BA5D8",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* LEFT – Blockly */}
          <div
            style={{
              flex: view === "blocks" ? 1 : 0.6,
              display: view === "canvas" ? "none" : "block",
              minWidth: "400px",
              height: "100%",
              background: "#fff",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* CRITICAL FIX: Blockly div is ALWAYS rendered, never display:none */}
            <div
              ref={blocklyDiv}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: view === "blocks" ? 1 : 0,
                visibility: view === "blocks" ? "visible" : "hidden",
                pointerEvents: view === "blocks" ? "auto" : "none"
              }}
            />

            {/* Code view overlays on top when active */}
            {view === "code" && (
              <div style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                background: "#fff",
                zIndex: 2
              }}>
                <div style={{ padding: "10px", background: "#ddd", fontWeight: "bold" }}>
                  Generated Python Code
                </div>

                <pre
                  style={{
                    flex: 1,
                    margin: 0,
                    padding: "20px",
                    overflowY: "auto",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {code || "# Drag blocks to generate code..."}
                </pre>
              </div>
            )}
          </div>

          {/* RIGHT – Canvas + Output */}
          <div
            style={{
              flex: 1,
              background: "#7C88CC",
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              overflow: "hidden",
              borderLeft: view !== "canvas" ? "2px solid #555" : "none"
            }}
          >
            {/* Canvas */}
            <div
              ref={canvasContainerRef}
              style={{
                flex: view === "canvas" ? 0.8 : 0.6,
                background: "#fff",
                borderRadius: "8px",
                border: "2px solid #5566AA",
                padding: "10px",
                overflow: "hidden",
                marginBottom: "20px"
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  overflowY: "auto",
                  maxHeight: "100%"
                }}
              />
            </div>

            {/* Output */}
            <div
              style={{
                flex: view === "canvas" ? 0.2 : 0.4,
                background: "#5566AA",
                borderRadius: "8px",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                color: "#fff"
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Output:</div>

              <pre
                style={{
                  flex: 1,
                  margin: 0,
                  fontSize: "12px",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  overflowY: "auto"
                }}
              >
                {output || "Ready to run..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicCodingPage;
