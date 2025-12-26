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

Add web platform support to your `app.json`:

```json
{
  "expo": {
    "platforms": ["ios", "android", "web"],
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    }
  }
}
```

**What this does:**
- `platforms`: Tells Expo to build for web in addition to mobile
- `output: "static"`: Creates a static website (no server required)
- `bundler: "metro"`: Uses Metro bundler (same as mobile)

---

## Step 3: Create a Favicon (Optional)

If you don't have one already:

1. Create or download a 48x48 pixel PNG icon
2. Save it as `assets/images/favicon.png`

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

### 5.1 Check for Native-Only Features

Search your codebase for features that won't work on web:
- Haptic feedback (`Haptics.impactAsync()`)
- Native alerts that need replacement
- Platform-specific components

### 5.2 Add Platform-Specific Code (if needed)

Use `Platform.OS` to handle web differently:

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else {
  // Mobile code
}
```

### 5.3 Test All Features

Go through your app and test:
- Calculator functionality
- Navigation between screens
- Form inputs
- Results display
- PDF generation (might need web alternative)

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

### For Netlify (Drag & Drop):

1. Build: `npx expo export --platform web`
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `dist/` folder to the upload area
4. Done! Your site is live

### For Netlify (CLI - Automatic Deploys):

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify init` in your project
3. Connect to your Netlify account
4. For future deploys:
   ```bash
   npx expo export --platform web
   netlify deploy --prod --dir=dist
   ```

---

## Step 9: Add Custom Domain (Optional)

### If using Netlify:

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter your domain (e.g., `calculator.alexthompson.com.au`)
4. Follow DNS configuration instructions
5. Netlify handles HTTPS automatically

---

## Step 10: Set Up Continuous Deployment (Optional)

### If using GitHub + Netlify:

1. Push your code to GitHub
2. In Netlify, choose "New site from Git"
3. Connect your repository
4. Build settings:
   - Build command: `npx expo export --platform web`
   - Publish directory: `dist`
5. Every git push will auto-deploy

---

## Maintenance & Updates

### To update the live site:

1. Make your changes locally
2. Test with `npx expo start --web`
3. Build: `npx expo export --platform web`
4. Deploy (method depends on hosting choice)

### Monitor for issues:

- Check browser console for errors
- Test on different browsers (Chrome, Safari, Firefox)
- Test on mobile browsers
- Monitor analytics for user behavior

---

## Troubleshooting

### Build fails with "metro" error
- Make sure you installed `@expo/metro-runtime`
- Clear cache: `npx expo start --web --clear`

### Fonts don't load
- Check font paths in app.json
- Ensure fonts are in assets/fonts
- Web needs font files to be publicly accessible

### Navigation doesn't work
- Expo Router should work on web automatically
- Check that all routes use proper Expo Router conventions

### Styling looks different on web
- Web uses different default styles
- Check for `Platform.OS === 'web'` specific styling
- Test responsive design at different screen sizes

### Analytics not tracking
- Web needs different analytics setup than mobile
- Consider Google Analytics for web
- PostHog should work on web with same config

---

## Cost Estimate

- **Netlify Free Tier**: 100GB bandwidth/month, unlimited sites
- **Vercel Free Tier**: 100GB bandwidth/month
- **GitHub Pages**: Free, unlimited for public repos
- **Custom Domain**: ~$15-30/year (if you don't already have one)

**Total: $0-30/year**

---

## Next Steps After Deployment

1. Set up analytics tracking for web
2. Add SEO meta tags in app.json
3. Create a landing page/marketing site
4. Submit to Google Search Console
5. Monitor performance with Lighthouse
6. Test accessibility (screen readers, keyboard navigation)

---

## Resources

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Netlify Documentation](https://docs.netlify.com/)
- [React Native Web Guide](https://necolas.github.io/react-native-web/)
