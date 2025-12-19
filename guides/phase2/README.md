# Phase 2: Pilot Program

**Status:** Ready to implement  
**Duration:** 10 weeks  
**Goal:** Sign 2-3 pilot law firms, prove lead quality

---

## 📚 DOCUMENTATION

### Start Here
- **[CHECKLIST.md](./CHECKLIST.md)** - Quick reference, week-by-week tasks
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Detailed guide with examples

### Related Docs
- **[Phase 1 Results](../phase1/CHECKLIST.md)** - What we learned from validation
- **[MASTER_PLAN.md](../../docs/MASTER_PLAN.md)** - Full business model
- **[TROUBLESHOOTING.md](../TROUBLESHOOTING.md)** - Common issues

---

## 🎯 WHAT IS PHASE 2?

Phase 1 proved parents click "Get Legal Help" buttons.

Phase 2 proves **lawyers value those leads**.

### The Plan
1. Recruit 2-3 family law firms for free 3-month pilot
2. Build manual lead routing (email forwarding)
3. Track which leads convert to consultations/clients
4. Gather feedback, iterate on quality
5. Present results, discuss paid partnerships

### Success Criteria
- ✅ 30+ leads delivered to pilot firms
- ✅ >20% consultation booking rate
- ✅ >5% client conversion rate
- ✅ At least 1 firm says "I'd pay for this"

---

## 🚀 QUICK START

**If you're ready to start Phase 2 RIGHT NOW:**

1. **Read the checklist** (10 minutes)
   ```bash
   open guides/phase2/CHECKLIST.md
   ```

2. **Choose your target city** (5 minutes)
   - Melbourne? Sydney? Brisbane?
   - Pick ONE city for pilot

3. **Find 10 law firms** (30 minutes)
   - Google: "family lawyer [your city]"
   - Create spreadsheet with contact info

4. **Send first email TODAY** (15 minutes)
   - Use template from CHECKLIST.md
   - Customize for first firm
   - Hit send!

**Don't overthink it. Just start.**

---

## 📁 NEW FILES IN PHASE 2

### Code Files
- `src/utils/lead-brief-generator.ts` - Formats lead briefs for lawyers

### Documentation
- `guides/phase2/CHECKLIST.md` - Week-by-week tasks
- `guides/phase2/IMPLEMENTATION_GUIDE.md` - Detailed guide
- `guides/phase2/README.md` - This file

### Data Files (You'll Create)
- `docs/pilot-firms.xlsx` - Lawyer contact spreadsheet
- `docs/lead-tracker.xlsx` - Lead tracking sheet
- `docs/PILOT_LEARNINGS.md` - What you learned

---

## 💡 KEY DIFFERENCES FROM PHASE 1

| Phase 1 | Phase 2 |
|---------|---------|
| Build calculator | Recruit lawyers |
| Prove users click | Prove leads convert |
| Technical work | Business work |
| Solo work | Partner management |
| 2 weeks | 10 weeks |
| $0 cost | $500-1500 cost |

**Phase 2 is LESS about coding, MORE about relationships.**

---

## 💰 UNDERSTANDING THE PRICING MODEL

**Phase 2 is FREE** - This is a pilot to prove lead quality and validate the booking model.

**Why we're testing for free:**
- Build trust with lawyers first
- Gather testimonials and conversion data (booking → consultation → client)
- Refine our booking process before charging
- Validate that lawyers will pay for this service

**What we're validating:**
- Will lawyers pay $100 per booked consultation? (Phase 3+)
- What's the booking completion rate? (target: >40%)
- What's the consultation → client conversion rate? (target: >20%)
- What data do lawyers need in the booking brief?
- Does calendar integration reduce scheduling friction?

**The Future Pricing Model (Phase 3+):**
- **Primary Model:** $100 per confirmed consultation booking
- **How it works:** User selects time slot on lawyer's calendar → Booking confirmed → Lawyer charged $100
- **Why this price:** Lawyers bill at $400/hour, so $100 for a qualified meeting = 4:1 ROI minimum
- **Why not pay-per-lead:**
  - **Regulatory compliance:** Classified as "marketing fee" not "referral commission" (ASCR Rule 12.4.3)
  - **Fraud prevention:** Booked calendar slots = verified intent (vs bot-filled forms)
  - **No "bad lead" disputes:** Calendar API logs provide proof of delivery
  - **Higher quality:** Users who book appointments demonstrate commitment
  - **No scheduling friction:** Meeting already on lawyer's calendar (saves 15-30 min per lead)

**Evolution to Hybrid (Phase 4+):**
- **Premium Partner Tier:** $149/month subscription + $50 per booking (50% discount)
- **Pay-As-You-Go Tier:** $100 per booking (no monthly fee)
- **Benefits for subscribers:** Priority routing, market data access, unlimited bookings at reduced rate

**Technical Implementation:**
- Calendar integration (Calendly API or Google Calendar API)
- Mobile OTP verification (fraud prevention)
- Stripe payment infrastructure
- Optional: User booking deposit ($20-50 refundable) to eliminate no-shows

See `docs/PRICING_STRATEGY_ANALYSIS.md` for comprehensive regulatory compliance analysis and comparison with 4 alternative pricing models (including why Option 4 "Pay-Per-Client" is a FATAL FLAW due to fee-sharing prohibition).

---

## 🎓 WHAT YOU'LL LEARN

By the end of Phase 2, you'll know:

1. **Lead Quality Metrics**
   - Which complexity triggers work best
   - What information lawyers need
   - How to price your leads

2. **Lawyer Relationships**
   - How to pitch effectively
   - What lawyers value in leads
   - How to manage partnerships

3. **Business Validation**
   - Is this model viable?
   - What's a lead worth?
   - Can this scale?

4. **Product Improvements**
   - What data to collect
   - How to present results
   - Which features to prioritize

---

## ⚠️ COMMON MISTAKES TO AVOID

### Mistake 1: Building Too Much Automation
**Wrong:** Spending 20 hours building automated lead routing  
**Right:** Manually forward emails, takes 5 min/week

### Mistake 2: Signing Too Many Firms
**Wrong:** Recruit 10 firms, can't manage them all  
**Right:** Start with 2-3, give them excellent service

### Mistake 3: Not Tracking Conversions
**Wrong:** Send leads, hope for the best  
**Right:** Weekly check-ins, update spreadsheet religiously

### Mistake 4: Ignoring Feedback
**Wrong:** Keep sending same types of leads despite complaints  
**Right:** Adjust triggers weekly based on lawyer input

### Mistake 5: Giving Up Too Early
**Wrong:** First 5 leads don't convert, panic and quit  
**Right:** Judge success after 60+ leads (3 months)

---

## 📊 SUCCESS INDICATORS

### Week 2
✅ 2-3 firms signed up for pilot

### Week 4
✅ Lead routing system works  
✅ First lead sent successfully

### Week 8
✅ 30+ leads delivered  
✅ Feedback collected from lawyers  
✅ Some consultations booked

### Week 10
✅ Conversion rates calculated  
✅ Lawyer testimonials collected  
✅ Clear path to monetization

---

## 🔄 WEEKLY RHYTHM

### Monday Morning
- Review last week's leads
- Update tracking spreadsheet
- Check for lawyer emails

### Wednesday Afternoon
- Send new leads to firms (as they come in)
- Forward with context email
- Log in tracker

### Friday Afternoon
- Send weekly check-in to each firm
- Ask for status updates
- Document feedback
- Plan next week's adjustments

---

## 💰 EXPECTED OUTCOMES

### Conservative Case
- 30 leads delivered
- 6 consultations booked (20%)
- 2 clients signed (7%)
- 1 firm interested in paying
- **Result:** Proceed to Phase 3

### Moderate Case
- 60 leads delivered
- 15 consultations booked (25%)
- 4 clients signed (7%)
- 2 firms interested in paying
- **Result:** Strong validation, proceed confidently

### Optimistic Case
- 90 leads delivered
- 25 consultations booked (28%)
- 6 clients signed (7%)
- All 3 firms want to pay
- **Result:** Strong product-market fit, scale aggressively

---

## 🚨 WHEN TO PIVOT

**Stop Phase 2 and reconsider if:**

❌ Zero consultations after 30 leads  
❌ All lawyers say "leads are low quality"  
❌ No firms interested in paying  
❌ Can't generate enough app users to create leads  
❌ Conversion rate <10% consistently

**Possible pivots:**
- Target different type of lawyers (divorce vs custody specialists)
- Change complexity triggers (different lead types)
- Add more data to briefs (what's missing?)
- Offer different value proposition (bulk leads vs exclusive territory)

**Remember:** Failure in Phase 2 is VALUABLE data. It tells you what doesn't work before you invest in Phase 3.

---

## 📞 NEED HELP?

**Stuck on recruiting?**
- Try law society networking events
- Ask existing lawyers for referrals
- Offer longer pilot (6 months)

**Stuck on lead quality?**
- Interview users who clicked but didn't convert
- Ask lawyers what data they need
- Lower complexity thresholds

**Stuck on anything else?**
- Read IMPLEMENTATION_GUIDE.md thoroughly
- Check TROUBLESHOOTING.md
- Ask Claude Code for help

---

## ⏭️ WHAT'S NEXT?

**After Phase 2, you'll do ONE of these:**

### Option A: Proceed to Phase 3 (Monetization) ✅
**If:** Lawyers validated the model, >1 wants to pay

**Phase 3 includes:**
- Build automated lead routing
- Implement billing system (Stripe)
- Sign 10+ paying firms
- Expand to multiple cities
- Revenue goal: $5k-10k/month

### Option B: Iterate Phase 2 (Extend Pilot)
**If:** Some validation but needs improvement

**Actions:**
- Extend pilot 1-2 more months
- Adjust complexity triggers
- Improve lead brief format
- Try different lawyer types

### Option C: Pivot Business Model
**If:** Model doesn't work as expected

**Consider:**
- B2C subscription (original plan)
- Affiliate partnerships (refer to existing services)
- White-label calculator for law firms
- Government/NGO licensing

### Option D: Shutdown
**If:** No validation, no path forward

**That's OK!** You learned:
- How to build a React Native app
- How to validate business ideas
- What lawyers actually need
- What doesn't work (valuable!)

Better to learn fast than waste years on wrong idea.

---

## 🎯 YOUR IMMEDIATE NEXT STEP

**Right now, open CHECKLIST.md and complete the first task:**

```bash
open guides/phase2/CHECKLIST.md
```

**First task: Choose target city**

Write it down:
```
My Phase 2 target city: _______________
```

Then follow the checklist week by week.

**Good luck!** 🚀
