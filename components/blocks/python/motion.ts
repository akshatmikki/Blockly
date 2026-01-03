import * as Blockly from "blockly";
import { pythonGenerator as Python } from "blockly/python";

/* ================================
   MOVE FORWARD
================================ */
Python.forBlock["turtle_move_forward"] = function (block) {
  Python.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Python.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const distance =
    Python.valueToCode(block, "DISTANCE", Python.ORDER_ATOMIC) || "0";

  const code = `${turtleVar}.forward(${distance})\n`;
  return code;
};

/* ================================
   MOVE BACKWARD
================================ */
Python.forBlock["turtle_move_backward"] = function (block) {
  Python.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Python.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const distance =
    Python.valueToCode(block, "DISTANCE", Python.ORDER_ATOMIC) || "0";

  const code = `${turtleVar}.backward(${distance})\n`;
  return code;
};

/* ================================
   TURN LEFT
================================ */
Python.forBlock["turtle_turn_left"] = function (block) {
  Python.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Python.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const angle =
    Python.valueToCode(block, "ANGLE", Python.ORDER_ATOMIC) || "0";

  const code = `${turtleVar}.left(${angle})\n`;
  return code;
};

/* ================================
   TURN RIGHT
================================ */
Python.forBlock["turtle_turn_right"] = function (block) {
  Python.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Python.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const angle =
    Python.valueToCode(block, "ANGLE", Python.ORDER_ATOMIC) || "0";

  const code = `${turtleVar}.right(${angle})\n`;
  return code;
};

/* ================================
   SET HEADING
================================ */
Python.forBlock["turtle_set_heading"] = function (block) {
  Python.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Python.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const angle =
    Python.valueToCode(block, "ANGLE", Python.ORDER_ATOMIC) || "0";

  const code = `${turtleVar}.setheading(${angle})\n`;
  return code;
};
