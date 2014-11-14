'use strict';

var utils = require('./utils');
var is = module.exports;

var curry = utils.curry;

if (Object.is) {
  is.is = curry(Object.is);
} else {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
  is.is = curry(function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  });
}

is.exists = function (val) {
  return val != null;
};

is.truthy = function (val) {
  // coerce for null != null
  return !!(val && is.exists(val));
};

is.falsey = utils.complement(is.truthy);

//---- value comparision methods

is.equal = curry(function (a, b) {
  return a === b;
});

is.eq = curry(function (a, b) {
  return a == b;
});

is.null = is.equal(null);
is.undef = is.equal(undefined);

is.lt = is.less = curry(function (a, b) {
  return a < b;
});

is.ltEq = is.lessEq = curry(function (a, b) {
  return is.equal(a, b) || is.less(a, b);
});

is.gt = is.greater = curry(function (a, b) {
  return a > b;
});

is.gtEq = is.greaterEq = curry(function (a, b) {
  return is.equal(a, b) || is.greater(a, b);
});

// --- Type checking predicates

// Forces objects toString called returned as [object Object] for instance
var __toString = Object.prototype.toString;
var eqToStr = curry(function(str, val) {
  return is.equal(str, __toString.call(val));
});

//---- Object type checks

is.object = is.obj = function (val) {
  return val === Object(val);
};

is.array = is.arr = Array.isArray || eqToStr('[object Array]');
is.date = eqToStr('[object Date]');
is.rgx = is.RegExp = eqToStr('[object RegExp]');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
is.finite = Number.isFinite || function (val) {
  return is.number(val) && isFinite(val);
};

is.NaN = is.is(NaN);

is.instance = curry(function (Cls, inst) {
  return inst instanceof Cls;
});

is.arguments = eqToStr('[object Arguments]');
is.error = is.instance(Error);

// creates fns for is.string, etc
var typeofBuilder = curry(function(type, val) {
  return is.equal(type, typeof val);
});

//--- Create typeof methods

// type of string and alias name
// is.fn, is.num, etc
[
  ['function', 'fn'],
  ['string', 'str'],
  ['boolean', 'bool']
].reduce(function (is, type) {
  is[type[0]] = is[type[1]] = typeofBuilder(type[0]);
  return is;
}, is);

is.number = is.num = function(val) {
  return typeof val === 'number' && is.not.NaN(val);
};

is.int = function (val) {
  return is.num(val) && is.zero(utils.mod(val, 1));
};

is.pos = function (val) {
  return is.num(val) && is.greater(val, 0);
};

is.neg = function (val) {
  return is.num(val) && is.less(val, 0);
};

is.zero = function (val) {
  return is.num(val) && is.equal(val, 0);
};

is.even = function (val) {
  return is.num(val) &&
          is.not.zero(val) &&
          is.zero(utils.mod(val, 2));
};

is.odd = function (val) {
  return is.num(val) &&
          is.not.zero(val) &&
          is.not.zero(utils.mod(val, 2));
};

is.contains = curry(function (arr, val) {
  if (!is.array(arr)) throw new TypeError('Expected an array');
  if (is.NaN(val)) {
    return arr.some(is.NaN);
  }
  return !!~arr.indexOf(val);
});

var __has = Object.prototype.hasOwnProperty;
is.has = curry(function has(o, key) {
  return __has.call(o, key);
});

is.empty = function (o) {
  if (is.not.exists(o)) return true;
  if (is.arr(o) || is.str(o)) return !o.length;
  if (is.obj(o)) {
    for (var k in o) if (is.has(o, k)) return false;
    return true;
  }
  throw new TypeError();
};

is.primitive = function (val) {
  return is.string(val) || is.num(val) || is.bool(val) ||
    is.null(val) || is.undef(val) || is.NaN(val);
};

// Assign inverse of each predicate
is.not = Object.keys(is).reduce(function (acc, fnName) {
  acc[fnName] = utils.complement(is[fnName]);
  return acc;
}, {});
