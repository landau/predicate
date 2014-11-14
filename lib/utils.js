'use strict';
var is = module.exports;
var _slice = Array.prototype.slice;

// Useful for debuging curried functions
function setSrc(curried, src) {
  curried.toString = function() {
    return src.toString();
  };
  curried.src = src;
  return curried;
}

// Curry's fn's with arity 2
var curry = is.curry = function(f) {
  return setSrc(function curried(a, b) {
    switch (arguments.length) {
      case 0: throw new TypeError('Function called with no arguments');
      case 1:
        return setSrc(function curried(b) {
          return f(a, b);
        }, f);
    }

    return f(a, b);
  }, f);
};

is.partial = function (fn) {
  var args = _slice.call(arguments, 1);
  return function() {
    return fn.apply(null, args.concat(_slice.call(arguments)));
  };
};

is.complement = is.invert = function (pred) {
  return function () {
    var ret = pred.apply(null, arguments);
    // Handle curried fns
    if (typeof ret === 'function') return is.complement(ret);
    return !ret;
  };
};

is.mod = curry(function (a, b) {
  return a % b;
});

// assign b's props to a
is.assign = curry(function(a, b) {
  // use crummy for/in for perf purposes
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop];
    }
  }

  return a;
});

