module.exports = {
  extends: ['@landau/eslint-config', '@landau/eslint-config/rules/jsdoc'],
  plugins: ['mocha'],
  rules: {
    'prefer-destructuring': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off'
  }
};
