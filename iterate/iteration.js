"use strict";

var equals = require("@collections/equals");

module.exports = Iteration;
function Iteration(value, done, index) {
    this.value = value;
    this.done = done;
    this.index = index;
}

Iteration.prototype.equals = function (other) {
    return (
        other !== null &&
        typeof other === "object" &&
        equals(other.value, this.value) &&
        other.done === this.done &&
        other.index === this.index
    );
};

Iteration.done = new Iteration(undefined, true);
