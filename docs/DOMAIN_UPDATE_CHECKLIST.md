# Domain Update Checklist - .com to .com.au Migration

## ✅ Completed Updates

### Code Files
- ✅ `src/components/CareCalendar.tsx` - Footer URL
- ✅ `src/components/pdf/AssessmentPDFDocument.tsx` - PDF footer
- ✅ `src/utils/exportLeadPDF.ts` - Lead PDF footer
- ✅ `src/components/PrivacyPolicyLink.tsx` - Privacy policy link
- ✅ `src/pages/admin/ProposalsScreen.tsx` - Partner link generation
- ✅ `src/pages/admin/LeadDetailScreen.tsx` - Email signature
- ✅ `app/about.tsx` - Schema.org URL + blog link
- ✅ `public/privacy-policy.html` - All domain references
- ✅ `scripts/generate-sitemap.cjs` - Sitemap generator
- ✅ `public/sitemap.xml` - Already updated
- ✅ `.env.example` - Example environment variables

### Configuration
- ✅ Vercel DNS configured
- ✅ VentraIP DNS configured
- ✅ Vercel domain added

---

## ⚠️ Manual Updates Required

### 1. Environment Variables (.env file)

**You need to update your actual `.env` file** (not tracked in git):

```bash
# Update these in your .env file:
EXPO_PUBLIC_SITE_URL=https://auschildsupport.com.au
EXPO_PUBLIC_ADMIN_EMAIL=alex@auschildsupport.com.au
```

### 2. Documentation Files (Optional - for reference only)

These files are documentation and don't affect the live site:
- `docs/CLAUDE.md` - Multiple references (informational only)
- `docs/PROJECT_KNOWLEDGE_BASE.md` - References (informational only)
- `docs/DESIGN_SYSTEM.md` - References (informational only)
- `docs/README.md` - References (informational only)
- `docs/business-docs/BUSINESS_MODEL.md` - Business docs (informational only)
- `.kiro/steering/product.md` - Steering file (informational only)
- `.kiro/steering/tech.md` - Steering file (informational only)
- `README.md` - Project readme (informational only)

**You can update these later** - they're just documentation for developers.

### 3. Admin Login Comment

In `src/pages/admin/AdminLoginScreen.tsx`, there's a comment:
```typescript
/**
 * Admin Login Screen
 * Simple email/password authentication for alex@auschildsupport.com
 * Uses Supabase Auth with RLS policies
 */
```

This is just a comment - update it if you want, but it doesn't affect functionality.

### 4. Supabase Configuration

**Important:** Update Supabase allowed origins:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Under **Site URL**, update to: `https://auschildsupport.com.au`
5. Under **Redirect URLs**, add:
   - `https://auschildsupport.com.au/**`
   - `https://www.auschildsupport.com.au/**`

### 5. Google Analytics (if needed)

If you want to track both domains separately:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Add `.com.au` as a new property
3. Update `EXPO_PUBLIC_GA_MEASUREMENT_ID` in `.env` if needed

Or keep the same GA property to track both domains together.

### 6. Vercel Environment Variables

Update in Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Update `EXPO_PUBLIC_SITE_URL` to: `https://auschildsupport.com.au`
3. Update `EXPO_PUBLIC_ADMIN_EMAIL` to: `alex@auschildsupport.com.au` (if set)

---

## 🚀 Deployment Steps

After updating `.env`:

1. **Rebuild and deploy:**
   ```bash
   npm run build:web
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update domain references from .com to .com.au"
   git push
   ```

3. **Vercel will auto-deploy** (if connected to git)

4. **Test the live site:**
   - Visit `https://auschildsupport.com.au`
   - Test calculator functionality
   - Test lawyer inquiry form
   - Check PDF exports
   - Verify privacy policy links

---

## 📋 Testing Checklist

After deployment:

- [ ] Main site loads at `auschildsupport.com.au`
- [ ] www subdomain works
- [ ] Blog subdomain works (if configured)
- [ ] SSL certificates are valid (green padlock)
- [ ] Calculator functions correctly
- [ ] Lawyer inquiry form submits successfully
- [ ] PDF exports show correct domain
- [ ] Privacy policy links work
- [ ] Admin panel accessible
- [ ] Email forwarding works (if configured)
- [ ] Google Analytics tracking (check Real-Time reports)

---

## 🔄 Optional: Redirect .com to .com.au

If you want to redirect the old domain:

**In Namecheap (for auschildsupport.com):**
1. Go to **Advanced DNS**
2. Add URL Redirect records:
   ```
   Type: URL Redirect Record
   Host: @
   Value: https://auschildsupport.com.au
   Redirect Type: Permanent (301)
   
   Type: URL Redirect Record
   Host: www
   Value: https://www.auschildsupport.com.au
   Redirect Type: Permanent (301)
   ```

This ensures anyone visiting the old .com domain gets redirected to .com.au.

---

## 📝 Notes

- Keep both domain registrations active (don't let .com expire)
- Monitor analytics for traffic patterns
- Update social media profiles with new domain
- Update email signatures
- Update business cards/marketing materials
- Consider updating Google Search Console with new property
