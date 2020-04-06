'use strict';

const predicates = require('./predicates');
const utils = require('./utils');

const every = Array.prototype.every;
const some = Array.prototype.some;

const predicate = module.exports;

function ternary(pred, a, b) {
  if (predicates.bool(pred)) {
    return pred ? a : b;
  }

  if (predicates.undef(a)) {
    return utils.partial(predicate.ternary, pred);
  }

  if (predicates.undef(b)) {
    return utils.partial(predicate.ternary, pred, a);
  }

  return predicate.ternary(pred(a, b), a, b);
}

function and() {
  const predicateArgs = arguments;

  return function _and() {
    const args = arguments;
    return every.call(predicateArgs, (p) => p.apply(null, args));
  };
}

function or() {
  const predicateArgs = arguments;

  return function _or() {
    const args = arguments;
    return some.call(predicateArgs, (p) => p.apply(null, args));
  };
}

predicate.ternary = ternary;
predicate.and = and;
predicate.or = or;
