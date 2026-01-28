# Blog SEO Optimization Prompts

This directory contains production-ready prompts for optimizing blog posts for technical SEO.

---

## 📁 Files in This Directory

### 1. BLOG_TECHNICAL_SEO_AUDIT_PROMPT.md
**Purpose:** Comprehensive technical SEO audit (60-90 minutes)

**Use when:**
- Auditing new blog posts before publication
- Troubleshooting ranking problems
- Preparing for Google algorithm updates
- Training team members on technical SEO

**What it covers:**
- Meta tags & indexability
- Structured data (Schema.org)
- Heading hierarchy
- Internal linking
- Core Web Vitals (LCP, INP, CLS)
- Mobile-first optimization
- Accessibility & semantic HTML
- Content optimization
- Technical issues
- Analytics & tracking

**Output:**
- Executive summary
- Issues by severity (Critical, High, Medium, Low)
- Code examples
- Verification steps
- Prioritized action plan

---

### 2. BLOG_TECHNICAL_SEO_QUICK_START.md
**Purpose:** Quick technical SEO audit (10-15 minutes)

**Use when:**
- Need fast audit before publishing
- Limited time available
- Checking for critical issues only
- Batch auditing multiple posts

**What it covers:**
- Meta tags (title, description, canonical)
- Structured data basics
- Heading hierarchy
- Core Web Vitals overview
- Mobile-first basics

**Output:**
- Quick issue summary
- Common fixes with code examples
- Priority matrix
- Verification tools list

---

### 3. BLOG_OPTIMIZATION_QUICK_START.md
**Purpose:** Content and conversion optimization

**Use when:**
- Optimizing blog posts for lead generation
- Adding contextual CTAs
- Improving internal linking
- Enhancing trust signals

**What it covers:**
- Contextual wizard integration
- Internal linking strategy
- Trust signal enhancement
- CTA placement optimization

---

### 4. BLOG_POST_GENERATOR_PROMPT.md
**Purpose:** Generate new blog posts from scratch

**Use when:**
- Creating new blog content
- Targeting featured snippets
- Expanding content library

**What it covers:**
- Content structure
- SEO optimization
- Featured snippet targeting
- Code generation (React Native/TypeScript)

---

### 5. BLOG_LEAD_OPTIMIZATION_PROMPT.md
**Purpose:** Optimize blog posts for lead generation

**Use when:**
- Improving conversion rates
- Adding lead capture mechanisms
- Optimizing CTAs

**What it covers:**
- Lead capture strategies
- CTA optimization
- Conversion funnel design

---

### 6. BLOG_VISUAL_APPEAL_AND_READABILITY_ANALYZER.md
**Purpose:** Analyze visual design and readability

**Use when:**
- Improving user experience
- Reducing bounce rate
- Enhancing engagement

**What it covers:**
- Visual hierarchy
- Readability metrics
- Typography
- Color contrast
- Layout optimization

---

## 🚀 Quick Start

### Option 1: Automated Script (Fastest)

```bash
# Audit all blog posts
node scripts/audit-blog-seo.js

# Audit single file
node scripts/audit-blog-seo.js --file app/blog/how-to-calculate-child-support.tsx

# Verbose output
node scripts/audit-blog-seo.js --verbose
```

**Output:** `blog-seo-audit-report.md` with detailed findings

---

### Option 2: Manual Audit with AI

**For quick audit (10-15 minutes):**

1. Open `BLOG_TECHNICAL_SEO_QUICK_START.md`
2. Copy the "Quick Audit" prompt
3. Replace `[PASTE FILE PATH HERE]` with your file path
4. Paste into AI assistant (Claude, ChatGPT, etc.)
5. Review output and implement fixes

**For comprehensive audit (60-90 minutes):**

1. Open `BLOG_TECHNICAL_SEO_AUDIT_PROMPT.md`
2. Read the full prompt (understand methodology)
3. Provide file path to AI assistant
4. Review detailed output
5. Implement fixes by priority

---

## 📊 Audit Workflow

### Step 1: Run Automated Script
```bash
node scripts/audit-blog-seo.js
```

**What it checks:**
- Title tag length (50-60 chars)
- Meta description length (150-160 chars)
- Canonical URL presence
- Schema markup presence
- Breadcrumbs presence
- H1 heading (single, with accessibilityRole)
- Internal links (minimum 3)
- accessibilityRole on Pressable components
- Image dimensions (prevent CLS)
- Year inclusion (2026)

**Output:** `blog-seo-audit-report.md`

---

### Step 2: Review Report

Open `blog-seo-audit-report.md` and identify:
- ❌ **Critical issues** - Fix immediately
- ⚠️  **High-priority issues** - Fix this week
- ⚡ **Medium-priority issues** - Fix this month
- 💡 **Low-priority issues** - Fix when convenient

---

### Step 3: Fix Issues

Use code examples from:
- `BLOG_TECHNICAL_SEO_QUICK_START.md` (common fixes)
- AI-generated audit output (specific fixes)

---

### Step 4: Verify Fixes

**Automated verification:**
```bash
node scripts/audit-blog-seo.js --file [YOUR_FILE]
```

**Manual verification:**
- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Structured Data
- [Meta Tags Validator](https://metatags.io/) - Open Graph
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Mobile

---

### Step 5: Monitor Results

**Short-term (1-2 weeks):**
- Google Search Console: Check indexing status
- PageSpeed Insights: Verify Core Web Vitals improved
- Rich Results Test: Verify no errors

**Long-term (1-3 months):**
- Google Search Console: Monitor impressions/clicks
- Google Analytics: Track organic traffic
- Featured snippets: Check if captured target queries

---

## 🎯 Common Issues & Quick Fixes

### Issue 1: Title Too Short
```typescript
// BEFORE ❌
<PageSEO title="Child Support Calculator" />

// AFTER ✅
<PageSEO title="Child Support Calculator Australia 2026 | Free Estimate" />
```

### Issue 2: Missing Schema
```typescript
// BEFORE ❌
<PageSEO title="..." description="..." canonicalPath="..." />

// AFTER ✅
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Calculate Child Support',
  datePublished: '2026-01-24',
};

<PageSEO
  title="..."
  description="..."
  canonicalPath="..."
  schema={articleSchema}
/>
```

### Issue 3: Missing Breadcrumbs
```typescript
// BEFORE ❌
<PageSEO title="..." description="..." canonicalPath="..." />

// AFTER ✅
<PageSEO
  title="..."
  description="..."
  canonicalPath="..."
  breadcrumbs={[
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'How to Calculate' },
  ]}
/>
```

### Issue 4: Missing accessibilityRole
```typescript
// BEFORE ❌
<Pressable onPress={() => router.push('/')}>
  <Text>Calculate Now</Text>
</Pressable>

// AFTER ✅
<Pressable
  onPress={() => router.push('/')}
  accessibilityRole="button"
>
  <Text>Calculate Now</Text>
</Pressable>
```

### Issue 5: Insufficient Internal Links
```typescript
// Add 3-5 internal links per post
<Text style={styles.paragraph}>
  Learn more about{' '}
  <Pressable
    onPress={() => router.push('/blog/child-support-formula-australia')}
    accessibilityRole="link"
  >
    <Text style={styles.link}>how the formula works</Text>
  </Pressable>
  {' '}or{' '}
  <Pressable
    onPress={() => router.push('/')}
    accessibilityRole="link"
  >
    <Text style={styles.link}>calculate your estimate</Text>
  </Pressable>
  .
</Text>
```

---

## 📈 Expected Results

### Timeline

**Week 1-2:**
- Fixes implemented
- Pages re-indexed by Google
- Core Web Vitals improved (if performance issues existed)

**Month 1-3:**
- Rankings begin to improve
- Impressions increase in Search Console
- Featured snippets may be captured

**Month 3-6:**
- Significant traffic increases
- Multiple featured snippets captured
- Conversion rate improves

**Month 6-12:**
- Compound growth
- Authority signals strengthen
- Backlinks increase naturally

---

## 🔧 Troubleshooting

### "Script shows no issues but rankings are poor"

**Possible causes:**
1. **Content quality** - Use content audit prompt
2. **Keyword targeting** - Use keyword research tools
3. **Backlinks** - Build authority through outreach
4. **Competition** - Analyze top-ranking competitors

**Solution:** Technical SEO is necessary but not sufficient. Focus on content quality and backlinks.

---

### "Fixed issues but no improvement after 2 weeks"

**Possible causes:**
1. **Not re-indexed yet** - Check Google Search Console
2. **Competitive niche** - May take 3-6 months
3. **Other issues** - Run comprehensive audit

**Solution:** Be patient. SEO takes 3-6 months for meaningful results.

---

### "Core Web Vitals failing"

**Common causes:**
1. **Large images** - Optimize with WebP, compression
2. **Render-blocking JavaScript** - Use code splitting
3. **Layout shifts** - Add image dimensions
4. **Slow server** - Vercel should be fast (check TTFB)

**Solution:** Use PageSpeed Insights to identify specific issues.

---

### "Rich Results Test shows errors"

**Common causes:**
1. **Invalid JSON** - Check schema syntax
2. **Missing required properties** - Add headline, datePublished, etc.
3. **Content mismatch** - Schema text must match visible content

**Solution:** Use [Schema Markup Validator](https://validator.schema.org/) for detailed errors.

---

## 📚 Additional Resources

### Official Documentation
- [Google Search Central](https://developers.google.com/search) - Official SEO guidelines
- [Expo Router SEO](https://docs.expo.dev/router/reference/seo/) - Expo-specific SEO
- [Schema.org](https://schema.org/) - Structured data reference

### Tools
- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Structured Data
- [Google Search Console](https://search.google.com/search-console) - Performance monitoring
- [Screaming Frog](https://www.screamingfrogseoseo.com/) - Site crawling

### Learning
- [Web.dev](https://web.dev/) - Performance and SEO best practices
- [Ahrefs Blog](https://ahrefs.com/blog/) - SEO strategies and case studies
- [Moz Blog](https://moz.com/blog) - SEO news and guides

---

## 🤝 Contributing

### Adding New Prompts

1. Create new `.md` file in `docs/prompts/`
2. Follow existing prompt structure:
   - Role & Context
   - Critical Constraints
   - Methodology
   - Output Format
   - Verification
   - Usage Guide
3. Add entry to this README
4. Test prompt with real blog posts
5. Document expected results

### Improving Existing Prompts

1. Test prompt with multiple blog posts
2. Identify gaps or unclear instructions
3. Update prompt with improvements
4. Document changes in prompt file
5. Update this README if needed

---

## 📝 Changelog

### Version 1.0 (January 28, 2026)
- Initial release
- 6 prompts created
- Automated audit script added
- Documentation complete

---

**Status:** ✅ Production-ready  
**Last Updated:** January 28, 2026  
**Maintained by:** AI Documentation System

