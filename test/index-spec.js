'use strict';

/* eslint-disable func-names, no-unused-expressions */

const _ = require('lodash');
require('should');
const mocha = require('mocha');
const predicate = require('..');

const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

class Foo {}
class Bar extends Foo {}

const testClasses = { Foo, Bar };

// FIXME Wow this is really ugly lol.
function addTest(fn, val, expected, shorthand) {
  if (Array.isArray(val) && val.length) {
    it(`should return ${expected} for values ${val}`, function () {
      predicate[fn].apply(null, val).should.be[expected];
    });
  } else {
    it(`should return ${expected} for value ${val}`, function () {
      predicate[fn](val).should.be[expected];
    });
  }

  if (_.isString(shorthand)) {
    it(`should have a shorthand method ${shorthand} for method ${fn}`, function () {
      predicate[shorthand].should.equal(predicate[fn]);
    });
  }
}

function addNotTest(fn, val, expected) {
  if (Array.isArray(val) && val.length) {
    it(`should return ${expected} for values ${val}`, function () {
      predicate.not[fn].apply(null, val).should.be[expected];
    });
  } else {
    it(`should return ${expected} for value ${val}`, function () {
      predicate.not[fn](val).should.be[expected];
    });
  }
}

const truths = ['dog', 1, [], {}];
const falses = [null, undefined];

describe('predicate', function () {
  const tests = {
    is: {
      truthy: [
        [undefined, undefined],
        [null, null],
        [testClasses.Foo, testClasses.Foo],
        [0, 0],
        [NaN, 0 / 0],
      ],
      falsey: [
        [0, -0],
        [0, false],
        [NaN, 0],
      ],
    },

    exists: {
      truthy: truths.concat([0]),
      falsey: falses,
    },

    truthy: {
      truthy: truths,
      falsey: falses,
    },

    falsey: {
      truthy: falses,
      falsey: truths,
    },

    null: {
      truthy: [null],
      falsey: [undefined, 'dog', 1, []],
    },

    undef: {
      truthy: [undefined],
      falsey: [null, '', 'dog', 1, []],
    },

    equal: {
      truthy: [
        [0, 0],
        ['dog', 'dog'],
      ],
      falsey: [
        [0, 1],
        ['cat', 'dog'],
        [0, '0'],
      ],
    },

    eq: {
      truthy: [[0, '0']],
      falsey: [
        [0, 1],
        ['cat', 'dog'],
      ],
    },

    less: {
      truthy: [[0, 1]],
      falsey: [[1, 0]],
    },

    greater: {
      truthy: [[1, 0]],
      falsey: [[0, 1]],
    },

    lessEq: {
      truthy: [
        [0, 1],
        [0, 0],
      ],
      falsey: [[1, 0]],
    },

    greaterEq: {
      truthy: [
        [1, 0],
        [0, 0],
      ],
      falsey: [[0, 1]],
    },
    object: {
      truthy: [{}, [], new Date()],
      falsey: [null, 'a', 1],
    },

    array: {
      truthy: [[]],
      falsey: [{}, 'a', 1, new Date()],
    },

    date: {
      truthy: [new Date()],
      falsey: [{}, 'a', 1],
    },

    RegExp: {
      truthy: [/\d/],
      falsey: [{}, 'a', 1, [], new Date()],
      shorthand: 'rgx',
    },

    NaN: {
      truthy: [NaN],
      falsey: falses.concat([], 1, /\d/, '1', {}),
    },

    function: {
      truthy: [function () {}],
      falsey: [{}, 'a', 1, new Date()],
      shorthand: 'fn',
    },

    number: {
      truthy: [1],
      falsey: ['1', new Date(), NaN],
      shorthand: 'num',
    },

    string: {
      truthy: ['dog'],
      falsey: [[], 1],
      shorthand: 'str',
    },

    int: {
      truthy: [1, 2e64, -5, 0],
      falsey: [1.2, -Infinity, Infinity, '1', new Date()],
    },

    pos: {
      truthy: [1, 5, 10.2],
      falsey: [0, -1, 'a', {}],
    },

    neg: {
      truthy: [-1, -5, -10.2],
      falsey: [0, 1, 'a', {}],
    },

    zero: {
      truthy: [0],
      falsey: [1, 'foo', '0', {}],
    },

    even: {
      truthy: [2, -6],
      falsey: [0, 3, 'foo'],
    },

    odd: {
      truthy: [1, -11],
      falsey: [0, 4, 'foo'],
    },

    instance: {
      truthy: [
        [Object, {}],
        [Array, []],
        [testClasses.Foo, new testClasses.Foo()],
        [testClasses.Foo, new testClasses.Bar()],
        [testClasses.Bar, new testClasses.Bar()],
      ],
      falsey: [
        [Array, {}],
        [testClasses.Bar, new testClasses.Foo()],
      ],
    },

    primitive: {
      truthy: [1, null, undefined, NaN, true, false, 'foo'],
      falsey: [{}, [], function () {}, new testClasses.Foo()],
    },

    empty: {
      truthy: [{}, ''],
      falsey: [{ foo: 'bar' }, 'hi', undefined],
    },

    matches: {
      truthy: [
        [/foo/, 'foo'],
        [/\d{3}/, 123],
      ],
      falsey: [
        [/foo/, 'bar'],
        [/\d{3}/, 13],
      ],
    },
  };

  _.each(tests, function (expectations, methodName) {
    describe('normal tests', function () {
      describe(methodName, function () {
        const shorthand = expectations.shorthand;
        const truthy = expectations.truthy;
        const falsey = expectations.falsey;

        _.each(truthy, (val) => addTest(methodName, val, true, shorthand));
        _.each(falsey, (val) => addTest(methodName, val, false, shorthand));
      });
    });
  });

  _.each(tests, function (expectations, methodName) {
    describe('not tests', function () {
      describe(methodName, function () {
        const shorthand = expectations.shorthand;
        const truthy = expectations.truthy;
        const falsey = expectations.falsey;

        _.each(truthy, (val) => addNotTest(methodName, val, true, shorthand));
        _.each(falsey, (val) => addNotTest(methodName, val, false, shorthand));
      });
    });
  });

  describe('#arguments', function () {
    it('should return true for arguments', function () {
      function fn() {
        return predicate.arguments(arguments).should.equal(true);
      }

      fn();
    });

    []
      .concat(falses, truths)
      .forEach((val) => addTest('arguments', val, false));
  });

  describe('#invert', function () {
    let testFn;

    before(function () {
      testFn = predicate.invert(predicate.fn);
    });

    it('should return a function', function () {
      testFn.should.be.instanceof(Function);
    });

    it('should return an inverted value', function () {
      testFn(predicate.equal).should.equal(false);
    });

    it('should alias complement', function () {
      predicate.invert.should.equal(predicate.complement);
    });
  });

  describe('#includes', function () {
    const arr = [1, 2, 3];

    it('should throw an error for non arrays or non string', function () {
      (() => predicate.includes(1, 5)).should.throw(TypeError);
    });

    it('should return false if the value is not found', function () {
      predicate.includes(arr, 5).should.equal(false);
    });

    it('should return true if the value is found', function () {
      predicate.includes(arr, 1).should.equal(true);
      predicate.includes(arr, 2).should.equal(true);
      predicate.includes(arr, 3).should.equal(true);
      predicate.includes([0, NaN], NaN).should.equal(true);
      predicate.includes(['foo', 'bar'], 'foo').should.equal(true);
    });

    it('should have an alias contains', function () {
      predicate.includes.should.equal(predicate.contains);
    });

    it('should find values in a string', function () {
      predicate.includes('hippo', 'ppo').should.equal(true);
    });

    it('should return false for string searches with values that are not strings', function () {
      predicate.includes('hippo', 1).should.equal(false);
      predicate.includes('hippo', NaN).should.equal(false);
      predicate.includes('hippo', true).should.equal(false);
      predicate.includes('hippo', []).should.equal(false);
    });
  });

  describe('#empty', function () {
    it('should return true for an empty array', function () {
      predicate.empty([]).should.equal(true);
    });

    it('should return false for a non-empty array', function () {
      predicate.empty([1]).should.equal(false);
    });

    it('should return true for an empty string', function () {
      predicate.empty('').should.equal(true);
    });

    it('should return false for a non-empty string', function () {
      predicate.empty('foo').should.equal(false);
    });

    it('should return true for an empty object', function () {
      predicate.empty({}).should.equal(true);
    });

    it('should return false for a non-empty object', function () {
      predicate.empty({ foo: 'bar' }).should.equal(false);
    });

    it('should throw for non str/arr/obj', function () {
      let err = null;
      try {
        predicate.empty(true);
      } catch (e) {
        err = e;
      }
      err.should.be.instanceOf(TypeError);
    });
  });

  describe('#has', function () {
    it('should return true if the key is found', function () {
      predicate
        .has(
          {
            foo: 3,
          },
          'foo'
        )
        .should.equal(true);
    });

    it('should return false if the key is not on on the obj', function () {
      predicate
        .has(
          {
            foo: 3,
          },
          'toString'
        )
        .should.equal(false);
    });
  });

  describe('#ternary', function () {
    it('should return 1 for a truthy value', function () {
      predicate.ternary(true, 1, 2).should.equal(1);
    });

    it('should return 2 for a falsey value', function () {
      predicate.ternary(false, 1, 2).should.equal(2);
    });

    it('should return 1 for a lesser value', function () {
      predicate.ternary(predicate.less, 1, 2).should.equal(1);
    });

    it('should return 1 for a greater value', function () {
      predicate.ternary(predicate.less, 2, 1).should.equal(1);
    });

    it('should return a function for a pred given', function () {
      const fn = predicate.ternary(predicate.less);
      (typeof fn).should.equal('function');
      fn(1, 2).should.equal(1);
      fn(2, 1).should.equal(1);
    });

    it('should return a function for a pred and arg given', function () {
      const fn = predicate.ternary(predicate.less, 1);
      (typeof fn).should.equal('function');
      fn(2).should.equal(1);
    });
  });

  describe('#and', function () {
    it('should return a function', function () {
      const fn = predicate.and(predicate.str);
      (typeof fn).should.equal('function');
    });

    it('should return true if all predicates return true', function () {
      const fn = predicate.and(
        predicate.str,
        predicate.equal('hi'),
        predicate.not.int
      );
      fn('hi').should.equal(true);
    });

    it('should return false if at least one predicate returns false', function () {
      const fn = predicate.and(
        predicate.str,
        predicate.equal('hi'),
        predicate.not.int
      );
      fn(1).should.equal(false);
    });

    it('should handle n arity functions', function () {
      const fn = predicate.and(predicate.eq, predicate.equal);
      fn(5, 5).should.equal(true);
      fn('a', 'a').should.equal(true);
      fn(6, 7).should.equal(false);
    });
  });

  describe('#or', function () {
    it('should return a function', function () {
      const fn = predicate.or(predicate.str);
      (typeof fn).should.equal('function');
    });

    it('should return true if at least one predicate is true', function () {
      const fn = predicate.or(
        predicate.not.equal('hi'),
        predicate.int,
        predicate.str
      );
      fn('hi').should.equal(true);
    });

    it('should return false if at least all predicates evaluate to false', function () {
      const fn = predicate.or(
        predicate.equal('hi'),
        predicate.int,
        predicate.str
      );
      fn([]).should.equal(false);
    });

    it('should handle n arity functions', function () {
      const fn = predicate.or(predicate.equal, predicate.greater);
      fn(5, 5).should.equal(true);
      fn(6, 5).should.equal(true);
      fn(6, 7).should.equal(false);
    });
  });

  describe('#every', function () {
    it('should map to .all', function () {
      predicate.every.should.equal(predicate.all);
    });

    it('should return an object', function () {
      predicate.every().should.be.an.object;
    });

    it('should allow chaining', function () {
      predicate.every().equal(1, 1).str('5').val().should.be.ok;
      predicate.every().str('foo').includes([1, 2, 3], 1).val().should.be.ok;
      predicate.every().str(1).includes([1, 2, 3], 1).val().should.equal(false);
      predicate
        .every()
        .str('foo')
        .includes([1, 2, 3], 5)
        .val()
        .should.equal(false);
    });
  });

  describe('#some', function () {
    it('should map to .any', function () {
      predicate.some.should.equal(predicate.any);
    });

    it('should return an object', function () {
      predicate.some().should.be.an.object;
    });

    it('should allow chaining', function () {
      predicate.some().equal(1, 1).str('5').val().should.be.ok;
      predicate.some().str('foo').includes([1, 2, 3], 1).val().should.be.ok;
      predicate.some().str(1).includes([1, 2, 3], 1).val().should.be.ok;
      predicate.some().str('foo').includes([1, 2, 3], 5).val().should.be.ok;
      predicate
        .some()
        .num('foo')
        .includes([1, 2, 3], 5)
        .val()
        .should.equal(false);
    });
  });

  describe('#Lazy', function () {
    it('should call `val` when valueOf is called', function () {
      (+predicate.some().equal(1, 1).str('5')).should.equal(1);

      (!!predicate.some().equal(1, 1).str('5')).should.equal(true);
    });
  });

  describe('#partial', function () {
    let fn = null;

    before(function () {
      fn = predicate.partial(predicate.less, 1);
    });

    it('should return a fn', function () {
      (typeof fn).should.equal('function');
    });

    it('should exec the fn as expected', function () {
      fn(2).should.be.ok;
    });
  });

  describe('#curry', function () {
    function add(a, b) {
      return a + b;
    }

    const fn = predicate.curry(add);

    it('should return an fn', function () {
      (typeof fn).should.equal('function');
    });

    it('should source the original function', function () {
      fn.src.should.equal(add);
    });

    it('should display string version of curried function', function () {
      fn.toString().should.equal(add.toString());
    });

    it('should throw a TypeError if no args are provided', function () {
      (() => fn()).should.throw(TypeError);
    });

    it('should return a new curried fn for arity 1', function () {
      const curried = fn(1);
      (typeof curried).should.equal('function');
      curried.src.should.equal(add);
      curried(2).should.equal(3);
    });

    it('should execute an arity 2 fn', function () {
      fn(1, 2).should.equal(3);
    });

    it('should curry with predicate.not', function () {
      const curried = predicate.not.equal(1);
      (typeof curried).should.equal('function');
      curried(1).should.equal(false);
      curried(2).should.equal(true);
    });
  });

  describe('#mod', function () {
    it('should return a modulus value', function () {
      predicate.mod(6, 5).should.equal(1);
      predicate.mod(6, 6).should.equal(0);
    });
  });

  describe('#assign', function () {
    it('should copy values to a new object', function () {
      const x = { foo: 'bar' };
      const y = { bar: 'foo' };
      const z = predicate.assign(x, y);
      z.foo.should.equal('bar');
      z.bar.should.equal('foo');
    });
  });
});
