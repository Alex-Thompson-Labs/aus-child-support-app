#!/usr/bin/env node

/**
 * Fix Multi-line Duplicate accessibilityRole Props
 * 
 * Handles cases where accessibilityRole appears on different lines
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../app/blog');

let filesFixed = 0;
let duplicatesRemoved = 0;

console.log('🔧 Fixing multi-line duplicate accessibilityRole props...\n');

const files = fs.readdirSync(BLOG_DIR)
  .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx')
  .map(file => path.join(BLOG_DIR, file));

files.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileChanges = 0;

  // Find all JSX opening tags that span multiple lines
  // Match <Pressable or <Text with props across multiple lines until >
  const componentRegex = /<(Pressable|Text)([^>]*?)>/gs;
  
  content = content.replace(componentRegex, (match, componentName, props) => {
    // Count how many accessibilityRole attributes are in this component
    const roleMatches = props.match(/accessibilityRole="[^"]*"/g);
    
    if (roleMatches && roleMatches.length > 1) {
      // Keep only the last one (most recent/correct)
      const lastRole = roleMatches[roleMatches.length - 1];
      
      // Remove all occurrences
      let newProps = props;
      roleMatches.forEach(role => {
        newProps = newProps.replace(role, '');
      });
      
      // Add back the last one at the beginning
      newProps = ` ${lastRole}${newProps}`;
      
      fileChanges++;
      modified = true;
      
      return `<${componentName}${newProps}>`;
    }
    
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    filesFixed++;
    duplicatesRemoved += fileChanges;
    console.log(`✅ ${fileName} - Removed ${fileChanges} multi-line duplicate(s)`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Duplicates removed: ${duplicatesRemoved}`);
console.log('\n✅ Multi-line duplicate accessibilityRole props fixed!');
