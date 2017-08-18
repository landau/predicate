    ## changelog

    #### 1.1.2
    - Add `includes` as alias to `contains`

    #### 1.1.1
    - Improve perf around chaining methods

    #### 1.1.0
    - add `and` and `or` functions

    #### 1.0.0
    - Convert to nodejs 4.x es6 support

    #### 0.12.0
    - Add `predicate.matches`

    #### 0.11.0
    - Add alias `predicate.nan`
    - Add alias `predicate.regex` and `predicate.regexp`
    - Add alias `predicate.le`
    - Add alias `predicate.ge`

    #### 0.10.2
    - Changed from is.js to predicate.js

    #### 0.10.0
    - Added `is.primitive` ([@tgriesser](https://twitter.com/tgriesser))
    - Update docs with `is.empty` ([@BlaineBublitz](https://twitter.com/BlaineBublitz))
    - `is.empty` now throws for invalid types

    #### 0.9.0
    - Added `is.is` based off polyfill from MDN
    - Added alias for `is.object` and `is.arr`
    - `is.num(NaN)` now returns false

    #### 0.8.2
    - Correctly test for NaN in `is.contains`

    #### 0.8.1
    - Fix currying issue with `is.not`

    #### 0.8.0
    - Added `is.curry` which is used internally
    - Added autocurrying for all functions that are arity 2
    - `is.complement` can now return a function instead of just `booleans`
    - `is.truthy` and `is.falsey` now respect js falsey values (eg 0, '', etc)

    #### 0.7.3
    - Refactored file structure

    #### 0.7.2
    - Update docs

    #### 0.7.1
    - Converted module to node style package
    - build process uses browserify standalone
    - Tests now in JS instead of CS (run much faster!)
    - Internal changes around chaining
    - Dropped gulp

    #### 0.7.0
    - Added `even`, `odd`
    - Exposed `mod`
    - Even more improved docs!

    #### 0.6.0
    - Removed `cmp`
    - Added `is.empty`
    - Alias `is.invert` as `is.complement`
    - Expose `is.partial` from internals
    - Improved docs

    #### 0.5.0
    - Added `is.zero`
    - Fix `is.object` and `is.error`
    - `is.ternary` now supports partial application
    - `is.gt`, `is.gtEq`, `is.lt`, `is.ltEq` aliases added

    #### 0.4.0
    - Support for lazy chain evaluation

    #### 0.3.0
    - Expose `is.invert
    - Added `is.contains
    - Added `is.has
    - Remove bower support

    #### 0.2.0
    - Added `is.pos`
    - Added `is.neg`
    - Added `is.ternary`
    - Added `is.not`, which inverses all boolean returning predicate methods

    #### 0.1.1
    - Added is.bool/boolean method

    #### 0.1.0
    - Release
