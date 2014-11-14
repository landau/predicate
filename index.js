'use strict';

var utils = require('./lib/utils');
var is = {};
is.VERSION = '0.10.1';

[
  utils,
  require('./lib/predicates'),
  require('./lib/chain'),
  require('./lib/other'),
].reduce(utils.assign, is);

module.exports = is;
