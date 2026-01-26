#!/usr/bin/env node

/**
 * Font Loading Optimization Validation Script
 * 
 * This script validates that font loading optimizations are correctly implemented:
 * 1. No render-blocking font requests
 * 2. Fonts use font-display: swap (FOIT prevention)
 * 3. Font preloading is configured (if applicable)
 * 
 * Requirements: 5.1, 5.2, 5.5
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Font Loading Optimization...\n');

let hasErrors = false;
const warnings = [];
const successes = [];

// ============================================================================
// Test 1: Check app/_layout.tsx for font-display: swap
// ============================================================================
console.log('📋 Test 1: Checking for font-display: swap in app/_layout.tsx...');

const layoutPath = path.join(__dirname, '../app/_layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  
  // Check for font-display: swap
  const fontDisplayMatches = layoutContent.match(/font-display:\s*swap/g);
  
  if (fontDisplayMatches && fontDisplayMatches.length > 0) {
    successes.push(`✅ Found ${fontDisplayMatches.length} font-display: swap declarations in app/_layout.tsx`);
  } else {
    hasErrors = true;
    console.error('❌ FAIL: No font-display: swap found in app/_layout.tsx');
  }
  
  // Check for @font-face declarations
  const fontFaceMatches = layoutContent.match(/@font-face/g);
  if (fontFaceMatches && fontFaceMatches.length > 0) {
    successes.push(`✅ Found ${fontFaceMatches.length} @font-face declarations`);
  } else {
    warnings.push('⚠️  No @font-face declarations found (may be using system fonts only)');
  }
} else {
  hasErrors = true;
  console.error('❌ FAIL: app/_layout.tsx not found');
}

// ============================================================================
// Test 2: Check app/+html.tsx for font-display: swap
// ============================================================================
console.log('\n📋 Test 2: Checking for font-display: swap in app/+html.tsx...');

const htmlPath = path.join(__dirname, '../app/+html.tsx');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  // Check for font-display: swap
  const fontDisplayMatches = htmlContent.match(/font-display:\s*swap/g);
  
  if (fontDisplayMatches && fontDisplayMatches.length > 0) {
    successes.push(`✅ Found ${fontDisplayMatches.length} font-display: swap declarations in app/+html.tsx`);
  } else {
    hasErrors = true;
    console.error('❌ FAIL: No font-display: swap found in app/+html.tsx');
  }
} else {
  warnings.push('⚠️  app/+html.tsx not found (may not be required for this setup)');
}

// ============================================================================
// Test 3: Check for font preload links (optional but recommended)
// ============================================================================
console.log('\n📋 Test 3: Checking for font preload links...');

const hasPreloadInLayout = fs.existsSync(layoutPath) && 
  fs.readFileSync(layoutPath, 'utf-8').includes('rel="preload"') &&
  fs.readFileSync(layoutPath, 'utf-8').includes('as="font"');

const hasPreloadInHtml = fs.existsSync(htmlPath) && 
  fs.readFileSync(htmlPath, 'utf-8').includes('rel="preload"') &&
  fs.readFileSync(htmlPath, 'utf-8').includes('as="font"');

if (hasPreloadInLayout || hasPreloadInHtml) {
  successes.push('✅ Font preload links found');
} else {
  warnings.push('⚠️  No font preload links found (optional - using system fonts may not require preloading)');
}

// ============================================================================
// Test 4: Check for render-blocking font patterns (anti-patterns)
// ============================================================================
console.log('\n📋 Test 4: Checking for render-blocking font patterns...');

const filesToCheck = [layoutPath, htmlPath].filter(p => fs.existsSync(p));
let hasRenderBlockingFonts = false;

filesToCheck.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for font-display: block or font-display: auto (render-blocking)
  if (content.match(/font-display:\s*(block|auto)/)) {
    hasErrors = true;
    hasRenderBlockingFonts = true;
    console.error(`❌ FAIL: Found render-blocking font-display in ${path.basename(filePath)}`);
  }
  
  // Check for synchronous font loading
  if (content.includes('<link') && content.includes('stylesheet') && content.includes('fonts.googleapis.com')) {
    warnings.push(`⚠️  Found Google Fonts stylesheet link in ${path.basename(filePath)} - ensure it's async or uses font-display: swap`);
  }
});

if (!hasRenderBlockingFonts) {
  successes.push('✅ No render-blocking font patterns detected');
}

// ============================================================================
// Test 5: Verify system font stack is used (best practice)
// ============================================================================
console.log('\n📋 Test 5: Checking for system font stack...');

const hasSystemFonts = filesToCheck.some(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.includes('system-ui') || 
         content.includes('-apple-system') || 
         content.includes('BlinkMacSystemFont');
});

if (hasSystemFonts) {
  successes.push('✅ System font stack detected (optimal for performance)');
} else {
  warnings.push('⚠️  No system font stack found - consider using system fonts for best performance');
}

// ============================================================================
// Test 6: Check public/fonts directory (if custom fonts are used)
// ============================================================================
console.log('\n📋 Test 6: Checking for custom font files...');

const fontsDir = path.join(__dirname, '../public/fonts');
if (fs.existsSync(fontsDir)) {
  const fontFiles = fs.readdirSync(fontsDir);
  
  if (fontFiles.length > 0) {
    successes.push(`✅ Found ${fontFiles.length} font files in public/fonts/`);
    
    // Check for woff2 format (best compression)
    const woff2Files = fontFiles.filter(f => f.endsWith('.woff2'));
    if (woff2Files.length > 0) {
      successes.push(`✅ Found ${woff2Files.length} woff2 font files (optimal format)`);
    } else {
      warnings.push('⚠️  No woff2 font files found - woff2 provides best compression');
    }
  } else {
    warnings.push('⚠️  public/fonts/ directory is empty');
  }
} else {
  successes.push('✅ No custom fonts directory (using system fonts is optimal)');
}

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(70));

if (successes.length > 0) {
  console.log('\n✅ SUCCESSES:');
  successes.forEach(msg => console.log(`   ${msg}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(msg => console.log(`   ${msg}`));
}

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED');
  console.log('\nFont loading optimization requirements not met.');
  console.log('Please ensure:');
  console.log('  1. All @font-face declarations include font-display: swap');
  console.log('  2. No render-blocking font patterns (font-display: block/auto)');
  console.log('  3. Font preloading is configured for critical fonts (optional)');
  process.exit(1);
} else {
  console.log('\n✅ VALIDATION PASSED');
  console.log('\nFont loading optimization is correctly implemented:');
  console.log('  ✓ font-display: swap prevents FOIT (Flash of Invisible Text)');
  console.log('  ✓ No render-blocking font requests detected');
  console.log('  ✓ Text will be visible during font loading');
  console.log('\nRequirements validated: 5.1, 5.2, 5.5');
  process.exit(0);
}
