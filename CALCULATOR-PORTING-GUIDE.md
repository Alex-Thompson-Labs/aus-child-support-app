# Porting Calculator to React Native/Expo - User Steps

## Overview

The calculator has been ported from the Next.js web app to React Native/Expo. All core files have been converted and the app entry point has been updated. This guide covers only the steps you need to complete.

## What's Already Done

✅ All utility files copied (`src/utils/`)
✅ All type definitions copied (`src/types/`)
✅ Import paths updated to relative paths
✅ `useCalculator` hook converted with updated imports
✅ All components converted to React Native:
  - `CalculatorForm.tsx`
  - `CalculatorResults.tsx`
  - `ChildRow.tsx`
  - `HelpTooltip.tsx`
✅ `CalculatorScreen` created
✅ App entry point updated (`app/(tabs)/index.tsx`)
✅ Dependencies installed (`@react-native-picker/picker`)

## Steps You Need to Complete

### Step 1: Test the App

Run the app and verify everything works:

```bash
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

**What to test:**
1. Form inputs accept values correctly
2. Calculations trigger on input changes
3. Results display correctly
4. Adding/removing children works
5. Relevant dependents toggle works
6. Override mode works
7. Help tooltips display correctly
8. Full breakdown expands/collapses

### Step 2: Review and Adjust Styling (Optional)

The components use StyleSheet with Tailwind color equivalents. If you want to adjust:

- **Colors**: Check `src/components/*.tsx` files for `StyleSheet.create()` sections
- **Spacing**: Adjust padding/margin values in StyleSheet objects
- **Layout**: Modify flexbox properties (`flexDirection`, `justifyContent`, `alignItems`)

**Color reference:**
- `slate-900`: `#0f172a`
- `slate-800`: `#1e293b`
- `slate-700`: `#334155`
- `slate-600`: `#475569`
- `slate-400`: `#94a3b8`
- `slate-300`: `#cbd5e1`
- `blue-600`: `#2563eb`
- `blue-400`: `#60a5fa`

### Step 3: Test on Physical Devices

1. **iOS**: Connect iPhone, enable developer mode, run `npx expo start` and press `i`
2. **Android**: Connect Android device, enable USB debugging, run `npx expo start` and press `a`

Test on both platforms as UI can differ slightly.

### Step 4: Handle Any Edge Cases

Review the app behavior and check for:
- Keyboard covering inputs (should be handled by `KeyboardAvoidingView`)
- Long form scrolling (should work with `ScrollView`)
- Very large numbers in inputs
- Empty states (no children, zero income, etc.)

### Step 5: Performance Optimization (Optional)

If you notice performance issues:

1. **Add React.memo** to components that don't change often:
```typescript
export const CalculatorResults = React.memo(({ results }: CalculatorResultsProps) => {
  // ...
});
```

2. **Use useMemo** for expensive calculations** (already done in `useCalculator`)

3. **Debounce calculation triggers** (already implemented with 300ms debounce)

### Step 6: Add Navigation (If Needed)

If you plan to add more screens:

1. Install navigation dependencies (already installed: `@react-navigation/native`)
2. Update `app/_layout.tsx` to add routes
3. Use `expo-router` Link components for navigation

### Step 7: Prepare for App Store/Play Store (When Ready)

1. Update `app.json` with app metadata
2. Configure app icons and splash screens
3. Set up app signing (iOS) and keystore (Android)
4. Build production bundles:
   - iOS: `eas build --platform ios`
   - Android: `eas build --platform android`

## File Structure

```
ChildSupportCalculator/
├── src/
│   ├── screens/
│   │   └── CalculatorScreen.tsx      ✅ Created
│   ├── components/
│   │   ├── CalculatorForm.tsx        ✅ Converted
│   │   ├── CalculatorResults.tsx     ✅ Converted
│   │   ├── ChildRow.tsx              ✅ Converted
│   │   └── HelpTooltip.tsx           ✅ Converted
│   ├── hooks/
│   │   └── useCalculator.ts         ✅ Converted
│   ├── utils/
│   │   ├── child-support-calculations.ts  ✅ Copied
│   │   ├── child-support-constants.ts     ✅ Copied
│   │   └── cost-of-children-tables.ts     ✅ Copied
│   └── types/
│       └── calculator.ts             ✅ Copied
├── app/
│   └── (tabs)/
│       └── index.tsx                 ✅ Updated
└── package.json                      ✅ Dependencies installed
```

## Common Issues and Solutions

### Issue: Import errors
**Solution:** All imports are already using relative paths. If you see errors, check that all files exist in the correct locations.

### Issue: Picker not showing
**Solution:** `@react-native-picker/picker` is already installed. If it doesn't work, try:
```bash
npx expo install @react-native-picker/picker
```

### Issue: Keyboard covering inputs
**Solution:** `KeyboardAvoidingView` is already implemented in `CalculatorScreen`. If issues persist, adjust the `behavior` prop.

### Issue: Colors look wrong
**Solution:** Verify hex color codes in StyleSheet objects match your design. All Tailwind colors have been converted.

### Issue: TextInput not showing keyboard
**Solution:** Ensure `keyboardType="numeric"` is set on numeric inputs (already done).

## Next Steps

1. ✅ Test the app thoroughly
2. ✅ Review styling and adjust if needed
3. ✅ Test on physical devices
4. ✅ Handle any edge cases
5. ✅ Optimize performance if needed
6. ✅ Add navigation if planning multiple screens
7. ✅ Prepare for app store submission when ready

## Resources

- [React Native Components](https://reactnative.dev/docs/components-and-apis)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [React Native Picker](https://github.com/react-native-picker/picker)
- [KeyboardAvoidingView](https://reactnative.dev/docs/keyboardavoidingview)
