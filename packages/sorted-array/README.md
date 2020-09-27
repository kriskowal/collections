# SortedArray

SortedArray is an sorted collecion of values, ordered by a comparator.
The sorted array stores values in an underlying array and uses a binary search
and ranged copies ([swap](../swap)) to shift values for insertion and removal.

```
npm install @collections/sorted-array
```

A sorted array can contain duplicates or equivalent values.
Use a SortedSet or SortedArraySet to enforce unique values.

**Stability.**
Equivalent values will be inserted at the end of the range of quivalent values,
and removing by value will take the first value of a range of equivalent
values.

**Observability.**
The SortedArray mutates its underlying `array` object using observable methods.
Observing property, map, or ranged changes on the underlying `array` will work
fine.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
