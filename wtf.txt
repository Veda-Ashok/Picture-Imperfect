module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',

    'plugin:jsx-a11y/recommended',

    'airbnb',

    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-bitwise': 0,
  },
}
