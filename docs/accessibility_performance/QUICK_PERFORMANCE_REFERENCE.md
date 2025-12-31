# Quick Performance Reference

## 🚀 Testing Commands

```bash
# Build for production
npm run build:web

# Analyze bundle size
npm run build:analyze
# Opens dist/bundle-analysis.html in browser

# Run Lighthouse audit
npm run lighthouse
# Opens lighthouse-report.html in browser

# Serve locally for manual testing
npx serve dist -p 8080
# Open http://localhost:8080 in browser
```

---

## 📊 Target Metrics

### Lighthouse Scores

- **Performance:** 80+ (minimum), 90+ (ideal)
- **Accessibility:** 95+
- **Best Practices:** 90+
- **SEO:** 95+

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size

- **Uncompressed:** < 3 MB
- **Compressed (Brotli):** < 2 MB
- **Current:** 4.8 MB → ~1.4-1.9 MB (compressed)

---

## 🔍 Where to Check Performance

### Development

```bash
# Start dev server
npm run web

# Open browser console
# Look for: [Web Vitals] { LCP: "1234ms (good)", ... }
```

### Production

1. **Google Analytics**
   - Events → web_vitals
   - Metrics automatically tracked

2. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Enter: auschildsupport.com
   - Get real-world data

3. **Lighthouse**
   - Chrome DevTools (F12)
   - Lighthouse tab
   - Analyze page load

---

## 📁 Key Files

### Performance Monitoring

- `src/utils/web-vitals.ts` - Performance tracking
- `app/_layout.tsx` - Monitoring initialization

### Configuration

- `netlify.toml` - Caching, compression, security
- `app/+html.tsx` - SEO, Google Analytics
- `package.json` - Performance scripts

### Documentation

- `docs/WEB_PERFORMANCE_OPTIMIZATION.md` - Full guide
- `docs/PERFORMANCE_OPTIMIZATION_SUMMARY.md` - What's done
- `docs/ACCESSIBILITY_AUDIT.md` - Accessibility issues
- `docs/ACCESSIBILITY_TESTING.md` - Testing guide

---

## ⚡ Quick Optimizations (Not Yet Implemented)

### 1. Image Optimization (~400 KB savings)

```bash
# Compress PNGs
npx imagemin assets/images/*.png --out-dir=assets/images/optimized --plugin=pngquant

# Convert to WebP
npx @squoosh/cli --webp auto assets/images/*.png -d assets/images/webp/
```

### 2. Optimize Icon Imports (~200 KB savings)

**Bad:**

```tsx
import * as Icons from 'lucide-react-native';
```

**Good:**

```tsx
import { Calculator, AlertCircle } from 'lucide-react-native';
```

### 3. Add React.memo (Better UX)

```tsx
export const ChildRow = memo(function ChildRow({ ... }) {
  // Component code
});
```

---

## 📈 Monitoring Checklist

### Daily (During Development)

- [ ] Check browser console for Web Vitals logs
- [ ] Verify no console errors

### Pre-Deploy

- [ ] Run `npm run build:analyze`
- [ ] Run `npm run lighthouse`
- [ ] Fix critical issues (score < 50)

### Post-Deploy

- [ ] Test live site on PageSpeed Insights
- [ ] Check Google Analytics web_vitals events
- [ ] Verify caching headers working (Network tab)

### Weekly

- [ ] Review Lighthouse score trends
- [ ] Monitor Core Web Vitals in GA
- [ ] Check for performance regressions

### Monthly

- [ ] Full performance audit
- [ ] Bundle size analysis
- [ ] Review and implement new optimizations

---

## 🎯 Current Status

**Implemented:**

- ✅ Brotli/gzip compression (60-70% reduction)
- ✅ Aggressive caching (static: 1 year, HTML: 1 hour)
- ✅ Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Performance testing scripts
- ✅ Bundle analysis tools

**Pending (Quick Wins):**

- ⏳ Image optimization (~400 KB)
- ⏳ System fonts on web (~200 KB)
- ⏳ Optimize icon imports (~200 KB)
- ⏳ Code splitting admin routes (~500 KB)
- ⏳ React.memo for heavy components

**Total Potential Savings:** ~1.3 MB + compression = **Final ~800 KB-1.2 MB**

---

## 🚨 Common Issues & Solutions

### High LCP (> 4s)

- Compress images
- Enable caching (already done)
- Use CDN for static assets
- Lazy load below-fold content

### High FID (> 300ms)

- Reduce JavaScript execution time
- Code split large bundles
- Use React.memo to prevent re-renders
- Defer non-critical scripts

### High CLS (> 0.25)

- Set explicit dimensions on images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use CSS aspect-ratio

### Large Bundle Size

- Analyze with `npm run build:analyze`
- Remove unused dependencies
- Optimize imports (no wildcards)
- Code split routes

---

## 📞 Quick Links

**Testing:**

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developers.google.com/web/tools/lighthouse)

**Documentation:**

- [Web Vitals](https://web.dev/vitals/)
- [Expo Web Performance](https://docs.expo.dev/guides/web-performance/)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)

**Tools:**

- [Bundle Analyzer](https://www.npmjs.com/package/source-map-explorer)
- [ImageOptim](https://imageoptim.com/)
- [Squoosh](https://squoosh.app/) - Image compression

---

**Last Updated:** 2025-12-28
**Next Review:** After production deployment
