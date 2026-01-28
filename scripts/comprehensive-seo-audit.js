/**
 * Comprehensive SEO Audit Script
 * Checks all pages for SEO best practices
 */

const fs = require('fs');
const path = require('path');

const issues = [];
const warnings = [];
const successes = [];

// Helper to read file
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

// Helper to find all TSX files
function findTSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, etc
      if (!['node_modules', 'dist', 'dist-baseline', '.expo', '.git', 'venv'].includes(file)) {
        findTSXFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check 1: PageSEO Component Usage
function checkPageSEO() {
  console.log('\n📋 Checking PageSEO Component Usage...\n');
  
  const appFiles = findTSXFiles('app');
  const pagesWithoutSEO = [];
  const pagesWithSEO = [];
  
  // Exclude certain files
  const excludePatterns = [
    '_layout.tsx',
    '+html.tsx',
    '+not-found.tsx',
    '/admin/',
    '/partner/',
  ];
  
  appFiles.forEach(file => {
    // Skip excluded patterns
    if (excludePatterns.some(pattern => file.includes(pattern))) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    const hasPageSEO = content.includes('PageSEO');
    const hasHead = content.includes('from \'expo-router/head\'');
    
    if (hasPageSEO || hasHead) {
      pagesWithSEO.push(file);
    } else {
      pagesWithoutSEO.push(file);
    }
  });
  
  if (pagesWithoutSEO.length > 0) {
    issues.push({
      category: 'Missing SEO',
      severity: 'HIGH',
      count: pagesWithoutSEO.length,
      files: pagesWithoutSEO,
      message: 'Pages without PageSEO component or Head tags'
    });
  } else {
    successes.push('✅ All public pages have SEO implementation');
  }
  
  console.log(`✅ Pages with SEO: ${pagesWithSEO.length}`);
  console.log(`❌ Pages without SEO: ${pagesWithoutSEO.length}`);
  if (pagesWithoutSEO.length > 0) {
    pagesWithoutSEO.forEach(f => console.log(`   - ${f}`));
  }
}

// Check 2: Meta Descriptions
function checkMetaDescriptions() {
  console.log('\n📋 Checking Meta Descriptions...\n');
  
  const appFiles = findTSXFiles('app');
  const missingDescriptions = [];
  const shortDescriptions = [];
  const longDescriptions = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    // Check for description prop in PageSEO
    const descMatch = content.match(/description=["']([^"']+)["']/);
    
    if (!descMatch) {
      missingDescriptions.push(file);
    } else {
      const desc = descMatch[1];
      if (desc.length < 120) {
        shortDescriptions.push({ file, length: desc.length, desc });
      } else if (desc.length > 160) {
        longDescriptions.push({ file, length: desc.length, desc: desc.substring(0, 100) + '...' });
      }
    }
  });
  
  if (missingDescriptions.length > 0) {
    issues.push({
      category: 'Missing Meta Description',
      severity: 'HIGH',
      count: missingDescriptions.length,
      files: missingDescriptions,
      message: 'Pages without meta descriptions'
    });
  }
  
  if (shortDescriptions.length > 0) {
    warnings.push({
      category: 'Short Meta Description',
      severity: 'MEDIUM',
      count: shortDescriptions.length,
      items: shortDescriptions,
      message: 'Meta descriptions under 120 characters (recommended: 120-160)'
    });
  }
  
  if (longDescriptions.length > 0) {
    warnings.push({
      category: 'Long Meta Description',
      severity: 'LOW',
      count: longDescriptions.length,
      items: longDescriptions,
      message: 'Meta descriptions over 160 characters (will be truncated in search results)'
    });
  }
  
  console.log(`❌ Missing descriptions: ${missingDescriptions.length}`);
  console.log(`⚠️  Short descriptions (<120 chars): ${shortDescriptions.length}`);
  console.log(`⚠️  Long descriptions (>160 chars): ${longDescriptions.length}`);
}

// Check 3: Title Tags
function checkTitles() {
  console.log('\n📋 Checking Title Tags...\n');
  
  const appFiles = findTSXFiles('app');
  const missingTitles = [];
  const longTitles = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    const titleMatch = content.match(/title=["']([^"']+)["']/);
    
    if (!titleMatch) {
      missingTitles.push(file);
    } else {
      const title = titleMatch[1];
      if (title.length > 60) {
        longTitles.push({ file, length: title.length, title });
      }
    }
  });
  
  if (missingTitles.length > 0) {
    issues.push({
      category: 'Missing Title',
      severity: 'HIGH',
      count: missingTitles.length,
      files: missingTitles,
      message: 'Pages without title tags'
    });
  }
  
  if (longTitles.length > 0) {
    warnings.push({
      category: 'Long Title',
      severity: 'MEDIUM',
      count: longTitles.length,
      items: longTitles,
      message: 'Titles over 60 characters (may be truncated in search results)'
    });
  }
  
  console.log(`❌ Missing titles: ${missingTitles.length}`);
  console.log(`⚠️  Long titles (>60 chars): ${longTitles.length}`);
}

// Check 4: Structured Data (Schema.org)
function checkStructuredData() {
  console.log('\n📋 Checking Structured Data (Schema.org)...\n');
  
  const appFiles = findTSXFiles('app');
  const missingSchema = [];
  const hasSchema = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    const hasSchemaOrg = content.includes('@context') && content.includes('schema.org');
    
    if (hasSchemaOrg) {
      hasSchema.push(file);
    } else {
      missingSchema.push(file);
    }
  });
  
  if (missingSchema.length > 0) {
    warnings.push({
      category: 'Missing Structured Data',
      severity: 'MEDIUM',
      count: missingSchema.length,
      files: missingSchema,
      message: 'Pages without Schema.org structured data'
    });
  }
  
  console.log(`✅ Pages with schema: ${hasSchema.length}`);
  console.log(`⚠️  Pages without schema: ${missingSchema.length}`);
}

// Check 5: Canonical URLs
function checkCanonicalURLs() {
  console.log('\n📋 Checking Canonical URLs...\n');
  
  const appFiles = findTSXFiles('app');
  const missingCanonical = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    const hasCanonical = content.includes('canonicalPath') || content.includes('rel="canonical"');
    
    if (!hasCanonical) {
      missingCanonical.push(file);
    }
  });
  
  if (missingCanonical.length > 0) {
    issues.push({
      category: 'Missing Canonical URL',
      severity: 'HIGH',
      count: missingCanonical.length,
      files: missingCanonical,
      message: 'Pages without canonical URLs (can cause duplicate content issues)'
    });
  } else {
    successes.push('✅ All pages have canonical URLs');
  }
  
  console.log(`❌ Missing canonical: ${missingCanonical.length}`);
}

// Check 6: Heading Structure
function checkHeadingStructure() {
  console.log('\n📋 Checking Heading Structure (H1)...\n');
  
  const appFiles = findTSXFiles('app');
  const missingH1 = [];
  const multipleH1 = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    // Look for h1 style or aria-level="1"
    const h1Matches = content.match(/styles\.h1|aria-level="1"/g);
    
    if (!h1Matches || h1Matches.length === 0) {
      missingH1.push(file);
    } else if (h1Matches.length > 1) {
      multipleH1.push({ file, count: h1Matches.length });
    }
  });
  
  if (missingH1.length > 0) {
    warnings.push({
      category: 'Missing H1',
      severity: 'MEDIUM',
      count: missingH1.length,
      files: missingH1,
      message: 'Pages without H1 heading'
    });
  }
  
  if (multipleH1.length > 0) {
    warnings.push({
      category: 'Multiple H1',
      severity: 'LOW',
      count: multipleH1.length,
      items: multipleH1,
      message: 'Pages with multiple H1 headings (should have only one)'
    });
  }
  
  console.log(`⚠️  Missing H1: ${missingH1.length}`);
  console.log(`⚠️  Multiple H1: ${multipleH1.length}`);
}

// Check 7: Sitemap Coverage
function checkSitemapCoverage() {
  console.log('\n📋 Checking Sitemap Coverage...\n');
  
  const sitemap = readFile('public/sitemap.xml');
  if (!sitemap) {
    issues.push({
      category: 'Missing Sitemap',
      severity: 'HIGH',
      message: 'Sitemap file not found at public/sitemap.xml'
    });
    return;
  }
  
  // Extract URLs from sitemap
  const urlMatches = sitemap.match(/<loc>([^<]+)<\/loc>/g);
  const sitemapUrls = urlMatches ? urlMatches.map(m => m.replace(/<\/?loc>/g, '')) : [];
  
  // Get all app routes
  const appFiles = findTSXFiles('app');
  const routes = appFiles
    .filter(f => !f.includes('_layout.tsx') && !f.includes('+html.tsx') && !f.includes('/admin/'))
    .map(f => {
      let route = f.replace('app/', '/').replace('.tsx', '').replace('/index', '');
      if (route === '/') route = '';
      // Handle dynamic routes
      route = route.replace(/\[([^\]]+)\]/g, ':$1');
      return route;
    });
  
  const missingFromSitemap = routes.filter(route => {
    // Skip dynamic routes
    if (route.includes(':')) return false;
    const fullUrl = `https://auschildsupport.com.au${route}`;
    return !sitemapUrls.includes(fullUrl);
  });
  
  if (missingFromSitemap.length > 0) {
    warnings.push({
      category: 'Missing from Sitemap',
      severity: 'MEDIUM',
      count: missingFromSitemap.length,
      files: missingFromSitemap,
      message: 'Routes not found in sitemap.xml'
    });
  }
  
  console.log(`✅ URLs in sitemap: ${sitemapUrls.length}`);
  console.log(`⚠️  Routes missing from sitemap: ${missingFromSitemap.length}`);
  if (missingFromSitemap.length > 0) {
    missingFromSitemap.forEach(r => console.log(`   - ${r}`));
  }
}

// Check 8: Robots.txt
function checkRobotsTxt() {
  console.log('\n📋 Checking robots.txt...\n');
  
  const robots = readFile('public/robots.txt');
  if (!robots) {
    issues.push({
      category: 'Missing robots.txt',
      severity: 'HIGH',
      message: 'robots.txt file not found'
    });
    return;
  }
  
  const hasSitemap = robots.includes('Sitemap:');
  const hasUserAgent = robots.includes('User-agent:');
  
  if (!hasSitemap) {
    issues.push({
      category: 'robots.txt Missing Sitemap',
      severity: 'MEDIUM',
      message: 'robots.txt does not reference sitemap'
    });
  }
  
  if (!hasUserAgent) {
    issues.push({
      category: 'robots.txt Missing User-agent',
      severity: 'HIGH',
      message: 'robots.txt does not have User-agent directive'
    });
  }
  
  if (hasSitemap && hasUserAgent) {
    successes.push('✅ robots.txt is properly configured');
  }
  
  console.log(`${hasSitemap ? '✅' : '❌'} Sitemap reference`);
  console.log(`${hasUserAgent ? '✅' : '❌'} User-agent directive`);
}

// Check 9: Open Graph Tags
function checkOpenGraph() {
  console.log('\n📋 Checking Open Graph Tags...\n');
  
  const appFiles = findTSXFiles('app');
  const missingOG = [];
  
  appFiles.forEach(file => {
    if (file.includes('_layout.tsx') || file.includes('+html.tsx') || file.includes('/admin/')) {
      return;
    }
    
    const content = readFile(file);
    if (!content) return;
    
    // PageSEO component includes OG tags by default
    const hasOG = content.includes('PageSEO') || content.includes('og:');
    
    if (!hasOG) {
      missingOG.push(file);
    }
  });
  
  if (missingOG.length > 0) {
    warnings.push({
      category: 'Missing Open Graph',
      severity: 'MEDIUM',
      count: missingOG.length,
      files: missingOG,
      message: 'Pages without Open Graph tags (affects social sharing)'
    });
  } else {
    successes.push('✅ All pages have Open Graph tags');
  }
  
  console.log(`❌ Missing OG tags: ${missingOG.length}`);
}

// Check 10: Image Alt Text (basic check)
function checkImageAltText() {
  console.log('\n📋 Checking Image Alt Text...\n');
  
  const appFiles = findTSXFiles('app');
  const imagesWithoutAlt = [];
  
  appFiles.forEach(file => {
    const content = readFile(file);
    if (!content) return;
    
    // Look for Image components without alt or accessibilityLabel
    const imageMatches = content.match(/<Image[^>]*>/g);
    if (imageMatches) {
      imageMatches.forEach(img => {
        if (!img.includes('alt=') && !img.includes('accessibilityLabel=')) {
          imagesWithoutAlt.push({ file, image: img.substring(0, 100) });
        }
      });
    }
  });
  
  if (imagesWithoutAlt.length > 0) {
    warnings.push({
      category: 'Missing Image Alt Text',
      severity: 'MEDIUM',
      count: imagesWithoutAlt.length,
      items: imagesWithoutAlt,
      message: 'Images without alt text or accessibilityLabel'
    });
  }
  
  console.log(`⚠️  Images without alt: ${imagesWithoutAlt.length}`);
}

// Generate Report
function generateReport() {
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE SEO AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  // Successes
  if (successes.length > 0) {
    console.log('✅ SUCCESSES:\n');
    successes.forEach(s => console.log(`   ${s}`));
    console.log('');
  }
  
  // Issues (High Priority)
  if (issues.length > 0) {
    console.log('🚨 CRITICAL ISSUES (Fix Immediately):\n');
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.severity}] ${issue.category}`);
      console.log(`   ${issue.message}`);
      if (issue.count) console.log(`   Count: ${issue.count}`);
      if (issue.files && issue.files.length <= 5) {
        issue.files.forEach(f => console.log(`   - ${f}`));
      } else if (issue.files) {
        console.log(`   - ${issue.files.length} files affected (see details above)`);
      }
      console.log('');
    });
  }
  
  // Warnings (Medium/Low Priority)
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS (Should Fix):\n');
    warnings.forEach((warning, i) => {
      console.log(`${i + 1}. [${warning.severity}] ${warning.category}`);
      console.log(`   ${warning.message}`);
      if (warning.count) console.log(`   Count: ${warning.count}`);
      console.log('');
    });
  }
  
  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY:');
  console.log(`   ✅ Successes: ${successes.length}`);
  console.log(`   🚨 Critical Issues: ${issues.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log('='.repeat(80) + '\n');
  
  // Exit code
  if (issues.length > 0) {
    console.log('❌ SEO audit failed with critical issues\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('⚠️  SEO audit passed with warnings\n');
    process.exit(0);
  } else {
    console.log('✅ SEO audit passed with no issues!\n');
    process.exit(0);
  }
}

// Run all checks
console.log('🔍 Starting Comprehensive SEO Audit...\n');

checkPageSEO();
checkMetaDescriptions();
checkTitles();
checkStructuredData();
checkCanonicalURLs();
checkHeadingStructure();
checkSitemapCoverage();
checkRobotsTxt();
checkOpenGraph();
checkImageAltText();

generateReport();
