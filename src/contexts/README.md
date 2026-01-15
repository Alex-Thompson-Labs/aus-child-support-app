# Contexts

Global application contexts for cross-cutting concerns.

## Available Contexts

### ABTestingContext

**Purpose**: Centralized A/B testing variant management

**Location**: `src/contexts/ABTestingContext.tsx`

**Usage**:
```tsx
import { useABTesting } from '@/src/contexts';

function MyComponent() {
  const { conversionFooterVariant } = useABTesting();
  
  return <div>Variant: {conversionFooterVariant}</div>;
}
```

**Features**:
- Global variant assignment at app startup
- Type-safe variant access
- No async operations in components
- Consistent variants across all components

**Documentation**: See `docs/refactors/ab-testing-context-provider.md`

## Adding New Contexts

When adding a new context:

1. Create the context file in `src/contexts/`
2. Export from `src/contexts/index.ts`
3. Add provider to `app/_layout.tsx`
4. Document in this README
5. Create usage examples

## Best Practices

1. **Keep contexts focused**: Each context should have a single responsibility
2. **Avoid over-nesting**: Limit provider nesting depth for performance
3. **Type safety**: Always define TypeScript interfaces for context values
4. **Error handling**: Throw clear errors when hooks are used outside providers
5. **Documentation**: Document all contexts and their usage patterns
