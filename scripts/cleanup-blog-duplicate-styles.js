#!/usr/bin/env node

/**
 * Cleanup Blog Duplicate Styles Script
 * 
 * Removes duplicate customStyles objects from blog posts that already use createBlogStyles().
 * These duplicate styles were left over from the migration and are not being used.
 * 
 * What it does:
 * 1. Finds all blog posts with duplicate customStyles
 * 2. Removes the entire customStyles object and TODO comment
 * 3. Removes unused imports (Platform, StyleSheet, createShadow if not needed)
 * 4. Keeps only `const styles = createBlogStyles();`
 * 
 * Usage:
 *   node scripts/cleanup-blog-duplicate-styles.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'app', 'blog');
const DRY_RUN = process.argv.includes('--dry-run');

// Blog posts to skip (already cleaned or special cases)
const SKIP_FILES = [
  'index.tsx',
  'when-to-hire-family-lawyer.tsx', // Already cleaned
  '_layout.tsx'
];

function cleanupBlogPost(filePath) {
  const fileName = path.basename(filePath);
  
  if (SKIP_FILES.includes(fileName)) {
    console.log(`⏭️  Skipping ${fileName} (excluded)`);
    return { skipped: true };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Check if file has createBlogStyles import
  if (!content.includes('createBlogStyles')) {
    console.log(`⏭️  Skipping ${fileName} (no createBlogStyles import)`);
    return { skipped: true };
  }

  // Check if file has duplicate customStyles
  if (!content.includes('const customStyles = StyleSheet.create(')) {
    console.log(`✅ ${fileName} already clean (no customStyles)`);
    return { alreadyClean: true };
  }

  let changes = [];

  // Remove the TODO comment and customStyles object
  // Pattern: from "// TODO: Review..." to the end of the StyleSheet.create({...})
  // Need to match the closing }); which might have nested objects
  const todoCommentIndex = content.indexOf('// TODO: Review and remove styles');
  
  if (todoCommentIndex !== -1) {
    // Find the start of customStyles
    const customStylesStart = content.indexOf('const customStyles = StyleSheet.create({', todoCommentIndex);
    
    if (customStylesStart !== -1) {
      // Find the matching closing }); by counting braces
      let braceCount = 0;
      let inObject = false;
      let endIndex = customStylesStart;
      
      for (let i = customStylesStart; i < content.length; i++) {
        const char = content[i];
        
        if (char === '{') {
          braceCount++;
          inObject = true;
        } else if (char === '}') {
          braceCount--;
          if (inObject && braceCount === 0) {
            // Found the closing brace, now look for );
            const remaining = content.substring(i);
            const closingMatch = remaining.match(/^\}\);?\n*/);
            if (closingMatch) {
              endIndex = i + closingMatch[0].length;
              break;
            }
          }
        }
      }
      
      // Remove from TODO comment to end of customStyles
      content = content.substring(0, todoCommentIndex) + content.substring(endIndex);
      changes.push('Removed customStyles object');
    }
  }

  // Remove any leftover merge comment
  const mergeCommentPattern = /\/\/ Merge custom styles with shared styles\n\/\/ const styles = \{ \.\.\.createBlogStyles\(\), \.\.\.customStyles \};\n*/;
  if (mergeCommentPattern.test(content)) {
    content = content.replace(mergeCommentPattern, '');
    changes.push('Removed merge comment');
  }

  // Check if Platform is still used (excluding the import line)
  const contentWithoutImports = content.replace(/^import.*$/gm, '');
  const platformStillUsed = /Platform\.OS/.test(contentWithoutImports);
  
  if (!platformStillUsed) {
    // Remove Platform from imports
    content = content.replace(/import \{ ([^}]*), Platform, ([^}]*) \} from 'react-native';/, 
      'import { $1, $2 } from \'react-native\';');
    content = content.replace(/import \{ Platform, ([^}]*) \} from 'react-native';/, 
      'import { $1 } from \'react-native\';');
    content = content.replace(/import \{ ([^}]*), Platform \} from 'react-native';/, 
      'import { $1 } from \'react-native\';');
    
    // Clean up double commas and spaces
    content = content.replace(/\{ , /g, '{ ');
    content = content.replace(/ , \}/g, ' }');
    content = content.replace(/\{  /g, '{ ');
    content = content.replace(/  \}/g, ' }');
    
    changes.push('Removed Platform import');
  }

  // Check if StyleSheet is still used
  const stylesheetStillUsed = /StyleSheet\.create/.test(contentWithoutImports);
  
  if (!stylesheetStillUsed) {
    // Remove StyleSheet from imports
    content = content.replace(/import \{ ([^}]*), StyleSheet, ([^}]*) \} from 'react-native';/, 
      'import { $1, $2 } from \'react-native\';');
    content = content.replace(/import \{ StyleSheet, ([^}]*) \} from 'react-native';/, 
      'import { $1 } from \'react-native\';');
    content = content.replace(/import \{ ([^}]*), StyleSheet \} from 'react-native';/, 
      'import { $1 } from \'react-native\';');
    
    // Clean up double commas and spaces
    content = content.replace(/\{ , /g, '{ ');
    content = content.replace(/ , \}/g, ' }');
    content = content.replace(/\{  /g, '{ ');
    content = content.replace(/  \}/g, ' }');
    
    changes.push('Removed StyleSheet import');
  }

  // Check if createShadow is still used
  const createShadowStillUsed = /createShadow\(/.test(contentWithoutImports);
  
  if (!createShadowStillUsed) {
    // Remove createShadow import line entirely
    content = content.replace(/import \{ createShadow \} from '@\/src\/utils\/shadow-styles';\n/, '');
    changes.push('Removed createShadow import');
  }

  // Calculate lines removed
  const originalLines = originalContent.split('\n').length;
  const newLines = content.split('\n').length;
  const linesRemoved = originalLines - newLines;

  if (content !== originalContent) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    console.log(`${DRY_RUN ? '🔍' : '✅'} ${fileName}: ${changes.join(', ')} (${linesRemoved} lines removed)`);
    return { cleaned: true, changes, linesRemoved };
  } else {
    console.log(`✅ ${fileName} already clean`);
    return { alreadyClean: true };
  }
}

function main() {
  console.log('🧹 Blog Duplicate Styles Cleanup Script\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(BLOG_DIR, f));

  let stats = {
    total: files.length,
    cleaned: 0,
    alreadyClean: 0,
    skipped: 0,
    totalLinesRemoved: 0
  };

  files.forEach(file => {
    const result = cleanupBlogPost(file);
    if (result.cleaned) {
      stats.cleaned++;
      stats.totalLinesRemoved += result.linesRemoved || 0;
    } else if (result.alreadyClean) {
      stats.alreadyClean++;
    } else if (result.skipped) {
      stats.skipped++;
    }
  });

  console.log('\n📊 Summary:');
  console.log(`   Total files: ${stats.total}`);
  console.log(`   Cleaned: ${stats.cleaned}`);
  console.log(`   Already clean: ${stats.alreadyClean}`);
  console.log(`   Skipped: ${stats.skipped}`);
  console.log(`   Total lines removed: ${stats.totalLinesRemoved}`);
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  } else {
    console.log('\n✅ Cleanup complete!');
  }
}

main();
