"use strict";

var arraySwap = require("./array");

module.exports = swap;
function swap(array, start, minusLength, plus) {
    if (typeof array.swap === "function") {
        array.swap(start, minusLength, plus);
    } else {
        arraySwap(array, start, minusLength, plus);
    }
}

