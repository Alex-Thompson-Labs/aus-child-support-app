#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Converts PNG images to WebP and AVIF formats for better compression.
 * Part of Lighthouse Performance Optimization (Requirements 4.1, 4.2)
 * 
 * Usage:
 *   node scripts/optimize-images.js
 *   npm run images:optimize
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Convert an image to WebP format
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output WebP image
 * @param {number} quality - Quality setting (0-100), default 85
 */
async function convertToWebP(inputPath, outputPath, quality = 85) {
  try {
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✓ WebP: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(1)} KB → ${(outputStats.size / 1024).toFixed(1)} KB (${savings}% smaller)`);
    
    return { success: true, inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`✗ Failed to convert ${inputPath} to WebP:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Convert an image to AVIF format
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output AVIF image
 * @param {number} quality - Quality setting (0-100), default 80
 */
async function convertToAVIF(inputPath, outputPath, quality = 80) {
  try {
    await sharp(inputPath)
      .avif({ quality, effort: 6 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✓ AVIF: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`  ${(inputStats.size / 1024).toFixed(1)} KB → ${(outputStats.size / 1024).toFixed(1)} KB (${savings}% smaller)`);
    
    return { success: true, inputSize: inputStats.size, outputSize: outputStats.size };
  } catch (error) {
    console.error(`✗ Failed to convert ${inputPath} to AVIF:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Process all images in a directory
 * @param {string} directory - Directory to process
 * @param {boolean} recursive - Whether to process subdirectories
 */
async function processDirectory(directory, recursive = true) {
  const results = {
    processed: 0,
    failed: 0,
    totalInputSize: 0,
    totalOutputSize: 0,
    webp: { count: 0, inputSize: 0, outputSize: 0 },
    avif: { count: 0, inputSize: 0, outputSize: 0 }
  };

  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory() && recursive) {
        // Skip node_modules, .git, etc.
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subResults = await processDirectory(fullPath, recursive);
          results.processed += subResults.processed;
          results.failed += subResults.failed;
          results.totalInputSize += subResults.totalInputSize;
          results.totalOutputSize += subResults.totalOutputSize;
          results.webp.count += subResults.webp.count;
          results.webp.inputSize += subResults.webp.inputSize;
          results.webp.outputSize += subResults.webp.outputSize;
          results.avif.count += subResults.avif.count;
          results.avif.inputSize += subResults.avif.inputSize;
          results.avif.outputSize += subResults.avif.outputSize;
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        
        // Only process PNG and JPG images
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
          const baseName = path.basename(entry.name, ext);
          const dirName = path.dirname(fullPath);
          
          // Skip if already optimized
          if (baseName.endsWith('-optimized')) {
            continue;
          }
          
          console.log(`\nProcessing: ${fullPath}`);
          
          // Convert to WebP
          const webpPath = path.join(dirName, `${baseName}.webp`);
          const webpResult = await convertToWebP(fullPath, webpPath);
          
          if (webpResult.success) {
            results.webp.count++;
            results.webp.inputSize += webpResult.inputSize;
            results.webp.outputSize += webpResult.outputSize;
            results.processed++;
          } else {
            results.failed++;
          }
          
          // Convert to AVIF
          const avifPath = path.join(dirName, `${baseName}.avif`);
          const avifResult = await convertToAVIF(fullPath, avifPath);
          
          if (avifResult.success) {
            results.avif.count++;
            results.avif.inputSize += avifResult.inputSize;
            results.avif.outputSize += avifResult.outputSize;
            results.processed++;
          } else {
            results.failed++;
          }
          
          results.totalInputSize += (webpResult.inputSize || 0) + (avifResult.inputSize || 0);
          results.totalOutputSize += (webpResult.outputSize || 0) + (avifResult.outputSize || 0);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error.message);
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('================================\n');
  
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.error('Error: public directory not found');
    process.exit(1);
  }
  
  console.log(`Processing images in: ${publicDir}\n`);
  
  const results = await processDirectory(publicDir, true);
  
  console.log('\n================================');
  console.log('📊 Summary');
  console.log('================================');
  console.log(`Total images processed: ${results.processed}`);
  console.log(`Failed conversions: ${results.failed}`);
  
  if (results.webp.count > 0) {
    const webpSavings = ((results.webp.inputSize - results.webp.outputSize) / results.webp.inputSize * 100).toFixed(1);
    console.log(`\nWebP conversions: ${results.webp.count}`);
    console.log(`  Input: ${(results.webp.inputSize / 1024).toFixed(1)} KB`);
    console.log(`  Output: ${(results.webp.outputSize / 1024).toFixed(1)} KB`);
    console.log(`  Savings: ${webpSavings}%`);
  }
  
  if (results.avif.count > 0) {
    const avifSavings = ((results.avif.inputSize - results.avif.outputSize) / results.avif.inputSize * 100).toFixed(1);
    console.log(`\nAVIF conversions: ${results.avif.count}`);
    console.log(`  Input: ${(results.avif.inputSize / 1024).toFixed(1)} KB`);
    console.log(`  Output: ${(results.avif.outputSize / 1024).toFixed(1)} KB`);
    console.log(`  Savings: ${avifSavings}%`);
  }
  
  if (results.totalInputSize > 0) {
    const totalSavings = ((results.totalInputSize - results.totalOutputSize) / results.totalInputSize * 100).toFixed(1);
    console.log(`\nTotal savings: ${totalSavings}%`);
    console.log(`  ${(results.totalInputSize / 1024).toFixed(1)} KB → ${(results.totalOutputSize / 1024).toFixed(1)} KB`);
  }
  
  console.log('\n✅ Image optimization complete!');
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { convertToWebP, convertToAVIF, processDirectory };
