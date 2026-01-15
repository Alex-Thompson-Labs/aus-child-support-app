# A/B Variant Refactor: AsyncStorage → Session-Based

## Summary
Refactored `src/features/conversion/components/SmartConversionFooter.tsx` to use a session-based approach for A/B variant assignment instead of persisting to AsyncStorage.

## Problem
The previous implementation stored the A/B variant in AsyncStorage, making it "sticky" to the device. This was problematic for lawyers using the app for multiple clients on the same device, as each client would see the same variant.

## Solution
Replaced the AsyncStorage implementation with a session-based approach using React's `useMemo` hook:

### Changes Made

1. **Removed AsyncStorage dependency**
   - Removed `import AsyncStorage from '@react-native-async-storage/async-storage'`
   - Eliminated all AsyncStorage read/write operations

2. **Simplified variant assignment**
   - Replaced `useState` + `useEffect` with AsyncStorage logic
   - Implemented simple `useMemo` hook for random variant assignment
   - Variant is assigned once per component mount (session)

### Before
```typescript
const [variantId, setVariantId] = React.useState<VariantId>('A');

React.useEffect(() => {
  const STORAGE_KEY = 'csc_ab_variant_footer';
  
  async function loadVariant() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'A' || stored === 'B') {
        setVariantId(stored as VariantId);
      } else {
        const newVariant = Math.random() < 0.5 ? 'A' : 'B';
        setVariantId(newVariant);
        await AsyncStorage.setItem(STORAGE_KEY, newVariant);
      }
    } catch (error) {
      console.warn('Failed to load A/B variant:', error);
    }
  }
  
  loadVariant();
}, []);
```

### After
```typescript
/**
 * Session-based A/B variant assignment
 * Randomly assigns 'A' or 'B' on component mount
 * Resets on each new session/refresh (not persisted to device)
 */
const variantId = useMemo<VariantId>(() => {
  return Math.random() < 0.5 ? 'A' : 'B';
}, []); // Empty dependency array ensures assignment happens once per mount
```

## Benefits

1. **No device persistence** - Each new session gets a fresh random variant
2. **Multi-client friendly** - Lawyers can use the app for different clients without sticky variants
3. **Simpler code** - Removed async logic and error handling
4. **Better UX** - Each calculator session is independent
5. **Maintains A/B testing** - Still provides 50/50 random distribution per session

## Behavior

- **On component mount**: Variant is randomly assigned (50/50 split)
- **During session**: Variant remains consistent for that component instance
- **On refresh/new session**: New random variant is assigned
- **No persistence**: Variant is never saved to device storage

## Testing Recommendations

1. Test that variant assignment works on component mount
2. Verify variant remains consistent during a single session
3. Confirm variant resets on page refresh
4. Test multi-client workflow (lawyer using app for different clients)
5. Verify analytics still track variant correctly

## Files Modified

- `src/features/conversion/components/SmartConversionFooter.tsx`
  - Removed AsyncStorage import
  - Replaced persistent variant logic with session-based assignment
  - Added documentation comments explaining the new approach
