# SortedArrayMap

SortedArrayMap is a sorted collection of {key, value} entries, ordered by a key
comparator.
The SortedArrayMap in turn uses a SortedArraySet.

```
npm install @collections/sorted-array-set
```

**Performance.**
Owing to the compact allocation of arrays, a SortedArrayMap will perform faster
than a SortedMap for maps of less than about 500 entries.

**Observability.**
Since the SortedArrayMap contains a SortedArraySet (`store`) and the
SortedArraySet inherits SortedArray, it mutates the underlying `array` property
using observable methods.
Observing range, map, and property changes on that array will work normally,
observing the coming and going of the map `Entry` objects.

**Configurability.**
Provide an alternate `equals`, `compare`, and `getDefault` to alter the
behavior of the map.
The `equals` operator determines equivalence and `compare` determines order.
The `compare` operator may return zero for both equivalent and incomparable
values. `getDefault` determines the behavior of `get` given an absent key.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
