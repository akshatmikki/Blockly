// blockly/python/loops.ts
import { pythonGenerator } from "blockly/python"

/* =========================================================
   REPEAT N TIMES (EXTERNAL NUMBER)
========================================================= */
pythonGenerator.forBlock["controls_repeat_ext"] = function (block) {
  const times =
    pythonGenerator.valueToCode(
      block,
      "TIMES",
      pythonGenerator.ORDER_NONE
    ) || "0"

  const branch = pythonGenerator.statementToCode(block, "DO")

  return (
    `for _ in range(${times}):\n` +
    (branch || pythonGenerator.INDENT + "pass\n")
  )
}

/* =========================================================
   REPEAT N TIMES (INTERNAL NUMBER)
========================================================= */
pythonGenerator.forBlock["controls_repeat"] = function (block) {
  const times = block.getFieldValue("TIMES") || 0
  const branch = pythonGenerator.statementToCode(block, "DO")

  return (
    `for _ in range(${times}):\n` +
    (branch || pythonGenerator.INDENT + "pass\n")
  )
}

/* =========================================================
   WHILE / UNTIL
========================================================= */
pythonGenerator.forBlock["controls_whileUntil"] = function (block) {
  const mode = block.getFieldValue("MODE")
  let condition =
    pythonGenerator.valueToCode(
      block,
      "BOOL",
      pythonGenerator.ORDER_NONE
    ) || "False"

  // UNTIL means negate condition
  if (mode === "UNTIL") {
    condition = `not (${condition})`
  }

  const branch = pythonGenerator.statementToCode(block, "DO")

  return (
    `while ${condition}:\n` +
    (branch || pythonGenerator.INDENT + "pass\n")
  )
}

/* =========================================================
   FOR LOOP
========================================================= */
pythonGenerator.forBlock["controls_for"] = function (block) {
  const variable =
    pythonGenerator.nameDB_.getName(
      block.getFieldValue("VAR"),
      "VARIABLE"
    )

  const from =
    pythonGenerator.valueToCode(
      block,
      "FROM",
      pythonGenerator.ORDER_NONE
    ) || "0"

  const to =
    pythonGenerator.valueToCode(
      block,
      "TO",
      pythonGenerator.ORDER_NONE
    ) || "0"

  const by =
    pythonGenerator.valueToCode(
      block,
      "BY",
      pythonGenerator.ORDER_NONE
    ) || "1"

  const branch = pythonGenerator.statementToCode(block, "DO")

  // Python range is exclusive at end → +1
  return (
    `for ${variable} in range(${from}, ${to} + 1, ${by}):\n` +
    (branch || pythonGenerator.INDENT + "pass\n")
  )
}

/* =========================================================
   FOR EACH
========================================================= */
pythonGenerator.forBlock["controls_forEach"] = function (block) {
  const variable =
    pythonGenerator.nameDB_.getName(
      block.getFieldValue("VAR"),
      "VARIABLE"
    )

  const list =
    pythonGenerator.valueToCode(
      block,
      "LIST",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  const branch = pythonGenerator.statementToCode(block, "DO")

  return (
    `for ${variable} in ${list}:\n` +
    (branch || pythonGenerator.INDENT + "pass\n")
  )
}

/* =========================================================
   BREAK / CONTINUE
========================================================= */
pythonGenerator.forBlock["controls_flow_statements"] = function (block) {
  const flow = block.getFieldValue("FLOW")
  return flow === "BREAK" ? "break\n" : "continue\n"
}
