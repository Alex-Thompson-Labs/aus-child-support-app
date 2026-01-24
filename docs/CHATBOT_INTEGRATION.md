# Chatbot Integration Guide

## Overview

The AUS Child Support chatbot is a custom-built, zero-dependency lead qualification widget that appears on all blog pages. It guides users through a decision tree to route them to the appropriate inquiry form or resource.

## Features

✅ **Zero monthly fees** - No third-party service costs
✅ **Lightweight** - ~8KB total size
✅ **Performance optimized** - Lazy-loaded on user interaction
✅ **Privacy compliant** - No third-party data sharing
✅ **Mobile responsive** - Works on all screen sizes
✅ **Lead qualification** - Routes users to specific forms based on their needs

## How It Works

### Decision Tree Flow

1. **Main Menu**
   - Estimate My Payments → Calculator
   - Find a Lawyer → Qualification questions
   - General Information → Blog resources
   - I Have An Assessment → Existing assessment options

2. **Lawyer Qualification Path**
   - Q1: Do you have a parenting plan/court order?
   - Q2: What's your main goal?
     - Hidden income → `/lawyer-inquiry?mode=direct&reason=hidden_income`
     - Agreement → `/lawyer-inquiry?mode=direct&reason=binding_agreement`
     - Special circumstances → `/special-circumstances`
     - General advice → `/lawyer-inquiry?mode=direct`

3. **URL Parameters**
   - Chatbot answers are passed as URL parameters
   - Example: `?hasParentingPlan=true&assessmentType=income&returnTo=...`
   - Inquiry form can pre-fill or track these answers

## Implementation

### File Locations

- **Script**: `/public/chatbot-widget.js`
- **Loader**: `/app/blog/_layout.tsx`

### How It Loads

1. Blog layout component mounts
2. Checks if platform is web
3. Injects chatbot script into `<body>`
4. Script waits for user interaction (mouseover, scroll, etc.)
5. After interaction OR 4 seconds, chatbot button appears
6. On first click, chat window is created and rendered

### Performance Optimization

- **Lazy loading**: Script only loads on web platform
- **Interaction delay**: Widget appears after user interaction
- **Minimal initial load**: Only button HTML/CSS loaded initially
- **Chat window**: Created on-demand when user clicks button
- **No external dependencies**: Pure vanilla JavaScript

## Configuration

### Update URLs

Edit `/public/chatbot-widget.js`:

```javascript
const CONFIG = {
  calculatorUrl: 'https://auschildsupport.com',
  generalInfoUrl: 'https://auschildsupport.com/blog',
  forms: {
    standard: 'https://auschildsupport.com/lawyer-inquiry?mode=direct',
    hiddenIncome: 'https://auschildsupport.com/lawyer-inquiry?mode=direct&reason=hidden_income',
    agreements: 'https://auschildsupport.com/lawyer-inquiry?mode=direct&reason=binding_agreement',
    special: 'https://auschildsupport.com/special-circumstances'
  },
  // ... colors, etc.
};
```

### Update Decision Tree

Modify the `DECISION_TREE` object in `/public/chatbot-widget.js`:

```javascript
const DECISION_TREE = {
  main: {
    message: "Your message here",
    options: [
      { id: 'option1', label: 'Label', action: 'navigate', target: 'next_node' },
      // ... more options
    ]
  },
  // ... more nodes
};
```

### Styling

Colors are configured in the `CONFIG` object:

```javascript
primaryColor: '#1e40af',      // Professional blue
primaryHover: '#1e3a8a',
secondaryColor: '#3b82f6',
lightBg: '#eff6ff',
// ... etc.
```

## Testing

### Local Testing

1. Start dev server: `npm run web`
2. Navigate to any blog post: `http://localhost:8081/blog/[slug]`
3. Wait 4 seconds or interact with page
4. Chatbot button should appear in bottom-right
5. Click to open and test decision tree

### Production Testing

1. Deploy to Vercel
2. Visit any blog post
3. Test all decision tree paths
4. Verify URLs route correctly
5. Check mobile responsiveness

## Troubleshooting

### Chatbot doesn't appear

- Check browser console for errors
- Verify `/public/chatbot-widget.js` exists
- Check Platform.OS === 'web' in layout
- Wait 4 seconds or interact with page

### Chatbot appears on non-blog pages

- Chatbot is only loaded in `/app/blog/_layout.tsx`
- It should NOT appear on calculator, inquiry form, or other pages
- If it does, check for duplicate script tags

### URLs don't work

- Verify CONFIG.forms URLs in chatbot script
- Check that inquiry form accepts URL parameters
- Test with browser dev tools network tab

### Styling issues

- Check for CSS conflicts with existing styles
- Chatbot uses high z-index (999998-999999)
- All styles are prefixed with `.auscsc-`

## Migration from WordPress Blog

### Current State

- WordPress blog: `blog.auschildsupport.com.au` (has chatbot)
- New blog: `auschildsupport.com/blog` (now has chatbot)

### Next Steps

1. **Monitor both** - Track which blog converts better
2. **A/B test** - Compare chatbot performance on both platforms
3. **Consolidate** - Once new blog proves superior, redirect WordPress blog

### Redirect Strategy (Future)

When ready to sunset WordPress blog:

1. Set up 301 redirects from WordPress to new blog
2. Update chatbot URLs if needed
3. Monitor traffic for 30 days
4. Keep redirects active for 12+ months

## Maintenance

### Regular Updates

- Review decision tree quarterly
- Update blog post URLs as new content is added
- Monitor conversion rates from chatbot
- Test on new browsers/devices

### Analytics Integration

Consider adding analytics tracking:

```javascript
// In handleOptionClick function
if (window.gtag) {
  gtag('event', 'chatbot_interaction', {
    action: option.action,
    label: option.label,
    path: state.currentPath
  });
}
```

## Support

For issues or questions:
- Check this documentation first
- Review `/public/chatbot-widget.js` code
- Test in browser dev tools
- Check Expo Router documentation for layout issues

---

**Last Updated**: January 24, 2026
**Version**: 1.0.0
