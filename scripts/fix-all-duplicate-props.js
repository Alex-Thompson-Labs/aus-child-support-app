#!/usr/bin/env node

/**
 * Fix All Duplicate accessibilityRole Props
 * 
 * Removes duplicate accessibilityRole attributes across all patterns
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../app/blog');

let filesFixed = 0;
let totalDuplicatesRemoved = 0;

console.log('🔧 Fixing all duplicate accessibilityRole props...\n');

const files = fs.readdirSync(BLOG_DIR)
  .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx')
  .map(file => path.join(BLOG_DIR, file));

files.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileChanges = 0;

  // Strategy: Find all Pressable and Text components and remove duplicate accessibilityRole
  // We'll process line by line and track when we're inside a component
  
  const lines = content.split('\n');
  const newLines = [];
  let insideComponent = false;
  let componentLines = [];
  let componentIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts a Pressable or Text component
    if (line.match(/<(Pressable|Text)\s/)) {
      insideComponent = true;
      componentLines = [line];
      componentIndent = line.search(/\S/);
      
      // Check if component closes on same line
      if (line.includes('>') && !line.trim().endsWith('{')) {
        insideComponent = false;
        // Process this single-line component
        const processed = processComponent(componentLines.join('\n'));
        if (processed !== componentLines.join('\n')) {
          fileChanges++;
        }
        newLines.push(processed);
        componentLines = [];
      }
    } else if (insideComponent) {
      componentLines.push(line);
      
      // Check if component closes on this line
      if (line.includes('>')) {
        insideComponent = false;
        // Process multi-line component
        const processed = processComponent(componentLines.join('\n'));
        if (processed !== componentLines.join('\n')) {
          fileChanges++;
        }
        newLines.push(...processed.split('\n'));
        componentLines = [];
      }
    } else {
      newLines.push(line);
    }
  }
  
  content = newLines.join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    filesFixed++;
    totalDuplicatesRemoved += fileChanges;
    console.log(`✅ ${fileName} - Removed ${fileChanges} duplicate(s)`);
  }
});

function processComponent(componentText) {
  // Find all accessibilityRole attributes
  const roleMatches = componentText.match(/accessibilityRole="[^"]*"/g);
  
  if (!roleMatches || roleMatches.length <= 1) {
    return componentText;
  }
  
  // Keep the first accessibilityRole (it's usually the correct one)
  const firstRole = roleMatches[0];
  
  // Remove all accessibilityRole attributes
  let result = componentText;
  roleMatches.forEach(role => {
    result = result.replace(role, '');
  });
  
  // Add back the first one in the right place
  // Find the component opening tag and add it there
  result = result.replace(/(<(?:Pressable|Text)\s+)/, `$1${firstRole} `);
  
  // Clean up extra spaces
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s+>/g, '>');
  result = result.replace(/\s+\n/g, '\n');
  
  return result;
}

console.log('\n📊 Summary:');
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total duplicates removed: ${totalDuplicatesRemoved}`);
console.log('\n✅ All duplicate accessibilityRole props fixed!');
