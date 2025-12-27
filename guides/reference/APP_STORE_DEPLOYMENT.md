# App Store Deployment Guide

**Goal:** Get your app live on iOS App Store and Google Play Store  
**Timeline:** 2-3 hours work, 3-7 days approval  
**Status:** Do this DURING Christmas break (parallel with finishing Phase 1)

---

## 📋 OVERVIEW

### What You're Publishing:
- **App Name:** Child Support Calculator (or whatever you choose)
- **Category:** Finance or Lifestyle
- **Price:** Free
- **Platforms:** iOS (App Store) and Android (Google Play)

### Timeline:
- **Your work:** 2-3 hours (spread over 2 days)
- **Apple review:** 1-7 days (avg 2-3 days, slower during holidays)
- **Google review:** 1-3 days (usually faster than Apple)
- **Total:** Should be live by Jan 2-5

---

## 🚀 PART 1: PREREQUISITES (30 min)

### Step 1.1: Developer Accounts

**Apple Developer Account:**
- Cost: $99 USD/year (~$150 AUD)
- Sign up: https://developer.apple.com/programs/enroll/
- Required: Australian ABN (or can use personal)
- **Do this first** - approval takes 24-48 hours

**Google Play Console:**
- Cost: $25 USD one-time (~$38 AUD)
- Sign up: https://play.google.com/console/signup
- Instant approval

**Total cost:** ~$190 AUD (one-time for Google, yearly for Apple)

### Step 1.2: Prepare App Assets

**1. App Icon (Required for both stores)**
- Size: 1024×1024 pixels
- Format: PNG, no transparency
- Design: Simple, recognizable

**Quick creation:**
```bash
# Option 1: Use Canva (easiest)
# Go to canva.com
# Search "app icon"
# Create 1024x1024 design
# Use calculator/money theme
# Download as PNG

# Option 2: Ask AI to generate
# Use DALL-E/Midjourney with prompt:
# "Simple app icon for child support calculator, 
#  professional, blue and white, money/calculator theme"
```

**2. Screenshots (Required)**

You need screenshots for:
- **iOS:** iPhone 6.7" (iPhone 14 Pro Max or similar)
- **Android:** Phone and 7" Tablet

**How to create:**
```bash
# Run your app in simulator
npx expo start

# iOS Simulator:
# Press Command + S to save screenshot
# Repeat for 3-5 different screens

# Android Emulator:
# Camera icon on right side panel
# Take 3-5 screenshots

# Screens to capture:
# 1. Calculator home screen
# 2. Results screen
# 3. Breakdown view
# 4. Alert (high value case)
# 5. Inquiry form
```

**3. App Description**

Draft now, we'll use it for both stores:

```
SUGGESTED APP DESCRIPTION:

Calculate child support payments instantly using the Australian Government formula (2020-2025).

FEATURES:
• Accurate calculations based on Services Australia formula
• Simple and detailed explanations
• Income and care percentage inputs
• Visual breakdowns of how payments are calculated
• Support for multiple children
• Special circumstances considerations

Perfect for:
✓ Separated parents understanding support obligations
✓ Planning financial arrangements
✓ Comparing different care scenarios
✓ Preparing for mediation or court

IMPORTANT: This calculator provides estimates only. Always verify with Services Australia or consult a family lawyer for legal advice.

100% free. No ads. No signup required.
```

**4. Privacy Policy**

You MUST have a privacy policy URL. Create this now:

Create file: `/public/privacy-policy.html` (we'll host it)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Privacy Policy - Child Support Calculator</title>
    <style>
        body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #2563eb; }
        h2 { color: #1e293b; margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p><strong>Last Updated:</strong> December 24, 2024</p>
    
    <h2>Information We Collect</h2>
    <p>Our app collects minimal information:</p>
    <ul>
        <li><strong>Anonymous Analytics:</strong> We use PostHog to track app usage (screens viewed, buttons clicked) to improve the app. No personal information is collected.</li>
        <li><strong>Inquiry Forms:</strong> If you choose to request legal help, we collect your name, email, and phone number. This information is only shared with family lawyers you choose to contact.</li>
    </ul>
    
    <h2>How We Use Information</h2>
    <ul>
        <li>Calculate child support estimates (done locally on your device)</li>
        <li>Improve app functionality through anonymous analytics</li>
        <li>Connect you with family lawyers if you request legal help</li>
    </ul>
    
    <h2>Information Sharing</h2>
    <p>We only share information when:</p>
    <ul>
        <li>You explicitly request legal help and provide consent</li>
        <li>Required by law</li>
    </ul>
    <p>We NEVER sell your data to third parties.</p>
    
    <h2>Data Security</h2>
    <p>All calculations are performed on your device. We use industry-standard encryption for any data transmitted to our servers.</p>
    
    <h2>Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
        <li>Request deletion of your data</li>
        <li>Access any data we have about you</li>
        <li>Opt out of analytics</li>
    </ul>
    
    <h2>Children's Privacy</h2>
    <p>This app is intended for adults (18+). We do not knowingly collect information from children.</p>
    
    <h2>Changes to Policy</h2>
    <p>We may update this policy. Check this page for updates.</p>
    
    <h2>Contact</h2>
    <p>Questions? Email: [your email]</p>
</body>
</html>
```

**Host it:**
- Option 1: Put on your website if you have one
- Option 2: Use GitHub Pages (free)
- Option 3: Host on Netlify/Vercel (free)

**Quick GitHub Pages setup:**
```bash
# Create repo: child-support-privacy
# Upload privacy-policy.html
# Enable GitHub Pages in settings
# URL will be: https://yourusername.github.io/child-support-privacy/privacy-policy.html
```

---

## 🍎 PART 2: iOS APP STORE SUBMISSION (1 hour)

### Step 2.1: Build iOS App with EAS

**Install EAS CLI:**
```bash
npm install -g eas-cli
```

**Login to Expo:**
```bash
eas login
```

**Configure the project:**
```bash
eas build:configure
```

This creates `eas.json`. Update it:

```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.yourname.childsupportcalc",
        "buildNumber": "1"
      },
      "android": {
        "package": "com.yourname.childsupportcalc",
        "versionCode": 1
      }
    }
  }
}
```

**Update app.json:**
```json
{
  "expo": {
    "name": "Child Support Calculator",
    "slug": "child-support-calculator",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.childsupportcalc",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSUserTrackingUsageDescription": "We use analytics to improve the app experience."
      }
    },
    "android": {
      "package": "com.yourname.childsupportcalc",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": []
    },
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "privacy": "public"
  }
}
```

**Build iOS app:**
```bash
eas build --platform ios --profile production
```

This takes 10-20 minutes. You'll get a `.ipa` file download link when done.

### Step 2.2: App Store Connect Setup

1. **Go to:** https://appstoreconnect.apple.com

2. **Click:** "My Apps" → "+" → "New App"

3. **Fill out:**
   - Platform: iOS
   - Name: Child Support Calculator
   - Primary Language: English (Australia)
   - Bundle ID: com.yourname.childsupportcalc (must match eas.json)
   - SKU: childsupportcalc (can be anything unique to you)
   - User Access: Full Access

4. **App Information:**
   - Category: Primary = Finance, Secondary = Lifestyle
   - Content Rights: [Your name/company]
   - Age Rating: 4+ (Infrequent/Mild Mature/Suggestive Themes - for legal content)

5. **Pricing:**
   - Price: Free
   - Availability: All countries

### Step 2.3: Upload Build

**Option A: Use Transporter app (easiest)**
1. Download Transporter from Mac App Store
2. Download the `.ipa` file from EAS build
3. Drag `.ipa` into Transporter
4. Click "Deliver"

**Option B: Command line**
```bash
# After EAS build completes
eas submit --platform ios
```

### Step 2.4: Complete App Store Listing

Back in App Store Connect:

1. **Screenshots:**
   - Upload 3-5 screenshots (6.7" iPhone)
   - Use the ones you created in Step 1.2

2. **Description:**
   - Paste the app description from Step 1.2

3. **Keywords:**
   ```
   child support,calculator,australia,family law,parenting,separation,divorce,payments,calculator,finance
   ```
   (100 characters max, comma separated)

4. **Support URL:**
   - Your website or email contact page
   - Can be same as privacy policy URL for now

5. **Privacy Policy URL:**
   - Paste your GitHub Pages URL from Step 1.2

6. **App Privacy:**
   - Click "Get Started"
   - Select: "Yes, we collect data from this app"
   - Data Types:
     * Contact Info → Email Address (only if they use inquiry form)
     * Usage Data → Product Interaction (analytics)
   - For each, select: "Used for App Functionality" and "Used for Analytics"
   - Third-Party Analytics: Yes (PostHog)

7. **Content Rights:**
   - Check "Yes" if you own all rights to content

8. **Version Information:**
   - Version: 1.0.0
   - Copyright: 2024 [Your Name]
   - What's New: "Initial release"

9. **Select the build:**
   - Click "+" next to Build
   - Select the build you uploaded via Transporter

10. **Submit for Review:**
    - Click "Submit for Review"
    - Answer questions:
      * Export Compliance: No (unless you're using heavy encryption)
      * Advertising Identifier: No (unless using ads)

**Done!** Now wait 1-7 days for review.

---

## 🤖 PART 3: GOOGLE PLAY STORE SUBMISSION (45 min)

### Step 3.1: Build Android App

```bash
eas build --platform android --profile production
```

This gives you an `.aab` file (Android App Bundle).

### Step 3.2: Google Play Console Setup

1. **Go to:** https://play.google.com/console

2. **Create App:**
   - Click "Create app"
   - App name: Child Support Calculator
   - Default language: English (Australia)
   - App or game: App
   - Free or paid: Free
   - Accept declarations

3. **Set up app:**

**Dashboard → Store presence → Main store listing:**

- App name: Child Support Calculator
- Short description (80 chars):
  ```
  Calculate Australian child support payments using the official formula
  ```
- Full description (4000 chars):
  ```
  [Paste the app description from Step 1.2]
  ```
- App icon: Upload 512x512 PNG
- Feature graphic: 1024x500 PNG (create in Canva - landscape hero image)
- Screenshots:
  - Phone: Upload 3-5 screenshots (minimum 2)
  - 7" Tablet: Upload 3-5 screenshots (minimum 2)
- App category: Finance
- Contact email: [your email]
- Privacy policy: [your GitHub Pages URL]

**Dashboard → Store presence → Store settings:**

- App category: Finance
- Tags: Leave blank or add: Calculator, Family

**Dashboard → Policy → App content:**

1. **Privacy policy:**
   - Add your privacy policy URL

2. **App access:**
   - All functionality available without restrictions
   - No special access required

3. **Ads:**
   - No, this app does not contain ads

4. **Content ratings:**
   - Click "Start questionnaire"
   - Select: Finance
   - Answer questions (all "No" for violence/adult content)
   - Get rating (should be "Everyone")

5. **Target audience:**
   - Age: 18+ only
   - Appeals to children: No

6. **News apps:**
   - Not a news app

7. **COVID-19 contact tracing:**
   - Not a contact tracing app

8. **Data safety:**
   - Click "Start"
   - Data collection:
     * Personal info → Email address (collected, not shared, optional)
     * App activity → App interactions (collected for analytics)
   - Data security:
     * Data encrypted in transit: Yes
     * Users can request deletion: Yes
   - Save

9. **Government apps:**
   - Not a government app

**Dashboard → Release → Production:**

1. **Countries:**
   - Select: Australia (or worldwide)

2. **Create release:**
   - Release name: 1.0.0
   - Upload the `.aab` file from EAS build
   - Release notes:
     ```
     Initial release:
     - Calculate child support using Australian formula
     - Simple and detailed explanations
     - Multiple children support
     - Free, no ads
     ```

3. **Review release:**
   - Click "Save"
   - Click "Review release"

4. **Rollout:**
   - Rollout percentage: 100%
   - Click "Start rollout to Production"

**Done!** Wait 1-3 days for review.

---

## 📱 PART 4: WHILE WAITING FOR APPROVAL

### Update Your Marketing Materials

**Update Phase 2 email templates** to include:

```
Download our free calculator:
📱 iOS: [Link when approved]
📱 Android: [Link when approved]

This is how parents will find you - through the app.
```

**Create app store links file** for easy reference:

Create `/APP_STORE_LINKS.md`:
```markdown
# App Store Links

**iOS App Store:**
https://apps.apple.com/app/idXXXXXXXXXX

**Google Play Store:**
https://play.google.com/store/apps/details?id=com.yourname.childsupportcalc

**QR Codes:**
[Generate at qr-code-generator.com when you have links]

**For Marketing:**
"Download the free Child Support Calculator app on iOS and Android"
```

---

## ⚠️ COMMON REJECTION REASONS (And How to Fix)

### iOS Rejections:

1. **"Misleading functionality"**
   - Fix: Add clear disclaimer this is estimate only
   - Add: "Always verify with Services Australia"

2. **"Incomplete information"**
   - Fix: Make sure support URL works
   - Fix: Privacy policy URL is accessible

3. **"App crashes"**
   - Fix: Test thoroughly before submitting
   - Run through all calculator scenarios

4. **"Insufficient metadata"**
   - Fix: Add better description or more screenshots

### Android Rejections:

1. **"Privacy policy missing or unclear"**
   - Fix: Update privacy policy to be more specific

2. **"Inappropriate content rating"**
   - Fix: Adjust content rating questionnaire

3. **"Deceptive behavior"**
   - Fix: Don't claim affiliation with Australian Government

**If rejected:**
- They tell you exactly why
- Fix it
- Resubmit
- Usually approved within 24 hours on resubmit

---

## ✅ FINAL CHECKLIST

### Before Submitting:

- [ ] Developer accounts created and paid
- [ ] App icon created (1024×1024)
- [ ] 5 screenshots taken for iOS
- [ ] 5 screenshots taken for Android
- [ ] App description written
- [ ] Privacy policy live and accessible
- [ ] App tested on real device (no crashes)
- [ ] PostHog analytics working
- [ ] Inquiry form submits successfully

### iOS Submission:
- [ ] Build created with EAS
- [ ] Build uploaded to App Store Connect
- [ ] All metadata filled out
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] App privacy questionnaire completed
- [ ] Build selected
- [ ] Submitted for review

### Android Submission:
- [ ] Build created with EAS
- [ ] App created in Google Play Console
- [ ] All metadata filled out
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Content ratings completed
- [ ] Data safety form completed
- [ ] Release rolled out to production

### After Approval:
- [ ] Test download on real device
- [ ] Update APP_STORE_LINKS.md with real URLs
- [ ] Update Phase 2 email templates with links
- [ ] Share links in lawyer outreach emails
- [ ] Post in forums with "Download on App Store" badges

---

## 🎯 TIMELINE

**Day 1 (Dec 24-25):**
- Create developer accounts
- Create app icon and screenshots
- Write privacy policy

**Day 2 (Dec 26):**
- Build iOS with EAS
- Set up App Store Connect
- Submit iOS for review

**Day 3 (Dec 27):**
- Build Android with EAS
- Set up Google Play Console
- Submit Android for review

**Day 4-10 (Dec 28 - Jan 5):**
- Wait for approval (check email daily)
- Meanwhile: Finish Phase 1, prepare Phase 2 materials
- If rejected: Fix and resubmit same day

**Jan 2-5:**
- Apps approved and live
- Update links everywhere
- Start Phase 2 with live apps!

---

## 💡 TIPS

1. **Submit iOS first** (takes longer to review)
2. **Use same description for both stores** (consistency)
3. **Test on real device before submitting** (simulator bugs are different)
4. **Don't mention COVID-19, gambling, or controversial topics** (triggers extra review)
5. **Make privacy policy super clear** (both stores care about this)
6. **Check email frequently** (they might ask for clarifications)
7. **Upload builds during their work hours** (faster review)
8. **If rejected, fix immediately and resubmit** (second review is faster)

---

## 🚨 EMERGENCY CONTACTS

**Expo/EAS Issues:**
- Expo Discord: https://chat.expo.dev
- Expo Forums: https://forums.expo.dev

**Apple Issues:**
- App Review: Contact via App Store Connect
- Developer Support: developer.apple.com/support

**Google Issues:**
- Google Play Support: support.google.com/googleplay/android-developer

---

**You can do this in parallel with Christmas Break Plan Steps 2-3!**

**Day 1:** Create assets + start builds  
**Day 2:** Submit both stores  
**Day 3-10:** Finish Phase 1 while waiting for approval

**By Jan 2, you'll have live apps on both stores ready for Phase 2!** 🚀
