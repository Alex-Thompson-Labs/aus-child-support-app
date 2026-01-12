# Project Structure

## Directory Layout

```
/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.tsx         # Root layout with theme provider
│   ├── +html.tsx           # HTML wrapper for web (SEO meta tags)
│   ├── (tabs)/             # Tab navigation group
│   │   └── index.tsx       # Home → CalculatorScreen
│   ├── admin/              # Admin panel (web-optimized)
│   │   ├── login.tsx       # Authentication
│   │   ├── dashboard.tsx   # Lead management
│   │   ├── lead/[id].tsx   # Lead detail (internal)
│   │   └── view-lead/[token].tsx  # Secure lawyer view
│   ├── lawyer-inquiry.tsx  # Lead capture form
│   ├── special-circumstances.tsx  # Direct entry from blog
│   ├── blog/               # Blog routes (external content)
│   └── partner/[slug].tsx  # Partner landing pages
│
├── src/                    # Domain logic (platform-agnostic)
│   ├── components/         # React components
│   │   ├── Calculator*.tsx # Form, Results, Summary
│   │   ├── Smart*.tsx      # Conversion components
│   │   ├── breakdown/      # Results breakdown cards
│   │   ├── results/        # Results display components
│   │   ├── seo/            # SEO components (PageSEO, NoIndex)
│   │   └── ui/             # Generic UI (Accordion, Breadcrumb, etc.)
│   ├── features/           # Feature modules
│   │   └── lawyer-inquiry/ # Inquiry form feature
│   │       ├── components/ # Section components
│   │       ├── hooks/      # Form hooks
│   │       └── types.ts    # Feature types
│   ├── screens/            # Screen components
│   │   └── CalculatorScreen.tsx
│   ├── pages/              # Page-level components
│   │   └── admin/          # Admin page components
│   ├── hooks/              # Shared hooks
│   │   └── useCalculator.ts  # Main calculation orchestration
│   ├── utils/              # Business logic
│   │   ├── child-support-*.ts  # Core formula implementation
│   │   ├── complexity-detection.ts  # Lead qualification
│   │   ├── special-circumstances.ts # CoA reasons database
│   │   ├── supabase.ts     # Database client
│   │   └── analytics.ts    # GA + Vercel tracking
│   └── config/             # Configuration
│       └── partners.ts     # Partner definitions
│
├── constants/              # App-wide constants
│   └── theme.ts            # Colors, fonts
│
├── components/             # Expo template components (legacy)
├── hooks/                  # Expo template hooks (legacy)
│
├── docs/                   # Documentation (tracked in git)
│   ├── CLAUDE.md           # AI assistant guidance
│   ├── DESIGN_SYSTEM.md    # UI patterns & formulas
│   └── business-docs/      # Strategy & roadmap
│
├── supabase/               # Database
│   ├── functions/          # Edge functions
│   └── migrations/         # Schema migrations
│
├── public/                 # Static assets (web)
├── assets/                 # App assets (images)
└── scripts/                # Build scripts
```

## Key Patterns

### Routing
- File-based via Expo Router in `app/`
- Dynamic routes: `[id].tsx`, `[slug].tsx`, `[token].tsx`
- Route groups: `(tabs)/` for tab navigation

### Feature Organization
- Self-contained features in `src/features/`
- Each feature has: components, hooks, types, config

### Business Logic
- Calculation formulas in `src/utils/child-support-*.ts`
- Year-specific constants in `src/utils/year-config.ts`
- Complexity detection in `src/utils/complexity-detection.ts`

### External Traffic Entry Points
```
/lawyer-inquiry?mode=direct              # Skip calculator
/lawyer-inquiry?mode=direct&reason=X     # Pre-select reason
/special-circumstances                   # Factor selection first
```

### What's NOT in Git
- `/business-docs/` - Lawyer partnerships, invoices
- `/data/` - Email lists, analytics exports
- `.env*` - Environment variables
- `dist/`, `/ios`, `/android` - Build outputs
