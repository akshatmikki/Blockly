// blockly/python/math.ts
import { pythonGenerator } from "blockly/python"

/* =========================================================
   NUMBER
========================================================= */
pythonGenerator.forBlock["math_number"] = function (block) {
  const num = block.getFieldValue("NUM")
  return [num, pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   ARITHMETIC
========================================================= */
pythonGenerator.forBlock["math_arithmetic"] = function (block) {
  const op = block.getFieldValue("OP")

  const A =
    pythonGenerator.valueToCode(block, "A", pythonGenerator.ORDER_NONE) || "0"
  const B =
    pythonGenerator.valueToCode(block, "B", pythonGenerator.ORDER_NONE) || "0"

  const OPERATORS: Record<string, [string, number]> = {
    ADD: ["+", pythonGenerator.ORDER_ADDITIVE],
    MINUS: ["-", pythonGenerator.ORDER_ADDITIVE],
    MULTIPLY: ["*", pythonGenerator.ORDER_MULTIPLICATIVE],
    DIVIDE: ["/", pythonGenerator.ORDER_MULTIPLICATIVE],
    POWER: ["**", pythonGenerator.ORDER_EXPONENTIATION],
  }

  const [operator, order] = OPERATORS[op]
  return [`${A} ${operator} ${B}`, order]
}

/* =========================================================
   SINGLE OPERAND
========================================================= */
pythonGenerator.forBlock["math_single"] = function (block) {
  const op = block.getFieldValue("OP")
  const num =
    pythonGenerator.valueToCode(block, "NUM", pythonGenerator.ORDER_NONE) || "0"

  switch (op) {
    case "ROOT":
      return [`(${num} ** 0.5)`, pythonGenerator.ORDER_EXPONENTIATION]
    case "ABS":
      return [`abs(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "NEG":
      return [`-${num}`, pythonGenerator.ORDER_UNARY_SIGN]
    case "LN":
      pythonGenerator.definitions_["import_math"] = "import math"
      return [`math.log(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "LOG10":
      pythonGenerator.definitions_["import_math"] = "import math"
      return [`math.log10(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "EXP":
      pythonGenerator.definitions_["import_math"] = "import math"
      return [`math.exp(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "POW10":
      return [`10 ** ${num}`, pythonGenerator.ORDER_EXPONENTIATION]
  }
  return ["0", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   TRIGONOMETRY (DEGREES → RADIANS)
========================================================= */
pythonGenerator.forBlock["math_trig"] = function (block) {
  const op = block.getFieldValue("OP")
  const num =
    pythonGenerator.valueToCode(block, "NUM", pythonGenerator.ORDER_NONE) || "0"

  pythonGenerator.definitions_["import_math"] = "import math"

  const fn: Record<string, string> = {
    SIN: "sin",
    COS: "cos",
    TAN: "tan",
    ASIN: "asin",
    ACOS: "acos",
    ATAN: "atan",
  }

  if (op === "SIN" || op === "COS" || op === "TAN") {
    return [
      `math.${fn[op]}(math.radians(${num}))`,
      pythonGenerator.ORDER_FUNCTION_CALL,
    ]
  }

  return [
    `math.degrees(math.${fn[op]}(${num}))`,
    pythonGenerator.ORDER_FUNCTION_CALL,
  ]
}

/* =========================================================
   CONSTANTS
========================================================= */
pythonGenerator.forBlock["math_constant"] = function (block) {
  const c = block.getFieldValue("CONSTANT")
  pythonGenerator.definitions_["import_math"] = "import math"

  const map: Record<string, string> = {
    PI: "math.pi",
    E: "math.e",
    GOLDEN_RATIO: "(1 + 5 ** 0.5) / 2",
    SQRT2: "2 ** 0.5",
    SQRT1_2: "(0.5) ** 0.5",
    INFINITY: "float('inf')",
  }

  return [map[c], pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   NUMBER PROPERTY
========================================================= */
pythonGenerator.forBlock["math_number_property"] = function (block) {
  const prop = block.getFieldValue("PROPERTY")
  const num =
    pythonGenerator.valueToCode(
      block,
      "NUMBER_TO_CHECK",
      pythonGenerator.ORDER_NONE
    ) || "0"

  switch (prop) {
    case "EVEN":
      return [`(${num} % 2 == 0)`, pythonGenerator.ORDER_RELATIONAL]
    case "ODD":
      return [`(${num} % 2 == 1)`, pythonGenerator.ORDER_RELATIONAL]
    case "PRIME":
      pythonGenerator.definitions_["is_prime"] = `
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True`
      return [`is_prime(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "WHOLE":
      return [`(${num} % 1 == 0)`, pythonGenerator.ORDER_RELATIONAL]
    case "POSITIVE":
      return [`(${num} > 0)`, pythonGenerator.ORDER_RELATIONAL]
    case "NEGATIVE":
      return [`(${num} < 0)`, pythonGenerator.ORDER_RELATIONAL]
    case "DIVISIBLE_BY": {
      const divisor =
        pythonGenerator.valueToCode(
          block,
          "DIVISOR",
          pythonGenerator.ORDER_NONE
        ) || "1"
      return [`(${num} % ${divisor} == 0)`, pythonGenerator.ORDER_RELATIONAL]
    }
  }
  return ["False", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   CHANGE VARIABLE
========================================================= */
pythonGenerator.forBlock["math_change"] = function (block) {
  const variable = pythonGenerator.nameDB_.getName(
    block.getFieldValue("VAR"),
    "VARIABLE"
  )

  const delta =
    pythonGenerator.valueToCode(
      block,
      "DELTA",
      pythonGenerator.ORDER_NONE
    ) || "0"

  return `${variable} += ${delta}\n`
}

/* =========================================================
   ROUNDING
========================================================= */
pythonGenerator.forBlock["math_round"] = function (block) {
  const op = block.getFieldValue("OP")
  const num =
    pythonGenerator.valueToCode(block, "NUM", pythonGenerator.ORDER_NONE) || "0"

  pythonGenerator.definitions_["import_math"] = "import math"

  switch (op) {
    case "ROUND":
      return [`round(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "ROUNDUP":
      return [`math.ceil(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
    case "ROUNDDOWN":
      return [`math.floor(${num})`, pythonGenerator.ORDER_FUNCTION_CALL]
  }
  return ["0", pythonGenerator.ORDER_ATOMIC]
}

/* =========================================================
   MATH ON LIST
========================================================= */
pythonGenerator.forBlock["math_on_list"] = function (block) {
  const op = block.getFieldValue("OP")
  const list =
    pythonGenerator.valueToCode(
      block,
      "LIST",
      pythonGenerator.ORDER_NONE
    ) || "[]"

  pythonGenerator.definitions_["import_math"] = "import math"
  pythonGenerator.definitions_["import_random"] = "import random"
  pythonGenerator.definitions_["import_stats"] = "import statistics"

  const map: Record<string, string> = {
    SUM: `sum(${list})`,
    MIN: `min(${list})`,
    MAX: `max(${list})`,
    AVERAGE: `statistics.mean(${list})`,
    MEDIAN: `statistics.median(${list})`,
    MODE: `statistics.multimode(${list})`,
    STD_DEV: `statistics.stdev(${list})`,
    RANDOM: `random.choice(${list})`,
  }

  return [map[op], pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   MODULO
========================================================= */
pythonGenerator.forBlock["math_modulo"] = function (block) {
  const a =
    pythonGenerator.valueToCode(
      block,
      "DIVIDEND",
      pythonGenerator.ORDER_NONE
    ) || "0"
  const b =
    pythonGenerator.valueToCode(
      block,
      "DIVISOR",
      pythonGenerator.ORDER_NONE
    ) || "1"

  return [`${a} % ${b}`, pythonGenerator.ORDER_MULTIPLICATIVE]
}

/* =========================================================
   CONSTRAIN
========================================================= */
pythonGenerator.forBlock["math_constrain"] = function (block) {
  const value =
    pythonGenerator.valueToCode(block, "VALUE", pythonGenerator.ORDER_NONE) || "0"
  const low =
    pythonGenerator.valueToCode(block, "LOW", pythonGenerator.ORDER_NONE) || "0"
  const high =
    pythonGenerator.valueToCode(block, "HIGH", pythonGenerator.ORDER_NONE) || "0"

  return [`max(${low}, min(${value}, ${high}))`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   RANDOM INTEGER
========================================================= */
pythonGenerator.forBlock["math_random_int"] = function (block) {
  const from =
    pythonGenerator.valueToCode(block, "FROM", pythonGenerator.ORDER_NONE) || "0"
  const to =
    pythonGenerator.valueToCode(block, "TO", pythonGenerator.ORDER_NONE) || "0"

  pythonGenerator.definitions_["import_random"] = "import random"

  return [`random.randint(${from}, ${to})`, pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   RANDOM FLOAT
========================================================= */
pythonGenerator.forBlock["math_random_float"] = function () {
  pythonGenerator.definitions_["import_random"] = "import random"
  return ["random.random()", pythonGenerator.ORDER_FUNCTION_CALL]
}

/* =========================================================
   ATAN2
========================================================= */
pythonGenerator.forBlock["math_atan2"] = function (block) {
  const x =
    pythonGenerator.valueToCode(block, "X", pythonGenerator.ORDER_NONE) || "0"
  const y =
    pythonGenerator.valueToCode(block, "Y", pythonGenerator.ORDER_NONE) || "0"

  pythonGenerator.definitions_["import_math"] = "import math"

  return [
    `math.degrees(math.atan2(${x}, ${y}))`,
    pythonGenerator.ORDER_FUNCTION_CALL,
  ]
}
