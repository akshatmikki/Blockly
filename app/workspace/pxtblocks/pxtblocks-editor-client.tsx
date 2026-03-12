"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/msg/en";
import { javascriptGenerator, Order } from "blockly/javascript";
import PxtSimulatorPane from "./pxt-simulator-pane";

const toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Basic",
      colour: "#1f88e5",
      contents: [
        {
          kind: "block",
          type: "device_show_number",
          inputs: {
            NUM: {
              shadow: { type: "math_number", fields: { NUM: 0 } }
            }
          }
        },
        { kind: "block", type: "device_show_leds" },
        { kind: "block", type: "device_show_icon", fields: { ICON: "Heart" } },
        {
          kind: "block",
          type: "device_show_string",
          inputs: {
            TEXT: {
              shadow: { type: "text", fields: { TEXT: "Hello!" } }
            }
          }
        },
        { kind: "block", type: "device_clear_screen" },
        { kind: "block", type: "device_forever" },
        { kind: "block", type: "device_on_start" },
        {
          kind: "block",
          type: "device_pause",
          inputs: {
            time: {
              shadow: { type: "math_number", fields: { NUM: 100 } }
            }
          }
        },
        { kind: "block", type: "device_show_arrow", fields: { ARROW: "North" } }
      ]
    },
    {
      kind: "category",
      name: "Input",
      colour: "#b400d6",
      contents: [
        { kind: "block", type: "input_on_button_pressed" },
        { kind: "block", type: "input_on_gesture" },
        { kind: "block", type: "input_button_is_pressed" }
      ]
    },
    {
      kind: "category",
      name: "Music",
      colour: "#d83b01",
      contents: [
        { kind: "label", text: "Melody" },
        { kind: "block", type: "music_play_melody" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "Tone" },
        { kind: "block", type: "music_play_tone_note_beats" },
        { kind: "block", type: "music_ringtone_play" },
        { kind: "block", type: "music_rest_beat" },
        { kind: "block", type: "music_note_value" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "Volume" },
        { kind: "block", type: "music_set_volume" },
        { kind: "block", type: "music_get_volume" },
        { kind: "block", type: "music_stop_all_sounds" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "Tempo" },
        { kind: "block", type: "music_change_tempo" },
        { kind: "block", type: "music_set_tempo" },
        { kind: "block", type: "music_beat_value" },
        { kind: "block", type: "music_get_tempo" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "Melody Advanced" },
        { kind: "block", type: "music_play_melody_advanced" },
        { kind: "block", type: "music_stop_melody" },
        { kind: "block", type: "music_on_melody_note_played" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "micro:bit (V2)" },
        { kind: "block", type: "music_play_giggle" },
        { kind: "block", type: "music_play_sound_effect" },
        { kind: "block", type: "music_create_sound_effect" },
        { kind: "block", type: "music_sound_is_playing" },
        { kind: "sep", gap: "8" },
        { kind: "label", text: "Simple" },
        { kind: "block", type: "music_play_tone" }
      ]
    },
    {
      kind: "category",
      name: "LED",
      colour: "#5e35b1",
      contents: [
        { kind: "block", type: "led_plot" },
        { kind: "block", type: "led_unplot" },
        { kind: "block", type: "led_toggle" },
        { kind: "block", type: "led_point" }
      ]
    },
    {
      kind: "category",
      name: "Radio",
      colour: "#e91e63",
      contents: [
        { kind: "block", type: "radio_set_group" },
        { kind: "block", type: "radio_send_number" },
        { kind: "block", type: "radio_send_string" },
        { kind: "block", type: "radio_on_received_number" },
        { kind: "block", type: "radio_on_received_string" }
      ]
    },
    { kind: "sep" },
    {
      kind: "category",
      name: "Loops",
      colour: "#5ca65c",
      contents: [
        { kind: "block", type: "controls_repeat_ext" },
        { kind: "block", type: "controls_whileUntil" },
        { kind: "block", type: "controls_for" },
        { kind: "block", type: "controls_forEach" },
        { kind: "block", type: "controls_flow_statements" }
      ]
    },
    {
      kind: "category",
      name: "Logic",
      colour: "#5c81a6",
      contents: [
        { kind: "block", type: "controls_if" },
        { kind: "block", type: "logic_compare" },
        { kind: "block", type: "logic_operation" },
        { kind: "block", type: "logic_boolean" },
        { kind: "block", type: "logic_negate" }
      ]
    },
    {
      kind: "category",
      name: "Variables",
      custom: "VARIABLE",
      colour: "#a65c81"
    },
    {
      kind: "category",
      name: "Math",
      colour: "#5c68a6",
      contents: [
        { kind: "block", type: "math_number" },
        { kind: "block", type: "math_arithmetic" },
        { kind: "block", type: "math_single" },
        { kind: "block", type: "math_random_int" },
        { kind: "block", type: "math_modulo" }
      ]
    },
    {
      kind: "category",
      name: "Advanced",
      colour: "#0f766e",
      contents: [
        {
          kind: "category",
          name: "Functions",
          colour: "#3b82f6",
          contents: [
            { kind: "button", text: "Make a Function...", callbackKey: "MAKE_FUNCTION" }
          ]
        },
        {
          kind: "category",
          name: "Arrays",
          colour: "#f97316",
          contents: [
            { kind: "label", text: "Create" },
            {
              kind: "block",
              type: "variables_set",
              inputs: {
                VALUE: {
                  shadow: {
                    type: "lists_create_with",
                    extraState: { itemCount: 1 }
                  }
                }
              }
            },
            { kind: "block", type: "lists_create_with" },
            { kind: "block", type: "lists_create_empty" },
            { kind: "sep", gap: "8" },
            { kind: "label", text: "Read" },
            { kind: "block", type: "lists_length" },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "GET", WHERE: "FROM_START" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "GET_REMOVE", WHERE: "FROM_START" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "GET_REMOVE", WHERE: "LAST" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "GET_REMOVE", WHERE: "FIRST" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "GET", WHERE: "RANDOM" } },
            { kind: "sep", gap: "8" },
            { kind: "label", text: "Modify" },
            { kind: "block", type: "lists_setIndex", fields: { MODE: "SET", WHERE: "FROM_START" } },
            { kind: "block", type: "lists_setIndex", fields: { MODE: "INSERT", WHERE: "LAST" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "REMOVE", WHERE: "LAST" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "REMOVE", WHERE: "FIRST" } },
            { kind: "block", type: "lists_setIndex", fields: { MODE: "INSERT", WHERE: "FIRST" } },
            { kind: "block", type: "lists_setIndex", fields: { MODE: "INSERT", WHERE: "FROM_START" } },
            { kind: "block", type: "lists_getIndex", fields: { MODE: "REMOVE", WHERE: "FROM_START" } },
            { kind: "sep", gap: "8" },
            { kind: "label", text: "Operations" },
            { kind: "block", type: "lists_indexOf" },
            { kind: "block", type: "lists_reverse" }
          ]
        },
        {
          kind: "category",
          name: "Text",
          colour: "#ca8a04",
          contents: [
            { kind: "block", type: "text" },
            { kind: "block", type: "text_length" },
            { kind: "block", type: "text_join" },
            { kind: "block", type: "text_parse_to_number" },
            { kind: "block", type: "text_split_with" },
            { kind: "block", type: "text_includes" },
            { kind: "block", type: "text_indexOf" },
            { kind: "block", type: "text_isEmpty" },
            { kind: "block", type: "text_substring_length" },
            { kind: "block", type: "text_compare_to" },
            { kind: "block", type: "text_charAt" },
            { kind: "block", type: "text_char_code_at" },
            { kind: "block", type: "text_convert_number_to_text" },
            { kind: "block", type: "text_from_char_code" }
          ]
        },
        {
          kind: "category",
          name: "Game",
          colour: "#059669",
          contents: [
            { kind: "block", type: "game_create_sprite" },
            { kind: "block", type: "game_delete_sprite" },
            { kind: "block", type: "game_sprite_is_deleted" },
            { kind: "block", type: "game_sprite_move_by" },
            { kind: "block", type: "game_sprite_turn_by" },
            { kind: "block", type: "game_sprite_change_x_by" },
            { kind: "block", type: "game_sprite_set_x_to" },
            { kind: "block", type: "game_sprite_x" },
            { kind: "block", type: "game_sprite_is_touching" },
            { kind: "block", type: "game_sprite_is_touching_edge" },
            { kind: "block", type: "game_sprite_if_on_edge_bounce" },
            { kind: "block", type: "game_remove_life" },
            { kind: "block", type: "game_add_life" },
            { kind: "block", type: "game_set_life" },
            { kind: "block", type: "game_set_score" },
            { kind: "block", type: "game_change_score_by" },
            { kind: "block", type: "game_start_countdown" },
            { kind: "block", type: "game_score" },
            { kind: "block", type: "game_over" },
            { kind: "block", type: "game_is_over" },
            { kind: "block", type: "game_is_paused" },
            { kind: "block", type: "game_is_running" }
          ]
        },
        {
          kind: "category",
          name: "more",
          colour: "#059669",
          contents: [
            { kind: "block", type: "game_resume" },
            { kind: "block", type: "game_pause" }
          ]
        },
        {
          kind: "category",
          name: "Images",
          colour: "#7e22ce",
          contents: [
            { kind: "block", type: "images_show_image_offset" },
            { kind: "label", text: "Shows an image at a given offset on the LED display." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_scroll_image" },
            { kind: "label", text: "Scrolls an image with offset and interval." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_create_image" },
            { kind: "label", text: "Creates a 5x5 image from LED pattern." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_create_big_image" },
            { kind: "label", text: "Creates a 5x10 image for scrolling." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_direction" },
            { kind: "label", text: "Direction value used by image APIs." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_icon_image" },
            { kind: "label", text: "Creates a built-in icon image." },
            { kind: "sep", gap: "8" },
            { kind: "block", type: "images_arrow_image" },
            { kind: "label", text: "Creates a built-in arrow image." }
          ]
        },
        {
          kind: "category",
          name: "Pins",
          colour: "#b91c1c",
          contents: [
            { kind: "block", type: "pins_digital_read_pin" },
            { kind: "block", type: "pins_digital_write_pin" },
            { kind: "block", type: "pins_analog_read_pin" },
            { kind: "block", type: "pins_analog_write_pin" },
            { kind: "block", type: "pins_map" },
            { kind: "block", type: "pins_analog_set_period_pin" },
            { kind: "block", type: "pins_set_audio_pin" },
            { kind: "block", type: "pins_set_audio_pin_enabled" },
            { kind: "label", text: "Servo" },
            { kind: "block", type: "pins_servo_write_pin" },
            { kind: "block", type: "pins_servo_set_pulse" }
          ]
        },
        {
          kind: "category",
          name: "more",
          colour: "#b91c1c",
          contents: [
            { kind: "block", type: "pins_set_audio_pin_enabled" }
          ]
        },
        {
          kind: "category",
          name: "Serial",
          colour: "#1d4ed8",
          contents: [
            { kind: "block", type: "serial_write_line" },
            { kind: "block", type: "serial_write_number" },
            { kind: "block", type: "serial_write_value_pair" },
            { kind: "block", type: "serial_write_string" },
            { kind: "block", type: "serial_write_numbers" },
            { kind: "block", type: "serial_read_line" },
            { kind: "block", type: "serial_read_until" },
            { kind: "block", type: "serial_on_data_received" },
            { kind: "block", type: "serial_read_string" },
            { kind: "block", type: "serial_redirect_to" },
            { kind: "block", type: "serial_redirect_to_usb" }
          ]
        },
        {
          kind: "category",
          name: "more",
          colour: "#1d4ed8",
          contents: [
            { kind: "block", type: "serial_set_tx_buffer_size" },
            { kind: "block", type: "serial_set_rx_buffer_size" },
            { kind: "block", type: "serial_write_buffer" },
            { kind: "block", type: "serial_read_buffer" },
            { kind: "block", type: "serial_set_write_line_padding" },
            { kind: "label", text: "Configuration" },
            { kind: "block", type: "serial_set_baud_rate" }
          ]
        },
        {
          kind: "category",
          name: "Control",
          colour: "#374151",
          contents: [
            { kind: "block", type: "control_wait_for_event" },
            { kind: "block", type: "control_run_in_background" },
            { kind: "block", type: "control_millis" },
            { kind: "block", type: "control_reset" },
            { kind: "block", type: "control_wait_micros" },
            { kind: "block", type: "control_raise_event" },
            { kind: "block", type: "control_on_event" },
            { kind: "block", type: "control_event_timestamp" },
            { kind: "block", type: "control_event_value" }
          ]
        },
        {
          kind: "category",
          name: "more",
          colour: "#374151",
          contents: [
            { kind: "block", type: "control_run_in_background" }
          ]
        }
      ]
    }
  ]
} as const;

const pythonBasicContents = [
  {
    kind: "block",
    type: "device_show_number",
    inputs: {
      NUM: {
        shadow: { type: "math_number", fields: { NUM: 0 } }
      }
    }
  },
  { kind: "label", text: "Scroll a number on the screen." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_show_leds" },
  { kind: "label", text: "Draws an image on the LED screen." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_show_icon" },
  { kind: "label", text: "Draws the selected icon on the LED screen." },
  { kind: "sep", gap: "8" },
  {
    kind: "block",
    type: "device_show_string",
    inputs: {
      TEXT: {
        shadow: { type: "text", fields: { TEXT: "Hello!" } }
      }
    }
  },
  { kind: "label", text: "Display text on the display." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_clear_screen" },
  { kind: "label", text: "Turn off all LEDs." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_on_start" },
  { kind: "label", text: "Runs once when program starts." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_forever" },
  { kind: "label", text: "Repeats the code forever in the background." },
  { kind: "sep", gap: "8" },
  {
    kind: "block",
    type: "device_pause",
    inputs: {
      time: {
        shadow: { type: "math_number", fields: { NUM: 100 } }
      }
    }
  },
  { kind: "label", text: "Pause for the specified time in milliseconds." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "device_show_arrow" },
  { kind: "label", text: "Draws an arrow on the LED screen." }
] as const;

const pythonInputContents = [
  { kind: "block", type: "input_on_button_pressed" },
  { kind: "label", text: "Do something when a button (A, B or A+B) is pressed." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_on_gesture" },
  { kind: "label", text: "Do something when a gesture is done." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_on_pin_pressed" },
  { kind: "label", text: "Do something when a pin is touched and released." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_button_is_pressed" },
  { kind: "label", text: "Get the button state (pressed or not)." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_acceleration" },
  { kind: "label", text: "Get acceleration in milli-g's." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_pin_is_pressed" },
  { kind: "label", text: "Get pin touch state (pressed or not)." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_light_level" },
  { kind: "label", text: "Reads the light level from 0 to 255." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_compass_heading" },
  { kind: "label", text: "Gets the current compass heading in degrees." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_temperature" },
  { kind: "label", text: "Gets the temperature in degrees Celsius." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_is_gesture" },
  { kind: "label", text: "Tests if a gesture is currently detected." },
  { kind: "sep", gap: "10" },
  { kind: "label", text: "micro:bit (V2)" },
  { kind: "sep", gap: "4" },
  { kind: "block", type: "input_on_sound" },
  { kind: "label", text: "Run code when a sound is detected." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_on_logo_event" },
  { kind: "label", text: "Do something when the logo is touched and released." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_logo_is_pressed" },
  { kind: "label", text: "Gets the logo state (pressed or not)." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "input_sound_level" },
  { kind: "label", text: "Reads microphone loudness from 0 to 255." }
] as const;

const pythonMusicContents = [
  { kind: "label", text: "Melody" },
  { kind: "block", type: "music_play_melody" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Tone" },
  { kind: "block", type: "music_play_tone_note_beats" },
  { kind: "block", type: "music_ringtone_play" },
  { kind: "block", type: "music_rest_beat" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Volume" },
  { kind: "block", type: "music_set_volume" },
  { kind: "block", type: "music_get_volume" },
  { kind: "block", type: "music_stop_all_sounds" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Tempo" },
  { kind: "block", type: "music_change_tempo" },
  { kind: "block", type: "music_set_tempo" },
  { kind: "block", type: "music_beat_value" },
  { kind: "block", type: "music_get_tempo" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Melody Advanced" },
  { kind: "block", type: "music_on_event" },
  { kind: "block", type: "music_play_melody_advanced" },
  { kind: "block", type: "music_stop_melody" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "micro:bit (V2)" },
  {
    kind: "block",
    type: "music_play_sound_effect",
    inputs: {
      EFFECT: {
        shadow: { type: "text", fields: { TEXT: "soundExpression.giggle" } }
      }
    }
  },
  { kind: "block", type: "music_create_sound_effect" },
  { kind: "block", type: "music_sound_is_playing" },
  { kind: "block", type: "music_set_built_in_speaker_enabled" },
  { kind: "block", type: "music_play_giggle" },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Simple" },
  { kind: "block", type: "music_play_tone" }
] as const;

const pythonLedContents = [
  { kind: "block", type: "led_plot" },
  {
    kind: "label",
    text: "Turn on the specified LED using x, y coordinates (x is horizontal, y is vertical). (0,0) is upper left."
  },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "led_toggle" },
  { kind: "label", text: "Toggles a particular pixel" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "led_unplot" },
  {
    kind: "label",
    text: "Turn off the specified LED using x, y coordinates (x is horizontal, y is vertical). (0,0) is upper left."
  },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "led_point" },
  {
    kind: "label",
    text: "Get the on/off state of the specified LED using x, y coordinates. (0,0) is upper left."
  },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "led_plot_bar_graph" },
  {
    kind: "label",
    text: "Displays a vertical bar graph based on the 'value' and 'high' value. If 'high' is 0, the chart gets adjusted automatically."
  }
] as const;

const pythonRadioContents = [
  { kind: "label", text: "Group" },
  { kind: "block", type: "radio_set_group" },
  {
    kind: "label",
    text: "Sets the group id for radio communications. A micro:bit can only listen to one group id at any time."
  },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Send" },
  { kind: "block", type: "radio_send_number" },
  { kind: "label", text: "Broadcasts a number over radio to any connected micro:bit in the group." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "radio_send_value" },
  {
    kind: "label",
    text: "Broadcasts a name / value pair in the device serial number and running time."
  },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "radio_send_string" },
  {
    kind: "label",
    text: "Broadcasts a string with the device serial number and running time."
  },
  { kind: "sep", gap: "8" },
  { kind: "label", text: "Receive" },
  { kind: "block", type: "radio_on_received_number" },
  { kind: "label", text: "Registers code to run when the radio receives a number." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "radio_on_received_value" },
  { kind: "label", text: "Registers code to run when the radio receives a key value pair." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "radio_on_received_string" },
  { kind: "label", text: "Registers code to run when the radio receives a string." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "radio_received_packet" },
  { kind: "label", text: "Returns properties of the last radio packet received." }
] as const;

const pythonLoopsContents = [
  {
    kind: "block",
    type: "controls_whileUntil",
    fields: { MODE: "WHILE" }
  },
  { kind: "label", text: "Repeat code while condition is true" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "controls_repeat_ext" },
  { kind: "label", text: "Repeat code a number of times in a loop" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "loops_every_interval" },
  {
    kind: "label",
    text: "Repeats the code forever in the background. After each iteration, allows other codes to run for a set duration so that it runs on a timer"
  }
] as const;

const pythonLogicContents = [
  { kind: "block", type: "logic_if_simple" },
  { kind: "label", text: "Runs code if the condition is true" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "logic_if_else_simple" },
  { kind: "label", text: "Runs code if the condition is true; else run other code" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "logic_operation", fields: { OP: "AND" } },
  { kind: "label", text: "Runs code if both specified conditions are true" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "logic_operation", fields: { OP: "OR" } },
  { kind: "label", text: "Runs code if either of two specified conditions is true" }
] as const;

const pythonVariablesContents = [
  { kind: "block", type: "math_change" },
  { kind: "label", text: "Changes the value of item by 1" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "variables_set" },
  { kind: "label", text: "Assigns a value to a variable" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "variables_item_equals_number" },
  { kind: "label", text: "Declares a variable named 'item'" }
] as const;

const pythonMathContents = [
  { kind: "block", type: "math_arithmetic", fields: { OP: "ADD" } },
  { kind: "label", text: "Adds two numbers together" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_arithmetic", fields: { OP: "MINUS" } },
  { kind: "label", text: "Subtracts one number from another" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_arithmetic", fields: { OP: "MULTIPLY" } },
  { kind: "label", text: "Multiplies two numbers together" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_arithmetic", fields: { OP: "DIVIDE" } },
  { kind: "label", text: "Returns the quotient of one number divided by another" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_modulo" },
  { kind: "label", text: "Returns the remainder of one number divided by another" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_max2" },
  { kind: "label", text: "Returns the largest of two numbers" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_min2" },
  { kind: "label", text: "Returns the smallest of two numbers" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ABS" } },
  { kind: "label", text: "Returns the absolute value of a number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ROOT" } },
  { kind: "label", text: "Returns the square root of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "SIN" } },
  { kind: "label", text: "Returns the sine of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "COS" } },
  { kind: "label", text: "Returns the cosine of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "TAN" } },
  { kind: "label", text: "Returns the tangent of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ASIN" } },
  { kind: "label", text: "Returns the arcsine of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ACOS" } },
  { kind: "label", text: "Returns the arccosine of the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_atan2" },
  { kind: "label", text: "Returns the angle in radians from point (0,0) to point (x,y)." },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ROUND" } },
  { kind: "label", text: "Returns the integer closest to the number" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ROUNDUP" } },
  { kind: "label", text: "Returns the integer closest to the number, but always rounds positive" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_single", fields: { OP: "ROUNDDOWN" } },
  { kind: "label", text: "Returns the integer closest to the number, but always rounds negative" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_trunc" },
  { kind: "label", text: "Removes the decimal component of a number and returns an integer" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_random_bool" },
  { kind: "label", text: "Generates a random true or false value" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_random_int" },
  { kind: "label", text: "Returns a random number between min and max" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_constrain" },
  { kind: "label", text: "Constrains a number to be within a range" },
  { kind: "sep", gap: "8" },
  { kind: "block", type: "math_map_value" },
  { kind: "label", text: "Re-maps a number from one range to another." }
] as const;

const pythonAdvancedContents = [
  {
    kind: "category",
    name: "Functions",
    colour: "#3b82f6",
    contents: [
      { kind: "block", type: "procedures_callnoreturn", extraState: { name: "do_something", params: [] } },
      { kind: "label", text: "Call a function" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "procedures_defnoreturn", fields: { NAME: "do_something" } },
      { kind: "label", text: "Define a function" }
    ]
  },
  {
    kind: "category",
    name: "Arrays",
    colour: "#f97316",
    contents: [
      { kind: "block", type: "lists_create_with" },
      { kind: "label", text: "Creates a new Array" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "lists_length" },
      { kind: "label", text: "Returns the number of values in an Array" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "lists_getIndex", fields: { MODE: "GET", WHERE: "FROM_START" } },
      { kind: "label", text: "Returns the value in the Array at the given index" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "lists_setIndex", fields: { MODE: "SET", WHERE: "FROM_START" } },
      { kind: "label", text: "Overwrites the value in an Array at the given index" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "lists_setIndex", fields: { MODE: "INSERT", WHERE: "LAST" } },
      { kind: "label", text: "Adds a value to the end of an Array" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "lists_getIndex", fields: { MODE: "GET_REMOVE", WHERE: "LAST" } },
      { kind: "label", text: "Removes and returns the value at the end of an Array" }
    ]
  },
  {
    kind: "category",
    name: "Text",
    colour: "#ca8a04",
    contents: [
      { kind: "block", type: "text_charAt" },
      { kind: "label", text: "Returns the character at the given index" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "text_substring_length" },
      { kind: "label", text: "Returns the part of a string starting at a given index with the given length" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "text_parse_to_number" },
      { kind: "label", text: "Converts a number written as text into a number" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "text_compare_to" },
      { kind: "label", text: "Compares one string against another alphabetically and returns a number" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "text_join" },
      { kind: "label", text: "Combines values into one string" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "text_length" },
      { kind: "label", text: "Returns the number of characters in a string" }
    ]
  },
  {
    kind: "category",
    name: "Game",
    colour: "#059669",
    contents: [
      { kind: "block", type: "game_create_sprite" },
      { kind: "label", text: "Creates a new LED sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_delete_sprite" },
      { kind: "label", text: "Deletes the sprite from the game engine." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_is_deleted" },
      { kind: "label", text: "Reports whether the sprite has been deleted" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_move_by" },
      { kind: "label", text: "Move a certain number of LEDs in current direction" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_turn_by" },
      { kind: "label", text: "Turn the sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_change_x_by" },
      { kind: "label", text: "Changes a property of the sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_set_x_to" },
      { kind: "label", text: "Sets a property of the sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_x" },
      { kind: "label", text: "Gets a property of the sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_is_touching" },
      { kind: "label", text: "Reports true if sprite has same position as specified sprite" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_is_touching_edge" },
      { kind: "label", text: "Reports true if sprite is touching an edge" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_sprite_if_on_edge_bounce" },
      { kind: "label", text: "If touching edge, bounce" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "game_remove_life" },
      { kind: "block", type: "game_add_life" },
      { kind: "block", type: "game_set_life" },
      { kind: "block", type: "game_set_score" },
      { kind: "block", type: "game_change_score_by" },
      { kind: "block", type: "game_start_countdown" },
      { kind: "block", type: "game_score" },
      { kind: "block", type: "game_over" },
      { kind: "block", type: "game_is_over" },
      { kind: "block", type: "game_is_paused" },
      { kind: "block", type: "game_is_running" }
    ]
  },
  {
    kind: "category",
    name: "more",
    colour: "#059669",
    contents: [
      { kind: "block", type: "game_resume" },
      { kind: "block", type: "game_pause" }
    ]
  },
  {
    kind: "category",
    name: "Images",
    colour: "#7e22ce",
    contents: [
      { kind: "block", type: "images_show_image_offset" },
      { kind: "label", text: "Shows an image at a given offset on the LED display." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_scroll_image" },
      { kind: "label", text: "Scrolls an image with offset and interval." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_create_image" },
      { kind: "label", text: "Creates a 5x5 image from LED pattern." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_create_big_image" },
      { kind: "label", text: "Creates a 5x10 image for scrolling." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_direction" },
      { kind: "label", text: "Direction value used by image APIs." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_icon_image" },
      { kind: "label", text: "Creates a built-in icon image." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "images_arrow_image" },
      { kind: "label", text: "Creates a built-in arrow image." }
    ]
  },
  {
    kind: "category",
    name: "Pins",
    colour: "#b91c1c",
    contents: [
      { kind: "block", type: "pins_set_audio_pin_enabled" },
      { kind: "label", text: "Sets whether or not audio will be output using a pin" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "pins_digital_read_pin" },
      { kind: "block", type: "pins_digital_write_pin" },
      { kind: "block", type: "pins_analog_read_pin" },
      { kind: "block", type: "pins_analog_write_pin" },
      { kind: "block", type: "pins_map" },
      { kind: "block", type: "pins_analog_set_period_pin" },
      { kind: "block", type: "pins_set_audio_pin" },
      { kind: "label", text: "Servo" },
      { kind: "block", type: "pins_servo_write_pin" },
      { kind: "block", type: "pins_servo_set_pulse" }
    ]
  },
  {
    kind: "category",
    name: "more",
    colour: "#b91c1c",
    contents: [
      { kind: "block", type: "pins_set_audio_pin_enabled" }
    ]
  },
  {
    kind: "category",
    name: "Serial",
    colour: "#1d4ed8",
    contents: [
      { kind: "block", type: "serial_write_line" },
      { kind: "label", text: "Print a line of text to the serial port" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "serial_write_number" },
      { kind: "label", text: "Print a numeric value to the serial port" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "serial_write_value_pair" },
      { kind: "label", text: "Write a name-value pair as a line to the serial port" },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "serial_write_string" },
      { kind: "block", type: "serial_write_numbers" },
      { kind: "block", type: "serial_read_line" },
      { kind: "block", type: "serial_read_until" },
      { kind: "block", type: "serial_on_data_received" },
      { kind: "block", type: "serial_read_string" },
      { kind: "block", type: "serial_redirect_to" },
      { kind: "block", type: "serial_redirect_to_usb" }
    ]
  },
  {
    kind: "category",
    name: "more",
    colour: "#1d4ed8",
    contents: [
      { kind: "block", type: "serial_set_tx_buffer_size" },
      { kind: "block", type: "serial_set_rx_buffer_size" },
      { kind: "block", type: "serial_write_buffer" },
      { kind: "block", type: "serial_read_buffer" },
      { kind: "block", type: "serial_set_write_line_padding" },
      { kind: "label", text: "Configuration" },
      { kind: "block", type: "serial_set_baud_rate" }
    ]
  },
  {
    kind: "category",
    name: "Control",
    colour: "#374151",
    contents: [
      { kind: "block", type: "control_wait_for_event" },
      { kind: "label", text: "Blocks the calling thread until event is raised." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "control_run_in_background" },
      { kind: "label", text: "Schedules code that run in background." },
      { kind: "sep", gap: "8" },
      { kind: "block", type: "control_millis" },
      { kind: "block", type: "control_reset" },
      { kind: "block", type: "control_wait_micros" },
      { kind: "block", type: "control_raise_event" },
      { kind: "block", type: "control_on_event" },
      { kind: "block", type: "control_event_timestamp" },
      { kind: "block", type: "control_event_value" }
    ]
  }
] as const;

const pythonToolbox = {
  ...toolbox,
  contents: toolbox.contents.reduce<(typeof toolbox.contents)[number][]>((acc, entry) => {
    if (entry.kind === "category" && (entry.name === "Text" || entry.name === "Functions")) {
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Basic") {
      acc.push({
        ...entry,
        contents: pythonBasicContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Input") {
      acc.push({
        ...entry,
        contents: pythonInputContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Music") {
      acc.push({
        ...entry,
        contents: pythonMusicContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "LED") {
      acc.push({
        ...entry,
        contents: pythonLedContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Radio") {
      acc.push({
        ...entry,
        contents: pythonRadioContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Loops") {
      acc.push({
        ...entry,
        contents: pythonLoopsContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Logic") {
      acc.push({
        ...entry,
        contents: pythonLogicContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Variables") {
      acc.push({
        ...entry,
        contents: pythonVariablesContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Math") {
      acc.push({
        ...entry,
        contents: pythonMathContents
      });
      return acc;
    }
    if (entry.kind === "category" && entry.name === "Advanced") {
      acc.push({
        ...entry,
        contents: pythonAdvancedContents
      });
      return acc;
    }
    acc.push(entry);
    return acc;
  }, [])
};

let pxtLikeBlocksRegistered = false;

function registerPxtLikeBlocks() {
  if (pxtLikeBlocksRegistered) return;
  pxtLikeBlocksRegistered = true;

  if (!Blockly.Msg.CONTROLS_REPEAT_TITLE || !Blockly.Msg.CONTROLS_REPEAT_TITLE.includes("%1")) {
    Blockly.Msg.CONTROLS_REPEAT_TITLE = "repeat %1";
  }

  Blockly.common.defineBlocksWithJsonArray([
    {
      type: "on_start",
      message0: "on start %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      colour: 210,
      tooltip: "Runs once when program starts",
      helpUrl: ""
    },
    {
      type: "basic_forever",
      message0: "forever %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      colour: 210,
      tooltip: "Runs repeatedly forever",
      helpUrl: ""
    },
    {
      type: "device_on_start",
      message0: "on start %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      colour: 120,
      tooltip: "Runs once when program starts",
      helpUrl: ""
    },
    {
      type: "device_forever",
      message0: "forever %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      colour: 120,
      tooltip: "Runs repeatedly forever",
      helpUrl: ""
    },
    {
      type: "device_pause",
      message0: "pause (ms) %1",
      args0: [{ type: "input_value", name: "time", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 230,
      tooltip: "Pause for some milliseconds",
      helpUrl: ""
    },
    {
      type: "basic_pause",
      message0: "pause (ms) %1",
      args0: [{ type: "input_value", name: "TIME", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Pause for some milliseconds",
      helpUrl: ""
    },
    {
      type: "device_show_number",
      message0: "show number %1",
      args0: [{ type: "input_value", name: "NUM", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Show number on LED display",
      helpUrl: ""
    },
    {
      type: "device_show_string",
      message0: "show string %1",
      args0: [{ type: "input_value", name: "TEXT", check: "String" }],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Scroll text on LED display",
      helpUrl: ""
    },
    {
      type: "device_show_icon",
      message0: "show icon %1",
      args0: [
        {
          type: "field_dropdown",
          name: "ICON",
          options: [
            ["heart", "Heart"],
            ["small heart", "SmallHeart"],
            ["happy", "Happy"],
            ["sad", "Sad"],
            ["confused", "Confused"],
            ["yes", "Yes"],
            ["no", "No"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Show a built-in icon on LED display",
      helpUrl: ""
    },
    {
      type: "device_show_arrow",
      message0: "show arrow %1",
      args0: [
        {
          type: "field_dropdown",
          name: "ARROW",
          options: [
            ["north", "North"],
            ["north east", "NorthEast"],
            ["east", "East"],
            ["south east", "SouthEast"],
            ["south", "South"],
            ["south west", "SouthWest"],
            ["west", "West"],
            ["north west", "NorthWest"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Show an arrow on LED display",
      helpUrl: ""
    },
    {
      type: "device_show_leds",
      message0: "show leds %1",
      args0: [
        {
          type: "field_multilinetext",
          name: "MATRIX",
          text: "# # # # #\n# . . . #\n# . # . #\n# . . . #\n# # # # #"
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Show custom LED pattern",
      helpUrl: ""
    },
    {
      type: "device_clear_screen",
      message0: "clear screen",
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: "Clear LED display",
      helpUrl: ""
    },
    {
      type: "input_on_button_pressed",
      message0: "on button %1 pressed %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "BTN",
          options: [["A", "A"], ["B", "B"], ["A+B", "AB"]]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: "Run when button is pressed",
      helpUrl: ""
    },
    {
      type: "input_on_gesture",
      message0: "on gesture %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "GESTURE",
          options: [
            ["shake", "SHAKE"],
            ["logo up", "LOGO_UP"],
            ["logo down", "LOGO_DOWN"],
            ["free fall", "FREE_FALL"]
          ]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: "Run when gesture is detected",
      helpUrl: ""
    },
    {
      type: "input_button_is_pressed",
      message0: "button %1 is pressed",
      args0: [
        {
          type: "field_dropdown",
          name: "BTN",
          options: [["A", "A"], ["B", "B"], ["A+B", "AB"]]
        }
      ],
      output: "Boolean",
      colour: 290,
      tooltip: "Checks if button is currently pressed",
      helpUrl: ""
    },
    {
      type: "input_on_pin_pressed",
      message0: "run code on pin %1 pressed %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "PIN",
          options: [["TouchPin.P0", "P0"], ["TouchPin.P1", "P1"], ["TouchPin.P2", "P2"]]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: "Run when touch pin is pressed and released",
      helpUrl: ""
    },
    {
      type: "input_acceleration",
      message0: "acceleration (mg) %1",
      args0: [
        {
          type: "field_dropdown",
          name: "DIM",
          options: [["Dimension.X", "X"], ["Dimension.Y", "Y"], ["Dimension.Z", "Z"], ["strength", "Strength"]]
        }
      ],
      output: "Number",
      colour: 290,
      tooltip: "Get acceleration in milli-g",
      helpUrl: ""
    },
    {
      type: "input_pin_is_pressed",
      message0: "pin %1 is pressed",
      args0: [
        {
          type: "field_dropdown",
          name: "PIN",
          options: [["TouchPin.P0", "P0"], ["TouchPin.P1", "P1"], ["TouchPin.P2", "P2"]]
        }
      ],
      output: "Boolean",
      colour: 290,
      tooltip: "Check if touch pin is pressed",
      helpUrl: ""
    },
    {
      type: "input_light_level",
      message0: "light level",
      output: "Number",
      colour: 290,
      tooltip: "Get ambient light level (0-255)",
      helpUrl: ""
    },
    {
      type: "input_compass_heading",
      message0: "compass heading (°)",
      output: "Number",
      colour: 290,
      tooltip: "Get compass heading in degrees",
      helpUrl: ""
    },
    {
      type: "input_temperature",
      message0: "temperature (°C)",
      output: "Number",
      colour: 290,
      tooltip: "Get temperature in celsius",
      helpUrl: ""
    },
    {
      type: "input_is_gesture",
      message0: "is %1 gesture",
      args0: [
        {
          type: "field_dropdown",
          name: "GESTURE",
          options: [
            ["Gesture.SHAKE", "SHAKE"],
            ["Gesture.LOGO_UP", "LOGO_UP"],
            ["Gesture.LOGO_DOWN", "LOGO_DOWN"],
            ["Gesture.FREE_FALL", "FREE_FALL"]
          ]
        }
      ],
      output: "Boolean",
      colour: 290,
      tooltip: "Tests if a gesture is currently detected",
      helpUrl: ""
    },
    {
      type: "input_on_sound",
      message0: "run code on sound %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "SOUND",
          options: [["sound", "Loud"], ["quiet", "Quiet"]]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: "Run when a sound is detected (micro:bit V2)",
      helpUrl: ""
    },
    {
      type: "input_on_logo_event",
      message0: "run code on logo %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "ACTION",
          options: [["action", "Pressed"], ["released", "Released"], ["long pressed", "LongPressed"]]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
      tooltip: "Run when logo touch event happens (micro:bit V2)",
      helpUrl: ""
    },
    {
      type: "input_logo_is_pressed",
      message0: "logo is pressed",
      output: "Boolean",
      colour: 290,
      tooltip: "Checks if logo is currently pressed",
      helpUrl: ""
    },
    {
      type: "input_sound_level",
      message0: "sound level",
      output: "Number",
      colour: 290,
      tooltip: "Microphone sound level (0-255)",
      helpUrl: ""
    },
    {
      type: "music_play_melody",
      message0: "play melody %1 at tempo %2 (bpm) %3",
      args0: [
        {
          type: "field_dropdown",
          name: "MELODY",
          options: [
            ["dadadum", "DADADUM"],
            ["entertainer", "ENTERTAINER"],
            ["blues", "BLUES"],
            ["birthday", "BIRTHDAY"],
            ["wedding", "WEDDING"],
            ["funk", "FUNK"]
          ]
        },
        {
          type: "field_number",
          name: "TEMPO",
          value: 120,
          min: 40,
          max: 300,
          precision: 1
        },
        {
          type: "field_dropdown",
          name: "PLAYMODE",
          options: [
            ["until done", "UNTIL_DONE"],
            ["in background", "IN_BACKGROUND"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play built-in melody",
      helpUrl: ""
    },
    {
      type: "music_play_tone",
      message0: "play tone %1 Hz for %2 ms",
      args0: [
        { type: "input_value", name: "HZ", check: "Number" },
        { type: "input_value", name: "MS", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play tone",
      helpUrl: ""
    },
    {
      type: "music_play_tone_note_beats",
      message0: "play tone %1 for %2 beat %3",
      args0: [
        {
          type: "field_dropdown",
          name: "NOTE",
          options: [
            ["Middle C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["A", "A"],
            ["B", "B"]
          ]
        },
        {
          type: "field_number",
          name: "BEATS",
          value: 1,
          min: 0.25,
          max: 16,
          precision: 0.25
        },
        {
          type: "field_dropdown",
          name: "PLAYMODE",
          options: [
            ["until done", "UNTIL_DONE"],
            ["in background", "IN_BACKGROUND"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play note for beats",
      helpUrl: ""
    },
    {
      type: "music_ringtone_play",
      message0: "ring tone (Hz) %1",
      args0: [
        {
          type: "field_dropdown",
          name: "NOTE",
          options: [
            ["Middle C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["A", "A"],
            ["B", "B"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Ring tone continuously",
      helpUrl: ""
    },
    {
      type: "music_rest_beat",
      message0: "rest for %1 beat",
      args0: [
        {
          type: "field_number",
          name: "BEATS",
          value: 1,
          min: 0.25,
          max: 16,
          precision: 0.25
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Rest for beat duration",
      helpUrl: ""
    },
    {
      type: "music_note_value",
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "NOTE",
          options: [
            ["Middle C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            ["G", "G"],
            ["A", "A"],
            ["B", "B"]
          ]
        }
      ],
      output: "Number",
      colour: 20,
      tooltip: "Note value reporter",
      helpUrl: ""
    },
    {
      type: "music_set_volume",
      message0: "set volume %1",
      args0: [
        {
          type: "field_number",
          name: "VOL",
          value: 127,
          min: 0,
          max: 255,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Set volume",
      helpUrl: ""
    },
    {
      type: "music_get_volume",
      message0: "volume",
      output: "Number",
      colour: 20,
      tooltip: "Current volume",
      helpUrl: ""
    },
    {
      type: "music_stop_all_sounds",
      message0: "stop all sounds",
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Stop all music output",
      helpUrl: ""
    },
    {
      type: "music_change_tempo",
      message0: "change tempo by (bpm) %1",
      args0: [
        {
          type: "field_number",
          name: "DELTA",
          value: 20,
          min: -300,
          max: 300,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Change tempo",
      helpUrl: ""
    },
    {
      type: "music_set_tempo",
      message0: "set tempo to (bpm) %1",
      args0: [
        {
          type: "field_number",
          name: "TEMPO",
          value: 120,
          min: 40,
          max: 300,
          precision: 1
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Set tempo",
      helpUrl: ""
    },
    {
      type: "music_beat_value",
      message0: "%1 beat",
      args0: [
        {
          type: "field_number",
          name: "BEATS",
          value: 1,
          min: 0.25,
          max: 16,
          precision: 0.25
        }
      ],
      output: "Number",
      colour: 20,
      tooltip: "Beat duration value",
      helpUrl: ""
    },
    {
      type: "music_get_tempo",
      message0: "tempo (bpm)",
      output: "Number",
      colour: 20,
      tooltip: "Current tempo",
      helpUrl: ""
    },
    {
      type: "music_on_event",
      message0: "run code music on %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "EVENT",
          options: [
            ["value", "MelodyNotePlayed"],
            ["background melody ended", "BackgroundMelodyEnded"]
          ]
        },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Run code when selected music event occurs",
      helpUrl: ""
    },
    {
      type: "music_play_melody_advanced",
      message0: "play melody %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "MELODY",
          options: [
            ["dadadum", "DADADUM"],
            ["entertainer", "ENTERTAINER"],
            ["blues", "BLUES"],
            ["birthday", "BIRTHDAY"],
            ["wedding", "WEDDING"],
            ["funk", "FUNK"]
          ]
        },
        {
          type: "field_dropdown",
          name: "PLAYMODE",
          options: [
            ["in background", "IN_BACKGROUND"],
            ["until done", "UNTIL_DONE"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play melody advanced",
      helpUrl: ""
    },
    {
      type: "music_stop_melody",
      message0: "stop melody %1",
      args0: [
        {
          type: "field_dropdown",
          name: "STOPMODE",
          options: [
            ["all", "All"],
            ["foreground", "Foreground"],
            ["background", "Background"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Stop melody",
      helpUrl: ""
    },
    {
      type: "music_on_melody_note_played",
      message0: "music on melody note played %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Event when melody note plays",
      helpUrl: ""
    },
    {
      type: "music_play_giggle",
      message0: "play giggle %1",
      args0: [
        {
          type: "field_dropdown",
          name: "PLAYMODE",
          options: [
            ["until done", "UNTIL_DONE"],
            ["in background", "IN_BACKGROUND"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play built-in sound effect",
      helpUrl: ""
    },
    {
      type: "music_play_sound_effect",
      message0: "play soundExpression %1 %2",
      args0: [
        { type: "input_value", name: "EFFECT", check: "String" },
        {
          type: "field_dropdown",
          name: "PLAYMODE",
          options: [
            ["until done", "UNTIL_DONE"],
            ["in background", "IN_BACKGROUND"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Play custom sound effect",
      helpUrl: ""
    },
    {
      type: "music_create_sound_effect",
      message0: "sound effect %1",
      args0: [
        {
          type: "field_dropdown",
          name: "SHAPE",
          options: [
            ["sine", "Sine"],
            ["sawtooth", "Sawtooth"],
            ["triangle", "Triangle"],
            ["square", "Square"]
          ]
        }
      ],
      output: "String",
      colour: 20,
      tooltip: "Create sound effect value",
      helpUrl: ""
    },
    {
      type: "music_sound_is_playing",
      message0: "sound is playing",
      output: "Boolean",
      colour: 20,
      tooltip: "Returns whether sound is currently playing",
      helpUrl: ""
    },
    {
      type: "music_set_built_in_speaker_enabled",
      message0: "set built-in speaker %1",
      args0: [
        {
          type: "field_dropdown",
          name: "ENABLED",
          options: [
            ["enabled", "true"],
            ["disabled", "false"]
          ]
        }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 20,
      tooltip: "Enable or disable built-in speaker",
      helpUrl: ""
    },
    {
      type: "led_plot",
      message0: "plot x %1 y %2",
      args0: [
        { type: "input_value", name: "X", check: "Number" },
        { type: "input_value", name: "Y", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: "Turn on single LED",
      helpUrl: ""
    },
    {
      type: "led_unplot",
      message0: "unplot x %1 y %2",
      args0: [
        { type: "input_value", name: "X", check: "Number" },
        { type: "input_value", name: "Y", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: "Turn off single LED",
      helpUrl: ""
    },
    {
      type: "led_toggle",
      message0: "toggle x %1 y %2",
      args0: [
        { type: "input_value", name: "X", check: "Number" },
        { type: "input_value", name: "Y", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: "Toggle LED state",
      helpUrl: ""
    },
    {
      type: "led_point",
      message0: "point x %1 y %2",
      args0: [
        { type: "input_value", name: "X", check: "Number" },
        { type: "input_value", name: "Y", check: "Number" }
      ],
      output: "Boolean",
      colour: 260,
      tooltip: "Read LED state",
      helpUrl: ""
    },
    {
      type: "led_plot_bar_graph",
      message0: "plot bar graph of %1 up to %2",
      args0: [
        { type: "input_value", name: "VALUE", check: "Number" },
        { type: "input_value", name: "HIGH", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: "Displays a vertical bar graph",
      helpUrl: ""
    },
    {
      type: "radio_set_group",
      message0: "radio set group %1",
      args0: [{ type: "input_value", name: "GROUP", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Set radio group",
      helpUrl: ""
    },
    {
      type: "radio_send_number",
      message0: "radio send number %1",
      args0: [{ type: "input_value", name: "NUM", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Send a number on radio",
      helpUrl: ""
    },
    {
      type: "radio_send_string",
      message0: "radio send string %1",
      args0: [{ type: "input_value", name: "TEXT", check: "String" }],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Send text on radio",
      helpUrl: ""
    },
    {
      type: "radio_send_value",
      message0: "radio send value %1 = %2",
      args0: [
        { type: "input_value", name: "NAME", check: "String" },
        { type: "input_value", name: "VALUE", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Send a name and numeric value on radio",
      helpUrl: ""
    },
    {
      type: "radio_on_received_number",
      message0: "on radio received number %1 %2",
      args0: [
        { type: "field_variable", name: "VAR", variable: "receivedNumber" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Run when radio receives number",
      helpUrl: ""
    },
    {
      type: "radio_on_received_string",
      message0: "on radio received string %1 %2",
      args0: [
        { type: "field_variable", name: "VAR", variable: "receivedText" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Run when radio receives text",
      helpUrl: ""
    },
    {
      type: "radio_on_received_value",
      message0: "on radio received %1 %2 %3",
      args0: [
        { type: "field_variable", name: "NAME", variable: "name" },
        { type: "field_variable", name: "VALUE", variable: "value" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 340,
      tooltip: "Run when radio receives a name and value",
      helpUrl: ""
    },
    {
      type: "radio_received_packet",
      message0: "received packet %1",
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [["type", "TYPE"], ["strength", "SIGNAL"], ["time", "TIME"], ["serial", "SERIAL"]]
        }
      ],
      output: "Number",
      colour: 340,
      tooltip: "Properties of last received packet",
      helpUrl: ""
    },
    {
      type: "loops_every_interval",
      message0: "run code every %1 ms %2 %3",
      args0: [
        { type: "input_value", name: "TIME", check: "Number" },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 120,
      tooltip: "Run code at fixed interval in milliseconds",
      helpUrl: ""
    },
    {
      type: "logic_if_simple",
      message0: "if %1 %2 %3",
      args0: [
        { type: "input_value", name: "COND", check: "Boolean" },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 200,
      tooltip: "If condition is true, run enclosed code",
      helpUrl: ""
    },
    {
      type: "logic_if_else_simple",
      message0: "if %1 %2 %3 else %4 %5",
      args0: [
        { type: "input_value", name: "COND", check: "Boolean" },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
        { type: "input_dummy" },
        { type: "input_statement", name: "ELSE" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 200,
      tooltip: "If/else control block",
      helpUrl: ""
    },
    {
      type: "variables_item_equals_number",
      message0: "item = %1",
      args0: [{ type: "input_value", name: "VALUE", check: "Number" }],
      previousStatement: null,
      nextStatement: null,
      colour: 350,
      tooltip: "Declare a variable named item",
      helpUrl: ""
    },
    {
      type: "math_max2",
      message0: "max %1 %2",
      args0: [
        { type: "input_value", name: "A", check: "Number" },
        { type: "input_value", name: "B", check: "Number" }
      ],
      output: "Number",
      colour: 230,
      tooltip: "Largest of two numbers",
      helpUrl: ""
    },
    {
      type: "math_min2",
      message0: "min %1 %2",
      args0: [
        { type: "input_value", name: "A", check: "Number" },
        { type: "input_value", name: "B", check: "Number" }
      ],
      output: "Number",
      colour: 230,
      tooltip: "Smallest of two numbers",
      helpUrl: ""
    },
    {
      type: "math_trunc",
      message0: "trunc %1",
      args0: [{ type: "input_value", name: "NUM", check: "Number" }],
      output: "Number",
      colour: 230,
      tooltip: "Truncate decimal part of number",
      helpUrl: ""
    },
    {
      type: "math_random_bool",
      message0: "pick random true or false",
      output: "Boolean",
      colour: 230,
      tooltip: "Random boolean value",
      helpUrl: ""
    },
    {
      type: "math_map_value",
      message0: "map value %1 from low %2 high %3 to low %4 high %5",
      args0: [
        { type: "input_value", name: "VALUE", check: "Number" },
        { type: "input_value", name: "FROM_LOW", check: "Number" },
        { type: "input_value", name: "FROM_HIGH", check: "Number" },
        { type: "input_value", name: "TO_LOW", check: "Number" },
        { type: "input_value", name: "TO_HIGH", check: "Number" }
      ],
      output: "Number",
      colour: 230,
      tooltip: "Map a number from one range to another",
      helpUrl: ""
    },
    {
      type: "text_parse_to_number",
      message0: "parse to number %1",
      args0: [{ type: "input_value", name: "TEXT", check: "String" }],
      output: "Number",
      colour: 160,
      tooltip: "Convert text to number",
      helpUrl: ""
    },
    {
      type: "text_split_with",
      message0: "split %1 at %2",
      args0: [
        { type: "input_value", name: "TEXT", check: "String" },
        { type: "input_value", name: "SEP", check: "String" }
      ],
      output: "Array",
      colour: 160,
      tooltip: "Split text into array by separator",
      helpUrl: ""
    },
    {
      type: "text_includes",
      message0: "%1 includes %2",
      args0: [
        { type: "input_value", name: "TEXT", check: "String" },
        { type: "input_value", name: "FIND", check: "String" }
      ],
      output: "Boolean",
      colour: 160,
      tooltip: "True if text includes another text",
      helpUrl: ""
    },
    {
      type: "text_substring_length",
      message0: "substring of %1 from %2 of length %3",
      args0: [
        { type: "input_value", name: "TEXT", check: "String" },
        { type: "input_value", name: "FROM", check: "Number" },
        { type: "input_value", name: "LEN", check: "Number" }
      ],
      output: "String",
      colour: 160,
      tooltip: "Get substring by start and length",
      helpUrl: ""
    },
    {
      type: "text_compare_to",
      message0: "compare %1 to %2",
      args0: [
        { type: "input_value", name: "A", check: "String" },
        { type: "input_value", name: "B", check: "String" }
      ],
      output: "Number",
      colour: 160,
      tooltip: "Compare two strings",
      helpUrl: ""
    },
    {
      type: "text_char_code_at",
      message0: "char code from %1 at %2",
      args0: [
        { type: "input_value", name: "TEXT", check: "String" },
        { type: "input_value", name: "INDEX", check: "Number" }
      ],
      output: "Number",
      colour: 160,
      tooltip: "Character code at index",
      helpUrl: ""
    },
    {
      type: "text_convert_number_to_text",
      message0: "convert %1 to text",
      args0: [{ type: "input_value", name: "NUM", check: "Number" }],
      output: "String",
      colour: 160,
      tooltip: "Convert number to string",
      helpUrl: ""
    },
    {
      type: "text_from_char_code",
      message0: "text from char code %1",
      args0: [{ type: "input_value", name: "CODE", check: "Number" }],
      output: "String",
      colour: 160,
      tooltip: "Convert character code to text",
      helpUrl: ""
    },
    {
      type: "game_create_sprite",
      message0: "create %1 at x %2 y %3",
      args0: [
        { type: "field_variable", name: "VAR", variable: "sprite" },
        { type: "input_value", name: "X", check: "Number" },
        { type: "input_value", name: "Y", check: "Number" }
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160
    },
    {
      type: "game_delete_sprite",
      message0: "delete %1",
      args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }],
      previousStatement: null,
      nextStatement: null,
      colour: 160
    },
    { type: "game_sprite_is_deleted", message0: "is %1 deleted", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }], output: "Boolean", colour: 160 },
    { type: "game_sprite_move_by", message0: "%1 move by %2", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }, { type: "input_value", name: "BY", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_sprite_turn_by", message0: "%1 turn %2 by (°) %3", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }, { type: "field_dropdown", name: "DIR", options: [["right", "Right"], ["left", "Left"]] }, { type: "input_value", name: "DEG", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_sprite_change_x_by", message0: "%1 change x by %2", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }, { type: "input_value", name: "BY", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_sprite_set_x_to", message0: "%1 set x to %2", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }, { type: "input_value", name: "X", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_sprite_x", message0: "%1 x", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }], output: "Number", colour: 160 },
    { type: "game_sprite_is_touching", message0: "is %1 touching %2", args0: [{ type: "field_variable", name: "A", variable: "sprite" }, { type: "field_variable", name: "B", variable: "otherSprite" }], output: "Boolean", colour: 160 },
    { type: "game_sprite_is_touching_edge", message0: "is %1 touching edge", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }], output: "Boolean", colour: 160 },
    { type: "game_sprite_if_on_edge_bounce", message0: "%1 if on edge, bounce", args0: [{ type: "field_variable", name: "SPRITE", variable: "sprite" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_remove_life", message0: "remove life %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_add_life", message0: "add life %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_set_life", message0: "set life %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_set_score", message0: "set score %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_change_score_by", message0: "change score by %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_start_countdown", message0: "start countdown (ms) %1", args0: [{ type: "input_value", name: "MS", check: "Number" }], previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_score", message0: "score", output: "Number", colour: 160 },
    { type: "game_over", message0: "game over", previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_is_over", message0: "is game over", output: "Boolean", colour: 160 },
    { type: "game_is_paused", message0: "is paused", output: "Boolean", colour: 160 },
    { type: "game_is_running", message0: "is running", output: "Boolean", colour: 160 },
    { type: "game_resume", message0: "resume", previousStatement: null, nextStatement: null, colour: 160 },
    { type: "game_pause", message0: "pause", previousStatement: null, nextStatement: null, colour: 160 },
    { type: "images_show_image_offset", message0: "show image %1 at offset %2", args0: [{ type: "input_value", name: "IMG" }, { type: "input_value", name: "OFFSET", check: "Number" }], previousStatement: null, nextStatement: null, colour: 280 },
    { type: "images_scroll_image", message0: "scroll image %1 with offset %2 and interval (ms) %3", args0: [{ type: "input_value", name: "IMG" }, { type: "input_value", name: "OFFSET", check: "Number" }, { type: "input_value", name: "INTERVAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 280 },
    { type: "images_create_image", message0: "create image %1", args0: [{ type: "field_multilinetext", name: "MATRIX", text: "# # # # #\n# . . . #\n# . # . #\n# . . . #\n# # # # #" }], output: "String", colour: 280 },
    { type: "images_create_big_image", message0: "create big image %1", args0: [{ type: "field_multilinetext", name: "MATRIX", text: "# # # # # # # # # #\n# . . . # # . . . #\n# . # . # # . # . #\n# . . . # # . . . #\n# # # # # # # # # #" }], output: "String", colour: 280 },
    { type: "images_direction", message0: "%1", args0: [{ type: "field_dropdown", name: "DIR", options: [["North", "North"], ["East", "East"], ["South", "South"], ["West", "West"]] }], output: "String", colour: 280 },
    { type: "images_icon_image", message0: "icon image %1", args0: [{ type: "field_dropdown", name: "ICON", options: [["heart", "Heart"], ["small heart", "SmallHeart"], ["yes", "Yes"], ["no", "No"]] }], output: "String", colour: 280 },
    { type: "images_arrow_image", message0: "arrow image %1", args0: [{ type: "field_dropdown", name: "ARROW", options: [["North", "North"], ["East", "East"], ["South", "South"], ["West", "West"]] }], output: "String", colour: 280 },
    { type: "pins_digital_read_pin", message0: "digital read pin %1", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }], output: "Number", colour: 0 },
    { type: "pins_digital_write_pin", message0: "digital write pin %1 to %2", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "input_value", name: "VAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_analog_read_pin", message0: "analog read pin %1", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }], output: "Number", colour: 0 },
    { type: "pins_analog_write_pin", message0: "analog write pin %1 to %2", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "input_value", name: "VAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_map", message0: "map %1 from low %2 from high %3 to low %4 to high %5", args0: [{ type: "input_value", name: "VALUE", check: "Number" }, { type: "input_value", name: "FROM_LOW", check: "Number" }, { type: "input_value", name: "FROM_HIGH", check: "Number" }, { type: "input_value", name: "TO_LOW", check: "Number" }, { type: "input_value", name: "TO_HIGH", check: "Number" }], output: "Number", colour: 0 },
    { type: "pins_analog_set_period_pin", message0: "analog set period pin %1 to (us) %2", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "input_value", name: "US", check: "Number" }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_set_audio_pin", message0: "set audio pin %1", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_set_audio_pin_enabled", message0: "set audio pin enabled %1", args0: [{ type: "field_dropdown", name: "EN", options: [["false", "false"], ["true", "true"]] }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_servo_write_pin", message0: "servo write pin %1 to %2", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "input_value", name: "VAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "pins_servo_set_pulse", message0: "servo set pulse pin %1 to (us) %2", args0: [{ type: "field_dropdown", name: "PIN", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "input_value", name: "US", check: "Number" }], previousStatement: null, nextStatement: null, colour: 0 },
    { type: "serial_write_line", message0: "serial write line %1", args0: [{ type: "input_value", name: "TEXT", check: "String" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_write_number", message0: "serial write number %1", args0: [{ type: "input_value", name: "NUM", check: "Number" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_write_value_pair", message0: "serial write value %1 = %2", args0: [{ type: "input_value", name: "NAME", check: "String" }, { type: "input_value", name: "VAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_write_string", message0: "serial write string %1", args0: [{ type: "input_value", name: "TEXT", check: "String" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_write_numbers", message0: "serial write numbers %1", args0: [{ type: "input_value", name: "ARR", check: "Array" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_read_line", message0: "serial read line", output: "String", colour: 220 },
    { type: "serial_read_until", message0: "serial read until %1", args0: [{ type: "field_dropdown", name: "DELIM", options: [["new line ( )", "\\n"], ["comma (,)", ","], ["space", " "]] }], output: "String", colour: 220 },
    { type: "serial_on_data_received", message0: "serial on data received %1 %2 %3", args0: [{ type: "field_dropdown", name: "DELIM", options: [["new line ( )", "\\n"], ["comma (,)", ","], ["space", " "]] }, { type: "input_dummy" }, { type: "input_statement", name: "DO" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_read_string", message0: "serial read string", output: "String", colour: 220 },
    { type: "serial_redirect_to", message0: "serial redirect to TX %1 RX %2 at baud rate %3", args0: [{ type: "field_dropdown", name: "TX", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "field_dropdown", name: "RX", options: [["P0", "P0"], ["P1", "P1"], ["P2", "P2"]] }, { type: "field_dropdown", name: "BAUD", options: [["115200", "115200"], ["9600", "9600"], ["57600", "57600"]] }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_redirect_to_usb", message0: "serial redirect to USB", previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_set_tx_buffer_size", message0: "serial set tx buffer size to %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_set_rx_buffer_size", message0: "serial set rx buffer size to %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_write_buffer", message0: "serial write buffer %1", args0: [{ type: "input_value", name: "BUF" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_read_buffer", message0: "serial read buffer %1", args0: [{ type: "input_value", name: "N", check: "Number" }], output: "Array", colour: 220 },
    { type: "serial_set_write_line_padding", message0: "serial set write line padding to %1", args0: [{ type: "input_value", name: "N", check: "Number" }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "serial_set_baud_rate", message0: "serial set baud rate %1", args0: [{ type: "field_dropdown", name: "BAUD", options: [["115200", "115200"], ["9600", "9600"], ["57600", "57600"]] }], previousStatement: null, nextStatement: null, colour: 220 },
    { type: "control_wait_for_event", message0: "wait for event from %1 with value %2", args0: [{ type: "input_value", name: "SRC", check: "Number" }, { type: "input_value", name: "VAL", check: "Number" }], previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_run_in_background", message0: "run in background %1 %2", args0: [{ type: "input_dummy" }, { type: "input_statement", name: "DO" }], previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_millis", message0: "millis (ms)", output: "Number", colour: 210 },
    { type: "control_reset", message0: "reset", previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_wait_micros", message0: "wait (us) %1", args0: [{ type: "input_value", name: "US", check: "Number" }], previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_raise_event", message0: "raise event from source %1 with value %2", args0: [{ type: "field_dropdown", name: "SRC", options: [["MICROBIT_ID_BUTTON_A", "MICROBIT_ID_BUTTON_A"], ["MICROBIT_ID_BUTTON_B", "MICROBIT_ID_BUTTON_B"]] }, { type: "field_dropdown", name: "VAL", options: [["MICROBIT_EVT_ANY", "MICROBIT_EVT_ANY"], ["MICROBIT_BUTTON_EVT_CLICK", "MICROBIT_BUTTON_EVT_CLICK"]] }], previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_on_event", message0: "on event from %1 with value %2 %3 %4", args0: [{ type: "field_dropdown", name: "SRC", options: [["MICROBIT_ID_BUTTON_A", "MICROBIT_ID_BUTTON_A"], ["MICROBIT_ID_BUTTON_B", "MICROBIT_ID_BUTTON_B"]] }, { type: "field_dropdown", name: "VAL", options: [["MICROBIT_EVT_ANY", "MICROBIT_EVT_ANY"], ["MICROBIT_BUTTON_EVT_CLICK", "MICROBIT_BUTTON_EVT_CLICK"]] }, { type: "input_dummy" }, { type: "input_statement", name: "DO" }], previousStatement: null, nextStatement: null, colour: 210 },
    { type: "control_event_timestamp", message0: "event timestamp", output: "Number", colour: 210 },
    { type: "control_event_value", message0: "event value", output: "Number", colour: 210 }
  ]);

  const asAny = javascriptGenerator as any;
  asAny.forBlock["on_start"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const body = generator.statementToCode(block, "DO");
    return `// on start\n${body}`;
  };

  asAny.forBlock["device_on_start"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const body = generator.statementToCode(block, "DO");
    return `\n${body}\n`;
  };

  asAny.forBlock["basic_forever"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const body = generator.statementToCode(block, "DO");
    return `basic.forever(function () {\n${body}});\n`;
  };

  asAny.forBlock["device_forever"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const body = generator.statementToCode(block, "DO");
    return `basic.forever(function () {\n${body}});\n`;
  };

  asAny.forBlock["basic_pause"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const time = generator.valueToCode(block, "TIME", Order.NONE) || "100";
    return `basic.pause(${time});\n`;
  };

  asAny.forBlock["device_pause"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const time = generator.valueToCode(block, "time", Order.NONE) || "100";
    return `basic.pause(${time});\n`;
  };

  asAny.forBlock["device_show_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const num = generator.valueToCode(block, "NUM", Order.NONE) || "0";
    return `basic.showNumber(${num});\n`;
  };

  asAny.forBlock["device_show_string"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    return `basic.showString(${text});\n`;
  };

  asAny.forBlock["device_show_icon"] = (block: Blockly.Block) => {
    const icon = block.getFieldValue("ICON") || "Heart";
    return `basic.showIcon(IconNames.${icon});\n`;
  };

  asAny.forBlock["device_show_arrow"] = (block: Blockly.Block) => {
    const arrow = block.getFieldValue("ARROW") || "North";
    return `basic.showArrow(ArrowNames.${arrow});\n`;
  };

  asAny.forBlock["device_show_leds"] = (block: Blockly.Block) => {
    const matrix = String(block.getFieldValue("MATRIX") || "");
    const lines = matrix
      .split("\n")
      .map((row) => row.replace(/\./g, "0").replace(/#/g, "1").replace(/\s+/g, ""));
    const normalized = [...lines, "00000", "00000", "00000", "00000", "00000"].slice(0, 5);
    return `basic.showLeds(\`\n${normalized.join("\n")}\n\`);\n`;
  };

  asAny.forBlock["device_clear_screen"] = () => "basic.clearScreen();\n";

  asAny.forBlock["input_on_button_pressed"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const btn = block.getFieldValue("BTN") || "A";
    const body = generator.statementToCode(block, "DO");
    return `input.onButtonPressed(Button.${btn}, function () {\n${body}});\n`;
  };

  asAny.forBlock["input_on_gesture"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const gesture = block.getFieldValue("GESTURE") || "SHAKE";
    const body = generator.statementToCode(block, "DO");
    return `input.onGesture(Gesture.${gesture}, function () {\n${body}});\n`;
  };

  asAny.forBlock["input_button_is_pressed"] = (block: Blockly.Block) => {
    const btn = block.getFieldValue("BTN") || "A";
    return [`input.buttonIsPressed(Button.${btn})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["input_on_pin_pressed"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const pin = block.getFieldValue("PIN") || "P0";
    const body = generator.statementToCode(block, "DO");
    return `input.onPinPressed(TouchPin.${pin}, function () {\n${body}});\n`;
  };

  asAny.forBlock["input_acceleration"] = (block: Blockly.Block) => {
    const dim = block.getFieldValue("DIM") || "X";
    return [`input.acceleration(Dimension.${dim})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["input_pin_is_pressed"] = (block: Blockly.Block) => {
    const pin = block.getFieldValue("PIN") || "P0";
    return [`input.pinIsPressed(TouchPin.${pin})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["input_light_level"] = () => ["input.lightLevel()", Order.FUNCTION_CALL];

  asAny.forBlock["input_compass_heading"] = () => ["input.compassHeading()", Order.FUNCTION_CALL];

  asAny.forBlock["input_temperature"] = () => ["input.temperature()", Order.FUNCTION_CALL];

  asAny.forBlock["input_is_gesture"] = (block: Blockly.Block) => {
    const gesture = block.getFieldValue("GESTURE") || "SHAKE";
    return [`input.isGesture(Gesture.${gesture})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["input_on_sound"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const sound = block.getFieldValue("SOUND") || "Loud";
    const body = generator.statementToCode(block, "DO");
    return `input.onSound(DetectedSound.${sound}, function () {\n${body}});\n`;
  };

  asAny.forBlock["input_on_logo_event"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const action = block.getFieldValue("ACTION") || "Pressed";
    const body = generator.statementToCode(block, "DO");
    return `input.onLogoEvent(TouchButtonEvent.${action}, function () {\n${body}});\n`;
  };

  asAny.forBlock["input_logo_is_pressed"] = () => ["input.logoIsPressed()", Order.FUNCTION_CALL];

  asAny.forBlock["input_sound_level"] = () => ["input.soundLevel()", Order.FUNCTION_CALL];

  asAny.forBlock["music_play_melody"] = (block: Blockly.Block) => {
    const melody = block.getFieldValue("MELODY") || "DADADUM";
    const tempo = block.getFieldValue("TEMPO") || "120";
    const playMode = block.getFieldValue("PLAYMODE") || "UNTIL_DONE";
    const melodyOption = playMode === "UNTIL_DONE" ? "MelodyOptions.Once" : "MelodyOptions.OnceInBackground";
    return `music.setTempo(${tempo});\nmusic.startMelody(music.builtInMelody(Melodies.${melody}), ${melodyOption});\n`;
  };

  asAny.forBlock["music_play_tone"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const hz = generator.valueToCode(block, "HZ", Order.NONE) || "262";
    const ms = generator.valueToCode(block, "MS", Order.NONE) || "500";
    return `music.playTone(${hz}, ${ms});\n`;
  };

  asAny.forBlock["music_play_tone_note_beats"] = (block: Blockly.Block) => {
    const note = block.getFieldValue("NOTE") || "C";
    const beats = block.getFieldValue("BEATS") || "1";
    const playMode = block.getFieldValue("PLAYMODE") || "UNTIL_DONE";
    const melodyOption = playMode === "UNTIL_DONE" ? "MelodyOptions.Once" : "MelodyOptions.OnceInBackground";
    return `music.startMelody([music.noteFrequency(Note.${note})], ${melodyOption});\nmusic.rest(music.beat(BeatFraction.Whole) * ${beats});\n`;
  };

  asAny.forBlock["music_ringtone_play"] = (block: Blockly.Block) => {
    const note = block.getFieldValue("NOTE") || "C";
    return `music.ringTone(music.noteFrequency(Note.${note}));\n`;
  };

  asAny.forBlock["music_rest_beat"] = (block: Blockly.Block) => {
    const beats = block.getFieldValue("BEATS") || "1";
    return `music.rest(music.beat(BeatFraction.Whole) * ${beats});\n`;
  };

  asAny.forBlock["music_note_value"] = (block: Blockly.Block) => {
    const note = block.getFieldValue("NOTE") || "C";
    return [`music.noteFrequency(Note.${note})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["music_set_volume"] = (block: Blockly.Block) => {
    const vol = block.getFieldValue("VOL") || "127";
    return `music.setVolume(${vol});\n`;
  };

  asAny.forBlock["music_get_volume"] = () => ["music.volume()", Order.FUNCTION_CALL];

  asAny.forBlock["music_stop_all_sounds"] = () => "music.stopAllSounds();\n";

  asAny.forBlock["music_change_tempo"] = (block: Blockly.Block) => {
    const delta = block.getFieldValue("DELTA") || "20";
    return `music.changeTempoBy(${delta});\n`;
  };

  asAny.forBlock["music_set_tempo"] = (block: Blockly.Block) => {
    const tempo = block.getFieldValue("TEMPO") || "120";
    return `music.setTempo(${tempo});\n`;
  };

  asAny.forBlock["music_beat_value"] = (block: Blockly.Block) => {
    const beats = block.getFieldValue("BEATS") || "1";
    return [`music.beat(BeatFraction.Whole) * ${beats}`, Order.MULTIPLICATION];
  };

  asAny.forBlock["music_get_tempo"] = () => ["music.tempo()", Order.FUNCTION_CALL];

  asAny.forBlock["music_on_event"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const eventName = block.getFieldValue("EVENT") || "MelodyNotePlayed";
    const body = generator.statementToCode(block, "DO");
    return `music.onEvent(MusicEvent.${eventName}, function () {\n${body}});\n`;
  };

  asAny.forBlock["music_play_melody_advanced"] = (block: Blockly.Block) => {
    const melody = block.getFieldValue("MELODY") || "DADADUM";
    const playMode = block.getFieldValue("PLAYMODE") || "IN_BACKGROUND";
    const melodyOption = playMode === "UNTIL_DONE" ? "MelodyOptions.Once" : "MelodyOptions.OnceInBackground";
    return `music.startMelody(music.builtInMelody(Melodies.${melody}), ${melodyOption});\n`;
  };

  asAny.forBlock["music_stop_melody"] = (block: Blockly.Block) => {
    const stopMode = block.getFieldValue("STOPMODE") || "All";
    return `music.stopMelody(MelodyStopOptions.${stopMode});\n`;
  };

  asAny.forBlock["music_on_melody_note_played"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const body = generator.statementToCode(block, "DO");
    return `music.onEvent(MusicEvent.MelodyNotePlayed, function () {\n${body}});\n`;
  };

  asAny.forBlock["music_play_giggle"] = (block: Blockly.Block) => {
    const playMode = block.getFieldValue("PLAYMODE") || "UNTIL_DONE";
    const melodyOption = playMode === "UNTIL_DONE" ? "MelodyOptions.Once" : "MelodyOptions.OnceInBackground";
    return `music.startMelody(music.builtInMelody(Melodies.Giggle), ${melodyOption});\n`;
  };

  asAny.forBlock["music_play_sound_effect"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const effect = generator.valueToCode(block, "EFFECT", Order.NONE) || "\"soundExpression.giggle\"";
    const playMode = block.getFieldValue("PLAYMODE") || "UNTIL_DONE";
    const mode = playMode === "UNTIL_DONE" ? "SoundExpressionPlayMode.UntilDone" : "SoundExpressionPlayMode.InBackground";
    return `music.play(${effect}, ${mode});\n`;
  };

  asAny.forBlock["music_create_sound_effect"] = (block: Blockly.Block) => {
    const shape = block.getFieldValue("SHAPE") || "Sine";
    return [`music.createSoundEffect(WaveShape.${shape}, 5000, 0, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear)`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["music_sound_is_playing"] = () => ["music.isSoundPlaying()", Order.FUNCTION_CALL];

  asAny.forBlock["music_set_built_in_speaker_enabled"] = (block: Blockly.Block) => {
    const enabled = block.getFieldValue("ENABLED") || "true";
    return `music.setBuiltInSpeakerEnabled(${enabled});\n`;
  };

  asAny.forBlock["led_plot"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const x = generator.valueToCode(block, "X", Order.NONE) || "0";
    const y = generator.valueToCode(block, "Y", Order.NONE) || "0";
    return `led.plot(${x}, ${y});\n`;
  };

  asAny.forBlock["led_unplot"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const x = generator.valueToCode(block, "X", Order.NONE) || "0";
    const y = generator.valueToCode(block, "Y", Order.NONE) || "0";
    return `led.unplot(${x}, ${y});\n`;
  };

  asAny.forBlock["led_toggle"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const x = generator.valueToCode(block, "X", Order.NONE) || "0";
    const y = generator.valueToCode(block, "Y", Order.NONE) || "0";
    return `led.toggle(${x}, ${y});\n`;
  };

  asAny.forBlock["led_point"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const x = generator.valueToCode(block, "X", Order.NONE) || "0";
    const y = generator.valueToCode(block, "Y", Order.NONE) || "0";
    return [`led.point(${x}, ${y})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["led_plot_bar_graph"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const value = generator.valueToCode(block, "VALUE", Order.NONE) || "0";
    const high = generator.valueToCode(block, "HIGH", Order.NONE) || "0";
    return `led.plotBarGraph(${value}, ${high});\n`;
  };

  asAny.forBlock["radio_set_group"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const group = generator.valueToCode(block, "GROUP", Order.NONE) || "1";
    return `radio.setGroup(${group});\n`;
  };

  asAny.forBlock["radio_send_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const num = generator.valueToCode(block, "NUM", Order.NONE) || "0";
    return `radio.sendNumber(${num});\n`;
  };

  asAny.forBlock["radio_send_string"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    return `radio.sendString(${text});\n`;
  };

  asAny.forBlock["radio_send_value"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const name = generator.valueToCode(block, "NAME", Order.NONE) || "\"name\"";
    const value = generator.valueToCode(block, "VALUE", Order.NONE) || "0";
    return `radio.sendValue(${name}, ${value});\n`;
  };

  asAny.forBlock["radio_on_received_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const variable = (block.getFieldValue("VAR") || "receivedNumber").replace(/\s+/g, "_");
    const body = generator.statementToCode(block, "DO");
    return `radio.onReceivedNumber(function (${variable}) {\n${body}});\n`;
  };

  asAny.forBlock["radio_on_received_string"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const variable = (block.getFieldValue("VAR") || "receivedText").replace(/\s+/g, "_");
    const body = generator.statementToCode(block, "DO");
    return `radio.onReceivedString(function (${variable}) {\n${body}});\n`;
  };

  asAny.forBlock["radio_on_received_value"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const nameVar = (block.getFieldValue("NAME") || "name").replace(/\s+/g, "_");
    const valueVar = (block.getFieldValue("VALUE") || "value").replace(/\s+/g, "_");
    const body = generator.statementToCode(block, "DO");
    return `radio.onReceivedValue(function (${nameVar}, ${valueVar}) {\n${body}});\n`;
  };

  asAny.forBlock["radio_received_packet"] = (block: Blockly.Block) => {
    const type = block.getFieldValue("TYPE") || "TYPE";
    if (type === "SIGNAL") return ["radio.receivedPacket(RadioPacketProperty.SignalStrength)", Order.FUNCTION_CALL];
    if (type === "TIME") return ["radio.receivedPacket(RadioPacketProperty.Time)", Order.FUNCTION_CALL];
    if (type === "SERIAL") return ["radio.receivedPacket(RadioPacketProperty.SerialNumber)", Order.FUNCTION_CALL];
    return ["radio.receivedPacket(RadioPacketProperty.Time)", Order.FUNCTION_CALL];
  };

  asAny.forBlock["loops_every_interval"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const time = generator.valueToCode(block, "TIME", Order.NONE) || "1000";
    const body = generator.statementToCode(block, "DO");
    return `loops.everyInterval(${time}, function () {\n${body}});\n`;
  };

  asAny.forBlock["logic_if_simple"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const cond = generator.valueToCode(block, "COND", Order.NONE) || "false";
    const body = generator.statementToCode(block, "DO");
    return `if (${cond}) {\n${body}}\n`;
  };

  asAny.forBlock["logic_if_else_simple"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const cond = generator.valueToCode(block, "COND", Order.NONE) || "false";
    const body = generator.statementToCode(block, "DO");
    const elseBody = generator.statementToCode(block, "ELSE");
    return `if (${cond}) {\n${body}} else {\n${elseBody}}\n`;
  };

  asAny.forBlock["variables_item_equals_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const value = generator.valueToCode(block, "VALUE", Order.NONE) || "0";
    return `let item = ${value};\n`;
  };

  asAny.forBlock["math_max2"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const a = generator.valueToCode(block, "A", Order.NONE) || "0";
    const b = generator.valueToCode(block, "B", Order.NONE) || "0";
    return [`Math.max(${a}, ${b})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["math_min2"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const a = generator.valueToCode(block, "A", Order.NONE) || "0";
    const b = generator.valueToCode(block, "B", Order.NONE) || "0";
    return [`Math.min(${a}, ${b})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["math_trunc"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const num = generator.valueToCode(block, "NUM", Order.NONE) || "0";
    return [`Math.trunc(${num})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["math_random_bool"] = () => ["Math.random() < 0.5", Order.RELATIONAL];

  asAny.forBlock["math_map_value"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const value = generator.valueToCode(block, "VALUE", Order.NONE) || "0";
    const fromLow = generator.valueToCode(block, "FROM_LOW", Order.NONE) || "0";
    const fromHigh = generator.valueToCode(block, "FROM_HIGH", Order.NONE) || "1023";
    const toLow = generator.valueToCode(block, "TO_LOW", Order.NONE) || "0";
    const toHigh = generator.valueToCode(block, "TO_HIGH", Order.NONE) || "4";
    return [`Math.map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_parse_to_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"0\"";
    return [`parseFloat(${text})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_split_with"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    const sep = generator.valueToCode(block, "SEP", Order.NONE) || "\"\"";
    return [`${text}.split(${sep})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_includes"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    const find = generator.valueToCode(block, "FIND", Order.NONE) || "\"\"";
    return [`${text}.includes(${find})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_substring_length"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    const from = generator.valueToCode(block, "FROM", Order.NONE) || "0";
    const len = generator.valueToCode(block, "LEN", Order.NONE) || "0";
    return [`${text}.substr(${from}, ${len})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_compare_to"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const a = generator.valueToCode(block, "A", Order.NONE) || "\"\"";
    const b = generator.valueToCode(block, "B", Order.NONE) || "\"\"";
    return [`${a}.localeCompare(${b})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_char_code_at"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const text = generator.valueToCode(block, "TEXT", Order.NONE) || "\"\"";
    const index = generator.valueToCode(block, "INDEX", Order.NONE) || "0";
    return [`${text}.charCodeAt(${index})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_convert_number_to_text"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const num = generator.valueToCode(block, "NUM", Order.NONE) || "0";
    return [`String(${num})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["text_from_char_code"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const code = generator.valueToCode(block, "CODE", Order.NONE) || "0";
    return [`String.fromCharCode(${code})`, Order.FUNCTION_CALL];
  };

  asAny.forBlock["game_create_sprite"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => {
    const v = (block.getFieldValue("VAR") || "sprite").replace(/\s+/g, "_");
    const x = generator.valueToCode(block, "X", Order.NONE) || "2";
    const y = generator.valueToCode(block, "Y", Order.NONE) || "2";
    return `let ${v} = game.createSprite(${x}, ${y});\n`;
  };
  asAny.forBlock["game_delete_sprite"] = (block: Blockly.Block) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.delete();\n`;
  asAny.forBlock["game_sprite_is_deleted"] = (block: Blockly.Block) => [`${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.isDeleted()`, Order.FUNCTION_CALL];
  asAny.forBlock["game_sprite_move_by"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.move(${generator.valueToCode(block, "BY", Order.NONE) || "1"});\n`;
  asAny.forBlock["game_sprite_turn_by"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.turn(Direction.${block.getFieldValue("DIR") || "Right"}, ${generator.valueToCode(block, "DEG", Order.NONE) || "45"});\n`;
  asAny.forBlock["game_sprite_change_x_by"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.change(LedSpriteProperty.X, ${generator.valueToCode(block, "BY", Order.NONE) || "1"});\n`;
  asAny.forBlock["game_sprite_set_x_to"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.set(LedSpriteProperty.X, ${generator.valueToCode(block, "X", Order.NONE) || "0"});\n`;
  asAny.forBlock["game_sprite_x"] = (block: Blockly.Block) => [`${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.get(LedSpriteProperty.X)`, Order.FUNCTION_CALL];
  asAny.forBlock["game_sprite_is_touching"] = (block: Blockly.Block) => [`${(block.getFieldValue("A") || "sprite").replace(/\s+/g, "_")}.isTouching(${(block.getFieldValue("B") || "otherSprite").replace(/\s+/g, "_")})`, Order.FUNCTION_CALL];
  asAny.forBlock["game_sprite_is_touching_edge"] = (block: Blockly.Block) => [`${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.isTouchingEdge()`, Order.FUNCTION_CALL];
  asAny.forBlock["game_sprite_if_on_edge_bounce"] = (block: Blockly.Block) => `${(block.getFieldValue("SPRITE") || "sprite").replace(/\s+/g, "_")}.ifOnEdgeBounce();\n`;
  asAny.forBlock["game_remove_life"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.removeLife(${generator.valueToCode(block, "N", Order.NONE) || "1"});\n`;
  asAny.forBlock["game_add_life"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.addLife(${generator.valueToCode(block, "N", Order.NONE) || "1"});\n`;
  asAny.forBlock["game_set_life"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.setLife(${generator.valueToCode(block, "N", Order.NONE) || "0"});\n`;
  asAny.forBlock["game_set_score"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.setScore(${generator.valueToCode(block, "N", Order.NONE) || "0"});\n`;
  asAny.forBlock["game_change_score_by"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.changeScoreBy(${generator.valueToCode(block, "N", Order.NONE) || "1"});\n`;
  asAny.forBlock["game_start_countdown"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `game.startCountdown(${generator.valueToCode(block, "MS", Order.NONE) || "10000"});\n`;
  asAny.forBlock["game_score"] = () => ["game.score()", Order.FUNCTION_CALL];
  asAny.forBlock["game_over"] = () => "game.gameOver();\n";
  asAny.forBlock["game_is_over"] = () => ["game.isGameOver()", Order.FUNCTION_CALL];
  asAny.forBlock["game_is_paused"] = () => ["game.isPaused()", Order.FUNCTION_CALL];
  asAny.forBlock["game_is_running"] = () => ["game.isRunning()", Order.FUNCTION_CALL];
  asAny.forBlock["game_resume"] = () => "game.resume();\n";
  asAny.forBlock["game_pause"] = () => "game.pause();\n";

  asAny.forBlock["images_show_image_offset"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${generator.valueToCode(block, "IMG", Order.NONE) || "images.createImage(`\\n00000\\n00000\\n00000\\n00000\\n00000\\n`)"} .showImage(${generator.valueToCode(block, "OFFSET", Order.NONE) || "0"});\n`;
  asAny.forBlock["images_scroll_image"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `${generator.valueToCode(block, "IMG", Order.NONE) || "images.createImage(`\\n00000\\n00000\\n00000\\n00000\\n00000\\n`)"} .scrollImage(${generator.valueToCode(block, "OFFSET", Order.NONE) || "1"}, ${generator.valueToCode(block, "INTERVAL", Order.NONE) || "200"});\n`;
  asAny.forBlock["images_create_image"] = (block: Blockly.Block) => [`images.createImage(\`\n${String(block.getFieldValue("MATRIX") || "").replace(/\./g, "0").replace(/#/g, "1")}\n\`)`, Order.FUNCTION_CALL];
  asAny.forBlock["images_create_big_image"] = (block: Blockly.Block) => [`images.createBigImage(\`\n${String(block.getFieldValue("MATRIX") || "").replace(/\./g, "0").replace(/#/g, "1")}\n\`)`, Order.FUNCTION_CALL];
  asAny.forBlock["images_direction"] = (block: Blockly.Block) => [`ImageScrollDirection.${block.getFieldValue("DIR") || "North"}`, Order.ATOMIC];
  asAny.forBlock["images_icon_image"] = (block: Blockly.Block) => [`images.iconImage(IconNames.${block.getFieldValue("ICON") || "Heart"})`, Order.FUNCTION_CALL];
  asAny.forBlock["images_arrow_image"] = (block: Blockly.Block) => [`images.arrowImage(ArrowNames.${block.getFieldValue("ARROW") || "North"})`, Order.FUNCTION_CALL];

  asAny.forBlock["pins_digital_read_pin"] = (block: Blockly.Block) => [`pins.digitalReadPin(DigitalPin.${block.getFieldValue("PIN") || "P0"})`, Order.FUNCTION_CALL];
  asAny.forBlock["pins_digital_write_pin"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `pins.digitalWritePin(DigitalPin.${block.getFieldValue("PIN") || "P0"}, ${generator.valueToCode(block, "VAL", Order.NONE) || "0"});\n`;
  asAny.forBlock["pins_analog_read_pin"] = (block: Blockly.Block) => [`pins.analogReadPin(AnalogPin.${block.getFieldValue("PIN") || "P0"})`, Order.FUNCTION_CALL];
  asAny.forBlock["pins_analog_write_pin"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `pins.analogWritePin(AnalogPin.${block.getFieldValue("PIN") || "P0"}, ${generator.valueToCode(block, "VAL", Order.NONE) || "1023"});\n`;
  asAny.forBlock["pins_map"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => [`Math.map(${generator.valueToCode(block, "VALUE", Order.NONE) || "0"}, ${generator.valueToCode(block, "FROM_LOW", Order.NONE) || "0"}, ${generator.valueToCode(block, "FROM_HIGH", Order.NONE) || "1023"}, ${generator.valueToCode(block, "TO_LOW", Order.NONE) || "0"}, ${generator.valueToCode(block, "TO_HIGH", Order.NONE) || "4"})`, Order.FUNCTION_CALL];
  asAny.forBlock["pins_analog_set_period_pin"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `pins.analogSetPeriod(AnalogPin.${block.getFieldValue("PIN") || "P0"}, ${generator.valueToCode(block, "US", Order.NONE) || "20000"});\n`;
  asAny.forBlock["pins_set_audio_pin"] = (block: Blockly.Block) => `pins.setAudioPin(AnalogPin.${block.getFieldValue("PIN") || "P0"});\n`;
  asAny.forBlock["pins_set_audio_pin_enabled"] = (block: Blockly.Block) => `pins.setAudioPinEnabled(${block.getFieldValue("EN") || "false"});\n`;
  asAny.forBlock["pins_servo_write_pin"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `pins.servoWritePin(AnalogPin.${block.getFieldValue("PIN") || "P0"}, ${generator.valueToCode(block, "VAL", Order.NONE) || "180"});\n`;
  asAny.forBlock["pins_servo_set_pulse"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `pins.servoSetPulse(AnalogPin.${block.getFieldValue("PIN") || "P0"}, ${generator.valueToCode(block, "US", Order.NONE) || "1500"});\n`;

  asAny.forBlock["serial_write_line"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeLine(${generator.valueToCode(block, "TEXT", Order.NONE) || "\"\""});\n`;
  asAny.forBlock["serial_write_number"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeNumber(${generator.valueToCode(block, "NUM", Order.NONE) || "0"});\n`;
  asAny.forBlock["serial_write_value_pair"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeValue(${generator.valueToCode(block, "NAME", Order.NONE) || "\"x\""}, ${generator.valueToCode(block, "VAL", Order.NONE) || "0"});\n`;
  asAny.forBlock["serial_write_string"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeString(${generator.valueToCode(block, "TEXT", Order.NONE) || "\"\""});\n`;
  asAny.forBlock["serial_write_numbers"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeNumbers(${generator.valueToCode(block, "ARR", Order.NONE) || "[]"});\n`;
  asAny.forBlock["serial_read_line"] = () => ["serial.readLine()", Order.FUNCTION_CALL];
  asAny.forBlock["serial_read_until"] = (block: Blockly.Block) => [`serial.readUntil("${block.getFieldValue("DELIM") || "\\n"}")`, Order.FUNCTION_CALL];
  asAny.forBlock["serial_on_data_received"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.onDataReceived("${block.getFieldValue("DELIM") || "\\n"}", function () {\n${generator.statementToCode(block, "DO")}});\n`;
  asAny.forBlock["serial_read_string"] = () => ["serial.readString()", Order.FUNCTION_CALL];
  asAny.forBlock["serial_redirect_to"] = (block: Blockly.Block) => `serial.redirect(SerialPin.${block.getFieldValue("TX") || "P0"}, SerialPin.${block.getFieldValue("RX") || "P1"}, BaudRate.BaudRate${block.getFieldValue("BAUD") || "115200"});\n`;
  asAny.forBlock["serial_redirect_to_usb"] = () => "serial.redirectToUSB();\n";
  asAny.forBlock["serial_set_tx_buffer_size"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.setTxBufferSize(${generator.valueToCode(block, "N", Order.NONE) || "32"});\n`;
  asAny.forBlock["serial_set_rx_buffer_size"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.setRxBufferSize(${generator.valueToCode(block, "N", Order.NONE) || "32"});\n`;
  asAny.forBlock["serial_write_buffer"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.writeBuffer(${generator.valueToCode(block, "BUF", Order.NONE) || "serial.readBuffer(0)"});\n`;
  asAny.forBlock["serial_read_buffer"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => [`serial.readBuffer(${generator.valueToCode(block, "N", Order.NONE) || "0"})`, Order.FUNCTION_CALL];
  asAny.forBlock["serial_set_write_line_padding"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `serial.setWriteLinePadding(${generator.valueToCode(block, "N", Order.NONE) || "0"});\n`;
  asAny.forBlock["serial_set_baud_rate"] = (block: Blockly.Block) => `serial.setBaudRate(BaudRate.BaudRate${block.getFieldValue("BAUD") || "115200"});\n`;

  asAny.forBlock["control_wait_for_event"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `control.waitForEvent(${generator.valueToCode(block, "SRC", Order.NONE) || "0"}, ${generator.valueToCode(block, "VAL", Order.NONE) || "0"});\n`;
  asAny.forBlock["control_run_in_background"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `control.inBackground(function () {\n${generator.statementToCode(block, "DO")}});\n`;
  asAny.forBlock["control_millis"] = () => ["input.runningTime()", Order.FUNCTION_CALL];
  asAny.forBlock["control_reset"] = () => "control.reset();\n";
  asAny.forBlock["control_wait_micros"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `control.waitMicros(${generator.valueToCode(block, "US", Order.NONE) || "4"});\n`;
  asAny.forBlock["control_raise_event"] = (block: Blockly.Block) => `control.raiseEvent(${block.getFieldValue("SRC") || "MICROBIT_ID_BUTTON_A"}, ${block.getFieldValue("VAL") || "MICROBIT_EVT_ANY"});\n`;
  asAny.forBlock["control_on_event"] = (block: Blockly.Block, generator: Blockly.CodeGenerator) => `control.onEvent(${block.getFieldValue("SRC") || "MICROBIT_ID_BUTTON_A"}, ${block.getFieldValue("VAL") || "MICROBIT_EVT_ANY"}, function () {\n${generator.statementToCode(block, "DO")}});\n`;
  asAny.forBlock["control_event_timestamp"] = () => ["control.eventTimestamp()", Order.FUNCTION_CALL];
  asAny.forBlock["control_event_value"] = () => ["control.eventValue()", Order.FUNCTION_CALL];
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function registerWorkspaceCallbacks(workspace: Blockly.WorkspaceSvg) {
  workspace.registerButtonCallback("MAKE_FUNCTION", () => {
    const defaultName = "do something";
    const rawName = window.prompt("Function name", defaultName);
    if (rawName === null) return;
    const trimmed = rawName.trim();
    if (!trimmed) return;

    const definition = workspace.newBlock("procedures_defnoreturn");
    definition.setFieldValue(trimmed, "NAME");
    definition.initSvg();
    definition.render();

    const view = workspace.getMetrics();
    const x = view ? view.viewLeft + 40 : 40;
    const y = view ? view.viewTop + 40 : 40;
    definition.moveBy(x, y);
    definition.select();
  });
}

function getLineFromIndex(text: string, index: number) {
  return text.slice(0, Math.max(0, index)).split("\n").length;
}

function findCodeProblems(code: string) {
  const issues: string[] = [];
  const stack: { ch: string; line: number }[] = [];
  const openToClose: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  const closeToOpen: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    if (openToClose[ch]) {
      stack.push({ ch, line: getLineFromIndex(code, i) });
      continue;
    }
    if (closeToOpen[ch]) {
      const top = stack.pop();
      if (!top || top.ch !== closeToOpen[ch]) {
        issues.push(`Line ${getLineFromIndex(code, i)}: unmatched '${ch}'`);
      }
    }
  }

  while (stack.length) {
    const top = stack.pop();
    if (top) issues.push(`Line ${top.line}: missing '${openToClose[top.ch]}'`);
  }

  try {
    // Lightweight parser check for editor feedback.
    // eslint-disable-next-line no-new-func
    new Function(code);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid syntax";
    issues.push(`Syntax: ${message}`);
  }

  const lenCallMatch = code.match(/\blen\s*\(/);
  if (lenCallMatch && !/\b(function|const|let|var)\s+len\b/.test(code)) {
    issues.push(`Line ${getLineFromIndex(code, lenCallMatch.index ?? 0)}: can't find called function 'len'`);
  }

  const listUseMatch = code.match(/\blist\b/);
  if (listUseMatch && !/\b(const|let|var)\s+list\b/.test(code)) {
    issues.push(`Line ${getLineFromIndex(code, listUseMatch.index ?? 0)}: name 'list' is not defined`);
  }

  return Array.from(new Set(issues));
}

export default function BlocklyEditorClient() {
  const blocklyHostRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const manualCodeEditRef = useRef(false);
  const editorModeRef = useRef<"blocks" | "python">("blocks");

  const [editorMode, setEditorMode] = useState<"blocks" | "python">("blocks");
  const [generatedCode, setGeneratedCode] = useState("// Drag blocks to generate MakeCode-like TypeScript");
  const [codeEditorValue, setCodeEditorValue] = useState("// Drag blocks to generate MakeCode-like TypeScript");
  const [isManualCodeEdit, setIsManualCodeEdit] = useState(false);
  const [status, setStatus] = useState("Ready");

  const blockCount = useMemo(() => {
    const workspace = workspaceRef.current;
    return workspace ? workspace.getAllBlocks(false).length : 0;
  }, [generatedCode]);

  const syncCode = (workspace: Blockly.Workspace) => {
    javascriptGenerator.init(workspace);
    const nextCode = javascriptGenerator.workspaceToCode(workspace) || "// No code generated yet";
    setGeneratedCode(nextCode);
    if (!manualCodeEditRef.current || editorModeRef.current === "blocks") {
      setCodeEditorValue(nextCode);
    }
  };

  const activeCode = editorMode === "python" ? codeEditorValue : generatedCode;

  const codeProblems = useMemo(() => {
    const trimmed = activeCode.trim();
    if (!trimmed || trimmed.startsWith("// No code generated yet")) return [];
    return findCodeProblems(activeCode);
  }, [activeCode]);

  useEffect(() => {
    editorModeRef.current = editorMode;
  }, [editorMode]);

  useEffect(() => {
    manualCodeEditRef.current = isManualCodeEdit;
  }, [isManualCodeEdit]);

  useEffect(() => {
    if (!blocklyHostRef.current) return;

    registerPxtLikeBlocks();

    const workspace = Blockly.inject(blocklyHostRef.current, {
      toolbox: editorMode === "blocks" ? toolbox : pythonToolbox,
      trashcan: true,
      media: "/blockly/media/",
      grid: {
        spacing: 24,
        length: 3,
        colour: "#d1d5db",
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.95,
        maxScale: 2,
        minScale: 0.3
      }
    });

    registerWorkspaceCallbacks(workspace);

    workspaceRef.current = workspace;
    syncCode(workspace);

    const listener = () => syncCode(workspace);
    workspace.addChangeListener(listener);

    return () => {
      workspace.removeChangeListener(listener);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    workspace.updateToolbox(editorMode === "blocks" ? toolbox : pythonToolbox);
    if (editorMode === "blocks") {
      setCodeEditorValue(generatedCode);
      setIsManualCodeEdit(false);
      manualCodeEditRef.current = false;
    }
    setStatus(editorMode === "blocks" ? "Blocks mode active." : "Python mode active.");
  }, [editorMode, generatedCode]);

  const handleReset = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    workspace.clear();
    syncCode(workspace);
    setStatus("Workspace cleared.");
  };

  const handleExportXml = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const xmlText = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace));
    downloadTextFile("pxt-blocks-workspace.xml", xmlText);
    setStatus("Workspace XML exported.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportXml = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const workspace = workspaceRef.current;
    if (!file || !workspace) return;

    try {
      const xmlText = await file.text();
      workspace.clear();
      const xmlDom = Blockly.utils.xml.textToDom(xmlText);
      Blockly.Xml.domToWorkspace(xmlDom, workspace);
      syncCode(workspace);
      setStatus(`Imported: ${file.name}`);
    } catch {
      setStatus("Import failed: invalid XML.");
    } finally {
      event.currentTarget.value = "";
    }
  };

  return (
    <main className="h-screen w-full bg-slate-100 text-slate-900">
      <div className="flex h-14 items-center justify-between border-b border-slate-300 bg-blue-700 px-4 text-white">
        <h1 className="text-sm font-semibold sm:text-base">PXT Blocks Editor</h1>
        <div className="hidden items-center rounded-full border border-blue-900 bg-blue-800 p-0.5 md:flex">
          <button
            type="button"
            onClick={() => setEditorMode("blocks")}
            className={`rounded-full px-6 py-1.5 text-sm font-semibold transition ${
              editorMode === "blocks" ? "bg-white text-blue-700" : "text-blue-100 hover:bg-blue-700"
            }`}
          >
            Blocks
          </button>
          <button
            type="button"
            onClick={() => setEditorMode("python")}
            className={`rounded-full px-6 py-1.5 text-sm font-semibold transition ${
              editorMode === "python" ? "bg-white text-blue-700" : "text-blue-100 hover:bg-blue-700"
            }`}
          >
            Python
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded bg-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-600 sm:text-sm"
          >
            Import XML
          </button>
          <button
            type="button"
            onClick={handleExportXml}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium hover:bg-blue-500 sm:text-sm"
          >
            Export XML
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded bg-rose-500 px-3 py-1.5 text-xs font-medium hover:bg-rose-400 sm:text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[340px_1fr_420px]">
        <PxtSimulatorPane code={activeCode} />

        <section className="min-h-0 border-r border-slate-300 bg-white">
          <div ref={blocklyHostRef} className="h-full w-full" />
        </section>

        <aside className="flex min-h-0 flex-col bg-slate-950">
          <div className="border-b border-slate-800 px-4 py-3 text-xs text-slate-300">
            <p>Status: {status}</p>
            <p>Blocks: {blockCount}</p>
          </div>
          <textarea
            value={activeCode}
            onChange={(event) => {
              if (editorMode !== "python") return;
              setCodeEditorValue(event.target.value);
              setIsManualCodeEdit(true);
              manualCodeEditRef.current = true;
            }}
            readOnly={editorMode !== "python"}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none overflow-auto border-0 bg-slate-950 p-4 font-mono text-sm text-emerald-300 outline-none"
          />
          <section className="border-t border-slate-800 bg-slate-900 p-3 text-xs text-slate-200">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">Problems ({codeProblems.length})</p>
              {editorMode === "python" && isManualCodeEdit ? (
                <button
                  type="button"
                  onClick={() => {
                    setCodeEditorValue(generatedCode);
                    setIsManualCodeEdit(false);
                    manualCodeEditRef.current = false;
                  }}
                  className="rounded bg-slate-700 px-2 py-1 text-[11px] hover:bg-slate-600"
                >
                  Reset To Generated
                </button>
              ) : null}
            </div>
            {codeProblems.length === 0 ? (
              <p className="text-slate-400">No issues detected.</p>
            ) : (
              <div className="max-h-28 space-y-1 overflow-auto text-rose-300">
                {codeProblems.map((problem, index) => (
                  <p key={`${problem}-${index}`}>{problem}</p>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,text/xml"
        className="hidden"
        onChange={handleImportXml}
      />

      <style jsx global>{`
        .blocklyFlyout .blocklyFlyoutBackground {
          fill: #4a4a4e !important;
          fill-opacity: 1 !important;
        }
        .blocklyFlyout .blocklyText,
        .blocklyFlyoutLabelText {
          fill: #f8fafc !important;
        }
        .blocklyTreeRow {
          border-left: 4px solid transparent;
        }
        .blocklyTreeSelected {
          background: #2b91ea !important;
          color: #ffffff !important;
        }
      `}</style>
    </main>
  );
}
