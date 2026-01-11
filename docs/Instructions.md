# SEO Verification Instructions

## 1. WordPress Blog SEO Setup (Rank Math)

Your main blog is at `blog.auschildsupport.com` (WordPress subdomain). Follow these steps to configure SEO with Rank Math.

---

### Step 1: Install Rank Math Plugin

1. Log in to WordPress Admin: `blog.auschildsupport.com/wp-admin`
2. Go to **Plugins** → **Add New**
3. Search for "Rank Math SEO"
4. Click **Install Now** → then **Activate**

---

### Step 2: Verify Your Rank Math Configuration

Since Rank Math is already installed, verify these settings are correct:

#### 2a. Check General Settings
1. Go to **Rank Math** → **Dashboard**
2. Verify these modules are enabled:
   - ✅ SEO Analysis
   - ✅ Sitemap
   - ✅ Schema (Structured Data)
   - ✅ Link Counter

#### 2b. Check Site Representation
1. Go to **Rank Math** → **Titles & Meta** → **Local SEO**
2. Verify:
   - **Person or Company**: Should be "Organization"
   - **Website Name**: `AusChildSupport Blog` (appears in search results)
   - **Website Alternate Name**: Leave blank
   - **Organization Name**: `AusChildSupport`
   - **Description**: Add a brief description (e.g., "Official blog of AusChildSupport providing guidance for Australian parents.")
   - **Logo**: Your logo is uploaded
   - **URL**: `https://auschildsupport.com` *(use main domain, not blog subdomain - this represents the Organization)*
   - **Email**: Optional (e.g., `support@auschildsupport.com`)
   - **Address/Opening Hours/Phone/Maps**: Leave blank if online-only (better than fake data)
   - **Price Range**: Leave blank
   - **About/Contact Page**: Leave blank (Rank Math cannot link to external app pages; your main app handles its own schema)

#### 2c. Check Default Social Image
1. Go to **Rank Math** → **Titles & Meta** → **Global Meta**
2. Scroll to "Open Graph Thumbnail"
3. Verify:
   - **Default Share Image** is set (upload `share-preview.png`, 1200x630px)

### Step 3: Configure Site Title & Tagline

1. Go to **Settings** → **General**
2. Set:
   - **Site Title**: `AusChildSupport Blog`
   - **Tagline**: `Child Support Guidance for Australian Parents`
3. Click **Save Changes**

---

### Step 4: Configure Rank Math General Settings

#### 4a. Titles & Meta
1. Go to **Rank Math** → **Titles & Meta** → **Global Meta**
2. Set **Separator**: `|` or `-`
3. Set **Homepage Title**: `AusChildSupport Blog | Child Support Guidance`

#### 4b. Posts Settings
1. Go to **Rank Math** → **Titles & Meta** → **Posts**
2. Set:
   - **Single Post Title**: `%title% | AusChildSupport Blog`
   - **Meta Description**: `%excerpt%`
   - **Schema Type**: **Article** (or "Blog Post" if available)
   - **Article Type**: **Blog Post** (if available, otherwise "Article")

#### 4c. Pages Settings
1. Go to **Rank Math** → **Titles & Meta** → **Pages**
2. Configure:
   - **Schema Type**: **None** (Because your main pages like Contact/About are on your external app, not WordPress)

#### 4d. Categories & Tags
1. Go to **Rank Math** → **Titles & Meta** → **Categories**: Leave as default (Index).
2. Go to **Rank Math** → **Titles & Meta** → **Tags**: Leave as default (No Index).

#### 4e. Advanced Settings (Misc & Authors)
1. Go to **Rank Math** → **Titles & Meta** → **Authors**
   - **Author Archives**: Ensure **Disabled** is selected (Blue).
2. Go to **Rank Math** → **Titles & Meta** → **Misc Pages**
   - **Disable Date Archives**: Turn **ON** (Blue toggle).
3. Go to **Rank Math** → **Titles & Meta** → **Homepage**
   - **Homepage Title**: `AusChildSupport Blog | Expert Guidance for Parents`
   - **Homepage Meta Description**: `Expert tips and guides on Services Australia child support assessments.`
   - **Homepage Thumbnail**: Upload your `share-preview.png`.

---

### Step 5: Configure Open Graph (Social Sharing)

1. Go to **Rank Math** → **Titles & Meta** → **Social Meta**
2. Toggle ON: **Add Open Graph Meta**
3. Set:
   - **Default OG Image**: Upload `share-preview.png` (1200x630px)
   - **Facebook App ID**: (optional, leave blank if not using)
4. Toggle ON: **Add Twitter Card Meta**
5. Set:
   - **Card Type**: Summary Card with Large Image
   - **Default Twitter Image**: Same as OG image

---

### Step 6: Enable XML Sitemap

1. Go to **Rank Math** → **Sitemap Settings** → **General**
   - **Images in Sitemaps**: **ON**
2. Go to **Rank Math** → **Sitemap Settings** → **Post Types** (Left Sidebar)
   - **Posts**: **Include in Sitemap** (ON)
   - **Pages**: **Include in Sitemap** (OFF) - *Critical for your hybrid setup*
4. Click **Save Changes**

#### 6b. Fix 404 Error (Important)
If your sitemap URL returns a "Page Not Found" (404) error:
1. Go to **Settings** → **Permalinks**
2. Scroll down and click **Save Changes** (this flushes the rewrite rules).
3. Try the link again: `https://blog.auschildsupport.com/sitemap_index.xml`

---

### Step 7: Add Blog to Google Search Console (GSC)

Since the blog is on a subdomain (`blog.`), it needs its own property in GSC, or to be covered by a Domain property.

#### 7a. Add Property
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click the property dropdown (top left) → **Add Property**.
3. Choose **URL Prefix**.
4. Enter: `https://blog.auschildsupport.com`
5. Click **Continue**.

#### 7b. Verify Ownership
*   **Case A (Auto-Verified)**: If you verified your main domain via **DNS**, this will auto-verify instantly.
*   **Case B (Rank Math Method)**:
    1. If it asks for verification, choose **HTML Tag**.
    2. Copy the code (contents inside `content="..."`).
    3. Go to **WordPress** → **Rank Math** → **General Settings** → **Webmaster Tools**.
    4. Paste code in **Google Search Console**.
    5. Click **Save Changes** in WordPress.
    6. Click **Verify** in GSC.

#### 7c. Submit Sitemap
1. Inside the new `https://blog.auschildsupport.com` property in GSC:
2. Go to **Sitemaps** (left menu).
3. Enter: `sitemap_index.xml`
4. Click **Submit**.
5. Verify status is **Success**.

---

### Step 8: Configure Structured Data (Schema)

Rank Math automatically adds `Article` schema to blog posts.

#### 8a. Set Default Schema Type
1. Go to **Rank Math** → **Titles & Meta** → **Posts**
2. Scroll to **Schema Type**
3. Select: **Article**
4. Set **Article Type**: Blog Post

#### 8b. Verify Schema
1. Go to [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter a blog post URL
3. Check that "Article" schema is detected

#### 8c. Add Organization Schema
1. Go to **Rank Math** → **Titles & Meta** → **Local SEO** (or Global Meta)
2. Set:
   - **Person or Company**: Organization
   - **Organization Name**: `AusChildSupport`
   - **Logo**: Upload your logo
   - **URL**: `https://auschildsupport.com`

---

### Step 9: Optimize Individual Blog Posts

When creating/editing each post in WordPress:

1. Look for the **Rank Math** meta box on the right sidebar (or scroll down)
2. Click **Edit Snippet**:
   - **SEO Title**: Write compelling title (max 60 chars)
   - **Permalink/Slug**: Use keywords, e.g., `how-child-support-calculated-australia`
   - **Meta Description**: Summarize the post (max 155 chars)
3. Click **Focus Keyword** tab:
   - Enter your target keyword
   - Aim for 80+ score
4. Check the **Schema** tab:
   - Verify Article schema is applied
5. Add a **Featured Image** (will be used for OG image)

---

### Step 10: Set Up Internal Linking

1. In each blog post, link to:
   - The main calculator: `https://auschildsupport.com`
   - Related posts on your blog
   - Relevant CoA reason pages: `https://auschildsupport.com/change-of-assessment/[slug]`
2. Use descriptive anchor text (not "click here")
3. Rank Math will show internal link suggestions in the editor

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