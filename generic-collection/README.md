# GenericCollection

The GenericCollection is an abstract implementation of many common methods of
collections.

The generic collection's methods depend on the implementation to provide
`constructClone`, `reduce`, `add`, `delete`, and `one` methods; and optionally
a `contentCompare` method for ordered collections.
From these methods, the generic collection derrives, `addEach`, `deleteEach`,
`forEach`, `map`, `filter`, `enumerate`, `group`, `every`, `some`, `toArray`,
`toObject`, `min`, `max`, `sum`, `average`, `concat`, `flatten`, `zip`, `join`,
`sorted`, `reversed`, `clone`, and `only`.

```
npm install @collections/generic-collection
```

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
