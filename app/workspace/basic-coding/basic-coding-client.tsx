"use client";
import { useEffect, useRef, useState, useMemo } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import 'blockly/msg/en';
import 'blockly/blocks';
import Sk from 'skulpt';
import 'skulpt/dist/skulpt-stdlib.js';
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

  /* =========================
     SPEAK BLOCK
  ========================= */

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
  /* =========================
     SPRITE BLOCK
  ========================= */

  Blockly.Blocks['sprite_show'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Sprite")
        .appendField(
          new Blockly.FieldDropdown([
            ["Laugh", "Laugh"],
            ["Angry", "Angry"],
            ["Cry", "Cry"]
          ]),
          "SPRITE"
        )
        .appendField("webcam")
        .appendField(
          new Blockly.FieldDropdown([
            ["off", "off"],
            ["on", "on"]
          ]),
          "CAM"
        );

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(200);
    }
  };
  /* =========================
     FILE HANDLING
  ========================= */
  /* =========================
     FILE UPLOAD BLOCK
  ========================= */

  Blockly.Blocks['file_upload'] = {
    init: function () {
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldImage(
            "https://cdn-icons-png.flaticon.com/512/716/716784.png",
            20,
            20,
            "*"
          )
        )
        .appendField("Upload file");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(120);
      this.setTooltip("Upload a file from your device");
    }
  };

  Blockly.Blocks['file_open'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Open file")
        .appendField(new Blockly.FieldTextInput("file.txt"), "FILENAME")
        .appendField("in")
        .appendField(
          new Blockly.FieldDropdown([
            ["read", "r"],
            ["write", "w"]
          ]),
          "MODE"
        )
        .appendField("mode");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(120);
    }
  };

  Blockly.Blocks['file_read'] = {
    init: function () {
      this.appendDummyInput().appendField("Read file");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(120);
    }
  };

  Blockly.Blocks['file_write'] = {
    init: function () {
      this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Write to file");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(120);
    }
  };

  Blockly.Blocks['file_close'] = {
    init: function () {
      this.appendDummyInput().appendField("Close file");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(120);
    }
  };

  /* =========================
     SERIAL
  ========================= */

  Blockly.Blocks['serial_send'] = {
    init: function () {
      this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Serial send");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(240);
    }
  };


  function pygalChartBlock(type, label) {
    Blockly.Blocks[`pygal_${type}`] = {
      init: function () {
        this.appendDummyInput()
          .appendField(label);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(280);
      }
    };
  }

  pygalChartBlock("bar", "Bar Chart");
  pygalChartBlock("hbar", "Horizontal Bar Chart");
  pygalChartBlock("line", "Line Chart");
  pygalChartBlock("pie", "Pie Chart");
  pygalChartBlock("radar", "Radar Chart");
  pygalChartBlock("stacked_bar", "Stacked Bar Chart");
  pygalChartBlock("stacked_line", "Stacked Line Chart");
  pygalChartBlock("xy", "XY Chart");

  // Add series
  Blockly.Blocks['pygal_add'] = {
    init: function () {
      this.appendValueInput("LABEL")
        .setCheck("String")
        .appendField("add");
      this.appendValueInput("VALUES")
        .setCheck("Array")
        .appendField("values");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(280);
    }
  };

  // Title
  Blockly.Blocks['pygal_title'] = {
    init: function () {
      this.appendValueInput("TITLE")
        .setCheck("String")
        .appendField("Title Chart");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(280);
    }
  };

  // X labels
  Blockly.Blocks['pygal_xlabels'] = {
    init: function () {
      this.appendValueInput("LABELS")
        .setCheck("Array")
        .appendField("X Labels");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(280);
    }
  };

  // Render
  Blockly.Blocks['pygal_render'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Render Chart");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(280);
    }
  };

  Blockly.Blocks['turtle_create'] = {
    init: function () {
      this.appendDummyInput()
        .appendField("create new turtle")
        .appendField(new Blockly.FieldVariable("turtle"), "VAR");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Create a new turtle");
    }
  };

  // Turtle: Forward
  Blockly.Blocks['turtle_forward'] = {
    init: function () {
      this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("turtle"), "VAR")
        .appendField("forward");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Move turtle forward");
    }
  };

  // Turtle: Turn Right
  Blockly.Blocks['turtle_right'] = {
    init: function () {
      this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("turtle"), "VAR")
        .appendField("turn right");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Turn turtle right");
    }
  };

  // Turtle: Turn Left
  Blockly.Blocks['turtle_left'] = {
    init: function () {
      this.appendValueInput("ANGLE")
        .setCheck("Number")
        .appendField(new Blockly.FieldVariable("turtle"), "VAR")
        .appendField("turn left");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip("Turn turtle left");
    }
  };

  // NOTE: For brevity, I'm truncating the rest of the block definitions
  // In your actual file, keep all the block definitions as they were
  // The fix is only in the useEffect hooks below
};

// ... [REST OF THE FILE CONTENT CONTINUES THE SAME UNTIL THE COMPONENT]

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

  // IMPORTANT FIX: Add a state to track if Blockly is initialized
  const [blocklyInitialized, setBlocklyInitialized] = useState(false);

  // Memoized toolbox XML (same as before)
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
      {
        kind: "category",
        name: "Serial",
        colour: "240",
        contents: [{ kind: "block", type: "serial_send" }]
      },
    ]
  }), []);

  // ============ CRITICAL FIX ============
  // Effect 1: Initialize Blockly - with proper checks and retry logic
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
      // Schedule a retry after a short delay
      const timer = setTimeout(() => {
        DBG("Retrying Blockly initialization");
        setBlocklyInitialized(false); // Trigger re-run
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
      // Don't mark as initialized if there was an error
      setBlocklyInitialized(false);
    }

    return () => {
      if (workspaceRef.current) {
        DBG("Disposing Blockly workspace");
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [toolbox, blocklyInitialized]); // Add blocklyInitialized to dependencies

  // Effect 2: Load activity data - ONLY after Blockly is initialized
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

    // CRITICAL: Wait for workspace to be ready
    if (!workspaceRef.current || !blocklyInitialized) {
      DBG("⏳ Waiting for workspaceReady");
      return;
    }

    DBG("✅ Workspace ready, proceeding with loading");

    // Your existing loader logic here
    if (mode === "ACTIVITY" && activityId) {
      DBG(`Loading activity ${activityId}`);
      // Load activity data...
    } else if (mode === "PROJECT" && projectId) {
      DBG(`Loading project ${projectId}`);
      // Load project data...
    }

  }, [searchParams, blocklyInitialized]); // Add blocklyInitialized to dependencies

  // Rest of your functions remain the same...
  const runWorkspace = async (ws: Blockly.Workspace) => {
    // Your existing runWorkspace code
  };

  const stopWebcam = () => {
    // Your existing stopWebcam code
  };

  const runCode = () => {
    // Your existing runCode implementation
  };

  const handleFileUpload = (e: any) => {
    // Your existing handleFileUpload code
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
        {/* Your existing JSX remains the same */}
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
          {/* Header buttons */}
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Blockly and output panels */}
        </div>
      </div>
    </>
  );
}

export default BasicCodingPage;