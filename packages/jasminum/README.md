
# Jasminum

[![Release Compatibility Matrix](https://s3-us-west-2.amazonaws.com/jasminum/v2/saucelabs-matrix.svg)](https://saucelabs.com/u/kriskowal-jasminum)

> *“Jasmine (taxonomic name Jasminum /ˈdʒæzmɨnəm/) is a genus of shrubs and
> vines in the olive family (Oleaceae)”*
> &mdash;&nbsp;[Wikipedia](http://en.wikipedia.org/wiki/Jasmine)

Jasminum is a JavaScript testing scaffold. Jasminum is designed to accept
[Jasmine 1.3][] “specs” with very little modification. However, it has a minimal
but modular and extensible core, supports and uses promises for asynchronous
tests, and has an “isomorphic” API, meaning Jasminum tests can be run without
modification between Node.js and browsers using CommonJS module loaders
including [Browserify][], [Mr][], or [Mop][].

[Jasmine 1.3]: http://pivotal.github.io/jasmine/
[Browserify]: https://github.com/substack/node-browserify 
[Mr]: https://github.com/montagejs/mr
[Mop]: https://github.com/montagejs/mop

Jasminum is built for debugging and isolation, not merely a regression
trip-wire. Instead of trying to patch the universe so that all context gets
funneled into pretty reports, Jasminum reports to the console. You do not need
to isolate which test was running when that message got dumped to the console.
Jasminum includes reporters for Node.js, PhantomJS, and browser based tests. The
reporter only highlights lines of interest. It highlights the spec in stack
traces. The test summary only shows green if all tests pass. The test summary
only shows red if any tests fail. The test summary only highlights skipped tests
if there were any.

First, write a test.

```js
// test/my-test.js
describe("my library", function () {
    it("should work", function () {
        expect(10).toBeLessThan(20);
    });
});
```

You can install the `jasminum` command using `npm`. I recommend installing
Jasminum in your project so the version gets saved in your `package.json` and so
you can use different versions in your various projects.

```
❯ npm install jasminum --save-dev
```

Or, if necessary, install globally.

```
❯ [sudo] npm install jasminum -g
```

Use `jasminum` to run your test. `jasminum` will run all test files specified,
or all `*-test.js` and `*-spec.js` files within each specified directory.

```
❯ jasminum test
1 tests passed
1 assertions passed
0 tests failed
0 assertions failed
0 errors
0 tests skipped
```

The results will be colored to draw your attention either to passed, failed, or
skipped tests depending on the situation. You can use `iit` and `ddescribe` to
focus on certain tests, skipping all others. You can use `xit` and `xdescribe`
to skip certain tests.

You can use the `-f` command line flag to only show information about failed
tests. Because the test runner does not know whether to show the name of the
test until it fails, test names, and all of their parent suite names, will be
logged *after* the test fails instead of before. Arrows draw your attention to
this nuance.

With [PhantomJS] installed, Jasminum can run the same tests in the PhantomJS
headless browser. The interface and reports are identical.

```
❯ jasminum-phantom test
1 tests passed
1 assertions passed
0 tests failed
0 assertions failed
0 errors
0 tests skipped
```

[PhantomJS]: http://phantomjs.org/

You can create an “isomorphic” test runner that you can use to run tests in
Node.js directly, or using a browser module loader, or to measure test coverage.

```js
// test/index.js
var Suite = require("jasminum");
new Suite("my tests").describe(function () {
    require("./my-test");
}).runAndReport().done();
```

Jasminum can be installed with `npm`. Make sure you have a `package.json`; `npm
init` will walk you through that.

Add Jasminum to your package with `npm install jasminum --save-dev` and create a
test script so that it will run with `npm test`.

```json
{
    "devDependencies": {
        "jasminum": "~1.0"
    },
    "scripts": {
        "test": "node test/index.js"
    }
}
```

Now, `npm test` will run your tests.

To run the same tests in a web browser, use `npm install mr@~0.13.3 --save-dev`
and use the following HTML test scaffold.

```html
<!-- test/index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css"
            href="../node_modules/jasminum/jasminum.css">
        <script
            src="../node_modules/mr/bootstrap.js" data-package=".."
            data-module="test/index"></script>
    </head>
    <body>
    </body>
</html>
```

The page under test will be blank. You can use this space as a stage for your
tests. The test runner reports directly to your web inspector console. It will
change the background color to grey while tests are running, red when the first
test fails, or green if all tests complete without any failures.

To get test coverage measurements, use `npm install istanbul@~0.2.4 --save-dev`
and `npm install opener --save-dev` and add a script to your `package.json`.
This will cause `npm run cover` to run coverage and display the results.

```json
{
    "devDependencies": {
        "jasminum": "~1.0",
        "mr": "~0.13.3",
        "istanbul": "~0.2.4",
        "opener": "*"
    },
    "scripts": {
        "test": "jasminum test",
        "test:phantom": "jasminum-phantom test",
        "cover": "istanbul cover test/index.js && istanbul report html && opener coverage/index.html"
    }
}
```

## Promissory

Jasminum supports asynchronous tests that either use a `done` callback or
*return* a promise.

```js
describe("an asynchronous task", function () {
    it("waits for one second using done", function (done) {
        setTimeout(done, 1000);
    });
    it("waits for one second using a promise", function () {
        return Q().delay(1000);
    });
});
```

If a test returns a promise, it is expected to be fulfilled with `undefined`.

Jasminum does not support `runs` or `waitsFor`.

## Modular

At time of writing, Jasminum weighs less than a KLOC. This is largely because 
it delegates large responsibilities to [Montage Collections][] and the [Q][]
promise library.

[Montage Collections]: https://github.com/montagejs/collections
[Q]: https://github.com/kriskowal/q

Jasminum is loosely coupled to Q. You can substitute any promise library that
supports a `Promise` constructor and a `Promise.resolve` method, per
ECMAScript 6. Create a constructor that inherits from Jasminum’s `Suite` and
override its `Promise` property, or just pass `Promise` as an option to
`suite.runAndReport(options)`.

Several small libaries establish foundations that Jasminum employs for
comparing values, particularly polymorphic `pop-equals`, `pop-compare`,
and `pop-has` operators, as well as the non-polymorphic `is` operator.
These do not behave exactly the same way as Jasmine, but are designed with
extensibility in mind both within and beyond testing. Partcularly, “any” objects
simply override their “equals” method to recognize any object of the same type
as equivalent.

## “Isomorphic”

> *“The scare quotes will come off when I say they come off.”*
> &mdash;&nbsp;[Math](http://en.wikipedia.org/wiki/Isomorphism)

Jasminum supports an “isomorphic” test runner. The following test can be run in
Node.js with `node test/index.js`

```js
// test/index.js
var Suite = require("jasminum");
var suite = new Suite("Q").describe(function () {
    require("./q");
    require("./eta");
    require("./traces");
    require("./never-again");
    require("./node");
    require("./queue");
});
suite.runAndReport().done();
```

It can also be run with [Mr][] with no modification.

```html
<!-- test/index.html -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css"
            href="../node_modules/jasminum/jasminum.css">
        <script
            src="../node_modules/mr/boot.js" data-package=".."
            data-module="test/index"></script>
    </head>
    <body>
    </body>
</html>
```

## Debuggable

The default test reporter for Node.js and for browsers are designed with
debugging in mind. Either way, all results are reported to the console as they
are executed. The scaffold logs messages between tests to assist in isolating
problems. Jasminum does not use clever techniques to capture or interfere with
standard output and console messages. In the browser, the inspected window is
left as a stage for the application under test and the test runner will only
fiddle with the `testing`, `pass`, and `fail` classes of the `body` element.

In addition to `describe` and `it, Jasmine and Jasminum both support `xdescribe`
and `xit` to quickly or temporarily disable a test. In addition, Jasminum
[supports][iidd] `ddescribe` and `iit` that will cause the test runner to focus
on the annotated suites or tests.

[iidd]: https://github.com/pivotal/jasmine/pull/181

## Light

Jasminum only runs in CommonJS module loaders.

Jasminum will not include a mock clock. Please seek refuge in `npm`.

Jasminum does not attempt to capture errors in the “domain” of a test. Promises
will usually funnel exceptions into the test scaffold, but if you throw an error
from a timeout event, or any other kind of event, Jasminum will stop exactly
where the problem occurred.

Jasminum does not redirect standard IO or console messages to the test reporter.
Jasminum instead elects to direct its reports to the console and standard IO so
that it interleaves the chronology of your program.

Jasminum only provides reporters for Node.js and console browsing.

Jasminum does not automatically run tests whenever tests or their dependencies
change, but such a contraption is easy to imagine based on the dependency graph
that [Mr][] can produce.

Jasminum provides Jasmine 1.3 spies to ease migration. However, please migrate
to an external spy package like [Sinon][] for spies. Jasmine spies will be
removed in a future release.

[Sinon]: http://sinonjs.org/

## Extensible

Jasminum compensates for its minimalism with extensibility.

By way of background, the DSL provides a few extra methods. `getCurrentSuite`
returns the suite instance for the containing `describe` block, both at
declaration time and at test time. `getCurrentTest` returns the current test
instances at test time, and `getCurrentReport` returns the current report at
test time. There is no current test or report at declaration time.

Jasminum also supports corresponding `set` methods, but these are intended only
for the use of the test runner.

### Expectations

Jasminum expectations can be extended in a variety of ways.

The current suite will always have an `Expectation` property, that the suite
will use to construct expectation instances when the test calls `expect`. Each
nested suite, in a `describe` block, will have a prototypically inherited child
of the parent `Expectation` constructor to isolate any extensions to the
expectation.

The simplest is to provide overrides for existing expectation methods. Any
object can implement `equals` or `compare`, which will affect the behavior of
`toEqual`, `toBeLessThan`, `toBeGreaterThan`, `toBeNear` and `toBeCloseTo`.
Look into [Montage Collections][] for details about these generic methods.

You can create custom expectation constructors. The Jasminum `Expecatation`
constructor provides an `assert` method that makes most expectations
implementable with a single call to this utility method. It handles the case
where the expectation has been negated and gives the reporter great flexibility
in rendering the involved objects and negating the messages.

```js
function FunnyExpectation(value, report) {
    Expectation.call(this, value, report);
    // Also sets up the .not.isNot = true, .not.not = this stuff
};

FunnyExpectation.prototype = Object.create(Expectation.prototype);
FunnyExpectation.prototype.constructor = FunnyExpectation;

FunnyExpectation.prototype.toBeFunny = function () {
    var isFunny = this.value.isFunny();
    this.assert(isFunny, ["expected", "[not] to be funny"], [this.value]);
};
```

Any value can implement `expect(report)` and return a custom expectation for
that object. `expect(value)` will delegate to `value.expect(getCurrentReport())`
and return your custom expectation object. This is best illustrated by the `spy`
and `spy-expectation` modules which use this facility to provide special methods
for spies.

```js
function Clown(funny, scary) {
    this.funny = funny;
    this.scary = scary;
}

Clown.prototype.expect = function (report) {
    return new FunnyExpectation(this, report);
};
```

Also, every suite has a specialized copy of the `Expectation` type from its
parent suite. Methods can be added to the `Expectation.prototype` or the
`Expectation` constructor can be replaced outright and the change will only
apply in the current scope.

```js
var Expectation = require("jasminum/expectation");
describe("funny objects", function () {

    getCurrentSuite().Expectation = FunnyExpecation;

    it("are funny", function () {
        expect(new ClownShoes()).toBeFunny();
        expect(new Clown()).not.toBeFunny();
    });

});
```

### Reporter

Jasminum provides a console reporter that is suitable for tests run by Node.js,
or tests run through PhantomJS and forwarded to the Node.js console. It also
provides a reporter suitable for running tests in an arbitrary browser,
reporting results to the browser console.

However, tests can be run with an arbitrary reporter. The Suite `runAndReport`
and `runAndReportSync` methods both accept an `options` object which may include
either a `report` or `Reporter` constructor. If neither are provided, it falls
back to calling the `Reporter` on its prototype chain, so Suites can be extended
to have an alternate default reporter. The Suite shares the run-and-report
`options` with the reporter constructor.

The Reporter must implement:

-   `start(test) -> reporter`: returns a nested reporter instance for the given
    test.
-   `end(test)`: concludes a test. This is a good point to check whether any
    assertions have failed and to calculate and propagate the test’s statistics.
-   `skip(test)`: notes that the test has been skipped. `end` will still be
    called.
-   `error(error, test)`: notes that an error was thrown while running the test,
    albeit in a promise handler. `end` will still be called.
-   `assert(guard, isNot, messages, objects)`: reports on an assertion.

The guard may be a truthy or falsy value, but will be either exactly `true` or
`false`. `isNot` indicates that the assertion is negative, so the `guard` has
the opposite meaning, and if any of the `messages` contain the phrase `"
[not]"`, these must be replaced with `" not"`. Otherwise, these phrases must be
replaced with an empty string. The objects are intended to be interleaved after
the corresponding message and there may be more messages than objects, or more
objects than messages.

The Reporter *may* implement:

-   `enter()`
-   `exit(exiting)`

The suite runner will call `enter` once before running tests, and `exit` once
after running all tests. If the tests are exiting prematurely, the `exiting`
flag will be true, in which case, it would be innapropriate to call
`process.exit` because doing so would prevent Node.js from printing an uncaught
exception to the console.

### Suite, Test

The `Suite` constructor can be extended. The `Suite` is not hard-coded to use
the basic `Test`, `Expectation`, and `Reporter` constructors. Specialized
expectations and tests can be overridden on the `Suite.prototype`.

Jasminum provides a `reporter` module with an alternate `browser-reporter`
implementation that will be used in place of `reporter` automatically if it is
loaded by Browserify, Mr, or Mop.

