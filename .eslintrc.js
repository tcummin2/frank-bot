module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint-config-airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    'linebreak-style': 'off',
    'max-len': ['error', 140],
    'arrow-parens': ['error', 'as-needed']
  }
}
