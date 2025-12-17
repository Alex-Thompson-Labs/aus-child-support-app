# Troubleshooting Guide - Common Issues

Quick fixes for problems you might encounter during Phase 1.

---

## 🔥 Posthog / Analytics Issues

### "Events not showing up in Posthog dashboard"
**Possible causes:**
1. Wrong API key in `.env`
2. .env file not loaded (need to restart Expo)
3. Network blocked (firewall/VPN)
4. Wrong project selected in Posthog dashboard

**Solutions:**
```bash
# 1. Verify API key
cat .env | grep POSTHOG_API_KEY

# 2. Restart Expo with cleared cache
npx expo start -c

# 3. Test with console logs first
Analytics.track('test_event', { test: true });
// Check console output before checking Posthog

# 4. Check Posthog project settings
# Go to https://app.posthog.com/settings/project
```

### "Module 'posthog-react-native' not found"
**Solution:**
```bash
npm install posthog-react-native
npx expo start -c
```

---

## 🎨 UI / Component Issues

### "LawyerAlert not displaying"
**Check:**
1. Is complexity detection returning true for any flag?
2. Is getAlertConfig returning an AlertConfig object?
3. Console.log the flags to debug

**Debug code:**
```typescript
const flags = detectComplexity(results, formData);
console.log('Complexity flags:', flags);

const alertConfig = getAlertConfig(flags, results);
console.log('Alert config:', alertConfig);
```

### "Button not clickable / Navigation not working"
**Common issues:**
1. Navigation not set up in app/_layout.tsx
2. Screen not registered in router
3. Gesture handler not initialized

**Solution:**
```typescript
// Make sure LawyerInquiryScreen is exported as default
export default function LawyerInquiryScreen() { ... }

// Check it's in the right directory
// Should be: src/screens/LawyerInquiryScreen.tsx
```

### "Keyboard covers input fields"
**Solution:**
Already implemented in LawyerInquiryScreen with KeyboardAvoidingView.
If still having issues:
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={100} // Adjust this value
  style={styles.container}
>
```

---

## 📧 Form Submission Issues

### "Email not sending"
**Phase 1 workaround:**
```typescript
// For now, just console.log the data
// Set up email service in Phase 2
handleSubmit = () => {
  const leadData = {
    name, email, phone, message,
    calculation: results,
    timestamp: new Date().toISOString()
  };
  console.log('LEAD SUBMISSION:', JSON.stringify(leadData, null, 2));
  
  // TODO Phase 2: Send to email service
  // For now, manually copy from console and email yourself
};
```

### "Form validation not working"
**Check:**
```typescript
const isValid = 
  name.trim().length > 0 &&
  email.includes('@') &&
  consent === true;

if (!isValid) {
  alert('Please fill in all required fields');
  return;
}
```

---

## 💾 Environment Variable Issues

### ".env changes not taking effect"
**Solution:**
```bash
# ALWAYS restart Expo after changing .env
npx expo start -c

# The -c flag clears the cache
```

### "Can't read POSTHOG_API_KEY from .env"
**Install react-native-dotenv:**
```bash
npm install react-native-dotenv
```

**Add to babel.config.js:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

**TypeScript support - create `types/env.d.ts`:**
```typescript
declare module '@env' {
  export const POSTHOG_API_KEY: string;
  export const POSTHOG_HOST: string;
}
```

---

## 🚀 Build / Runtime Issues

### "App crashes on startup"
**Check:**
1. No syntax errors: `npm run type-check`
2. All imports resolve: `npm run lint`
3. Clear cache: `npx expo start -c`

**Still crashing? Check logs:**
```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
adb logcat
```

### "Metro bundler won't start"
**Solution:**
```bash
# Kill all node processes
killall node

# Clear watchman
watchman watch-del-all

# Clear Metro cache
rm -rf node_modules/.cache

# Restart
npx expo start -c
```

---

## 🧪 Testing Issues

### "Can't get test users"
**Alternative strategies:**
1. Post in smaller, niche Facebook groups (not just big ones)
2. Reddit: r/AusMemes (explain it's for a uni project)
3. LinkedIn: "Building a free tool for separated parents"
4. Ask friends/family to share with their networks
5. Offer $10 gift card for first 50 testers

### "Click-through rate is 0%"
**Iterate on messaging:**
1. Make alerts more urgent: "You could be paying $3,200 too much"
2. Add social proof: "342 parents connected with lawyers this month"
3. Lower thresholds: High value >$10k instead of >$15k
4. Test different trigger combinations

---

## 📱 Device-Specific Issues

### iOS Simulator
```bash
# Reset simulator if weird issues
xcrun simctl erase all

# Or specific device
xcrun simctl erase <device-id>
```

### Android Emulator
```bash
# Cold boot (slow but fresh start)
emulator -avd <device-name> -no-snapshot-load

# Clear app data
adb shell pm clear com.anonymous.childsupportcalculator
```

---

## 🆘 When All Else Fails

1. **Check docs/MASTER_PLAN.md** - Full code snippets in Appendix A
2. **Check docs/DESIGN_SYSTEM.md** - Styling patterns
3. **Check docs/CLAUDE.md** - Architecture reference
4. **Git reset to last working state:**
   ```bash
   git status
   git diff  # See what changed
   git checkout -- <file>  # Undo changes to specific file
   ```
5. **Ask for help** - Create a GitHub issue or search Stack Overflow

---

**Remember:** Most issues are typos, missing imports, or forgotten restarts. Take a break, come back fresh! ☕
