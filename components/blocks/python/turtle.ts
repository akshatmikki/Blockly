import * as Blockly from "blockly";
import { pythonGenerator as Python } from "blockly/python";

const Py: any = Python;

/* ================================
   CREATE NEW TURTLE
================================ */
Python.forBlock["turtle_create"] = function (block) {
  // ✅ Add newlines to definitions
  Py.definitions_["import_turtle"] = "import turtle\n";
  
  if (!Py.definitions_["screen_init"]) {
    Py.definitions_["screen_init"] = "screen = turtle.Screen()\n";
  }

  const varName = Py.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.VARIABLE_CATEGORY_NAME
  );

  return `${varName} = turtle.Turtle()\n`;
};

/* ================================
   SET TURTLE RADIUS (pensize)
================================ */
Python.forBlock["turtle_set_radius"] = function (block) {
  Py.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Py.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const radius =
    Py.valueToCode(block, "RADIUS", Py.ORDER_ATOMIC) || "1";

  const code = `${turtleVar}.pensize(${radius})\n`;
  return code;
};

/* ================================
   SET TURTLE SPEED
================================ */
Python.forBlock["turtle_set_speed"] = function (block) {
  Py.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Py.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const speed =
    Py.valueToCode(block, "SPEED", Py.ORDER_ATOMIC) || "3";

  const code = `${turtleVar}.speed(${speed})\n`;
  return code;
};

/* ================================
   SET TURTLE OUTLINE COLOR
================================ */
Python.forBlock["turtle_set_color"] = function (block) {
  Py.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Py.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const color = block.getFieldValue("COLOR");

  const code = `${turtleVar}.pencolor("${color}")\n`;
  return code;
};

/* ================================
   SET TURTLE FILL COLOR
================================ */
Python.forBlock["turtle_set_fill_color"] = function (block) {
  Py.definitions_["import_turtle"] = "import turtle";

  const turtleVar =
    Py.nameDB_.getName(
      block.getFieldValue("TURTLE"),
      Blockly.VARIABLE_CATEGORY_NAME
    );

  const color = block.getFieldValue("COLOR");

  const code = `${turtleVar}.fillcolor("${color}")\n`;
  return code;
};

/* ================================
   SET BACKGROUND COLOR
================================ */
Python.forBlock["turtle_set_background_color"] = function (block) {
  Py.definitions_["import_turtle"] = "import turtle";
  Py.definitions_["screen_init"] = "screen = turtle.Screen()";

  const color = block.getFieldValue("COLOR");

  const code = `screen.bgcolor("${color}")\n`;
  return code;
};
