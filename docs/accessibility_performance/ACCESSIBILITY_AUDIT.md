# Web Accessibility Audit & Recommendations

**Date:** 2025-12-28  
**Last Updated:** 2025-01-27  
**Platform:** Web (React Native Web)  
**WCAG Target:** Level AA Compliance

## Executive Summary

This audit identifies accessibility barriers for screen reader users and keyboard-only users on the Child Support Calculator web application. Many critical issues have been addressed, but some gaps remain.

**Current Status:**

- ✅ **Completed** - Form inputs have accessibility labels
- ✅ **Completed** - Buttons have accessibility labels
- ✅ **Completed** - Switches have accessibility labels and ARIA attributes
- ✅ **Completed** - Focus styles implemented for keyboard navigation
- ⚠️ **Partial** - Error messages not fully associated with inputs
- ⚠️ **Partial** - Modal accessibility properties missing
- ❌ **Missing** - Semantic landmarks (main, form, nav)
- ❌ **Missing** - Skip-to-content link

**Priority Levels:**

- 🔴 **Critical** - Blocks core functionality for assistive technology users
- 🟡 **High** - Significantly degrades user experience
- 🟢 **Medium** - Minor improvements for better accessibility

---

## Critical Issues (🔴)

### 1. Missing Accessibility Labels on Form Inputs

**Status:** ✅ **FIXED** - Labels added, but web ARIA attributes still needed

**Location:** `src/components/CalculatorForm.tsx`

**Current Implementation:**

- ✅ Income inputs have `accessibilityLabel` (lines 758, 816)
- ✅ Relevant dependents inputs have labels (lines 283, 298, 323, 338)
- ⚠️ Missing web-specific `aria-label` props (React Native Web may not translate accessibilityLabel)

**Current Code (lines 743-760):**

```tsx
<TextInput
  style={[styles.currencyInput, errors.incomeA && styles.inputError, isWeb && webInputStyles]}
  value={incomeA ? incomeA.toString() : ''}
  onChangeText={(text) => {...}}
  keyboardType="numeric"
  placeholder="0"
  placeholderTextColor="#64748b"
  accessibilityLabel="Parent A adjusted taxable income"
  accessibilityHint="Enter Parent A's annual income in dollars"
/>
```

**Remaining Issue:** Web-specific `aria-label` attributes not explicitly added for React Native Web compatibility.

**Recommendation:**

```tsx
<TextInput
  // ... existing props ...
  accessibilityLabel="Parent A adjusted taxable income"
  accessibilityHint="Enter Parent A's annual income in dollars"
  {...(isWeb && {
    'aria-label': 'Parent A adjusted taxable income',
    'aria-invalid': !!errors.incomeA,
    'aria-describedby': errors.incomeA ? 'error-incomeA' : undefined,
  })}
/>
```

---

### 2. Switches Missing Accessible Labels

**Status:** ✅ **FIXED** - BrandSwitch component has full accessibility support

**Location:** `src/components/CalculatorForm.tsx` (lines 763-771), `src/components/ui/BrandSwitch.tsx`

**Current Implementation:**

- ✅ `BrandSwitch` component has `accessibilityLabel` prop
- ✅ Includes `accessibilityRole="switch"`
- ✅ Web implementation includes `aria-checked` and `aria-label` (lines 65-68 in BrandSwitch.tsx)
- ✅ Used correctly in CalculatorForm with labels (lines 767, 825)

**Current Code (BrandSwitch.tsx lines 64-80):**

```tsx
const webAriaProps = {
  'aria-checked': value,
  'aria-label': accessibilityLabel,
};

return (
  <Pressable
    accessibilityRole="switch"
    accessibilityState={{ checked: value, disabled: !!disabled }}
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    {...webAriaProps}
  >
    {/* Switch UI */}
  </Pressable>
);
```

**Status:** ✅ Complete - No action needed

---

### 3. Buttons Missing Accessible Names

**Status:** ✅ **FIXED** - All buttons have accessibility labels

**Location:** Multiple files

**Current Implementation:**

- ✅ Add Child button has `accessibilityLabel` (line 886 in CalculatorForm.tsx)
- ✅ Calculate button has `accessibilityLabel` (line 898)
- ✅ Reset button has `accessibilityLabel` (line 906)
- ✅ Remove child button has `accessibilityLabel` (line 88 in ChildRow.tsx)
- ✅ Clear dependents button has `accessibilityLabel` (line 228)
- ⚠️ Web-specific `aria-label` attributes not explicitly added (may work via React Native Web translation)

**Current Code (CalculatorForm.tsx lines 882-909):**

```tsx
<Pressable
  onPress={onAddChild}
  style={[styles.addChildButton, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Add another child to the calculation"
>
  <Text style={styles.addChildButtonText}>+ Add Child</Text>
</Pressable>

<Pressable
  onPress={onCalculate}
  style={[styles.calculateButton, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Calculate child support"
>
  <Text style={styles.calculateButtonText}>Calculate</Text>
</Pressable>

<Pressable
  onPress={onReset}
  style={[styles.resetButton, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Reset form to default values"
>
  <Text style={styles.resetButtonText}>Reset</Text>
</Pressable>
```

**Remaining Issue:** Consider adding explicit `aria-label` props for web compatibility, though React Native Web should translate `accessibilityLabel`.

**Status:** ✅ Mostly complete - Minor enhancement optional

---

### 4. Modal Accessibility Properties Missing

**Status:** ⚠️ **PARTIAL** - HelpTooltip Modal missing accessibility properties

**Location:** `src/components/HelpTooltip.tsx` (line 44)

**Note:** The RelevantDependentsPopover does NOT use a Modal - it uses a custom drawer implementation, so this issue doesn't apply to it.

**Current Implementation:**

- ⚠️ HelpTooltip Modal lacks `accessibilityViewIsModal` (line 44-49)
- ⚠️ No web-specific `aria-modal` attribute
- ⚠️ No focus management when modal opens/closes

**Current Code (HelpTooltip.tsx lines 44-49):**

```tsx
<Modal
  visible={isVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setIsVisible(false)}
>
```

**Recommendation:**

```tsx
<Modal
  visible={isVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setIsVisible(false)}
  accessibilityViewIsModal={true}
  {...(isWeb && {
    role: 'dialog' as any,
    'aria-modal': 'true',
    'aria-labelledby': 'help-tooltip-title'
  })}
>
```

**Files Affected:**

- `src/components/HelpTooltip.tsx` (line 44)

**Status:** ⚠️ Needs implementation

---

### 5. Error Messages Not Associated with Inputs

**Status:** ⚠️ **PARTIAL** - DatePickerField has it, CalculatorForm inputs do not

**Location:** `src/components/CalculatorForm.tsx`, `src/components/ui/DatePickerField.tsx`

**Current Implementation:**

- ✅ DatePickerField has proper error associations (lines 131-133, 136 in DatePickerField.tsx)
- ❌ CalculatorForm income inputs lack `aria-invalid` and `aria-describedby` (lines 743-760, 801-818)
- ❌ Error messages lack IDs for association

**Example of Correct Implementation (DatePickerField.tsx):**

```tsx
<input
  aria-label={label}
  aria-invalid={!!error}
  aria-describedby={error ? 'date-error' : undefined}
/>;
{
  error && (
    <Text style={styles.errorText} nativeID="date-error">
      {error}
    </Text>
  );
}
```

**Current Code (CalculatorForm.tsx - needs fixing):**

```tsx
<TextInput
  style={[
    styles.currencyInput,
    errors.incomeA && styles.inputError,
    isWeb && webInputStyles,
  ]}
  value={incomeA ? incomeA.toString() : ''}
  accessibilityLabel="Parent A adjusted taxable income"
  // ❌ Missing: aria-invalid, aria-describedby
/>;
{
  errors.incomeA && (
    <Text style={styles.errorText}>
      {/* ❌ Missing: id="error-incomeA", role="alert" */}
      {errors.incomeA}
    </Text>
  );
}
```

**Recommendation:**

```tsx
<TextInput
  style={[
    styles.currencyInput,
    errors.incomeA && styles.inputError,
    isWeb && webInputStyles,
  ]}
  value={incomeA ? incomeA.toString() : ''}
  accessibilityLabel="Parent A adjusted taxable income"
  {...(isWeb && {
    'aria-invalid': !!errors.incomeA,
    'aria-describedby': errors.incomeA ? 'error-incomeA' : undefined,
  })}
/>;
{
  errors.incomeA && (
    <Text
      style={styles.errorText}
      {...(isWeb && { id: 'error-incomeA', role: 'alert' })}
      accessibilityRole="alert"
    >
      {errors.incomeA}
    </Text>
  );
}
```

**Files Affected:**

- `src/components/CalculatorForm.tsx` - Income inputs (lines 743-760, 801-818)
- All error message Text components in CalculatorForm

**Status:** ⚠️ Needs implementation

---

## High Priority Issues (🟡)

### 6. No Keyboard Navigation Support

**Status:** ✅ **FIXED** - Focus styles implemented

**Location:** `src/utils/responsive.ts`

**Current Implementation:**

- ✅ `webFocusStyles` implemented (lines 204-219 in responsive.ts)
- ✅ Uses CSS `:focus` and `:focus-visible` pseudo-classes
- ✅ Applied via `webInputStyles` and `webClickableStyles`
- ✅ Focus indicators visible (blue outline, 3px width, 2px offset)

**Current Code (responsive.ts lines 204-219):**

```tsx
export const webFocusStyles: any = isWeb
  ? {
      ':focus': {
        outlineWidth: '3px',
        outlineStyle: 'solid',
        outlineColor: 'rgba(59, 130, 246, 0.5)', // blue-500 with opacity
        outlineOffset: '2px',
      },
      ':focus-visible': {
        outlineWidth: '3px',
        outlineStyle: 'solid',
        outlineColor: 'rgba(59, 130, 246, 0.5)',
        outlineOffset: '2px',
      },
    }
  : {};
```

**Note:** Tab order is handled naturally by DOM order. Focus trapping for modals may need verification.

**Status:** ✅ Complete - Focus styles working

---

### 7. Missing Landmark Regions

**Status:** ❌ **NOT IMPLEMENTED** - Semantic landmarks still missing

**Issue:**

- No semantic HTML5 landmarks (`<main>`, `<nav>`, `<form>`)
- Screen reader users can't quickly navigate page sections
- No skip-to-content link

**Current State:**

- ❌ No `SemanticView` component found
- ❌ No `role="main"` on main content
- ❌ No `role="form"` on calculator form
- ❌ No skip-to-content link

**Recommendations:**

1. **Add Semantic Landmarks to Main Layout:**

Create `src/components/SemanticView.tsx`:

```tsx
import { View, ViewProps } from 'react-native';
import { isWeb } from '../utils/responsive';

interface SemanticViewProps extends ViewProps {
  role?:
    | 'main'
    | 'navigation'
    | 'form'
    | 'region'
    | 'article'
    | 'complementary';
  ariaLabel?: string;
}

export function SemanticView({ role, ariaLabel, ...props }: SemanticViewProps) {
  const webProps =
    isWeb && role
      ? {
          role: role as any,
          ...(ariaLabel && { 'aria-label': ariaLabel }),
        }
      : {};

  return <View {...props} {...webProps} />;
}
```

2. **Use in Calculator Screen:**

```tsx
<SemanticView role="main" ariaLabel="Child Support Calculator">
  <SemanticView role="form" ariaLabel="Child support calculation form">
    <CalculatorForm {...formProps} />
  </SemanticView>
</SemanticView>
```

3. **Add Skip-to-Content Link** (in main layout):

```tsx
{
  isWeb && (
    <Pressable
      style={skipLinkStyles.link}
      onPress={() => {
        /* Focus main content */
      }}
      {...({
        'aria-label': 'Skip to main content',
        href: '#main-content',
      } as any)}
    >
      <Text>Skip to main content</Text>
    </Pressable>
  );
}
```

**Status:** ❌ Needs implementation

---

### 8. Child Rows Lack Individual Labels

**Status:** ✅ **FIXED** - Child rows have proper labels with index

**Location:** `src/components/ChildRow.tsx`

**Current Implementation:**

- ✅ Container has comprehensive `accessibilityLabel` with child index (line 74)
- ✅ Individual inputs have labels (lines 114, 136)
- ✅ Child index displayed visually (lines 77-80)
- ⚠️ Input labels don't include child index number (only parent name)

**Current Code (ChildRow.tsx lines 74, 114, 136):**

```tsx
<View
  accessible={true}
  accessibilityLabel={`Child ${childIndex} of ${totalChildren}. Care arrangement: Parent A ${child.careAmountA} nights, Parent B ${child.careAmountB} nights per ${child.carePeriod}`}
>
  {/* ... */}
  <TextInput
    accessibilityLabel="Parent A nights of care"
    accessibilityHint="Enter number of nights child stays with Parent A"
  />
  <TextInput
    accessibilityLabel="Parent B nights of care"
    accessibilityHint="Enter number of nights child stays with Parent B"
  />
</View>
```

**Optional Enhancement:** Could include child index in individual input labels for even clearer context:

```tsx
accessibilityLabel={`Child ${childIndex}, Parent A nights of care`}
```

**Status:** ✅ Complete - Labels functional, minor enhancement optional

---

## Medium Priority Issues (🟢)

### 9. Insufficient Color Contrast

**Status:** ✅ **FIXED** - Color contrast improved

**Location:** Multiple style files

**Current Implementation:**

- ✅ HelpTooltip button border uses `#6b7280` (grey-500, 4.5:1 contrast) - line 105
- ✅ HelpTooltip button text uses `#4b5563` (grey-600, 5.9:1 contrast) - line 111
- ⚠️ Need to verify all text colors meet WCAG AA standards

**Note:** The audit mentioned specific colors (#718096) which may have been updated. Current implementation appears to use better contrast colors. Should verify with automated tools (Lighthouse, axe DevTools).

**Status:** ✅ Likely complete - Verify with automated tools

---

### 10. HelpTooltip Component Accessibility

**Status:** ⚠️ **PARTIAL** - Basic labels present, but missing expanded state and keyboard support

**Location:** `src/components/HelpTooltip.tsx`

**Current Implementation:**

- ✅ Trigger button has `accessibilityLabel="Help"` (line 36)
- ✅ Has `accessibilityHint` (line 37)
- ❌ Missing `accessibilityExpanded` state
- ❌ Missing keyboard support (Enter/Space)
- ❌ Modal missing accessibility properties (covered in issue #4)

**Current Code (HelpTooltip.tsx lines 28-42):**

```tsx
<Pressable
  onPress={() => setIsVisible(!isVisible)}
  style={[...]}
  accessibilityRole="button"
  accessibilityLabel="Help"
  accessibilityHint="Tap to see more information"
>
  <Text style={styles.buttonText}>?</Text>
</Pressable>
```

**Recommendations:**

```tsx
<Pressable
  onPress={() => setIsVisible(!isVisible)}
  style={[...]}
  accessibilityRole="button"
  accessibilityLabel={`Help: ${header || 'Information'}`}
  accessibilityHint="Tap to see more information"
  accessibilityExpanded={isVisible}
  {...(isWeb && {
    'aria-label': `Help: ${header || 'Information'}`,
    'aria-expanded': isVisible,
    'aria-haspopup': 'dialog',
    onKeyDown: (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    },
  })}
>
  <Text style={styles.buttonText}>?</Text>
</Pressable>
```

**Status:** ⚠️ Needs enhancement

---

## Implementation Status

### Phase 1 - Critical Fixes

1. ✅ **COMPLETE** - Add accessibility labels to all form inputs
2. ✅ **COMPLETE** - Add accessibility labels to all buttons
3. ⚠️ **PARTIAL** - Fix modal accessibility properties (HelpTooltip Modal still missing properties)
4. ⚠️ **PARTIAL** - Associate error messages with inputs (DatePickerField done, CalculatorForm needs work)

### Phase 2 - High Priority

5. ✅ **COMPLETE** - Implement keyboard navigation
6. ✅ **COMPLETE** - Add visible focus indicators
7. ❌ **NOT DONE** - Add semantic landmarks
8. ✅ **COMPLETE** - Fix child row labels

### Phase 3 - Medium Priority

9. ✅ **LIKELY COMPLETE** - Improve color contrast (verify with tools)
10. ⚠️ **PARTIAL** - Enhance tooltip accessibility (missing expanded state, keyboard support)
11. ❌ **NOT DONE** - Add skip-to-content link

## Remaining Work

**Critical:**

- Associate error messages with inputs in CalculatorForm
- Add accessibility properties to HelpTooltip Modal

**High:**

- Implement semantic landmarks (main, form, nav)
- Add skip-to-content link

**Medium:**

- Enhance HelpTooltip with expanded state and keyboard support
- Add web-specific ARIA attributes explicitly (may work via RN Web translation, but explicit is better)

---

## Testing Checklist

### Screen Reader Testing

- [ ] **NVDA (Windows)** - Test with Chrome/Firefox
- [ ] **JAWS (Windows)** - Test with Chrome
- [ ] **VoiceOver (macOS)** - Test with Safari
- [ ] **VoiceOver (iOS)** - Test on iPhone/iPad
- [ ] **TalkBack (Android)** - Test on Android device

### Keyboard Testing

- [ ] Tab through all interactive elements
- [ ] Verify logical tab order
- [ ] Test all buttons with Enter/Space
- [ ] Test form submission with Enter
- [ ] Verify focus indicators are visible
- [ ] Test modal/drawer keyboard trap prevention

### Automated Testing

- [ ] Run axe DevTools browser extension
- [ ] Run Lighthouse accessibility audit (target 95+ score)
- [ ] Run WAVE accessibility evaluation tool
- [ ] Test with keyboard-only navigation

---

## Resources

### WCAG 2.1 Guidelines

- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [React Native Web Accessibility](https://necolas.github.io/react-native-web/docs/accessibility/)

### Testing Tools

- [NVDA Screen Reader](https://www.nvaccess.org/download/) (Free)
- [axe DevTools](https://www.deque.com/axe/devtools/) (Free)
- [WAVE Evaluation Tool](https://wave.webaim.org/extension/) (Free)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Summary

**Total Issues Found:** 10  
**Status as of 2025-01-27:**

- ✅ **Complete:** 6 issues (Form labels, Button labels, Switch labels, Focus styles, Child row labels, Color contrast)
- ⚠️ **Partial:** 3 issues (Modal accessibility, Error associations, Tooltip accessibility)
- ❌ **Not Done:** 2 issues (Semantic landmarks, Skip-to-content link)

**Progress:** ~60% complete (6 fully done, 3 partially done)

**Remaining Critical Work:**

1. Error message associations in CalculatorForm
2. HelpTooltip Modal accessibility properties
3. Semantic landmarks implementation
4. Skip-to-content link

**Estimated Remaining Effort:** 1-2 weeks for full compliance

**Impact:** Significant progress made. Completing remaining issues will ensure full WCAG AA compliance, making the calculator accessible to ~15% of users who rely on assistive technologies, improving SEO, and ensuring legal compliance with accessibility standards.
