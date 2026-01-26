#!/usr/bin/env node

/**
 * Manual Testing Guide
 * 
 * Interactive script to guide manual testing of core functionality
 * after performance optimizations.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bright');
  console.log('='.repeat(60) + '\n');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset} `, resolve);
  });
}

async function testCalculator() {
  header('TEST 1: Calculator Produces Correct Results');
  
  log('Requirement: 8.1 - Calculator displays results with same accuracy', 'blue');
  console.log('\nTest Steps:');
  console.log('1. Navigate to calculator home page (/)');
  console.log('2. Enter test data:');
  console.log('   - Parent 1 Income: $80,000');
  console.log('   - Parent 2 Income: $50,000');
  console.log('   - Number of children: 2');
  console.log('   - Child 1: Age 8, 40% care with Parent 1');
  console.log('   - Child 2: Age 5, 40% care with Parent 1');
  console.log('3. Submit calculation');
  console.log('4. Verify results display correctly');
  console.log('5. Check breakdown view shows all calculation steps');
  console.log('6. Verify amounts are formatted correctly');
  
  console.log('\nExpected Results:');
  console.log('✓ Results display immediately');
  console.log('✓ Annual payment amount shown');
  console.log('✓ Monthly/fortnightly/weekly amounts calculated');
  console.log('✓ Breakdown view accessible');
  console.log('✓ All amounts formatted as currency');
  console.log('✓ No console errors');
  
  const result = await question('\nDid the calculator test PASS? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function testPDFExport() {
  header('TEST 2: PDF Export Generates Correct PDF');
  
  log('Requirement: 8.2 - PDF export generates PDF with all data', 'blue');
  console.log('\nTest Steps:');
  console.log('1. Complete a calculation (use Test 1 data)');
  console.log('2. Click "Export PDF" button');
  console.log('3. Wait for PDF generation');
  console.log('4. Verify PDF downloads/opens');
  console.log('5. Check PDF contains:');
  console.log('   - Assessment summary');
  console.log('   - Parent details');
  console.log('   - Child details');
  console.log('   - Calculation breakdown');
  console.log('   - Proper formatting and branding');
  
  console.log('\nExpected Results:');
  console.log('✓ PDF export button visible');
  console.log('✓ Loading indicator shown during generation');
  console.log('✓ PDF downloads successfully');
  console.log('✓ PDF contains all assessment data');
  console.log('✓ PDF is properly formatted');
  console.log('✓ No console errors');
  
  console.log('\n' + colors.yellow + 'IMPORTANT: Check Network tab - PDF libraries should lazy load!' + colors.reset);
  console.log('Look for: @react-pdf/renderer, expo-print, expo-sharing');
  
  const result = await question('\nDid the PDF export test PASS? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function testLawyerInquiry() {
  header('TEST 3: Lawyer Inquiry Form Submits Successfully');
  
  log('Requirement: 8.3 - Form saves lead to database successfully', 'blue');
  console.log('\nTest Steps:');
  console.log('1. Navigate to /lawyer-inquiry');
  console.log('2. Fill out form with test data:');
  console.log('   - Name: Test User');
  console.log('   - Email: test@example.com');
  console.log('   - Phone: 0400000000');
  console.log('   - Location: Sydney, NSW');
  console.log('   - Situation description');
  console.log('3. Check consent checkbox');
  console.log('4. Submit form');
  console.log('5. Verify success message');
  
  console.log('\nExpected Results:');
  console.log('✓ Form loads correctly');
  console.log('✓ All fields accept input');
  console.log('✓ Validation works (required fields)');
  console.log('✓ Submit button enabled after consent');
  console.log('✓ Success message displayed');
  console.log('✓ No console errors');
  
  console.log('\n' + colors.yellow + 'IMPORTANT: Check Network tab - Supabase should lazy load!' + colors.reset);
  console.log('Look for: @supabase/supabase-js loading on form submit');
  
  const result = await question('\nDid the lawyer inquiry test PASS? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function testNavigation() {
  header('TEST 4: Navigation Between All Routes');
  
  log('Requirement: 8.4 - Navigation loads pages without errors', 'blue');
  console.log('\nTest Routes:');
  const routes = [
    '/ - Calculator home',
    '/about - About page',
    '/faq - FAQ page',
    '/contact - Contact page',
    '/blog - Blog index',
    '/blog/how-to-calculate-child-support - Sample blog post',
    '/special-circumstances - Special circumstances',
    '/lawyer-inquiry - Lawyer inquiry form',
    '/admin/login - Admin login'
  ];
  
  routes.forEach(route => console.log(`  ${route}`));
  
  console.log('\nTest Steps:');
  console.log('1. Navigate to each route');
  console.log('2. Verify page loads completely');
  console.log('3. Check for missing content');
  console.log('4. Verify no console errors');
  console.log('5. Test back/forward navigation');
  console.log('6. Test direct URL access');
  
  console.log('\nExpected Results:');
  console.log('✓ All routes load successfully');
  console.log('✓ Content displays correctly');
  console.log('✓ No missing images or broken links');
  console.log('✓ Navigation transitions smooth');
  console.log('✓ Back/forward buttons work');
  console.log('✓ Direct URL access works');
  console.log('✓ No console errors');
  
  const result = await question('\nDid the navigation test PASS? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function checkLazyLoading() {
  header('BONUS: Lazy Loading Verification');
  
  log('Verify lazy loading is working correctly', 'blue');
  console.log('\nOpen Chrome DevTools → Network tab');
  console.log('\n1. PDF Libraries:');
  console.log('   - Load calculator page');
  console.log('   - Verify @react-pdf/renderer NOT loaded initially');
  console.log('   - Click PDF export button');
  console.log('   - Verify @react-pdf/renderer loads on-demand');
  
  console.log('\n2. Supabase:');
  console.log('   - Load calculator page');
  console.log('   - Verify @supabase/supabase-js NOT loaded');
  console.log('   - Navigate to /lawyer-inquiry and submit');
  console.log('   - Verify @supabase/supabase-js loads on submit');
  
  console.log('\n3. Analytics:');
  console.log('   - Load any page');
  console.log('   - Check Network timeline');
  console.log('   - Verify react-ga4 loads after ~2 seconds');
  console.log('   - Verify @vercel/analytics loads after initial render');
  
  const result = await question('\nIs lazy loading working correctly? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function checkConsole() {
  header('Console Error Check');
  
  log('Check browser console for errors', 'blue');
  console.log('\nOpen Chrome DevTools → Console tab');
  console.log('Look for:');
  console.log('  ✓ No red errors');
  console.log('  ✓ No yellow warnings (except expected ones)');
  console.log('  ✓ No failed network requests');
  
  const result = await question('\nIs the console clean (no errors)? (y/n): ');
  return result.toLowerCase() === 'y';
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'bright');
  log('║     Manual Functionality Testing Guide                    ║', 'bright');
  log('║     Lighthouse Performance Optimization - Task 13.2        ║', 'bright');
  log('╚════════════════════════════════════════════════════════════╝', 'bright');
  
  console.log('\nThis script will guide you through manual testing of core');
  console.log('functionality after performance optimizations.\n');
  
  log('Prerequisites:', 'yellow');
  console.log('1. Build the app: npm run build:web');
  console.log('2. Start preview server: npx serve dist -p 3000');
  console.log('3. Open http://localhost:3000 in Chrome');
  console.log('4. Open Chrome DevTools (F12)');
  
  const ready = await question('\nAre you ready to begin testing? (y/n): ');
  if (ready.toLowerCase() !== 'y') {
    log('\nExiting. Run this script when ready to test.', 'yellow');
    rl.close();
    return;
  }
  
  const results = {
    calculator: false,
    pdfExport: false,
    lawyerInquiry: false,
    navigation: false,
    lazyLoading: false,
    console: false
  };
  
  // Run tests
  results.calculator = await testCalculator();
  results.pdfExport = await testPDFExport();
  results.lawyerInquiry = await testLawyerInquiry();
  results.navigation = await testNavigation();
  results.lazyLoading = await checkLazyLoading();
  results.console = await checkConsole();
  
  // Summary
  header('TEST SUMMARY');
  
  const tests = [
    { name: 'Calculator Functionality', result: results.calculator, req: '8.1' },
    { name: 'PDF Export', result: results.pdfExport, req: '8.2' },
    { name: 'Lawyer Inquiry Form', result: results.lawyerInquiry, req: '8.3' },
    { name: 'Navigation', result: results.navigation, req: '8.4' },
    { name: 'Lazy Loading', result: results.lazyLoading, req: 'Bonus' },
    { name: 'Console Clean', result: results.console, req: 'Bonus' }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'green' : 'red';
    log(`${status} - ${test.name} (Req ${test.req})`, color);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log('🎉 ALL TESTS PASSED! 🎉', 'green');
    log('\nAll functionality works correctly after optimizations.', 'green');
    log('Task 13.2 can be marked as complete.', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED', 'red');
    log('\nPlease investigate failed tests before proceeding.', 'yellow');
    log('Check console errors and network requests.', 'yellow');
  }
  console.log('='.repeat(60) + '\n');
  
  rl.close();
}

// Run the script
main().catch(error => {
  console.error('Error running manual tests:', error);
  rl.close();
  process.exit(1);
});
