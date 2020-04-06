'use strict';

/* eslint-disable func-names, no-multi-assign */

const predicate = module.exports;
const slice = Array.prototype.slice;

// Useful for debuging curried functions
const setSrc = function (curried, src) {
  /* eslint-disable no-param-reassign */
  curried.toString = () => src.toString();
  curried.src = src;
  /* eslint-enable no-param-reassign */
  return curried;
};

// Curry's fn's with arity 2
const curry = (predicate.curry = function (f) {
  return setSrc(function curried(a, b) {
    if (!arguments.length) {
      throw new TypeError('Function called with no arguments');
    }
    return arguments.length === 1 ? setSrc((c) => f(a, c), f) : f(a, b);
  }, f);
});

predicate.partial = function (fn) {
  const args = slice.call(arguments, 1);
  return function () {
    return fn.apply(null, args.concat(slice.call(arguments)));
  };
};

predicate.complement = predicate.invert = function (pred) {
  return function () {
    const ret = pred.apply(null, arguments);
    // Handle curried fns
    if (typeof ret === 'function') return predicate.complement(ret);
    return !ret;
  };
};

predicate.mod = curry(function (a, b) {
  return a % b;
});

predicate.assign = curry(Object.assign);

predicate.identity = function (v) {
  return v;
};

predicate.toBoolFn = curry(function (fn, v) {
  return !!fn(v);
});
