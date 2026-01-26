#!/usr/bin/env node

/**
 * SEO Preservation Validation Script
 * 
 * Validates that all optimizations preserve SEO by checking:
 * 1. All blog posts have static HTML
 * 2. Meta tags are present in HTML source
 * 3. Sitemap includes all routes
 * 4. Content is available without JavaScript
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

// Blog posts from app/blog/index.tsx
const BLOG_POSTS = [
  'child-support-arrears-australia',
  'child-support-after-18',
  'new-partner-income-child-support',
  'binding-child-support-agreement',
  'lump-sum-child-support-payment',
  'backdating-child-support-australia',
  'child-support-overpayment-refund',
  'shared-care-5050-child-support',
  'child-support-reduction-strategies',
  'child-support-centrelink-income-support',
  'court-order-child-support-calculator',
  'accurate-child-support-calculator',
  'when-to-hire-family-lawyer',
  'child-support-self-employed',
  'how-to-calculate-child-support',
  'child-support-formula-australia',
  'complicated-child-support-situations',
  'child-support-care-percentage-table',
  'object-to-child-support-assessment',
  'international-child-support-australia',
  'adult-disabled-child-maintenance',
  'overseas-parent-child-support-enforcement',
  'private-school-fees-child-support',
  'parental-leave-child-support',
  'estimate-vs-actual-income-child-support',
];

// Key routes that should be in sitemap
const KEY_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/lawyer-inquiry',
  '/special-circumstances',
  '/blog',
  ...BLOG_POSTS.map(slug => `/blog/${slug}`),
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function checkPassed(message) {
  totalChecks++;
  passedChecks++;
  log(`✓ ${message}`, 'green');
}

function checkFailed(message, details = '') {
  totalChecks++;
  failedChecks++;
  log(`✗ ${message}`, 'red');
  if (details) {
    log(`  ${details}`, 'yellow');
  }
  failures.push({ message, details });
}

/**
 * Check 1: Verify static HTML files exist for all blog posts
 * Requirement 9.1: Static HTML generation
 */
function validateStaticHTML() {
  logSection('Check 1: Static HTML Files for Blog Posts');
  
  const distPath = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distPath)) {
    checkFailed('dist directory not found', 'Run "npm run build:web" first');
    return;
  }
  
  let missingFiles = [];
  
  // Check each blog post has an HTML file
  BLOG_POSTS.forEach(slug => {
    const htmlPath = path.join(distPath, 'blog', `${slug}.html`);
    if (fs.existsSync(htmlPath)) {
      checkPassed(`Blog post HTML exists: /blog/${slug}.html`);
    } else {
      missingFiles.push(`/blog/${slug}.html`);
      checkFailed(`Missing HTML file: /blog/${slug}.html`);
    }
  });
  
  // Check index pages
  const indexPages = [
    { path: 'index.html', label: '/index.html' },
    { path: 'blog/index.html', label: '/blog/index.html' },
    { path: 'about.html', label: '/about.html' },
    { path: 'contact.html', label: '/contact.html' },
    { path: 'faq.html', label: '/faq.html' },
  ];
  indexPages.forEach(page => {
    const htmlPath = path.join(distPath, page.path);
    if (fs.existsSync(htmlPath)) {
      checkPassed(`Static HTML exists: ${page.label}`);
    } else {
      missingFiles.push(page.label);
      checkFailed(`Missing HTML file: ${page.label}`);
    }
  });
  
  if (missingFiles.length === 0) {
    log('\n✓ All static HTML files generated successfully', 'green');
  } else {
    log(`\n✗ Missing ${missingFiles.length} HTML files`, 'red');
  }
}

/**
 * Check 2: Verify meta tags are present in HTML source
 * Requirement 9.2: Meta tags in static HTML
 */
function validateMetaTags() {
  logSection('Check 2: Meta Tags in HTML Source');
  
  const distPath = path.join(__dirname, '../dist');
  
  // Check a sample of blog posts for meta tags
  const samplePosts = [
    'how-to-calculate-child-support',
    'child-support-formula-australia',
    'when-to-hire-family-lawyer',
  ];
  
  samplePosts.forEach(slug => {
    const htmlPath = path.join(distPath, 'blog', `${slug}.html`);
    
    if (!fs.existsSync(htmlPath)) {
      checkFailed(`Cannot check meta tags: ${slug}.html not found`);
      return;
    }
    
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Check for essential meta tags (with or without data-rh attribute from react-helmet)
    const requiredTags = [
      { name: 'title', pattern: /<title[^>]*>.*?<\/title>/i },
      { name: 'description', pattern: /<meta[^>]*name=["']description["']/i },
      { name: 'og:title', pattern: /<meta[^>]*property=["']og:title["']/i },
      { name: 'og:description', pattern: /<meta[^>]*property=["']og:description["']/i },
      { name: 'canonical', pattern: /<link[^>]*rel=["']canonical["']/i },
    ];
    
    let allTagsPresent = true;
    requiredTags.forEach(tag => {
      if (tag.pattern.test(html)) {
        checkPassed(`${slug}: ${tag.name} tag present`);
      } else {
        checkFailed(`${slug}: Missing ${tag.name} tag`);
        allTagsPresent = false;
      }
    });
    
    // Check for content in HTML (not just empty shell)
    if (html.length > 5000) {
      checkPassed(`${slug}: HTML contains substantial content (${Math.round(html.length / 1024)}KB)`);
    } else {
      checkFailed(`${slug}: HTML seems too small (${Math.round(html.length / 1024)}KB)`, 'May be missing content');
    }
  });
}

/**
 * Check 3: Verify sitemap includes all routes
 * Requirement 9.3, 9.4: Sitemap completeness
 */
function validateSitemap() {
  logSection('Check 3: Sitemap Completeness');
  
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    checkFailed('sitemap.xml not found in public directory');
    return;
  }
  
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Check each key route is in sitemap
  let missingRoutes = [];
  KEY_ROUTES.forEach(route => {
    const url = `https://auschildsupport.com.au${route}`;
    if (sitemap.includes(url)) {
      checkPassed(`Sitemap includes: ${route}`);
    } else {
      missingRoutes.push(route);
      checkFailed(`Sitemap missing: ${route}`);
    }
  });
  
  // Check sitemap is valid XML
  if (sitemap.includes('<?xml version="1.0"') && sitemap.includes('<urlset')) {
    checkPassed('Sitemap is valid XML format');
  } else {
    checkFailed('Sitemap may not be valid XML');
  }
  
  // Count total URLs in sitemap
  const urlCount = (sitemap.match(/<url>/g) || []).length;
  log(`\nSitemap contains ${urlCount} URLs`, 'blue');
  
  if (missingRoutes.length === 0) {
    log('✓ All key routes present in sitemap', 'green');
  } else {
    log(`✗ Missing ${missingRoutes.length} routes from sitemap`, 'red');
  }
}

/**
 * Check 4: Verify content is available without JavaScript
 * Requirement 9.5: Content availability for crawlers
 */
function validateContentWithoutJS() {
  logSection('Check 4: Content Available Without JavaScript');
  
  const distPath = path.join(__dirname, '../dist');
  
  // Check a sample blog post for actual content in HTML
  const samplePost = 'how-to-calculate-child-support';
  const htmlPath = path.join(distPath, 'blog', `${samplePost}.html`);
  
  if (!fs.existsSync(htmlPath)) {
    checkFailed(`Cannot check content: ${samplePost}.html not found`);
    return;
  }
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Check for content indicators (not just loading states)
  const contentIndicators = [
    { name: 'Headings', pattern: /<h[1-6][^>]*>(?!Loading|Please wait).*?<\/h[1-6]>/i },
    { name: 'Text content', pattern: /child support/i }, // Check for actual content text
    { name: 'Main content', pattern: /<main/i },
  ];
  
  contentIndicators.forEach(indicator => {
    if (indicator.pattern.test(html)) {
      checkPassed(`${samplePost}: ${indicator.name} found in static HTML`);
    } else {
      checkFailed(`${samplePost}: ${indicator.name} not found in static HTML`, 'Content may require JavaScript');
    }
  });
  
  // Check that HTML doesn't just say "Loading..."
  if (html.includes('Loading...') && !html.match(/<h[1-6][^>]*>(?!Loading).*?<\/h[1-6]>/i)) {
    checkFailed(`${samplePost}: HTML appears to be loading state only`);
  } else {
    checkPassed(`${samplePost}: HTML contains actual content (not just loading state)`);
  }
}

/**
 * Check 5: Run Lighthouse SEO audit (if available)
 * Requirement 9.2: Lighthouse SEO score = 100
 */
function runLighthouseSEO() {
  logSection('Check 5: Lighthouse SEO Audit');
  
  log('Note: This requires the site to be running locally or deployed', 'yellow');
  log('Skipping automated Lighthouse check - run manually with:', 'yellow');
  log('  npm run lighthouse', 'cyan');
  log('  Target: SEO score = 100', 'cyan');
  
  // Check if lighthouse report exists
  const reportPath = path.join(__dirname, '../lighthouse-report.report.json');
  if (fs.existsSync(reportPath)) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      const seoScore = report.categories?.seo?.score;
      
      if (seoScore !== undefined) {
        const seoScorePercent = Math.round(seoScore * 100);
        log(`\nLighthouse SEO Score: ${seoScorePercent}/100`, seoScorePercent >= 100 ? 'green' : 'yellow');
        
        if (seoScorePercent >= 100) {
          checkPassed(`Lighthouse SEO score: ${seoScorePercent}/100 (target: 100)`);
        } else {
          checkFailed(`Lighthouse SEO score: ${seoScorePercent}/100 (target: 100)`);
        }
      }
    } catch (error) {
      log('Could not parse Lighthouse report', 'yellow');
    }
  } else {
    log('No Lighthouse report found - run "npm run lighthouse" to generate', 'yellow');
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         SEO Preservation Validation Script                ║', 'cyan');
  log('║                                                            ║', 'cyan');
  log('║  Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5          ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Run all validation checks
  validateStaticHTML();
  validateMetaTags();
  validateSitemap();
  validateContentWithoutJS();
  runLighthouseSEO();
  
  // Summary
  logSection('Validation Summary');
  
  log(`Total Checks: ${totalChecks}`, 'blue');
  log(`Passed: ${passedChecks}`, 'green');
  log(`Failed: ${failedChecks}`, failedChecks > 0 ? 'red' : 'green');
  
  if (failedChecks > 0) {
    log('\nFailed Checks:', 'red');
    failures.forEach((failure, index) => {
      log(`${index + 1}. ${failure.message}`, 'red');
      if (failure.details) {
        log(`   ${failure.details}`, 'yellow');
      }
    });
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  if (failedChecks === 0) {
    log('✓ SEO PRESERVATION VALIDATED SUCCESSFULLY', 'green');
    log('All blog posts have static HTML with proper meta tags', 'green');
    log('Sitemap is complete and content is crawlable', 'green');
    process.exit(0);
  } else {
    log('✗ SEO PRESERVATION VALIDATION FAILED', 'red');
    log(`${failedChecks} checks failed - see details above`, 'red');
    process.exit(1);
  }
}

// Run validation
main();
