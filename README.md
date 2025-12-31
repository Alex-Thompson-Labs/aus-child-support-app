# Child Support Calculator - B2B Lead Generation App 🚀

**Australian child support calculator with lawyer lead generation**  
React Native (Expo) • iOS • Android • Web

---

## 🎯 What This Is

A **free calculator** that helps Australian parents calculate child support payments, with built-in **complexity detection** that connects high-value cases to family law firms.

**Business Model:** B2B lead generation (lawyers pay $50 per qualified lead)  
**Target Revenue:** $10K-$15K/month at scale (Year 1)  
**Current Phase:** Phase 3A - Proof Before Pitch (Validation)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Add your Google Analytics ID (sign up at https://analytics.google.com)
# Edit .env and add: EXPO_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Start Development
```bash
npm start          # Start Expo dev server
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

---

## 📚 Documentation

**Current Work:**
- [guides/CHRISTMAS_BREAK_PLAN.md](guides/CHRISTMAS_BREAK_PLAN.md) - Tasks for Dec 24 - Jan 2

**Reference:**
- [docs/CLAUDE.md](docs/CLAUDE.md) - Architecture & production code requirements
- [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) - $50/lead model
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - Colors, spacing
- [guides/TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md) - Common issues

---

## 🏗️ Project Structure

```
csc/
├── src/
│   ├── components/       # React components
│   ├── screens/          # Screen components
│   ├── hooks/            # Custom hooks (useCalculator)
│   ├── utils/            # Business logic & calculations
│   └── types/            # TypeScript types
├── docs/                 # Documentation (5 essential files)
├── .env.example          # Environment variables template
└── PHASE1_CHECKLIST.md   # This week's work
```

---

## 🎯 Current Phase: Validation (Week 1-2)

**Goal:** Prove parents click "Get Legal Help" buttons  
**Success Metric:** >2% click-through rate

### This Week's Tasks:
1. ✅ Environment setup (.env created)
2. ✅ Analytics setup (Google Analytics)
3. ⏳ Implement complexity triggers
4. ⏳ Build lawyer alert UI
5. ⏳ Create inquiry form
6. ⏳ Test with 100+ users

**See [guides/phase1/CHECKLIST.md](guides/phase1/CHECKLIST.md) for detailed steps.**

---

## 🔧 Available Scripts

```bash
npm start           # Start Expo dev server
npm run dev         # Start with cleared cache
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run in web browser
npm run lint        # Run ESLint
npm run type-check  # TypeScript validation
```

---

## 🧪 Testing

Before recruiting users:
1. Complete [guides/phase1/TESTING.md](guides/phase1/TESTING.md)
2. Verify all analytics events fire
3. Test on both iOS and Android
4. Check form submissions work

---

## 🆘 Help

**Issues? Check:**
1. [guides/TROUBLESHOOTING.md](guides/TROUBLESHOOTING.md) - Common fixes
2. [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md) - Code snippets in Appendix A
3. [docs/CLAUDE.md](docs/CLAUDE.md) - Architecture reference

**Still stuck?** Check if `.env` is set up and Expo cache is cleared (`npm run dev`)

---

## 📊 Phase Progress

- [x] Phase 0: Foundation ✅ (Calculator built, docs organized)
- [ ] Phase 1: Validation 🔄 (THIS WEEK - fake door test)
- [ ] Phase 2: Pilot (Month 2-3 - recruit 2-3 law firms)
- [ ] Phase 3: Monetization (Month 4-6 - first paying customers)
- [ ] Phase 4: Scale (Month 7-12 - 20+ firms, $5K-10K MRR)

---

## 🎨 Tech Stack

- **Framework:** React Native 0.81.5
- **Build Tool:** Expo 54
- **Navigation:** Expo Router (file-based)
- **Language:** TypeScript 5.9
- **Styling:** React Native StyleSheet (slate/blue theme)
- **Analytics:** Google Analytics (Phase 1+)
- **Payments:** Stripe (Phase 3+)

---

## 🚀 Next Steps

1. Read [guides/phase1/CHECKLIST.md](guides/phase1/CHECKLIST.md)
2. Sign up for Google Analytics and add measurement ID to `.env`
3. Follow Day 1-2 tasks (analytics + triggers)
4. Test with [guides/phase1/TESTING.md](guides/phase1/TESTING.md)
5. Launch to 100+ test users by end of week

**Let's build this! 🔥**
