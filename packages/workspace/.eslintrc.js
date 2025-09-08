module.exports = {
  root: true,

  env: {
    browser: true,
  },

  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaVersion: 2015,
    ecmaFeatures: {
      jsx: true
    },
  },

  globals: {
    head: true,
  },

  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-vue',
    'eslint-plugin-sonarjs'
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
      }
    },
  },  

  extends: [
    'plugin:eslint-plugin-import/recommended',
    'plugin:eslint-plugin-vue/essential',
    'plugin:eslint-plugin-sonarjs/recommended',
  ],

  rules: {
    'import/extensions': [ 'error', { 'js': 'never', 'vue': 'never', 'json': 'always' } ],
    'no-console': 'off',
    'no-multiple-empty-lines': [ 'error', { 'max': 2 } ],
    'no-unused-vars': 'off',
    'object-curly-newline': 'off',
  },
};