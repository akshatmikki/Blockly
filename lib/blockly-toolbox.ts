export const TOOLBOX_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
<category name="Input" colour="#FF8C00">
  <block type="input_prompt">
    <value name="PROMPT">
      <shadow type="text">
        <field name="TEXT">Enter value</field>
      </shadow>
    </value>
  </block>
</category>

  <!-- LOGIC -->
  <category name="Logic" categorystyle="logic_category">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_negate"></block>
    <block type="logic_boolean"></block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>

  <!-- LOOPS -->
  <category name="Loops" categorystyle="loop_category">
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>

    <block type="controls_whileUntil"></block>

    <block type="controls_for">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
      <value name="BY">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>

    <block type="controls_forEach"></block>
    <block type="controls_flow_statements"></block>
  </category>

  <!-- MATH -->
  <category name="Math" categorystyle="math_category">
    <block type="math_number"></block>

    <block type="math_arithmetic">
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>

    <block type="math_single"></block>
    <block type="math_trig"></block>
    <block type="math_constant"></block>
    <block type="math_number_property"></block>
    <block type="math_round"></block>
    <block type="math_on_list"></block>
    <block type="math_modulo"></block>
    <block type="math_constrain"></block>
    <block type="math_random_int"></block>
    <block type="math_random_float"></block>
  </category>

  <category name="Turtles" colour="#E91E63">

    <block type="turtle_create"></block>

    <block type="turtle_set_radius">
      <value name="RADIUS">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_set_speed">
      <value name="SPEED">
        <shadow type="math_number">
          <field name="NUM">5</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_set_color"></block>

    <block type="turtle_set_fill_color"></block>

    <block type="turtle_set_background_color"></block>

  </category>

    <!-- MOTION -->
  <category name="Motion" colour="#4CAF50">

    <block type="turtle_move_forward">
      <value name="DISTANCE">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_move_backward">
      <value name="DISTANCE">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_turn_left">
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_turn_right">
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>

    <block type="turtle_set_heading">
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">0</field>
        </shadow>
      </value>
    </block>

  </category>

  <!-- TEXT -->
  <category name="Text" categorystyle="text_category">
    <block type="text"></block>
    <block type="text_join"></block>

    <block type="text_append">
      <value name="TEXT">
        <shadow type="text"></shadow>
      </value>
    </block>

    <block type="text_length"></block>
    <block type="text_isEmpty"></block>
    <block type="text_indexOf"></block>
    <block type="text_charAt"></block>
    <block type="text_getSubstring"></block>
    <block type="text_changeCase"></block>
    <block type="text_trim"></block>
    <block type="text_print"></block>
    <block type="text_prompt_ext"></block>
  </category>

  <!-- LISTS -->
  <category name="Lists" categorystyle="list_category">
    <block type="lists_create_with">
      <mutation items="0"></mutation>
    </block>

    <block type="lists_create_with"></block>
    <block type="lists_repeat"></block>
    <block type="lists_length"></block>
    <block type="lists_isEmpty"></block>
    <block type="lists_indexOf"></block>
    <block type="lists_getIndex"></block>
    <block type="lists_setIndex"></block>
    <block type="lists_getSublist"></block>
    <block type="lists_split"></block>
    <block type="lists_sort"></block>
    <block type="lists_reverse"></block>
  </category>

  <!-- VARIABLES (DYNAMIC – VERY IMPORTANT) -->
  <category
    name="Variables"
    categorystyle="variable_category"
    custom="VARIABLE">
  </category>

  <!-- FUNCTIONS -->
  <category
    name="Functions"
    categorystyle="procedure_category"
    custom="PROCEDURE">
  </category>

</xml>
`
