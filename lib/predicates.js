'use strict';

const utils = require('./utils');
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

predicate.exists = (val) => {
  return val != null;
};

predicate.truthy = (val) => {
  // coerce for null != null
  return !!(val && predicate.exists(val));
};

predicate.falsey = utils.complement(predicate.truthy);

//---- value comparision methods

predicate.equal = curry((a, b) => {
  return a === b;
});

predicate.eq = curry((a, b) => {
  return a == b;
});

predicate.null = predicate.equal(null);
predicate.undef = predicate.equal(undefined);

predicate.lt = predicate.less = curry((a, b) => {
  return a < b;
});

predicate.ltEq = predicate.le = predicate.lessEq = curry((a, b) => {
  return predicate.equal(a, b) || predicate.less(a, b);
});

predicate.gt = predicate.greater = curry((a, b) => {
  return a > b;
});

predicate.gtEq = predicate.ge = predicate.greaterEq = curry((a, b) => {
  return predicate.equal(a, b) || predicate.greater(a, b);
});

// --- Type checking predicates

// Forces objects toString called returned as [object Object] for instance
const __toString = Object.prototype.toString;
const eqToStr = curry(function(str, val) {
  return predicate.equal(str, __toString.call(val));
});

//---- Object type checks

predicate.object = predicate.obj = (val) => {
  return val === Object(val);
};

predicate.array = predicate.arr = Array.isArray || eqToStr('[object Array]');
predicate.date = eqToStr('[object Date]');
predicate.regex = predicate.regexp = predicate.rgx = predicate.RegExp = eqToStr('[object RegExp]');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
predicate.finite = Number.isFinite || ((val) => predicate.number(val) && isFinite(val));

predicate.nan = predicate.NaN = predicate.is(NaN);

predicate.instance = curry((Cls, inst) => inst instanceof Cls);

predicate.arguments = eqToStr('[object Arguments]');
predicate.error = predicate.instance(Error);

// creates fns for predicate.string, etc
const typeofBuilder = curry((type, val) => {
  return predicate.equal(type, typeof val);
});

//--- Create typeof methods

// type of string and alias name
// predicate.fn, predicate.num, etc
[
  ['function', 'fn'],
  ['string', 'str'],
  ['boolean', 'bool']
].reduce((predicate, type) => {
  predicate[type[0]] = predicate[type[1]] = typeofBuilder(type[0]);
  return predicate;
}, predicate);

predicate.number = predicate.num = (val) => typeof val === 'number' && predicate.not.NaN(val);

predicate.int = (val) => {
  return predicate.num(val) && predicate.zero(utils.mod(val, 1));
};

predicate.pos = (val) => {
  return predicate.num(val) && predicate.greater(val, 0);
};

predicate.neg = (val) => {
  return predicate.num(val) && predicate.less(val, 0);
};

predicate.zero = (val) => {
  return predicate.num(val) && predicate.equal(val, 0);
};

predicate.even = (val) => {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.zero(utils.mod(val, 2));
};

predicate.odd = (val) => {
  return predicate.num(val) &&
          predicate.not.zero(val) &&
          predicate.not.zero(utils.mod(val, 2));
};

predicate.contains = predicate.includes = curry((arrOrString, val) => {
  if (!predicate.array(arrOrString) && !predicate.string(arrOrString)) {
    throw new TypeError('Expected an array or string');
  }

  if (predicate.string(arrOrString) && !predicate.string(val)) {
    return false;
  }

  if (predicate.NaN(val)) {
    return arrOrString.some(predicate.NaN);
  }

  return !!~arrOrString.indexOf(val);
});

const __has = Object.prototype.hasOwnProperty;
predicate.has = curry((o, key) => __has.call(o, key));

predicate.empty = (o) => {
  if (predicate.not.exists(o)) return true;
  if (predicate.arr(o) || predicate.str(o)) return !o.length;
  if (predicate.obj(o)) {
    for (let k in o) if (predicate.has(o, k)) return false;
    return true;
  }
  throw new TypeError();
};

predicate.primitive = (val) => {
  return predicate.string(val) || predicate.num(val) || predicate.bool(val) ||
    predicate.null(val) || predicate.undef(val) || predicate.NaN(val);
};

predicate.matches = curry((rgx, val) => rgx.test(val));

// Assign inverse of each predicate
predicate.not = Object.keys(predicate).reduce((acc, fnName) => {
  acc[fnName] = utils.complement(predicate[fnName]);
  return acc;
}, {});
