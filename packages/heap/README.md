# Heap

A heap provides fast access to the highest value it contains.
Adding and removing values takes time proportional to the logarithm of its
size.
A heap is not totally ordered and is backed by a binary search tree laid out in
an array.

```
npm install @collections/heap
```

The heap is a max heap by default. Inverting the comparator produces a min heap.

```js
var heap = new Heap([], equals, compose(compare, neg));
```

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
