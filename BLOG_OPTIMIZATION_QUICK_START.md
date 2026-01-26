# Blog Lead Generation Optimization - Quick Start Guide

## 🚀 TL;DR

Use this prompt to optimize blog posts for lead generation while preserving SEO. It adds strategic CTAs, improves internal linking, and builds trust—without being spammy.

**Main prompt file:** `BLOG_LEAD_OPTIMIZATION_PROMPT.md`

---

## ⚡ Quick Usage

### Option 1: Optimize a Specific Blog Post

```
Using the BLOG_LEAD_OPTIMIZATION_PROMPT.md, optimize the blog post at:
app/blog/child-support-reduction-strategies.tsx

Focus on:
- Adding 3-4 contextual CTAs
- Improving internal links to related posts
- Adding trust signals for lawyer consultations
```

### Option 2: Batch Optimization

```
Using the BLOG_LEAD_OPTIMIZATION_PROMPT.md, identify the top 5 blog posts 
that would benefit most from lead generation optimization. Consider:
- High organic traffic
- High-intent topics (legal advice, complex situations)
- Currently low conversion rate

Then optimize the highest-priority post first.
```

### Option 3: Audit Current CTAs

```
Using the BLOG_LEAD_OPTIMIZATION_PROMPT.md, audit all CTAs in:
app/blog/when-to-hire-family-lawyer.tsx

Identify:
- Which CTAs are effective (contextual, clear value)
- Which CTAs are weak (generic, poorly placed)
- Opportunities for improvement
```

---

## 📋 Pre-Flight Checklist

Before optimizing, ensure:
- [ ] Blog post is already SEO-optimized (meta tags, schema, headings)
- [ ] Content is factually accurate and compliant
- [ ] You have access to analytics (to measure impact)
- [ ] You can A/B test changes (start with one post)

---

## 🎯 Optimization Priorities

### High-Priority Posts (Optimize First)
Topics that naturally lead to lawyer consultations:
- ✅ "When to Hire a Family Lawyer"
- ✅ "Child Support Reduction Strategies"
- ✅ "Hidden Income / Self-Employed"
- ✅ "Binding Child Support Agreements"
- ✅ "Object to Child Support Assessment"
- ✅ "Complicated Child Support Situations"

### Medium-Priority Posts
Educational content with conversion opportunities:
- "How to Calculate Child Support"
- "Child Support Formula Australia"
- "Change of Assessment" topics
- "International Child Support"

### Low-Priority Posts
Pure information (optimize later):
- "Care Percentage Table"
- "Child Support After 18"
- "Centrelink Income Support"

---

## 🔧 Common Optimization Patterns

### Pattern 1: After Explaining Complexity

**Context:** Article explains a complex situation (hidden income, trusts, overseas)

**CTA:**
```tsx
<View style={styles.ctaCard}>
  <Text style={styles.ctaTitle}>Dealing With [Specific Complexity]?</Text>
  <Text style={styles.ctaText}>
    Our partner lawyers specialize in [specific expertise]. 
    Most offer free initial consultations.
  </Text>
  <Pressable
    style={[styles.primaryButton, isWeb && webClickableStyles]}
    onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=[slug]')}
    accessibilityRole="button"
  >
    <Text style={styles.primaryButtonText}>Get Expert Help →</Text>
  </Pressable>
</View>
```

### Pattern 2: Internal Link to Related Post

**Context:** Mentioning a related topic

**Link:**
```tsx
<Text style={styles.paragraph}>
  If you're considering this strategy, understand the{' '}
  <Text
    style={styles.inlineLink}
    onPress={() => router.push('/blog/[related-slug]')}
  >
    [descriptive anchor text]
  </Text>
  {' '}before proceeding.
</Text>
```

### Pattern 3: Trust Signal Box

**Context:** Before asking for contact information

**Trust Box:**
```tsx
<View style={styles.trustBox}>
  <Text style={styles.trustTitle}>💡 What to Expect:</Text>
  <Text style={styles.bulletItem}>• Most lawyers respond within 24 hours</Text>
  <Text style={styles.bulletItem}>• Initial consultations often free or low-cost</Text>
  <Text style={styles.bulletItem}>• No obligation to proceed</Text>
  <Text style={styles.bulletItem}>• Your information remains confidential</Text>
</View>
```

### Pattern 4: Calculator CTA

**Context:** Discussing payment calculations

**CTA:**
```tsx
<Pressable
  style={[styles.calculatorButton, isWeb && webClickableStyles]}
  onPress={() => router.push('/')}
  accessibilityRole="button"
>
  <Text style={styles.calculatorButtonText}>Calculate Your Payments →</Text>
</Pressable>
```

---

## ⚠️ What NOT to Do

### ❌ Don't Interrupt Reading Flow
```tsx
// BAD: CTA in middle of explanation
<Text>Child support is calculated using...</Text>
<Pressable><Text>HIRE A LAWYER NOW!</Text></Pressable>
<Text>...the 8-step formula...</Text>
```

### ❌ Don't Use Fear-Mongering
```tsx
// BAD: Manipulative language
<Text>⚠️ WARNING: Without a lawyer, you WILL lose thousands!</Text>
```

### ❌ Don't Make False Claims
```tsx
// BAD: Unverifiable statistics
<Text>Our lawyers have a 95% success rate!</Text>
```

### ❌ Don't Modify SEO Elements
```tsx
// BAD: Changing H1 or meta description
<Text style={styles.h1}>
  Best Child Support Lawyer Australia | Hire Now  // ❌ Keyword stuffing
</Text>
```

---

## 📊 Success Metrics

### Track These (Before & After)
- **Conversion:** Click-through rate on CTAs, form submissions
- **SEO:** Organic traffic, keyword rankings, time on page
- **UX:** Bounce rate, pages per session, user feedback

### Red Flags (Stop & Reassess)
- 🚨 Organic traffic drops >10%
- 🚨 Bounce rate increases >15%
- 🚨 Negative user feedback ("too salesy")
- 🚨 Keyword rankings decline

---

## 🧪 Testing Protocol

### Step 1: Baseline (Week 0)
- Record current metrics (traffic, conversions, bounce rate)
- Screenshot current blog post layout
- Note existing CTAs and placement

### Step 2: Implement (Week 1)
- Apply optimizations to ONE blog post
- Deploy changes
- Verify no broken links or errors

### Step 3: Monitor (Weeks 2-4)
- Track metrics daily
- Compare to baseline
- Collect user feedback

### Step 4: Evaluate (Week 5)
- Did conversions increase?
- Did SEO metrics stay stable?
- Was user experience positive?

### Step 5: Scale (Week 6+)
- If successful: Apply to similar posts
- If unsuccessful: Iterate and retest
- Document learnings

---

## 🔗 Conversion Path Reference

### Path 1: Calculator → Inquiry
**Best for:** General education, calculation guides  
**URL:** `/` (calculator) → complexity detection → `/lawyer-inquiry`

### Path 2: Direct Inquiry
**Best for:** High-complexity topics  
**URLs:**
- Standard: `/lawyer-inquiry?mode=direct`
- Hidden income: `/lawyer-inquiry?mode=direct&reason=hidden_income`
- Agreements: `/lawyer-inquiry?mode=direct&reason=binding_agreement`

### Path 3: Special Circumstances
**Best for:** Change of Assessment topics  
**URL:** `/special-circumstances`

---

## 💡 Pro Tips

1. **Start small:** Optimize 1 post, measure results, then scale
2. **Be contextual:** CTAs should feel helpful, not salesy
3. **Test copy:** Try different CTA text to see what resonates
4. **Monitor SEO:** If rankings drop, roll back changes
5. **User feedback:** Ask readers if content is helpful or pushy
6. **Document wins:** Build a playbook of proven patterns

---

## 🆘 Need Help?

### Common Issues

**"I don't know which blog post to optimize first"**
→ Use the High-Priority list above, or ask AI to analyze traffic data

**"My CTAs feel too aggressive"**
→ Add more context, emphasize "free consultation" and "no obligation"

**"SEO metrics dropped after optimization"**
→ Roll back changes, verify you didn't modify H1/meta/schema

**"Conversions didn't increase"**
→ Test different CTA copy, placement, or conversion path

### Get AI Assistance

```
I'm having trouble with [specific issue]. Using the 
BLOG_LEAD_OPTIMIZATION_PROMPT.md, help me:
1. Diagnose the problem
2. Suggest a solution
3. Provide code to implement the fix
```

---

## 📚 Additional Resources

- **Full prompt:** `BLOG_LEAD_OPTIMIZATION_PROMPT.md`
- **Design system:** `docs/DESIGN_SYSTEM.md`
- **User flow:** `docs/business-docs/USER_FLOW.md`
- **Analytics:** Google Analytics 4 (check conversion events)

---

**Quick Start Version:** 1.0  
**Last Updated:** January 26, 2026  
**Estimated Time to Optimize One Post:** 30-60 minutes  
**Recommended Testing Period:** 2-4 weeks per post
