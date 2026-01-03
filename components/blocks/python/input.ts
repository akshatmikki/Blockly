import { pythonGenerator } from "blockly/python"

/* =========================================================
   INPUT
========================================================= */
pythonGenerator.forBlock["input_prompt"] = function (block) {
  const type = block.getFieldValue("TYPE")
  const promptCode =
    pythonGenerator.valueToCode(
      block,
      "PROMPT",
      pythonGenerator.ORDER_NONE
    ) || "''"

  if (type === "NUMBER") {
    return [`int(input(${promptCode}))`, pythonGenerator.ORDER_FUNCTION_CALL]
  }

  return [`input(${promptCode})`, pythonGenerator.ORDER_FUNCTION_CALL]
}
