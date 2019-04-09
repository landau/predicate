'use strict';

import { curry, identity, complement, mod, toBoolFn } from './utils';
import { and, or } from './other';

const predicate = {};

export const is = Object.is;

export function exists(val: unknown): boolean {
  return val != null;
}

export const truthy = toBoolFn(and(identity, exists));
export const falsey = complement(truthy);

// ---- value comparision methods
export function equal<T>(a: T, b: T): boolean {
  return a === b;
}

export function eq<T1, T2>(a: T1, b: T2): boolean {
  return a == b;
}

// FIXME: export const null = curry(equal, null);
export const undef = curry(equal, undefined);

function lt<T>(a: T, b: T): boolean {
  return a < b;
}
export const less = lt;

export const ltEq = or(equal, less);
export const le = ltEq;
export const lessEq = ltEq;

export const gt = function gt<T>(a: T, b: T): boolean {
  return a > b;
};
export const greater = gt;

export const gtEq = or(equal, greater);
export const ge = gtEq;
export const greaterEq = gtEq;

// --- Type checking predicates

// Forces objects toString called returned as [object Object] for instance
const toString = Object.prototype.toString;
const eqToStr = curry(function eqToStr<T>(str: string, val: T): boolean {
  return equal(str, toString.call(val));
});

// ---- Object type checks

export function obj<T>(val: T): boolean {
  return val === Object(val);
}
// FIXME: export const object = obj

export const array = Array.isArray;
export const arr = array;
export const date = eqToStr('[object Date]');

export const regex = eqToStr('[object RegExp]');
export const regexp = regex;
export const rgx = regex;
// FIXME:: export const RegExp = regex

export const nan = curry(is, NaN);
// FIXME: export const NaN =nan

type GenericClass<T> = { new (...args: any[]): T };
export const instance = function instance<T1, T2>(
  Cls: GenericClass<T1>,
  inst: T2
): boolean {
  return inst instanceof Cls;
};

// FIXME: export const arguments = eqToStr('[object Arguments]');
export const error = curry(instance, Error);

// creates fns for predicate.string, etc
const typeofBuilder = curry(function<T>(type: string, val: T) {
  return equal(type, typeof val);
});

// --- Create typeof functions
export const fn = typeofBuilder('function');
// FIXME: export const function = fn;

export const str = typeofBuilder('string');
export const string = str;

export const boolean = typeofBuilder('boolean');
export const bool = boolean;

export function number<T>(val: T): boolean {
  return typeof val === 'number' && predicate.not.NaN(val);
}
export const num = number;

export const pos = and(num, greater(0));
export const neg = and(num, less(0));
export const zero = and(num, equal(0));

export function int<T>(val: T): boolean {
  return num(val) && zero(mod(val, 1));
}

export function even<T>(val: T): boolean {
  return num(val) && predicate.not.zero(val) && zero(mod(val, 2));
}

export function odd<T>(val: T): boolean {
  return num(val) && predicate.not.zero(val) && predicate.not.zero(mod(val, 2));
}

export function contains<T>(arrOrString: string, val: T): boolean;
export function contains<T1, T2>(arrOrString: T1[], val: T2): boolean;
export function contains<T>(arrOrString: any, val: any): boolean {
  if (and(predicate.not.array, predicate.not.string)(arrOrString)) {
    throw new TypeError('Expected an array or string');
  }

  if (str(arrOrString) && !str(val)) {
    return false;
  }

  if (nan(val)) {
    return arrOrString.some(nan);
  }

  return arrOrString.indexOf(val) !== -1;
}
export const includes = contains;

const hasOwnProp = Object.prototype.hasOwnProperty;
export function has<T1, T2>(o: T1, key: T2): boolean {
  return hasOwnProp.call(o, key);
}

export function empty<T>(o: T[] | string | object): boolean {
  if (predicate.not.exists(o)) {
    return true;
  }

  if (or(arr, str)(o)) {
    return !(o as string).length;
  }

  if (obj(o)) {
    return Object.keys(o).length < 1;
  }

  throw new TypeError();
}

predicate.primitive = or(
  predicate.string,
  predicate.num,
  predicate.bool,
  predicate.null,
  predicate.undef,
  predicate.NaN
);

predicate.matches = curry(function(rgx, val) {
  return rgx.test(val);
});

// Assign inverse of each predicate
predicate.not = Object.keys(predicate).reduce(function(acc, fnName) {
  acc[fnName] = utils.complement(predicate[fnName]);
  return acc;
}, {});
