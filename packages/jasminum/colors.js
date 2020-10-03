"use strict";

var ansiColor = require("ansi-color").set;

var enabled = (
  typeof window !== "undefined" &&
    window.isTTY || // PhantomJS
    typeof process !== "undefined" && // Node.js attached to terminal
    typeof process.stdout !== "undefined" &&
    process.stdout.isTTY
);

exports.enabled = enabled;

exports.color = function color(message, color) {
  if (exports.enabled) {
    return ansiColor(message, color);
  }
  return message;
};
