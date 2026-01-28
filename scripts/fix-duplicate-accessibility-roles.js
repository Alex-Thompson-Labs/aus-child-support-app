#!/usr/bin/env node

/**
 * Fix Duplicate accessibilityRole Props
 * 
 * Removes duplicate accessibilityRole attributes that were added by automation
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../app/blog');

let filesFixed = 0;
let duplicatesRemoved = 0;

console.log('🔧 Fixing duplicate accessibilityRole props...\n');

const files = fs.readdirSync(BLOG_DIR)
  .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx')
  .map(file => path.join(BLOG_DIR, file));

files.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileChanges = 0;

  // Pattern 1: accessibilityRole="X" accessibilityRole="Y" (two in a row)
  const pattern1 = /accessibilityRole="[^"]*"\s+accessibilityRole="([^"]*)"/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    content = content.replace(pattern1, 'accessibilityRole="$1"');
    fileChanges += matches1.length;
    modified = true;
  }

  // Pattern 2: accessibilityRole="X" ... accessibilityRole="Y" (with other props in between)
  // This is trickier - we need to find Pressable/Text components with duplicate accessibilityRole
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if line has multiple accessibilityRole attributes
    const roleMatches = line.match(/accessibilityRole=/g);
    if (roleMatches && roleMatches.length > 1) {
      // Keep only the last accessibilityRole (most recent/correct one)
      const lastRoleMatch = line.match(/accessibilityRole="([^"]*)"/g);
      if (lastRoleMatch && lastRoleMatch.length > 1) {
        const lastRole = lastRoleMatch[lastRoleMatch.length - 1];
        // Remove all but the last one
        let tempLine = line;
        for (let j = 0; j < lastRoleMatch.length - 1; j++) {
          tempLine = tempLine.replace(lastRoleMatch[j] + ' ', '');
          tempLine = tempLine.replace(lastRoleMatch[j], '');
        }
        line = tempLine;
        fileChanges++;
        modified = true;
      }
    }
    
    newLines.push(line);
  }
  
  if (modified) {
    content = newLines.join('\n');
    fs.writeFileSync(filePath, content);
    filesFixed++;
    duplicatesRemoved += fileChanges;
    console.log(`✅ ${fileName} - Removed ${fileChanges} duplicate(s)`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Duplicates removed: ${duplicatesRemoved}`);
console.log('\n✅ Duplicate accessibilityRole props fixed!');
