/**
 * Engine module exports
 *
 * This module re-exports all engine components for clean imports.
 * Engine modules handle specialised calculation logic:
 * - rates-engine: FAR/MAR rate application
 * - multi-case-engine: Multi-case caps (Formula 3)
 */

// Re-export rates engine
export * from './rates-engine';

// Re-export multi-case engine
export * from './multi-case-engine';

