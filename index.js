'use strict';

const utils = require('./lib/utils');
const predicate = {};
predicate.VERSION = '1.0.0';

[
  utils,
  require('./lib/predicates'),
  require('./lib/chain'),
  require('./lib/other'),
].reduce(utils.assign, predicate);

module.exports = predicate;
