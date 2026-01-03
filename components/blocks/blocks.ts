/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Former goog.module ID: Blockly.libraryBlocks

import type {BlockDefinition} from '../core/blocks.js';
import * as input from './input.js';
import * as lists from './lists.js';
import * as logic from './logic.js';
import * as loops from './loops.js';
import * as math from './math.js';
import * as procedures from './procedures.js';
import * as texts from './text.js';
import * as variables from './variables.js';
import * as variablesDynamic from './variables_dynamic.js';
import * as turtle from './turtle.js';
import * as motion from './motion.js';

export {
  input,
  lists,
  logic,
  loops,
  math,
  procedures,
  texts,
  variables,
  variablesDynamic,
  turtle,
  motion
};

/**
 * A dictionary of the block definitions provided by all the
 * Blockly.libraryBlocks.* modules.
 */
export const blocks: {[key: string]: BlockDefinition} = Object.assign(
  {},
  input.blocks,
  lists.blocks,
  logic.blocks,
  loops.blocks,
  math.blocks,
  procedures.blocks,
  texts.blocks,
  variables.blocks,
  variablesDynamic.blocks,
  turtle.blocks,
  motion.blocks
);
