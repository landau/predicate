/**
 * @license is.js 
 * (c) 2014 Trevor Landau <landautrevor@gmail.com> @trevor_landau
 * is.js may be freely distributed under the MIT license.
 */
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.is=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./lib/utils');
var is = {};
is.VERSION = '0.10.1';

[
  utils,
  _dereq_('./lib/predicates'),
  _dereq_('./lib/chain'),
  _dereq_('./lib/other'),
].reduce(utils.assign, is);

module.exports = is;

},{"./lib/chain":2,"./lib/other":3,"./lib/predicates":4,"./lib/utils":5}],2:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./utils');
var predicates = _dereq_('./predicates');
var is = module.exports;

// chaining mixin
function lazy() {
  /* jshint validthis:true */

  // Enable invocation with operators (+, !, etc)
  this.valueOf = function () {
    return this.val();
  };

  this.val = function () {
    return this.lazy.map(function (args) {
      return args[0].apply(null, args[1]);
    })[this.method](predicates.truthy);
  };

  return this;
}

function Every() {
  this.method = 'every';
  this.lazy = [];
}

Every.prototype = Object.keys(predicates).reduce(function (acc, fnName) {
  if (!predicates.fn(predicates[fnName])) return acc;

  acc[fnName] = function() {
    this.lazy.push([predicates[fnName], arguments]);
    return this;
  };

  return acc;
}, {});

lazy.call(Every.prototype);

is.all = is.every = function () {
  return new Every();
};

function Some() {
  this.method = 'some';
  this.lazy = [];
}

Some.prototype = utils.assign({}, Every.prototype);
lazy.call(Some.prototype);

is.any = is.some = function () {
  return new Some();
};

},{"./predicates":4,"./utils":5}],3:[function(_dereq_,module,exports){
'use strict';

var predicates = _dereq_('./predicates');
var utils = _dereq_('./utils');
var is = module.exports;

is.ternary = function (pred, a, b) {
  if (predicates.bool(pred)) return pred ? a : b;
  if (predicates.undef(a)) return utils.partial(is.ternary, pred);
  if (predicates.undef(b)) return utils.partial(is.ternary, pred, a);
  return is.ternary(pred(a, b), a, b);
};

},{"./predicates":4,"./utils":5}],4:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./utils');
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

},{"./utils":5}],5:[function(_dereq_,module,exports){
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


},{}]},{},[1])
(1)
});