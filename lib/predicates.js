'use strict';

const utils = require('./utils');
const other = require('./other');
const and = other.and;
const or = other.or;
const predicate = module.exports;

const curry = utils.curry;

if (Object.is) {
  predicate.is = curry(Object.is);
} else {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  predicate.is = curry(function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  });
}

predicate.exists = function(val) {
  return val != null;
};

predicate.truthy = utils.toBoolFn(and(utils.identity, predicate.exists));
predicate.falsey = utils.complement(predicate.truthy);

//---- value comparision methods

predicate.equal = curry(function(a, b) {
  return a === b;
});

predicate.eq = curry(function(a, b) {
  return a == b;
});

predicate.null = predicate.equal(null);
predicate.undef = predicate.equal(undefined);

predicate.lt = predicate.less = curry(function(a, b) {
  return a < b;
});

predicate.ltEq =
  predicate.le =
  predicate.lessEq = curry(or(predicate.equal, predicate.less));

predicate.gt = predicate.greater = curry(function(a, b) {
  return a > b;
});

/**
* Returns the result of a >= b
*
* @param {*} a -
* @param {*} b -
* @return {boolean} - The result of a >= b
*/
predicate.gtEq =
  predicate.ge =
  predicate.greaterEq = curry(or(predicate.equal, predicate.greater));

// --- Type checking predicates

// Forces objects toString called returned as [object Object] for instance
const __toString = Object.prototype.toString;
const eqToStr = curry(function(str, val) {
  return predicate.equal(str, __toString.call(val));
});

//---- Object type checks

predicate.object = predicate.obj = function(val) {
  return val === Object(val);
};

predicate.array = predicate.arr = Array.isArray || eqToStr('[object Array]');
predicate.date = eqToStr('[object Date]');
predicate.regex =
  predicate.regexp =
  predicate.rgx =
  predicate.RegExp = eqToStr('[object RegExp]');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
predicate.finite = Number.isFinite || and(predicate.number, isFinite);

predicate.nan = predicate.NaN = predicate.is(NaN);

predicate.instance = curry(function(Cls, inst) {
  return inst instanceof Cls;
});

predicate.arguments = eqToStr('[object Arguments]');
predicate.error = predicate.instance(Error);

// creates fns for predicate.string, etc
const typeofBuilder = curry(function(type, val) {
  return predicate.equal(type, typeof val);
});

//--- Create typeof methods

// type of string and alias name
// predicate.fn, predicate.num, etc
[
  ['function', 'fn'],
  ['string', 'str'],
  ['boolean', 'bool']
].reduce(function(predicate, type) {
  predicate[type[0]] = predicate[type[1]] = typeofBuilder(type[0]);
  return predicate;
}, predicate);

predicate.number = predicate.num = function(val) {
  return typeof val === 'number' && predicate.not.NaN(val);
};

predicate.int = function(val) {
  return predicate.num(val) && predicate.zero(utils.mod(val, 1));
};

predicate.pos = and(predicate.num, predicate.greater(0));
predicate.neg = and(predicate.num, predicate.less(0));
predicate.zero = and(predicate.num, predicate.equal(0));

predicate.even = function(val) {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.zero(utils.mod(val, 2));
};

predicate.odd = function(val) {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.not.zero(utils.mod(val, 2));
};

predicate.contains = predicate.includes = curry(function(arrOrString, val) {
  if (and(predicate.not.array, predicate.not.string)(arrOrString)) {
    throw new TypeError('Expected an array or string');
  }

  if (predicate.string(arrOrString) && !predicate.string(val)) {
    return false;
  }

  if (predicate.NaN(val)) {
    return arrOrString.some(predicate.NaN);
  }

  return arrOrString.indexOf(val) !== -1;
});

const __has = Object.prototype.hasOwnProperty;
predicate.has = curry(function(o, key) {
  return __has.call(o, key);
});

predicate.empty = function(o) {
  if (predicate.not.exists(o)) {
    return true;
  }

  if (or(predicate.arr, predicate.str)(o)) {
    return !o.length;
  }

  if (predicate.obj(o)) {
    for (const k in o) {
      if (predicate.has(o, k)) {
        return false;
      }
    }

    return true;
  }

  throw new TypeError();
};

predicate.primitive = or(
  predicate.string, predicate.num, predicate.bool,
  predicate.null, predicate.undef, predicate.NaN
);

predicate.matches = curry(function(rgx, val) {
  return rgx.test(val);
});

// Assign inverse of each predicate
predicate.not = Object.keys(predicate).reduce(function(acc, fnName) {
  acc[fnName] = utils.complement(predicate[fnName]);
  return acc;
}, {});
