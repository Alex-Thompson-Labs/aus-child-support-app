# Phase 1: Validation - Implementation Guide

**Recommended Tool:** Claude Code (with Desktop Commander if needed)  
**Recommended Model:** Sonnet 4.5 ✅  
**Thinking Mode:** Keep ON for Phase 1 (worth the extra $1 for better debugging)
**Plan Mode:** See each task for guidance (use sparingly to save cost)

**Goal:** Prove parents click "Get Legal Help" buttons  
**Success Metric:** >2% click-through rate on complexity alerts

---

## 🎯 Understanding Claude Code Modes

### What's the difference between Plan Mode and Accept Edits?

**They are TWO DIFFERENT settings!** Many beginners confuse these:

**Plan Mode:**
- Makes Claude Code create a plan BEFORE executing
- Costs ~10x more per prompt
- Visual indicator: `" plan mode on (shift+tab to cycle)` below input box
- **When to use:** Complex multi-file changes, when stuck, big tasks
- **Default for Phase 1:** Keep this OFF (Regular mode) for most tasks

**Accept Edits:**
- Auto-approves Claude's code changes without asking you
- No extra cost
- Visual indicator: `▶▶ accept edits on (shift+tab to cycle)` below input box
- **Recommendation:** Keep this OFF so you can review changes
- **Not related to Plan Mode at all**

**Regular Mode (default):**
- Visual indicator: `? for shortcuts` or `1 line selected` (NO mention of modes)
- This is what you want for most tasks!
- Press Shift+Tab to cycle: Regular → Plan → Accept Edits → Regular

---

## 🎯 Plan Mode Quick Reference

**Use Regular Mode (default - blank input box) for:**
- Tasks 0, 1, 2 (individual steps), 3, 6, 7

**Use Plan Mode (" plan mode on" showing) for:**
- Task 4 (if having trouble with integration)
- Task 5 (inquiry form - definitely use Plan mode)

See detailed guidance for each task below.

---

## 🤖 Which Tool to Use?

**Primary: Claude Code** (claude.ai/code)
- ✅ Best for writing code files
- ✅ Integrated with your editor
- ✅ Can read/edit multiple files at once
- ✅ Better for implementation tasks
- **Use for:** Tasks 1-5 (all code implementation)

**Secondary: Desktop Commander (this chat)**
- ✅ Best for planning and advice
- ✅ File organization and management
- ✅ Updating documentation
- ✅ Explaining concepts
- **Use for:** Getting unstuck, planning next steps, updating docs

**Cost Comparison:**
- Claude Code: ~$2-3 for Phase 1 (with thinking ON)
- Desktop Commander: Similar, but better for planning than coding
- **Strategy:** Use Claude Code for coding, Desktop Commander for guidance

---

## 💭 Thinking Mode Guidance

**Phase 1: Keep ON** ✅
- Complex logic (complexity detection)
- Hard tasks (form screen)
- Debugging sessions
- You're learning - worth the $1 extra

**When to turn OFF:**
- Simple UI components (Task 3)
- Basic questions
- Phase 2 (simpler work)

---

## 🎯 How to Use This Guide

**Work at YOUR pace.** Complete tasks in order, but don't rush. Each task has:
- ✅ Clear outcome (what "done" looks like)
- 🔥 Difficulty rating (Easy/Medium/Hard for a React Native beginner)
- ⏱️ Estimated time (with AI assistance)
- 💡 Tips for using Claude Code effectively
- 🐛 Common pitfalls to avoid

**When stuck:** Check `guides/TROUBLESHOOTING.md` or ask Claude Code for help.

---

## 📋 Tasks (Complete in Order)

### ✅ TASK 0: Environment Setup
**Difficulty:** 🟢 Easy (mostly admin work)  
**Time:** 30-60 minutes  
**Prerequisites:** None
**Plan Mode:** Regular mode ✅ (simple commands)

**Outcome:** 
- Posthog account created
- API key added to `.env` file
- `posthog-react-native` installed
- App still runs without errors

**Steps:**
1. Sign up at https://posthog.com (free tier)
2. Create a new project (name it "Child Support Calculator")
3. Copy the API key from project settings
4. Open `.env` file and add: `POSTHOG_API_KEY=your_key_here`
5. Install package: `npm install posthog-react-native`
6. Test app runs: `npm run dev` (the `-c` flag clears cache)

**Claude Code Prompt:**
```
I've installed posthog-react-native. Show me how to initialize it in my React Native app. 
My API key is in .env as POSTHOG_API_KEY.
```

**Done when:**
- [ ] App starts without errors
- [ ] No TypeScript errors in VS Code
- [ ] You can see the Posthog dashboard

**Common Issues:**
- If `.env` not loading → install `react-native-dotenv` (see TROUBLESHOOTING.md)
- If app won't start → run `npm run dev` to clear cache

---

### ✅ TASK 1: Analytics Wrapper
**Difficulty:** 🟢 Easy (mostly copy-paste from AI)  
**Time:** 30-60 minutes  
**Prerequisites:** Task 0 complete
**Plan Mode:** Regular mode ✅ (single file, clear instructions)

**Outcome:**
- `src/utils/analytics.ts` exists and works
- Can call `Analytics.track('test_event')` from anywhere
- Events show up in Posthog dashboard within 1 minute

**What you're building:**
A simple wrapper around Posthog so you don't have to import Posthog directly everywhere.

**Claude Code Prompt:**
```
Create src/utils/analytics.ts that:
1. Imports Posthog from 'posthog-react-native'
2. Initializes with POSTHOG_API_KEY from @env
3. Exports an Analytics object with methods:
   - track(event, properties)
   - identify(userId, traits)
   - screen(name, properties)
4. Use TypeScript for all types
5. Add console.log for debugging
```

**Test it works:**
Add to `src/screens/CalculatorScreen.tsx` temporarily:
```typescript
import { Analytics } from '@/utils/analytics';

// In component, add:
useEffect(() => {
  Analytics.track('screen_viewed', { screen: 'Calculator' });
}, []);
```

**Done when:**
- [ ] File created with no TypeScript errors
- [ ] Event appears in Posthog dashboard
- [ ] Console.log shows event being tracked

**Common Issues:**
- "Cannot find module '@env'" → Check TROUBLESHOOTING.md section on env variables
- Events not showing in Posthog → Wait 1-2 minutes, Posthog has delay
- TypeScript errors → Ask Claude Code to fix them

**Beginner Tips:**
- Don't worry about understanding Posthog internals
- The wrapper keeps your code clean
- Console.log is your friend - keep it for now

---

### ✅ TASK 2: Complexity Detection Logic
**Difficulty:** 🟡 Medium (logic complexity, but AI helps)  
**Time:** 2-3 hours  
**Prerequisites:** Task 1 complete
**Plan Mode:** Regular mode ✅ (each step is small and clear)

**Outcome:**
- `src/utils/complexity-detection.ts` has 5 working triggers
- Function returns true/false for each trigger
- You can test with sample data in a simple script

**What you're building:**
Logic that detects when a calculation is "complex" enough to show a lawyer alert.

**Claude Code Strategy:**
Break this into small pieces. Don't ask AI to do it all at once.

### Step 2a: Create the types (15 min)

**Ask Claude Code:**
```
Create src/utils/complexity-detection.ts with:
1. ComplexityFlags interface (6 boolean flags: highVariance, highValue, specialCircumstances, incomeSuspicion, courtDateUrgent, sharedCareDispute)
2. AlertConfig interface (title, message, urgency, buttonText)
3. Stub functions that return default values
4. Add JSDoc comments explaining each flag
```

**Done when you see:**
- File created
- Two interfaces defined
- Empty functions (they don't work yet, that's OK!)

---

### Step 2b: Implement HIGH VALUE trigger (30 min)

**Ask Claude Code:**
```
In complexity-detection.ts, implement detectComplexity():
- Take results and formData as parameters
- Check if results.finalPaymentAmount > 15000
- Return ComplexityFlags object with highValue = true if it exceeds 15000
- All other flags should be false for now
- Add comments showing example: if payment is $18,000, highValue should be true
```

**Done when:**
- Function exists
- Returns an object with all 6 flags
- highValue flag works correctly

---

### Step 2c: Implement ALERT CONFIG (30 min)

**THE CONFUSING PART - HERE'S WHAT TO DO:**

You need a function that creates the alert message. Here's what it means:

**Ask Claude Code:**
```
In complexity-detection.ts, implement getAlertConfig():

This function takes:
- flags: the ComplexityFlags object from detectComplexity()
- results: the calculation results

It should:
1. Check if flags.highValue is true
2. If yes, return an AlertConfig object like this:
   {
     title: "💰 High-Value Case",
     message: "Your liability is $[amount]/year. Cases over $15k benefit from verification.",
     urgency: 'medium',
     buttonText: "Request Review"
   }
   (Replace [amount] with the actual results.finalPaymentAmount)

3. If no flags are true, return null

Just do the highValue case for now. We'll add others later.
```

**What this means in plain English:**
- You're creating a function that looks at the flags
- If something complex was detected, it creates a message to show the user
- If nothing complex, it returns null (no message needed)

**Done when:**
- Function exists
- Returns null when highValue is false
- Returns an alert object when highValue is true
- The message includes the actual dollar amount

---

### Step 2d: Add remaining triggers (ONE AT A TIME!)

**THIS IS WHERE YOU'RE STUCK - HERE'S THE CLEAR PLAN:**

You're going to do 4 more triggers, ONE AT A TIME. Don't do them all together!

#### 2d-1: Court Date Urgent (30 min)

**Ask Claude Code:**
```
In detectComplexity() function, add courtDateUrgent trigger:

1. For now, just set it to false (we'll make it work in Phase 2 when we have the form field)
2. Add a comment: "// TODO: Check if formData.courtDate is within 30 days"
```

**Then update getAlertConfig():**
```
In getAlertConfig(), add courtDateUrgent check BEFORE the highValue check:

if (flags.courtDateUrgent) {
  return {
    title: "⚖️ URGENT: Court Date Soon",
    message: "You need legal advice BEFORE your court appearance.",
    urgency: 'high',
    buttonText: "Get Emergency Consultation"
  };
}

// Then keep the existing highValue check below it
```

**Why before?** Court dates are more urgent than high value, so we check them first.

**Done:** Court date trigger is stubbed (not working yet, but ready for Phase 2)

---

#### 2d-2: High Variance (skip for now!)

**This one is HARD. Skip it for now. We'll come back to it.**

---

#### 2d-3: Special Circumstances (30 min)

**Ask Claude Code:**
```
In detectComplexity(), add specialCircumstances check:

For now, just set to false with a comment:
// TODO: Check if formData has private school costs, medical expenses, etc.
```

**Then in getAlertConfig():**
```
Add this check after courtDateUrgent but before highValue:

if (flags.specialCircumstances) {
  return {
    title: "📋 Special Circumstances Detected",
    message: "Cases with additional costs often benefit from legal review.",
    urgency: 'medium',
    buttonText: "Request Review"
  };
}
```

**Done:** Special circumstances is stubbed

---

#### 2d-4: Shared Care Dispute (30 min)

**Ask Claude Code:**
```
In detectComplexity(), add sharedCareDispute check:

Check if care percentage is between 35% and 65%:
- Calculate total care nights from formData.children
- If any child has care split between 35-65% for either parent, set flag to true
```

**Then in getAlertConfig():**
```
Add after specialCircumstances:

if (flags.sharedCareDispute) {
  return {
    title: "⚖️ Care Arrangement in Dispute Zone",
    message: "Shared care between 35-65% is often contested. Consider professional advice.",
    urgency: 'medium',
    buttonText: "Get Guidance"
  };
}
```

**Done:** All basic triggers are implemented (except highVariance which we're skipping)

---

### Step 2e: Test your work (30 min)

**DON'T CREATE A SEPARATE TEST FILE!** That's confusing for beginners.

Instead, test right in your code with comments:

**Ask Claude Code:**
```
At the bottom of complexity-detection.ts, add commented-out test cases:

/*
// TEST CASE 1: High Value ($18,000)
const testResults1 = { finalPaymentAmount: 18000, ...other fields... };
const testFlags1 = detectComplexity(testResults1, {});
console.log('Test 1 - High Value:', testFlags1.highValue);

const alert1 = getAlertConfig(testFlags1, testResults1);
console.log('Alert 1:', alert1?.title);

// TEST CASE 2: Normal Value ($8,000)
const testResults2 = { finalPaymentAmount: 8000, ...other fields... };
const testFlags2 = detectComplexity(testResults2, {});
console.log('Test 2 - Normal:', testFlags2.highValue);

const alert2 = getAlertConfig(testFlags2, testResults2);
console.log('Alert 2:', alert2);
*/
```

---

**To actually run the tests:**

**1. Uncomment the test code** (in VS Code: select the lines, press Cmd+/ on Mac or Ctrl+/ on Windows)

**2. Run your app:**
```bash
npx expo start
```

**3. Check the console logs in your terminal**

Look for these 4 lines in your terminal output (they'll be mixed in with other Metro bundler messages):

```
Test 1 - High Value: true          ← Should say "true"
Alert 1: 💰 High-Value Case        ← Should show alert title
Test 2 - Normal: false             ← Should say "false"  
Alert 2: null                       ← Should say "null"
```

**4. What "looking right" means:**

✅ **CORRECT output (tests passing):**
- Test 1 High Value: **true** (because $18,000 > $15,000)
- Alert 1: Shows **"💰 High-Value Case"** or the full title
- Test 2 Normal: **false** (because $8,000 < $15,000)
- Alert 2: **null** (no alert needed)

❌ **WRONG output (tests failing):**
- Test 1 says "false" instead of "true" → Your highValue check is broken
- Alert 1 says "null" → Your getAlertConfig isn't working
- Test 2 says "true" instead of "false" → Your threshold is wrong
- Alert 2 shows an alert → It shouldn't trigger for normal cases

**5. If tests pass:** Comment the code back out (select lines, Cmd+/ or Ctrl+/)

**6. If tests fail:** Ask Claude Code: "My tests show [paste what you see]. What's wrong?"

---

**Done when:**
- [ ] Console shows "Test 1 - High Value: true"
- [ ] Console shows "Alert 1: 💰 High-Value Case" (or similar)
- [ ] Console shows "Test 2 - Normal: false"
- [ ] Console shows "Alert 2: null"
- [ ] No TypeScript errors in VS Code

---

**SUMMARY OF TASK 2:**

You now have:
- ✅ Types defined (ComplexityFlags, AlertConfig)
- ✅ detectComplexity() working for highValue
- ✅ getAlertConfig() returning alerts
- ✅ 4 triggers stubbed (ready for Phase 2)
- ✅ Basic testing done

**Move on to Task 3!**

---

### ✅ TASK 3: Lawyer Alert Component
**Difficulty:** 🟢 Easy (mostly styling)  
**Time:** 1-2 hours  
**Prerequisites:** Task 2 complete
**Plan Mode:** Regular mode ✅ (single component, clear requirements)

**Outcome:**
- `src/components/LawyerAlert.tsx` displays nicely
- Matches design system colors (slate/blue)
- Button is tappable and tracks analytics
- Works on both iOS and Android

**What you're building:**
A visual alert card that shows when complexity is detected.

**Claude Code Prompt:**
```
Create src/components/LawyerAlert.tsx:
1. Props: title, message, urgency, buttonText, onPress
2. Styled with React Native StyleSheet (NO Tailwind)
3. Colors from our design system:
   - Background: #1e293b (slate-800)
   - Border: #334155 (slate-700), or #ef4444 (red) if urgency='high'
   - Title: #ffffff, 18px, weight 600
   - Message: #94a3b8 (slate-400), 14px
   - Button: #2563eb (blue-600), or #ef4444 if urgent
4. Add subtle border-radius: 12px
5. Padding: 20px
6. When button pressed, call Analytics.track before onPress
```

**Testing:**
Add to CalculatorResults.tsx temporarily:
```typescript
<LawyerAlert
  title="Test Alert"
  message="This is a test"
  urgency="high"
  buttonText="Click Me"
  onPress={() => console.log('Clicked!')}
/>
```

**Done when:**
- [ ] Component renders without errors
- [ ] Looks good on iPhone simulator
- [ ] Looks good on Android emulator (if you have one)
- [ ] Button click logs to console
- [ ] Colors match design system

**Common Issues:**
- Button not clickable → Use Pressable, not TouchableOpacity
- Styling looks wrong → Check you're using StyleSheet.create, not CSS
- Can't import colors → Just use hex codes directly

**Beginner Tips:**
- **Visual debugging:** Change background colors to bright pink/green to see layout
- **Test on real device:** Looks different than simulator
- **Copy existing patterns:** Look at HelpTooltip.tsx for styling examples
- **Don't perfectionist the styling yet:** Get it working, polish later

---

### ✅ TASK 4: Integrate Alert into Results
**Difficulty:** 🟡 Medium (integration complexity)  
**Time:** 1-2 hours  
**Prerequisites:** Tasks 1, 2, 3 complete
**Plan Mode:** Start with Regular mode. Use Plan mode if stuck after 2-3 attempts.

**Outcome:**
- CalculatorResults shows LawyerAlert when triggers fire
- Alert has correct message based on complexity
- Button click tracks analytics
- Alert hidden when no triggers

**What you're doing:**
Connecting complexity detection → alert display → analytics tracking.

**Claude Code Strategy:**
Work in CalculatorResults.tsx step by step.

**Step 4a: Import and detect (15 min)**
```
In src/components/CalculatorResults.tsx:
1. Import detectComplexity and getAlertConfig
2. Import LawyerAlert component
3. Import Analytics
4. After calculating results, call:
   const flags = detectComplexity(results, formData);
   const alertConfig = getAlertConfig(flags, results);
5. Console.log flags and alertConfig to verify
```

**Step 4b: Render conditionally (15 min)**
```
In the JSX, after the results summary, add:
{alertConfig && (
  <LawyerAlert
    title={alertConfig.title}
    message={alertConfig.message}
    urgency={alertConfig.urgency}
    buttonText={alertConfig.buttonText}
    onPress={() => {
      Analytics.track('lawyer_button_clicked', {
        trigger: Object.keys(flags).find(k => flags[k]),
        liability: results.finalPaymentAmount
      });
      // TODO: Navigate to inquiry form (next task)
      console.log('Navigate to form');
    }}
  />
)}
```

**Step 4c: Test different scenarios (30-60 min)**
Test by changing inputs to trigger each alert:
- High value: Set income to >$150k
- Court date: Add a form field (or fake it in formData)
- Variance: Change care nights

**Done when:**
- [ ] Alert shows for high value cases
- [ ] Alert hidden for normal cases
- [ ] Button click logged in Posthog
- [ ] Console shows which trigger fired
- [ ] No crashes or TypeScript errors

**Common Issues:**
- Alert always showing → Check getAlertConfig logic, should return null sometimes
- Alert never showing → Console.log flags to see which are true
- TypeScript errors on formData → Make sure types match calculator.ts

**Beginner Tips:**
- **Test with extreme values** - $1M income, 14 kids, etc.
- **Watch Posthog in real-time** - Keep dashboard open
- **Don't worry about navigation yet** - Just console.log for now
- **This is where it gets real** - You're connecting multiple systems!

**Why this is Medium difficulty:**
- Need to understand React component lifecycle
- Passing data between components
- Conditional rendering logic
- But if Tasks 1-3 work, this is mostly glue code

---

### ✅ TASK 5: Inquiry Form Screen
**Difficulty:** 🔴 Hard (lots of moving parts)  
**Time:** 3-5 hours  
**Prerequisites:** Tasks 1-4 complete
**Plan Mode:** Use Plan mode ✅ (multi-file changes, navigation, complex state management)

**Outcome:**
- LawyerInquiryScreen navigable from calculator
- Form collects: name, email, phone, message
- Consent checkbox required
- Calculation summary displayed (read-only)
- Form validates before submission
- Success message after submit

**What you're building:**
A complete form screen where parents can request legal help.

**Claude Code Strategy:**
This is complex - break into tiny pieces.

**Step 5a: Navigation setup (30-60 min)**
```
1. Add LawyerInquiryScreen to app router
2. Make it accessible via navigation.navigate('LawyerInquiry')
3. Test you can navigate to blank screen and back
```

Ask Claude Code:
```
I need to add a new screen 'LawyerInquiry' to my Expo Router app.
Currently using file-based routing in /app directory.
Show me:
1. Where to create the screen file
2. How to navigate to it from another screen
3. How to pass calculation data as route params
```

**Step 5b: Form UI (60-90 min)**
```
Build the form layout in LawyerInquiryScreen:
1. ScrollView wrapper (for keyboard)
2. TextInput for name (required)
3. TextInput for email (required, keyboard type email)
4. TextInput for phone (optional, keyboard type phone)
5. TextInput for message (multiline, 4 lines)
6. Checkbox for consent (required)
7. Submit button
8. Style like design system (slate colors)
```

Don't worry about functionality yet - just UI.

**Step 5c: Form state (30 min)**
```
Add useState for each field:
- name, setName
- email, setEmail  
- phone, setPhone
- message, setMessage
- consent, setConsent

Wire up onChange handlers
```

**Step 5d: Validation (30-45 min)**
```
Create handleSubmit function that:
1. Checks name.trim().length > 0
2. Checks email.includes('@')
3. Checks consent === true
4. Shows alert if validation fails
5. Proceeds to submit if valid
```

**Step 5e: Display calculation summary (30 min)**
```
Access route params to get calculation data
Display read-only summary:
- Annual liability
- Income split  
- Care arrangement
- Number of children
Style as a card above the form
```

**Step 5f: Form submission (60-90 min)**
```
In handleSubmit, after validation:
1. Create lead data object
2. Track analytics: inquiry_form_submitted
3. For now: console.log the full lead data (Phase 2: send email)
4. Show success message
5. Clear form / navigate back
```

**Done when:**
- [ ] Can navigate from alert to form
- [ ] All fields accept input
- [ ] Validation blocks invalid submissions
- [ ] Calculation summary displays correctly
- [ ] Submit logs data to console
- [ ] Analytics tracks submission
- [ ] Success message appears
- [ ] Tested on iOS and Android

**Common Issues:**
- Keyboard covers input → Use KeyboardAvoidingView (already in stub)
- Navigation not working → Check router setup
- Validation too strict → Test with real data
- Styling breaks on Android → Test early and often

**Beginner Tips:**
- **This will take the longest** - Don't rush it
- **Test on real device** - Keyboard behavior differs
- **Use Expo Go app** - Easier than simulator for forms
- **One field at a time** - Get name working perfectly before adding email
- **Ask Claude Code for debugging help** - "Why isn't my form submitting?"
- **Check existing React Native forms** - Search GitHub for examples

**Why this is Hard:**
- Navigation setup (new concept)
- State management (6+ pieces of state)
- Validation logic
- Keyboard handling (iOS vs Android differences)
- Multiple moving parts that must work together
- Styling forms is tedious

**When you get frustrated:**
- Take breaks
- Test smaller pieces
- Ask Claude Code specific questions
- Remember: This is the hardest task in Phase 1

---

### ✅ TASK 6: End-to-End Testing
**Difficulty:** 🟡 Medium (tedious but important)  
**Time:** 2-3 hours  
**Prerequisites:** Tasks 0-5 complete
**Plan Mode:** Regular mode ✅ (manual testing, no code generation needed)

**Outcome:**
- Complete flow tested: calculation → alert → click → form → submit
- Tested on iOS (simulator or device)
- Tested on Android (if possible)
- All analytics events verified in Posthog
- No crashes or errors

**What you're doing:**
Making sure everything works together before real users touch it.

**Use the testing checklist:**
Open `guides/phase1/TESTING.md` and go through it systematically.

**Key things to test:**
1. **Complexity detection:**
   - High value case shows alert ✓
   - Normal case shows no alert ✓
   - Each trigger type works ✓

2. **Alert UI:**
   - Button tappable ✓
   - Analytics fires on click ✓
   - Navigation works ✓

3. **Form:**
   - All inputs work ✓
   - Validation catches errors ✓
   - Submission succeeds ✓
   - Success message shows ✓

4. **Analytics:**
   - calculation_completed ✓
   - complexity_alert_shown ✓
   - lawyer_button_clicked ✓
   - inquiry_form_submitted ✓

**Done when:**
- [ ] Checklist 100% complete
- [ ] No crashes found
- [ ] All analytics events visible in Posthog
- [ ] Tested on at least iOS (Android bonus)
- [ ] Form data logs correctly

**Common Issues:**
- Crashes on specific inputs → Add error handling
- Analytics not tracking → Check Posthog API key
- Form won't submit → Check validation logic

**Beginner Tips:**
- **Be thorough** - Users will find bugs you miss
- **Test extreme cases** - $0 income, 20 kids, special characters in name
- **Use real test data** - Don't use "test test test"
- **Keep notes** - Write down any bugs to fix

---

### ✅ TASK 7: Launch to Test Users
**Difficulty:** 🟢 Easy (but requires patience)  
**Time:** 3-5 hours spread over a week  
**Prerequisites:** Task 6 complete
**Plan Mode:** Regular mode ✅ (no coding, just posting and monitoring)

**Outcome:**
- App posted in 3-5 Australian forums/groups
- 100+ parents have tested the calculator
- Analytics shows click-through rate
- You have enough data to evaluate success

**What you're doing:**
Getting real users to test your app and click buttons.

**Where to post:**
1. Reddit: r/AusFinance, r/AusLegal (careful with rules)
2. Facebook: Australian parenting groups
3. Whirlpool forums (Australian tech community)
4. Australian family law forums
5. Your personal network (ask friends to share)

**Post template:**
```
Title: "Free Australian Child Support Calculator (no ads, no signup)"

Body:
Hi everyone, I built a free child support calculator for separated parents.

Unlike the Services Australia website, it:
- Shows WHY you pay what you pay (simple explanations)
- Lets you test "what if" scenarios
- Works on your phone (native app)

100% free, no ads, no data collection. Just trying to help parents understand a confusing system.

Would love feedback from anyone navigating child support!

[Link to download or TestFlight]
```

**Monitoring:**
- Check Posthog daily
- Respond to any feedback/questions
- Note which triggers fire most often

**Done when:**
- [ ] Posted in 3+ places
- [ ] 100+ calculations completed (Posthog)
- [ ] 5+ button clicks (Posthog)
- [ ] Click-through rate calculated

**Success Metrics:**
- **>2% CTR** = Success! Proceed to Phase 2
- **1-2% CTR** = Borderline, iterate on messaging
- **<1% CTR** = Need to improve triggers or alerts

**Beginner Tips:**
- **Don't spam** - Read forum rules first
- **Be helpful** - Answer questions, engage
- **Track manually** - Keep a spreadsheet of where you posted
- **Be patient** - Takes 3-5 days to get enough users

---

## 🎓 Learning Resources

**When stuck on React Native:**
- React Native docs: https://reactnative.dev
- Expo docs: https://docs.expo.dev
- Search: "[your error] react native" on Stack Overflow

**When stuck on TypeScript:**
- TypeScript handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Ask Claude Code: "Explain this TypeScript error"

**When stuck on Posthog:**
- Posthog docs: https://posthog.com/docs
- Check event debugger in Posthog dashboard

**When stuck in general:**
1. Check `guides/TROUBLESHOOTING.md`
2. Ask Claude Code specific questions
3. Google the exact error message
4. Take a break and come back fresh

---

## 💡 Tips for Using Claude Code

**Good prompts:**
- "Create X that does Y, Z. Use TypeScript. Follow my design system colors."
- "I'm getting this error: [paste error]. What's wrong?"
- "Review this code and suggest improvements for a beginner."

**Bad prompts:**
- "Make the whole app"
- "Fix it" (too vague)
- "Do everything in Task 5"

**Best practice:**
- Break big tasks into small prompts
- Show Claude Code your existing code for context
- Ask for explanations: "Why does this work?"
- Request beginner-friendly code: "Add comments explaining each step"

---

## 📊 Progress Tracking

Mark tasks complete as you finish them:

- [ ] Task 0: Environment Setup (Easy, 30-60 min)
- [ ] Task 1: Analytics Wrapper (Easy, 30-60 min)
- [ ] Task 2: Complexity Detection (Medium, 2-3 hours)
- [ ] Task 3: Alert Component (Easy, 1-2 hours)
- [ ] Task 4: Integrate Alert (Medium, 1-2 hours)
- [ ] Task 5: Inquiry Form (Hard, 3-5 hours)
- [ ] Task 6: Testing (Medium, 2-3 hours)
- [ ] Task 7: Launch (Easy, 3-5 hours over a week)

**Total Time Estimate:** 15-25 hours depending on debugging

**At your pace:** Could be 1 week (intense) or 3-4 weeks (relaxed)

---

## 🎯 What Success Looks Like

**End of Phase 1:**
- ✅ App detects complex cases
- ✅ Shows compelling alerts
- ✅ Parents click "Get Legal Help"
- ✅ Form collects their info
- ✅ Analytics proves >2% click-through
- ✅ You're confident to recruit lawyers

**Then:**
Tell me "Phase 1 complete!" and I'll create Phase 2 guides.

---

**Remember:** You're learning as you go. Progress > perfection. 🚀
