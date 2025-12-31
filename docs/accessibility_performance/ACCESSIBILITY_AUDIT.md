# Web Accessibility Audit & Recommendations

**Date:** 2025-12-28
**Platform:** Web (React Native Web)
**WCAG Target:** Level AA Compliance

## Executive Summary

This audit identifies accessibility barriers for screen reader users and keyboard-only users on the Child Support Calculator web application. Critical issues include missing ARIA labels, lack of keyboard navigation support, and improper form field associations.

**Priority Levels:**
- 🔴 **Critical** - Blocks core functionality for assistive technology users
- 🟡 **High** - Significantly degrades user experience
- 🟢 **Medium** - Minor improvements for better accessibility

---

## Critical Issues (🔴)

### 1. Missing Accessibility Labels on Form Inputs

**Location:** `src/components/CalculatorForm.tsx`

**Issue:**
- Income input fields lack `accessibilityLabel` attributes
- Screen readers announce only "text field" without context
- Parent A/B income inputs are indistinguishable to screen reader users

**Current Code (lines 676-686):**
```tsx
<TextInput
  style={[styles.currencyInput, ...]}
  value={incomeA ? incomeA.toString() : ""}
  onChangeText={(text) => {...}}
  keyboardType="numeric"
  placeholder="0"
  placeholderTextColor="#64748b"
/>
```

**Impact:** Screen reader users cannot identify which parent's income they're entering.

**Recommendation:**

```tsx
<TextInput
  style={[styles.currencyInput, ...]}
  value={incomeA ? incomeA.toString() : ""}
  onChangeText={(text) => {...}}
  keyboardType="numeric"
  placeholder="0"
  placeholderTextColor="#64748b"
  accessibilityLabel="Parent A Adjusted Taxable Income"
  accessibilityHint="Enter annual income in dollars"
  accessibilityRole="none"  // For web, use input role
  {...(isWeb && { role: 'textbox' as any, 'aria-label': 'Parent A Adjusted Taxable Income' })}
/>
```

**Files Affected:**
- Parent A income input (line 676)
- Parent B income input (line 720)
- All relevant dependents inputs (lines 104, 117, 133, 146, 240, 253, 273, 284)

---

### 2. Switches Missing Accessible Labels

**Location:** `src/components/CalculatorForm.tsx` (lines 689, 732)

**Issue:**
- Income support switches have no `accessibilityLabel`
- Screen reader announces "switch" without context
- Users don't know what they're toggling

**Current Code:**
```tsx
<Switch
  value={supportA}
  onValueChange={onSupportAChange}
  trackColor={{ false: "#475569", true: "#f59e0b" }}
  thumbColor="#ffffff"
  style={styles.smallSwitch}
/>
```

**Recommendation:**
```tsx
<Switch
  value={supportA}
  onValueChange={onSupportAChange}
  trackColor={{ false: "#475569", true: "#f59e0b" }}
  thumbColor="#ffffff"
  style={styles.smallSwitch}
  accessibilityLabel="Parent A receives income support"
  accessibilityRole="switch"
  accessibilityState={{ checked: supportA }}
  {...(isWeb && {
    role: 'switch' as any,
    'aria-label': 'Parent A receives income support',
    'aria-checked': supportA
  })}
/>
```

---

### 3. Buttons Missing Accessible Names

**Location:** Multiple files

**Issue:**
- "Add Child", "Calculate", "Reset" buttons lack proper accessibility attributes
- Modals close buttons only show "×" without accessible name
- Icon-only buttons are not labeled

**Examples:**
1. **Add Child Button** (`CalculatorForm.tsx` line 785):
```tsx
<Pressable
  onPress={onAddChild}
  style={[styles.addChildButton, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Add child"
  accessibilityHint="Add another child to the calculation"
  {...(isWeb && { role: 'button' as any, 'aria-label': 'Add child' })}
>
  <Text style={styles.addChildButtonText}>+ Add Child</Text>
</Pressable>
```

2. **Calculate Button** (`CalculatorForm.tsx` line 795):
```tsx
<Pressable
  onPress={onCalculate}
  style={[styles.calculateButton, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Calculate child support"
  {...(isWeb && { role: 'button' as any, 'aria-label': 'Calculate child support' })}
>
  <Text style={styles.calculateButtonText}>Calculate</Text>
</Pressable>
```

3. **Close Button** (`CalculatorForm.tsx` line 93):
```tsx
<Pressable
  onPress={() => setIsOpen(false)}
  style={popoverStyles.closeButton}
  accessibilityRole="button"
  accessibilityLabel="Close relevant dependents panel"
  {...(isWeb && { role: 'button' as any, 'aria-label': 'Close' })}
>
  <Text style={popoverStyles.closeButtonText}>×</Text>
</Pressable>
```

---

### 4. Modal Accessibility Properties Missing

**Location:** `src/components/CalculatorForm.tsx` (line 73)

**Issue:**
- Modal lacks accessibility properties for screen readers
- No focus management when modal opens/closes
- Users may not know they're in a modal dialog

**Current Code:**
```tsx
<Modal
  visible={isOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setIsOpen(false)}
>
```

**Recommendation:**
```tsx
<Modal
  visible={isOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setIsOpen(false)}
  accessibilityViewIsModal={true}
  {...(isWeb && {
    role: 'dialog' as any,
    'aria-modal': 'true',
    'aria-labelledby': 'dependents-modal-title'
  })}
>
```

And add an ID to the title:
```tsx
<Text
  style={popoverStyles.title}
  {...(isWeb && { id: 'dependents-modal-title' })}
>
  Relevant Dependents
</Text>
```

---

### 5. Error Messages Not Associated with Inputs

**Location:** `src/components/CalculatorForm.tsx`, `src/components/WebInquiryPanel.tsx`

**Issue:**
- Error messages displayed but not programmatically associated with inputs
- Screen readers don't announce errors when inputs gain focus
- No `aria-describedby` or `aria-invalid` attributes

**Current Code:**
```tsx
<TextInput
  style={[styles.currencyInput, errors.incomeA && styles.inputError]}
  value={incomeA ? incomeA.toString() : ""}
  // ... other props
/>
{errors.incomeA && (
  <Text style={styles.errorText}>{errors.incomeA}</Text>
)}
```

**Recommendation:**
```tsx
<TextInput
  style={[styles.currencyInput, errors.incomeA && styles.inputError]}
  value={incomeA ? incomeA.toString() : ""}
  accessibilityLabel="Parent A Adjusted Taxable Income"
  {...(isWeb && {
    'aria-label': 'Parent A Adjusted Taxable Income',
    'aria-invalid': !!errors.incomeA,
    'aria-describedby': errors.incomeA ? 'error-incomeA' : undefined
  })}
/>
{errors.incomeA && (
  <Text
    style={styles.errorText}
    accessibilityRole="alert"
    {...(isWeb && { id: 'error-incomeA', role: 'alert' })}
  >
    {errors.incomeA}
  </Text>
)}
```

---

## High Priority Issues (🟡)

### 6. No Keyboard Navigation Support

**Issue:**
- Web users cannot tab through interactive elements logically
- No visible focus indicators on custom components
- Drawer/popover components trap keyboard focus

**Recommendations:**

1. **Add Focus Styles** (`src/utils/responsive.ts`):
```tsx
export const webFocusStyles = isWeb ? {
  outlineStyle: 'solid' as any,
  outlineWidth: '2px' as any,
  outlineColor: '#3b82f6' as any,
  outlineOffset: '2px' as any,
} : {};
```

2. **Apply to Interactive Elements:**
```tsx
<Pressable
  onPress={onAddChild}
  style={[styles.addChildButton, isWeb && webClickableStyles]}
  {...(isWeb && {
    tabIndex: 0,
    onFocus: (e) => {
      e.currentTarget.style.outline = '2px solid #3b82f6';
      e.currentTarget.style.outlineOffset = '2px';
    },
    onBlur: (e) => {
      e.currentTarget.style.outline = 'none';
    }
  })}
>
```

3. **Fix Tab Order:**
- Ensure logical tab order matches visual order
- Add `tabIndex={-1}` to decorative elements
- Add `tabIndex={0}` to custom interactive elements

---

### 7. Missing Landmark Regions

**Issue:**
- No semantic HTML5 landmarks (`<main>`, `<nav>`, `<form>`)
- Screen reader users can't quickly navigate page sections
- No skip-to-content link

**Recommendations:**

1. **Add Semantic Landmarks to Main Layout:**

Create `src/components/SemanticView.tsx`:
```tsx
import { View, ViewProps } from 'react-native';
import { isWeb } from '../utils/responsive';

interface SemanticViewProps extends ViewProps {
  role?: 'main' | 'navigation' | 'form' | 'region' | 'article' | 'complementary';
  ariaLabel?: string;
}

export function SemanticView({ role, ariaLabel, ...props }: SemanticViewProps) {
  const webProps = isWeb && role ? {
    role: role as any,
    ...(ariaLabel && { 'aria-label': ariaLabel })
  } : {};

  return <View {...props} {...webProps} />;
}
```

2. **Use in Calculator Screen:**
```tsx
<SemanticView role="main" ariaLabel="Child Support Calculator">
  <CalculatorForm {...formProps} />
</SemanticView>
```

---

### 8. Child Rows Lack Individual Labels

**Location:** `src/components/ChildRow.tsx`

**Issue:**
- Each child's care inputs are not clearly labeled
- Screen reader users hear "text field" without knowing which child
- No indication of child index (Child 1, Child 2, etc.)

**Recommendation:**
Add child index to accessibility labels:
```tsx
<TextInput
  accessibilityLabel={`Child ${index + 1}, care nights for Parent A`}
  accessibilityHint="Number of nights per week, fortnight, or year"
  {...(isWeb && {
    'aria-label': `Child ${index + 1}, care nights for Parent A`
  })}
/>
```

---

## Medium Priority Issues (🟢)

### 9. Insufficient Color Contrast

**Issue:**
- Some text colors may not meet WCAG AA contrast ratio (4.5:1 for normal text)
- Medium grey text (#718096) on white background = 4.54:1 (borderline)

**Affected Elements:**
- Switch labels: `color: "#718096"` (line 984)
- Add child button: `color: "#718096"` (line 1004)
- Help tooltip trigger icons

**Recommendation:**
```tsx
switchLabelSmall: {
  fontSize: 12,
  color: "#64748b", // Darker grey for better contrast (6.3:1)
},
```

---

### 10. HelpTooltip Component Accessibility

**Location:** `src/components/HelpTooltip.tsx`

**Issue:**
- Tooltip trigger button needs accessible name
- Tooltip content should be announced when opened
- Missing keyboard support (open on Enter/Space)

**Recommendations:**
```tsx
<Pressable
  onPress={toggleTooltip}
  accessibilityRole="button"
  accessibilityLabel={`Help: ${header}`}
  accessibilityHint="Press to learn more"
  accessibilityExpanded={isOpen}
  {...(isWeb && {
    role: 'button' as any,
    'aria-label': `Help: ${header}`,
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
    tabIndex: 0,
    onKeyDown: (e: any) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTooltip();
      }
    }
  })}
>
  {/* Icon */}
</Pressable>
```

---

## Implementation Priority

### Phase 1 - Critical Fixes (Week 1)
1. ✅ Add accessibility labels to all form inputs
2. ✅ Add accessibility labels to all buttons
3. ✅ Fix modal accessibility properties
4. ✅ Associate error messages with inputs

### Phase 2 - High Priority (Week 2)
5. ✅ Implement keyboard navigation
6. ✅ Add visible focus indicators
7. ✅ Add semantic landmarks
8. ✅ Fix child row labels

### Phase 3 - Medium Priority (Week 3)
9. ✅ Improve color contrast
10. ✅ Enhance tooltip accessibility
11. ✅ Add skip-to-content link

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
**Critical:** 5
**High:** 3
**Medium:** 2

**Estimated Effort:** 2-3 weeks for full compliance

**Impact:** Implementing these fixes will make the calculator accessible to ~15% of users who rely on assistive technologies, improve SEO, and ensure legal compliance with accessibility standards.
