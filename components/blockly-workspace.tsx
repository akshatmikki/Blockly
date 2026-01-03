"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import * as Blockly from "blockly"
import "blockly/blocks"
import { pythonGenerator } from "blockly/python"

// Import block definitions FIRST
import "@/components/blocks/turtle"

// Import Python generators AFTER block definitions
import "@/components/blocks/python/text"
import "@/components/blocks/python/list"
import "@/components/blocks/python/logic"
import "@/components/blocks/python/loops"
import "@/components/blocks/python/math"
import "@/components/blocks/python/input"
import "@/components/blocks/python/turtle"

import { TOOLBOX_XML } from "@/lib/blockly-toolbox"

export interface BlocklyWorkspaceRef {
  generateCode: () => string
  resetWorkspace: () => void
}

interface Props {
  onCodeGenerated: (code: string) => void
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, Props>(
  ({ onCodeGenerated }, ref) => {
    const blocklyDivRef = useRef<HTMLDivElement>(null)
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

    useEffect(() => {
      if (!blocklyDivRef.current) return

      // Verify blocks are registered
      console.log("circle_set_radius exists:", Blockly.Blocks["circle_set_radius"])
      console.log("circle_set_bg_color exists:", Blockly.Blocks["circle_set_bg_color"])
      console.log("circle_set_text_color exists:", Blockly.Blocks["circle_set_text_color"])
      console.log("circle_set_text exists:", Blockly.Blocks["circle_set_text"])

      const toolboxDom = Blockly.utils.xml.textToDom(TOOLBOX_XML)

      const workspace = Blockly.inject(blocklyDivRef.current, {
        toolbox: toolboxDom,
        media: "/blockly/media/",
        trashcan: true,
        move: { scrollbars: true, drag: true, wheel: true },
        zoom: { controls: true, wheel: true },
      })

      workspaceRef.current = workspace

      const listener = () => {
        const code = pythonGenerator.workspaceToCode(workspace)
        onCodeGenerated(code)
      }

      workspace.addChangeListener(listener)

      Blockly.svgResize(workspace)

      return () => {
        workspace.removeChangeListener(listener)
        workspace.dispose()
      }
    }, [onCodeGenerated])

    useImperativeHandle(ref, () => ({
      generateCode() {
        return workspaceRef.current
          ? pythonGenerator.workspaceToCode(workspaceRef.current)
          : ""
      },
      resetWorkspace() {
        workspaceRef.current?.clear()
      },
    }))

    return (
      <div
        ref={blocklyDivRef}
        className="h-full w-full"
        style={{ minHeight: 0 }}
      />
    )
  }
)

BlocklyWorkspace.displayName = "BlocklyWorkspace"
export default BlocklyWorkspace