
var Q = require("q");

describe("expectations", function () {

    var a = {}, b = {};

    describe("toBe", function () {
        it("expects objects to be identical", function () {
            expect(a).toBe(a);
        });
    });

    describe("not.toBe", function () {
        it("expects objects to be identical", function () {
            expect(a).not.toBe(b);
        });
    });

    describe("toEqual", function () {
        it("expects object literals to be equivalent", function () {
            expect({a: 10}).toEqual({a: 10});
            expect({a: 10, b: 20}).toEqual({a: 10, b: 20});
        });
        it("is indifferent to order", function () {
            expect({a: 10, b: 20}).toEqual({b: 20, a: 10});
        });
    });

    // TODO many more equals tests, rip from collections

    describe("not.toEqual", function () {
        it("expects object literals with different keys to be dissimilar", function () {
            expect({a: 10, b: 20}).not.toEqual({a: 10, b: 20, c: 30});
            expect({a: 10, b: 20, c: 30}).not.toEqual({a: 10, b: 20});
        });
        it("expects object literals with different values to be dissimilar", function () {
            expect({a: 10, b: 20, c: 30}).not.toEqual({a: 10, b: 20, c: 40});
        });
    });

    describe("toBeUndefined", function () {
        it("only identifies undefined", function () {
            expect().toBe(undefined);
        });
    });

    describe("not.toBeUndefined", function () {
        it("identifies null", function () {
            expect(null).not.toBe(undefined);
        });
        it("identifies zero", function () {
            expect(0).not.toBe(undefined);
        });
        it("identifies the empty string", function () {
            expect("").not.toBe(undefined);
        });
        it("identifies NaN", function () {
            expect(NaN).not.toBe(undefined);
        });
        it("identifies arbitrary object literals", function () {
            expect({}).not.toBe(undefined);
        });
    });

    describe("toBeDefined", function () {
        it("identifies null", function () {
            expect(null).toBeDefined();
        });
        it("identifies zero", function () {
            expect(0).toBeDefined();
        });
        it("identifies the empty string", function () {
            expect("").toBeDefined();
        });
        it("identifies NaN", function () {
            expect(NaN).toBeDefined();
        });
        it("identifies arbitrary object literals", function () {
            expect({}).toBeDefined();
        });
    });

    describe("not.toBeDefined", function () {;
        it("only identifies undefined", function () {
            expect().toBe(undefined);
        });
    });

    describe("toBeNull", function () {
        it("only identifies null", function () {
            expect(null).toBeNull();
        });
    });

    describe("not.toBeNull", function () {
        it("identifies undefined", function () {
            expect(undefined).not.toBeNull();
        });
        it("identifies zero", function () {
            expect(0).not.toBeNull();
        });
        it("identifies the empty string", function () {
            expect("").not.toBeNull();
        });
        it("identifies NaN", function () {
            expect(NaN).not.toBeNull();
        });
        it("identifies arbitrary object literals", function () {
            expect({}).not.toBeNull();
        });
    });

    describe("toBeTruthy", function () {
        it("identifies the truth", function () {
            expect(true).toBeTruthy();
        });
        it("identifies arbitrary object literals", function () {
            expect({}).toBeTruthy();
        });
        it("identifies positive numbers", function () {
            expect(1).toBeTruthy();
        });
        it("identifies negative numbers", function () {
            expect(-1).toBeTruthy();
        });
        it("identifies non empty strings", function () {
            expect(" ").toBeTruthy();
        });
    });

    describe("not.toBeTruthy", function () {
        it("identifies false", function () {
            expect(false).not.toBeTruthy();
        });
        it("identifies null", function () {
            expect(null).not.toBeTruthy();
        });
        it("identifies undefined", function () {
            expect().not.toBeTruthy();
        });
        it("identifies non-numbers", function () {
            expect(NaN).not.toBeTruthy();
        });
        it("identifies zero", function () {
            expect(0).not.toBeTruthy();
        });
        it("identifies empty strings", function () {
            expect("").not.toBeTruthy();
        });
    });

    describe("toBeFalsy", function () {
        it("identifies false", function () {
            expect(false).toBeFalsy();
        });
        it("identifies null", function () {
            expect(null).toBeFalsy();
        });
        it("identifies undefined", function () {
            expect().toBeFalsy();
        });
        it("identifies non-numbers", function () {
            expect(NaN).toBeFalsy();
        });
        it("identifies zero", function () {
            expect(0).toBeFalsy();
        });
        it("identifies empty strings", function () {
            expect("").toBeFalsy();
        });
    });

    describe("not.toBeFalsy", function () {
        it("identifies the truth", function () {
            expect(true).not.toBeFalsy();
        });
        it("identifies arbitrary object literals", function () {
            expect({}).not.toBeFalsy();
        });
        it("identifies positive numbers", function () {
            expect(1).not.toBeFalsy();
        });
        it("identifies negative numbers", function () {
            expect(-1).not.toBeFalsy();
        });
        it("identifies non empty strings", function () {
            expect(" ").not.toBeFalsy();
        });
    });

    describe("toContain", function () {
        it("finds identical values", function () {
            expect([1, 2, 3]).toContain(2);
        });
        it("finds equivalent values", function () {
            expect([{a: 10}]).toContain({a: 10});
        });
    });

    describe("not.toContain", function () {
        it("finds identical values", function () {
            expect([1, 2, 3]).not.toContain(4);
        });
        it("finds non-equivalent values", function () {
            expect([{a: 10}]).not.toContain({b: 20});
        });
    });

    describe("toBeLessThan", function () {
        it("compares numbers", function () {
            expect(1).toBeLessThan(2);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return -1;
            }}).toBeLessThan(10);
        });
    });

    describe("not.toBeLessThan", function () {
        it("compares numbers", function () {
            expect(1).not.toBeLessThan(0);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return 0;
            }}).not.toBeLessThan(10);
        });
    });

    describe("toBeGreaterThan", function () {
        it("compares numbers", function () {
            expect(1).toBeGreaterThan(0);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return 1;
            }}).toBeGreaterThan(10);
        });
    });

    describe("not.toBeGreaterThan", function () {
        it("compares numbers", function () {
            expect(1).not.toBeGreaterThan(2);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return 0;
            }}).not.toBeGreaterThan(10);
        });
    });

    describe("toBeNear", function () {
        it("compares numbers", function () {
            expect(1).toBeNear(2, 1);
            expect(1).toBeNear(0, 1);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return 10;
            }}).toBeNear(0, 10);
        });
    });

    describe("not.toBeNear", function () {
        it("compares numbers", function () {
            expect(1).not.toBeNear(2, .9);
            expect(1).not.toBeNear(0, .9);
        });
        it("compares comparables", function () {
            expect({compare: function (other) {
                return 10;
            }}).not.toBeNear(0, 9);
        });
    });

    var pi = 3.1415926, e = 2.78;

    describe("toBeCloseTo", function () {
        it("compares numbers", function () {
            expect(pi).toBeCloseTo(e, 0);
        });
        it("compares numbers with negative precision", function () {
            expect(10).toBeCloseTo(20, -1);
        });
    });

    describe("not.toBeCloseTo", function () {
        it("compares numbers", function () {
            expect(pi).not.toBeCloseTo(e, 2);
        });
        it("compares numbers with negative precision", function () {
            expect(100).not.toBeCloseTo(200, -1);
        });
    });

    describe("toBeBetween", function () {
        it("compares numbers in half open interval", function () {
            expect(0).toBeBetween(0, 1);
        });
    });

    describe("not.toBeBetween", function () {
        it("compares numbers in half open interval", function () {
            expect(1).not.toBeBetween(0, 1);
        });
    });

    describe("toMatch", function () {
        it("compares strings to a regular expression", function () {
            expect("foo bar baz").toMatch(/\bbar\b/);
        });
    });

    describe("not.toMatch", function () {
        it("compares strings to a regular expression", function () {
            expect("foo bar baz").not.toMatch(/\bqux\b/);
        });
    });

    describe("toThrow", function () {
        it("checks whether an exception is thrown", function () {
            expect(function () {
                throw new Error("X");
            }).toThrow();
        });

        it("[should fail] checks whether the value is a function", function () {
            expect(undefined).not.toThrow();
        });
    });

    describe("not.toThrow", function () {
        it("checks whether an exception is thrown", function () {
            expect(function () {
            }).not.toThrow();
        });
    });

});


describe("before and after", function () {

    var context;
    var afterCalled;

    beforeEach(function () {
        context = this;
        this.outer = true;
    });

    describe("nested cases", function () {

        beforeEach(function () {
            expect(this).toBe(context);
            this.inner = true;
        });

        it("benefits from both inner and outer before blocks", function () {
            expect(this.outer).toBe(true);
            expect(this.inner).toBe(true);
        });

        afterEach(function () {
            afterCalled = true;
        });

    });

    it("calls after block", function () {
        expect(afterCalled).toBe(true);
    });

    it("has a shared context", function () {
        expect(this).toBe(context);
    });

    it("only sees the outer before block", function () {
        expect(this.outer).toBe(true);
        expect(this.inner).toBe(void 0);
    });

    afterEach(function () {
        expect(this).toBe(context);
    });

});

describe("expectation extension", function () {

    var duck = {quack: function () {}};
    var fox = {say: function () {}};

    describe("in the scope of a description", function () {

        var Expectation = getCurrentSuite().Expectation;

        Expectation.prototype.toQuackLikeADuck = function () {
            this.assert(
                typeof this.value.quack === "function",
                ["expected", "[not] to quack like a duck"],
                [this.value]
            );
        };

        it("can use extensions to the suite's expectation type", function () {
            expect(duck).toQuackLikeADuck();
            expect(fox).not.toQuackLikeADuck();
        });

        describe("in a nested description", function () {
            it("the extension is inherited", function () {
                expect(duck).toQuackLikeADuck();
                expect(fox).not.toQuackLikeADuck();
            });
        });

    });

    it("but unavailable outside the scope of a description", function () {
        expect(function () {
            expect(duck).toQuackLikeADuck();
        }).toThrow();
    });

    describe("in the scope of another description", function () {

        var calledWith;
        function Expectation(value) {
            calledWith = value;
        }

        getCurrentSuite().Expectation = Expectation;

        it("can replace the expectation entirely", function () {
            var object = {};
            var expectation = expect(object);
            getCurrentReport().assert(calledWith, false, [
                "expected",
                "[not] to be"
            ], [
                calledWith,
                object
            ]);
            getCurrentReport().assert(expectation instanceof Expectation, false, [
                "expected",
                "[not] to be an instance of"
            ], [
                expectation,
                Expectation
            ]);
        });

    });

});

describe("expectables", function () {

    function Duck() {
    }

    Duck.prototype.expect = function (report) {
        return new DuckExpectation(this, report);
    };

    function DuckExpectation(value, report) {
        this.value = value;
        this.report = report;
    }

    DuckExpectation.prototype.toQuackLikeADuck = function () {
        this.report.assert(true, false, [
            "expect",
            "[not] to quack like a duck"
        ], [
            this.value
        ]);
    }

    it("can delegate to another object's expect method", function () {
        expect(new Duck()).toQuackLikeADuck();
    });

    it("is not tricked by obviously deviant expectables", function () {
        var Expectation = getCurrentSuite().Expectation;
        expect(expect({expect: 10}) instanceof DuckExpectation).toBeFalsy();
        expect(expect({expect: 10}) instanceof Expectation).toBeTruthy();
    });

});

describe("asynchronous tests", function () {

    var completed = false;

    it("accepts a promise", function () {
        return Q().delay(100)
        .then(function () {
            completed = true;
        });
    });

    it("can use a done function", function (done) {
        setTimeout(done, 100);
    });

    it("verifies that the promiese executed before this test", function () {
        expect(completed).toBe(true);
    });

    it("[should fail] expects the resolution of a promse to be undefined", function () {
        return Q(10);
    });

    it("[should fail] expects the promise ot be fulfilled", function () {
        return Q().then(function () {
            throw new Error("Should fail");
        });
    });

});

