'use strict';

const predicates = require('./predicates');
const predicate = module.exports;

// chaining mixin
class Lazy {
  constructor() {
    this.lazy = [];
  }

  valueOf() {
    return this.val();
  }

  val() {
    return this.lazy.map(function (args) {
      return args[0].apply(null, args[1]);
    })[this.method](predicates.truthy);
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
[Every, Some].forEach(function(cls) {
  Object.keys(predicates).reduce(function(proto, fnName) {
    if (!predicates.fn(predicates[fnName])) return proto;

    proto[fnName] = function() {
      this.lazy.push([predicates[fnName], arguments]);
      return this;
    };

    return proto;
  }, cls.prototype);
});

predicate.all = predicate.every = function() {
  return new Every();
};

predicate.any = predicate.some = function() {
  return new Some();
};
