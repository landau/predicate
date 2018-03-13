'use strict';

const predicates = require('./predicates');
const utils = require('./utils');
const predicate = module.exports;

predicate.ternary = function(pred, a, b) {
  if (predicates.bool(pred)) return pred ? a : b;
  if (predicates.undef(a)) return utils.partial(predicate.ternary, pred);
  if (predicates.undef(b)) return utils.partial(predicate.ternary, pred, a);
  return predicate.ternary(pred(a, b), a, b);
};

const _every = Array.prototype.every;
const _some = Array.prototype.some;

predicate.and = function() {
  const predicates = arguments;

  return function _and() {
    const args = arguments;
    return _every.call(predicates, function(p) {
      return p.apply(null, args);
    });
  };
};

predicate.or = function() {
  const predicates = arguments;

  return function _or() {
    const args = arguments;
    return _some.call(predicates, function(p) {
      return p.apply(null, args);
    });
  };
};
