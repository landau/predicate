'use strict';

import { BooleanFunction } from './utils';
const predicates = require('./predicates');

type Chain = [BooleanFunction, unknown[]];

// chaining mixin
class Chainable {
  private chain: Chain[] = [];
  private method: Function;

  constructor(method: Function) {
    this.method = method;
  }

  valueOf() {
    return this.val();
  }

  val() {
    return this.method.call(this.chain, (args: Chain) => args[0](...args[1]));
  }
}

// Extend chaining methods onto the prototypes
Object.keys(predicates)
  .filter(fnName => predicates.fn(predicates[fnName]))
  .reduce((proto, fnName) => {
    proto[fnName] = function(...args: unknown[]) {
      this.chain.push([predicates[fnName], args]);
      return this;
    };

    return proto;
  }, Chainable.prototype);

export function every() {
  return new Chainable(Array.prototype.every);
}
export const all = every;

export function some() {
  return new Chainable(Array.prototype.some);
}
export const any = some;
