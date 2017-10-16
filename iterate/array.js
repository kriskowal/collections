"use strict";

var Iteration = require("./iteration");

module.exports = ArrayIterator;

// creates an iterator for Array and String
function ArrayIterator(iterable, start, stop, step) {
    if (step == null) {
        step = 1;
    }
    if (stop == null) {
        stop = start;
        start = 0;
    }
    if (start == null) {
        start = 0;
    }
    if (step == null) {
        step = 1;
    }
    if (stop == null) {
        stop = iterable.length;
    }
    this.iterable = iterable;
    this.start = start;
    this.stop = stop;
    this.step = step;
}

ArrayIterator.prototype.next = function () {
    // Advance to next owned entry
    if (typeof this.iterable !== "string") {
        while (!(this.start in this.iterable)) {
            if (this.start >= this.stop) {
                return Iteration.done;
            } else {
                this.start += this.step;
            }
        }
    }
    if (this.start >= this.stop) { // end of string
        return Iteration.done;
    }
    var iteration = new Iteration(
        this.iterable[this.start],
        false,
        this.start
    );
    this.start += this.step;
    return iteration;
};
