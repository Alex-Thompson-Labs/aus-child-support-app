// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports for better tree-shaking
config.resolver.unstable_enablePackageExports = true;

// Optimize for web bundle size
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Remove console.log in production
      drop_console: process.env.NODE_ENV === 'production',
      // Enable dead code elimination
      dead_code: true,
      // Remove unused variables
      unused: true,
    },
    mangle: {
      // Mangle variable names for smaller bundle
      toplevel: true,
    },
  },
};

module.exports = config;
