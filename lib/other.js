'use strict';

var predicates = require('./predicates');
var utils = require('./utils');
var predicate = module.exports;

predicate.ternary = function (pred, a, b) {
  if (predicates.bool(pred)) return pred ? a : b;
  if (predicates.undef(a)) return utils.partial(predicate.ternary, pred);
  if (predicates.undef(b)) return utils.partial(predicate.ternary, pred, a);
  return predicate.ternary(pred(a, b), a, b);
};
