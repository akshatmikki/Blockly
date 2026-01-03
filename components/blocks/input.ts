import {
  createBlockDefinitionsFromJsonArray,
  defineBlocks,
} from '../core/common.js';

export const blocks = createBlockDefinitionsFromJsonArray([
  {
    type: "input_prompt",
    message0: "input %1 with prompt %2",
    args0: [
      {
        type: "field_dropdown",
        name: "TYPE",
        options: [
          ["text", "TEXT"],
          ["number", "NUMBER"],
        ],
      },
      {
        type: "input_value",   // ✅ MUST be input_value
        name: "PROMPT",
        check: "String",
      },
    ],
    output: "String",          // ✅ not true, use type
    colour: 160,
    tooltip: "Take input from the user",
  },
])

defineBlocks(blocks)
