# Accessibility Implementation Examples

**Last Updated:** 2025-01-27

This guide shows the actual accessibility patterns used in this codebase. The codebase uses React Native's built-in accessibility props and manual ARIA attributes where needed for web compatibility.

---

## Example: Accessible Form Input

### Before (Inaccessible)

```tsx
<TextInput
  style={styles.input}
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
/>;
{
  errors.name && <Text style={styles.error}>{errors.name}</Text>;
}
```

**Problems:**

- No accessibility label
- Error not associated with input
- No ARIA attributes for web
- Screen reader announces "text field" with no context

---

### After (Accessible - Current Pattern)

```tsx
import { isWeb, webInputStyles } from '@/src/utils/responsive';

<TextInput
  style={[
    styles.input,
    errors.name && styles.inputError,
    isWeb && webInputStyles,
  ]}
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
  accessibilityLabel="Full name"
  accessibilityHint="Enter your first and last name"
  {...(isWeb && {
    'aria-label': 'Full name',
    'aria-invalid': !!errors.name,
    'aria-describedby': errors.name ? 'error-name' : undefined,
  })}
/>;
{
  errors.name && (
    <Text
      style={styles.error}
      {...(isWeb && { id: 'error-name', role: 'alert' })}
      accessibilityRole="alert"
    >
      {errors.name}
    </Text>
  );
}
```

**Result:**

- Screen reader announces: "Full name, text field, Enter your first and last name"
- When error exists: "Full name, invalid, Name is required"
- Error is properly associated via `aria-describedby`
- Focus styles applied via `webInputStyles`

**Reference:** See `src/components/ui/DatePickerField.tsx` (lines 131-139) for a working example with error associations.

---

## Example: Accessible Button

### Before

```tsx
<Pressable onPress={handleSubmit} style={styles.button}>
  <Text style={styles.buttonText}>Submit</Text>
</Pressable>
```

---

### After (Current Pattern)

```tsx
import { isWeb, webClickableStyles } from '@/src/utils/responsive';

<Pressable
  onPress={handleSubmit}
  style={[styles.button, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel="Submit inquiry form"
  accessibilityHint="Send your information to family lawyers"
>
  <Text style={styles.buttonText}>Submit</Text>
</Pressable>;
```

**Result:**

- Screen reader announces: "Submit inquiry form, button, Send your information to family lawyers"
- Keyboard accessible with Enter/Space (React Native default)
- Visible focus ring via `webClickableStyles` (uses `webFocusStyles` from `responsive.ts`)
- Disabled state can be added: `accessibilityState={{ disabled: isSubmitting }}`

**Reference:** See `src/components/CalculatorForm.tsx` (lines 894-900) for examples of accessible buttons.

---

## Example: Accessible Switch

### Before

```tsx
<Switch
  value={supportA}
  onValueChange={setSupportA}
/>
<Text>Inc. support</Text>
```

---

### After (Current Pattern - Using BrandSwitch)

```tsx
import { BrandSwitch } from '@/components/ui/BrandSwitch';

<BrandSwitch
  value={supportA}
  onValueChange={setSupportA}
  accessibilityLabel="Parent A receives income support"
  accessibilityHint="Toggle if Parent A receives income support payments"
/>
<Text>Inc. support</Text>
```

**Result:**

- Screen reader announces: "Parent A receives income support, switch, on" (or "off")
- State changes are announced
- Web version includes `aria-checked` and `aria-label` (handled by BrandSwitch component)
- Keyboard accessible

**Note:** The `BrandSwitch` component handles ARIA attributes internally. See `src/components/ui/BrandSwitch.tsx` (lines 65-80) for implementation.

**Reference:** See `src/components/CalculatorForm.tsx` (lines 763-771) for usage.

---

## Example: Accessible Modal

### Before

```tsx
<Modal
  visible={isOpen}
  transparent
  animationType="fade"
  onRequestClose={handleClose}
>
  <View style={styles.modalContent}>
    <Text style={styles.title}>Relevant Dependents</Text>
    {/* Content */}
  </View>
</Modal>
```

---

### After (Recommended Pattern - Not Yet Fully Implemented)

```tsx
import { isWeb } from '@/src/utils/responsive';

<Modal
  visible={isOpen}
  transparent
  animationType="fade"
  onRequestClose={handleClose}
  accessibilityViewIsModal={true}
  {...(isWeb && {
    role: 'dialog' as any,
    'aria-modal': 'true',
    'aria-labelledby': 'modal-dependents-title',
  })}
>
  <View style={styles.modalContent}>
    <Text style={styles.title} {...(isWeb && { id: 'modal-dependents-title' })}>
      Relevant Dependents
    </Text>
    {/* Content */}
  </View>
</Modal>;
```

**Status:** ⚠️ This pattern is recommended but not yet implemented in `HelpTooltip.tsx`. See `docs/ACCESSIBILITY_AUDIT.md` issue #4.

---

## Example: Semantic Regions (Not Yet Implemented)

### Current State

```tsx
<View style={styles.container}>
  <CalculatorForm {...props} />
</View>
```

---

### Recommended Pattern (To Be Implemented)

```tsx
import { isWeb } from '@/src/utils/responsive';

<View
  style={styles.container}
  {...(isWeb && {
    role: 'main' as any,
    'aria-label': 'Child Support Calculator',
  })}
>
  <View
    {...(isWeb && {
      role: 'form' as any,
      'aria-label': 'Child support calculation form',
    })}
  >
    <CalculatorForm {...props} />
  </View>
</View>;
```

**Status:** ❌ Not implemented. Semantic landmarks are still needed. See `docs/ACCESSIBILITY_AUDIT.md` issue #7.

---

## Example: Expandable/Collapsible Element

### Current Pattern (RelevantDependentsPopover)

```tsx
import { isWeb, webClickableStyles } from '@/src/utils/responsive';

<Pressable
  onPress={handleToggle}
  style={[styles.button, isWeb && webClickableStyles]}
  accessibilityRole="button"
  accessibilityLabel={isOpen ? 'Relevant Dependents: expanded' : 'Relevant Dependents: collapsed'}
  accessibilityHint="Tap to add dependent children from other relationships"
  {...(isWeb && {
    'aria-expanded': isOpen,
    'aria-controls': 'dependents-panel',
  })}
>
  <Text>Relevant Dependents {isOpen ? '−' : '+'}</Text>
</Pressable>

<View {...(isWeb && { id: 'dependents-panel' })}>
  {/* Expandable content */}
</View>
```

**Note:** The `RelevantDependentsPopover` doesn't use a Modal - it's a custom drawer implementation, so this pattern applies differently.

**Reference:** See `src/components/CalculatorForm.tsx` (lines 180-199) for the trigger button implementation.

---

## Complete Form Example (Current State)

Here's how accessibility is currently implemented in `CalculatorForm.tsx`:

```tsx
import { isWeb, webInputStyles, webClickableStyles } from '@/src/utils/responsive';

export function CalculatorForm({ incomeA, errors, ... }) {
  return (
    <ScrollView style={styles.container}>
      {/* Income Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Parent A - Adjusted Taxable Income</Text>
        <TextInput
          style={[
            styles.currencyInput,
            errors.incomeA && styles.inputError,
            isWeb && webInputStyles,
          ]}
          value={incomeA ? incomeA.toString() : ''}
          onChangeText={handleIncomeAChange}
          keyboardType="numeric"
          placeholder="0"
          accessibilityLabel="Parent A adjusted taxable income"
          accessibilityHint="Enter Parent A's annual income in dollars"
          // ⚠️ TODO: Add aria-invalid and aria-describedby for errors
        />
        {errors.incomeA && (
          <Text style={styles.errorText}>
            {/* ⚠️ TODO: Add id and role="alert" */}
            {errors.incomeA}
          </Text>
        )}
      </View>

      {/* Switch */}
      <BrandSwitch
        value={supportA}
        onValueChange={onSupportAChange}
        accessibilityLabel="Parent A receives income support"
        accessibilityHint="Toggle if Parent A receives income support payments"
      />

      {/* Button */}
      <Pressable
        onPress={onCalculate}
        style={[styles.calculateButton, isWeb && webClickableStyles]}
        accessibilityRole="button"
        accessibilityLabel="Calculate child support"
      >
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </Pressable>
    </ScrollView>
  );
}
```

**Known Issues:**

- ⚠️ Error messages not associated with inputs (missing `aria-describedby` and `aria-invalid`)
- ⚠️ See `docs/ACCESSIBILITY_AUDIT.md` for full list of remaining issues

---

## Focus Styles

Focus styles are implemented via CSS pseudo-classes in `src/utils/responsive.ts`:

```tsx
export const webFocusStyles: any = isWeb
  ? {
      ':focus': {
        outlineWidth: '3px',
        outlineStyle: 'solid',
        outlineColor: 'rgba(59, 130, 246, 0.5)',
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

These are applied via `webInputStyles` and `webClickableStyles` which include focus styles.

---

## Testing Your Changes

### Manual Testing with Screen Readers

**macOS (VoiceOver):**

```bash
# Turn on VoiceOver
Cmd + F5

# Navigate with:
- VO + Right Arrow (next item)
- VO + Left Arrow (previous item)
- VO + Space (activate)
```

**Windows (NVDA):**

1. Download NVDA from https://www.nvaccess.org
2. Install and launch
3. Navigate with Tab key
4. Press Enter to activate

### Automated Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Build and serve
npm run build:web
npm run serve:dist

# Run accessibility audit
lighthouse http://localhost:8080 --only-categories=accessibility --view
```

### Browser DevTools

**Chrome DevTools:**

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Click "Generate report"

**axe DevTools:**

1. Install extension from Chrome Web Store
2. Open DevTools → axe tab
3. Click "Scan ALL of my page"
4. Fix all Critical and Serious issues

---

## Current Implementation Status

**✅ Implemented:**

- Form input accessibility labels
- Button accessibility labels
- Switch accessibility (via BrandSwitch component)
- Focus styles for keyboard navigation
- Child row labels with indices

**⚠️ Partially Implemented:**

- Error message associations (DatePickerField has it, CalculatorForm doesn't)
- Modal accessibility properties (HelpTooltip Modal missing properties)
- Tooltip accessibility (missing expanded state, keyboard support)

**❌ Not Implemented:**

- Semantic landmarks (main, form, nav)
- Skip-to-content link
- Explicit web ARIA attributes on all inputs (may work via RN Web translation)

---

## Common Patterns Reference

| Element Type    | Current Pattern                                    | Status            |
| --------------- | -------------------------------------------------- | ----------------- |
| Text Input      | `accessibilityLabel`, manual `aria-*` for web      | ✅ Working        |
| Button          | `accessibilityRole="button"`, `accessibilityLabel` | ✅ Working        |
| Switch/Toggle   | `BrandSwitch` component handles ARIA               | ✅ Working        |
| Modal/Dialog    | `accessibilityViewIsModal`, manual `aria-*`        | ⚠️ Partially done |
| Error Message   | Manual `id`, `role="alert"`, `aria-describedby`    | ⚠️ Needs work     |
| Expandable      | `accessibilityLabel`, manual `aria-expanded`       | ✅ Working        |
| Semantic Region | Manual `role` and `aria-label` props               | ❌ Not done       |

---

## Key Files

- `src/components/CalculatorForm.tsx` - Main form implementation
- `src/components/ui/BrandSwitch.tsx` - Switch with ARIA support
- `src/components/ui/DatePickerField.tsx` - Example with error associations
- `src/utils/responsive.ts` - Focus styles (`webFocusStyles`)
- `docs/ACCESSIBILITY_AUDIT.md` - Full audit with current status

---

## Next Steps

1. ⚠️ Add error message associations to CalculatorForm inputs
2. ⚠️ Add accessibility properties to HelpTooltip Modal
3. ❌ Implement semantic landmarks
4. ❌ Add skip-to-content link
5. ✅ Test with screen readers
6. ✅ Run automated audits

---

## Questions?

Refer to:

- `docs/ACCESSIBILITY_AUDIT.md` for full audit report with current status
- `src/components/ui/DatePickerField.tsx` for error association example
- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
