module.exports = {
  root: true,

  env: {
    browser: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2015,
    ecmaFeatures: {
      jsx: true
    },
  },

  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-sonarjs'
  ],

  extends: [
    'plugin:@typescript-eslint/eslint-plugin/recommended',
    'plugin:eslint-plugin-sonarjs/recommended'
  ],

  rules: {
    // 'import/extensions': [ 'error', { 'js': 'never', 'vue': 'never', 'json': 'always' } ],
    'no-console': 'off',
    'no-multiple-empty-lines': [ 'error', { 'max': 2 } ],
    'no-unused-vars': 'off',
  },
};
