'use strict';

var utils = require('./utils');
var predicate = module.exports;

var curry = utils.curry;

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

predicate.exists = function (val) {
  return val != null;
};

predicate.truthy = function (val) {
  // coerce for null != null
  return !!(val && predicate.exists(val));
};

predicate.falsey = utils.complement(predicate.truthy);

//---- value comparision methods

predicate.equal = curry(function (a, b) {
  return a === b;
});

predicate.eq = curry(function (a, b) {
  return a == b;
});

predicate.null = predicate.equal(null);
predicate.undef = predicate.equal(undefined);

predicate.lt = predicate.less = curry(function (a, b) {
  return a < b;
});

predicate.le = predicate.lessEq = curry(function (a, b) {
  return predicate.equal(a, b) || predicate.less(a, b);
});

predicate.gt = predicate.greater = curry(function (a, b) {
  return a > b;
});

predicate.ge = predicate.greaterEq = curry(function (a, b) {
  return predicate.equal(a, b) || predicate.greater(a, b);
});

// --- Type checking predicates

// Forces objects toString called returned as [object Object] for instance
var __toString = Object.prototype.toString;
var eqToStr = curry(function(str, val) {
  return predicate.equal(str, __toString.call(val));
});

//---- Object type checks

predicate.object = predicate.obj = function (val) {
  return val === Object(val);
};

predicate.array = predicate.arr = Array.isArray || eqToStr('[object Array]');
predicate.date = eqToStr('[object Date]');
predicate.rgx = predicate.RegExp = eqToStr('[object RegExp]');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
predicate.finite = Number.isFinite || function (val) {
  return predicate.number(val) && isFinite(val);
};

predicate.nan = predicate.NaN = predicate.is(NaN);

predicate.instance = curry(function (Cls, inst) {
  return inst instanceof Cls;
});

predicate.arguments = eqToStr('[object Arguments]');
predicate.error = predicate.instance(Error);

// creates fns for predicate.string, etc
var typeofBuilder = curry(function(type, val) {
  return predicate.equal(type, typeof val);
});

//--- Create typeof methods

// type of string and alias name
// predicate.fn, predicate.num, etc
[
  ['function', 'fn'],
  ['string', 'str'],
  ['boolean', 'bool']
].reduce(function (predicate, type) {
  predicate[type[0]] = predicate[type[1]] = typeofBuilder(type[0]);
  return predicate;
}, predicate);

predicate.number = predicate.num = function(val) {
  return typeof val === 'number' && predicate.not.NaN(val);
};

predicate.int = function (val) {
  return predicate.num(val) && predicate.zero(utils.mod(val, 1));
};

predicate.pos = function (val) {
  return predicate.num(val) && predicate.greater(val, 0);
};

predicate.neg = function (val) {
  return predicate.num(val) && predicate.less(val, 0);
};

predicate.zero = function (val) {
  return predicate.num(val) && predicate.equal(val, 0);
};

predicate.even = function (val) {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.zero(utils.mod(val, 2));
};

predicate.odd = function (val) {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.not.zero(utils.mod(val, 2));
};

predicate.contains = curry(function (arr, val) {
  if (!predicate.array(arr)) throw new TypeError('Expected an array');
  if (predicate.NaN(val)) {
    return arr.some(predicate.NaN);
  }
  return !!~arr.indexOf(val);
});

var __has = Object.prototype.hasOwnProperty;
predicate.has = curry(function has(o, key) {
  return __has.call(o, key);
});

predicate.empty = function (o) {
  if (predicate.not.exists(o)) return true;
  if (predicate.arr(o) || predicate.str(o)) return !o.length;
  if (predicate.obj(o)) {
    for (var k in o) if (predicate.has(o, k)) return false;
    return true;
  }
  throw new TypeError();
};

predicate.primitive = function (val) {
  return predicate.string(val) || predicate.num(val) || predicate.bool(val) ||
    predicate.null(val) || predicate.undef(val) || predicate.NaN(val);
};

// Assign inverse of each predicate
predicate.not = Object.keys(predicate).reduce(function (acc, fnName) {
  acc[fnName] = utils.complement(predicate[fnName]);
  return acc;
}, {});
