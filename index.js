'use strict';

var utils = require('./lib/utils');
var predicate = {};
predicate.VERSION = '0.10.2';

[
  utils,
  require('./lib/predicates'),
  require('./lib/chain'),
  require('./lib/other'),
].reduce(utils.assign, predicate);

module.exports = predicate;
