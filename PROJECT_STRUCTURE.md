# Project Structure

Clean, organized file structure for easy navigation.

```
csc/
│
├── README.md                    # Project overview
├── BUSINESS_MODEL_CANVAS.md     # Business model canvas
├── KEY_PERSONAS.md              # User personas
├── NAVIGATION.md                # App navigation structure
├── package.json                 # Dependencies & scripts
│
├── guides/                      # 📖 Active Implementation Guides
│   └── active/
│       ├── TASK_3_PHASE_4_HANDOVER.md
│       └── TESTING_CHECKLIST.md
│
├── docs/                        # 📚 Documentation Hub
│   ├── README.md                # Documentation navigation
│   ├── BUSINESS_MODEL.md        # Business model details
│   ├── CLAUDE.md                # Architecture & AI guidance
│   ├── DESIGN_SYSTEM.md         # Design patterns & colors
│   │
│   ├── guides/                  # Historical & active guides
│   │   ├── README.md
│   │   ├── active/              # Current guides
│   │   │   ├── LEAD_HANDOVER.md
│   │   │   ├── REMAINING_TASKS.md
│   │   │   └── WEB_DEPLOYMENT_GUIDE.md
│   │   └── old/                 # Archived phase guides
│   │       ├── phase1/
│   │       ├── phase2/
│   │       └── ...
│   │
│   └── templates/               # Email & document templates
│       ├── README.md
│       ├── EMAIL_COLD_OUTREACH.md
│       ├── EMAIL_LEAD_FORWARDING.md
│       ├── EMAIL_WEEKLY_CHECKIN.md
│       ├── LAWYER_PARTNERSHIP_AGREEMENT.md
│       └── ...
│
├── src/                         # 💻 Application Source Code
│   ├── components/              # Feature components
│   │   ├── CalculatorForm.tsx
│   │   ├── CalculatorResults.tsx
│   │   ├── ChangeOfAssessmentPrompt.tsx
│   │   ├── ChildRow.tsx
│   │   ├── HelpTooltip.tsx
│   │   ├── LawyerAlert.tsx
│   │   ├── PeriodPicker.tsx
│   │   ├── ResultsSimpleExplanation.tsx
│   │   └── WebInquiryPanel.tsx
│   │
│   ├── screens/                 # Screen components
│   │   ├── CalculatorScreen.tsx
│   │   ├── LawyerInquiryScreen.tsx
│   │   └── __tests__/
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useCalculator.ts
│   │
│   ├── utils/                   # Business logic & utilities
│   │   ├── analytics.ts
│   │   ├── change-of-assessment-reasons.ts
│   │   ├── child-support-calculations.ts
│   │   ├── child-support-constants.ts
│   │   ├── complexity-detection.ts
│   │   ├── cost-of-children-tables.ts
│   │   ├── date-utils.ts
│   │   ├── responsive.ts
│   │   ├── supabase.ts
│   │   ├── zero-payment-detection.ts
│   │   └── __tests__/
│   │
│   └── types/                   # TypeScript types
│       └── calculator.ts
│
├── app/                         # 🧭 Expo Router (file-based routing)
│   ├── _layout.tsx
│   ├── (tabs)/                  # Tab navigation
│   │   ├── index.tsx            # Calculator tab
│   │   └── explore.tsx
│   ├── admin/                   # Admin portal
│   │   ├── dashboard.tsx
│   │   ├── login.tsx
│   │   └── lead/[id].tsx
│   ├── lawyer-inquiry.tsx       # Lawyer inquiry form
│   └── modal.tsx
│
├── components/                  # 🎨 Shared UI Components
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── parallax-scroll-view.tsx
│   └── ui/                      # UI primitives
│
├── hooks/                       # 🪝 Global Hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── constants/                   # 🎨 App Constants
│   └── theme.ts
│
├── assets/                      # 🖼️ Static Assets
│   └── images/
│
├── data/                        # 📊 Data Files
│   └── family_law_contacts_full.csv
│
├── dist/                        # 🌐 Web Build Output
│   ├── index.html
│   ├── admin/
│   └── ...
│
└── scripts/                     # 🔧 Utility Scripts
    └── reset-project.js
```

---

## 📂 Folder Purposes

### `/guides` - Current Active Guides
- Active implementation guides for current work
- Testing checklists and handover documentation

### `/docs` - Documentation Hub
- **Strategic documentation** (BUSINESS_MODEL, CLAUDE, DESIGN_SYSTEM)
- **Historical guides** (`docs/guides/old/` for completed phases)
- **Active guides** (`docs/guides/active/` for current projects)
- **Templates** for emails and agreements

### `/src` - Application Code
- All business logic and React Native components
- Clean separation: components, screens, hooks, utils, types
- Includes test files alongside source code

### `/app` - Expo Router Navigation
- File-based routing structure
- Tab navigation, admin portal, modals
- Maps directly to app URLs

### `/components` - Shared UI
- Reusable themed components
- UI primitives and common patterns

### Root Level Files
- Project documentation (README, business model, personas)
- Configuration files (package.json, tsconfig.json)

---

## 🎯 Quick Navigation

**Need to understand current tasks?**
→ `guides/active/REMAINING_TASKS.md`
→ `docs/guides/active/LEAD_HANDOVER.md`

**Ready to deploy web version?**
→ `docs/guides/active/WEB_DEPLOYMENT_GUIDE.md`

**Testing before launch?**
→ `guides/active/TESTING_CHECKLIST.md`

**Understanding the business model?**
→ `BUSINESS_MODEL_CANVAS.md`
→ `docs/BUSINESS_MODEL.md`

**Checking design patterns?**
→ `docs/DESIGN_SYSTEM.md`

**Need email templates?**
→ `docs/templates/`

**Architecture guidance?**
→ `docs/CLAUDE.md`

**New to the codebase?**
→ `README.md` → `docs/CLAUDE.md` → `docs/guides/active/`

---

## 🏗️ Key Architectural Patterns

### Expo Router Navigation
File-based routing in `/app` directory:
- `(tabs)/` - Tab navigation structure
- `admin/` - Admin portal routes
- Dynamic routes like `[id].tsx`

### Component Organization
- **Feature components** in `/src/components` (calculator-specific)
- **Shared UI** in `/components` (theme-aware, reusable)
- **Screens** in `/src/screens` (full screen views)

### Business Logic
All calculation logic, constants, and utilities in `/src/utils`:
- Child support calculations
- Complexity detection
- Change of Assessment reasoning
- Analytics and Supabase integration

---

## 🌐 Web Deployment

The `/dist` directory contains the static web build:
- Fully functional web version of the app
- Admin portal accessible at `/admin`
- Ready for deployment to static hosting (Netlify, Vercel, etc.)

See `docs/guides/active/WEB_DEPLOYMENT_GUIDE.md` for deployment instructions.
