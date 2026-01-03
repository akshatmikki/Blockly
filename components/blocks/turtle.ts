"use client";
import * as Blockly from "blockly";
import { FieldColour } from "@blockly/field-colour";

/* ================================
   CREATE NEW TURTLE
================================ */
Blockly.Blocks["turtle_create"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("set")
      .appendField(new Blockly.FieldVariable("T"), "VAR")
      .appendField("to create new turtle");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
  },
};


/* ================================
   SET TURTLE RADIUS
================================ */
Blockly.Blocks["turtle_set_radius"] = {
  init: function () {
    this.appendValueInput("RADIUS")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("radius");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Set turtle radius");
  },
};

/* ================================
   SET TURTLE SPEED
================================ */
Blockly.Blocks["turtle_set_speed"] = {
  init: function () {
    this.appendValueInput("SPEED")
      .setCheck("Number")
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("set speed");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Set turtle speed");
  },
};

/* ================================
   SET TURTLE COLOR
================================ */
Blockly.Blocks["turtle_set_color"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("color")
      .appendField(new FieldColour("#ff5722"), "COLOR");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Set turtle outline color");
  },
};

/* ================================
   SET TURTLE FILL COLOR
================================ */
Blockly.Blocks["turtle_set_fill_color"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("make turtle")
      .appendField(new Blockly.FieldVariable("turtle"), "TURTLE")
      .appendField("fill color")
      .appendField(new FieldColour("#ff5722"), "COLOR");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Set turtle fill color");
  },
};

/* ================================
   SET BACKGROUND COLOR
================================ */
Blockly.Blocks["turtle_set_background_color"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("set background color")
      .appendField(new FieldColour("#ffa000"), "COLOR");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(330);
    this.setTooltip("Set canvas background color");
  },
};

/* ================================
   EXPORT (OPTIONAL)
================================ */
export const blocks = {
  turtle_create: Blockly.Blocks["turtle_create"],
  turtle_set_radius: Blockly.Blocks["turtle_set_radius"],
  turtle_set_speed: Blockly.Blocks["turtle_set_speed"],
  turtle_set_color: Blockly.Blocks["turtle_set_color"],
  turtle_set_fill_color: Blockly.Blocks["turtle_set_fill_color"],
  turtle_set_background_color: Blockly.Blocks["turtle_set_background_color"],
};

console.log("Turtle blocks registered:", Object.keys(blocks));
