import { BooleanFunction } from './utils';

export function and(...predicates: Function[]): BooleanFunction {
  return function _and(...args: unknown[]): boolean {
    return predicates.every((p: Function) => p(...args));
  };
}

export function or(...predicates: Function[]): BooleanFunction {
  return function _or(...args: unknown[]): boolean {
    return predicates.some((p: Function) => p(...args));
  };
}
