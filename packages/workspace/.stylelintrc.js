module.exports = {
  plugins: [ 'stylelint-scss' ],

  extends: [ 'stylelint-config-standard' ],

  rules: {
    'at-rule-no-unknown': [ true, { 'ignoreAtRules': [ 'tailwind' ] } ],
    'no-empty-source': null,
    'selector-class-pattern': [ '^([A-Z][a-zA-Z0-9]*)|([a-z][a-z0-9]*)(-[a-z0-9]+)*$', { message: '.NavBar / .nav-bar' } ],
  },
};
