# Child Support Calculator - B2B Lead Generation App 🚀

**Australian child support calculator with lawyer lead generation**
React Native (Expo) • Web

**Live Site:** [auschildsupport.com.au](https://auschildsupport.com.au)

---

> ## 🚨 **ATTENTION: AI ASSISTANTS (Kiro, Claude, etc.)**
> 
> **BEFORE making ANY code changes, read this:**
> 
> 1. **You MUST update documentation when you change code**
> 2. **Read:** `/docs/AI_DOCUMENTATION_GUIDE.md` for complete instructions
> 3. **Quick reference:** `/docs/CLAUDE.md` has a checklist
> 
> **Common updates needed:**
> - New feature? → Update `docs/business-docs/BUSINESS_MODEL.md`
> - UI change? → Update `docs/DESIGN_SYSTEM.md`
> - New route? → Update `docs/business-docs/USER_FLOW.md`
> 
> **This is not optional.** Documentation accuracy is critical to this project.

---

## 🎯 What This Is

A **free calculator** that helps Australian parents calculate child support payments, with built-in **complexity detection** that connects high-value cases to family law firms.

**Business Model:**

1.  **Lead Gen:** Lawyers pay **$50 per qualified lead** (Pay-per-lead)
2.  **Marketing Retainer:** Exclusive partners pay a monthly retainer for managed ads
3.  **Privacy First:** Leads delivered via **Secure Magic Links** (No PII in emails)

**Current Status:** Phase 3A - Validation (Proof Before Pitch)
**Target Revenue:** $10K-$15K/month at scale (Year 1)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Create .env file with required keys:
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...
# EXPO_PUBLIC_GA_MEASUREMENT_ID=... (Google Analytics)
```

### 3. Start Development

```bash
npm start          # Start Expo dev server
npm run web        # Web browser
```

---

## 📚 Documentation

**Strategy & Business:**

- [docs/business-docs/BUSINESS_MODEL.md](docs/business-docs/BUSINESS_MODEL.md) - Revenue model & Retainer strategy
- [docs/business-docs/PRODUCT_ROADMAP.md](docs/business-docs/PRODUCT_ROADMAP.md) - Growth plan (Phase 3A - 5)
- [docs/business-docs/KEY_PERSONAS.md](docs/business-docs/KEY_PERSONAS.md) - User analysis (Sarah vs Michael)

**Technical & Design:**

- [docs/CLAUDE.md](docs/CLAUDE.md) - **Architecture & AI Coding Standards** (includes deployment instructions)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - UI patterns & Calculation formulas
- [docs/AI_DOCUMENTATION_GUIDE.md](docs/AI_DOCUMENTATION_GUIDE.md) - **⚠️ AI Assistants: Documentation maintenance requirements**

---

## 🏗️ Project Structure

```
csc/
├── app/                  # Expo Router (file-based routing)
│   ├── (tabs)/           # Calculator tab
│   ├── admin/            # Admin dashboard & Secure View
│   ├── lawyer-inquiry.tsx # Lead capture form (main + direct mode)
│   ├── special-circumstances.tsx # Direct entry from blog links
│   └── blog/             # Blog routes (external: blog.auschildsupport.com.au)
├── src/
│   ├── components/       # UI Components
│   ├── hooks/            # Logic (useCalculator)
│   ├── utils/            # Business logic (Formulas, Complexity)
│   └── types/            # TypeScript definitions
└── docs/                 # Project documentation
```

**External Traffic Sources:**

- **Blog Chatbot Widget** (blog.auschildsupport.com.au) - Pre-calculator funnel
- **Direct Inquiry Links** - Embedded in blog posts (e.g., `/lawyer-inquiry?mode=direct&reason=hidden_income`)

---

## 🎯 Current Phase: Phase 3A (Validation)

**Goal:** Validate lead quality & demand before scaling.

**Dual Launch Strategy:**

1.  **Organic Track:** Drive traffic via SEO/Reddit/Blog (with chatbot widget & inline CTAs) to generate free validation leads.
2.  **Partner Track:** Pitch "Marketing Retainer" ($500 ad spend) to one exclusive partner.

**Success Metrics:**

- 15%+ Lead-to-Consultation Rate
- OR 1 Exclusive Partner signed
- **Secure Magic Link** system operational

---

## 🔧 Available Scripts

```bash
npm start           # Start Expo dev server
npm run web         # Run in web browser
npm run build:web   # Build for production (Vercel)
npm run lint        # Run ESLint
npm run type-check  # TypeScript validation
```

---

## 📊 Phase Progress

- [x] **Phase 1: Foundation** ✅ (Calculator & Core Logic)
- [x] **Phase 2: Infrastructure** ✅ (Admin Panel, Database, Privacy)
- [ ] **Phase 3A: Validation** 🔄 (CURRENT - Organic + Partner Outreach)
- [ ] **Phase 3B: First Revenue** ⏳ (First paying lawyers - Feb 2026)
- [ ] **Phase 4: Scale** ⏳ (20+ firms, Automated Routing)

---

## 🎨 Tech Stack

- **Framework:** React Native 0.81.5 (Expo 54)
- **Navigation:** Expo Router
- **Database:** Supabase (PostgreSQL + RLS)
- **Analytics:** Google Analytics (react-ga4) + Vercel Analytics & Speed Insights
- **Styling:** React Native StyleSheet (slate/blue theme)

---

## 🚀 Next Steps

1.  Complete **Secure Magic Link** implementation
2.  Launch **Organic Traffic** campaign (Blog posts with chatbot widget + inline CTAs, Reddit, forums)
3.  Send **Exclusive Partner** pitches (Retainer Model)

**Note:** See [docs/CLAUDE.md](docs/CLAUDE.md) for external lead generation channels (chatbot widget, direct routing URLs).

**Let's build this! 🔥**
