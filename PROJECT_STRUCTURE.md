# Project Structure

Clean, organized file structure for easy navigation.

```
csc/
│
├── README.md                    # 👈 Start here - Project overview
├── .env.example                 # Environment variables template
├── .env                         # Your keys (DO NOT COMMIT)
├── package.json                 # Dependencies & scripts
│
├── guides/                      # 📖 Implementation Guides
│   ├── README.md                # Guide navigation
│   ├── TROUBLESHOOTING.md       # Common fixes (all phases)
│   └── phase1/                  # Current phase guides
│       ├── CHECKLIST.md         # 👈 Day-by-day tasks THIS WEEK
│       └── TESTING.md           # Pre-launch testing
│
├── docs/                        # 📚 Strategic Documentation
│   ├── README.md                # Docs navigation
│   ├── MASTER_PLAN.md           # Complete roadmap (all 4 phases)
│   ├── DESIGN_SYSTEM.md         # Design patterns & colors
│   ├── CLAUDE.md                # Architecture & AI guidance
│   └── CHANGELOG.md             # Change history
│
├── src/                         # 💻 Source Code
│   ├── components/              # React components
│   │   ├── CalculatorForm.tsx
│   │   ├── CalculatorResults.tsx
│   │   ├── LawyerAlert.tsx      # 👈 Stub (implement Day 1-2)
│   │   └── ...
│   ├── screens/                 # Screen components
│   │   ├── CalculatorScreen.tsx
│   │   └── LawyerInquiryScreen.tsx  # 👈 Stub (implement Day 3-4)
│   ├── hooks/                   # Custom hooks
│   │   └── useCalculator.ts
│   ├── utils/                   # Business logic
│   │   ├── analytics.ts         # 👈 Stub (implement Day 1-2)
│   │   ├── complexity-detection.ts  # 👈 Stub (implement Day 1-2)
│   │   └── ...
│   └── types/                   # TypeScript types
│       └── calculator.ts
│
├── app/                         # Expo Router (file-based routing)
├── assets/                      # Images, fonts
├── components/                  # Shared UI components
├── constants/                   # App constants
└── hooks/                       # Global hooks
```

---

## 📂 Folder Purposes

### `/guides` - How to Build
- **Phase-specific** implementation guides
- **TROUBLESHOOTING** for when things break
- **Practical, actionable** checklists

### `/docs` - Why & What
- **Strategic planning** (MASTER_PLAN)
- **Design decisions** (DESIGN_SYSTEM)
- **Architecture** (CLAUDE)
- **High-level reference**

### `/src` - The Code
- All application logic
- Clean separation: components, screens, hooks, utils, types
- Stub files marked with TODOs

---

## 🎯 Quick Navigation

**Starting Phase 1?**
→ `guides/phase1/CHECKLIST.md`

**Stuck on something?**
→ `guides/TROUBLESHOOTING.md`

**Need code reference?**
→ `docs/MASTER_PLAN.md` (Appendix A)

**Understanding the business model?**
→ `docs/MASTER_PLAN.md` (Executive Summary)

**Checking design patterns?**
→ `docs/DESIGN_SYSTEM.md`

**New to the codebase?**
→ `README.md` → `docs/CLAUDE.md` → `guides/phase1/CHECKLIST.md`

---

## ✨ Why This Structure?

**Before (cluttered root):**
```
csc/
├── PHASE1_CHECKLIST.md
├── TESTING_CHECKLIST.md
├── TROUBLESHOOTING.md
├── MASTER_PLAN.md
├── DESIGN_SYSTEM.md
├── README.md
└── ... 10+ other files 😵
```

**After (organized):**
```
csc/
├── README.md           # Entry point
├── guides/             # How-to guides
├── docs/               # Strategic docs
└── src/                # Code
✨ Clean, scannable, logical
```

**Benefits:**
- ✅ Easy to find what you need
- ✅ Scales as project grows (Phase 2, 3, 4 guides)
- ✅ Clear separation: guides vs docs vs code
- ✅ Less overwhelming for new contributors
