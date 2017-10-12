# Set

Set is a collection of unique values, in order of least to most recently
inserted equivalent value.

```
npm install @collections/set
```

The Set uses a List of values to track the order of insertion, and a
FastSet to index nodes of the list.

You can override the set’s `hash` and `equals` operators for alternate
indexing.
Favor the native implementation of Set if you do not need the extended
collection.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License

