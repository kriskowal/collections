"use strict";

module.exports = Iterator;

var iterate = require("@collections/iterate");
var Iteration = require("@collections/iterate/iteration");
var GenericCollection = require("@collections/generic-collection");

// upgrades an iterable to a Iterator
function Iterator(iterable, start, stop, step) {
  if (iterable == null) {
    return Iterator.empty;
  } else if (iterable instanceof Iterator) {
    return iterable;
  } else if (!(this instanceof Iterator)) {
    return new Iterator(iterable, start, stop, step);
  }
  this.iterator = iterate(iterable, start, stop, step);
}

// Selectively apply generic methods of GenericCollection
Iterator.prototype.forEach = GenericCollection.prototype.forEach;
Iterator.prototype.map = GenericCollection.prototype.map;
Iterator.prototype.filter = GenericCollection.prototype.filter;
Iterator.prototype.every = GenericCollection.prototype.every;
Iterator.prototype.some = GenericCollection.prototype.some;
Iterator.prototype.min = GenericCollection.prototype.min;
Iterator.prototype.max = GenericCollection.prototype.max;
Iterator.prototype.sum = GenericCollection.prototype.sum;
Iterator.prototype.average = GenericCollection.prototype.average;
Iterator.prototype.flatten = GenericCollection.prototype.flatten;
Iterator.prototype.zip = GenericCollection.prototype.zip;
Iterator.prototype.enumerate = GenericCollection.prototype.enumerate;
Iterator.prototype.sorted = GenericCollection.prototype.sorted;
Iterator.prototype.group = GenericCollection.prototype.group;
Iterator.prototype.reversed = GenericCollection.prototype.reversed;
Iterator.prototype.toArray = GenericCollection.prototype.toArray;
Iterator.prototype.toObject = GenericCollection.prototype.toObject;

// This is a bit of a cheat so flatten and such work with the generic reducible
Iterator.prototype.constructClone = function (values) {
  var clone = [];
  clone.addEach(values);
  return clone;
};

// A level of indirection so a full-interface iterator can proxy for a simple
// nextable iterator.
Iterator.prototype.next = function () {
  return this.iterator.next();
};

Iterator.prototype.iterateMap = function (callback /*, thisp*/) {
  var self = Iterator(this),
    thisp = arguments[1];
  return new MapIterator(self, callback, thisp);
};

function MapIterator(iterator, callback, thisp) {
  this.iterator = iterator;
  this.callback = callback;
  this.thisp = thisp;
}

MapIterator.prototype = Object.create(Iterator.prototype);
MapIterator.prototype.constructor = MapIterator;

MapIterator.prototype.next = function () {
  var iteration = this.iterator.next();
  if (iteration.done) {
    return iteration;
  } else {
    return new Iteration(
      this.callback.call(
        this.thisp,
        iteration.value,
        iteration.index,
        this.iteration
      ),
      false,
      iteration.index
    );
  }
};

Iterator.prototype.iterateFilter = function (callback /*, thisp*/) {
  var self = Iterator(this);
  var thisp = arguments[1];

  return new FilterIterator(self, callback, thisp);
};

function FilterIterator(iterator, callback, thisp) {
  this.iterator = iterator;
  this.callback = callback;
  this.thisp = thisp;
}

FilterIterator.prototype = Object.create(Iterator.prototype);
FilterIterator.prototype.constructor = FilterIterator;

FilterIterator.prototype.next = function () {
  var iteration;
  for (;;) {
    iteration = this.iterator.next();
    if (iteration.done || this.callback.call(
      this.thisp,
      iteration.value,
      iteration.index,
      this.iteration
    )) {
      return iteration;
    }
  }
};

Iterator.prototype.reduce = function (callback /*, initial, thisp*/) {
  var self = Iterator(this),
    result = arguments[1],
    thisp = arguments[2],
    iteration;

    // First iteration unrolled
  iteration = self.next();
  if (iteration.done) {
    if (arguments.length > 1) {
      return arguments[1];
    } else {
      throw TypeError("Reduce of empty iterator with no initial value");
    }
  } else if (arguments.length > 1) {
    result = callback.call(
      thisp,
      result,
      iteration.value,
      iteration.index,
      self
    );
  } else {
    result = iteration.value;
  }

    // Remaining entries
  for (;;) {
    iteration = self.next();
    if (iteration.done) {
      return result;
    } else {
      result = callback.call(
        thisp,
        result,
        iteration.value,
        iteration.index,
        self
      );
    }
  }
};

Iterator.prototype.dropWhile = function (callback /*, thisp */) {
  var self = Iterator(this),
    thisp = arguments[1],
    iteration;

  for (;;) {
    iteration = self.next();
    if (iteration.done) {
      return Iterator.empty;
    } else if (!callback.call(thisp, iteration.value, iteration.index, self)) {
      return new DropWhileIterator(iteration, self);
    }
  }
};

function DropWhileIterator(iteration, iterator) {
  this.iteration = iteration;
  this.iterator = iterator;
  this.parent = null;
}

DropWhileIterator.prototype = Object.create(Iterator.prototype);
DropWhileIterator.prototype.constructor = DropWhileIterator;

DropWhileIterator.prototype.next = function () {
  var result = this.iteration;
  if (result) {
    this.iteration = null;
    return result;
  } else {
    return this.iterator.next();
  }
};

Iterator.prototype.takeWhile = function (callback /*, thisp*/) {
  var self = Iterator(this),
    thisp = arguments[1];
  return new TakeWhileIterator(self, callback, thisp);
};

function TakeWhileIterator(iterator, callback, thisp) {
  this.iterator = iterator;
  this.callback = callback;
  this.thisp = thisp;
}

TakeWhileIterator.prototype = Object.create(Iterator.prototype);
TakeWhileIterator.prototype.constructor = TakeWhileIterator;

TakeWhileIterator.prototype.next = function () {
  var iteration = this.iterator.next();
  if (iteration.done) {
    return iteration;
  } else if (this.callback.call(
    this.thisp,
    iteration.value,
    iteration.index,
    this.iterator
  )) {
    return iteration;
  } else {
    return Iterator.done;
  }
};

Iterator.prototype.iterateZip = function () {
  return Iterator.unzip(Array.prototype.concat.apply(this, arguments));
};

Iterator.prototype.iterateUnzip = function () {
  return Iterator.unzip(this);
};

Iterator.prototype.iterateEnumerate = function (start) {
  return Iterator.count(start).iterateZip(this);
};

Iterator.prototype.iterateConcat = function () {
  return Iterator.flatten(Array.prototype.concat.apply(this, arguments));
};

Iterator.prototype.iterateFlatten = function () {
  return Iterator.flatten(this);
};

Iterator.prototype.recount = function (start) {
  return new RecountIterator(this, start);
};

function RecountIterator(iterator, start) {
  this.iterator = iterator;
  this.index = start || 0;
}

RecountIterator.prototype = Object.create(Iterator.prototype);
RecountIterator.prototype.constructor = RecountIterator;

RecountIterator.prototype.next = function () {
  var iteration = this.iterator.next();
  if (iteration.done) {
    return iteration;
  } else {
    return new Iteration(
      iteration.value,
      false,
      this.index++
    );
  }
};

Iterator.cycle = function (cycle, times) {
  if (arguments.length < 2) {
    times = Infinity;
  }
  return new CycleIterator(cycle, times);
};

function CycleIterator(cycle, times) {
  this.cycle = cycle;
  this.times = times;
  this.iterator = Iterator.empty;
}

CycleIterator.prototype = Object.create(Iterator.prototype);
CycleIterator.prototype.constructor = CycleIterator;

CycleIterator.prototype.next = function () {
  var iteration = this.iterator.next();
  if (iteration.done) {
    if (this.times > 0) {
      this.times--;
      this.iterator = new Iterator(this.cycle);
      return this.iterator.next();
    } else {
      return iteration;
    }
  } else {
    return iteration;
  }
};

Iterator.concat = function (/* ...iterators */) {
  return Iterator.flatten(Array.prototype.slice.call(arguments));
};

Iterator.flatten = function (iterators) {
  iterators = Iterator(iterators);
  return new ChainIterator(iterators);
};

function ChainIterator(iterators) {
  this.iterators = iterators;
  this.iterator = Iterator.empty;
}

ChainIterator.prototype = Object.create(Iterator.prototype);
ChainIterator.prototype.constructor = ChainIterator;

ChainIterator.prototype.next = function () {
  var iteration = this.iterator.next();
  if (iteration.done) {
    var iteratorIteration = this.iterators.next();
    if (iteratorIteration.done) {
      return Iterator.done;
    } else {
      this.iterator = new Iterator(iteratorIteration.value);
      return this.iterator.next();
    }
  } else {
    return iteration;
  }
};

Iterator.unzip = function (iterators) {
  var iterators = Iterator(iterators).map(Iterator);
  if (iterators.length === 0)
    return new Iterator.empty;
  return new UnzipIterator(iterators);
};

function UnzipIterator(iterators) {
  this.iterators = iterators;
  this.index = 0;
}

UnzipIterator.prototype = Object.create(Iterator.prototype);
UnzipIterator.prototype.constructor = UnzipIterator;

UnzipIterator.prototype.next = function () {
  var done = false;
  var result = this.iterators.map(function (iterator) {
    var iteration = iterator.next();
    if (iteration.done) {
      done = true;
    } else {
      return iteration.value;
    }
  });
  if (done) {
    return Iterator.done;
  } else {
    return new Iteration(result, false, this.index++);
  }
};

Iterator.zip = function () {
  return Iterator.unzip(Array.prototype.slice.call(arguments));
};

Iterator.range = function (start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
  }
  if (arguments.length < 2) {
    stop = start;
    start = 0;
  }
  start = start || 0;
  step = step || 1;
  return new RangeIterator(start, stop, step);
};

Iterator.count = function (start, step) {
  return Iterator.range(start, Infinity, step);
};

function RangeIterator(start, stop, step) {
  this.start = start;
  this.stop = stop;
  this.step = step;
  this.index = 0;
}

RangeIterator.prototype = Object.create(Iterator.prototype);
RangeIterator.prototype.constructor = RangeIterator;

RangeIterator.prototype.next = function () {
  if (this.start >= this.stop) {
    return Iterator.done;
  } else {
    var result = this.start;
    this.start += this.step;
    return new Iteration(result, false, this.index++);
  }
};

Iterator.repeat = function (value, times) {
  if (times == null) {
    times = Infinity;
  }
  return new RepeatIterator(value, times);
};

function RepeatIterator(value, times) {
  this.value = value;
  this.times = times;
  this.index = 0;
}

RepeatIterator.prototype = Object.create(Iterator.prototype);
RepeatIterator.prototype.constructor = RepeatIterator;

RepeatIterator.prototype.next = function () {
  if (this.index < this.times) {
    return new Iteration(this.value, false, this.index++);
  } else {
    return Iterator.done;
  }
};

Iterator.enumerate = function (values, start) {
  return Iterator.count(start).iterateZip(new Iterator(values));
};

function EmptyIterator() {
}

EmptyIterator.prototype = Object.create(Iterator.prototype);
EmptyIterator.prototype.constructor = EmptyIterator;

EmptyIterator.prototype.next = function () {
  return Iterator.done;
};

Iterator.Iteration = Iteration;
Iterator.empty = new EmptyIterator();
Iterator.done = Iteration.done;
