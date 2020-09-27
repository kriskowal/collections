# Map

Map is a collection of {key, value} entries indexed by key, iterated in order of
least to most recently added key.

```
npm install @collections/map
```

The map uses a Set of {key, value} entries, indexed by key.
The Set, in turn, uses a List of entries to track the order of insertion, and a
FastSet to index nodes of the list.

**Configurability.**
You can override the map’s `hash`, `equals`, and `getDefault` operators for
alternate indexing.
Favor the native implementation of Map if you do not need the extended
collection.

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
