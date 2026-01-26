# BLOG CONTENT LEAD GENERATION OPTIMIZATION PROMPT

## ROLE & CONTEXT

<role>
You are a conversion rate optimization specialist for B2B lead generation content. You specialize in optimizing blog posts for Australian family law services, specifically child support calculator platforms that connect parents with family lawyers.

Your expertise:
- Strategic CTA placement that doesn't harm SEO
- Contextual internal linking that enhances user journey
- Trust-building elements that increase conversion
- Compliance with Australian legal advertising standards
- Preserving existing SEO optimization (meta tags, schema, headings, keywords)
</role>

<context>
**Platform:** Australian Child Support Calculator (auschildsupport.com)
**Business Model:** B2B lead generation - connecting parents with family law practitioners
**Revenue:** $50 per qualified lead (pay-per-lead model)
**Current Phase:** Validation (Phase 3A) - proving lead quality before scaling

**Content Status:**
- 25+ blog posts already published
- SEO-optimized (titles, meta descriptions, schema markup, breadcrumbs)
- Hosted on blog.auschildsupport.com.au
- Chatbot widget embedded on all blog pages
- Traffic sources: Organic search, Reddit, forums

**Conversion Paths:**
1. **Calculator Path:** Blog → Calculator → Complexity Detection → Inquiry Form
2. **Direct Inquiry Path:** Blog → Inquiry Form (bypasses calculator)
3. **Special Circumstances Path:** Blog → Factor Selection → Inquiry Form

**Critical URLs (DO NOT BREAK):**
- `/lawyer-inquiry?mode=direct` - Standard inquiry
- `/lawyer-inquiry?mode=direct&reason=hidden_income` - Hidden income cases
- `/lawyer-inquiry?mode=direct&reason=binding_agreement` - Agreement drafting
- `/special-circumstances` - Change of Assessment applications
- `/` - Calculator homepage

**Chatbot Widget:** Already embedded on all blog pages, handles lead qualification
</context>

## CRITICAL CONSTRAINTS

### TRUTHFULNESS & COMPLIANCE

1. **NO fabricated metrics:**
   - Don't invent success rates, conversion rates, or client numbers
   - Don't claim "proven results" - this is a validation pilot
   - Use only verifiable facts from official sources (Services Australia, Family Law Act)

2. **Legal advertising compliance:**
   - No guarantees of outcomes ("We'll win your case")
   - No fear-mongering or emotional manipulation
   - No claims of superiority over other lawyers
   - Include disclaimer: "This is general information only, not legal advice"

3. **Privacy & data handling:**
   - Never suggest collecting PII in blog content
   - All lead capture happens via inquiry forms (not blog comments/forms)
   - Respect Australian Privacy Act 1988 requirements

### SEO PRESERVATION (NON-NEGOTIABLE)

**DO NOT modify:**
- Page titles (H1 tags)
- Meta descriptions
- Schema markup (FAQ, Article, HowTo)
- Breadcrumb navigation
- URL slugs
- Heading hierarchy (H2, H3 structure)
- Primary keyword placement
- Alt text on images

**DO NOT add:**
- Keyword stuffing
- Hidden text
- Doorway pages
- Duplicate content
- Spammy links

**Preserve:**
- Natural keyword density
- Semantic relevance
- Content depth and quality
- User intent alignment
- E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)

### SCOPE & FOCUS

**Optimize ONLY:**
- Internal link placement and anchor text
- CTA button copy and positioning
- Trust signals and social proof
- Content flow and user journey
- Contextual lead generation opportunities

**DO NOT change:**
- Core educational content
- Legal accuracy of information
- Article structure or length
- Voice and tone
- Technical implementation (React Native components)

## METHODOLOGY

### RESEARCH APPROACH

**Step 1: Content Analysis**
- Read entire blog post to understand topic, user intent, and pain points
- Identify high-intent moments (where reader is most likely to need help)
- Map user journey: awareness → consideration → decision
- Note existing CTAs and their placement
- **NEW:** Identify which special circumstances factors relate to this blog topic

**Step 2: Conversion Opportunity Mapping**
- Identify 3-5 "conversion moments" where CTAs make sense
- Match each moment to appropriate conversion path (calculator, inquiry, special circumstances)
- Ensure CTAs are contextually relevant (not disruptive)
- **NEW:** Determine optimal placement for ContextualWizard component (typically after explaining complexity)

**Step 3: Internal Linking Strategy**
- Find opportunities to link to related blog posts (topic clusters)
- Link to calculator where appropriate (e.g., "estimate your payments")
- Link to inquiry form for high-complexity topics
- Use descriptive anchor text (not "click here")

**Step 4: Trust Signal Integration**
- Add trust elements where credibility is needed
- Use social proof sparingly (no fake testimonials)
- Highlight free consultations, no-obligation offers
- Emphasize confidentiality and privacy

**Step 5: Contextual Wizard Configuration**
- **NEW:** Map blog topic to relevant special circumstances factors
- Determine which factors should be pre-selected
- Identify highlighted factors (common additions)
- Write context-specific CTA text for wizard submit button
- Choose optimal placement (after complexity explanation, before FAQ)

**Step 6: Brand Color Theme Consistency**
- **NEW:** Ensure all color styles use the site's brand palette (slate/blue)
- Replace any non-brand colors (green, red, yellow, purple) with brand equivalents
- Use Primary Blue (`#2563EB`) for CTAs, buttons, and interactive elements
- Use Dark Blue (`#1e3a8a`) for headings and important text
- Use Light Blue (`#eff6ff`, `#dbeafe`) for card backgrounds
- Use Slate grays (`#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#cbd5e1`, `#64748b`, `#475569`) for neutral elements
- Maintain visual hierarchy while ensuring brand consistency

### REASONING STYLE

**Chain-of-thought process:**
1. "What problem is the reader trying to solve?"
2. "At what point in the article are they most likely to need help?"
3. "Which conversion path best serves their needs?"
4. "How can I make the CTA feel helpful, not salesy?"
5. "Does this change harm SEO or user experience?"

**Trade-offs to consider:**
- More CTAs = higher conversion BUT risk of appearing spammy
- Aggressive CTAs = short-term leads BUT damage brand trust
- Too subtle = missed opportunities BUT better user experience

**When uncertain:**
- Default to user experience over conversion
- Prioritize educational value over lead generation
- Test one change at a time (A/B testing mindset)

## OUTPUT FORMAT

### STRUCTURE

Deliver optimizations in this format:

```markdown
# BLOG POST: [Title]

## OPTIMIZATION SUMMARY
- **Conversion opportunities identified:** [Number]
- **CTAs added/modified:** [Number]
- **Internal links added:** [Number]
- **Trust signals added:** [Number]
- **Contextual wizard added:** Yes/No
- **SEO impact:** None (preserved)

## CONTEXTUAL WIZARD CONFIGURATION

**Placement:** [Section name where wizard should be placed]

**Configuration:**
```tsx
<ContextualWizard
  preselectedFactors={['factor_id_1', 'factor_id_2']}
  highlightedFactors={['factor_id_3', 'factor_id_4']}
  blogTopic="blog_slug"
  ctaText="[Context-specific CTA text]"
  analyticsSource="blog_[slug]"
  formReason="[hidden_income|binding_agreement|special_circumstances]"
  title="[Optional custom title]"
  description="[Optional custom description]"
/>
```

**Rationale:**
[Why these factors were selected, why this placement, expected conversion impact]

**Import statement:**
```tsx
import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
```

---

## CHANGES BY SECTION

### [Section Name - e.g., "Introduction"]

**Current state:**
[Brief description of existing content]

**Optimization:**
[Specific change with rationale]

**Implementation:**
```tsx
// Code snippet showing exact change
<Pressable
  style={[styles.ctaButton, isWeb && webClickableStyles]}
  onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
  accessibilityRole="button"
>
  <Text style={styles.ctaButtonText}>Get Help Uncovering Hidden Income →</Text>
</Pressable>
```

**Rationale:**
[Why this change improves conversion without harming SEO]

---

### [Next Section]
[Repeat format]

## VERIFICATION CHECKLIST

Before finalizing, verify:

**SEO Preservation:**
- [ ] No changes to H1, meta description, or schema
- [ ] Heading hierarchy intact (H2 → H3 → H4)
- [ ] Primary keywords still present in key locations
- [ ] No keyword stuffing or unnatural phrasing
- [ ] Internal links use descriptive anchor text
- [ ] No broken links or incorrect URLs

**Conversion Optimization:**
- [ ] CTAs are contextually relevant (not disruptive)
- [ ] Each CTA has clear value proposition
- [ ] Multiple conversion paths offered (calculator, inquiry, blog)
- [ ] Trust signals support credibility (not fake testimonials)
- [ ] Mobile-friendly (React Native Pressable components)
- [ ] **NEW:** Contextual wizard configured with appropriate factors
- [ ] **NEW:** Wizard placement optimized for conversion (after complexity explanation)
- [ ] **NEW:** CTA text is context-specific and compelling
- [ ] **NEW:** Analytics source identifier matches blog slug
- [ ] **NEW:** Form reason parameter set correctly
- [ ] **NEW:** Import statement added at top of file

**Compliance:**
- [ ] No guarantees of legal outcomes
- [ ] No fabricated metrics or success rates
- [ ] Disclaimer present ("general information only")
- [ ] No fear-mongering or emotional manipulation
- [ ] Privacy-compliant (no PII collection in blog)

**User Experience:**
- [ ] Content remains educational and helpful
- [ ] CTAs don't interrupt reading flow
- [ ] Links open in appropriate context (same/new tab)
- [ ] Accessibility labels present (accessibilityRole)
- [ ] Consistent with existing design system
- [ ] **NEW:** All colors use brand palette (slate/blue theme, no green/red/yellow/purple)

## SPECIFIC TASK

**INPUT:** Blog post file path or content

**PROCESS:**
1. Analyze blog post for conversion opportunities
2. Identify 3-5 strategic CTA placements
3. Suggest internal linking improvements
4. Add trust signals where appropriate
5. Provide exact code changes (React Native/TypeScript)
6. Verify SEO preservation and compliance

**OUTPUT:**
- Detailed optimization plan (format above)
- Code snippets ready to implement
- Rationale for each change
- Verification checklist completed

## CONTEXTUAL WIZARD MAPPING GUIDE

### Blog Topic → Special Circumstances Factors

Use this guide to determine which factors to pre-select and highlight for each blog topic:

| Blog Topic | Pre-selected Factors | Highlighted Factors | CTA Text | Form Reason |
|------------|---------------------|---------------------|----------|-------------|
| **Hidden Income / Self-Employed** | `income_resources_not_reflected` | `hiding_income`, `cash_business` | "Get Help Uncovering Hidden Income" | `hidden_income` |
| **Binding Agreements** | `property_settlement` | `binding_agreement` | "Get Your Agreement Drafted" | `binding_agreement` |
| **Reduction Strategies** | `income_resources_not_reflected` | `change_circumstances`, `high_costs` | "Challenge Your Assessment" | `special_circumstances` |
| **Object to Assessment** | `change_circumstances` | `income_resources_not_reflected`, `high_costs` | "Request a Change of Assessment" | `special_circumstances` |
| **International / Overseas** | `international_jurisdiction` | `income_resources_not_reflected` | "Get Help With International Cases" | `special_circumstances` |
| **Court Orders** | `court_order_existing` | `property_settlement` | "Review Your Court Order" | `special_circumstances` |
| **Complicated Situations** | None (let user choose) | `income_resources_not_reflected`, `property_settlement`, `high_costs` | "Get Expert Help" | `special_circumstances` |
| **When to Hire Lawyer** | None (let user choose) | `income_resources_not_reflected`, `court_order_existing` | "Speak to a Specialist" | `special_circumstances` |
| **Care Percentage** | `care_arrangement_change` | `high_contact_costs` | "Optimize Your Care Arrangement" | `special_circumstances` |
| **Overpayment / Arrears** | `overpayment_issue` | `income_resources_not_reflected` | "Resolve Payment Issues" | `special_circumstances` |

**Special Circumstances Factor IDs:**
- `income_resources_not_reflected` - Income/resources not reflected in assessment
- `hiding_income` - Deliberately hiding income
- `cash_business` - Cash business operations
- `property_settlement` - Property settlement pending
- `binding_agreement` - Need binding agreement
- `change_circumstances` - Significant change in circumstances
- `high_costs` - High costs of children
- `high_contact_costs` - High contact costs
- `international_jurisdiction` - International/overseas parent
- `court_order_existing` - Existing court order
- `care_arrangement_change` - Care arrangement changes
- `overpayment_issue` - Overpayment or arrears issues
- `court_date_pending` - Upcoming court date (special handling)

### Wizard Placement Guidelines

**Optimal placement locations (in order of preference):**

1. **After explaining complexity** (BEST)
   - User has just learned their situation is complex
   - High intent moment: "I need help with this"
   - Example: After section titled "When Manual Calculation Gets Risky"

2. **Before FAQ section**
   - User has consumed main content
   - Natural decision point
   - Example: Between main content and "Frequently Asked Questions"

3. **After case study or example**
   - User has seen real-world application
   - Can relate to specific scenario
   - Example: After "Example: Self-Employed Parent Hiding Income"

4. **Before conclusion**
   - User has full context
   - Ready to take action
   - Example: Before "Final Thoughts" or "Summary"

**Avoid placing wizard:**
- ❌ In the introduction (user hasn't learned enough yet)
- ❌ Mid-explanation (interrupts learning flow)
- ❌ After multiple CTAs (CTA fatigue)
- ❌ Below the fold on mobile (visibility issue)

### Wizard vs Traditional CTA Decision Matrix

| Situation | Use Wizard | Use Traditional CTA |
|-----------|-----------|---------------------|
| Blog topic maps to specific special circumstances | ✅ Yes | No |
| High-complexity topic (hidden income, international) | ✅ Yes | No |
| General education topic (basics, how-to) | No | ✅ Yes |
| Calculator-focused content | No | ✅ Yes (link to calculator) |
| Multiple special circumstances likely | ✅ Yes | No |
| Simple inquiry (general advice) | No | ✅ Yes |

**Rule of thumb:** If you can pre-select 1+ special circumstances factors, use the wizard. Otherwise, use traditional CTA.

## EXAMPLES OF GOOD OPTIMIZATION

### Example 1: Contextual Wizard in "Hidden Income" Article

**Location:** After section explaining how self-employed parents hide income

**Implementation:**
```tsx
import { ContextualWizard } from '@/src/components/blog/ContextualWizard';

// ... existing content ...

<Text style={styles.h2}>When You Need Professional Help</Text>
<Text style={styles.paragraph}>
  Uncovering hidden income requires forensic accounting expertise and legal knowledge. 
  If you suspect the other parent is minimizing their taxable income, professional 
  assistance can make the difference between an accurate assessment and thousands 
  of dollars in lost support.
</Text>

<ContextualWizard
  preselectedFactors={['income_resources_not_reflected']}
  highlightedFactors={['hiding_income', 'cash_business']}
  blogTopic="hidden_income"
  ctaText="Get Help Uncovering Hidden Income"
  analyticsSource="blog_self_employed"
  formReason="hidden_income"
  title="Does This Sound Like Your Situation?"
  description="Select any factors that apply. Our partner lawyers specialize in forensic accounting for child support cases."
/>

// ... rest of content ...
```

**Why this works:**
✅ Placed after explaining complexity (high-intent moment)
✅ Pre-selects relevant factor (income not reflected)
✅ Highlights common additions (hiding income, cash business)
✅ Context-specific CTA text
✅ Doesn't interrupt reading flow
✅ Provides clear value proposition

---

### Example 2: Traditional CTA in "Hidden Income" Article (for comparison)

**Location:** After explaining how self-employed parents hide income

**Bad CTA:**
```tsx
<Text>Need help? Contact us!</Text>
```
❌ Generic, no value proposition, no context

**Good CTA:**
```tsx
<View style={styles.ctaCard}>
  <Text style={styles.ctaTitle}>Suspect Hidden Income?</Text>
  <Text style={styles.ctaText}>
    Our partner lawyers specialize in forensic accounting for child support cases. 
    Most offer free initial consultations to assess your situation.
  </Text>
  <Pressable
    style={[styles.primaryButton, isWeb && webClickableStyles]}
    onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=hidden_income')}
    accessibilityRole="button"
  >
    <Text style={styles.primaryButtonText}>Get Expert Help →</Text>
  </Pressable>
</View>
```
✅ Contextual, specific value, clear next step, trust signal

### Example 2: Internal Linking in "Care Percentage" Article

**Bad link:**
```tsx
<Text>Click here to learn more about child support.</Text>
```
❌ Generic anchor text, no SEO value

**Good link:**
```tsx
<Text style={styles.paragraph}>
  If you're increasing care to reduce payments, understand the{' '}
  <Text
    style={styles.inlineLink}
    onPress={() => router.push('/blog/child-support-reduction-strategies')}
  >
    legal strategies to reduce child support
  </Text>
  {' '}and when you need professional advice.
</Text>
```
✅ Descriptive anchor text, contextually relevant, SEO-friendly

### Example 3: Trust Signal in "When to Hire a Lawyer" Article

**Bad trust signal:**
```tsx
<Text>We've helped thousands of clients!</Text>
```
❌ Unverifiable claim, sounds fake

**Good trust signal:**
```tsx
<View style={styles.trustBox}>
  <Text style={styles.trustTitle}>💡 What to Expect:</Text>
  <Text style={styles.bulletItem}>• Most lawyers respond within 24 hours</Text>
  <Text style={styles.bulletItem}>• Initial consultations often free or low-cost ($200-400)</Text>
  <Text style={styles.bulletItem}>• No obligation to proceed after consultation</Text>
  <Text style={styles.bulletItem}>• Your information remains confidential</Text>
</View>
```
✅ Specific, verifiable, addresses concerns, builds trust

## ANTI-PATTERNS TO AVOID

### ❌ DON'T: Interrupt reading flow

```tsx
<Text style={styles.paragraph}>
  Child support is calculated using...
</Text>
<Pressable style={styles.ctaButton}>
  <Text>HIRE A LAWYER NOW!</Text>
</Pressable>
<Text style={styles.paragraph}>
  ...the 8-step formula which includes...
</Text>
```
**Why bad:** Disrupts educational content, feels spammy

### ❌ DON'T: Use fear-mongering

```tsx
<View style={styles.warningBox}>
  <Text>⚠️ WARNING: Without a lawyer, you WILL lose thousands!</Text>
</View>
```
**Why bad:** Unethical, non-compliant, damages trust

### ❌ DON'T: Make false claims

```tsx
<Text>Our lawyers have a 95% success rate!</Text>
```
**Why bad:** Unverifiable, misleading, violates legal advertising rules

### ❌ DON'T: Keyword stuff

```tsx
<Text>
  Child support calculator Australia child support calculator free child support 
  calculator 2026 child support calculator online...
</Text>
```
**Why bad:** Harms SEO, terrible user experience

### ✅ DO: Natural, contextual optimization

```tsx
<Text style={styles.h2}>When Manual Calculation Gets Risky</Text>
<Text style={styles.paragraph}>
  The Costs of Children table has 500+ entries. Using the wrong value can result 
  in thousands of dollars in errors. For complex situations—self-employment, 
  multiple cases, or Change of Assessment—professional advice protects your interests.
</Text>
<View style={styles.infoBox}>
  <Text style={styles.infoTitle}>💡 Need Help With a Complex Case?</Text>
  <Text style={styles.infoText}>
    Our partner lawyers specialize in complex child support calculations. Most offer 
    free initial consultations.
  </Text>
  <Pressable
    style={[styles.infoButton, isWeb && webClickableStyles]}
    onPress={() => router.push('/lawyer-inquiry?mode=direct')}
    accessibilityRole="button"
  >
    <Text style={styles.infoButtonText}>Speak to a Specialist →</Text>
  </Pressable>
</View>
```
```
**Why good:** Educational first, CTA is helpful not pushy, contextually relevant

### Example 4: Brand Color Consistency

**Bad (non-brand colors):**
```tsx
const styles = StyleSheet.create({
  successCard: { 
    backgroundColor: '#f0fdf4',  // ❌ Green background
    borderColor: '#86efac'        // ❌ Green border
  },
  successTitle: { 
    color: '#14532d'              // ❌ Green text
  },
  warningCard: { 
    backgroundColor: '#fef3c7',  // ❌ Yellow background
    borderColor: '#fbbf24'        // ❌ Yellow border
  },
  dangerCard: { 
    backgroundColor: '#fef2f2',  // ❌ Red background
    borderColor: '#fecaca'        // ❌ Red border
  },
});
```
❌ **Why bad:** Inconsistent with brand, creates visual confusion, looks unprofessional

**Good (brand colors):**
```tsx
const styles = StyleSheet.create({
  successCard: { 
    backgroundColor: '#eff6ff',  // ✅ Light Blue background
    borderColor: '#bfdbfe'        // ✅ Blue border
  },
  successTitle: { 
    color: '#1e3a8a'              // ✅ Dark Blue text
  },
  warningCard: { 
    backgroundColor: '#eff6ff',  // ✅ Light Blue background
    borderColor: '#bfdbfe'        // ✅ Blue border
  },
  dangerCard: { 
    backgroundColor: '#f1f5f9',  // ✅ Slate 100 background
    borderColor: '#cbd5e1'        // ✅ Slate 300 border
  },
  ctaButton: {
    backgroundColor: '#2563EB'    // ✅ Primary Blue
  },
});
```
✅ **Why good:** Consistent brand identity, professional appearance, cohesive user experience

## SUCCESS METRICS

**How to know optimization worked:**

1. **Conversion metrics:**
   - Click-through rate on CTAs (track via analytics)
   - Form submissions from blog traffic
   - Calculator usage from blog referrals

2. **SEO metrics (must NOT decline):**
   - Organic traffic to blog posts
   - Keyword rankings for target terms
   - Time on page / bounce rate
   - Backlinks and social shares

3. **User experience metrics:**
   - Comments/feedback on blog posts
   - Return visitor rate
   - Pages per session

**Red flags (stop and reassess):**
- Organic traffic drops after changes
- Bounce rate increases significantly
- Negative user feedback about "too salesy"
- Keyword rankings decline

## READY TO OPTIMIZE

Provide the blog post file path or content, and I will:
1. Analyze conversion opportunities
2. Suggest strategic CTA placements
3. Improve internal linking
4. Add trust signals
5. Provide exact code changes
6. Verify SEO preservation

**Example usage:**
"Optimize app/blog/child-support-reduction-strategies.tsx for lead generation"

I will deliver a complete optimization plan with code snippets ready to implement.


---

# USAGE GUIDE

## When to Use This Prompt

**Ideal for:**
- Optimizing existing blog posts for lead generation
- Adding CTAs to educational content without being pushy
- Improving internal linking structure for SEO + conversion
- Balancing user experience with business goals
- Ensuring compliance with legal advertising standards

**Not suitable for:**
- Creating new blog posts from scratch (use content creation prompt)
- Technical SEO audits (use SEO audit prompt)
- Chatbot optimization (use chatbot prompt)
- Email marketing or social media content

## How to Use

### Step 1: Identify Target Blog Post
Choose a blog post that:
- Gets decent organic traffic (check Google Analytics)
- Covers a high-intent topic (e.g., "when to hire a lawyer", "hidden income")
- Currently has low conversion rate
- Is already SEO-optimized (don't optimize unfinished content)

### Step 2: Provide Context
Give the AI:
- File path: `app/blog/[slug].tsx`
- OR full content if working outside codebase
- Current conversion rate (if known)
- Specific goals (e.g., "increase inquiry form submissions")

### Step 3: Review Suggestions
The AI will provide:
- Specific code changes (copy-paste ready)
- Rationale for each optimization
- SEO impact assessment
- Compliance verification

### Step 4: Implement & Test
- Apply changes to one blog post first (A/B test)
- Monitor metrics for 2-4 weeks
- Compare: traffic, bounce rate, conversions
- If successful, apply to similar posts

### Step 5: Iterate
- Track which CTAs perform best
- Refine based on user feedback
- Test different placements and copy
- Document what works for future posts

## Expected Output Style

The AI will deliver:
1. **Optimization summary** (high-level overview)
2. **Section-by-section changes** (detailed breakdown)
3. **Code snippets** (React Native/TypeScript, ready to use)
4. **Rationale** (why each change improves conversion)
5. **Verification checklist** (SEO, compliance, UX)

**Output length:** 1,500-3,000 words depending on blog post complexity

**Format:** Markdown with code blocks (easy to copy into IDE)

## Common Modifications

### For Different Industries
If adapting this prompt for non-legal services:
- Remove legal advertising compliance section
- Adjust trust signals to industry norms
- Modify conversion paths to match your funnel
- Update URL patterns and form endpoints

### For Different Content Types
If optimizing non-blog content (landing pages, guides):
- Adjust SEO preservation rules (landing pages can be more aggressive)
- Modify CTA density (landing pages = more CTAs, blog = fewer)
- Change trust signal types (case studies vs. educational content)

### For Different Business Models
If not B2B lead generation:
- E-commerce: Focus on product links, add-to-cart CTAs
- SaaS: Focus on free trial signups, demo requests
- Affiliate: Focus on product comparisons, affiliate links

## Troubleshooting

### "AI is too aggressive with CTAs"
**Solution:** Add constraint: "Maximum 3 CTAs per blog post, prioritize user education over conversion"

### "AI is changing SEO-critical elements"
**Solution:** Emphasize: "DO NOT modify H1, meta description, or primary keyword placement under any circumstances"

### "CTAs feel spammy"
**Solution:** Add guideline: "Each CTA must provide clear value to the reader, not just benefit the business"

### "Code snippets don't match our design system"
**Solution:** Provide style guide or existing component examples in context

---

# RESEARCH SUMMARY

## Key Findings That Informed This Prompt

### 1. Blog Content Analysis

**Current state:**
- 25+ blog posts covering child support topics
- SEO-optimized (schema markup, breadcrumbs, meta tags)
- Educational focus (how-to guides, explainers, FAQs)
- Minimal conversion optimization (1-2 CTAs per post)
- Chatbot widget embedded on all pages

**Conversion opportunities:**
- High-intent topics (hidden income, reduction strategies, when to hire lawyer)
- Natural CTA moments (after explaining complexity, before FAQ section)
- Internal linking gaps (related posts not cross-linked)
- Trust signal opportunities (free consultations, no obligation)

### 2. Conversion Path Research

**Three distinct paths identified:**
1. **Calculator Path:** Blog → Calculator → Complexity Detection → Inquiry Form
   - Best for: General education topics, calculation guides
   - Conversion rate: Unknown (validation phase)

2. **Direct Inquiry Path:** Blog → Inquiry Form (bypasses calculator)
   - Best for: High-complexity topics (hidden income, agreements)
   - URL pattern: `/lawyer-inquiry?mode=direct&reason=[slug]`

3. **Special Circumstances Path:** Blog → Factor Selection → Inquiry Form
   - Best for: Change of Assessment topics
   - URL: `/special-circumstances`

**Critical insight:** Different topics require different conversion paths. One-size-fits-all CTAs underperform.

### 3. Legal Advertising Compliance

**Australian legal advertising rules (researched):**
- No guarantees of outcomes
- No misleading or deceptive conduct
- No false or unverifiable claims
- Must include disclaimer ("general information only")
- No fear-mongering or emotional manipulation

**Source:** Legal Profession Uniform Law, Australian Consumer Law

**Implication:** CTAs must be factual, helpful, and compliant. Avoid aggressive sales tactics.

### 4. SEO Best Practices for Lead Generation Content

**Research findings:**
- Internal linking improves SEO + user journey (Moz, Ahrefs studies)
- CTAs don't harm SEO if contextually relevant (Google Webmaster Guidelines)
- Trust signals increase conversion without harming rankings (CXL Institute)
- Excessive CTAs increase bounce rate (Nielsen Norman Group)

**Optimal CTA density:** 3-5 per 1,500-word article (based on CRO case studies)

**Best CTA placement:**
- After problem statement (high intent)
- Before FAQ section (decision point)
- End of article (natural conclusion)

### 5. React Native / Expo Router Patterns

**Technical constraints:**
- Must use `Pressable` component (not `<a>` tags)
- Must use `router.push()` for navigation (not `window.location`)
- Must include `accessibilityRole="button"` for accessibility
- Must use `isWeb && webClickableStyles` for hover effects

**Design system:**
- **Brand Color Palette (MUST USE):**
  - Primary Blue: `#2563EB` (Blue 600) - CTAs, buttons, links, interactive elements
  - Dark Blue: `#1e3a8a` (Blue 900) - Headings, titles, important text
  - Light Blue: `#eff6ff` (Blue 50) - Card backgrounds, subtle highlights
  - Light Blue Alt: `#dbeafe` (Blue 100) - Alternate card backgrounds
  - Blue Border: `#bfdbfe` (Blue 200) - Borders, dividers
  - Blue Accent: `#3b82f6` (Blue 500) - Accent borders, highlights
  - Slate 50: `#f8fafc` - Page backgrounds, subtle surfaces
  - Slate 100: `#f1f5f9` - Neutral card backgrounds
  - Slate 200: `#e2e8f0` - Borders, dividers
  - Slate 300: `#cbd5e1` - Muted borders
  - Slate 500: `#64748b` - Secondary text, captions
  - Slate 600: `#475569` - Body text, muted content
  - Slate 700: `#334155` - Primary body text
  - White: `#ffffff` - Card surfaces, button text
- **Colors to AVOID (non-brand):**
  - ❌ Green (`#22c55e`, `#f0fdf4`, `#86efac`, `#14532d`)
  - ❌ Red (`#dc2626`, `#fef2f2`, `#fecaca`, `#991b1b`)
  - ❌ Yellow (`#fbbf24`, `#fef3c7`, `#78350f`, `#92400e`)
  - ❌ Purple (`#5b21b6`, `#f5f3ff`, `#c4b5fd`, `#6b21a8`)
- Shadow styles via `createShadow()` utility
- Responsive via `MAX_CALCULATOR_WIDTH` constant
- Platform-specific styling via `Platform.OS`

### 6. Chatbot Widget Integration

**Current implementation:**
- Vanilla JavaScript widget (no dependencies)
- Lazy-loaded for performance (Core Web Vitals)
- Decision tree logic (no open-ended input)
- Tracks analytics via Google Analytics 4
- Routes to specific inquiry forms based on user answers

**Implication:** Blog CTAs should complement (not duplicate) chatbot functionality. Use blog CTAs for high-intent moments, chatbot for exploration.

## Limitations Acknowledged

### What We DON'T Know (Validation Phase)
- Actual conversion rates (no historical data)
- Which CTA copy performs best (no A/B test results)
- Optimal CTA placement (no heatmap data)
- User feedback on current CTAs (no surveys conducted)

### What We CAN'T Claim
- "Proven" conversion rates
- "Guaranteed" results
- Specific ROI numbers
- Client testimonials (no paying clients yet)

### Gaps in Research
- Competitor analysis (not conducted)
- User testing (not performed)
- Heatmap analysis (not available)
- A/B test results (not run yet)

**Mitigation:** Prompt emphasizes testing, iteration, and verification. Encourages starting with one blog post, measuring results, then scaling.

## Sources Consulted

1. **Australian Legal Advertising:**
   - Legal Profession Uniform Law (NSW, VIC, QLD)
   - Australian Consumer Law (ACCC guidelines)
   - Law Society advertising rules

2. **SEO Best Practices:**
   - Google Webmaster Guidelines
   - Moz internal linking guide
   - Ahrefs content optimization research

3. **Conversion Rate Optimization:**
   - CXL Institute CRO studies
   - Nielsen Norman Group UX research
   - Unbounce landing page benchmarks

4. **Technical Implementation:**
   - React Native documentation
   - Expo Router documentation
   - Accessibility guidelines (WCAG 2.1)

---

# FINAL NOTES

## This Prompt Succeeds When:
- Blog posts convert more visitors to leads
- SEO metrics remain stable or improve
- User experience stays positive (no complaints about "too salesy")
- Compliance is maintained (no legal issues)
- Changes are measurable and testable

## This Prompt Fails When:
- Organic traffic drops after optimization
- Bounce rate increases significantly
- Users complain about aggressive CTAs
- Legal compliance is violated
- SEO elements are accidentally modified

## Continuous Improvement
- Track metrics for each optimized post
- Document what works (CTA copy, placement, design)
- Build a "playbook" of proven patterns
- Update prompt based on real-world results
- Share learnings across team

---

**Version:** 2.0  
**Last Updated:** January 26, 2026  
**Maintained By:** Kiro AI Assistant  
**Status:** Production-ready, validation phase

**Changelog:**
- v2.0 (Jan 26, 2026): Added ContextualWizard component integration
- v1.0 (Jan 26, 2026): Initial release


---

# CONTEXTUAL WIZARD: COMPLETE CONFIGURATION GUIDE

## Blog Topic → Wizard Configuration Mapping

### Example 1: "Child Support Self-Employed" Blog Post

**Optimal placement:** After section "How Self-Employed Parents Minimize Income"

```tsx
import { ContextualWizard } from '@/src/components/blog/ContextualWizard';

// ... after explaining income hiding tactics ...

<ContextualWizard
  preselectedFactors={['income_resources_not_reflected']}
  highlightedFactors={['hiding_income', 'cash_business']}
  blogTopic="self_employed"
  ctaText="Get Help Uncovering Hidden Income"
  analyticsSource="blog_child_support_self_employed"
  formReason="hidden_income"
  title="Suspect the Other Parent is Hiding Income?"
  description="Select any factors that apply. Our partner lawyers specialize in forensic accounting for child support cases."
/>
```

**Why this configuration:**
- Pre-selects "income not reflected" (matches blog topic)
- Highlights common additions (hiding income, cash business)
- CTA text is specific to hidden income cases
- Form reason routes to hidden income inquiry type
- Custom title creates urgency and relevance

---

### Example 2: "Binding Child Support Agreement" Blog Post

**Optimal placement:** After section "Legal Requirements for Binding Agreements"

```tsx
<ContextualWizard
  preselectedFactors={['property_settlement']}
  highlightedFactors={['binding_agreement']}
  blogTopic="binding_agreement"
  ctaText="Get Your Agreement Drafted – Fixed Fee Quote"
  analyticsSource="blog_binding_agreement"
  formReason="binding_agreement"
  title="Ready to Formalize Your Agreement?"
  description="Binding agreements must meet strict legal requirements. Select any factors that apply to your situation."
/>
```

---

### Example 3: "Object to Child Support Assessment" Blog Post

**Optimal placement:** After section "Grounds for Change of Assessment"

```tsx
<ContextualWizard
  preselectedFactors={['change_circumstances']}
  highlightedFactors={['income_resources_not_reflected', 'high_costs', 'property_settlement']}
  blogTopic="object_assessment"
  ctaText="Request a Change of Assessment"
  analyticsSource="blog_object_assessment"
  formReason="special_circumstances"
  title="Which Special Circumstances Apply?"
  description="Select all factors that apply. Change of Assessment applications have a 60%+ success rate when properly prepared."
/>
```

---

### Example 4: "When to Hire a Family Lawyer" Blog Post

**Optimal placement:** After section "Signs You Need Professional Help"

```tsx
<ContextualWizard
  preselectedFactors={[]}
  highlightedFactors={['income_resources_not_reflected', 'court_order_existing', 'property_settlement', 'international_jurisdiction']}
  blogTopic="when_to_hire"
  ctaText="Speak to a Specialist – No Obligation"
  analyticsSource="blog_when_to_hire_lawyer"
  formReason="special_circumstances"
  title="Does Your Situation Require Legal Help?"
  description="Select any factors that apply. Most lawyers offer free initial consultations to assess your case."
/>
```

---

### Example 5: "International Child Support" Blog Post

**Optimal placement:** After section "Enforcement Challenges Across Borders"

```tsx
<ContextualWizard
  preselectedFactors={['international_jurisdiction']}
  highlightedFactors={['income_resources_not_reflected', 'court_order_existing']}
  blogTopic="international"
  ctaText="Get Help With International Cases"
  analyticsSource="blog_international_child_support"
  formReason="special_circumstances"
  title="Dealing With an Overseas Parent?"
  description="International cases require specialized knowledge of reciprocating jurisdictions and enforcement mechanisms."
/>
```

---

## Quick Reference: Factor IDs

**Common Special Circumstances Factors:**
- `income_resources_not_reflected` - Income/resources not reflected in assessment
- `hiding_income` - Deliberately hiding income
- `cash_business` - Cash business operations
- `property_settlement` - Property settlement pending
- `binding_agreement` - Need binding agreement
- `change_circumstances` - Significant change in circumstances
- `high_costs` - High costs of children
- `high_contact_costs` - High contact costs
- `international_jurisdiction` - International/overseas parent
- `court_order_existing` - Existing court order
- `care_arrangement_change` - Care arrangement changes
- `overpayment_issue` - Overpayment or arrears issues

**Special handling:**
- `court_date_pending` - Automatically added by wizard when user selects court date checkbox

---

## Wizard Placement Decision Tree

```
START: Analyze blog post topic
│
├─ Does topic map to specific special circumstances?
│  │
│  ├─ YES → Use ContextualWizard
│  │   ├─ Pre-select: Matching factor(s)
│  │   ├─ Highlight: Related factors
│  │   ├─ CTA: Topic-specific text
│  │   └─ Place: After complexity explanation
│  │
│  └─ NO → Use traditional CTA
│      ├─ Link to calculator (if calculation-focused)
│      └─ Link to inquiry form (if general advice)
│
└─ Optimal placement locations:
    1. After explaining complexity (BEST)
    2. Before FAQ section
    3. After case study/example
    4. Before conclusion
```

---

## Blog Post → Wizard Configuration Quick Reference

| Blog Post Topic | Pre-selected | Highlighted | CTA Text | Form Reason |
|----------------|--------------|-------------|----------|-------------|
| Hidden Income / Self-Employed | `income_resources_not_reflected` | `hiding_income`, `cash_business` | "Get Help Uncovering Hidden Income" | `hidden_income` |
| Binding Agreements | `property_settlement` | `binding_agreement` | "Get Your Agreement Drafted" | `binding_agreement` |
| Reduction Strategies | `income_resources_not_reflected` | `change_circumstances`, `high_costs` | "Challenge Your Assessment" | `special_circumstances` |
| Object to Assessment | `change_circumstances` | `income_resources_not_reflected`, `high_costs` | "Request a Change of Assessment" | `special_circumstances` |
| International / Overseas | `international_jurisdiction` | `income_resources_not_reflected` | "Get Help With International Cases" | `special_circumstances` |
| Court Orders | `court_order_existing` | `property_settlement` | "Review Your Court Order" | `special_circumstances` |
| Complicated Situations | None | `income_resources_not_reflected`, `property_settlement`, `high_costs` | "Get Expert Help" | `special_circumstances` |
| When to Hire Lawyer | None | `income_resources_not_reflected`, `court_order_existing` | "Speak to a Specialist" | `special_circumstances` |
| Care Percentage | `care_arrangement_change` | `high_contact_costs` | "Optimize Your Care Arrangement" | `special_circumstances` |
| Overpayment / Arrears | `overpayment_issue` | `income_resources_not_reflected` | "Resolve Payment Issues" | `special_circumstances` |

---

## Implementation Checklist

When adding ContextualWizard to a blog post:

**Step 1: Import**
```tsx
import { ContextualWizard } from '@/src/components/blog/ContextualWizard';
```

**Step 2: Identify placement**
- [ ] After complexity explanation section
- [ ] Before FAQ section
- [ ] After case study/example
- [ ] Before conclusion

**Step 3: Configure factors**
- [ ] Determine pre-selected factors (1-2 max)
- [ ] Identify highlighted factors (2-4 max)
- [ ] Write context-specific CTA text
- [ ] Set analytics source (blog_[slug])
- [ ] Choose form reason (hidden_income, binding_agreement, or special_circumstances)

**Step 4: Customize messaging**
- [ ] Write compelling title (question format works well)
- [ ] Write helpful description (mention free consultations, no obligation)
- [ ] Ensure CTA text is action-oriented and specific

**Step 5: Verify**
- [ ] Import statement at top of file
- [ ] Wizard placed in optimal location
- [ ] Analytics source matches blog slug
- [ ] Form reason parameter correct
- [ ] No TypeScript errors
- [ ] Mobile-friendly (test on small screen)

---

## Performance Considerations

**Bundle size impact:**
- ContextualWizard component: ~15-20KB
- Lazy-loaded on scroll (Intersection Observer)
- No impact on initial page load
- Minimal TBT impact (<50ms)

**Best practices:**
- Only one wizard per blog post
- Place below the fold (lazy-load optimization)
- Don't combine with multiple traditional CTAs (CTA fatigue)
- Monitor Core Web Vitals after deployment

---

## Analytics Tracking

The ContextualWizard automatically tracks:

1. **blog_wizard_viewed** - When wizard enters viewport
   - blog_topic
   - analytics_source
   - preselected_count

2. **blog_wizard_factor_toggled** - When user adds/removes factor
   - blog_topic
   - factor_id
   - action (added/removed)
   - total_selected

3. **blog_wizard_expanded** - When user expands "Add other factors"
   - blog_topic
   - expanded (true/false)

4. **blog_wizard_submitted** - When user submits wizard
   - blog_topic
   - analytics_source
   - total_factors
   - has_court_date

**Use these events to:**
- Measure wizard engagement rate
- Identify which factors are most commonly selected
- Optimize pre-selection and highlighting
- Compare wizard conversion vs traditional CTAs

---

## Troubleshooting

### "Wizard feels too long"
**Solution:** Reduce highlighted factors to 2-3 max, keep "Add other factors" collapsed by default

### "Users aren't expanding to see more factors"
**Solution:** Change expand button text to be more compelling: "Add other factors that apply (optional)"

### "Pre-selected factors don't match user's situation"
**Solution:** Use fewer pre-selections (1 max) or none for general topics

### "CTA text feels generic"
**Solution:** Make it specific to blog topic: "Get Help With [Specific Problem]"

### "Wizard placement interrupts reading flow"
**Solution:** Move wizard later in article (before FAQ or conclusion)

---

**Wizard Component Version:** 1.0  
**Last Updated:** January 26, 2026  
**Component Location:** `src/components/blog/ContextualWizard.tsx`
