# SEO Strategy for Child Support Calculator

**Last Updated:** 2026-01-01
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

| React Native Component | Prop Required                                 | Renders As HTML | Usage Context                   |
| :--------------------- | :-------------------------------------------- | :-------------- | :------------------------------ |
| `<View>`               | `accessibilityRole="header"` `aria-level="1"` | `<h1>`          | Page Main Title                 |
| `<View>`               | `accessibilityRole="header"` `aria-level="2"` | `<h2>`          | Section Headings                |
| `<View>`               | `accessibilityRole="main"`                    | `<main>`        | Wraps primary content           |
| `<View>`               | `accessibilityRole="article"`                 | `<article>`     | Blog post container             |
| `<View>`               | `accessibilityRole="navigation"`              | `<nav>`         | Header/Tab bar                  |
| `<View>`               | `accessibilityRole="footer"`                  | `<footer>`      | Site footer                     |
| `<Link>`               | _Default Expo Router_                         | `<a>`           | **ALWAYS** use for internal nav |

**Strict Rule:** Never use `Pressable` + `router.push` for navigation links. Crawlers cannot follow JavaScript events. Always use `<Link href="...">`.

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

- **Canonical Tags:** Every page MUST have a self-referencing `<link rel="canonical">` to prevent duplicate content from query parameters (e.g., `?reset=true`).
- **Trailing Slashes:** Enforce a strict policy (strip trailing slashes) via Netlify `_redirects`.
- **WWW Resolution:** Redirect `www` to non-`www` (or vice versa).

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

_Inject into `app/+html.tsx` head._

1.  **`SoftwareApplication`**: Defines the tool, price ($0), and operating systems.
2.  **`Organization`**: Defines "AusChildSupport" as the publisher.
3.  **`FAQPage`**: Hardcoded FAQs about the 8-step formula.

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
- **Pillar 2: The "Complex Case"**
  - "Child Support for Self-Employed Parents"
  - "Change of Assessment Reason 8: Hidden Income"
- **Pillar 3: The "Dispute"**
  - "How to Object to a Child Support Assessment"
  - "When to Hire a Family Lawyer for Child Support"

---

## **4. Measurement & KPIs**

### **Primary Metrics**

- **Organic Traffic:** Monthly unique visitors from Google/Bing.
- **Calculator Completion:** % of users who reach the "Results" state.
- **Lead Conversion:** % of "High Complexity" users clicking "Get Legal Help".

### **Monthly Reporting**

1.  **Rankings:** Top 10 position for "child support calculator".
2.  **Performance:** Core Web Vitals pass rate (via Search Console).
3.  **Leads:** Total qualified leads sent to partner lawyers.

---

## **5. Immediate Action Plan**

1.  **Update `app/+html.tsx`**: Inject Canonical, Schema, and Critical CSS.
2.  **Audit Accessibility**: Review `CalculatorScreen.tsx` and add `accessibilityRole="header"`.
3.  **Create Sitemap**: Ensure `public/sitemap.xml` includes all static routes and blog posts.
4.  **Verify Robots**: Ensure `public/robots.txt` allows crawling of everything except `/admin`.
