# SortedArraySet

SortedArraySet is a sorted collection of unique values, ordered by a comparator.
The SortedArraySet in turn uses a SortedArray, but enforces uniqueness with its
mutation methods.

```
npm install @collections/sorted-array-set
```

**Performance.**
Owing to the compact allocation of arrays, a SortedArraySet will perform faster
than a SortedSet for collections of less than about 500 values.

**Configurability.**
Provide an alternate `equals` and `compare` to alter the behavior of the set.
The `equals` operator determines equivalence and `compare` determines order.
The `compare` operator may return zero for both equivalent and incomparable
values.

**Observability.**
Since the SortedArraySet inherits SortedArray, it mutates the underlying
`array` property using observable methods.
Observing range, map, and property changes on that array will work normally.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
