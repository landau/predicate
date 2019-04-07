module.exports = {
  extends: ['@landau/eslint-config', '@landau/eslint-config/rules/ts'],
  plugins: ['mocha'],
  rules: {
    'prefer-destructuring': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    /**
     * @see https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/README.md
     */
    // enforces handling of callbacks for async tests
    'mocha/handle-done-callback': 'error',
    // disallow exclusive mocha tests
    'mocha/no-exclusive-tests': 'error',
    // disallow global tests
    'mocha/no-global-tests': 'warn',
    // disallow hooks for a single test or test suite
    'mocha/no-hooks-for-single-case': 'off',
    // disallow hooks
    'mocha/no-hooks': 'off',
    // disallow identical titles
    'mocha/no-identical-title': 'warn',
    // disallow arrow functions as arguments to mocha globals
    'mocha/no-mocha-arrows': 'off',
    // disallow pending/unimplemented mocha tests
    'mocha/no-pending-tests': 'off',
    // disallow returning in a test or hook function that uses a callback
    'mocha/no-return-and-callback': 'error',
    // disallow duplicate uses of a hook at the same level inside a describe
    'mocha/no-sibling-hooks': 'warn',
    // disallow skipped mocha tests (fixable)
    'mocha/no-skipped-tests': 'warn',
    // disallow synchronous tests
    'mocha/no-synchronous-tests': 'off',
    // disallow top-level hooks
    'mocha/no-top-level-hooks': 'error',
    // match suite descriptions against a pre-configured regular expression
    'mocha/valid-suite-description': 'warn',
    // match test descriptions against a pre-configured regular expression
    'mocha/valid-test-description': 'off'
  }
};
