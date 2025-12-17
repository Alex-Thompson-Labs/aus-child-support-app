# Testing Checklist - Phase 1

Use this to test your implementation before launching to users.

---

## ✅ Functionality Tests

### Complexity Detection
- [ ] High value case (>$15k) triggers alert
- [ ] High variance (care change creates $3k+ swing) triggers alert
- [ ] Special circumstances (private school mentioned) triggers alert
- [ ] Multiple triggers show highest priority alert
- [ ] Calculations without triggers show no alert

### Lawyer Alert UI
- [ ] Alert displays with correct title/message
- [ ] Button is tappable
- [ ] Analytics tracks button click
- [ ] Navigation to inquiry form works
- [ ] Alert styling matches design system (slate/blue)

### Inquiry Form
- [ ] All fields accept input
- [ ] Email validation works
- [ ] Phone is truly optional
- [ ] Consent checkbox required
- [ ] Form won't submit without required fields
- [ ] Calculation summary displays correctly
- [ ] Submit button triggers form submission
- [ ] Success message shows after submit
- [ ] Analytics tracks form submission

### Analytics
- [ ] calculation_completed fires
- [ ] complexity_alert_shown fires with trigger type
- [ ] lawyer_button_clicked fires with context
- [ ] inquiry_form_opened fires
- [ ] inquiry_form_submitted fires
- [ ] Events visible in Posthog dashboard

---

## 🎨 Visual/UX Tests

### Mobile (iOS)
- [ ] Alerts look good on iPhone SE (small screen)
- [ ] Alerts look good on iPhone 15 Pro Max (large screen)
- [ ] Keyboard doesn't cover form inputs
- [ ] Scrolling works smoothly
- [ ] Touch targets are easy to tap (44x44pt minimum)

### Mobile (Android)
- [ ] Alerts render correctly
- [ ] Keyboard behavior works
- [ ] Back button navigation works
- [ ] Form validation messages display correctly

### Accessibility
- [ ] Alert text is readable (contrast check)
- [ ] Button tap zones are large enough
- [ ] Form labels are clear
- [ ] Error messages are helpful

---

## 📊 Analytics Verification

### In Posthog Dashboard
- [ ] Events are coming through
- [ ] Event properties are captured correctly
- [ ] Can filter by trigger type
- [ ] Can see funnel: calculation → alert → click → submit
- [ ] Timestamps are accurate

---

## 🐛 Edge Cases

- [ ] What if user denies all permissions?
- [ ] What if internet connection is lost during submit?
- [ ] What if user enters invalid email format?
- [ ] What if calculation results in $0 liability?
- [ ] What if user has 10+ children?
- [ ] What if income is extremely high (>$1M)?

---

## 🚀 Pre-Launch Checks

- [ ] .env file has POSTHOG_API_KEY
- [ ] No console errors in development
- [ ] App doesn't crash on any screen
- [ ] Analytics events visible in Posthog within 1 minute
- [ ] Form email arrives in your inbox
- [ ] All stub TODO comments removed from Phase 1 files

---

**Once all checked:** You're ready to recruit test users! 🎉
