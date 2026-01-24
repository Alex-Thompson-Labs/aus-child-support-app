// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['app/blog/**/*.tsx'],
    rules: {
      'react/no-unescaped-entities': 'off', // Allow apostrophes and quotes in blog content
    },
  },
]);
