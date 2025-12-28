# Accessibility Implementation Example

This guide shows how to apply accessibility fixes using the utilities in `src/utils/accessibility.ts`.

## Example: Accessible Form Input

### Before (Inaccessible)

```tsx
<TextInput
  style={styles.input}
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
/>
{errors.name && (
  <Text style={styles.error}>{errors.name}</Text>
)}
```

**Problems:**
- No accessibility label
- Error not associated with input
- No ARIA attributes for web
- Screen reader announces "text field" with no context

---

### After (Accessible)

```tsx
import { getTextInputA11yProps, getErrorA11yProps } from '@/src/utils/accessibility';

<TextInput
  style={[styles.input, errors.name && styles.inputError]}
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
  {...getTextInputA11yProps({
    label: 'Full name',
    hint: 'Enter your first and last name',
    error: errors.name,
    errorId: 'error-name',
  })}
/>
{errors.name && (
  <Text
    style={styles.error}
    {...getErrorA11yProps({ id: 'error-name' })}
  >
    {errors.name}
  </Text>
)}
```

**Result:**
- Screen reader announces: "Full name, text field, Enter your first and last name"
- When error exists: "Full name, invalid, Name is required"
- Error is properly associated via `aria-describedby`

---

## Example: Accessible Button

### Before

```tsx
<Pressable onPress={handleSubmit} style={styles.button}>
  <Text style={styles.buttonText}>Submit</Text>
</Pressable>
```

---

### After

```tsx
import { getButtonA11yProps, getFocusRingHandlers } from '@/src/utils/accessibility';

<Pressable
  onPress={handleSubmit}
  style={styles.button}
  {...getButtonA11yProps({
    label: 'Submit inquiry form',
    hint: 'Send your information to family lawyers',
    disabled: isSubmitting,
  })}
  {...getFocusRingHandlers()}
>
  <Text style={styles.buttonText}>Submit</Text>
</Pressable>
```

**Result:**
- Screen reader announces: "Submit inquiry form, button, Send your information to family lawyers"
- Keyboard accessible with Enter/Space
- Visible focus ring when tabbed to
- Disabled state properly announced

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

### After

```tsx
import { getSwitchA11yProps } from '@/src/utils/accessibility';

<Switch
  value={supportA}
  onValueChange={setSupportA}
  {...getSwitchA11yProps({
    label: 'Parent A receives income support',
    checked: supportA,
  })}
/>
<Text>Inc. support</Text>
```

**Result:**
- Screen reader announces: "Parent A receives income support, switch, on" (or "off")
- State changes are announced
- Keyboard accessible

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

### After

```tsx
import { getModalA11yProps } from '@/src/utils/accessibility';

<Modal
  visible={isOpen}
  transparent
  animationType="fade"
  onRequestClose={handleClose}
  {...getModalA11yProps({
    titleId: 'modal-dependents-title',
    descriptionId: 'modal-dependents-desc',
  })}
>
  <View style={styles.modalContent}>
    <Text
      style={styles.title}
      {...(isWeb && { id: 'modal-dependents-title' })}
    >
      Relevant Dependents
    </Text>
    <Text
      style={styles.description}
      {...(isWeb && { id: 'modal-dependents-desc' })}
    >
      Enter children from other relationships
    </Text>
    {/* Content */}
  </View>
</Modal>
```

**Result:**
- Screen reader announces modal role
- Modal title is properly associated
- Focus management (users know they're in a dialog)

---

## Example: Semantic Regions

### Before

```tsx
<View style={styles.container}>
  <CalculatorForm {...props} />
</View>
```

---

### After

```tsx
import { getSemanticRegionProps } from '@/src/utils/accessibility';

<View
  style={styles.container}
  {...getSemanticRegionProps({
    role: 'main',
    label: 'Child Support Calculator',
  })}
>
  <CalculatorForm {...props} />
</View>
```

**Result:**
- Screen reader users can jump to main content
- Better page structure navigation

---

## Example: Expandable/Collapsible Element

### Before

```tsx
<Pressable onPress={() => setIsOpen(!isOpen)}>
  <Text>Relevant Dependents</Text>
</Pressable>
```

---

### After

```tsx
import { getExpandableA11yProps, getKeyboardHandlers } from '@/src/utils/accessibility';

<Pressable
  onPress={handleToggle}
  {...getExpandableA11yProps({
    label: 'Relevant Dependents',
    expanded: isOpen,
    controlsId: 'dependents-panel',
  })}
  {...getKeyboardHandlers(handleToggle)}
>
  <Text>Relevant Dependents {isOpen ? '−' : '+'}</Text>
</Pressable>

<View {...(isWeb && { id: 'dependents-panel' })}>
  {/* Expandable content */}
</View>
```

**Result:**
- Screen reader announces: "Relevant Dependents, button, expanded" (or "collapsed")
- Keyboard accessible with Enter/Space
- Controls relationship established

---

## Complete Form Example

Here's how to make the entire WebInquiryPanel form accessible:

```tsx
import {
  getTextInputA11yProps,
  getButtonA11yProps,
  getSwitchA11yProps,
  getErrorA11yProps,
  getSemanticRegionProps,
  getFocusRingHandlers,
  announceToScreenReader,
} from '@/src/utils/accessibility';

export function WebInquiryPanel({ ... }) {
  // ... existing code

  const handleSubmit = async () => {
    // ... validation

    if (Object.values(newErrors).some(Boolean)) {
      announceToScreenReader('Form has errors. Please correct the highlighted fields.', 'polite');
      return;
    }

    // ... submit logic

    if (success) {
      announceToScreenReader('Your inquiry has been submitted successfully!', 'polite');
    }
  };

  return (
    <ScrollView
      {...getSemanticRegionProps({ role: 'form', label: 'Legal inquiry form' })}
    >
      {/* Name Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="John Smith"
          {...getTextInputA11yProps({
            label: 'Full name',
            hint: 'Enter your first and last name',
            error: errors.name,
            errorId: 'error-name',
          })}
        />
        {errors.name && (
          <Text
            style={styles.error}
            {...getErrorA11yProps({ id: 'error-name' })}
          >
            {errors.name}
          </Text>
        )}
      </View>

      {/* Email Field */}
      <View style={styles.field}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          {...getTextInputA11yProps({
            label: 'Email address',
            hint: 'Enter a valid email address',
            error: errors.email,
            errorId: 'error-email',
          })}
        />
        {errors.email && (
          <Text
            style={styles.error}
            {...getErrorA11yProps({ id: 'error-email' })}
          >
            {errors.email}
          </Text>
        )}
      </View>

      {/* Consent Checkbox */}
      <View style={styles.consentRow}>
        <Switch
          value={consent}
          onValueChange={setConsent}
          {...getSwitchA11yProps({
            label: 'I consent to being contacted by family lawyers',
            checked: consent,
          })}
        />
        <Text style={styles.consentText}>
          I consent to being contacted
        </Text>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        disabled={isSubmitting}
        {...getButtonA11yProps({
          label: 'Submit inquiry',
          hint: 'Send your information to family lawyers',
          disabled: isSubmitting,
        })}
        {...getFocusRingHandlers()}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
```

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

# Run accessibility audit
lighthouse https://localhost:8081 --only-categories=accessibility --view
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

## Common Patterns Cheat Sheet

| Element Type | Helper Function | Key Props |
|--------------|----------------|-----------|
| Text Input | `getTextInputA11yProps` | label, hint, error, errorId |
| Button | `getButtonA11yProps` | label, hint, disabled |
| Switch/Toggle | `getSwitchA11yProps` | label, checked, disabled |
| Modal/Dialog | `getModalA11yProps` | titleId, descriptionId |
| Error Message | `getErrorA11yProps` | id |
| Expandable | `getExpandableA11yProps` | label, expanded, controlsId |
| Semantic Region | `getSemanticRegionProps` | role, label |

---

## Next Steps

1. ✅ Apply accessibility fixes to `CalculatorForm.tsx`
2. ✅ Apply fixes to `WebInquiryPanel.tsx`
3. ✅ Apply fixes to `ChildRow.tsx`
4. ✅ Apply fixes to `HelpTooltip.tsx`
5. ✅ Test with screen readers
6. ✅ Run automated audits
7. ✅ Document accessibility in component README

---

## Questions?

Refer to:
- `docs/ACCESSIBILITY_AUDIT.md` for full audit report
- `src/utils/accessibility.ts` for utility documentation
- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
