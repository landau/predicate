'use strict';

const utils = require('./lib/utils');
const predicates = require('./lib/predicates');
const chain = require('./lib/chain');
const others = require('./lib/other');
const pkg = require('./package.json');

const predicate = {
  VERSION: pkg.version,
  ...utils,
  ...predicates,
  ...chain,
  ...others
};

module.exports = predicate;
