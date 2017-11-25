## Hash

Hash is a function that will consistently return the same, almost unique value
for any given value, particularly objects.
Hashing is suitable for grouping objects into buckets with a low probability of
multiple non-identical values sharing the same bucket.

```
npm install @collections/hash
```

```js
var hash = require("@collections/hash");
hash([])
hash({})
hash(1)
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

```js
hash({
    hash: function () {
        return JSON.stringify(this);
    }
})
```

## Implementation

The implementation uses a WeakMap or a WeakMap shim to assign and recall
a randomly generated number to every object it encounters.
Hash methods in general may return either strings or numbers, since either is
suitable for use as a key in a plain object.
Non object values pass through hash.

The Node.js implementation once took advantage of Aleksey Smolenchuck's
`objhash` module, which uses V8's own internal object hash function, but
but the binary dependency proved a burden to maintain.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
