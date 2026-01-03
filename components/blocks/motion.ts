"use client";
import * as Blockly from "blockly";

/* ================================
   MOVE FORWARD
================================ */
Blockly.Blocks["turtle_move_forward"] = {
  init: function () {
    this.appendValueInput("DISTANCE")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("move forward by");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip("Move turtle forward");
  },
};

/* ================================
   MOVE BACKWARD
================================ */
Blockly.Blocks["turtle_move_backward"] = {
  init: function () {
    this.appendValueInput("DISTANCE")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("move backward by");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip("Move turtle backward");
  },
};

/* ================================
   TURN LEFT
================================ */
Blockly.Blocks["turtle_turn_left"] = {
  init: function () {
    this.appendValueInput("ANGLE")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("turn left by");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip("Turn turtle left");
  },
};

/* ================================
   TURN RIGHT
================================ */
Blockly.Blocks["turtle_turn_right"] = {
  init: function () {
    this.appendValueInput("ANGLE")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("turn right by");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip("Turn turtle right");
  },
};

/* ================================
   SET HEADING
================================ */
Blockly.Blocks["turtle_set_heading"] = {
  init: function () {
    this.appendValueInput("ANGLE")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("set heading");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
    this.setTooltip("Set turtle heading angle");
  },
};

/* ================================
   EXPORT
================================ */
export const blocks = {
  turtle_move_forward: Blockly.Blocks["turtle_move_forward"],
  turtle_move_backward: Blockly.Blocks["turtle_move_backward"],
  turtle_turn_left: Blockly.Blocks["turtle_turn_left"],
  turtle_turn_right: Blockly.Blocks["turtle_turn_right"],
  turtle_set_heading: Blockly.Blocks["turtle_set_heading"],
};

console.log("Motion blocks registered:", Object.keys(blocks));
