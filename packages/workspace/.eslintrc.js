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
        extensions: [ '.js', '.jsx', '.ts', '.tsx', '.vue' ]
      }
    },
  },  

  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin-import/recommended',
    'plugin:eslint-plugin-vue/recommended',
    'plugin:eslint-plugin-sonarjs/recommended',
  ],

  rules: {
    'vue/singleline-html-element-content-newline': 'off',
  },
};