#!/usr/bin/env node

/**
 * Blog Technical SEO Audit Script
 * 
 * Automatically audits all blog posts for common technical SEO issues.
 * 
 * Usage:
 *   node scripts/audit-blog-seo.js
 *   node scripts/audit-blog-seo.js --file app/blog/how-to-calculate-child-support.tsx
 *   node scripts/audit-blog-seo.js --verbose
 * 
 * Output:
 *   - Console summary of issues found
 *   - Detailed report saved to blog-seo-audit-report.md
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const singleFile = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
const verbose = args.includes('--verbose');

// Configuration
const BLOG_DIR = path.join(__dirname, '../app/blog');
const OUTPUT_FILE = path.join(__dirname, '../blog-seo-audit-report.md');

// SEO Rules
const TITLE_MIN_LENGTH = 50;
const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MIN_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 160;
const MIN_INTERNAL_LINKS = 3;
const REQUIRED_YEAR = '2026';

// Issue severity levels
const SEVERITY = {
  CRITICAL: '❌ CRITICAL',
  HIGH: '⚠️  HIGH',
  MEDIUM: '⚡ MEDIUM',
  LOW: '💡 LOW',
};

// Results storage
const results = {
  files: [],
  summary: {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  },
};

/**
 * Main audit function
 */
function auditBlogPosts() {
  console.log('🔍 Starting Technical SEO Audit...\n');

  const files = singleFile
    ? [singleFile]
    : fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx')
        .map(file => path.join(BLOG_DIR, file));

  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(`Auditing: ${fileName}`);

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = auditFile(content, fileName);

    results.files.push({
      fileName,
      filePath,
      issues,
    });

    // Update summary counts
    issues.forEach(issue => {
      if (issue.severity === SEVERITY.CRITICAL) results.summary.critical++;
      else if (issue.severity === SEVERITY.HIGH) results.summary.high++;
      else if (issue.severity === SEVERITY.MEDIUM) results.summary.medium++;
      else if (issue.severity === SEVERITY.LOW) results.summary.low++;
    });

    results.summary.total += issues.length;

    if (verbose) {
      issues.forEach(issue => {
        console.log(`  ${issue.severity}: ${issue.title}`);
      });
    }
  });

  console.log('\n✅ Audit complete!\n');
  printSummary();
  generateReport();
}

/**
 * Audit a single file for SEO issues
 */
function auditFile(content, fileName) {
  const issues = [];

  // Check 1: Title tag length
  const titleMatch = content.match(/title="([^"]+)"/);
  if (titleMatch) {
    const title = titleMatch[1];
    if (title.length < TITLE_MIN_LENGTH) {
      issues.push({
        severity: SEVERITY.HIGH,
        title: 'Title tag too short',
        problem: `Title is ${title.length} characters (target: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH})`,
        impact: 'Short titles may not fully convey page topic, reducing click-through rate',
        fix: 'Expand title to include primary keyword, year, and value proposition',
        verification: 'Check title length in PageSEO component',
      });
    } else if (title.length > TITLE_MAX_LENGTH) {
      issues.push({
        severity: SEVERITY.MEDIUM,
        title: 'Title tag too long',
        problem: `Title is ${title.length} characters (target: ${TITLE_MIN_LENGTH}-${TITLE_MAX_LENGTH})`,
        impact: 'Long titles may be truncated in search results',
        fix: 'Shorten title while keeping primary keyword and year',
        verification: 'Check title length in PageSEO component',
      });
    }

    // Check if title includes year
    if (!title.includes(REQUIRED_YEAR)) {
      issues.push({
        severity: SEVERITY.MEDIUM,
        title: 'Title missing current year',
        problem: `Title does not include "${REQUIRED_YEAR}"`,
        impact: 'Year signals content freshness and relevance',
        fix: `Add "${REQUIRED_YEAR}" to title`,
        verification: 'Check title in PageSEO component',
      });
    }
  } else {
    issues.push({
      severity: SEVERITY.CRITICAL,
      title: 'Missing title tag',
      problem: 'No title prop found in PageSEO component',
      impact: 'Page cannot rank without title tag',
      fix: 'Add title prop to PageSEO component',
      verification: 'Check PageSEO component has title prop',
    });
  }

  // Check 2: Meta description length
  const descriptionMatch = content.match(/description="([^"]+)"/);
  if (descriptionMatch) {
    const description = descriptionMatch[1];
    if (description.length < DESCRIPTION_MIN_LENGTH) {
      issues.push({
        severity: SEVERITY.HIGH,
        title: 'Meta description too short',
        problem: `Description is ${description.length} characters (target: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH})`,
        impact: 'Short descriptions may not fully convey page value, reducing click-through rate',
        fix: 'Expand description to include benefits, specifics, and call-to-action',
        verification: 'Check description length in PageSEO component',
      });
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
      issues.push({
        severity: SEVERITY.MEDIUM,
        title: 'Meta description too long',
        problem: `Description is ${description.length} characters (target: ${DESCRIPTION_MIN_LENGTH}-${DESCRIPTION_MAX_LENGTH})`,
        impact: 'Long descriptions may be truncated in search results',
        fix: 'Shorten description while keeping key benefits',
        verification: 'Check description length in PageSEO component',
      });
    }
  } else {
    issues.push({
      severity: SEVERITY.CRITICAL,
      title: 'Missing meta description',
      problem: 'No description prop found in PageSEO component',
      impact: 'Google may generate poor description, reducing click-through rate',
      fix: 'Add description prop to PageSEO component',
      verification: 'Check PageSEO component has description prop',
    });
  }

  // Check 3: Canonical URL
  const canonicalMatch = content.match(/canonicalPath="([^"]+)"/);
  if (!canonicalMatch) {
    issues.push({
      severity: SEVERITY.CRITICAL,
      title: 'Missing canonical URL',
      problem: 'No canonicalPath prop found in PageSEO component',
      impact: 'Duplicate content issues, page may not rank',
      fix: 'Add canonicalPath prop to PageSEO component',
      verification: 'Check PageSEO component has canonicalPath prop',
    });
  }

  // Check 4: Schema markup
  const hasSchema = content.includes('schema={') || content.includes('const articleSchema') || content.includes('const faqSchema');
  if (!hasSchema) {
    issues.push({
      severity: SEVERITY.HIGH,
      title: 'Missing structured data',
      problem: 'No schema markup found (Article, HowTo, or FAQPage)',
      impact: 'Missed opportunity for rich results and featured snippets',
      fix: 'Add appropriate schema markup (Article, HowTo, or FAQPage)',
      verification: 'Test with Google Rich Results Test',
    });
  }

  // Check 5: Breadcrumbs
  const hasBreadcrumbs = content.includes('breadcrumbs={');
  if (!hasBreadcrumbs) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Missing breadcrumbs',
      problem: 'No breadcrumbs prop found in PageSEO component',
      impact: 'Missed opportunity for breadcrumb rich results',
      fix: 'Add breadcrumbs prop to PageSEO component',
      verification: 'Test with Google Rich Results Test',
    });
  }

  // Check 6: H1 heading
  const h1Matches = content.match(/style={styles\.h1}/g);
  if (!h1Matches || h1Matches.length === 0) {
    issues.push({
      severity: SEVERITY.HIGH,
      title: 'Missing H1 heading',
      problem: 'No H1 heading found (styles.h1)',
      impact: 'Page lacks clear topic signal for search engines',
      fix: 'Add H1 heading with primary keyword',
      verification: 'Check for <Text style={styles.h1}> in code',
    });
  } else if (h1Matches.length > 1) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Multiple H1 headings',
      problem: `Found ${h1Matches.length} H1 headings (should be 1)`,
      impact: 'Dilutes topic focus, confuses search engines',
      fix: 'Use only one H1 heading per page',
      verification: 'Check for multiple <Text style={styles.h1}> in code',
    });
  }

  // Check 7: accessibilityRole for headings
  const h1WithRole = content.match(/style={styles\.h1}[^>]*accessibilityRole="header"/);
  if (h1Matches && h1Matches.length > 0 && !h1WithRole) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Missing accessibilityRole on H1',
      problem: 'H1 heading missing accessibilityRole="header"',
      impact: 'Reduced accessibility for screen readers',
      fix: 'Add accessibilityRole="header" to H1 Text component',
      verification: 'Check H1 has accessibilityRole="header"',
    });
  }

  // Check 8: Internal links
  const internalLinkMatches = content.match(/router\.push\(['"]\//g) || [];
  if (internalLinkMatches.length < MIN_INTERNAL_LINKS) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Insufficient internal links',
      problem: `Found ${internalLinkMatches.length} internal links (target: ${MIN_INTERNAL_LINKS}+)`,
      impact: 'Missed opportunity to distribute link equity and improve navigation',
      fix: 'Add 3-5 internal links to related blog posts and calculator',
      verification: 'Count router.push() calls in code',
    });
  }

  // Check 9: accessibilityRole for buttons
  const pressableMatches = content.match(/<Pressable[^>]*>/g) || [];
  const pressableWithRole = content.match(/<Pressable[^>]*accessibilityRole=/g) || [];
  if (pressableMatches.length > pressableWithRole.length) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Missing accessibilityRole on Pressable',
      problem: `${pressableMatches.length - pressableWithRole.length} Pressable components missing accessibilityRole`,
      impact: 'Reduced accessibility for screen readers',
      fix: 'Add accessibilityRole="button" or "link" to all Pressable components',
      verification: 'Check all Pressable components have accessibilityRole',
    });
  }

  // Check 10: Image optimization (basic check)
  const imageMatches = content.match(/<Image[^>]*>/g) || [];
  const imageWithDimensions = content.match(/<Image[^>]*style={{[^}]*width:[^}]*height:/g) || [];
  if (imageMatches.length > 0 && imageWithDimensions.length < imageMatches.length) {
    issues.push({
      severity: SEVERITY.MEDIUM,
      title: 'Images without dimensions',
      problem: `${imageMatches.length - imageWithDimensions.length} images missing width/height`,
      impact: 'May cause Cumulative Layout Shift (CLS), hurting Core Web Vitals',
      fix: 'Add explicit width and height to all Image components',
      verification: 'Check all Image components have width/height in style',
    });
  }

  return issues;
}

/**
 * Print summary to console
 */
function printSummary() {
  console.log('📊 Audit Summary:');
  console.log(`   Total files audited: ${results.files.length}`);
  console.log(`   Total issues found: ${results.summary.total}`);
  console.log(`   ${SEVERITY.CRITICAL}: ${results.summary.critical}`);
  console.log(`   ${SEVERITY.HIGH}: ${results.summary.high}`);
  console.log(`   ${SEVERITY.MEDIUM}: ${results.summary.medium}`);
  console.log(`   ${SEVERITY.LOW}: ${results.summary.low}`);
  console.log(`\n📄 Detailed report saved to: ${OUTPUT_FILE}\n`);
}

/**
 * Generate markdown report
 */
function generateReport() {
  let report = '# Blog Technical SEO Audit Report\n\n';
  report += `**Date:** ${new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
  report += `**Files Audited:** ${results.files.length}\n`;
  report += `**Total Issues:** ${results.summary.total}\n\n`;

  report += '## Summary\n\n';
  report += `- ${SEVERITY.CRITICAL}: ${results.summary.critical}\n`;
  report += `- ${SEVERITY.HIGH}: ${results.summary.high}\n`;
  report += `- ${SEVERITY.MEDIUM}: ${results.summary.medium}\n`;
  report += `- ${SEVERITY.LOW}: ${results.summary.low}\n\n`;

  report += '---\n\n';

  // Group issues by severity
  const criticalFiles = results.files.filter(f => f.issues.some(i => i.severity === SEVERITY.CRITICAL));
  const highFiles = results.files.filter(f => f.issues.some(i => i.severity === SEVERITY.HIGH));
  const mediumFiles = results.files.filter(f => f.issues.some(i => i.severity === SEVERITY.MEDIUM));
  const lowFiles = results.files.filter(f => f.issues.some(i => i.severity === SEVERITY.LOW));

  // Critical issues section
  if (criticalFiles.length > 0) {
    report += '## ❌ Critical Issues (Fix Immediately)\n\n';
    criticalFiles.forEach(file => {
      const criticalIssues = file.issues.filter(i => i.severity === SEVERITY.CRITICAL);
      if (criticalIssues.length > 0) {
        report += `### ${file.fileName}\n\n`;
        criticalIssues.forEach(issue => {
          report += formatIssue(issue);
        });
      }
    });
    report += '---\n\n';
  }

  // High priority issues section
  if (highFiles.length > 0) {
    report += '## ⚠️  High Priority Issues (Fix This Week)\n\n';
    highFiles.forEach(file => {
      const highIssues = file.issues.filter(i => i.severity === SEVERITY.HIGH);
      if (highIssues.length > 0) {
        report += `### ${file.fileName}\n\n`;
        highIssues.forEach(issue => {
          report += formatIssue(issue);
        });
      }
    });
    report += '---\n\n';
  }

  // Medium priority issues section
  if (mediumFiles.length > 0) {
    report += '## ⚡ Medium Priority Issues (Fix This Month)\n\n';
    mediumFiles.forEach(file => {
      const mediumIssues = file.issues.filter(i => i.severity === SEVERITY.MEDIUM);
      if (mediumIssues.length > 0) {
        report += `### ${file.fileName}\n\n`;
        mediumIssues.forEach(issue => {
          report += formatIssue(issue);
        });
      }
    });
    report += '---\n\n';
  }

  // Low priority issues section
  if (lowFiles.length > 0) {
    report += '## 💡 Low Priority Issues (Fix When Convenient)\n\n';
    lowFiles.forEach(file => {
      const lowIssues = file.issues.filter(i => i.severity === SEVERITY.LOW);
      if (lowIssues.length > 0) {
        report += `### ${file.fileName}\n\n`;
        lowIssues.forEach(issue => {
          report += formatIssue(issue);
        });
      }
    });
    report += '---\n\n';
  }

  // Files with no issues
  const cleanFiles = results.files.filter(f => f.issues.length === 0);
  if (cleanFiles.length > 0) {
    report += '## ✅ Files With No Issues\n\n';
    cleanFiles.forEach(file => {
      report += `- ${file.fileName}\n`;
    });
    report += '\n---\n\n';
  }

  report += '## Next Steps\n\n';
  report += '1. **Fix critical issues immediately** (same day)\n';
  report += '2. **Schedule high-priority fixes** (this week)\n';
  report += '3. **Plan medium-priority fixes** (this month)\n';
  report += '4. **Document low-priority fixes** (backlog)\n\n';

  report += '## Verification Tools\n\n';
  report += '- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals\n';
  report += '- [Google Rich Results Test](https://search.google.com/test/rich-results) - Structured Data\n';
  report += '- [Meta Tags Validator](https://metatags.io/) - Open Graph\n';
  report += '- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Mobile Optimization\n\n';

  report += '---\n\n';
  report += `**Report generated:** ${new Date().toISOString()}\n`;
  report += `**Script:** scripts/audit-blog-seo.js\n`;

  fs.writeFileSync(OUTPUT_FILE, report);
}

/**
 * Format issue for markdown report
 */
function formatIssue(issue) {
  let formatted = `#### ${issue.severity}: ${issue.title}\n\n`;
  formatted += `**Problem:** ${issue.problem}\n\n`;
  formatted += `**Impact:** ${issue.impact}\n\n`;
  formatted += `**Fix:** ${issue.fix}\n\n`;
  formatted += `**Verification:** ${issue.verification}\n\n`;
  return formatted;
}

// Run audit
try {
  auditBlogPosts();
} catch (error) {
  console.error('❌ Audit failed:', error.message);
  process.exit(1);
}
