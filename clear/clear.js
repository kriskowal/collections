"use strict";

var clearObject = require("./object");

module.exports = clear;
function clear(object) {
    if (Array.isArray(object)) {
        object.length = 0;
    } else if (object != null && typeof object.clear === "function") {
        object.clear();
    } else if (object != null && typeof object === "object") {
        clearObject(object);
    } else {
        throw new TypeError("Can't clear " + object);
    }
}

