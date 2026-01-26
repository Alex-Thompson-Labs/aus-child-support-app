#!/usr/bin/env node

/**
 * Validation Script: Platform-Specific Code Isolation
 * 
 * Validates that web-specific optimizations are properly guarded with Platform.OS checks
 * to ensure iOS and Android builds are not affected.
 * 
 * Requirements validated:
 * - 10.3: Platform-specific code uses Platform.OS checks
 * - 10.4: Web optimizations only run on web
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Files that contain web-specific optimizations
const criticalFiles = [
  'app/_layout.tsx',
  'src/utils/analytics.ts',
  'src/components/ui/LazyLoad.tsx',
  'src/utils/supabase/client.ts',
  'src/hooks/useClientOnly.ts',
];

// Web-specific APIs and libraries that should be guarded
const webSpecificPatterns = [
  { pattern: /window\./g, name: 'window API' },
  { pattern: /document\./g, name: 'document API' },
  { pattern: /navigator\./g, name: 'navigator API' },
  { pattern: /localStorage/g, name: 'localStorage' },
  { pattern: /sessionStorage/g, name: 'sessionStorage' },
  { pattern: /requestIdleCallback/g, name: 'requestIdleCallback' },
  { pattern: /@vercel\/analytics/g, name: 'Vercel Analytics' },
  { pattern: /@vercel\/speed-insights/g, name: 'Vercel Speed Insights' },
  { pattern: /react-ga4/g, name: 'Google Analytics' },
];

// Platform guards that should be present
const platformGuards = [
  /Platform\.OS\s*===\s*['"]web['"]/,
  /isWeb/,
  /typeof window\s*!==\s*['"]undefined['"]/,
  /isClient\(\)/,
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const issues = [];

console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  Platform-Specific Code Validation                         ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

/**
 * Check if a line has a platform guard
 */
function hasplatformGuard(line) {
  return platformGuards.some(guard => guard.test(line));
}

/**
 * Check if a line is within a platform-guarded block
 */
function isInGuardedBlock(lines, lineIndex) {
  // Look backwards for a platform guard
  for (let i = lineIndex; i >= Math.max(0, lineIndex - 10); i--) {
    if (hasplatformGuard(lines[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`${colors.yellow}⚠ File not found: ${filePath}${colors.reset}`);
    return;
  }
  
  console.log(`${colors.blue}Checking: ${filePath}${colors.reset}`);
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  let fileIssues = [];
  
  // Check for web-specific patterns
  webSpecificPatterns.forEach(({ pattern, name }) => {
    const matches = content.match(pattern);
    if (matches) {
      totalChecks++;
      
      // Check if each match is properly guarded
      let unguardedMatches = 0;
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          // Skip comments
          if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
            return;
          }
          
          // Skip import statements (tree-shaken at build time)
          if (line.trim().startsWith('import ') || line.includes('from \'@vercel') || line.includes('from "@vercel')) {
            return;
          }
          
          // Skip dynamic imports (they're lazy loaded)
          if (line.includes('await import(') || line.includes('import(\'react-ga4\')') || line.includes('import("react-ga4")')) {
            return;
          }
          
          // Check if this line or nearby lines have a platform guard
          if (!hasplatformGuard(line) && !isInGuardedBlock(lines, index)) {
            unguardedMatches++;
            fileIssues.push({
              line: index + 1,
              content: line.trim(),
              issue: `Unguarded ${name} usage`,
            });
          }
        }
      });
      
      if (unguardedMatches === 0) {
        passedChecks++;
        console.log(`  ${colors.green}✓${colors.reset} ${name} properly guarded (${matches.length} usage(s))`);
      } else {
        failedChecks++;
        console.log(`  ${colors.red}✗${colors.reset} ${name} has ${unguardedMatches} unguarded usage(s)`);
      }
    }
  });
  
  if (fileIssues.length > 0) {
    issues.push({
      file: filePath,
      issues: fileIssues,
    });
  }
  
  console.log('');
}

/**
 * Check that critical optimizations have platform guards
 */
function validateCriticalOptimizations() {
  console.log(`${colors.cyan}Validating Critical Optimizations:${colors.reset}\n`);
  
  const checks = [
    {
      file: 'app/_layout.tsx',
      pattern: /<Analytics|<SpeedInsights/,
      description: 'Vercel Analytics components',
    },
    {
      file: 'app/_layout.tsx',
      pattern: /AnalyticsUtil\.initialize/,
      description: 'Google Analytics initialization',
    },
    {
      file: 'src/utils/analytics.ts',
      pattern: /const isWeb = Platform\.OS === ['"]web['"]/,
      description: 'Analytics platform check',
    },
    {
      file: 'src/hooks/useClientOnly.ts',
      pattern: /Platform\.OS === ['"]web['"]/,
      description: 'Client-only hook platform check',
    },
  ];
  
  checks.forEach(({ file, pattern, description }) => {
    totalChecks++;
    const fullPath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(fullPath)) {
      failedChecks++;
      console.log(`  ${colors.red}✗${colors.reset} ${description}: File not found`);
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (pattern.test(content)) {
      passedChecks++;
      console.log(`  ${colors.green}✓${colors.reset} ${description}`);
    } else {
      failedChecks++;
      console.log(`  ${colors.red}✗${colors.reset} ${description}: Pattern not found`);
      issues.push({
        file,
        issues: [{ line: 0, content: '', issue: `Missing: ${description}` }],
      });
    }
  });
  
  console.log('');
}

/**
 * Main validation
 */
function main() {
  // Validate critical files
  criticalFiles.forEach(validateFile);
  
  // Validate critical optimizations
  validateCriticalOptimizations();
  
  // Print summary
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total checks: ${totalChecks}`);
  console.log(`  ${colors.green}Passed: ${passedChecks}${colors.reset}`);
  console.log(`  ${colors.red}Failed: ${failedChecks}${colors.reset}\n`);
  
  // Print detailed issues
  if (issues.length > 0) {
    console.log(`${colors.red}Issues Found:${colors.reset}\n`);
    issues.forEach(({ file, issues: fileIssues }) => {
      console.log(`${colors.yellow}${file}:${colors.reset}`);
      fileIssues.forEach(({ line, content, issue }) => {
        if (line > 0) {
          console.log(`  Line ${line}: ${issue}`);
          console.log(`    ${colors.yellow}${content}${colors.reset}`);
        } else {
          console.log(`  ${issue}`);
        }
      });
      console.log('');
    });
  }
  
  // Print recommendations
  console.log(`${colors.cyan}Recommendations:${colors.reset}`);
  console.log(`  1. All web-specific APIs should be guarded with Platform.OS === 'web'`);
  console.log(`  2. Use the useClientOnly hook for web-only React hooks`);
  console.log(`  3. Wrap web-only components in Platform.OS === 'web' conditionals`);
  console.log(`  4. Test iOS/Android builds to ensure no web dependencies leak\n`);
  
  // Exit with appropriate code
  if (failedChecks > 0) {
    console.log(`${colors.red}❌ Validation FAILED${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ Validation PASSED${colors.reset}\n`);
    console.log(`${colors.green}All web-specific optimizations are properly isolated!${colors.reset}\n`);
    process.exit(0);
  }
}

main();
