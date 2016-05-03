'use strict';
const predicate = module.exports;
const _slice = Array.prototype.slice;

// Useful for debuging curried functions
const setSrc = (curried, src) => {
  curried.toString = () => src.toString();
  curried.src = src;
  return curried;
};

// Curry's fn's with arity 2
const curry = predicate.curry = (f) => {
  return setSrc(function curried(a, b) {
    switch (arguments.length) {
      case 0: throw new TypeError('Function called with no arguments');
      case 1: return setSrc((b) => f(a, b), f);
    }

    return f(a, b);
  }, f);
};

// TODO: es6ing this breaks!
predicate.partial = function (fn) {
  const args = _slice.call(arguments, 1);
  return function() {
    return fn.apply(null, args.concat(_slice.call(arguments)));
  };
};

predicate.complement = predicate.invert = (pred) => {
  // TODO: es6ing this breaks!
  return function () {
    const ret = pred.apply(null, arguments);
    // Handle curried fns
    if (typeof ret === 'function') return predicate.complement(ret);
    return !ret;
  };
};

predicate.mod = curry((a, b) => {
  return a % b;
});

// assign b's props to a
predicate.assign = curry((a, b) => {
  // use crummy for/in for perf purposes
  for (let prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop];
    }
  }

  return a;
});
