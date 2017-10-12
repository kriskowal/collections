# TreeLog

TreeLog provides default character tables for ASCII or Unicode representations
of trees.

```
npm install @collections/tree-log
```

## Demo

This illustrates how the SortedSet collection uses TreeLog tables to log a tree
of its internal structure.

```js
var SortedSet = require("@collections/sorted-set");
var set = new SortedSet([3, 1, 4, 2]);
set.log();
```

```
╭━━ 1
╋ 2
╰━┳ 3
  ╰━━ 4
```

```js
var SortedSet = require("@collections/sorted-set");
var TreeLog = require("@collections/tree-log");
var set = new SortedSet([3, 1, 4, 2]);
set.log(TreeLog.ascii);
```

```
 .-- 1
+ 2
'-+ 3
  '-- 4
```

```js
var SortedSet = require("@collections/sorted-set");
var TreeLog = require("@collections/tree-log");
var set = new SortedSet([3, 1, 4, 2]);
set.log(TreeLog.unicodeSharp);
```

```
┏━━ 1
╋ 2
┗━┳ 3
  ┗━━ 4
```

## Collections

This package is part of the [collections][] project, one of many maintained in
its shared repository.

[collections]: https://github.com/kriskowal/collections

## License and Copyright

Copyright (c) 2015 Kristopher Michael Kowal and contributors.
All rights reserved.
MIT License
