# Blog System Guide

## Overview

Blog posts are now built directly into your Expo app as React Native screens. This means:
- ✅ No WordPress needed
- ✅ Auto-deploys with your app to Vercel
- ✅ Full SEO control with PageSEO component
- ✅ Consistent styling with your design system
- ✅ Direct routing to calculator/inquiry form
- ✅ AI can write complete blog posts as code

## File Structure

```
app/
├── blog/
│   ├── _layout.tsx                              # Blog layout wrapper
│   ├── index.tsx                                # Blog listing page (/blog)
│   └── international-child-support-australia.tsx # Individual blog post
```

## How to Add a New Blog Post

### Step 1: Create the Blog Post File

Create a new file in `app/blog/` with your URL slug as the filename:

```
app/blog/your-post-slug.tsx
```

### Step 2: Copy the Template

Use `app/blog/international-child-support-australia.tsx` as your template. It includes:
- PageSEO with FAQ schema
- Article schema for rich results
- Proper heading hierarchy (H1, H2, H3)
- Styled components (highlight boxes, warning boxes, FAQ items)
- CTA buttons to calculator and inquiry form
- Mobile-responsive design

### Step 3: Update Blog Index

Add your new post to `app/blog/index.tsx`:

```typescript
const BLOG_POSTS = [
    {
        slug: 'your-post-slug',
        title: 'Your Blog Post Title',
        excerpt: 'Brief description under 160 characters',
        category: 'Child Support', // or 'Legal Help', 'International Law', etc.
        date: '2026-01-24',
        readTime: '8 min read',
    },
    // ... existing posts
];
```

### Step 4: Update Sitemap

Add your post slug to `scripts/generate-sitemap.cjs`:

```javascript
const BLOG_SLUGS = [
  'international-child-support-australia',
  'your-post-slug', // Add here
];
```

### Step 5: Deploy

```bash
git add .
git commit -m "Add blog post: Your Title"
git push
```

Vercel will automatically:
1. Build your Expo app
2. Generate sitemap with new blog post
3. Deploy to production
4. Your post is live at `https://auschildsupport.com.au/blog/your-post-slug`

## SEO Best Practices

### 1. PageSEO Component

Always include proper SEO metadata:

```typescript
<PageSEO
    title="Your Title | AusChildSupport"
    description="Compelling description under 160 characters"
    canonicalPath="/blog/your-slug"
    schema={[articleSchema, faqSchema]}
    breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Blog', path: '/blog' },
        { label: 'Your Title' },
    ]}
/>
```

### 2. Heading Hierarchy

- **One H1** per page (your main title)
- **H2** for major sections
- **H3** for subsections
- Use `accessibilityRole="header"` for screen readers

### 3. FAQ Schema

Include FAQ schema for rich results in Google:

```typescript
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Your question?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Your answer',
            },
        },
    ],
};
```

### 4. Internal Linking

Always link to:
- Calculator: `router.push('/')`
- Inquiry form: `router.push('/lawyer-inquiry?mode=direct&reason=your-reason')`
- Other blog posts: `router.push('/blog/other-post-slug')`
- FAQ page: `router.push('/faq')`

### 5. Keywords

Target keywords naturally in:
- Page title
- H1 heading
- First paragraph
- H2 headings
- Meta description
- Image alt text (when you add images)

## Conversion Optimization

### CTA Placement

Include CTAs at:
1. **After introduction** - Quick calculator link
2. **Mid-article** - Contextual "Get Legal Help" for complex cases
3. **End of article** - Primary CTA section with both calculator and inquiry form

### CTA Example

```typescript
<View style={styles.ctaSection}>
    <Text style={styles.ctaTitle}>Need Help With Your Situation?</Text>
    <Text style={styles.ctaText}>
        Use our free calculator or connect with experienced family lawyers.
    </Text>
    <View style={styles.ctaButtons}>
        <Pressable
            style={[styles.primaryButton, isWeb && webClickableStyles]}
            onPress={() => router.push('/')}
        >
            <Text style={styles.primaryButtonText}>Use Calculator</Text>
        </Pressable>
        <Pressable
            style={[styles.secondaryButton, isWeb && webClickableStyles]}
            onPress={() => router.push('/lawyer-inquiry?mode=direct&reason=international')}
        >
            <Text style={styles.secondaryButtonText}>Get Legal Help</Text>
        </Pressable>
    </View>
</View>
```

## Styling Components

### Highlight Box (Blue - Informational)

```typescript
<View style={styles.highlightBox}>
    <Text style={styles.highlightTitle}>Key Point:</Text>
    <Text style={styles.bulletItem}>• Important information</Text>
</View>
```

### Warning Box (Yellow - Caution)

```typescript
<View style={styles.warningBox}>
    <Text style={styles.warningTitle}>Important:</Text>
    <Text style={styles.warningText}>Warning or limitation</Text>
</View>
```

### Info Box (Green - Positive)

```typescript
<View style={styles.infoBox}>
    <Text style={styles.infoTitle}>Good News:</Text>
    <Text style={styles.bulletItem}>• Positive information</Text>
</View>
```

### FAQ Item

```typescript
<FAQItem
    question="Your question?"
    answer="Your detailed answer with context and helpful information."
/>
```

## Using AI to Write Blog Posts

### Prompt Template

```
Write a blog post as a React Native Expo Router screen for my Australian child support calculator app.

Topic: [Your topic]
Target keyword: [Primary keyword]
Target audience: [Who is this for?]
Word count: 1,500-2,000 words

Requirements:
- Use the template from app/blog/international-child-support-australia.tsx
- Include PageSEO with FAQ schema
- Add 3-5 FAQ items with schema
- Include CTAs to calculator (/) and inquiry form (/lawyer-inquiry?mode=direct&reason=X)
- Use highlight boxes, warning boxes for visual interest
- Target keyword in: title, H1, first paragraph, H2 headings, meta description
- Empathetic tone for stressed parents
- Australian law focus only (no US/UK content)

Output: Complete .tsx file ready to save to app/blog/[slug].tsx
```

## Analytics

Blog posts automatically track:
- Page views (Google Analytics)
- Time on page
- Scroll depth
- CTA clicks (if you add event tracking)

## Performance

Blog posts are:
- Statically exported at build time
- Served as HTML from Vercel's CDN
- Fast loading (no WordPress overhead)
- Mobile-optimized (React Native responsive design)

## Future Enhancements

Consider adding:
- [ ] Featured images (store in `public/images/blog/`)
- [ ] Author profiles
- [ ] Related posts section
- [ ] Social sharing buttons
- [ ] Comments (via third-party service)
- [ ] Newsletter signup CTA
- [ ] Reading progress indicator

## Maintenance

### Updating Existing Posts

1. Edit the `.tsx` file directly
2. Update `dateModified` in article schema
3. Commit and push
4. Vercel auto-deploys

### Removing Posts

1. Delete the `.tsx` file
2. Remove from `app/blog/index.tsx` BLOG_POSTS array
3. Remove from `scripts/generate-sitemap.cjs` BLOG_SLUGS array
4. Commit and push

## SEO Checklist

Before publishing, verify:
- [ ] Title under 60 characters
- [ ] Meta description under 160 characters
- [ ] H1 includes primary keyword
- [ ] First paragraph includes primary keyword
- [ ] 3+ H2 headings with semantic keywords
- [ ] FAQ schema with 3-5 questions
- [ ] Article schema with publish date
- [ ] Breadcrumbs configured
- [ ] Internal links to calculator and inquiry form
- [ ] CTA at end of post
- [ ] Added to blog index
- [ ] Added to sitemap generator
- [ ] Mobile-responsive (test on phone)

## Questions?

This system is designed to be AI-friendly. Just ask me to:
- "Write a blog post about [topic]"
- "Add a new section to [existing post]"
- "Update the FAQ in [post]"
- "Create a CTA for [specific reason]"

I'll generate the complete React Native code ready to deploy.
