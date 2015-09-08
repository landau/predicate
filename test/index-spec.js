/* jshint expr: true */
'use strict';

// Some old coffeescript stuff that is still useful
var Bar, Foo, addNotTest, addTest, falses, testClasses, truths, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function Ctor() { /*jshint validthis:true */
      this.constructor = child;
    }
    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  };

var _ = require('lodash');
var predicate = require('../');
require('should');

testClasses = {
  Foo: Foo = (function() {
    function Foo() {}

    return Foo;

  })()
};

testClasses.Bar = Bar = (function(_super) {

  /*jshint validthis:true */
  function _Bar() {
    return _Bar.__super__.constructor.apply(this, arguments);
  }
  __extends(_Bar, _super);

  return _Bar;

})(testClasses.Foo);

// Wow this is really shit lol.
// FIXME ditch this shit
var addTest = function(fn, val, expected, shorthand) {
  if (Array.isArray(val) && val.length) {

    it('should return `' + expected + '` for values `' + val + '`', function() {
      (predicate[fn].apply(null, val)).should.be[expected];
    });

  } else {

    it('should return `' + expected + '` for value `' + val + '`', function() {
      (predicate[fn](val)).should.be[expected];
    });

  }

  if (_.isString(shorthand)) {
    it('should have a shorthand method `' + shorthand + '` for method `' + fn + '`', function() {
      predicate[shorthand].should.equal(predicate[fn]);
    });
  }
};

var addNotTest = function(fn, val, expected) {
  if (Array.isArray(val) && val.length) {
    return it('should return `' + expected + '` for values `' + val + '`', function() {
      return (predicate.not[fn].apply(null, val)).should.be[expected];
    });
  } else {
    return it('should return `' + expected + '` for value `' + val + '`', function() {
      return (predicate.not[fn](val)).should.be[expected];
    });
  }
};

truths = ['dog', 1, [], {}];

falses = [null, void 0];

describe('predicate', function() {
  var tests;
  tests = {
    is: {
      truthy: [[undefined, undefined], [null, null],
               [testClasses.Foo, testClasses.Foo],
               [0, 0], [NaN, 0/0]],
      falsey: [[0, -0], [0, false], [NaN, 0]]
    },

    exists: {
      truthy: truths.concat([0]),
      falsey: falses
    },

    truthy: {
      truthy: truths,
      falsey: falses
    },

    falsey: {
      truthy: falses,
      falsey: truths
    },

    'null': {
      truthy: [null],
      falsey: [void 0, 'dog', 1, []]
    },

    undef: {
      truthy: [void 0],
      falsey: [null, '', 'dog', 1, []]
    },

    equal: {
      truthy: [[0, 0], ['dog', 'dog']],
      falsey: [[0, 1], ['cat', 'dog'], [0, '0']]
    },

    eq: {
      truthy: [[0, '0']],
      falsey: [[0, 1], ['cat', 'dog']]
    },

    less: {
      truthy: [[0, 1]],
      falsey: [[1, 0]]
    },

    greater: {
      truthy: [[1, 0]],
      falsey: [[0, 1]]
    },

    lessEq: {
      truthy: [[0, 1], [0, 0]],
      falsey: [[1, 0]]
    },

    greaterEq: {
      truthy: [[1, 0], [0, 0]],
      falsey: [[0, 1]]
    },
    object: {

      truthy: [{}, [], new Date()],
      falsey: [null, 'a', 1]
    },

    array: {
      truthy: [[]],
      falsey: [{}, 'a', 1, new Date()]
    },

    date: {
      truthy: [new Date()],
      falsey: [{}, 'a', 1]
    },

    RegExp: {
      truthy: [/\d/],
      falsey: [{}, 'a', 1, [], new Date()],
      shorthand: 'rgx'
    },

    NaN: {
      truthy: [NaN],
      falsey: falses.concat([], 1, /\d/, '1', {})
    },

    'function': {
      truthy: [function() {}],
      falsey: [{}, 'a', 1, new Date()],
      shorthand: 'fn'
    },

    number: {
      truthy: [1],
      falsey: ['1', new Date(), NaN],
      shorthand: 'num'
    },

    string: {
      truthy: ['dog'],
      falsey: [[], 1],
      shorthand: 'str'
    },

    finite: {
      truthy: [1, 2e64],
      falsey: [NaN, -Infinity, Infinity, '1', new Date()]
    },

    int: {
      truthy: [1, 2e64, -5, 0],
      falsey: [1.2, -Infinity, Infinity, '1', new Date()]
    },

    pos: {
      truthy: [1, 5, 10.2],
      falsey: [0, -1, 'a', {}]
    },

    neg: {
      truthy: [-1, -5, -10.2],
      falsey: [0, 1, 'a', {}]
    },

    zero: {
      truthy: [0],
      falsey: [1, 'foo', '0', {}]
    },

    even: {
      truthy: [2, -6],
      falsey: [0, 3, 'foo']
    },

    odd: {
      truthy: [1, -11],
      falsey: [0, 4, 'foo']
    },

    'instance': {
      truthy: [[Object, {}], [Array, []],
        [testClasses.Foo, new testClasses.Foo()], [testClasses.Foo, new testClasses.Bar()],
        [testClasses.Bar, new testClasses.Bar()]],
      falsey: [[Array, {}], [testClasses.Bar, new testClasses.Foo()]]
    },

    primitive: {
      truthy: [1, null, undefined, NaN, true, false, 'foo'],
      falsey: [{}, [], function() {}, new testClasses.Foo()]
    },

    empty: {
      truthy: [{}, ''],
      falsey: [{ foo: 'bar' }, 'hi']
    },

    matches: {
      truthy: [[/foo/, 'foo'], [/\d{3}/, 123]],
      falsey: [[/foo/, 'bar'], [/\d{3}/, 13]]
    }
  };

  _.each(tests, function(expectations, methodName) {
    return describe('normal tests', function() {
      return describe('' + methodName, function() {
        var shorthand = expectations.shorthand;
        var truthy = expectations.truthy;
        var falsey = expectations.falsey;

        _.each(truthy, function(val) {
          addTest(methodName, val, true, shorthand);
        });

        _.each(falsey, function(val) {
          addTest(methodName, val, false, shorthand);
        });
      });
    });
  });

  _.each(tests, function(expectations, methodName) {
    return describe('not tests', function() {
      return describe('' + methodName, function() {
        var shorthand = expectations.shorthand;
        var truthy = expectations.truthy;
        var falsey = expectations.falsey;

        _.each(truthy, function(val) {
          addNotTest(methodName, val, false, shorthand);
        });

        _.each(falsey, function(val) {
          addNotTest(methodName, val, true, shorthand);
        });
      });
    });
  });

  describe('#arguments', function() {
    it('should return true for arguments', function() {
      var fn = function() {
        return (predicate.arguments(arguments)).should.be.true;
      };

      fn();
    });

    _.each(falses.concat(truths), function(val) {
      addTest('arguments', val, false);
    });
  });

  describe('#invert', function() {
    before(function() {
      this.testFn = predicate.invert(predicate.fn);
    });

    it('should return a function', function() {
      this.testFn.should.be.instanceof(Function);
    });

    it('should return an inverted value', function() {
      this.testFn(predicate.equal).should.false;
    });

    it('should alias complement', function() {
      predicate.invert.should.equal(predicate.complement);
    });
  });

  describe('#contains', function() {
    var arr;
    arr = [1, 2, 3];
    var arrStr = 'Joe';

    it('should return false if the value is not found', function() {
      predicate.contains(5, arr).should.be.false;
      predicate.contains('z', arrStr).should.be.false;
    });

    it('should return true if the value is found', function() {
      predicate.contains(1, arr).should.be.true;
      predicate.contains(2, arr).should.be.true;
      predicate.contains(3, arr).should.be.true;

      predicate.contains('J', arrStr).should.be.true;
      predicate.contains('o', arrStr).should.be.true;
      predicate.contains('e', arrStr).should.be.true;

      predicate.contains(NaN, [0, NaN]).should.be.true;
    });
  });

  describe('#empty', function() {
    it('should return true for an empty array', function() {
      predicate.empty([]).should.be.true;
    });

    it('should return false for a non-empty array', function() {
      predicate.empty([1]).should.be.false;
    });

    it('should throw for non str/arr/obj', function() {
      var err = null;
      try {
        predicate.empty(true);
      } catch(e) { err = e; }
      err.should.be.instanceOf(TypeError);
    });
  });


  describe('#has', function() {
    it('should return true if the key is found', function() {
      predicate.has({
        foo: 3
      }, 'foo').should.be.true;
    });

    it('should return false if the key is not on on the obj', function() {
      predicate.has({
        foo: 3
      }, 'toString').should.be.false;
    });

  });

  describe('#ternary', function() {
    it('should return 1 for a truthy value', function() {
      predicate.ternary(true, 1, 2).should.equal(1);
    });

    it('should return 2 for a falsey value', function() {
      predicate.ternary(false, 1, 2).should.equal(2);
    });

    it('should return 1 for a lesser value', function() {
      predicate.ternary(predicate.less, 1, 2).should.equal(1);
    });

    it('should return 1 for a greater value', function() {
      predicate.ternary(predicate.less, 2, 1).should.equal(1);
    });

    it('should return a function for a pred given', function() {
      var fn = predicate.ternary(predicate.less);
      fn.should.be.a.function;
      fn(1, 2).should.equal(1);
      fn(2, 1).should.equal(1);
    });

    it('should return a function for a pred and arg given', function() {
      var fn = predicate.ternary(predicate.less, 1);
      fn.should.be.a.function;
      fn(2).should.equal(1);
    });
  });

  describe('#every', function() {
    it('should map to .all', function() {
      predicate.every.should.equal(predicate.all);
    });

    it('should return an object', function() {
      predicate.every().should.be.an.object;
    });

    it('should allow chaining', function() {
      predicate.every().equal(1, 1).str('5').val().should.be.ok;
      predicate.every().str('foo').contains(1, [1, 2, 3]).val().should.be.ok;
      predicate.every().str(1).contains(1, [1, 2, 3]).val().should.be.false;
      predicate.every().str('foo').contains(5, [1, 2, 3]).val().should.be.false;
    });
  });

  describe('#some', function() {
    it('should map to .any', function() {
      predicate.some.should.equal(predicate.any);
    });

    it('should return an object', function() {
      predicate.some().should.be.an.object;
    });

    it('should allow chaining', function() {
      predicate.some().equal(1, 1).str('5').val().should.be.ok;
      predicate.some().str('foo').contains(1, [1, 2, 3]).val().should.be.ok;
      predicate.some().str(1).contains(1, [1, 2, 3]).val().should.be.ok;
      predicate.some().str('foo').contains(5, [1, 2, 3]).val().should.be.ok;
      predicate.some().num('foo').contains(5, [1, 2, 3]).val().should.be.false;
    });
  });

  describe('#Lazy', function() {
    it('should call `val` when valueOf is called', function() {
      +(predicate.some().equal(1, 1).str('5')).should.be.ok;
      !!(predicate.some().equal(1, 1).str('5')).should.be.ok;
    });
  });

  describe('#partial', function() {
    var fn = null;

    before(function() {
      fn = predicate.partial(predicate.less, 1);
    });

    it('should return a fn', function() {
      fn.should.be.a.function;
    });

    it('should exec the fn as expected', function() {
      fn(2).should.be.ok;
    });
  });

  describe('#curry', function() {
    before(function() {
      this.add = function(a, b) {
        return a + b;
      };

      this.fn = predicate.curry(this.add);
    });

    it('should return an fn', function() {
      this.fn.should.be.a.function;
    });

    it('should source the original function', function() {
      this.fn.src.should.equal(this.add);
    });

    it('should throw a TypeError if no args are provided', function() {
      var err = null;
      try {
        this.fn();
      } catch(e) {
        err = e;
      }
      err.should.be.instanceof(TypeError);
    });

    it('should return a new curried fn for arity 1', function() {
      var fn = this.fn(1);
      fn.should.be.a.function;
      fn.src.should.equal(this.add);
      fn(2).should.equal(3);
    });

    it('should execute an arity 2 fn', function() {
      this.fn(1, 2).should.equal(3);
    });

    it('should curry with predicate.not', function() {
      var fn = predicate.not.equal(1);
      fn.should.be.a.function;
      fn(1).should.be.false;
      fn(2).should.be.true;
    });
  });

  describe('#mod', function() {
    it('should return a modulus value', function() {
      predicate.mod(6, 5).should.equal(1);
      predicate.mod(6, 6).should.equal(0);
    });
  });

  describe('#assign', function() {
    it('should copy values to a new object', function() {
      var x = { foo: 'bar' };
      var y = { bar: 'foo' };
      var z = predicate.assign(x, y);
      z.foo.should.equal('bar');
      z.bar.should.equal('foo');
    });
  });
});
