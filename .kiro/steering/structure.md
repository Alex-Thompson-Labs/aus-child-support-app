# Project Structure & Architecture

## File Organization

### `/src` - Source Code
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Accordion, DatePicker, etc.)
│   ├── calculator/      # Calculator-specific components
│   ├── breakdown/       # Results breakdown components
│   ├── results/         # Results display components
│   └── seo/             # SEO-related components
├── features/            # Feature-based modules
│   └── lawyer-inquiry/  # Lead capture feature
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       └── types.ts     # Feature types
├── screens/             # Screen-level components
├── hooks/               # Custom React hooks
├── utils/               # Business logic and utilities
└── theme.ts             # Design system constants
```

### `/app` - Expo Router Pages
```
app/
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx      # Tab layout configuration
│   └── index.tsx        # Home/calculator screen
├── admin/               # Admin panel routes
│   ├── dashboard.tsx    # Leads management
│   ├── login.tsx        # Admin authentication
│   └── lead/[id].tsx    # Individual lead details
├── _layout.tsx          # Root layout
├── lawyer-inquiry.tsx   # Lead capture form
└── modal.tsx            # Generic modal wrapper
```

### `/docs` - Documentation
```
docs/
├── DESIGN_SYSTEM.md     # UI patterns and architecture
├── CLAUDE.md            # AI development guidance
├── PROJECT_KNOWLEDGE_BASE.md
├── accessibility_performance/  # Performance docs
└── business-docs/       # Business model and strategy
```

## Architecture Patterns

### Component Hierarchy
- **Screens** - Top-level route components
- **Features** - Self-contained business logic modules
- **Components** - Reusable UI building blocks
- **UI Components** - Base design system elements

### State Management
- **useCalculator hook** - Central calculator state and logic
- **Local component state** - UI-specific state (modals, forms)
- **Supabase** - Server state for leads and admin data

### Business Logic Organization
```
src/utils/
├── calculator.ts                    # Core calculation engine
├── child-support-calculations.ts    # 8-step formula implementation
├── child-support-constants.ts       # Government rates by year
├── cost-of-children-tables.ts      # Official cost tables
├── complexity-detection.ts         # Lead qualification logic
├── zero-payment-detection.ts       # Edge case handling
├── analytics.ts                    # User behavior tracking
└── supabase.ts                     # Database operations
```

### Styling Conventions
- **StyleSheet.create()** - React Native styling
- **Responsive utilities** - Platform-specific adaptations
- **Shadow presets** - Cross-platform shadow system
- **Theme constants** - Centralized color/spacing system

### Cross-Platform Considerations
- **Platform detection** - `isWeb`, `isMobile`, `isDesktop` utilities
- **Conditional rendering** - Platform-specific UI variants
- **Web-specific styles** - `webClickableStyles`, `webInputStyles`
- **Responsive layouts** - Mobile-first with desktop adaptations

## Naming Conventions

### Files
- **PascalCase** for components: `CalculatorForm.tsx`
- **camelCase** for utilities: `calculator.ts`
- **kebab-case** for routes: `lawyer-inquiry.tsx`

### Components
- **Descriptive names**: `SmartConversionFooter` not `Footer`
- **Feature prefixes**: `LawyerInquiryScreen`, `CalculatorResults`
- **UI suffix for base components**: `DatePickerField`, `LoadingFallback`

### Functions
- **Verb-noun pattern**: `calculateChildSupport`, `detectComplexity`
- **Handler prefix**: `handleIncomeChange`, `handleFormSubmit`
- **Boolean prefix**: `isHighValue`, `hasComplexity`

## Import Organization
```typescript
// 1. React and React Native
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { useRouter } from 'expo-router';

// 3. Internal utilities and hooks
import { useCalculator } from '../hooks/useCalculator';
import { calculateChildSupport } from '../utils/calculator';

// 4. Internal components (relative imports)
import { CalculatorForm } from '../components/CalculatorForm';
```

## Error Handling Patterns
- **Try-catch blocks** for async operations
- **Graceful degradation** for non-critical features
- **User-friendly error messages** instead of technical details
- **Loading states** during async operations
- **Form validation** with real-time feedback

## Testing Strategy
- **Component testing** with React Native Testing Library
- **Business logic testing** for calculation utilities
- **Cross-platform testing** on iOS, Android, and web
- **Manual testing** for lead generation flow

## Performance Considerations
- **Debounced calculations** (300ms) for live updates
- **Lazy loading** for non-critical components
- **Image optimization** with WebP format
- **Bundle analysis** for web builds
- **Native driver animations** where possible