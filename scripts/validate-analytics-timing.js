#!/usr/bin/env node

/**
 * Validation Script: Analytics Load Timing
 * 
 * This script validates that analytics scripts are deferred and load
 * after the initial render (1-2 seconds after page load).
 * 
 * Requirements validated:
 * - 2.5: Analytics scripts lazy loaded after initial render
 * - 6.1: GA4 initialization deferred
 * - 6.2: react-ga4 loaded asynchronously
 * - 6.3: Vercel Analytics uses async/defer
 * - 6.4: Vercel Speed Insights uses async/defer
 */

const puppeteer = require('puppeteer');

const ANALYTICS_SCRIPTS = [
  'react-ga4',
  '@vercel/analytics',
  '@vercel/speed-insights',
  'googletagmanager.com/gtag',
  'vitals.vercel-insights.com'
];

const TARGET_URL = 'http://localhost:8080';
const INITIAL_RENDER_THRESHOLD = 1000; // 1 second

async function validateAnalyticsTiming() {
  console.log('🔍 Validating analytics load timing...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Track network requests with timestamps
    const requests = [];
    const startTime = Date.now();
    
    // Track when the page starts loading
    let pageLoadStart = null;
    let domContentLoaded = null;
    let loadComplete = null;
    
    page.on('domcontentloaded', () => {
      domContentLoaded = Date.now() - startTime;
      console.log(`📊 DOMContentLoaded at: ${(domContentLoaded / 1000).toFixed(2)}s`);
    });
    
    page.on('load', () => {
      loadComplete = Date.now() - startTime;
      console.log(`📊 Load complete at: ${(loadComplete / 1000).toFixed(2)}s`);
    });
    
    page.on('request', (request) => {
      const url = request.url();
      const timestamp = Date.now() - startTime;
      const resourceType = request.resourceType();
      
      // Only track actual script loads, not prefetch/preconnect
      // We want to validate that the actual JavaScript files are deferred
      const isAnalyticsScript = ANALYTICS_SCRIPTS.some(script => url.includes(script)) 
        && (resourceType === 'script' || resourceType === 'xhr' || resourceType === 'fetch');
      
      if (isAnalyticsScript) {
        requests.push({
          url,
          timestamp,
          type: resourceType
        });
        console.log(`📡 Analytics request detected: ${url.substring(0, 80)}... at ${(timestamp / 1000).toFixed(2)}s`);
      }
    });
    
    console.log(`📄 Loading page: ${TARGET_URL}\n`);
    pageLoadStart = Date.now();
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    
    // Wait a bit more to catch any delayed analytics loads
    console.log('\n⏳ Waiting 3 seconds to catch delayed analytics loads...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`\n✅ Page loaded successfully\n`);
    
    // Analyze results
    console.log('📊 Analytics Script Load Times:\n');
    
    if (requests.length === 0) {
      console.log('⚠️  No analytics scripts detected');
      console.log('   This might be expected if analytics are disabled in development');
      console.log('   or if environment variables are not set.\n');
      return { success: true, warning: 'No analytics scripts found' };
    }
    
    let allDeferred = true;
    const results = [];
    
    requests.forEach((req) => {
      const seconds = (req.timestamp / 1000).toFixed(2);
      const isDeferred = req.timestamp >= INITIAL_RENDER_THRESHOLD;
      const status = isDeferred ? '✅' : '❌';
      
      console.log(`${status} ${req.url}`);
      console.log(`   Loaded at: ${seconds}s (${isDeferred ? 'DEFERRED' : 'IMMEDIATE'})`);
      console.log('');
      
      results.push({
        url: req.url,
        timestamp: req.timestamp,
        deferred: isDeferred
      });
      
      if (!isDeferred) {
        allDeferred = false;
      }
    });
    
    // Summary
    console.log('─'.repeat(60));
    console.log('\n📋 Summary:\n');
    console.log(`Total analytics requests: ${requests.length}`);
    console.log(`Deferred (>1s): ${results.filter(r => r.deferred).length}`);
    console.log(`Immediate (<1s): ${results.filter(r => !r.deferred).length}`);
    
    if (allDeferred) {
      console.log('\n✅ SUCCESS: All analytics scripts are properly deferred!\n');
      return { success: true, results };
    } else {
      console.log('\n❌ FAILURE: Some analytics scripts loaded immediately\n');
      console.log('Expected: All analytics scripts should load after 1 second');
      console.log('This indicates analytics are blocking initial render.\n');
      return { success: false, results };
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

// Run validation
validateAnalyticsTiming()
  .then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
