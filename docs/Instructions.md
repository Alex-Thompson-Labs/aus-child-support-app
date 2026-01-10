# SEO Verification Instructions

## 1. WordPress Blog SEO Setup

Your main blog is at `blog.auschildsupport.com` (WordPress subdomain). Configure SEO there:

### Required Plugins
- **Yoast SEO** or **Rank Math** - handles meta tags, Open Graph, sitemaps

### Configuration Steps
1. Install your chosen SEO plugin
2. Set site title: "AusChildSupport Blog"
3. Configure Open Graph:
   - Default OG image (1200x630px)
   - Site name: "AusChildSupport"
4. Enable XML sitemap
5. Add your subdomain sitemap to Google Search Console

### Structured Data
Add these schemas to your blog posts:
- `BlogPosting` - for individual articles
- `Organization` - matches main site

---

## 2. Google Search Console URL Inspection

Test that JavaScript-rendered calculator content is indexable.

### Steps
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `auschildsupport.com`
3. Click **URL Inspection** in the left menu
4. Enter the URL to test (e.g., `https://auschildsupport.com/`)
5. Click **Test Live URL**
6. Wait for the live test to complete
7. Click **View Tested Page** → **Screenshot** to see what Google sees

### What to Check
- ✅ Calculator form is visible in screenshot
- ✅ Page title and meta description appear correctly
- ✅ No "Page cannot be indexed" errors
- ✅ Structured data is detected (check "Enhancements")

### URLs to Test
- `/` (homepage with calculator)
- `/lawyer-inquiry`
- `/special-circumstances`
- `/change-of-assessment/high-costs-of-contact` (sample CoA page)

---

## 3. Lighthouse Performance Audit

Run Lighthouse to verify Core Web Vitals (LCP, FID/INP, CLS).

### Option A: Chrome DevTools (Quick)
1. Open your production site in Chrome: `https://auschildsupport.com`
2. Open DevTools (`F12` or `Cmd+Option+I`)
3. Go to **Lighthouse** tab
4. Select: Mobile, Performance, Accessibility, SEO
5. Click **Analyze page load**
6. Review scores and recommendations

### Option B: Command Line (Detailed)
```bash
# From project root
npm run lighthouse
```

This runs a full audit and saves the report to `lighthouse-report.html`.

### Option C: PageSpeed Insights (Public)
1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter `https://auschildsupport.com`
3. View both Mobile and Desktop results

### Target Scores
| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | Largest Contentful Paint - main content loads fast |
| FID/INP | < 100ms | First Input Delay - page responds quickly |
| CLS | < 0.1 | Cumulative Layout Shift - no unexpected jumps |
| Performance | > 90 | Overall performance score |
| Accessibility | > 90 | Screen reader and keyboard compatibility |
| SEO | > 90 | Meta tags, crawlability, mobile-friendly |

### Common Issues & Fixes
- **Slow LCP**: Optimize images, preload critical assets
- **High CLS**: Reserve space for images/ads, avoid inserting content above viewport
- **Poor FID**: Defer non-critical JavaScript, reduce main thread work