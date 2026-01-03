// blockly/python/text.ts
import { pythonGenerator } from "blockly/python"

/* =========================================================
   TEXT LITERAL
========================================================= */
pythonGenerator.forBlock["text"] = function (block) {
  const text = block.getFieldValue("TEXT") ?? ""
  return [`"${text}"`, pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   CREATE TEXT WITH (JOIN)
========================================================= */
pythonGenerator.forBlock["text_join"] = function (block) {
  const items: string[] = []
  let i = 0

  while (block.getInput("ADD" + i)) {
    const value =
      pythonGenerator.valueToCode(
        block,
        "ADD" + i,
        pythonGenerator.ORDER_NONE
      ) || '""'

    // 🔴 Blockly spec: EVERYTHING becomes text
    items.push(`str(${value})`)
    i++
  }

  return [
    `"".join([${items.join(", ")}])`,
    pythonGenerator.ORDER_FUNCTION_CALL,
  ]
}

/* =========================================================
   APPEND TEXT TO VARIABLE
========================================================= */
pythonGenerator.forBlock["text_append"] = function (block) {
  const variable =
    pythonGenerator.nameDB_.getName(
      block.getFieldValue("VAR"),
      "VARIABLE"
    )

  const value =
    pythonGenerator.valueToCode(
      block,
      "TEXT",
      pythonGenerator.ORDER_NONE
    ) || '""'

  return `${variable} = str(${variable}) + str(${value})\n`
}

/* =========================================================
   TEXT LENGTH
========================================================= */
pythonGenerator.forBlock["text_length"] = function (block) {
  const value =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || '""'

  return [`len(${value})`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   IS EMPTY
========================================================= */
pythonGenerator.forBlock["text_isEmpty"] = function (block) {
  const value =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || '""'

  return [`len(${value}) == 0`, pythonGenerator.ORDER_RELATIONAL]
}

/* =========================================================
   INDEX OF
========================================================= */
pythonGenerator.forBlock["text_indexOf"] = function (block) {
  const text =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const find =
    pythonGenerator.valueToCode(
      block,
      "FIND",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const end = block.getFieldValue("END")

  if (end === "FIRST") {
    return [`${text}.find(${find})`, pythonGenerator.ORDER_FUNCTION_CALL]
  } else {
    return [`${text}.rfind(${find})`, pythonGenerator.ORDER_FUNCTION_CALL]
  }
}

/* =========================================================
   CHAR AT
========================================================= */
pythonGenerator.forBlock["text_charAt"] = function (block) {
  const text =
    pythonGenerator.valueToCode(
      block,
      "VALUE",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const where = block.getFieldValue("WHERE")

  switch (where) {
    case "FIRST":
      return [`${text}[0]`, pythonGenerator.ORDER_MEMBER]

    case "LAST":
      return [`${text}[-1]`, pythonGenerator.ORDER_MEMBER]

    case "FROM_START": {
      const at =
        pythonGenerator.valueToCode(
          block,
          "AT",
          pythonGenerator.ORDER_NONE
        ) || "0"
      return [`${text}[${at}]`, pythonGenerator.ORDER_MEMBER]
    }

    case "FROM_END": {
      const at =
        pythonGenerator.valueToCode(
          block,
          "AT",
          pythonGenerator.ORDER_NONE
        ) || "0"
      return [`${text}[-(${at})]`, pythonGenerator.ORDER_MEMBER]
    }

    case "RANDOM":
      pythonGenerator.definitions_["import_random"] = "import random"
      return [
        `${text}[random.randrange(len(${text}))]`,
        pythonGenerator.ORDER_FUNCTION_CALL,
      ]

    default:
      return [`""`, pythonGenerator.ORDER_ATOMIC]
  }
}

/* =========================================================
   GET SUBSTRING
========================================================= */
pythonGenerator.forBlock["text_getSubstring"] = function (block) {
  const text =
    pythonGenerator.valueToCode(
      block,
      "STRING",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const where1 = block.getFieldValue("WHERE1")
  const where2 = block.getFieldValue("WHERE2")

  const at1 =
    pythonGenerator.valueToCode(
      block,
      "AT1",
      pythonGenerator.ORDER_NONE
    ) || "0"

  const at2 =
    pythonGenerator.valueToCode(
      block,
      "AT2",
      pythonGenerator.ORDER_NONE
    ) || "0"

  let start = "0"
  let end = ""

  // Start index
  if (where1 === "FROM_START") start = at1
  else if (where1 === "FROM_END") start = `len(${text}) - ${at1}`
  else if (where1 === "FIRST") start = "0"

  // End index
  if (where2 === "FROM_START") end = at2
  else if (where2 === "FROM_END") end = `len(${text}) - ${at2}`
  else if (where2 === "LAST") end = ""

  return [`${text}[${start}:${end}]`, pythonGenerator.ORDER_MEMBER]
}

/* =========================================================
   CHANGE CASE
========================================================= */
pythonGenerator.forBlock["text_changeCase"] = function (block) {
  const text =
    pythonGenerator.valueToCode(
      block,
      "TEXT",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const mode = block.getFieldValue("CASE")

  const map: Record<string, string> = {
    UPPERCASE: "upper",
    LOWERCASE: "lower",
    TITLECASE: "title",
  }

  return [`${text}.${map[mode]}()`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   TRIM
========================================================= */
pythonGenerator.forBlock["text_trim"] = function (block) {
  const text =
    pythonGenerator.valueToCode(
      block,
      "TEXT",
      pythonGenerator.ORDER_NONE
    ) || '""'

  const mode = block.getFieldValue("MODE")

  if (mode === "LEFT") return [`${text}.lstrip()`, pythonGenerator.ORDER_FUNCTION_CALL]
  if (mode === "RIGHT") return [`${text}.rstrip()`, pythonGenerator.ORDER_FUNCTION_CALL]

  return [`${text}.strip()`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   PRINT
========================================================= */
pythonGenerator.forBlock["text_print"] = function (block) {
  const msg =
    pythonGenerator.valueToCode(
      block,
      "TEXT",
      pythonGenerator.ORDER_NONE
    ) || '""'

  return `print(${msg})\n`
}


/* =========================================================
   PROMPT (TEXT / NUMBER)
========================================================= */
pythonGenerator.forBlock["text_prompt"] = function (block) {
  const type = block.getFieldValue("TYPE")
  const text = block.getFieldValue("TEXT") ?? ""

  if (type === "NUMBER") {
    return [`float(input("${text}"))`, pythonGenerator.ORDER_FUNCTION_CALL]
  }

  return [`input("${text}")`, pythonGenerator.ORDER_FUNCTION_CALL]
}

pythonGenerator.forBlock["text_prompt_ext"] = function (block) {
  const type = block.getFieldValue("TYPE")
  const msg =
    pythonGenerator.valueToCode(
      block,
      "TEXT",
      pythonGenerator.ORDER_NONE
    ) || '""'

  if (type === "NUMBER") {
    return [`float(input(${msg}))`, pythonGenerator.ORDER_FUNCTION_CALL]
  }

  return [`input(${msg})`, pythonGenerator.ORDER_FUNCTION_CALL]
}
