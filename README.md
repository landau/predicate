[![Build Status](https://travis-ci.org/landau/is.png?branch=master)](https://travis-ci.org/landau/is)
[![NPM](https://nodei.co/npm/is-predicate.png?downloads=true&stars=true)](https://nodei.co/npm/is-predicate/)
# is.js - Adding clarity and conciseness to your JS through predicates

`is.js` is a predicate library for JS. `is` doesn't have any dependencies which makes it easy to integrate into new and existing projects.

## Docs
[landau.github.io/is](http://landau.github.io/is/)

## install
> npm install --save is-predicate

or

download the file from the [dist](https://github.com/landau/is/dist/is.js) directory


## Usage
```js
is.equal(1, 1); // true
is.not.pos(-1); // true
is.ternary(true, 'foo', 'bar'); // foo
is.fn(function () {}); // true
is.not.equal(1, 3); // true
```

### Every/Some

Every and some are functions that allow you to chain predicate calls. The calls are not evaluated until `.val()` is executed on the chain.

```js
// All evaluations must be true
is.every().equal(1, 1).contains([1, 2, 3], 2).val(); // true
is.all().equal(1, 5).contains([1, 2, 3], 2).val(); // false

// At least one eval must be true
is.some().equal(1, 1).contains([1, 2, 3], 2).val(); // true
is.any().equal(1, 5).contains([1, 2, 3], 2).val(); // true
is.some().equal(1, 5).contains([1, 2, 3], 5).val(); // false
```

Alternaively to `.val` you can execute `valueOf`
```js
// All evaluations must be true
!!is.every().equal(1, 1).contains([1, 2, 3], 2); // true
```

> Notice the alias of `all/any` if you prefer that flavor

> NOTE: Chaining doesnt work with `.not` yet.

## Author
[Trevor Landau](http://trevorlandau.net)

## contributing
- Suggestions welcome!
- Tests!
- Ping me on [twitter](http://twitter.com/trevor_landau) if I take too long to respond! That probably means I missed the alert/email.

## Tests

To run tests, install devDeps and type `npm ts`

## Building

To build, type `npm run build`.

This will create a UMDified version of is in the `dist` directory along with a minified version.
