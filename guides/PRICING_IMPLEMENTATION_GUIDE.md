# Pricing Model Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the **Pay-Per-Consultation-Booked** pricing model, from free pilot (Phase 1-2) through paid launch (Phase 3) to hybrid scaling (Phase 4).

**Chosen Model:** Option 3 - Pay-Per-Consultation-Booked ($100 per confirmed appointment)

**Evolution Path:**
- Phase 1-2 (Months 1-3): FREE pilot → Build & validate
- Phase 3 (Months 4-9): PAID launch → $100 per booking
- Phase 4 (Months 10+): HYBRID model → $149/month + $50/booking

**Reference:** See `docs/PRICING_STRATEGY_ANALYSIS.md` for full regulatory analysis and model comparison.

---

## Regulatory Context

See `docs/PRICING_STRATEGY_ANALYSIS.md` Section 2 for full legal analysis.

### Key Compliance Points

**Classification:**
- This is a **marketing and administrative service agreement**, NOT a referral arrangement
- Fee is for marketing exposure and booking administration only
- Provider does not practice law or provide legal advice
- Lawyers maintain complete professional independence (ASCR Rule 4.1.4)

**ASCR Rule 12.4.3 - Referral Fee Disclosure:**
- ✅ Simplified disclosure: "We use a third-party booking platform that charges us an administrative fee"
- ✅ NOT classified as "referral commission" (framed as marketing fee)
- ✅ Minimal disclosure burden compared to pay-per-client model

**Legal Profession Uniform Law Section 174 - Costs Disclosure:**
- ✅ Booking fee included in lawyer's overhead/disbursements
- ✅ No separate itemization required for sub-$3,000 matters
- ✅ For >$3,000 matters (all family law), disclosed in standard costs agreement

**Fee-Sharing Prohibition (ASCR Rule 12, Uniform Law):**
- ✅ NOT triggered - payment is for service, not percentage of legal fees
- ✅ No percentage of settlement/matter value
- ✅ Fixed fee per booking regardless of client outcome

**Fiduciary Duty (ASCR Rule 4.1.4):**
- ✅ Lawyer maintains professional independence
- ✅ Platform does not influence legal advice
- ✅ No conflict between lawyer's duty to client and obligation to platform

---

## Phase 1-2: Free Pilot (Calendar Integration Only)

**Duration:** Months 1-3
**Goal:** Validate booking demand and lawyer conversion rates WITHOUT charging money
**Revenue:** $0 (investment phase)

### What We're Validating

1. **Booking Completion Rate:**
   - Target: >40% of users who click "Get Legal Help" complete a calendar booking
   - Metric: `bookings_confirmed / inquiry_form_submissions * 100`

2. **No-Show Rate:**
   - Target: <20% of booked consultations result in no-shows
   - Metric: `(bookings_confirmed - consultations_attended) / bookings_confirmed * 100`

3. **Consultation → Client Conversion:**
   - Target: >20% of consultations result in client engagement
   - Metric: `clients_signed / consultations_attended * 100`

4. **Lawyer Willingness to Pay:**
   - Target: At least 1 lawyer says "I would pay $100 per booking"
   - Method: End-of-pilot survey and pricing pitch (see Phase 2 CHECKLIST.md)

### Technical Requirements

#### 1. Calendar Integration

**Option A: Calendly API (Recommended for MVP)**
- **Why:** Simplest to implement, handles time zones, sends reminders automatically
- **Cost:** Free tier (1 event type), $8/month Pro (unlimited event types)
- **Integration:** Embed Calendly widget in app, listen for webhook events

**Implementation:**
```javascript
// Step 1: Create Calendly event type for each lawyer
// Step 2: Embed Calendly link in inquiry form
const calendlyUrl = `https://calendly.com/${lawyer.calendlyUsername}/consultation`;

// Step 3: Listen for booking webhook
app.post('/webhooks/calendly', async (req, res) => {
  const { event, payload } = req.body;

  if (event === 'invitee.created') {
    // User booked consultation
    await saveBooking({
      userId: payload.questions.user_id,
      lawyerId: getLawyerFromEventUri(payload.event.uri),
      scheduledTime: payload.scheduled_event.start_time,
      calendlyEventUri: payload.uri,
    });
  }
});
```

**Option B: Google Calendar API (More Complex)**
- **Why:** More control, no third-party dependency
- **Cost:** Free
- **Complexity:** Must build custom booking UI, handle time zones, send email confirmations

**Recommendation:** Start with Calendly (faster), migrate to Google Calendar in Phase 4 if needed.

#### 2. Booking Verification (Fraud Prevention - Basic)

Even in free pilot, implement basic verification to get clean data:

**Mobile OTP Verification:**
- Service: Twilio Verify API
- Cost: ~$0.05 per verification
- Implementation: Before showing calendar, require phone number + OTP code

```javascript
// Step 1: Send OTP
const verification = await twilio.verify.v2.services(VERIFY_SERVICE_SID)
  .verifications
  .create({ to: userPhoneNumber, channel: 'sms' });

// Step 2: Verify OTP
const verificationCheck = await twilio.verify.v2.services(VERIFY_SERVICE_SID)
  .verificationChecks
  .create({ to: userPhoneNumber, code: userEnteredCode });

if (verificationCheck.status === 'approved') {
  // Show calendar
} else {
  // Show error
}
```

**Why This Matters:** Clean pilot data = accurate conversion rates = confident pricing decisions.

#### 3. Data Collection & Tracking

**Required Tracking:**
```javascript
// Track in database
const bookingEvents = [
  { event: 'inquiry_submitted', userId, timestamp, metadata },
  { event: 'otp_sent', userId, phoneNumber, timestamp },
  { event: 'otp_verified', userId, timestamp },
  { event: 'calendar_viewed', userId, lawyerId, timestamp },
  { event: 'booking_confirmed', userId, lawyerId, bookingId, scheduledTime },
  { event: 'consultation_attended', bookingId, outcome, timestamp }, // Manual entry by lawyer
  { event: 'client_signed', bookingId, timestamp }, // Manual entry by lawyer
];
```

**Weekly Reports:**
- Email lawyers: "This week you received X bookings, Y attended, Z signed"
- Internal dashboard: Track funnel metrics, identify drop-off points

### Implementation Steps

See `guides/phase1/CHECKLIST.md` Tasks 4-6 for detailed Claude Code prompts.

**High-Level Steps:**
1. **Task 4:** Build inquiry form with OTP verification
2. **Task 5:** Integrate Calendly (or Google Calendar)
3. **Task 6:** Build booking confirmation emails
4. **Task 7:** Test end-to-end with 5-10 test users
5. **Task 8:** Launch pilot with 2-3 lawyers (see Phase 2)

---

## Phase 3: Paid Launch ($100 per Booking)

**Duration:** Months 4-9
**Goal:** Convert 2-3 pilot firms to paid, scale to 10+ firms
**Revenue Target:** $48k-52k annually

### Activation Criteria

Before launching paid model, ensure:
- ✅ Phase 2 pilot complete (50+ bookings, 3+ lawyers validated)
- ✅ Booking flow tested and stable (<5% error rate)
- ✅ At least 1 lawyer says "I would pay for this"
- ✅ Booking completion rate >40%
- ✅ No-show rate <20% (if higher, implement booking deposits - see below)

### Technical Requirements

#### 1. Payment Infrastructure (Stripe Integration)

**Setup:**
1. Create Stripe account (business entity required - see "Business Registration" below)
2. Integrate Stripe SDK
3. Create "Product" in Stripe dashboard: "Consultation Booking" ($100 AUD)

**Charge Lawyer When Booking Confirmed:**
```javascript
// When user confirms booking via calendar
async function handleBookingConfirmed(booking) {
  const lawyer = await getLawyer(booking.lawyerId);

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 10000, // $100.00 in cents
    currency: 'aud',
    customer: lawyer.stripeCustomerId, // Created during lawyer onboarding
    description: `Consultation booking - ${booking.userName}`,
    metadata: {
      bookingId: booking.id,
      lawyerId: lawyer.id,
      userPostcode: booking.userPostcode,
      scheduledTime: booking.scheduledTime,
    },
    // Charge immediately
    confirm: true,
    // Use saved payment method
    payment_method: lawyer.defaultPaymentMethodId,
  });

  // Save transaction record
  await saveTransaction({
    lawyerId: lawyer.id,
    bookingId: booking.id,
    amount: 100,
    stripePaymentIntentId: paymentIntent.id,
    status: 'succeeded',
    chargedAt: new Date(),
  });

  // Send invoice email to lawyer
  await sendInvoiceEmail(lawyer, booking, paymentIntent);
}
```

**Key Decisions:**

**Q: When do we charge?**
A: **Immediately when booking is confirmed.** NOT when consultation occurs.
- Rationale: Lawyer's calendar is blocked either way. They pay for the time slot, not the outcome.

**Q: What if user doesn't show up?**
A: Lawyer still charged. Their time was blocked.
- Mitigation: Offer booking deposit to users (see "Fraud Prevention" below)
- Lawyer benefit: Can offer no-show booking deposit to lawyer as compensation ($20-50)

**Q: What if lawyer claims lead was "low quality"?**
A: Define "quality" upfront in service agreement.
- If booking brief was accurate (calculation data, complexity score, user message), no refund.
- If user was bot/fake (OTP failed retroactively, IP flagged), refund available.
- Process: Lawyer submits dispute via dashboard, reviewed manually.

#### 2. Fraud Prevention Stack (Critical for Paid Model)

**Why This Matters:** One bad actor can destroy lawyer trust. A competitor submitting fake bookings at $100 each = immediate churn.

**Required Components:**

**A. Mobile OTP Verification (Already implemented in Phase 1-2)**
- Twilio Verify API (~$0.05/verification)
- Prevents: Bot submissions, fake phone numbers
- User flow: Enter phone → Receive SMS code → Enter code → Access calendar

**B. Honeypot Fields**
- Hidden form fields that bots auto-fill but humans cannot see
- Implementation:
```html
<!-- Add to inquiry form -->
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
```

```javascript
// Server-side validation
if (req.body.website !== '') {
  // Bot detected - reject silently
  return res.status(200).json({ message: 'Thank you, we will be in touch' });
}
```

- Cost: $0
- Prevents: Automated bot submissions

**C. IP & Device Fingerprinting**
- Service: FingerprintJS (~$0.01/check on free tier)
- Tracks: IP address, browser fingerprint, device ID
- Implementation:
```javascript
// Client-side
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const fpPromise = FingerprintJS.load();
const fp = await fpPromise;
const result = await fp.get();

// Send to server with form submission
formData.visitorId = result.visitorId;

// Server-side: Check for abuse
const recentBookings = await getBookingsByFingerprint(result.visitorId, last24Hours);
if (recentBookings.length > 3) {
  // Flag for manual review
  await flagForReview(formData, 'Multiple bookings from same device');
}
```

- Prevents: Competitor click fraud, single user submitting multiple fake bookings

**D. Booking Deposit (Optional but Highly Recommended)**
- Charge user $20-50 via Stripe
- Fully refundable upon consultation attendance OR deductible from legal fees
- Implementation:
```javascript
// After OTP verification, before showing calendar
const deposit = await stripe.paymentIntents.create({
  amount: 2000, // $20.00
  currency: 'aud',
  customer: user.stripeCustomerId,
  description: 'Refundable consultation booking deposit',
  metadata: { userId: user.id, lawyerId: lawyer.id },
});

// If user attends consultation
await stripe.refunds.create({ payment_intent: deposit.id });

// OR: Transfer to lawyer as compensation for no-show
await stripe.transfers.create({
  amount: 2000,
  currency: 'aud',
  destination: lawyer.stripeAccountId,
  transfer_group: booking.id,
});
```

- **Benefit:** User with "skin in the game" virtually never no-shows
- **Lawyer benefit:** No-show rate drops from 20% → <5%
- **User perception:** "This is serious" (filters out tyre-kickers)

**Fraud Prevention Flow Summary:**
```
User completes calculation
↓
Triggers "Get Legal Help" button
↓
Submits inquiry form
↓
→ Check: Honeypot field filled? → REJECT (silent)
↓
→ Check: IP address flagged (>3 bookings/24hrs)? → MANUAL REVIEW QUEUE
↓
Require: Mobile OTP verification via SMS
↓
→ Fail OTP? → REJECT with "Verification failed" message
↓
Optional: Charge $20-50 booking deposit (Stripe)
↓
Show: Available calendar slots (Calendly or custom)
↓
User selects time slot
↓
Booking confirmed → Lawyer charged $100 (Stripe)
↓
Lawyer receives booking email + calendar invite
```

#### 3. Lawyer Dashboard (Billing Transparency)

**Required Features:**

**A. Bookings List**
- View all bookings: confirmed, attended, no-show, cancelled
- Filter by date range, status
- Click booking → See user details, calculation data, booking brief

**B. Invoice History**
- Monthly billing statement
- Download PDF invoice
- See breakdown: "10 bookings × $100 = $1,000 + GST"

**C. Dispute Submission**
- Form: "I believe booking #123 was fraudulent because..."
- Upload evidence (screenshots, email threads)
- Track dispute status (pending, approved, rejected)

**D. Payment Methods**
- Add/update credit card
- View past transactions
- See next billing date

**Invoice Template Example:**
```
INVOICE #2024-12-001
-------------------
[Your Business Name] ABN [Your ABN]
December 2024 Consultation Bookings

Date       Client Name    Postcode    Amount
Dec 5      John S.        3000        $100.00
Dec 8      Sarah M.       3001        $100.00
Dec 12     Michael L.     3002        $100.00

Subtotal:                              $300.00
GST (10%):                             $30.00
TOTAL DUE:                             $330.00

Payment Terms: Charged to card ending 4242 on Dec 15, 2024

Note: This fee is for marketing and administrative booking
services. It is not a referral fee. You may include this
cost in your practice overheads for client cost disclosure
purposes (Legal Profession Uniform Law s174).

Questions? Contact: [your email]
```

**Regulatory Compliance Display:**
- ✅ Clear fee description: "Booking Fee (Marketing & Administration Service)"
- ✅ GST itemized separately
- ✅ Disclosure note for lawyer's client billing
- ✅ NOT labeled as "referral fee" or "commission"

#### 4. Service Agreement Template

**Critical:** Before charging any lawyer, they must sign a service agreement.

**Create:** `docs/LAWYER_SERVICE_AGREEMENT_TEMPLATE.md`

**Key Clauses:**

**1. Nature of Relationship**
```markdown
## Services Provided
The Service Provider will:
1. Operate a child support calculator application
2. Identify users with complex legal matters (via algorithmic triggers)
3. Facilitate booking of consultations on Firm's calendar via third-party platform (Calendly)
4. Charge Firm a fee for each confirmed booking

## Nature of Relationship
This is a **marketing and administrative service agreement**, NOT a referral arrangement.
- Provider does not practice law or provide legal advice
- Provider does not influence Firm's legal advice to clients
- Firm maintains complete professional independence (ASCR Rule 4.1.4)
- Fee is for marketing exposure and booking administration only
```

**2. Fees & Payment**
```markdown
## Fees
- **Booking Fee:** $100.00 (+ GST) per confirmed consultation booking
- **Definition of "Booking":** User selects time slot on Firm's calendar via Calendly AND confirms via OTP verification
- **Payment Terms:** Automatic charge to saved payment method when booking confirmed
- **Refunds:** Available if booking was fraudulent/bot (verified by Provider after manual review)

## What Constitutes a Chargeable Booking?
1. User completes child support calculation
2. User triggers "Get Legal Help" button (complexity threshold met)
3. User submits inquiry form with verified mobile number (OTP)
4. User selects available time slot on Firm's Calendly calendar
5. Booking confirmed (calendar invite sent)

Fee is charged at Step 5, regardless of whether:
- User attends consultation
- User becomes paying client
- Firm accepts the booking
```

**3. Disclosure to Clients**
```markdown
## Disclosure to Clients (ASCR Rule 12.4.4)
Firm may disclose this arrangement to clients as follows:
"We use a third-party booking platform that charges us an administrative fee for facilitating consultation bookings."

This is NOT a referral fee requiring detailed disclosure under ASCR Rule 12.4.3 (referral arrangements). The fee is for marketing and administrative services, not for the referral of a specific client.

However, Firm must include this cost in its general overheads when preparing costs disclosure for clients under Legal Profession Uniform Law Section 174.
```

**4. Data Privacy & Confidentiality**
```markdown
## Data Privacy
- User contact details (name, phone, email) shared with Firm only after booking confirmed
- User calculation data (income, care nights) shared in booking brief for case assessment
- Provider will not sell user data to third parties
- Firm will handle all client data per Privacy Act 1988 requirements
- Firm responsible for maintaining client-lawyer privilege
```

**5. Term & Termination**
```markdown
## Term & Termination
- **Initial Term:** 3 months (Month 4-6 of Year 1)
- **Renewal:** Auto-renews month-to-month unless terminated
- **Termination by Firm:** 30 days written notice
- **Termination by Provider:** 30 days written notice
- **Effect of Termination:**
  - Firm remains liable for bookings confirmed before termination date
  - No refunds for unused "potential" bookings
  - Firm profile removed from app within 5 business days
```

**Lawyer Onboarding Flow:**
1. Lawyer expresses interest (pilot or direct signup)
2. Send service agreement via DocuSign/HelloSign
3. Lawyer signs agreement
4. Lawyer adds payment method (Stripe Checkout)
5. Lawyer connects Calendly account (or Provider creates one for them)
6. Lawyer profile goes live in app
7. First booking triggers first charge

---

### Revenue Projections (Phase 3)

Based on `docs/MASTER_PLAN.md` conservative case:

**Per Law Firm (Conservative):**
- 4 bookings/month × $100 = $400/month revenue

**Developer Revenue (10 firms):**
- 40 total bookings/month × $100 = $4,000/month
- Annual: **$48,000/year**

**Key Metric to Track:** Lawyer retention rate
- Target: >80% of lawyers renew after first 3 months
- If <50%, investigate: price too high? Lead quality poor? Technical issues?

---

## Phase 4: Hybrid Model ($149/month + $50/booking)

**Duration:** Months 10+
**Goal:** Introduce subscription tier for high-volume lawyers, stabilize revenue with MRR
**Revenue Target:** $155k-383k annually

### Activation Criteria

Before launching hybrid model:
- ✅ Phase 3 operating for 6+ months
- ✅ 15+ law firms paying consistently
- ✅ Lawyer feedback: "I want more bookings" or "Can I get priority?"
- ✅ Evidence of demand for volume discounts

### Model Structure

**Tier 1: Premium Partner**
- **Monthly Subscription:** $149/month
- **Booking Fee:** $50 per consultation (50% discount from pay-as-you-go)
- **Benefits:**
  - Priority routing (bookings offered to Premium Partners first before pay-as-you-go)
  - Access to anonymized market data from calculator (income trends, complexity distribution)
  - Unlimited bookings at reduced rate
- **Break-even:** 3 bookings/month (3 × $50 savings = $150 saved vs pay-as-you-go)

**Tier 2: Pay-As-You-Go**
- **Monthly Subscription:** $0
- **Booking Fee:** $100 per consultation (standard rate)
- **Benefits:** Flexible, no commitment, good for low-volume firms (1-2 bookings/month)

### Why This Works

**For High-Volume Firms:**
- 10 bookings/month under Premium Partner:
  - Cost: $149/month + (10 × $50) = $649/month
  - vs Pay-As-You-Go: 10 × $100 = $1,000/month
  - **Savings: $351/month (35% discount)**

**For Low-Volume Firms:**
- 1-2 bookings/month:
  - Pay-As-You-Go cost: $100-200/month
  - Premium Partner cost: $149 + $50-100 = $199-249/month
  - **Pay-As-You-Go is cheaper** → No pressure to subscribe

**For Developer:**
- Recurring Monthly Revenue (MRR) stabilizes cash flow
- Predictable baseline income: 20 Premium Partners × $149 = $2,980/month
- Easier to forecast revenue, plan hiring, invest in features

### Technical Changes Required

**1. Subscription Management (Stripe Billing)**
```javascript
// Create subscription when lawyer upgrades to Premium Partner
const subscription = await stripe.subscriptions.create({
  customer: lawyer.stripeCustomerId,
  items: [{
    price: PREMIUM_PARTNER_PRICE_ID, // $149/month recurring
  }],
  metadata: {
    lawyerId: lawyer.id,
    tier: 'premium_partner',
  },
});

// Save subscription status
await updateLawyer(lawyer.id, {
  subscriptionTier: 'premium_partner',
  stripeSubscriptionId: subscription.id,
  subscriptionStatus: subscription.status, // active, past_due, canceled
});
```

**2. Tiered Pricing Logic**
```javascript
// When booking is confirmed
async function chargeForBooking(booking) {
  const lawyer = await getLawyer(booking.lawyerId);

  const amount = lawyer.subscriptionTier === 'premium_partner'
    ? 5000  // $50 for Premium Partners
    : 10000; // $100 for Pay-As-You-Go

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'aud',
    customer: lawyer.stripeCustomerId,
    description: `Consultation booking - ${booking.userName}`,
    metadata: {
      bookingId: booking.id,
      tier: lawyer.subscriptionTier,
    },
  });

  // Record different pricing tier in transaction log
  await saveTransaction({
    lawyerId: lawyer.id,
    bookingId: booking.id,
    amount: amount / 100, // Convert cents to dollars
    tier: lawyer.subscriptionTier,
    stripePaymentIntentId: paymentIntent.id,
  });
}
```

**3. Dashboard Upgrade**

**New Features:**
- **Subscription Status Card:**
  - Current tier (Premium Partner or Pay-As-You-Go)
  - Monthly savings (if Premium Partner)
  - Upgrade/downgrade button
  - Next billing date

- **Usage & Savings:**
  - This month: 12 bookings × $50 = $600 booking fees
  - Subscription: $149
  - Total cost: $749
  - vs Pay-As-You-Go: $1,200
  - **You saved: $451 this month**

- **Market Data Access (Premium Partners Only):**
  - Average income of app users in your region
  - Complexity score distribution (how many high-value cases?)
  - Peak inquiry times (when do users need help?)

### Migration Strategy

**1. Grandfather Existing Firms**
- Email all current Phase 3 customers:
  - "We're introducing a new Premium Partner tier..."
  - "For the next 90 days, you'll keep your current $100/booking rate"
  - "After 90 days, you can choose: Premium Partner or Pay-As-You-Go"

**2. Introduce Hybrid Gradually**
- Month 10: Announce new tier to all lawyers
- Month 11: Allow upgrades, track adoption
- Month 12: If <30% adopt Premium, model needs adjustment

**3. Let Market Decide**
- Don't force migration
- Provide clear ROI calculator on dashboard: "If you get >3 bookings/month, Premium saves you money"
- Track: Do high-volume firms upgrade? Do low-volume firms stay pay-as-you-go?

**4. Track Adoption**
- Target: >30% of firms upgrade to Premium Partner within 3 months
- If <10%: Price too high, reduce to $99/month or $75/booking
- If >60%: Price too low, could increase to $199/month

---

## Key Metrics Dashboard

Track these metrics throughout all phases:

| Metric | Target | Phase 1-2 (Free) | Phase 3 (Paid) | Phase 4 (Hybrid) |
|--------|--------|------------------|----------------|------------------|
| **Booking Completion Rate** | >40% | Measure | Measure | Measure |
| **No-Show Rate** | <20% | Measure | <15% (with deposits) | <10% |
| **Consultation → Client** | >20% | Measure | Measure | Measure |
| **Lawyer Retention (3-month)** | >80% | N/A | Measure | >90% |
| **Average Bookings/Firm/Month** | - | Measure | 4-10 | 10-20 |
| **Revenue Per Booking** | - | $0 | $100 | $50-100 (blended) |
| **Monthly Recurring Revenue (MRR)** | - | $0 | $0 | $2,980+ (from subscriptions) |
| **Premium Partner Adoption** | >30% | N/A | N/A | Measure |

**How to Track:**
- Build internal analytics dashboard (Metabase, Redash, or custom)
- Connect to production database
- Refresh daily
- Alert on anomalies (e.g., no-show rate >30% = investigate fraud)

---

## Common Implementation Questions

### Q: When exactly do we charge the lawyer?
**A:** Immediately when booking is confirmed (user completes OTP and selects time slot). NOT when consultation occurs.

**Rationale:** Lawyer's calendar is blocked either way. They're paying for the time slot, not the outcome.

### Q: What if user doesn't show up to the consultation?
**A:** Lawyer still charged. They blocked their calendar time.

**User booking deposit option:**
- Charge user $20-50 (refundable)
- If user no-shows, offer deposit to lawyer as compensation
- If user attends, refund deposit or deduct from legal fees

### Q: What if lawyer claims the lead was "low quality"?
**A:** Define "quality" upfront in service agreement.

**Quality criteria:**
- Booking brief includes: calculation results, complexity score, user message, verified phone number
- If brief was accurate, no refund
- If user was bot/fake (OTP failed retroactively, IP flagged), refund available
- Process: Lawyer submits dispute via dashboard → Manual review → Approve/reject within 3 business days

### Q: Do we need ABN/business registration before charging lawyers?
**A:** Yes. You're providing services for payment.

**Required:**
1. Register business (Sole trader or Pty Ltd)
2. Obtain ABN (Australian Business Number)
3. Register for GST (if revenue >$75k/year, or voluntarily)
4. Set up accounting system (Xero, QuickBooks)
5. Open business bank account
6. Consider professional indemnity insurance (optional but recommended)

### Q: What about lawyer indemnity insurance?
**A:** Not required for platform operator (you're not practicing law).

- Lawyers must maintain their own professional indemnity insurance
- Your service agreement should include disclaimer: "Provider does not practice law and is not liable for Firm's legal advice"

### Q: Can lawyers deduct this cost for tax purposes?
**A:** Yes (consult their accountant).

- This is a business expense (marketing/client acquisition cost)
- Deductible as ordinary business expense
- Include in overhead calculations for client cost disclosure

### Q: What if a lawyer's credit card declines?
**A:** Stripe handles this automatically.

**Flow:**
1. Booking confirmed → Stripe attempts charge
2. Card declines → Stripe sends webhook
3. Your system: Pause lawyer's account, send urgent email: "Payment failed, please update card"
4. Lawyer updates payment method
5. Stripe retries charge
6. If still fails after 7 days → Disable lawyer's profile in app (no new bookings routed)

**Communicate clearly:**
- "Your payment method failed. Please update within 7 days to continue receiving bookings."
- "Outstanding balance: $300 (3 bookings). Update payment method here."

### Q: Do we need to collect GST?
**A:** Yes, if your annual revenue exceeds $75,000 or you voluntarily register for GST.

**GST on $100 booking:**
- Lawyer pays: $100 + $10 GST = $110 total
- You keep: $100 (revenue)
- You remit to ATO: $10 (GST collected)

**GST on $149/month subscription:**
- Lawyer pays: $149 + $14.90 GST = $163.90 total
- You keep: $149 (revenue)
- You remit to ATO: $14.90 (GST collected)

**Quarterly GST reporting:**
- Lodge Business Activity Statement (BAS) with ATO
- Report: GST collected from lawyers
- Claim: GST paid on business expenses (Stripe fees, Twilio costs, etc.)

---

## Compliance Checklist

Before launching paid model (Phase 3):

### Legal & Regulatory
- [ ] Service Agreement drafted and reviewed (consider legal review)
- [ ] Service Agreement defines "marketing and administrative service" (NOT referral)
- [ ] Disclosure clause for lawyers (ASCR Rule 12.4.4) included
- [ ] Fee structure clearly stated ($100 per booking, not percentage of fees)
- [ ] Termination clause (30 days notice) included
- [ ] Data privacy clause compliant with Privacy Act 1988

### Business Registration
- [ ] Business registered (Sole trader or Pty Ltd)
- [ ] ABN obtained
- [ ] GST registered (if applicable)
- [ ] Business bank account opened
- [ ] Accounting system set up (Xero/QuickBooks)

### Payment & Billing
- [ ] Stripe account created (verified business entity)
- [ ] Invoice template includes GST, clear fee description
- [ ] Lawyer dashboard shows transparent billing breakdown
- [ ] Refund policy documented and communicated
- [ ] Payment failure handling implemented (retry, pause account)

### Fraud Prevention
- [ ] Mobile OTP verification tested (Twilio Verify API)
- [ ] Honeypot fields implemented in inquiry form
- [ ] IP fingerprinting deployed (FingerprintJS)
- [ ] Manual review queue built for flagged submissions
- [ ] Optional: Booking deposit flow tested (Stripe)

### Technical Implementation
- [ ] Calendar integration working (Calendly or Google Calendar)
- [ ] Booking confirmation emails tested
- [ ] Stripe payment intent creation tested (charge $100 on booking)
- [ ] Webhook handling implemented (Calendly → booking confirmed → charge lawyer)
- [ ] Error handling: What if Stripe charge fails? (Pause booking, notify lawyer)

### Lawyer Onboarding
- [ ] Service agreement signup flow (DocuSign/HelloSign)
- [ ] Payment method collection (Stripe Checkout)
- [ ] Calendly account connection flow
- [ ] Welcome email with instructions
- [ ] First booking test completed

### Documentation & Communication
- [ ] Privacy policy updated (user data handling disclosed)
- [ ] Terms of service includes dispute resolution process
- [ ] FAQ page: "How does pricing work?"
- [ ] Email template library (welcome, invoice, payment failure, refund processed)

---

## Technical Architecture Summary

```
User Flow:
Calculator → Complexity Trigger → "Get Legal Help" → Inquiry Form
→ Honeypot Check → Mobile OTP Verification → Calendar Selection (Calendly)
→ (Optional: Booking Deposit $20-50) → Booking Confirmed
→ Lawyer Charged $100 (Stripe) → Booking Email Sent → Calendar Invite Sent

Data Flow:
User Data → Verification (OTP) → Booking Record (Database) → Stripe Charge (Lawyer)
→ Lawyer Invoice (Email + Dashboard) → Monthly Billing Statement (Stripe)

Security Flow:
SSL/TLS → Rate Limiting → OTP Verification → IP Fingerprinting
→ Honeypot Detection → Manual Review Queue (for flagged submissions)
→ Stripe 3D Secure (lawyer payment methods)

Payment Flow (Phase 3):
Booking Confirmed → create payment intent (Stripe API)
→ Charge lawyer's saved payment method (Stripe Customer)
→ If successful: Save transaction record, send invoice email
→ If failed: Retry automatically (Stripe), send payment failure email after 3 attempts

Payment Flow (Phase 4 Hybrid):
- Subscription: Stripe automatic monthly billing ($149)
- Per-booking: Tiered pricing logic ($50 for Premium, $100 for Pay-As-You-Go)
- Dashboard: Show subscription status, usage, savings
```

---

## Next Steps

### 1. Complete Phase 1-2 (Free Pilot)
- Build booking flow with calendar integration
- Implement OTP verification
- Test with 50+ free bookings
- Gather conversion data (booking → consultation → client)

### 2. Review This Guide
- Identify any compliance gaps
- Identify technical concerns (e.g., don't have ABN yet)
- Plan timeline for Phase 3 paid launch

### 3. Business Registration (Before Phase 3)
- Register business
- Obtain ABN
- Register for GST (if applicable)
- Open business bank account
- Set up accounting system

### 4. Implement Phase 3 (Paid Launch)
- Build Stripe payment infrastructure
- Deploy fraud prevention stack
- Create lawyer dashboard
- Draft and review service agreement
- Launch with 3-5 pilot firms (Phase 2 graduates)

### 5. Monitor Metrics
- Track booking rates, lawyer satisfaction, revenue
- Weekly review: Are lawyers happy? Is revenue growing?
- Monthly review: Retention rate, unit economics, profitability

### 6. Evolve to Phase 4 (Hybrid Model)
- When scale supports it (15+ firms, 6+ months of operation)
- Introduce Premium Partner tier
- Monitor adoption
- Adjust pricing if needed

---

## Questions?

**For Regulatory Deep-Dive:**
- See `docs/PRICING_STRATEGY_ANALYSIS.md` Section 2 (Regulatory Compliance)
- See `docs/PRICING_STRATEGY_ANALYSIS.md` Section 4 (Why Option 4 is a Fatal Flaw)

**For Business Model Overview:**
- See `docs/MASTER_PLAN.md` lines 82-149 (Revenue Projections)
- See `docs/PHASE_1_2_UPDATES.md` (Pricing & Revenue Model section)

**For Implementation Tasks:**
- See `guides/phase1/CHECKLIST.md` (Phase 1 technical tasks)
- See `guides/phase2/CHECKLIST.md` (Phase 2 lawyer recruitment)

**For Service Agreement Template:**
- See section "Phase 3 → 4. Service Agreement Template" above
- Customize for your business name, ABN, contact details
- Consider legal review before use

---

**Last Updated:** December 20, 2024
**Status:** Ready for implementation
**Next Action:** Complete Phase 1-2 free pilot, gather conversion data, prepare for Phase 3 paid launch
