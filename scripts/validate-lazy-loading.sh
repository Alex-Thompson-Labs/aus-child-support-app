#!/bin/bash

# Validation script for lazy loading of PDF libraries
# This script checks that PDF libraries are in a separate bundle, not in the main entry bundle

echo "🚀 Starting lazy loading validation..."
echo ""

# Define PDF library patterns to search for
PDF_PATTERNS=(
  "react-pdf"
  "expo-print"
  "expo-sharing"
  "@react-pdf/renderer"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dist directory exists
if [ ! -d "dist/_expo/static/js/web" ]; then
  echo "❌ Error: dist/_expo/static/js/web directory not found"
  echo "   Please run 'npm run build:web' first"
  exit 1
fi

echo "📦 Analyzing bundle files..."
echo ""

# Find the entry bundle (largest bundle, typically named entry-*.js)
ENTRY_BUNDLE=$(ls -lS dist/_expo/static/js/web/entry-*.js 2>/dev/null | head -1 | awk '{print $NF}')
COMMON_BUNDLE=$(ls -lS dist/_expo/static/js/web/__common-*.js 2>/dev/null | head -1 | awk '{print $NF}')
PDF_BUNDLE=$(ls dist/_expo/static/js/web/PDFExportButton-*.js 2>/dev/null | head -1)

if [ -z "$ENTRY_BUNDLE" ]; then
  echo "❌ Error: Could not find entry bundle"
  exit 1
fi

echo "📄 Entry bundle: $(basename $ENTRY_BUNDLE)"
echo "📄 Common bundle: $(basename $COMMON_BUNDLE)"
if [ -n "$PDF_BUNDLE" ]; then
  echo "📄 PDF bundle: $(basename $PDF_BUNDLE)"
else
  echo "⚠️  No separate PDF bundle found"
fi
echo ""

# Check entry bundle size
ENTRY_SIZE=$(ls -lh "$ENTRY_BUNDLE" | awk '{print $5}')
echo "📊 Entry bundle size: $ENTRY_SIZE"
echo ""

# Check if PDF libraries are in entry or common bundles
echo "🔍 Checking for PDF libraries in main bundles..."
echo ""

FOUND_IN_MAIN=0

for pattern in "${PDF_PATTERNS[@]}"; do
  # Check entry bundle
  if grep -q "$pattern" "$ENTRY_BUNDLE" 2>/dev/null; then
    echo -e "   ${RED}❌ FAIL${NC}: Found \"$pattern\" in entry bundle"
    FOUND_IN_MAIN=1
  else
    echo -e "   ${GREEN}✅ PASS${NC}: \"$pattern\" NOT in entry bundle"
  fi
  
  # Check common bundle
  if [ -n "$COMMON_BUNDLE" ] && grep -q "$pattern" "$COMMON_BUNDLE" 2>/dev/null; then
    echo -e "   ${RED}❌ FAIL${NC}: Found \"$pattern\" in common bundle"
    FOUND_IN_MAIN=1
  else
    echo -e "   ${GREEN}✅ PASS${NC}: \"$pattern\" NOT in common bundle"
  fi
done

echo ""

# Check if PDF bundle exists and contains the libraries
if [ -n "$PDF_BUNDLE" ]; then
  echo "🔍 Checking PDF bundle for expected libraries..."
  echo ""
  
  FOUND_IN_PDF=0
  for pattern in "${PDF_PATTERNS[@]}"; do
    if grep -q "$pattern" "$PDF_BUNDLE" 2>/dev/null; then
      echo -e "   ${GREEN}✅ FOUND${NC}: \"$pattern\" in PDF bundle"
      FOUND_IN_PDF=1
    fi
  done
  
  if [ $FOUND_IN_PDF -eq 0 ]; then
    echo -e "   ${YELLOW}⚠️  WARNING${NC}: No PDF library patterns found in PDF bundle"
    echo "   This might be expected if libraries are minified/obfuscated"
  fi
  echo ""
fi

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "📊 VALIDATION SUMMARY"
echo "═══════════════════════════════════════════════════════════"

if [ $FOUND_IN_MAIN -eq 0 ]; then
  echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
  echo "   - PDF libraries NOT found in entry/common bundles"
  echo "   - Lazy loading is working correctly"
  echo "   - Requirement 2.2: VALIDATED"
  echo "═══════════════════════════════════════════════════════════"
  exit 0
else
  echo -e "${RED}❌ VALIDATION FAILED${NC}"
  echo "   - PDF libraries found in main bundles"
  echo "   - Lazy loading may not be working correctly"
  echo "   - Requirement 2.2: NOT VALIDATED"
  echo "═══════════════════════════════════════════════════════════"
  exit 1
fi
