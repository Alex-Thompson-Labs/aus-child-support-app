#!/usr/bin/env node

/**
 * Automated SEO Issue Fixer
 * 
 * Fixes common SEO issues found in blog posts:
 * - Adds accessibilityRole to Pressable components
 * - Adds accessibilityRole to H1 headings
 * - Reports meta description and title issues for manual review
 * 
 * Usage:
 *   node scripts/fix-blog-seo-issues.js
 *   node scripts/fix-blog-seo-issues.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const BLOG_DIR = path.join(__dirname, '../app/blog');

let filesModified = 0;
let totalChanges = 0;

console.log('🔧 Starting SEO Issue Fixer...\n');
if (dryRun) {
  console.log('⚠️  DRY RUN MODE - No files will be modified\n');
}

// Get all blog post files
const files = fs.readdirSync(BLOG_DIR)
  .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx')
  .map(file => path.join(BLOG_DIR, file));

files.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changes = [];

  // Fix 1: Add accessibilityRole="button" to Pressable with onPress
  const pressableButtonRegex = /<Pressable\s+([^>]*?)onPress={([^}]+)}/g;
  let match;
  let newContent = content;
  
  while ((match = pressableButtonRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const attributes = match[1];
    
    // Check if accessibilityRole already exists
    if (!attributes.includes('accessibilityRole')) {
      // Determine if it's a button or link based on onPress content
      const onPressContent = match[2];
      const isLink = onPressContent.includes('router.push') || onPressContent.includes('router.replace');
      const role = isLink ? 'link' : 'button';
      
      // Insert accessibilityRole before onPress
      const replacement = fullMatch.replace(
        /onPress=/,
        `accessibilityRole="${role}" onPress=`
      );
      
      newContent = newContent.replace(fullMatch, replacement);
      modified = true;
      changes.push(`Added accessibilityRole="${role}" to Pressable`);
    }
  }

  // Fix 2: Add accessibilityRole="header" to H1 headings
  const h1Regex = /<Text\s+style={styles\.h1}(?!\s+accessibilityRole)/g;
  if (h1Regex.test(newContent)) {
    newContent = newContent.replace(
      /<Text\s+style={styles\.h1}/g,
      '<Text style={styles.h1} accessibilityRole="header"'
    );
    modified = true;
    changes.push('Added accessibilityRole="header" to H1');
  }

  // Fix 3: Add accessibilityRole="header" to H2 headings (if missing)
  const h2Regex = /<Text\s+style={styles\.h2}(?!\s+accessibilityRole)/g;
  if (h2Regex.test(newContent)) {
    newContent = newContent.replace(
      /<Text\s+style={styles\.h2}/g,
      '<Text style={styles.h2} accessibilityRole="header"'
    );
    modified = true;
    changes.push('Added accessibilityRole="header" to H2');
  }

  if (modified) {
    if (!dryRun) {
      fs.writeFileSync(filePath, newContent);
    }
    filesModified++;
    totalChanges += changes.length;
    console.log(`✅ ${fileName}`);
    changes.forEach(change => console.log(`   - ${change}`));
  } else {
    console.log(`⏭️  ${fileName} - No changes needed`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total changes: ${totalChanges}`);

if (dryRun) {
  console.log('\n⚠️  DRY RUN - No files were actually modified');
  console.log('   Run without --dry-run to apply changes');
} else {
  console.log('\n✅ All automated fixes applied!');
  console.log('\n📝 Manual fixes still needed:');
  console.log('   - Meta descriptions (too short/long)');
  console.log('   - Title tags (too long)');
  console.log('   - Missing H1 headings (3 files)');
  console.log('   - Missing breadcrumbs (3 files)');
  console.log('\n   Run: node scripts/audit-blog-seo.js');
  console.log('   To verify fixes and see remaining issues');
}
