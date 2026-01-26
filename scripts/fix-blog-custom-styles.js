#!/usr/bin/env node

/**
 * Fix Blog Custom Styles
 * 
 * Adds back truly custom styles to blog posts that need them.
 * These are styles that don't exist in createBlogStyles() and are unique to specific posts.
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'app', 'blog');

// Custom styles needed by specific blog posts
const customStylesByPost = {
  'accurate-child-support-calculator.tsx': `
// Custom styles unique to this post
const customStyles = {
  ctaBox: { backgroundColor: '#22c55e', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center' as const },
  ctaBoxTitle: { fontSize: 18, fontWeight: '700' as const, color: '#ffffff', marginBottom: 8 },
  ctaBoxText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' as const },
  ctaBoxButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  ctaBoxButtonText: { color: '#22c55e', fontSize: 16, fontWeight: '700' as const },
  
  stepCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  stepTitle: { fontSize: 16, fontWeight: '600' as const, color: '#1e3a8a', marginBottom: 12 },
  
  tipBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#86efac' },
  tipTitle: { fontSize: 15, fontWeight: '600' as const, color: '#14532d', marginBottom: 8 },
  tipText: { fontSize: 15, lineHeight: 24, color: '#14532d' },
  
  resultsCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#bfdbfe' },
  resultsTitle: { fontSize: 16, fontWeight: '600' as const, color: '#1e3a8a', marginBottom: 12 },
  
  mistakeCard: { flexDirection: 'row' as const, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  mistakeNumber: { fontSize: 24, fontWeight: '700' as const, color: '#dc2626', marginRight: 12, width: 32 },
  mistakeContent: { flex: 1 },
  mistakeTitle: { fontSize: 15, fontWeight: '600' as const, color: '#1e3a8a', marginBottom: 4 },
  mistakeText: { fontSize: 14, lineHeight: 22, color: '#475569' },
  
  dangerBox: { backgroundColor: '#fef2f2', borderRadius: 12, borderWidth: 2, borderColor: '#dc2626', padding: 20, marginBottom: 24 },
  dangerTitle: { fontSize: 16, fontWeight: '700' as const, color: '#991b1b', marginBottom: 8 },
  dangerText: { fontSize: 15, lineHeight: 24, color: '#991b1b' },
  
  warningCard: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' },
  warningCardTitle: { fontSize: 16, fontWeight: '600' as const, color: '#991b1b', marginBottom: 12 },
  
  internalLink: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, marginBottom: 8, alignSelf: 'flex-start' as const },
  internalLinkBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#bfdbfe' },
  internalLinkTitle: { fontSize: 16, fontWeight: '700' as const, color: '#1e3a8a', marginBottom: 8 },
  internalLinkText: { color: '#ffffff', fontSize: 15, fontWeight: '600' as const },
  
  comparisonCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  comparisonTitle: { fontSize: 16, fontWeight: '600' as const, color: '#1e3a8a', marginBottom: 12 },
  
  calculatorSection: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 16, alignItems: 'center' as const, borderWidth: 1, borderColor: '#bfdbfe' },
  calculatorTitle: { fontSize: 22, fontWeight: '700' as const, color: '#1e3a8a', marginBottom: 12, textAlign: 'center' as const },
  calculatorText: { fontSize: 15, lineHeight: 24, color: '#475569', marginBottom: 20, textAlign: 'center' as const },
  calculatorFeatures: { marginBottom: 20 },
  
  trustSignalsBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#86efac' },
  trustSignalItem: { fontSize: 15, lineHeight: 24, color: '#14532d', marginBottom: 6 },
};

const styles = { ...createBlogStyles(), ...customStyles };
`
};

function addCustomStyles(filePath) {
  const fileName = path.basename(filePath);
  
  if (!customStylesByPost[fileName]) {
    return { skipped: true };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has custom styles
  if (content.includes('const customStyles =')) {
    console.log(`✅ ${fileName} already has custom styles`);
    return { alreadyHas: true };
  }

  // Find where to insert (right before the component export)
  const exportMatch = content.match(/\nexport default function/);
  
  if (!exportMatch) {
    console.log(`❌ ${fileName}: Could not find export statement`);
    return { error: true };
  }

  const insertIndex = exportMatch.index;
  
  // Insert custom styles
  content = content.substring(0, insertIndex) + 
            customStylesByPost[fileName] + 
            '\n' +
            content.substring(insertIndex);

  // Replace `const styles = createBlogStyles();` with merge
  content = content.replace(
    /const styles = createBlogStyles\(\);/,
    '// Styles merged below with custom styles'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${fileName}: Added custom styles`);
  return { fixed: true };
}

function main() {
  console.log('🔧 Fix Blog Custom Styles\n');

  const postsToFix = Object.keys(customStylesByPost);
  
  let stats = {
    fixed: 0,
    alreadyHas: 0,
    skipped: 0,
    errors: 0
  };

  postsToFix.forEach(fileName => {
    const filePath = path.join(BLOG_DIR, fileName);
    const result = addCustomStyles(filePath);
    
    if (result.fixed) stats.fixed++;
    else if (result.alreadyHas) stats.alreadyHas++;
    else if (result.skipped) stats.skipped++;
    else if (result.error) stats.errors++;
  });

  console.log('\n📊 Summary:');
  console.log(`   Fixed: ${stats.fixed}`);
  console.log(`   Already has custom styles: ${stats.alreadyHas}`);
  console.log(`   Errors: ${stats.errors}`);
  
  if (stats.fixed > 0) {
    console.log('\n✅ Custom styles added! Run type-check to verify.');
  }
}

main();
