# Prompt for Unbiased Pricing Strategy Analysis (Manual Lead Routing Model)

Copy this entire prompt into Claude (or any AI model) to get an unbiased pricing analysis:

---

You are a B2B SaaS pricing consultant analyzing pricing strategy for a legal lead generation platform. Your client just decided to use **manual email lead routing** instead of calendar integration. You must provide brutally honest pricing recommendations.

## THE BUSINESS CONTEXT

**Product:** Child support calculator app (free for parents) that generates leads for family lawyers  
**Target Customer:** Family law firms in Australia (small businesses, 1-10 lawyers)  
**Current Stage:** Phase 2 - onboarding first 8-12 lawyers  
**Founder:** Solo developer, needs revenue ASAP to validate model

## THE SERVICE BEING DELIVERED

### What Lawyers Get:
1. Email with pre-qualified lead details:
   - Parent's name, email, phone
   - Calculation summary (annual liability amount, income split, care arrangement)
   - Complexity flags (high value case, court date urgent, special circumstances)
   - Parent's message/questions
   - Parent's preferred contact times

2. Quality screening:
   - Only leads that meet complexity threshold (not every calculator user)
   - Reviewed by founder before sending (manual quality control)
   - Matched to lawyer's service area

3. Lead characteristics:
   - Parent has already used calculator (engaged, not cold)
   - Parent clicked "Get Legal Help" button (expressed intent)
   - Parent filled out inquiry form (provided contact details)
   - Meets complexity criteria (high-value case, court date, disputes, etc.)

### What Lawyers Must Do:
- Contact parent directly within 24 hours (via email/phone)
- Schedule consultation themselves (no automated booking)
- Report back outcome (optional, honor system)

### What Happens After:
- Founder bills lawyer at end of month via Stripe
- No refunds unless lead is duplicate or clearly unqualified
- Lawyer converts ~30-40% of consultations to paying clients ($3K-10K each)

## PRICING OPTIONS TO EVALUATE

### OPTION 1: Pay-Per-Lead ($40-60 per lead)
**How it works:**
- Lawyer pays $X for each lead email sent
- Charged immediately when lead is delivered
- No tracking of consultation booking or outcome needed

**Variations:**
- A: $40/lead (lower barrier, volume play)
- B: $50/lead (middle ground)
- C: $60/lead (premium positioning)

---

### OPTION 2: Pay-Per-Consultation-Claimed ($80-100 per consultation)
**How it works:**
- Lawyer pays ONLY if consultation actually happens
- Lawyer reports: "Yes, parent booked" or "No, parent didn't respond"
- Honor system (no verification)
- Charged at end of month based on lawyer's reported bookings

**Variations:**
- A: $80/consultation (incentivizes honest reporting)
- B: $90/consultation (middle ground)
- C: $100/consultation (matches original calendar booking price)

---

### OPTION 3: Hybrid Model ($30 lead + $50 booking bonus)
**How it works:**
- $30 charged when lead is sent (base fee)
- Additional $50 if lawyer confirms consultation booked (optional reporting)
- Total: $80 if consultation happens, $30 if parent doesn't book

---

### OPTION 4: Tiered Pricing
**How it works:**
Different prices based on lead quality score:

- **3-star leads:** $40 (shared care disputes, moderate value)
- **4-star leads:** $60 (high value >$15K, special circumstances)
- **5-star leads:** $100 (court date urgent, >$20K liability, multiple flags)

---

### OPTION 5: Subscription + Per-Lead
**How it works:**
- Monthly subscription: $200/month
- Per-lead fee: $25 each
- Unlimited leads at reduced rate

Example: 10 leads/month = $200 + (10 × $25) = $450 total vs $500 at $50/lead

---

## COMPETITIVE LANDSCAPE DATA

**What other legal lead gen companies charge:**

1. **Lawyer.com, Avvo, FindLaw:** $50-150 per lead (pay-per-lead, no booking confirmation)
2. **LawTrades, UpCounsel:** 15-20% of client revenue (referral fee model, often illegal in Australia)
3. **Google Local Services Ads (legal):** $50-400 per lead depending on practice area
4. **Facebook/Google Ads (self-run):** $30-100 cost per lead (lawyer does all work themselves)

**Key insight:** Most legal lead gen is pay-per-lead, NOT pay-per-booking or pay-per-client.

## YOUR TASK

Analyze each option and provide:

### 1. Revenue Potential Analysis
For each option, calculate expected revenue:
- Scenario: 10 lawyers, 5 leads per lawyer per month = 50 leads/month
- Show: Revenue per month, revenue per lead, revenue per lawyer
- Consider: What happens if lead volume is 30 leads? 80 leads?

### 2. Adoption Risk Assessment
For each option, estimate:
- What % of lawyers will agree to this pricing?
- What % will complain about price?
- What friction exists? (e.g., honor system abuse, reporting burden)

### 3. Fraud/Abuse Risk
- Which options are most vulnerable to lawyer dishonesty?
- Which create disputes ("this lead was low quality!")?
- How hard is it to verify/prove value delivery?

### 4. Competitive Positioning
- How does each price compare to market rates?
- What message does the pricing send? (Premium? Budget? Fair?)
- Can you justify the price vs what lawyers pay elsewhere?

### 5. Operational Complexity
For the solo founder:
- How much manual work does each pricing model create?
- Which requires tracking/verification?
- Which creates the most support tickets/disputes?
- Which is easiest to explain to lawyers?

### 6. Psychological Factors
- **Anchoring:** What price feels "right" given market norms?
- **Loss aversion:** Do lawyers prefer "pay only if it works" vs "pay upfront"?
- **Perceived value:** At what price do lawyers think "this is too cheap to be good"?
- **Mental accounting:** How do lawyers budget for lead gen? (monthly? per-lead?)

### 7. The "Founder's Dilemma" Test
Consider:
- Founder needs revenue NOW (not in 6 months)
- Founder needs simple pricing (can't track complex attribution)
- Founder needs high close rate (limited time for sales calls)
- Founder wants pricing that lawyers don't negotiate

Which option gives the best chance of "yes" with minimal friction?

### 8. The "Scale Test"
Imagine 100 lawyers, 500 leads/month:
- Which pricing model still works?
- Which creates unsustainable support burden?
- Which maximizes revenue without scaring away lawyers?

### 9. Hidden Risks
What could go wrong with each option that's NOT obvious:
- Tax/accounting complexity?
- Legal/regulatory issues in Australia?
- Lawyer expectations mismatch?
- What happens when lawyers compare notes on pricing?

### 10. Final Recommendation

Provide ONE clear recommendation:

**Recommended Price:** $X per [unit]  
**Reasoning:** (3-4 sentences)  
**Revenue Projection:** $X/month with 10 lawyers  
**Biggest Risk:** (what could tank this pricing)  
**How to Validate:** (test with 3 lawyers before committing)  
**Fallback Option:** (if this price doesn't work)

## CRITICAL CONSTRAINTS

**You must consider:**
- Australian legal market dynamics (not US market)
- Lawyers are small businesses (price-sensitive)
- This is UNPROVEN service (no track record, no reviews, no brand)
- Founder is solo dev (can't provide white-glove support)
- Lead quality is UNKNOWN (no historical conversion data yet)
- Some leads WILL be duds (unreachable parents, changed minds, etc.)

**You must avoid:**
- Comparing to US legal tech pricing (different market)
- Assuming lawyers trust honor system reporting
- Ignoring that lawyers will test you with "this lead was bad" complaints
- Recommending complex pricing that requires engineering work
- Suggesting prices that make the founder seem desperate or greedy

## REAL LAWYER BEHAVIORS TO CONSIDER

Small law firms typically:
- Budget monthly, not per-project
- Test new vendors with skepticism
- Complain about lead quality (even when it's good)
- Compare prices with other lead sources they use
- Ghost vendors if unhappy (won't tell you why)
- Pay late or forget to report outcomes

## OUTPUT FORMAT

**Executive Summary** (3 sentences: what you recommend and why)

**Revenue Models Ranked** (1-5, with projected monthly revenue for each)

**Adoption Risk** (Which has highest close rate with lawyers?)

**Operational Burden** (Which is easiest for solo founder to manage?)

**Pricing Psychology** (What price "feels right" to lawyers?)

**Final Recommendation** (Clear choice: $X per Y)

**Validation Plan** (How to test with first 3 lawyers before committing)

**Biggest Risk** (What could go wrong)

**Fallback Strategy** (If your recommendation fails, what's Plan B?)

---

Be brutally honest. The founder needs the TRUTH about what lawyers will actually pay, not theoretical ideal pricing.

Consider:
- What would YOU pay if you were a family lawyer?
- What price makes you go "that's reasonable"?
- What price makes you go "fuck that, I'll just run Google Ads myself"?
