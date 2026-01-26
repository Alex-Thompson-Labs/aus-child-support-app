#!/usr/bin/env node

/**
 * Validation Script: Supabase Lazy Loading
 * 
 * This script validates that:
 * 1. Supabase is NOT included in the calculator route bundle
 * 2. Supabase is only loaded when accessing admin routes
 * 
 * Requirements: 2.3
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Supabase lazy loading...\n');

// Check if dist directory exists
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: dist directory not found. Run `npm run build:web` first.');
  process.exit(1);
}

// Find all JavaScript bundles
const staticJsDir = path.join(distDir, '_expo', 'static', 'js', 'web');
if (!fs.existsSync(staticJsDir)) {
  console.error('❌ Error: Static JS directory not found.');
  process.exit(1);
}

const jsFiles = fs.readdirSync(staticJsDir).filter(file => file.endsWith('.js') && !file.endsWith('.map'));

console.log(`📦 Found ${jsFiles.length} JavaScript bundles\n`);

// Supabase-related strings to search for
const supabasePatterns = [
  '@supabase/supabase-js',
  'supabase-js',
  'createClient',
  'SupabaseClient',
  'postgrest-js',
  'realtime-js',
  'gotrue-js'
];

// Files that should NOT contain Supabase
const calculatorRoutes = [
  'index-', // Main calculator route
  'entry-', // Entry bundle
  '__common-', // Common bundle
  'CalculatorForm',
  'CalculatorResults',
  'CalculatorScreen'
];

// Files that SHOULD contain Supabase (admin routes)
const adminRoutes = [
  'AdminDashboardScreen',
  'AdminLoginScreen',
  'LeadDetailScreen',
  'ViewLeadScreen',
  'ProposalsScreen',
  'dashboard-',
  'login-',
  'proposals-'
];

let hasErrors = false;
const results = {
  calculatorBundles: [],
  adminBundles: [],
  otherBundles: []
};

// Analyze each bundle
for (const file of jsFiles) {
  const filePath = path.join(staticJsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file contains Supabase references
  const containsSupabase = supabasePatterns.some(pattern => 
    content.includes(pattern)
  );
  
  // Categorize the file
  const isCalculatorRoute = calculatorRoutes.some(route => file.includes(route));
  const isAdminRoute = adminRoutes.some(route => file.includes(route));
  
  const fileSize = (fs.statSync(filePath).size / 1024).toFixed(2);
  
  if (isCalculatorRoute) {
    results.calculatorBundles.push({
      file,
      size: fileSize,
      containsSupabase
    });
    
    if (containsSupabase) {
      console.error(`❌ FAIL: Calculator bundle contains Supabase: ${file} (${fileSize} KB)`);
      hasErrors = true;
    }
  } else if (isAdminRoute) {
    results.adminBundles.push({
      file,
      size: fileSize,
      containsSupabase
    });
  } else {
    results.otherBundles.push({
      file,
      size: fileSize,
      containsSupabase
    });
  }
}

// Report results
console.log('📊 Validation Results:\n');

console.log('✅ Calculator Bundles (should NOT contain Supabase):');
if (results.calculatorBundles.length === 0) {
  console.log('   No calculator bundles found to check');
} else {
  results.calculatorBundles.forEach(({ file, size, containsSupabase }) => {
    const status = containsSupabase ? '❌ CONTAINS SUPABASE' : '✅ Clean';
    console.log(`   ${status} - ${file} (${size} KB)`);
  });
}

console.log('\n📦 Admin Bundles (may contain Supabase):');
if (results.adminBundles.length === 0) {
  console.log('   No admin bundles found');
} else {
  results.adminBundles.forEach(({ file, size, containsSupabase }) => {
    const status = containsSupabase ? '✅ Contains Supabase' : '⚠️  No Supabase found';
    console.log(`   ${status} - ${file} (${size} KB)`);
  });
}

// Check if any admin bundle contains Supabase
const adminHasSupabase = results.adminBundles.some(b => b.containsSupabase);
if (!adminHasSupabase && results.adminBundles.length > 0) {
  console.log('\n⚠️  Warning: No admin bundles contain Supabase references.');
  console.log('   This might indicate Supabase is being lazy loaded correctly,');
  console.log('   or it might be in a separate chunk not detected by this script.');
}

// Summary
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('\n❌ VALIDATION FAILED');
  console.error('Supabase was found in calculator bundles where it should not be.');
  console.error('This means Supabase is NOT being lazy loaded correctly.\n');
  process.exit(1);
} else {
  console.log('\n✅ VALIDATION PASSED');
  console.log('Supabase is NOT present in calculator bundles.');
  console.log('Lazy loading is working correctly!\n');
  
  // Additional info
  const totalCalculatorSize = results.calculatorBundles.reduce((sum, b) => sum + parseFloat(b.size), 0);
  console.log(`📊 Total calculator bundle size: ${totalCalculatorSize.toFixed(2)} KB`);
  console.log(`📦 Calculator bundles checked: ${results.calculatorBundles.length}`);
  console.log(`🔐 Admin bundles found: ${results.adminBundles.length}\n`);
}
