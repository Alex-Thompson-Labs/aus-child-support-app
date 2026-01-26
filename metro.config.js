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
      // Additional optimizations for smaller bundles
      dead_code: true,
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: true,
      keep_fargs: false,
      hoist_vars: false,
      if_return: true,
      join_vars: true,
      side_effects: true,
    },
    mangle: {
      // Mangle variable names for smaller bundle size
      toplevel: true,
    },
    output: {
      // Remove comments and beautify for smaller size
      comments: false,
      beautify: false,
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