'use strict';

const predicates = require('./predicates');

// chaining mixin
class Lazy {
  constructor() {
    this.lazy = [];
  }

  valueOf() {
    return this.val();
  }

  val() {
    return this.lazy[this.method]((args) => args[0].apply(null, args[1]));
  }
}

class Every extends Lazy {
  constructor() {
    super();
    this.method = 'every';
  }
}

class Some extends Lazy {
  constructor() {
    super();
    this.method = 'some';
  }
}

// Extend chaining methods onto the prototypes
[Every, Some].forEach((cls) => {
  Object.keys(predicates).reduce((proto, fnName) => {
    if (!predicates.fn(predicates[fnName])) {
      return proto;
    }

    /* eslint-disable-next-line func-names, no-param-reassign */
    proto[fnName] = function () {
      this.lazy.push([predicates[fnName], arguments]);
      return this;
    };

    return proto;
  }, cls.prototype);
});

const predicate = module.exports;

predicate.every = function every() {
  return new Every();
};
predicate.all = predicate.every;

predicate.some = function some() {
  return new Some();
};
predicate.any = predicate.some;
