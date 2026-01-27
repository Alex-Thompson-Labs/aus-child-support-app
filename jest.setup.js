/**
 * Jest Setup File
 * 
 * Suppress expected console warnings during tests to prevent build failures
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Suppress specific React warnings that are expected in tests
console.error = (...args) => {
  const message = args[0];
  
  // Suppress React act() warnings - these are expected in async tests
  if (
    typeof message === 'string' &&
    (message.includes('act(...)') ||
     message.includes('wrapped in act') ||
     message.includes('suspended resource'))
  ) {
    return;
  }
  
  // Call original console.error for other messages
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  const message = args[0];
  
  // Suppress React act() warnings
  if (
    typeof message === 'string' &&
    message.includes('act(...)')
  ) {
    return;
  }
  
  // Call original console.warn for other messages
  originalWarn.call(console, ...args);
};
