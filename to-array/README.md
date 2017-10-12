# toArray

This JavaScript package exports a toArray operator that accepts various types
and coerces them into arrays.

-   Falsy values are coerced to an empty array.
-   Delegates to the `toArray` method of collections that implement that method.
-   Delegates to the `forEach` method of other collections that implement that
    method.
-   Objects that have a length and numbered properties are coerced into an
    array.
    Note that passing `arguments` as an argument to toArray will probably
    deoptimize the calling function.
    However, arrayify defends itself from being deoptimized in this fashion by
    iterating the given object itself.
-   Throws an exception for all other cases.

## Examples

Install

```
npm install @collections/to-array
```

Import the @collections/to-array module.

```js
"use strict";
var toArray = require("@collections/to-array");
```

Copies arrays.

```js
var array = [1, 2, 3];
var arrayed = toArray(array);
expect(arrayed).not.toBe(array);
expect(arrayed).toEqual(array);
```

Copies objects that implement `toArray`.

```js
var List = require("collections/list");
var list = new List([1, 2, 3]);
expect(toArray(list)).toEqual([1, 2, 3]);
```

Copies objects that implement (synchronous) `forEach`.

```js
expect(toArray({
    forEach: function (callback, thisp) {
        callback.call(thisp, 1);
        callback.call(thisp, 2);
        callback.call(thisp, 3);
    }
})).toEqual([1, 2, 3]);
```

Coerces array-like objects:

```js
expect(toArray({
    length: 3,
    0: 1,
    1: 2,
    2: 3
})).toEqual([1, 2, 3]);
```

Coerces falsy values to empty arrays.

```js
expect(toArray(null)).toEqual([]);
```

Supports no other cases.

```js
expect(function () {
    toArray({});
}).toThrow();
```

## Polymorphic operator

A well-planned system of objects is beautiful: a system where every meaningful
method for an object has been anticipated in the design.
Inevitably, another layer of architecture introduces a new concept and with it
the temptation to monkey-patch, dunk-punch, or otherwise cover-up the omission.
But reaching backward in time, up through the layers of architecture doesn't
always compose well, when different levels introduce concepts of the same name
but distinct behavior.

A polymorphic operator is a function that accepts as its first argument an
object and varies its behavior depending on its type.
Such an operator has the benefit of covering for the types from higher layers of
architecture, but defers to the eponymous method name of types yet to be
defined.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## Copyright and License

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License.
