module.exports = {
  extends: ['@landau/eslint-config', '@landau/eslint-config/rules/jsdoc'],
  plugins: ['mocha'],
  rules: {
    'prefer-destructuring': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'max-classes-per-file': 'off',
    // FIXME: This rule is new and should be used where appropriate.
    'prefer-arrow-callback': 'off',
  },
};
