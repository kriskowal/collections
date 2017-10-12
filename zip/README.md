
# Zip and Unzip Transposition

This package provides zip, unzip, and "polymorphic" versions of these operators.

```
npm install @collections/zip
```

Zip is a function that accepts any number of arrays and returns an array of the
respective values from each of the given arrays.

```js
var unzip = require("pop-zip/zip");
expect(zip(
    ['a', 'b', 'c'],
    [1, 2, 3],
    ['x', 'y', 'z']
)).toEqual([
    ['a', 1, 'x'],
    ['b', 2, 'y'],
    ['c', 3, 'z']
]);
```

Unzip is identical but accepts an array of arrays.
Unzip is behaviorally identical to a matrix transpose for matricies modeled as
nested arrays.

```js
var unzip = require("pop-zip/unzip");
expect(unzip(
    ['a', 'b', 'c'],
    [1, 2, 3],
    ['x', 'y', 'z']
)).toEqual([
    ['a', 1, 'x'],
    ['b', 2, 'y'],
    ['c', 3, 'z']
]);
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

This package also exports polymorphic versions of zip and unzip, on the
off-chance you may be working with an array or some more sophisticated
collection.

```js
var zip = require("pop-zip");
var unzip = require("pop-zip/pop-unzip";
```

Other collection objects are expected to implement `toArray`, and both zip and
unzip will use these methods to funnel the resulting object array of arrays into
the non-polymorphic unzip.

## Alternatives

The [array-zip] package is similar, but focuses on an implementation of `zip`
alone, not based on unzip, but uses a straight-forward approach using functional
idioms, but suffers from a V8 deoptimization (on passing arguments objects) and
some garbage collector churn of throw-away closures.

[array-zip]: https://github.com/frozzare/array-zip/blob/d21aed6b21de6aea880de526d5dd4e23dc1ebbe0/lib/array-zip.js

The [transpose][] package is similar, focusing on an implementation of `unzip`,
but only works for strictly rectangular arrays of arrays.
This implementation of `unzip` scans forward for the longest nested array in
order to determine the length of the whole array, and builds the transpose in
row major order instead of column major.

[transpose]: https://github.com/ttrfstud/transpose/blob/7b63bd6a894de59ac5fb93fc018ffbc32ba57abf/index.js

Most other alternatives bundle unzip into a larger collection of functions,
chainable methods, or monkey patches on Array.
This package is released in the spirit of small modules, coherent with
other polymorphic operator packages.

[pop]: https://github.com/search?utf8=%E2%9C%93&q=user%3Akriskowal+pop-&type=Repositories&ref=searchresults

## License and Copyright

Copyright (c) 2015 by Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License.

