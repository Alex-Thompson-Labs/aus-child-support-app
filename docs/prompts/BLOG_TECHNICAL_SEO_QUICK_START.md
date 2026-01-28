# Technical SEO Audit - Quick Start Guide

**Use this when:** You need to quickly audit a blog post for technical SEO issues (10-15 minutes)

**Full prompt:** See `BLOG_TECHNICAL_SEO_AUDIT_PROMPT.md` for comprehensive 60-90 minute audit

---

## QUICK AUDIT (10-15 Minutes)

### Step 1: Copy This Prompt

```
You are a Technical SEO Auditor. Audit this blog post for technical SEO issues using 2026 best practices.

Focus on these critical areas:
1. Meta tags (title, description, canonical)
2. Structured data (Schema.org JSON-LD)
3. Heading hierarchy (H1, H2, H3)
4. Core Web Vitals (LCP, INP, CLS)
5. Mobile-first optimization

Platform: Expo Router (React Native) with static export to Vercel
Target: Australian audience (en_AU)

For each issue found, provide:
- Severity: Critical / High / Medium / Low
- Problem: What's wrong
- Impact: Why it matters
- Fix: Specific code change
- Verification: How to test

File to audit: [PASTE FILE PATH HERE]
```

### Step 2: Replace [PASTE FILE PATH HERE]

Example:
```
File to audit: app/blog/how-to-calculate-child-support.tsx
```

### Step 3: Review Output

Look for:
- ❌ **Critical issues** - Fix immediately
- ⚠️ **High-priority issues** - Fix within 1 week
- ⚡ **Medium-priority issues** - Fix within 1 month
- 💡 **Low-priority issues** - Fix when convenient

---

## COMMON ISSUES & QUICK FIXES

### Issue 1: Title Tag Too Short/Long

**Problem:**
```typescript
<PageSEO
  title="Child Support Calculator"  // Too short (24 chars)
/>
```

**Fix:**
```typescript
<PageSEO
  title="Child Support Calculator Australia 2026 | Free Estimate"  // 58 chars ✅
/>
```

**Target:** 50-60 characters

---

### Issue 2: Meta Description Too Short/Long

**Problem:**
```typescript
<PageSEO
  description="Calculate child support"  // Too short (25 chars)
/>
```

**Fix:**
```typescript
<PageSEO
  description="Calculate child support in 5 minutes using official 2026 Services Australia formula. Free, accurate, no registration required."  // 145 chars ✅
/>
```

**Target:** 150-160 characters

---

### Issue 3: Missing Schema Markup

**Problem:**
```typescript
<PageSEO
  title="..."
  description="..."
  canonicalPath="/blog/how-to-calculate"
  // No schema prop ❌
/>
```

**Fix:**
```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Calculate Child Support in Australia',
  description: 'Step-by-step guide...',
  step: [
    { '@type': 'HowToStep', name: 'Step 1', text: '...' },
    { '@type': 'HowToStep', name: 'Step 2', text: '...' },
  ],
};

<PageSEO
  title="..."
  description="..."
  canonicalPath="/blog/how-to-calculate"
  schema={articleSchema}  // ✅
/>
```

---

### Issue 4: Missing Breadcrumbs

**Problem:**
```typescript
<PageSEO
  title="..."
  description="..."
  canonicalPath="/blog/how-to-calculate"
  // No breadcrumbs prop ❌
/>
```

**Fix:**
```typescript
<PageSEO
  title="..."
  description="..."
  canonicalPath="/blog/how-to-calculate"
  breadcrumbs={[
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'How to Calculate' },
  ]}  // ✅
/>
```

---

### Issue 5: Heading Hierarchy Broken

**Problem:**
```typescript
<Text style={styles.h1}>Main Title</Text>
<Text style={styles.h3}>Subsection</Text>  // Skipped H2 ❌
```

**Fix:**
```typescript
<Text style={styles.h1} accessibilityRole="header">Main Title</Text>
<Text style={styles.h2} accessibilityRole="header">Section</Text>  // ✅
<Text style={styles.h3} accessibilityRole="header">Subsection</Text>
```

---

### Issue 6: Images Without Dimensions

**Problem:**
```typescript
<Image
  source={require('./image.png')}
  style={{ width: '100%' }}  // No height specified ❌
/>
```

**Fix:**
```typescript
<Image
  source={require('./image.png')}
  style={{ width: '100%', height: 400 }}  // ✅ Prevents CLS
  accessibilityLabel="Descriptive alt text"
/>
```

---

### Issue 7: Missing accessibilityRole

**Problem:**
```typescript
<Pressable onPress={() => router.push('/')}>
  <Text>Calculate Now</Text>
</Pressable>  // No accessibilityRole ❌
```

**Fix:**
```typescript
<Pressable
  onPress={() => router.push('/')}
  accessibilityRole="button"  // ✅
>
  <Text>Calculate Now</Text>
</Pressable>
```

---

### Issue 8: Insufficient Internal Links

**Problem:**
- Blog post has 0-2 internal links ❌

**Fix:**
- Add 3-5 internal links to related blog posts
- Add link to calculator or inquiry form
- Use descriptive anchor text (not "click here")

**Example:**
```typescript
<Text style={styles.paragraph}>
  Learn more about{' '}
  <Pressable
    onPress={() => router.push('/blog/child-support-formula-australia')}
    accessibilityRole="link"
  >
    <Text style={styles.link}>how the child support formula works</Text>
  </Pressable>
  {' '}or{' '}
  <Pressable
    onPress={() => router.push('/')}
    accessibilityRole="link"
  >
    <Text style={styles.link}>calculate your estimate now</Text>
  </Pressable>
  .
</Text>
```

---

## VERIFICATION TOOLS

### Essential Tools (Free)

1. **PageSpeed Insights** - Core Web Vitals
   - https://pagespeed.web.dev/
   - Test: Paste URL, click "Analyze"
   - Target: LCP < 2.5s, INP < 200ms, CLS < 0.1

2. **Google Rich Results Test** - Structured Data
   - https://search.google.com/test/rich-results
   - Test: Paste URL or code
   - Target: 0 errors, 0 warnings

3. **Meta Tags Validator** - Open Graph
   - https://metatags.io/
   - Test: Paste URL
   - Target: All tags present and correct

4. **Mobile-Friendly Test** - Mobile Optimization
   - https://search.google.com/test/mobile-friendly
   - Test: Paste URL
   - Target: "Page is mobile-friendly"

### Optional Tools (Free)

5. **Schema Markup Validator**
   - https://validator.schema.org/
   - Test: Paste JSON-LD code
   - Target: Valid schema

6. **WebAIM Contrast Checker** - Accessibility
   - https://webaim.org/resources/contrastchecker/
   - Test: Enter foreground/background colors
   - Target: WCAG AA (4.5:1 for normal text)

7. **HeadingsMap Extension** - Heading Hierarchy
   - Chrome: https://chromewebstore.google.com/detail/headingsmap/
   - Test: Install extension, view page
   - Target: Logical H1-H6 hierarchy

---

## PRIORITY MATRIX

### Fix Immediately (Critical)
- [ ] Missing or duplicate title tags
- [ ] Missing or duplicate meta descriptions
- [ ] Missing canonical URL
- [ ] Broken structured data (errors in Rich Results Test)
- [ ] LCP > 4 seconds
- [ ] CLS > 0.25

### Fix This Week (High)
- [ ] Title/description not optimized (too short/long)
- [ ] Missing breadcrumbs
- [ ] Heading hierarchy broken (skipped levels)
- [ ] Insufficient internal links (< 3)
- [ ] LCP 2.5-4 seconds
- [ ] CLS 0.1-0.25

### Fix This Month (Medium)
- [ ] Missing FAQ schema for FAQ sections
- [ ] Missing HowTo schema for how-to posts
- [ ] Images without dimensions (causes CLS)
- [ ] Missing accessibilityRole attributes
- [ ] INP 200-500ms

### Fix When Convenient (Low)
- [ ] Title/description could be more compelling
- [ ] Additional internal linking opportunities
- [ ] Minor accessibility improvements
- [ ] Font optimization

---

## BATCH AUDIT WORKFLOW

### Auditing Multiple Posts (30-60 minutes)

1. **Create checklist:**
   ```
   Blog Posts to Audit:
   [ ] app/blog/how-to-calculate-child-support.tsx
   [ ] app/blog/child-support-formula-australia.tsx
   [ ] app/blog/what-does-child-support-cover.tsx
   [ ] app/blog/child-support-after-18.tsx
   [ ] app/blog/child-support-reduction-strategies.tsx
   ```

2. **Run quick audit on each:**
   - Use quick audit prompt above
   - Focus on critical and high-priority issues only
   - Document findings in spreadsheet

3. **Prioritize fixes:**
   - Group by severity (Critical → High → Medium → Low)
   - Group by type (Meta tags, Schema, Headings, etc.)
   - Estimate time per fix

4. **Batch similar fixes:**
   - Fix all title tags at once
   - Fix all schema markup at once
   - Fix all heading hierarchies at once

5. **Verify fixes:**
   - Test with verification tools
   - Check Google Search Console after 1-2 weeks

---

## COMMON MISTAKES TO AVOID

### ❌ Don't Do This

1. **Keyword stuffing in title/description**
   ```typescript
   title="Child Support Calculator Australia Child Support Australia 2026 Calculator"
   // Too many keywords ❌
   ```

2. **Hidden content in schema**
   ```typescript
   const schema = {
     text: 'Content that does not appear on page'  // ❌ Violates Google guidelines
   };
   ```

3. **Duplicate content across pages**
   ```typescript
   // Same title/description on multiple blog posts ❌
   ```

4. **Ignoring mobile experience**
   ```typescript
   // Tiny text, small touch targets, horizontal scrolling ❌
   ```

5. **Forgetting accessibilityRole**
   ```typescript
   <Pressable onPress={...}>  // ❌ Missing accessibilityRole
   ```

### ✅ Do This Instead

1. **Natural keyword placement**
   ```typescript
   title="Child Support Calculator Australia 2026 | Free Estimate"
   // Clear, compelling, includes keywords naturally ✅
   ```

2. **Schema matches visible content**
   ```typescript
   const schema = {
     text: 'Exact text from H2 and paragraph on page'  // ✅
   };
   ```

3. **Unique content per page**
   ```typescript
   // Each blog post has unique title, description, content ✅
   ```

4. **Mobile-first design**
   ```typescript
   // Readable text, adequate touch targets, responsive layout ✅
   ```

5. **Proper accessibility**
   ```typescript
   <Pressable accessibilityRole="button" onPress={...}>  // ✅
   ```

---

## NEXT STEPS

### After Quick Audit

1. **Fix critical issues immediately** (same day)
2. **Schedule high-priority fixes** (this week)
3. **Plan medium-priority fixes** (this month)
4. **Document low-priority fixes** (backlog)

### For Comprehensive Audit

Use full prompt: `BLOG_TECHNICAL_SEO_AUDIT_PROMPT.md`
- Allows 60-90 minutes
- Complete all 10 audit phases
- Get detailed code examples
- Receive prioritized action plan

### For Ongoing Monitoring

1. **Set up Google Search Console**
   - Monitor Core Web Vitals
   - Track indexing status
   - Identify crawl errors

2. **Set up Vercel Speed Insights**
   - Monitor real-user Core Web Vitals
   - Track performance over time

3. **Schedule regular audits**
   - Quick audit: Monthly
   - Comprehensive audit: Quarterly
   - After major updates: Immediately

---

## QUESTIONS?

### "How long does SEO take to work?"

**Short answer:** 3-6 months for meaningful results

**Timeline:**
- Week 1-2: Fixes implemented, pages re-indexed
- Month 1-3: Rankings begin to improve
- Month 3-6: Significant traffic increases
- Month 6-12: Compound growth, featured snippets captured

### "Which issues should I fix first?"

**Priority order:**
1. Critical issues (blocks indexing)
2. High-priority issues (impacts rankings)
3. Medium-priority issues (best practices)
4. Low-priority issues (nice-to-have)

**If limited time:**
- Focus on meta tags, structured data, Core Web Vitals
- Skip low-priority issues until critical/high are fixed

### "How do I know if fixes worked?"

**Immediate verification:**
- PageSpeed Insights score improved?
- Rich Results Test shows no errors?
- Mobile-Friendly Test passes?

**Long-term verification:**
- Google Search Console: Impressions/clicks increasing?
- Core Web Vitals: Passing in Search Console?
- Featured snippets: Captured target queries?

### "Can I automate this?"

**Partially:**
- Use Lighthouse CI for automated Core Web Vitals testing
- Use schema validation in CI/CD pipeline
- Use Screaming Frog for automated crawling

**But:**
- Manual review still needed for content quality
- Human judgment required for severity assessment
- Context-specific fixes require developer expertise

---

**Status:** ✅ Ready to use  
**Last Updated:** January 28, 2026  
**Version:** 1.0  
**Companion to:** BLOG_TECHNICAL_SEO_AUDIT_PROMPT.md

