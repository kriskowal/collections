# Copy

Copy is a mico-utility that copies owned properties from one object to another.

```js
function copy(target, source) {
    for (var name in source) {
        if (hasOwnProperty.call(source, name)) {
            target[name] = source[name];
        }
    }
}
```

```
npm install @collections/copy
```

The @collections suite uses the copy method to mix generic prototypes.

```js
var copy = require("@collections/copy");
var GenericMap = require("@collections/generic-map");

function Map() {}

copy(Map.prototype, GenericMap.prototype);
```

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2017 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
