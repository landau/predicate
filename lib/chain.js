'use strict';

var utils = require('./utils');
var predicates = require('./predicates');
var predicate = module.exports;

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

predicate.all = predicate.every = function () {
  return new Every();
};

function Some() {
  this.method = 'some';
  this.lazy = [];
}

Some.prototype = utils.assign({}, Every.prototype);
lazy.call(Some.prototype);

predicate.any = predicate.some = function () {
  return new Some();
};
