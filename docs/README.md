# Documentation Overview

This folder contains all project documentation for the Child Support Calculator app.

## 🎯 CURRENT PROJECT STATUS (December 27, 2024)

**Phase 1 & 2 COMPLETE** ✅  
**Live at:** auschildsupport.com  
**Next:** Lawyer outreach starting

---

## 📋 ESSENTIAL FILES (Read These First)

### **BUSINESS_MODEL.md** 🎯 ⭐ START HERE
**The current business model and project status.**
- **What it is:** Live documentation of the B2B lead generation model
- **Current status:** Phase 1 & 2 complete, infrastructure ready
- **Revenue model:** $50 per qualified lead to family lawyers
- **What's inside:**
  - How money flows (parent → lead → lawyer → payment)
  - Revenue projections ($2-3K/month starting)
  - What's built (web app, admin panel, Supabase integration)
  - Next steps (lawyer outreach)
- **Length:** 237 lines
- **Who needs it:** Everyone - this is the current source of truth

### **PRODUCT_ROADMAP.md** 🗺️
**Strategic product roadmap and growth plan.**
- 6-phase roadmap (Phase 1-2 complete, Phase 3 starting)
- Revenue projections and milestones
- Feature prioritization framework
- Risk management strategies
- Monthly/quarterly review processes
- **Read this to understand where we're going**
- **Length:** ~700 lines

### **DESIGN_SYSTEM.md** 🎨
**Complete design system and architecture guide.**
- Color palette (slate/blue theme)
- Typography scale
- Component patterns
- Spacing system
- Full 8-step Australian child support formula explained
- Common abbreviations glossary
- **Read this before making UI changes**
- **Length:** 388 lines

### **CLAUDE.md** 🤖
**AI assistant guidance for working with the codebase.**
- Build and development commands
- Architecture overview
- File structure
- Key patterns
- Supabase configuration
- For AI tools like Claude
- **Length:** 859 lines

---

## 📖 ACTIVE GUIDES

### **guides/active/REMAINING_TASKS.md** 📋
**Current task list and project status.**
- What's completed (web app, admin panel, database)
- What's in progress (testing, deployment)
- What's next (privacy policy, lawyer outreach)
- Priority order for remaining work
- **Length:** 135 lines
- **Updated:** Dec 27, 2024

### **guides/active/WEB_DEPLOYMENT_GUIDE.md** 🚀
**Complete guide for deploying to web.**
- Expo web setup
- Local testing
- Production build
- Netlify deployment
- Domain configuration
- **Length:** 385 lines

### **guides/active/LEAD_HANDOVER.md** 🔒
**Secure methods for sending lead details to lawyers.**
- Password-protected PDFs
- Temporary secure links
- Encrypted email options
- Implementation guidance
- **Length:** 66 lines

---

## 📧 TEMPLATES

**Location:** `/docs/templates/`

All email and legal templates for lawyer partnerships:

1. **EMAIL_COLD_OUTREACH.md** (30 lines) - Initial lawyer outreach
2. **EMAIL_LEAD_FORWARDING.md** (40 lines) - Sending lead teasers
3. **EMAIL_MONTHLY_INVOICE.md** (30 lines) - Billing template
4. **EMAIL_WEEKLY_CHECKIN.md** (22 lines) - Partner updates
5. **EMAIL_WELCOME_NEW_PARTNER.md** (37 lines) - Onboarding
6. **LAWYER_PARTNERSHIP_AGREEMENT.md** (128 lines) - Legal agreement

**See:** `templates/README.md` for usage instructions

---

## 📚 ARCHIVED DOCUMENTATION

**Location:** `/docs/guides/old/`

Historical planning documents from the development phases:
- Phase 1 & 2 checklists and status
- Christmas break planning
- Completed phases summary
- Deployment guides
- Troubleshooting notes
- Alex Thompson lawyer setup

**Note:** These are archived for reference but superseded by current active guides.

---

## 🎯 RECOMMENDED READING ORDER

**If you're NEW to the project:**
1. **BUSINESS_MODEL.md** - Understand what we're building
2. **PRODUCT_ROADMAP.md** - See where we're going
3. **guides/active/REMAINING_TASKS.md** - See current status
4. **DESIGN_SYSTEM.md** - Learn the UI system
5. **CLAUDE.md** - Technical reference

**If you're PLANNING strategy or features:**
1. **PRODUCT_ROADMAP.md** - 6-phase growth plan
2. **BUSINESS_MODEL.md** - Revenue model and projections
3. **KEY_PERSONAS.md** - User needs and priorities
4. **guides/active/REMAINING_TASKS.md** - Current priorities

**If you're DEPLOYING the web app:**
1. **guides/active/WEB_DEPLOYMENT_GUIDE.md** - Complete deployment steps
2. **guides/active/REMAINING_TASKS.md** - Check deployment tasks
3. **BUSINESS_MODEL.md** - Understand what features need to work

**If you're REACHING OUT to lawyers:**
1. **BUSINESS_MODEL.md** - Revenue model and value prop
2. **templates/EMAIL_COLD_OUTREACH.md** - Outreach template
3. **templates/LAWYER_PARTNERSHIP_AGREEMENT.md** - Legal agreement
4. **guides/active/LEAD_HANDOVER.md** - How to securely send leads

**If you're MAKING CODE CHANGES:**
1. **DESIGN_SYSTEM.md** - Design patterns and formulas
2. **CLAUDE.md** - Architecture and file structure
3. **guides/active/REMAINING_TASKS.md** - See what's already done

---

## 📊 QUICK STATS

| Document | Lines | Purpose | Last Updated |
|----------|-------|---------|--------------|
| **CLAUDE.md** | **859** | **Technical guide** | Dec 27, 2024 |
| **PRODUCT_ROADMAP.md** | **~700** | **Strategic roadmap** ⭐ | Dec 28, 2024 |
| **guides/active/WEB_DEPLOYMENT_GUIDE.md** | **385** | **Deployment** | Dec 27, 2024 |
| **DESIGN_SYSTEM.md** | **388** | **Design system** | Dec 27, 2024 |
| **BUSINESS_MODEL.md** | **237** | **Business overview** ⭐ | Dec 27, 2024 |
| **guides/active/REMAINING_TASKS.md** | **135** | **Current tasks** | Dec 27, 2024 |
| **templates/LAWYER_PARTNERSHIP_AGREEMENT.md** | **128** | **Legal template** | Dec 27, 2024 |
| **templates/README.md** | **103** | **Template guide** | Dec 27, 2024 |
| **guides/active/LEAD_HANDOVER.md** | **66** | **Security guide** | Dec 27, 2024 |
| **templates/EMAIL_LEAD_FORWARDING.md** | **40** | **Email template** | Dec 27, 2024 |
| **templates/EMAIL_WELCOME_NEW_PARTNER.md** | **37** | **Email template** | Dec 27, 2024 |
| **templates/EMAIL_COLD_OUTREACH.md** | **30** | **Email template** | Dec 27, 2024 |
| **templates/EMAIL_MONTHLY_INVOICE.md** | **30** | **Email template** | Dec 27, 2024 |
| **templates/EMAIL_WEEKLY_CHECKIN.md** | **22** | **Email template** | Dec 27, 2024 |

**Total active documentation: ~3,160 lines**  
**Archived documentation:** See `/docs/guides/old/`

---

## 🚀 NEXT STEPS (This Week)

**Phase 2 → Phase 3 Transition:**

1. **Deploy to production** (if not done)
   - Follow WEB_DEPLOYMENT_GUIDE.md
   - Verify auschildsupport.com is live

2. **Attach privacy policy** (15 min)
   - Link privacy.html to inquiry form

3. **Start lawyer outreach** 
   - Use EMAIL_COLD_OUTREACH.md template
   - Target 5-10 lawyers in Sydney/Melbourne
   - Goal: 2-3 partnerships by end of week

4. **Test lead handover process**
   - Review LEAD_HANDOVER.md
   - Choose secure method
   - Test with first lawyer

**SUCCESS METRICS:**
- Web app live and functional ✅
- 2-3 lawyer partnerships signed
- First $50 lead sale completed
- Lead handover process tested

---

**Questions?** Check BUSINESS_MODEL.md for current strategy and REMAINING_TASKS.md for specific next steps.