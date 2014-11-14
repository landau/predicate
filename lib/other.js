'use strict';

var predicates = require('./predicates');
var utils = require('./utils');
var is = module.exports;

is.ternary = function (pred, a, b) {
  if (predicates.bool(pred)) return pred ? a : b;
  if (predicates.undef(a)) return utils.partial(is.ternary, pred);
  if (predicates.undef(b)) return utils.partial(is.ternary, pred, a);
  return is.ternary(pred(a, b), a, b);
};
