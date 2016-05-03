'use strict';

const predicates = require('./predicates');
const utils = require('./utils');
const predicate = module.exports;

predicate.ternary = (pred, a, b) => {
  if (predicates.bool(pred)) return pred ? a : b;
  if (predicates.undef(a)) return utils.partial(predicate.ternary, pred);
  if (predicates.undef(b)) return utils.partial(predicate.ternary, pred, a);
  return predicate.ternary(pred(a, b), a, b);
};
