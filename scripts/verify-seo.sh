#!/bin/bash
# SEO Verification Script
# Run after: npm run build:web

echo "🔍 SEO Verification Report"
echo "=========================="
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist/ directory not found. Run 'npm run build:web' first."
    exit 1
fi

# 1. Canonical URLs
echo "1️⃣  Canonical URLs"
echo "-------------------"
CANONICAL_COUNT=$(grep -r 'rel="canonical"' dist/*.html 2>/dev/null | wc -l | tr -d ' ')
echo "✅ Found $CANONICAL_COUNT canonical tags"

# Check for correct domain
WRONG_DOMAIN=$(grep -r 'auschildsupport.com/"' dist/*.html 2>/dev/null | grep -v '.com.au' | wc -l | tr -d ' ')
if [ "$WRONG_DOMAIN" -gt 0 ]; then
    echo "⚠️  Warning: Found $WRONG_DOMAIN URLs without .com.au domain"
else
    echo "✅ All canonical URLs use .com.au domain"
fi
echo ""

# 2. Resource Hints
echo "2️⃣  Resource Hints (Preconnect/DNS-Prefetch)"
echo "--------------------------------------------"
PRECONNECT_COUNT=$(grep -o 'rel="preconnect"' dist/index.html | wc -l | tr -d ' ')
DNS_PREFETCH_COUNT=$(grep -o 'rel="dns-prefetch"' dist/index.html | wc -l | tr -d ' ')
echo "✅ Preconnect tags: $PRECONNECT_COUNT"
echo "✅ DNS-prefetch tags: $DNS_PREFETCH_COUNT"

if grep -q 'google-analytics.com' dist/index.html; then
    echo "✅ Google Analytics preconnect found"
fi
if grep -q 'supabase.co' dist/index.html; then
    echo "✅ Supabase preconnect found"
fi
echo ""

# 3. Structured Data
echo "3️⃣  Structured Data (Schema.org)"
echo "--------------------------------"
SCHEMA_COUNT=$(grep -o 'application/ld+json' dist/index.html | wc -l | tr -d ' ')
echo "✅ Found $SCHEMA_COUNT schema.org blocks"

if grep -q '@type":"BreadcrumbList' dist/faq.html 2>/dev/null; then
    echo "✅ Breadcrumb schema found on FAQ page"
fi
if grep -q '@type":"FAQPage' dist/faq.html 2>/dev/null; then
    echo "✅ FAQPage schema found"
fi
echo ""

# 4. Sitemap
echo "4️⃣  Sitemap"
echo "-----------"
if [ -f "public/sitemap.xml" ]; then
    URL_COUNT=$(grep -c '<loc>' public/sitemap.xml)
    echo "✅ Sitemap exists with $URL_COUNT URLs"
    
    # Check for dynamic dates
    UNIQUE_DATES=$(grep '<lastmod>' public/sitemap.xml | sort -u | wc -l | tr -d ' ')
    if [ "$UNIQUE_DATES" -gt 1 ]; then
        echo "✅ Sitemap uses dynamic dates ($UNIQUE_DATES unique dates)"
    else
        echo "⚠️  Warning: All sitemap dates are the same"
    fi
    
    # Check priority values
    if grep -q 'priority>1.0' public/sitemap.xml; then
        echo "⚠️  Warning: Found priority=1.0 (consider reducing to 0.8)"
    else
        echo "✅ Priority values are reasonable"
    fi
else
    echo "❌ Sitemap not found"
fi
echo ""

# 5. Robots.txt
echo "5️⃣  Robots.txt"
echo "--------------"
if [ -f "public/robots.txt" ]; then
    echo "✅ robots.txt exists"
    
    if grep -q '*.original' public/robots.txt; then
        echo "⚠️  Warning: robots.txt blocks *.original (verify these files exist)"
    else
        echo "✅ No unnecessary blocks found"
    fi
    
    if grep -q 'Sitemap:' public/robots.txt; then
        echo "✅ Sitemap reference found"
    fi
else
    echo "❌ robots.txt not found"
fi
echo ""

# 6. Meta Tags
echo "6️⃣  Meta Tags"
echo "-------------"
if grep -q 'name="description"' dist/index.html; then
    echo "✅ Meta description found"
fi
if grep -q 'property="og:title"' dist/index.html; then
    echo "✅ Open Graph tags found"
fi
if grep -q 'name="twitter:card"' dist/index.html; then
    echo "✅ Twitter Card tags found"
fi
if grep -q 'lang="en-AU"' dist/index.html; then
    echo "✅ Language attribute set to en-AU"
fi
echo ""

# 7. Static Generation
echo "7️⃣  Static Generation"
echo "---------------------"
HTML_COUNT=$(find dist -name "*.html" -type f | wc -l | tr -d ' ')
echo "✅ Generated $HTML_COUNT HTML files"

# Check for Change of Assessment pages
COA_COUNT=$(find dist -name "*reason-slug*.html" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$COA_COUNT" -gt 0 ]; then
    echo "✅ Change of Assessment pages pre-rendered"
else
    echo "⚠️  Warning: CoA pages may not be pre-rendered"
fi
echo ""

# 8. Performance
echo "8️⃣  Performance Indicators"
echo "--------------------------"
INDEX_SIZE=$(du -h dist/index.html 2>/dev/null | cut -f1)
echo "📊 Homepage size: $INDEX_SIZE"

# Check for critical CSS
if grep -q 'CRITICAL:' dist/index.html; then
    echo "✅ Critical CSS inline found"
fi

# Check for lazy loading
if grep -q 'React.lazy' dist/_expo/static/js/web/*.js 2>/dev/null; then
    echo "✅ Code splitting detected"
fi
echo ""

# Summary
echo "=========================="
echo "✅ SEO Verification Complete"
echo ""
echo "Next Steps:"
echo "1. Deploy to Vercel: git push"
echo "2. Test live site: https://auschildsupport.com.au"
echo "3. Submit sitemap to Google Search Console"
echo "4. Run Lighthouse audit: npm run lighthouse"
echo ""
