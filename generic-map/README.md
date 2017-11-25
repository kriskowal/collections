# GenericMap

The GenericMap is an abstract implementation of many common methods of maps
that are backed by a set.
The map is a set of {key, value} items, each hashed and compared by only the
item's key.

The generic map depends on the implementation to provide a `store` property,
which must implement the `get`, `add`, `delete`, `has`, `clear`, `reduce`, and
`reduceRight` methods expected of any set implementation.

With these methods, the generic map provides implementations of `addEach`,
`get`, `set`, `add`, `has`, `delete`, `clear`, `iterate`, `reduce`,
`reduceRight`, `keys`, `values`, `entries`, and `equals`.

The `Item` type captures `key` and `value`, and provides `equals` and `compare`
methods, suitable for storage in a Set.

Map implementations can override the `getDefault` method, altering the behavior
of `get` when keys are absent.

The map implementation must also provide the ObservableMap methods.  Any
generic map is also observable.
All mutation methods incidentally dispatch map change notifications if there
are any map observers.

```
npm install @collections/generic-set
```

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
