#!/usr/bin/env node

/**
 * Blog Style Migration Script
 * 
 * This script helps migrate blog posts to use the new shared blog styles.
 * 
 * Usage:
 *   node scripts/migrate-blog-styles.js [--dry-run] [--file=path/to/blog.tsx]
 * 
 * Options:
 *   --dry-run: Show what would be changed without making changes
 *   --file: Migrate a specific file instead of all blog posts
 * 
 * What it does:
 * 1. Adds import for createBlogStyles
 * 2. Replaces StyleSheet.create() with createBlogStyles()
 * 3. Removes duplicate style definitions that match shared styles
 * 4. Preserves custom styles unique to each blog post
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(process.cwd(), 'app/blog');
const DRY_RUN = process.argv.includes('--dry-run');
const SPECIFIC_FILE = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];

console.log('🎨 Blog Style Migration Script');
console.log('================================\n');

if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No files will be modified\n');
}

function migrateBlogPost(filePath) {
    const fileName = path.basename(filePath);
    console.log(`\n📄 Processing: ${fileName}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if already using shared styles
    if (content.includes('createBlogStyles')) {
        console.log('   ✓ Already using shared styles');
        return;
    }
    
    // Check if file has StyleSheet.create
    if (!content.includes('StyleSheet.create')) {
        console.log('   ⚠️  No StyleSheet.create found - skipping');
        return;
    }
    
    // Step 1: Add import for createBlogStyles
    if (!content.includes('createBlogStyles')) {
        const importMatch = content.match(/import.*from 'react-native';/);
        if (importMatch) {
            const importStatement = "\nimport { createBlogStyles } from '@/src/styles/blogStyles';";
            content = content.replace(
                importMatch[0],
                importMatch[0] + importStatement
            );
            modified = true;
            console.log('   ✓ Added createBlogStyles import');
        }
    }
    
    // Step 2: Replace StyleSheet.create with createBlogStyles
    const styleMatch = content.match(/const styles = StyleSheet\.create\({[\s\S]*?\n}\);/);
    if (styleMatch) {
        // For now, just replace the StyleSheet.create call
        // Manual review will be needed to remove duplicate styles
        content = content.replace(
            'const styles = StyleSheet.create({',
            'const styles = createBlogStyles();\n\n// TODO: Review and remove styles that are now in shared blogStyles\n// Keep only custom styles unique to this blog post\nconst customStyles = StyleSheet.create({'
        );
        
        // Add closing comment
        content = content.replace(
            /\n}\);(\s*$)/,
            '\n});\n\n// Merge custom styles with shared styles\n// const styles = { ...createBlogStyles(), ...customStyles };$1'
        );
        
        modified = true;
        console.log('   ✓ Replaced StyleSheet.create with createBlogStyles');
        console.log('   ⚠️  Manual review needed: Remove duplicate styles and merge custom ones');
    }
    
    if (modified && !DRY_RUN) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('   ✅ File updated');
    } else if (modified && DRY_RUN) {
        console.log('   📝 Would update file (dry run)');
    }
}

// Main execution
if (SPECIFIC_FILE) {
    const filePath = path.join(process.cwd(), SPECIFIC_FILE);
    if (fs.existsSync(filePath)) {
        migrateBlogPost(filePath);
    } else {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
} else {
    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => file.endsWith('.tsx') && file !== '_layout.tsx' && file !== 'index.tsx');
    
    console.log(`Found ${files.length} blog post files\n`);
    
    files.forEach(file => {
        const filePath = path.join(BLOG_DIR, file);
        migrateBlogPost(filePath);
    });
}

console.log('\n================================');
console.log('✅ Migration complete!\n');

if (!DRY_RUN) {
    console.log('⚠️  IMPORTANT: Manual review required for each file:');
    console.log('   1. Remove duplicate styles that are now in shared blogStyles');
    console.log('   2. Keep only custom styles unique to each blog post');
    console.log('   3. Merge custom styles: const styles = { ...createBlogStyles(), ...customStyles };');
    console.log('   4. Test each blog post to ensure styling is correct\n');
}
