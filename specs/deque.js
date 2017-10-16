/* global describe, it, expect */
"use strict";

// Describe Array, List, and SortedSet, all of which have the interface of a
// double-ended queue.  Array and List are proper queues since push and unshift
// put the values at the ends, but for sake of reusing these tests for
// SortedSet, all of these tests maintain the sorted order of the collection.

var fuzzDeque = require("./deque-fuzz").fuzzDeque;
var iterate = require("@collections/iterate");
var toArray = require("@collections/to-array");

module.exports = describeDeque;
function describeDeque(Deque) {

    describe("add(value)", function () {
        if (!Deque.prototype.add)
            return;
        it("is an alias for push", function () {
            var collection = Deque([1, 2, 3]);
            collection.add(4);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });
    });

    describe("push(value)", function () {
        it("adds one value to the end", function () {
            var collection = Deque([1, 2, 3]);
            collection.push(4);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });
    });

    describe("push(...values)", function () {
        it("adds many values to the end", function () {
            var collection = Deque([1, 2, 3]);
            collection.push(4, 5, 6);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it("adds many values to the end variadically", function () {
            var collection = Deque([1, 2, 3]);
            collection.push.apply(collection, [4, 5, 6]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    describe("unshift(value)", function () {
        it("adds a value to the beginning", function () {
            var collection = Deque([1, 2, 3]);
            collection.unshift(0);
            expect(toArray(collection)).toEqual([0, 1, 2, 3]);
        });
    });

    describe("unshift(...values)", function () {
        it("adds many values to the beginning", function () {
            var collection = Deque([1, 2, 3]);
            collection.unshift(-2, -1, 0);
            expect(toArray(collection)).toEqual([-2, -1, 0, 1, 2, 3]);
        });

        it("adds many values to the beginning", function () {
            var collection = Deque([1, 2, 3]);
            collection.unshift.apply(collection, [-2, -1, 0]);
            expect(toArray(collection)).toEqual([-2, -1, 0, 1, 2, 3]);
        });
    });

    describe("pop", function () {
        it("removes one value from the end and returns it", function () {
            var collection = Deque([1, 2, 3]);
            expect(collection.pop()).toEqual(3);
            expect(toArray(collection)).toEqual([1, 2]);
        });
    });

    describe("shift", function () {
        it("removes one value from the beginning and returns it", function () {
            var collection = Deque([1, 2, 3]);
            expect(collection.shift()).toEqual(1);
            expect(toArray(collection)).toEqual([2, 3]);
        });
    });

    describe("concat", function () {
        it("concatenates variadic mixed-type collections", function () {
            var collection = Deque([1, 2, 3]).concat(
                [4, 5, 6],
                Deque([7, 8, 9])
            );
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
    });

    describe("slice", function () {
        if (!Deque.prototype.slice)
            return;

        var collection = Deque([1, 2, 3, 4]);

        it("slices all values with no arguments", function () {
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });

        it("slices all after an index", function () {
            expect(collection.slice(2)).toEqual([3, 4]);
        });

        it("slices from the middle by indexed positions", function () {
            expect(collection.slice(1, 3)).toEqual([2, 3]);
        });

        it("slices from a negative index", function () {
            expect(collection.slice(-2)).toEqual([3, 4]);
        });

        it("slices from a negative index to a positive", function () {
            expect(collection.slice(-2, 3)).toEqual([3]);
        });

        it("slices from a negative index to a negative", function () {
            expect(collection.slice(-2, -1)).toEqual([3]);
        });

        // TODO
        /*
        it("slices from a negative index to zero", function () {
            expect(collection.slice(-2, 0)).toEqual([]); // Array
            expect(collection.slice(-2, 0)).toEqual([3, 4]); // List
        });
        */

    });

    describe("splice", function () {
        if (!Deque.prototype.splice)
            return;

        it("does nothing with no arguments", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice()).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });

        it("splices to end with only an offset argument", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(2)).toEqual([3, 4]);
            expect(toArray(collection)).toEqual([1, 2]);
        });

        it("splices nothing with no length", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(2, 0)).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });

        it("splices all values", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(0, collection.length)).toEqual([1, 2, 3, 4]);
            expect(toArray(collection)).toEqual([]);
        });

        it("splices from negative offset", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(-2)).toEqual([3, 4]);
            expect(toArray(collection)).toEqual([1, 2]);
        });

        it("injects values at a numeric offset", function () {
            var collection = Deque([1, 2, 5, 6]);
            expect(collection.splice(2, 0, 3, 4)).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it("replaces values at a numeric offset", function () {
            var collection = Deque([1, 2, 3, 6]);
            expect(collection.splice(1, 2, 4, 5)).toEqual([2, 3]);
            expect(toArray(collection)).toEqual([1, 4, 5, 6]);
        });

        it("injects values with implied position and length", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(null, null, -1, 0)).toEqual([]);
            expect(toArray(collection)).toEqual([-1, 0, 1, 2, 3, 4]);
        });

        it("appends values", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.splice(4, 0, 5, 6)).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });

    });

    describe("swap", function () {
        if (!Deque.prototype.swap)
            return;

        it("does nothing with no arguments", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap()).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });

        it("splices to end with only an offset argument", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(2)).toEqual([3, 4]);
            expect(toArray(collection)).toEqual([1, 2]);
        });

        it("splices nothing with no length", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(2, 0)).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4]);
        });

        it("splices all values", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(0, collection.length)).toEqual([1, 2, 3, 4]);
            expect(toArray(collection)).toEqual([]);
        });

        it("splices from negative offset", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(-2)).toEqual([3, 4]);
            expect(toArray(collection)).toEqual([1, 2]);
        });

        it("injects values at a numeric offset", function () {
            var collection = Deque([1, 2, 5, 6]);
            expect(collection.swap(2, 0, [3, 4])).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it("replaces values at a numeric offset", function () {
            var collection = Deque([1, 2, 3, 6]);
            expect(collection.swap(1, 2, [4, 5])).toEqual([2, 3]);
            expect(toArray(collection)).toEqual([1, 4, 5, 6]);
        });

        it("injects values with implied position and length", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(null, null, [-1, 0])).toEqual([]);
            expect(toArray(collection)).toEqual([-1, 0, 1, 2, 3, 4]);
        });

        it("appends values", function () {
            var collection = Deque([1, 2, 3, 4]);
            expect(collection.swap(4, 0, [5, 6])).toEqual([]);
            expect(toArray(collection)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });

    if (!Deque.prototype.isSorted) {
        it("survives fuzz", function () {
            fuzzDeque(Deque);
        });
    }

    describe("peek and poke", function () {
        if (!Deque.prototype.poke && !Deque.prototype.peek)
            return;
        it("operates on the first value in the deque", function () {
            var deque = Deque([1, 2, 3, 4, 5, 6, 7, 8]);
            expect(deque.peek()).toBe(1);
            expect(deque.poke(2)).toBe(undefined);
            expect(deque.shift()).toBe(2);
            expect(deque.peek()).toBe(2);
        });
    });

    describe("peekBack and pokeBack", function () {
        if (!Deque.prototype.pokeBack && !Deque.prototype.peekBack)
            return;
        var deque = Deque([1, 2, 3, 4, 5, 6, 7, 8]);
        it("operates on the last value in the deque", function () {
            expect(deque.peekBack()).toBe(8);
            expect(deque.pokeBack(9)).toBe(undefined);
            expect(deque.pop()).toBe(9);
            expect(deque.peekBack()).toBe(7);
        });
    });

    // TODO peekBack
    // TODO pokeBack

    // from https://github.com/petkaantonov/deque

    describe("peek", function () {
        if (!Deque.prototype.peek)
            return;

        it("returns undefined when empty deque", function() {
            var a = new Deque();
            expect(a.length).toBe(0);
            expect(a.peek()).toBe(undefined);
            expect(a.peek()).toBe(undefined);
            expect(a.length).toBe(0);
        });

        it("returns the item at the front of the deque", function() {
            var a = new Deque();
            a.push(1,2,3,4,5,6,7,8,9);

            expect(a.peek()).toBe(1);

            var l = 5;
            while(l--) a.pop();

            expect(toArray(a)).toEqual([1, 2, 3, 4]);

            expect(a.peek()).toBe(1);

            l = 2;
            while (l--) a.shift();

            expect(a.peek()).toBe(3);

            expect(toArray(a)).toEqual([3, 4]);

            a.unshift(1,2,3,4,5,6,78,89,12901,10121,0,12, 1,2,3,4,5,6,78,89,12901,10121,0,12);

            expect(toArray(a)).toEqual([1,2,3,4,5,6,78,89,12901,10121,0,12, 1,2,3,4,5,6,78,89,12901,10121,0,12, 3, 4]);

            expect(a.peek()).toBe(1);

            a.push(1,3,4);

            expect(a.peek()).toBe(1);

            a.pop();
            a.shift();

            expect(a.peek()).toBe(2);
            expect(toArray(a)).toEqual([2,3,4,5,6,78,89,12901,10121,0,12, 1,2,3,4,5,6,78,89,12901,10121,0,12, 3, 4, 1, 3]);

        });
    });

    describe("clear", function () {
        it("clears the deque", function() {
            var a = Deque([1,2,3,4]);
            if (a.clear) {
                a.clear();
            } else {
                a.length = 0;
            }
            expect(a.length).toBe(0);
        });
    });

    describe("iterate", function () {
        it("iterates", function () {
            var deque = Deque();
            deque.push(3, 4, 5);
            deque.unshift(0, 1, 2);
            deque.pop();
            deque.shift();
            expect(toArray(deque)).toEqual([1, 2, 3, 4]);
            var iterator = iterate(deque);

            for (var index = 0; index < 4; index++) {
                var iteration = iterator.next();
                expect(iteration.value).toBe(index + 1);
                expect(iteration.index).toBe(index);
                expect(iteration.done).toBe(false);
            }
            expect(iterator.next()).toEqual({done: true});
            expect(iterator.next()).toEqual({done: true});
        });
    });

}
