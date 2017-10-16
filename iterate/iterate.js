"use strict";

var ArrayIterator = require("./array");
var ObjectIterator = require("./object");

module.exports = iterate;
function iterate(iterable, start, stop, step) {
    if (!iterable) {
        return Iterator.empty;
    } else if (Array.isArray(iterable) || typeof iterable === "string") {
        return new ArrayIterator(iterable, start, stop, step);
    } else if (typeof iterable.next === "function") {
        return iterable;
    } else if (typeof iterable.iterate === "function") {
        return iterable.iterate(start, stop, step);
    } else if (typeof iterable === "object") {
        return new ObjectIterator(iterable);
    } else {
        throw new TypeError("Can't iterate " + iterable);
    }
}
