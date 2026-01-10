# SEO Strategy for Child Support Calculator

**Last Updated:** 2026-01-01  
**Status Review:** 2026-01-01 - Implementation status updated based on codebase audit
**Site:** auschildsupport.com
**Tech Stack:** Expo Router (React Native Web)
**Phase:** Phase 2 (Web Deployment & Optimization)

---

## 🎯 **SEO Strategy Overview**

For a React Native Web application, standard SEO tactics are insufficient. The default rendering of `View` components results in "div soup," which search engines struggle to prioritize. Our strategy enforces **Semantic HTML Mapping** and strict **Core Web Vitals** targets to overcome client-side rendering challenges.

---

## **1. Technical SEO (Expo Web Specifics)**

### **A. Semantic HTML Mapping**

_Critical: React Native components compile to `<div>` by default. We must explicitly map them to HTML5 semantic tags for accessibility and SEO._

**Status: Partially Implemented** ✅

| React Native Component | Prop Required                                 | Renders As HTML | Usage Context                   | Status |
| :--------------------- | :-------------------------------------------- | :-------------- | :------------------------------ | :----- |
| `<View>`               | `accessibilityRole="header"` `aria-level="1"` | `<h1>`          | Page Main Title                 | ⚠️ TODO |
| `<View>`               | `accessibilityRole="header"` `aria-level="2"` | `<h2>`          | Section Headings                | ✅ Done |
| `<View>`               | `accessibilityRole="main"`                    | `<main>`        | Wraps primary content           | ✅ Done |
| `<View>`               | `accessibilityRole="article"`                 | `<article>`     | Blog post container             | ⚠️ TODO |
| `<View>`               | `accessibilityRole="navigation"`              | `<nav>`         | Header/Tab bar                  | ⚠️ TODO |
| `<View>`               | `accessibilityRole="banner"`                  | `<header>`      | Site header                     | ✅ Done |
| `<View>`               | `accessibilityRole="footer"`                  | `<footer>`      | Site footer                     | ⚠️ TODO |
| `<Link>`               | _Default Expo Router_                         | `<a>`           | **ALWAYS** use for internal nav | ✅ Used |

**Strict Rule:** Never use `Pressable` + `router.push` for navigation links. Crawlers cannot follow JavaScript events. Always use `<Link href="...">`.

**Current Implementation:**
- ✅ Header has `accessibilityRole="banner"` (`CalculatorScreen.tsx:260`)
- ✅ Main content has `accessibilityRole="main"` (`CalculatorScreen.tsx:289`)
- ✅ Section headings use `accessibilityRole="header"` with `aria-level="2"` (`CalculatorForm.tsx:117, 269`)
- ✅ Form sections use `accessibilityRole="group"` (`CalculatorForm.tsx:148, 199`)
- ⚠️ **Missing:** Main page title needs `accessibilityRole="header"` with `aria-level="1"`

### **B. Core Web Vitals Targets**

_React Native Web apps are prone to layout shifts (CLS) and slow hydration (LCP)._

- **LCP (Largest Contentful Paint): < 2.5s**
  - **Risk:** Custom fonts loading late cause text flash.
  - **Fix:** Preload 'Geist' or system fonts in `app/+html.tsx`.
  - **Fix:** Ensure the critical CSS in `app/+html.tsx` styles the `<h1 class="calculator-header">` immediately.
- **CLS (Cumulative Layout Shift): < 0.1**
  - **Risk:** The "Results" modal animating upwards pushes content.
  - **Fix:** Use `position: absolute` or `overlay` for the results card so it doesn't displace the form layout.
  - **Fix:** Define explicit `width` and `height` for all images (e.g., share preview, logo).
- **INP (Interaction to Next Paint): < 200ms**
  - **Risk:** Heavy calculation logic blocking the JS thread.
  - **Fix:** Debounce the `calculate()` function (already implemented) and use `InteractionManager` for heavy state updates.

### **C. Canonicalization & URL Structure**

- **Canonical Tags:** ✅ Implemented per-page via `PageSEO` component. ⚠️ **TODO:** Consider adding global canonical fallback in `app/+html.tsx` for pages without PageSEO.
- **Trailing Slashes:** ⚠️ **Status Unknown:** Need to verify Vercel `vercel.json` configuration.
- **WWW Resolution:** ⚠️ **Status Unknown:** Need to verify redirect configuration.

---

## **2. On-Page SEO (The Calculator)**

### **Metadata Protocol**

_Implemented in `app/+html.tsx`_

- **Title Template:** `Child Support Calculator Australia 2026 | Free & Accurate`
- **Description:** "Official 2026 Services Australia formula. Calculate child support payments instantly. Supports 50/50 shared care, split care, and change of assessment. Free & anonymous."
- **Keywords:** `child support calculator australia`, `csa calculator`, `family tax benefit estimator`, `shared care child support`, `50/50 custody payments`.

### **Social Sharing (Open Graph & Twitter)**

_Crucial for "viral" sharing in parenting groups._

- `og:type`: "website"
- `og:image`: `https://auschildsupport.com/share-preview.png` (Must be 1200x630px)
- `twitter:card`: "summary_large_image"

### **Schema Markup (JSON-LD)**

_Status: Partially implemented_

1.  **`Organization`**: ✅ Implemented in `app/+html.tsx` head.
2.  **`SoftwareApplication`**: ⚠️ Currently only on home page via `PageSEO` component. **TODO:** Add to global `app/+html.tsx` for all pages.
3.  **`FAQPage`**: ✅ Implemented on home page (`app/(tabs)/index.tsx`).
4.  **`WebApplication`**: ✅ Implemented on home page via `PageSEO` component (similar to SoftwareApplication).

---

## **3. Content Strategy**

### **A. "Problem-Aware" Calculator Content**

_Add expandable sections below the calculator form to increase text density without cluttering UI._

1.  **"How is this calculated?"**: Explain the 8-step formula in plain English.
2.  **"Does 50/50 care mean $0?"**: Address the most common misconception.
3.  **"What if my income is complex?"**: Upsell the "Change of Assessment" feature.

### **B. Blog Content Pillars**

_Target high-intent keywords._

- **Pillar 1: The "How-To"**
  - "How to Calculate Child Support in Australia (2026 Guide)"
  - "Understanding Adjusted Taxable Income (ATI)"
  - **CTA:** Main Calculator (`/`)
- **Pillar 2: The "Complex Case"**
  - "Child Support for Self-Employed Parents"
  - "Change of Assessment Reason 8: Hidden Income"
  - **CTA:** Direct Enquiry (`/lawyer-inquiry?mode=direct&reason=hidden_income`)
- **Pillar 3: The "Dispute"**
  - "How to Object to a Child Support Assessment"
  - "When to Hire a Family Lawyer for Child Support"
  - **CTA:** Special Circumstances selection (`/special-circumstances`)

### **C. Programmatic SEO: Change of Assessment Pages (New Opportunity)**

_Leverage existing logic to capture long-tail, high-intent traffic._

**Strategy:** Create 10 dedicated static pages (`app/change-of-assessment/[reason-slug].tsx`), one for each official ground.

**Page Structure:**

1.  **Title:** "Reason [X]: [Reason Name] - Child Support Change of Assessment"
2.  **Explanation:** Plain English explanation of this specific ground.
3.  **Example:** "John and Sarah" scenario specific to this reason.
4.  **CTA:** "Check if you qualify" -> Links to `/special-circumstances` with reason pre-selected.

**Why:** Ranking for "Change of assessment reason 8" is easier than "child support calculator".

---

## **4. Measurement & KPIs**

### **Primary Metrics (Google Analytics)**

- **Organic Traffic:** Monthly unique visitors from Google/Bing.
- **Calculator Completion:** % of users who reach the "Results" state.
- **Lead Conversion:** % of "High Complexity" users clicking "Get Legal Help".

### **Monthly Reporting**

1.  **Rankings:** Top 10 position for "child support calculator".
2.  **Performance:** Core Web Vitals pass rate (via Search Console).
3.  **Leads:** Total qualified leads sent to partner lawyers.

---

## **5. Implementation Status & Remaining Tasks**

### ✅ **Completed**

1. **Schema Markup (Partial)**
   - ✅ Organization schema in `app/+html.tsx`
   - ✅ FAQPage schema on home page (`app/(tabs)/index.tsx`)
   - ✅ WebApplication schema on home page via `PageSEO` component
   - ✅ Per-page canonical tags via `PageSEO` component

2. **Accessibility (Partial)**
   - ✅ Basic semantic HTML roles implemented:
     - `accessibilityRole="banner"` on header (`CalculatorScreen.tsx`)
     - `accessibilityRole="main"` on main content (`CalculatorScreen.tsx`)
     - `accessibilityRole="header"` with `aria-level="2"` on section headings (`CalculatorForm.tsx`)
     - `accessibilityRole="group"` on form sections
     - `accessibilityRole="button"` on interactive elements

3. **Social Sharing**
   - ✅ Open Graph meta tags in `app/+html.tsx`
   - ✅ Twitter card meta tags
   - ✅ Share preview image configured

4. **Robots.txt Structure**
   - ✅ Correct structure (allows all, disallows `/admin/`)

### ⚠️ **Remaining Tasks**

1. **Update `app/+html.tsx`**
   - ❌ **Missing:** Global `SoftwareApplication` schema (currently only on home page via PageSEO)
   - ❌ **Missing:** Critical CSS for faster LCP (preload fonts, inline critical styles)
   - ⚠️ **Partial:** Canonical tags (handled per-page via PageSEO, but no global fallback)

2. **Accessibility Enhancements**
   - ⚠️ **Needs Review:** Main page title should have `accessibilityRole="header"` with `aria-level="1"`
   - ⚠️ **Needs Review:** Ensure all major sections have proper semantic roles
   - ✅ Calculator form sections already have proper H2 tags

3. **Sitemap (`public/sitemap.xml`)**
   - ❌ **Critical:** Domain is incorrect (`childsupportcalc.app` → should be `auschildsupport.com`)
   - ❌ **Missing Routes:**
     - `/special-circumstances`
     - `/blog` (blog index page)
     - Blog post routes (dynamic - `/blog/[id]` - needs programmatic generation or manual list)
   - ⚠️ **Current:** Only has 2 URLs (home and lawyer-inquiry)
   - **Note:** Blog posts are fetched from WordPress API, so sitemap should either:
     - Dynamically generate from API on build, OR
     - Manually maintain list of published post IDs

4. **Robots.txt (`public/robots.txt`)**
   - ❌ **Critical:** Sitemap URL uses wrong domain (`childsupportcalc.app` → should be `auschildsupport.com`)
   - ✅ Structure is correct (allows all, disallows `/admin/`)

5. **Core Web Vitals Optimization**
   - ⚠️ **Needs Testing:** LCP target (< 2.5s) - requires font preloading and critical CSS
   - ⚠️ **Needs Testing:** CLS target (< 0.1) - results modal positioning needs verification
   - ✅ Calculation debouncing already implemented

### **Priority Order**

1. **High Priority (Domain Fixes)**
   - Fix sitemap.xml domain
   - Fix robots.txt sitemap URL

2. **Medium Priority (SEO Foundation)**
   - Add SoftwareApplication schema to global `app/+html.tsx`
   - Add critical CSS to `app/+html.tsx`
   - Update sitemap with all routes

3. **Low Priority (Enhancements)**
   - Comprehensive accessibility audit
   - Core Web Vitals testing and optimization
