# Web Deployment Guide

## Converting Your React Native App to Web

This guide will walk you through deploying your Child Support Calculator as a web application using Expo's web support.

---

## Step 1: Install Web Dependencies

**Ask Claude Code to do this:**

```
Install the web dependencies for Expo: react-native-web, react-dom, and @expo/metro-runtime
```

Claude Code will run: `npx expo install react-native-web react-dom @expo/metro-runtime`

---

## Step 2: Update app.json Configuration

**Ask Claude Code to do this:**

```
Update app.json to add web platform support with static output and metro bundler
```

Claude Code will add this to your app.json:
- Add "web" to platforms array
- Add web configuration with static output and metro bundler
- Keep existing favicon path

---

## Step 3: Create a Favicon (Optional)

**Ask Claude Code to do this:**

```
Check if we have a favicon at assets/images/favicon.png, if not create a simple one or find a placeholder
```

Or skip this step - the app will work without it.

---

## Step 4: Test Locally

Run the web version on your local machine:

```bash
npx expo start --web
```

This will:
- Start a development server
- Open your default browser to `http://localhost:8081`
- Show any errors that need fixing

**Common issues you might encounter:**
- Components that use native-only features (camera, haptics, etc.)
- Platform-specific styling that doesn't work on web
- Navigation gestures that behave differently

---

## Step 5: Fix Web-Specific Issues

### 5.1 Disable PostHog for Web (Required)

**Ask Claude Code to do this:**

```
PostHog doesn't work on web without additional configuration. Find the PostHog initialization code and wrap it in a Platform.OS check so it only runs on iOS/Android, not web.
```

Claude Code will find your PostHog setup (likely in `app/_layout.tsx`) and add:
```typescript
if (Platform.OS !== 'web') {
  // PostHog initialization
}
```

### 5.2 Find Other Native-Only Features

**Ask Claude Code to do this:**

```
Search the codebase for other web-incompatible features like Haptics, native alerts, or platform-specific APIs and create a list of files that need fixing
```

### 5.3 Fix Platform-Specific Code

**Ask Claude Code to do this:**

```
For each file with web-incompatible features, wrap them in Platform.OS checks or provide web alternatives
```

### 5.4 Fix Web Styling and UX (⚠️ Use Opus for this)

**Switch to Opus and ask:**

```
The web version is working but has styling issues - components are too large, spacing is off, and navigation doesn't feel right for web. Audit the app for web-specific styling issues and add responsive design improvements. Focus on:
1. Making form inputs appropriately sized for web
2. Adjusting spacing and padding for larger screens
3. Adding max-width constraints so content doesn't stretch too wide
4. Improving navigation for mouse/keyboard users
5. Making the overall layout more web-friendly
```

This requires design judgment and understanding responsive design patterns - Opus handles this better.

### 5.5 Test All Features

Manually go through the app and test:
- Calculator works
- Navigation works
- Forms work
- Results display correctly

---

## Step 6: Build for Production

Once everything works locally, build the production version:

```bash
npx expo export --platform web
```

This creates an optimized static website in the `dist/` folder.

---

## Step 7: Choose a Hosting Platform

You have several free/cheap options:

### Option A: Netlify (Recommended - Easiest)

1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your `dist/` folder to deploy
3. Get a free subdomain like `childsupportcalc.netlify.app`
4. Can add custom domain later

### Option B: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in your project directory
4. Follow the prompts

### Option C: GitHub Pages

1. Create a GitHub repository
2. Push your code to GitHub
3. Build: `npx expo export --platform web`
4. Install gh-pages: `npm install --save-dev gh-pages`
5. Add to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
6. Run: `npm run deploy`
7. Enable GitHub Pages in repository settings

### Option D: AWS S3 + CloudFront

1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist/` contents
4. Set up CloudFront for HTTPS
5. Configure custom domain

---

## Step 8: Deploy

### For Netlify (Easiest - Drag & Drop):

1. **Ask Claude Code to do this:**
   ```
   Build the web version for production
   ```
   Claude Code will run: `npx expo export --platform web`

2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the entire `dist/` folder to the upload area
4. Done! Your site is live with a URL like `random-name-123.netlify.app`

### For Netlify (CLI - For Auto Updates):

**Ask Claude Code to do this:**

```
Set up Netlify CLI deployment with automatic builds
```

Claude Code will:
- Install netlify-cli globally
- Run `netlify init` to connect your site
- Add a deploy script to package.json
- Show you how to deploy with one command

---

## Step 9: Add Custom Domain

### Setting up auschildsupport.com with Netlify:

You have two options for using your domain:

#### Option A: Use the entire domain (auschildsupport.com)

1. In Netlify dashboard: Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `auschildsupport.com`
4. Netlify will show you nameserver instructions
5. Go to your domain registrar (where you bought auschildsupport.com)
6. Update nameservers to Netlify's nameservers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
7. Wait 10-60 minutes for DNS to propagate
8. Netlify automatically provisions free HTTPS

**Result:** `auschildsupport.com` → your calculator app

#### Option B: Use www subdomain (www.auschildsupport.com)

1. In Netlify dashboard: Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `www.auschildsupport.com`
4. Netlify will show you a CNAME record
5. Go to your domain registrar's DNS settings
6. Add CNAME record:
   ```
   Name: www
   Value: [your-netlify-site].netlify.app
   ```
7. Also add root domain redirect (optional):
   - Add an A record or ALIAS pointing to Netlify's load balancer
   - Or use your registrar's forwarding to redirect auschildsupport.com → www.auschildsupport.com
8. Wait 10-60 minutes for DNS to propagate
9. Netlify automatically provisions free HTTPS

**Result:** Both `auschildsupport.com` and `www.auschildsupport.com` work

#### Recommendation:

Use **Option A** (entire domain) - it's simpler and more professional. Since this domain is dedicated to the calculator, no need for subdomains.

---

## Step 10: Set Up Continuous Deployment (Optional)

### If using GitHub + Netlify (⚠️ Use Opus for this):

**Switch to Opus and ask:**

```
Set up continuous deployment with Netlify so every git push automatically deploys the web app
```

This involves coordinating GitHub, Netlify, and build configurations - Opus handles complex integrations better.

Claude Code will:
- Help you push to GitHub if not already there
- Guide you through connecting Netlify to GitHub
- Set up the build settings (build command: `npx expo export --platform web`, publish directory: `dist`)
- Verify the deployment works

---

## Maintenance & Updates

### To update the live site:

**Ask Claude Code to do this:**

```
Build and deploy the latest changes to the web app
```

Claude Code will:
1. Build the production version
2. Deploy using your configured method (Netlify CLI or show you the dist/ folder to drag-drop)

### Monitor for issues:

- Check browser console for errors
- Test on different browsers (Chrome, Safari, Firefox)
- Test on mobile browsers
- Monitor analytics for user behavior

---

## Troubleshooting

### Build fails with "metro" error

**Ask Claude Code to do this:**
```
Clear the Expo cache and rebuild for web
```

### Fonts don't load

**Ask Claude Code to do this:**
```
Check font configuration for web and fix any path issues
```

### Navigation doesn't work

**Ask Claude Code to do this:**
```
Check Expo Router configuration for web compatibility and fix any issues
```

### Styling looks different on web

**Ask Claude Code to do this:**
```
Find styling differences between mobile and web, add Platform.OS checks where needed
```

### Analytics not tracking

**Ask Claude Code to do this:**
```
Set up PostHog analytics for web platform
```

---

## Cost Estimate

- **Netlify Free Tier**: 100GB bandwidth/month, unlimited sites
- **Vercel Free Tier**: 100GB bandwidth/month
- **GitHub Pages**: Free, unlimited for public repos
- **Custom Domain**: ~$15-30/year (if you don't already have one)

**Total: $0-30/year**

---

## Next Steps After Deployment

**⚠️ Use Opus for #1, Sonnet is fine for #2-4**

1. **Set up web analytics** (recommended - do this first, ⚠️ use Opus):
   ```
   Add Google Analytics or Plausible to track web users. Keep PostHog for mobile only.
   ```
   
   Why you need this: PostHog is mobile-only now, so you need separate analytics for web visitors.
   
   **Best options:**
   - **Google Analytics 4** - Free, comprehensive, industry standard
   - **Plausible** - Privacy-focused, simpler, $9/month
   - **Umami** - Open source, self-hosted, free
   
   Opus can better handle the integration complexity, environment variables, and ensuring it doesn't conflict with PostHog.

2. `Add SEO meta tags to improve search engine visibility` (Sonnet OK)

3. `Test web app accessibility with screen readers` ✅

  See comprehensive testing guide: `docs/ACCESSIBILITY_TESTING.md`

  Quick tests:
  - Run Lighthouse accessibility audit (target 95+ score)
  - Test keyboard navigation (Tab through all elements)
  - Test with screen reader (VoiceOver on Mac, NVDA on Windows)
  - Use axe DevTools browser extension

  Files created:
  - `docs/ACCESSIBILITY_AUDIT.md` - Full audit report with 10 issues identified
  - `docs/ACCESSIBILITY_IMPLEMENTATION_EXAMPLE.md` - Code examples
  - `docs/ACCESSIBILITY_TESTING.md` - Testing procedures
  - `src/utils/accessibility.ts` - Helper utilities for accessible components

4. `Optimize web performance and check Lighthouse score` ✅

  See comprehensive guides:
  - `docs/WEB_PERFORMANCE_OPTIMIZATION.md` - Full optimization guide
  - `docs/PERFORMANCE_OPTIMIZATION_SUMMARY.md` - What was implemented

  Quick commands:
  - `npm run build:analyze` - Analyze bundle size
  - `npm run lighthouse` - Run performance audit

  Optimizations implemented:
  - ✅ Netlify caching and Brotli compression (60-70% size reduction)
  - ✅ Web Vitals monitoring (`src/utils/web-vitals.ts`)
  - ✅ Performance testing scripts
  - ✅ Security headers and CSP
  - ✅ HTTP→HTTPS redirects

  Current state:
  - Bundle: 4.8 MB → ~1.4-1.9 MB (compressed)
  - Monitoring: Auto-tracks LCP, FID, CLS, FCP, TTFB
  - Target: Lighthouse Performance 80+ (minimum), 90+ (ideal)

---

## Resources

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Netlify Documentation](https://docs.netlify.com/)
- [React Native Web Guide](https://necolas.github.io/react-native-web/)
