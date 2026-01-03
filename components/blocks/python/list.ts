// blockly/python/lists.ts
import { pythonGenerator } from "blockly/python"

/* =========================================================
   CREATE EMPTY LIST
========================================================= */
pythonGenerator.forBlock["lists_create_empty"] = function () {
  return ["[]", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   CREATE LIST WITH ITEMS
========================================================= */
pythonGenerator.forBlock["lists_create_with"] = function (block) {
  const items: string[] = []
  let i = 0

  while (block.getInput("ADD" + i)) {
    const value =
      pythonGenerator.valueToCode(
        block,
        "ADD" + i,
        pythonGenerator.ORDER_NONE
      ) || "None"
    items.push(value)
    i++
  }

  return [`[${items.join(", ")}]`, pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   REPEAT ITEM N TIMES
========================================================= */
pythonGenerator.forBlock["lists_repeat"] = function (block) {
  const item =
    pythonGenerator.valueToCode(
      block,
      "ITEM",
      pythonGenerator.ORDER_NONE
    ) || "None"

  const num =
    pythonGenerator.valueToCode(
      block,
      "NUM",
      pythonGenerator.ORDER_NONE
    ) || "0"

  return [`[${item}] * ${num}`, pythonGenerator.ORDER_MULTIPLICATIVE]
}

/* =========================================================
   REVERSE LIST
========================================================= */
pythonGenerator.forBlock["lists_reverse"] = function (block) {
  const list =
    pythonGenerator.valueToCode(
      block,
      "LIST",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  return [`list(reversed(${list}))`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   IS LIST EMPTY
========================================================= */
pythonGenerator.forBlock["lists_isEmpty"] = function (block) {
  const value =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  return [`len(${value}) == 0`, pythonGenerator.ORDER_RELATIONAL]
}

/* =========================================================
   LIST LENGTH
========================================================= */
pythonGenerator.forBlock["lists_length"] = function (block) {
  const value =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  return [`len(${value})`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   INDEX OF ITEM IN LIST
========================================================= */
pythonGenerator.forBlock["lists_indexOf"] = function (block) {
  const list =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  const find =
    pythonGenerator.valueToCode(
      block,
      "FIND",
      pythonGenerator.ORDER_NONE
    ) || "None"

  const end = block.getFieldValue("END")

  if (end === "FIRST") {
    return [`${list}.index(${find})`, pythonGenerator.ORDER_FUNCTION_CALL]
  } else {
    return [
      `len(${list}) - 1 - ${list}[::-1].index(${find})`,
      pythonGenerator.ORDER_ADDITIVE,
    ]
  }
}

/* =========================================================
   GET / REMOVE ITEM AT INDEX
========================================================= */
pythonGenerator.forBlock["lists_getIndex"] = function (block) {
  const list =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  const mode = block.getFieldValue("MODE")
  const where = block.getFieldValue("WHERE")

  let index = "0"

  if (where === "FROM_START") {
    index =
      pythonGenerator.valueToCode(
        block,
        "AT",
        pythonGenerator.ORDER_NONE
      ) || "0"
  } else if (where === "FROM_END") {
    index = `len(${list}) - 1 - (${pythonGenerator.valueToCode(
      block,
      "AT",
      pythonGenerator.ORDER_NONE
    ) || "0"})`
  } else if (where === "FIRST") {
    index = "0"
  } else if (where === "LAST") {
    index = `len(${list}) - 1`
  } else if (where === "RANDOM") {
    pythonGenerator.definitions_["import_random"] = "import random"
    index = `random.randrange(len(${list}))`
  }

  switch (mode) {
    case "GET":
      return [`${list}[${index}]`, pythonGenerator.ORDER_MEMBER]

    case "GET_REMOVE":
      return [`${list}.pop(${index})`, pythonGenerator.ORDER_FUNCTION_CALL]

    case "REMOVE":
      return `${list}.pop(${index})\n`

    default:
      return [`None`, pythonGenerator.ORDER_ATOMIC]
  }
}

pythonGenerator.forBlock["lists_setIndex"] = function (block) {
  const list =
    pythonGenerator.valueToCode(
      block,
      "LIST",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  const mode = block.getFieldValue("MODE") // INSERT / SET
  const where = block.getFieldValue("WHERE")

  const value =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || "None"

  let index = "0"

  if (where === "FIRST") index = "0"
  else if (where === "LAST") index = `len(${list})`
  else if (where === "FROM_START") {
    index =
      pythonGenerator.valueToCode(
        block,
        "AT",
        pythonGenerator.ORDER_NONE
      ) || "0"
  } else if (where === "FROM_END") {
    index = `len(${list}) - (${pythonGenerator.valueToCode(
      block,
      "AT",
      pythonGenerator.ORDER_NONE
    ) || "0"})`
  }

  // 🔴 INSERT is a STATEMENT
  if (mode === "INSERT") {
    return `${list}.insert(${index}, ${value})\n`
  }

  // 🔴 SET is also a STATEMENT
  return `${list}[${index}] = ${value}\n`
}

