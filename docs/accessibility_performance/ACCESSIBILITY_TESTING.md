# Accessibility Testing Guide

**Last Updated:** 2025-01-27

## Quick Start

This guide helps you test the Child Support Calculator's accessibility with screen readers and automated tools.

---

## 1. Screen Reader Testing

### macOS - VoiceOver (Safari)

**Enable VoiceOver:**

```
Cmd + F5
```

**Basic Navigation:**

- `VO + Right Arrow` - Next item
- `VO + Left Arrow` - Previous item
- `VO + Space` - Activate button/link
- `Tab` - Next interactive element
- `Shift + Tab` - Previous interactive element
- `Cmd + F5` - Turn off VoiceOver

**Test Checklist:**

- [ ] Navigate through entire calculator form
- [ ] Verify all inputs announce their labels
- [ ] Check error messages are announced
- [ ] Test modal accessibility
- [ ] Verify buttons announce their purpose
- [ ] Check switches announce on/off state

---

### Windows - NVDA (Chrome/Firefox)

**Download:** https://www.nvaccess.org/download/

**Enable NVDA:**

```
Ctrl + Alt + N (after installation)
```

**Basic Navigation:**

- `Down Arrow` - Next line
- `Up Arrow` - Previous line
- `Tab` - Next interactive element
- `Enter` - Activate
- `Insert + F7` - Elements list
- `Insert + Q` - Quit NVDA

**Browse Mode Commands:**

- `H` - Next heading
- `F` - Next form field
- `B` - Next button
- `E` - Next edit field

**Test Checklist:**

- [ ] Browse entire page in browse mode
- [ ] Navigate forms with F key
- [ ] Verify form errors are announced
- [ ] Test all interactive elements
- [ ] Check heading structure (H1, H2, etc.)

---

### iOS - VoiceOver (Safari)

**Enable VoiceOver:**

```
Settings → Accessibility → VoiceOver → On
```

**Basic Gestures:**

- Swipe Right - Next item
- Swipe Left - Previous item
- Double Tap - Activate
- Two-finger scrub - Go back

**Test Checklist:**

- [ ] Navigate calculator on mobile web
- [ ] Test form inputs
- [ ] Verify all buttons work
- [ ] Check modal accessibility

---

### Android - TalkBack (Chrome)

**Enable TalkBack:**

```
Settings → Accessibility → TalkBack → On
```

**Basic Gestures:**

- Swipe Right - Next item
- Swipe Left - Previous item
- Double Tap - Activate
- Two-finger swipe down - Read from top

---

## 2. Automated Testing Tools

### Lighthouse (Built into Chrome)

**Run Audit:**

1. Open Chrome DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"

**Target Score:** 95+

**Common Issues to Fix:**

- Missing ARIA labels
- Low color contrast
- Missing alt text
- Improper heading hierarchy

---

### axe DevTools Extension

**Install:**

- Chrome: https://chrome.google.com/webstore (search "axe DevTools")
- Firefox: https://addons.mozilla.org (search "axe DevTools")

**Run Scan:**

1. Open DevTools (F12)
2. Click "axe DevTools" tab
3. Click "Scan ALL of my page"

**Priority:**

1. Fix all "Critical" issues
2. Fix all "Serious" issues
3. Fix "Moderate" issues if time permits

---

### WAVE Browser Extension

**Install:**

- Chrome: https://chrome.google.com/webstore (search "WAVE")
- Firefox: https://addons.mozilla.org (search "WAVE")

**Run Evaluation:**

1. Click WAVE icon in browser toolbar
2. Review errors (red icons)
3. Review alerts (yellow icons)
4. Review features (green icons)

**Visual Indicators:**

- Red = Errors (must fix)
- Yellow = Alerts (review carefully)
- Green = Features (good practices)

---

## 3. Keyboard Navigation Testing

### Test All Interactive Elements

**Navigation:**

```
Tab       → Move to next interactive element
Shift+Tab → Move to previous interactive element
Enter     → Activate buttons, submit forms
Space     → Toggle checkboxes, activate buttons
Esc       → Close modals/dialogs
Arrow Keys → Navigate within components (pickers, sliders)
```

**Checklist:**

- [ ] Can tab through entire form in logical order
- [ ] All buttons activatable with Enter/Space
- [ ] Modals can be closed with Esc
- [ ] Focus indicator is visible (blue outline)
- [ ] No keyboard traps (can tab out of all elements)
- [ ] Skip to content link available (if applicable)

---

## 4. Visual Testing

### Color Contrast

**Tool:** https://webaim.org/resources/contrastchecker/

**WCAG AA Requirements:**

- Normal text (< 18pt): **4.5:1** contrast ratio
- Large text (≥ 18pt or bold ≥ 14pt): **3:1** contrast ratio

**Test:**

- [ ] Body text on background
- [ ] Button text on button background
- [ ] Link text on background
- [ ] Error messages
- [ ] Placeholder text

---

### Focus Indicators

**Check:**

- [ ] All interactive elements show visible focus ring
- [ ] Focus ring has sufficient contrast (3:1)
- [ ] Focus ring doesn't disappear on hover
- [ ] Custom components have focus styles

---

## 5. Common Test Scenarios

### Scenario 1: Complete Calculator Form

**Steps:**

1. Navigate to calculator
2. Enter Parent A income (keyboard only)
3. Tab to Parent B income
4. Add a child
5. Enter care nights
6. Submit calculation
7. Read results with screen reader

**Expected:**

- All fields announced with labels
- Errors announced when validation fails
- Results announced when calculation completes

---

### Scenario 2: Lawyer Inquiry Form

**Steps:**

1. Complete calculation
2. Click "Get Legal Help" button
3. Navigate to lawyer inquiry page (full-page route, not modal)
4. Fill out inquiry form (keyboard only)
5. Submit with validation errors
6. Correct errors
7. Submit successfully

**Expected:**

- Navigation to `/lawyer-inquiry` route (full page, not modal)
- All inputs have clear labels
- Errors announced immediately
- Success message announced
- Form accessible via keyboard navigation

**Note:** The lawyer inquiry form is implemented as a full-page route (`app/lawyer-inquiry.tsx`), not a modal component.

---

### Scenario 3: Help Tooltips

**Steps:**

1. Tab to help icon (?)
2. Activate with Enter or Space
3. Read tooltip content
4. Close with Esc or click outside

**Expected:**

- Icon has accessible label
- Tooltip content announced
- Keyboard accessible
- Focus returns to trigger

---

## 6. Automated Test Scripts

**Status:** ⚠️ Not yet implemented - Testing setup pending

**Note:** The codebase currently has no test files. The `package.json` test script returns "No tests yet - add jest for Phase 2". Testing libraries (`@testing-library/react-native`) are in dependencies but not configured.

### Example Test File Structure (To Be Created)

**Future test file:** `tests/accessibility.test.ts` (or `__tests__/accessibility.test.ts`)

```typescript
import { render } from '@testing-library/react-native';
import { CalculatorForm } from '@/src/components/CalculatorForm';

describe('Accessibility', () => {
  it('has accessible labels on income inputs', () => {
    const { getByLabelText } = render(<CalculatorForm {...props} />);

    // Actual labels as implemented in CalculatorForm.tsx (lines 186, 239)
    expect(getByLabelText('Parent A adjusted taxable income')).toBeTruthy();
    expect(getByLabelText('Parent B adjusted taxable income')).toBeTruthy();
  });

  it('has accessible buttons', () => {
    const { getByRole } = render(<CalculatorForm {...props} />);

    // Actual labels as implemented in CalculatorForm.tsx (lines 313, 321)
    expect(
      getByRole('button', { name: 'Calculate child support' })
    ).toBeTruthy();
    expect(
      getByRole('button', { name: 'Reset form to default values' })
    ).toBeTruthy();
  });

  it('announces errors to screen readers', () => {
    const { getByRole } = render(<CalculatorForm {...props} />);

    // Note: Error associations (aria-describedby, aria-invalid) need implementation first
    // See docs/ACCESSIBILITY_AUDIT.md issue #5
    // Currently errors are displayed but not associated with inputs
    // This test will fail until error associations are implemented

    // Trigger validation error
    // ...

    // expect(getByRole('alert')).toBeTruthy();
  });
});
```

**Current State:**

- ❌ No test files exist
- ⚠️ Testing libraries installed but not configured
- ⚠️ Jest configuration needed
- ⚠️ Some accessibility features (error associations) need implementation before testing

---

## 7. Quick Reference

### Accessibility Checklist

**Forms:**

- [ ] All inputs have labels
- [ ] Errors are announced
- [ ] Required fields marked
- [ ] Validation messages clear

**Navigation:**

- [ ] Keyboard accessible
- [ ] Logical tab order
- [ ] Skip links available
- [ ] Landmarks defined

**Content:**

- [ ] Headings hierarchy (H1 → H2 → H3)
- [ ] Alt text for images
- [ ] Color not sole indicator
- [ ] Sufficient contrast

**Interactive:**

- [ ] Buttons have labels
- [ ] Links descriptive
- [ ] Modals accessible
- [ ] Focus management

---

## 8. Resources

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WebAIM Screen Reader Guide](https://webaim.org/articles/screenreader_testing/)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Testing Services

- [Fable](https://makeitfable.com/) - Real users with disabilities
- [Accessibility Insights](https://accessibilityinsights.io/) - Microsoft tool

---

## Reporting Issues

When you find an accessibility issue:

1. **Document the issue:**

   - What element is affected?
   - What's the expected behavior?
   - What's the actual behavior?
   - Which assistive technology exposed it?

2. **Priority:**

   - **Critical:** Blocks core functionality
   - **High:** Significantly degrades experience
   - **Medium:** Minor improvement needed

3. **Create GitHub issue** with template:

````markdown
## Accessibility Issue

**Element:** [e.g., "Parent A income input"]
**Issue:** [e.g., "Missing accessibility label"]
**Expected:** [e.g., "Screen reader announces 'Parent A Adjusted Taxable Income'"]
**Actual:** [e.g., "Screen reader announces 'text field'"]
**AT Used:** [e.g., "NVDA on Windows, Chrome"]
**Priority:** [Critical/High/Medium]
**WCAG:** [e.g., "1.3.1 Info and Relationships"]

## Steps to Reproduce

1. ...
2. ...

## Suggested Fix

```tsx
// Code example
```
````

```

---

## Success Criteria

**Minimum Requirements:**
- ✅ Lighthouse Accessibility Score: 95+ (Target)
- ✅ axe DevTools: 0 Critical/Serious violations (Target)
- ✅ Keyboard navigation: 100% functional (Mostly complete - focus styles implemented)
- ⚠️ Screen reader: All core flows navigable (Partially complete - see audit for gaps)

**Current Status (as of 2025-01-27):**
- ✅ Most form inputs have accessibility labels
- ✅ Buttons have accessibility labels
- ✅ Focus styles implemented
- ⚠️ Error message associations incomplete (CalculatorForm needs work)
- ⚠️ Modal accessibility properties missing (HelpTooltip)
- ❌ Semantic landmarks not implemented
- ❌ Skip-to-content link not implemented

**Best Practice:**
- All WCAG 2.1 Level AA criteria met (Target)
- Tested with multiple screen readers (Recommended)
- Real user feedback from people with disabilities (Recommended)
- Regular accessibility audits (monthly) (Recommended)

**Reference:** See `docs/ACCESSIBILITY_AUDIT.md` for detailed current status and remaining work.
```
