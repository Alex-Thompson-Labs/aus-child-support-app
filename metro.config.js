// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable tree shaking and optimization for production builds
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Drop console.log in production builds
      drop_console: process.env.NODE_ENV === 'production',
    },
  },
};

// Optimize resolver for faster builds and better tree shaking
config.resolver = {
  ...config.resolver,
  // Disable symlinks for faster resolution
  // disableHierarchicalLookup: true, // Temporarily disabled - causing module resolution issues
};

module.exports = config;