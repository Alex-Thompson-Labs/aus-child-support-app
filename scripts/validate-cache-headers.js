#!/usr/bin/env node

/**
 * Cache Headers Validation Script
 * 
 * This script validates that cache headers are properly applied to different asset types
 * on the deployed Vercel site.
 * 
 * Requirements validated:
 * - 3.1: Static JS bundles have max-age=31536000, immutable
 * - 3.2: HTML files have max-age=0, must-revalidate
 * - 3.3: Images have max-age=31536000, immutable
 * - 3.4: Fonts have max-age=31536000, immutable
 * - 3.5: Zero uncached assets for static resources
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.VERCEL_URL || 'https://auschildsupport.com.au';

// Test cases for different asset types
const TEST_CASES = [
  {
    name: 'HTML File (index)',
    path: '/',
    expectedCacheControl: 'public, max-age=0, must-revalidate',
    requirement: '3.2',
    assetType: 'HTML'
  },
  {
    name: 'HTML File (blog)',
    path: '/blog/how-to-calculate-child-support.html',
    expectedCacheControl: 'public, max-age=0, must-revalidate',
    requirement: '3.2',
    assetType: 'HTML'
  },
  {
    name: 'Static JS Bundle',
    path: '/_expo/static/js/web/entry-*.js',
    expectedCacheControl: 'public, max-age=31536000, immutable',
    requirement: '3.1',
    assetType: 'JavaScript',
    isDynamic: true
  },
  {
    name: 'PNG Image',
    path: '/brand-logo.png',
    expectedCacheControl: 'public, max-age=31536000, immutable',
    requirement: '3.3',
    assetType: 'Image'
  },
  {
    name: 'Font File',
    path: '/fonts/inter-var.woff2',
    expectedCacheControl: 'public, max-age=31536000, immutable',
    requirement: '3.4',
    assetType: 'Font',
    optional: true // Font might not exist yet
  }
];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

/**
 * Fetch headers for a given URL (follows redirects)
 */
function fetchHeaders(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects === 0) {
      reject(new Error('Too many redirects'));
      return;
    }
    
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { method: 'HEAD' }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http') 
          ? res.headers.location 
          : new URL(res.headers.location, url).toString();
        
        // Follow redirect
        fetchHeaders(redirectUrl, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        url: url
      });
    });
    
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Find actual JS bundle path by fetching index.html
 */
async function findJsBundlePath(baseUrl) {
  return new Promise((resolve, reject) => {
    const protocol = baseUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(baseUrl, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http') 
          ? res.headers.location 
          : new URL(res.headers.location, baseUrl).toString();
        
        // Follow redirect
        findJsBundlePath(redirectUrl)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Look for _expo/static/js/web/ paths in the HTML
        const match = data.match(/\/_expo\/static\/js\/web\/[^"']+\.js/);
        if (match) {
          resolve(match[0]);
        } else {
          reject(new Error('Could not find JS bundle path in HTML'));
        }
      });
    });
    
    request.on('error', reject);
  });
}

/**
 * Normalize cache control header for comparison
 */
function normalizeCacheControl(cacheControl) {
  if (!cacheControl) return '';
  
  // Split by comma, trim, sort, and rejoin
  return cacheControl
    .split(',')
    .map(part => part.trim())
    .sort()
    .join(', ');
}

/**
 * Check if cache control matches expected value
 */
function matchesCacheControl(actual, expected) {
  const normalizedActual = normalizeCacheControl(actual);
  const normalizedExpected = normalizeCacheControl(expected);
  
  return normalizedActual === normalizedExpected;
}

/**
 * Validate a single test case
 */
async function validateTestCase(testCase, baseUrl) {
  let url = baseUrl + testCase.path;
  
  // Handle dynamic paths (e.g., JS bundles with hashes)
  if (testCase.isDynamic) {
    try {
      const actualPath = await findJsBundlePath(baseUrl);
      url = baseUrl + actualPath;
      console.log(`${colors.gray}  Found bundle: ${actualPath}${colors.reset}`);
    } catch (error) {
      return {
        ...testCase,
        status: 'error',
        error: error.message
      };
    }
  }
  
  try {
    const response = await fetchHeaders(url);
    
    // Check if resource exists
    if (response.statusCode === 404) {
      if (testCase.optional) {
        return {
          ...testCase,
          status: 'skipped',
          message: 'Resource not found (optional)'
        };
      }
      return {
        ...testCase,
        status: 'error',
        error: `Resource not found (404): ${url}`
      };
    }
    
    if (response.statusCode !== 200) {
      return {
        ...testCase,
        status: 'error',
        error: `Unexpected status code: ${response.statusCode}`
      };
    }
    
    // Check cache control header
    const cacheControl = response.headers['cache-control'];
    
    if (!cacheControl) {
      return {
        ...testCase,
        status: 'fail',
        actualCacheControl: '(missing)',
        error: 'Cache-Control header is missing'
      };
    }
    
    const matches = matchesCacheControl(cacheControl, testCase.expectedCacheControl);
    
    return {
      ...testCase,
      status: matches ? 'pass' : 'fail',
      actualCacheControl: cacheControl,
      url: url
    };
  } catch (error) {
    return {
      ...testCase,
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Print test result
 */
function printResult(result) {
  const statusSymbol = {
    pass: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    skipped: `${colors.yellow}⊘${colors.reset}`
  }[result.status];
  
  console.log(`\n${statusSymbol} ${result.name} (Req ${result.requirement})`);
  console.log(`  ${colors.gray}Asset Type: ${result.assetType}${colors.reset}`);
  
  if (result.url) {
    console.log(`  ${colors.gray}URL: ${result.url}${colors.reset}`);
  }
  
  if (result.status === 'pass') {
    console.log(`  ${colors.green}Cache-Control: ${result.actualCacheControl}${colors.reset}`);
  } else if (result.status === 'fail') {
    console.log(`  ${colors.red}Expected: ${result.expectedCacheControl}${colors.reset}`);
    console.log(`  ${colors.red}Actual:   ${result.actualCacheControl}${colors.reset}`);
    if (result.error) {
      console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  } else if (result.status === 'error') {
    console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
  } else if (result.status === 'skipped') {
    console.log(`  ${colors.yellow}${result.message}${colors.reset}`);
  }
}

/**
 * Main validation function
 */
async function validateCacheHeaders() {
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║         Cache Headers Validation Report                   ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\n${colors.gray}Base URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.gray}Timestamp: ${new Date().toISOString()}${colors.reset}\n`);
  
  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await validateTestCase(testCase, BASE_URL);
    results.push(result);
    printResult(result);
  }
  
  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const errors = results.filter(r => r.status === 'error').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const total = results.length - skipped;
  
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Summary${colors.reset}\n`);
  console.log(`  Total Tests:    ${total}`);
  console.log(`  ${colors.green}Passed:         ${passed}${colors.reset}`);
  console.log(`  ${colors.red}Failed:         ${failed}${colors.reset}`);
  console.log(`  ${colors.red}Errors:         ${errors}${colors.reset}`);
  console.log(`  ${colors.yellow}Skipped:        ${skipped}${colors.reset}`);
  
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  console.log(`  Success Rate:   ${successRate}%`);
  
  console.log(`\n${colors.blue}Requirements Coverage${colors.reset}\n`);
  console.log(`  ${colors.gray}3.1 Static JS bundles:     ${results.find(r => r.requirement === '3.1')?.status === 'pass' ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`  ${colors.gray}3.2 HTML files:            ${results.filter(r => r.requirement === '3.2').every(r => r.status === 'pass') ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`  ${colors.gray}3.3 Images:                ${results.find(r => r.requirement === '3.3')?.status === 'pass' ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  console.log(`  ${colors.gray}3.4 Fonts:                 ${results.find(r => r.requirement === '3.4')?.status === 'pass' ? colors.green + '✓' : results.find(r => r.requirement === '3.4')?.status === 'skipped' ? colors.yellow + '⊘' : colors.red + '✗'}${colors.reset}`);
  console.log(`  ${colors.gray}3.5 Zero uncached assets:  ${failed === 0 && errors === 0 ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Exit with appropriate code
  if (failed > 0 || errors > 0) {
    console.log(`${colors.red}❌ Validation FAILED${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ All cache headers are correctly configured!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run validation
validateCacheHeaders().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
