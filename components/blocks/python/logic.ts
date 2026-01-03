// blockly/python/logic.ts
import { pythonGenerator } from "blockly/python"

/* =========================================================
   BOOLEAN TRUE / FALSE
========================================================= */
pythonGenerator.forBlock["logic_boolean"] = function (block) {
  const bool = block.getFieldValue("BOOL")
  return [bool === "TRUE" ? "True" : "False", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   NULL
========================================================= */
pythonGenerator.forBlock["logic_null"] = function () {
  return ["None", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   COMPARISON
========================================================= */
pythonGenerator.forBlock["logic_compare"] = function (block) {
  const OPERATORS: Record<string, string> = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
  }

  const op = OPERATORS[block.getFieldValue("OP")]

  const A =
    pythonGenerator.valueToCode(block, "A", pythonGenerator.ORDER_RELATIONAL) ||
    "0"

  const B =
    pythonGenerator.valueToCode(block, "B", pythonGenerator.ORDER_RELATIONAL) ||
    "0"

  return [`${A} ${op} ${B}`, pythonGenerator.ORDER_RELATIONAL]
}

/* =========================================================
   LOGICAL AND / OR
========================================================= */
pythonGenerator.forBlock["logic_operation"] = function (block) {
  const op = block.getFieldValue("OP") === "AND" ? "and" : "or"

  const A =
    pythonGenerator.valueToCode(block, "A", pythonGenerator.ORDER_LOGICAL_AND) ||
    "False"

  const B =
    pythonGenerator.valueToCode(block, "B", pythonGenerator.ORDER_LOGICAL_AND) ||
    "False"

  return [`${A} ${op} ${B}`, pythonGenerator.ORDER_LOGICAL_AND]
}

/* =========================================================
   NOT
========================================================= */
pythonGenerator.forBlock["logic_negate"] = function (block) {
  const value =
    pythonGenerator.valueToCode(
      block,
      "BOOL",
      pythonGenerator.ORDER_LOGICAL_NOT
    ) || "False"

  return [`not ${value}`, pythonGenerator.ORDER_LOGICAL_NOT]
}

/* =========================================================
   IF / ELSE IF / ELSE
========================================================= */
pythonGenerator.forBlock["controls_if"] = function (block) {
  let code = ""
  let i = 0

  do {
    const condition =
      pythonGenerator.valueToCode(
        block,
        "IF" + i,
        pythonGenerator.ORDER_NONE
      ) || "False"

    const branch = pythonGenerator.statementToCode(block, "DO" + i)

    code +=
      (i === 0 ? "if " : "elif ") +
      condition +
      ":\n" +
      (branch || pythonGenerator.INDENT + "pass\n")

    i++
  } while (block.getInput("IF" + i))

  if (block.getInput("ELSE")) {
    const elseBranch = pythonGenerator.statementToCode(block, "ELSE")
    code += "else:\n" + (elseBranch || pythonGenerator.INDENT + "pass\n")
  }

  return code
}

/* =========================================================
   IF / ELSE (NO MUTATOR)
========================================================= */
pythonGenerator.forBlock["controls_ifelse"] =
  pythonGenerator.forBlock["controls_if"]

/* =========================================================
   TERNARY
========================================================= */
pythonGenerator.forBlock["logic_ternary"] = function (block) {
  const condition =
    pythonGenerator.valueToCode(
      block,
      "IF",
      pythonGenerator.ORDER_CONDITIONAL
    ) || "False"

  const thenValue =
    pythonGenerator.valueToCode(
      block,
      "THEN",
      pythonGenerator.ORDER_CONDITIONAL
    ) || "None"

  const elseValue =
    pythonGenerator.valueToCode(
      block,
      "ELSE",
      pythonGenerator.ORDER_CONDITIONAL
    ) || "None"

  return [
    `${thenValue} if ${condition} else ${elseValue}`,
    pythonGenerator.ORDER_CONDITIONAL,
  ]
}
