#!/usr/bin/env node
/**
 * Sitemap Generator for Expo Router
 *
 * Generates sitemap.xml at build time by scanning the app/ directory
 * for routes and combining with the Change of Assessment reason pages.
 *
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://auschildsupport.com.au';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');
const APP_DIR = path.join(__dirname, '../app');

// Routes to exclude from sitemap (noindexed pages)
const EXCLUDED_ROUTES = [
  '+html',
  '+not-found',
  '_layout',
  '_sitemap',
  'modal',
  'admin',
  'blog', // noindexed - main blog at subdomain
];

// Priority configuration
const PRIORITY_CONFIG = {
  '/': { priority: '0.8', changefreq: 'daily' },
  '/lawyer-inquiry': { priority: '0.7', changefreq: 'weekly' },
  '/special-circumstances': { priority: '0.7', changefreq: 'monthly' },
  '/about': { priority: '0.6', changefreq: 'monthly' },
  '/contact': { priority: '0.6', changefreq: 'monthly' },
};

// Change of Assessment reason slugs (from coa-reasons.ts)
const COA_SLUGS = [
  'high-costs-of-contact',
  'special-needs-care-costs',
  'high-costs-caring-educating-child',
  'childs-income-resources',
  'transferred-benefits',
  'high-childcare-costs',
  'reduced-capacity-commitments',
  'income-property-resources',
  'earning-capacity',
  'duty-to-maintain-another',
  'resident-child-responsibility',
];

/**
 * Scans app directory for route files
 */
function scanRoutes(dir, basePath = '') {
  const routes = [];

  if (!fs.existsSync(dir)) {
    return routes;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDED_ROUTES.some((ex) => entry.name.startsWith(ex))) {
        continue;
      }

      // Handle route groups like (tabs)
      if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
        routes.push(...scanRoutes(fullPath, basePath));
      } else {
        routes.push(...scanRoutes(fullPath, `${basePath}/${entry.name}`));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (!['.tsx', '.ts', '.js', '.jsx'].includes(ext)) continue;

      const basename = path.basename(entry.name, ext);

      // Skip excluded files
      if (EXCLUDED_ROUTES.some((ex) => basename.startsWith(ex))) {
        continue;
      }

      // Skip dynamic routes (handled separately for CoA pages)
      if (basename.startsWith('[')) {
        continue;
      }

      // Build route path
      let routePath = basePath;
      if (basename !== 'index') {
        routePath = `${basePath}/${basename}`;
      }

      // Normalize to root if empty
      if (routePath === '') {
        routePath = '/';
      }

      routes.push(routePath);
    }
  }

  return routes;
}

/**
 * Get the last modification date for a route
 * Uses file modification time if available, otherwise returns current date
 */
function getFileModDate(routePath) {
  // Map route to file path
  let filePath;
  
  if (routePath === '/') {
    filePath = path.join(APP_DIR, '(tabs)/index.tsx');
  } else if (routePath.startsWith('/change-of-assessment/')) {
    // CoA pages are generated from data, use the data file's mod time
    filePath = path.join(__dirname, '../src/data/coa/reasons.ts');
  } else {
    // Try to find the file
    const cleanPath = routePath.replace(/^\//, '');
    filePath = path.join(APP_DIR, `${cleanPath}.tsx`);
  }
  
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    // Fallback to current date if file not found
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Generates XML for a single URL entry
 */
function generateUrlEntry(
  path,
  changefreq = 'weekly',
  priority = '0.5'
) {
  const lastmod = getFileModDate(path);
  const config = PRIORITY_CONFIG[path] || { priority, changefreq };

  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>`;
}

/**
 * Main function to generate sitemap
 */
function generateSitemap() {
  // Scan routes from app directory
  const routes = scanRoutes(APP_DIR);

  // Deduplicate and sort
  const uniqueRoutes = [...new Set(routes)].sort();

  console.log('Found routes:', uniqueRoutes);

  // Generate URL entries for static routes
  const staticEntries = uniqueRoutes.map((route) =>
    generateUrlEntry(route)
  );

  // Generate URL entries for Change of Assessment pages
  const coaEntries = COA_SLUGS.map((slug) =>
    generateUrlEntry(`/change-of-assessment/${slug}`, 'monthly', '0.7')
  );

  // Build complete sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
${staticEntries.join('\n')}

  <!-- Change of Assessment Reason Pages -->
${coaEntries.join('\n')}
</urlset>
`;

  // Write to file
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
  console.log(`   Total URLs: ${uniqueRoutes.length + COA_SLUGS.length}`);
}

// Run
generateSitemap();
