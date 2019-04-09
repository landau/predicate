export type FunctionWithReturn<T> = (...args: unknown[]) => T;
export type BooleanFunction = FunctionWithReturn<boolean>;

export interface CurriedFunction2<T1, T2, R> {
  (t1: T1): (t2: T2) => R;
  (t1: T1, t2: T2): R;
}

export type CurriedFunction2WithSource<T1, T2, R> = CurriedFunction2<
  T1,
  T2,
  R
> & {
  src: Function;
};

// Useful for debuging curried functions
function setSrc<T1, T2, R>(
  curried: CurriedFunction2<T1, T2, R>,
  src: Function
): CurriedFunction2WithSource<T1, T2, R> {
  return Object.assign(curried, {
    toString(): string {
      return src.toString();
    },
    src
  });
}

// Curry's fn's with arity 2
export function curry<T1, T2, R>(f: Function): CurriedFunction2<T1, T2, R> {
  function curried(t1: T1): (t2: T2) => R;
  function curried(t1: T1, t2: T2): R;
  function curried(t1: T1, t2?: T2): any {
    if (!arguments.length) {
      throw new TypeError('Function called with no arguments');
    }

    return arguments.length === 1
      ? setSrc((t2: T2) => f(t1, t2), f)
      : f(t1, t2);
  }

  return setSrc(curried, f);
}

export function complement<T1, T2, R>(
  // pred: CurriedFunction2WithSource<T1, T2, R>
  pred: Function
): Function;
export function complement(pred: BooleanFunction): BooleanFunction;
export function complement(pred: any): any {
  function getComplementResult(...args: unknown[]): BooleanFunction;
  function getComplementResult(...args: unknown[]): boolean;
  function getComplementResult(...args: unknown[]): any {
    const ret = pred(...args);
    // Handle curried fns
    return typeof ret === 'function' ? complement(ret) : !ret;
  }

  return getComplementResult;
}

export { complement as invert };

export const mod = curry(function mod(a: number, b: number): number {
  return a % b;
});

export function identity<T>(v: T): T {
  return v;
}

export const toBoolFn = curry(function toBoolFn<T>(
  fn: Function,
  v: T
): boolean {
  return !!fn(v);
});
