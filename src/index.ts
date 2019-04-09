'use strict';

import * as chain from './lib/chain';
import * as predicates from './lib/predicates';
import * as other from './lib/other';
import * as utils from './lib/utils';
import pkg from '../package.json';

export default Object.assign(
  {
    VERSION: pkg.version
  },
  chain,
  predicates,
  other,
  utils
);
