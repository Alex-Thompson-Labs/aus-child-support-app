# AI Documentation Maintenance Guide

**Purpose:** This file ensures that any AI assistant making code changes also updates relevant documentation.

**Last Updated:** 2026-01-24

---

## 🤖 AI Assistant Instructions

**CRITICAL:** When you make ANY code changes to this project, you MUST check if documentation needs updating.

### Mandatory Documentation Update Checklist

After making code changes, check these files and update if relevant:

#### 1. **Feature Implementation Changes**

If you implement a NEW feature or complete a planned feature:

- [ ] Update `/docs/business-docs/BUSINESS_MODEL.md`
  - Change status from "📋 Planned" to "✅ Completed"
  - Add completion date
  - Add brief description of what was implemented

- [ ] Update `/docs/PROJECT_KNOWLEDGE_BASE.md`
  - Add feature to "Core Features" section
  - Update "Recent Bug Fixes & Refactors" if applicable
  - Update "Last Updated" timestamp

- [ ] Update `/docs/CLAUDE.md`
  - Add to "Current Project Phase" progress section if major feature
  - Update "Last Updated" timestamp

#### 2. **Architecture or Design Changes**

If you modify UI components, styling, or architecture:

- [ ] Update `/docs/DESIGN_SYSTEM.md`
  - Add new components to "Component Patterns" section
  - Update color palette if colors changed
  - Update file organization if structure changed
  - Update "Last Updated" timestamp (add if missing)

#### 3. **Business Logic or Formula Changes**

If you modify calculation logic or formulas:

- [ ] Update `/docs/DESIGN_SYSTEM.md` (Australian Child Support Formula section)
- [ ] Check if formula specification files need updates (`/docs/business-docs/formulas/`)
- [ ] Update complexity detection documentation if triggers changed

#### 4. **Database or API Changes**

If you modify Supabase tables, RLS policies, or API endpoints:

- [ ] Update `/docs/CLAUDE.md` (Database section)
- [ ] Update `/docs/PROJECT_KNOWLEDGE_BASE.md` (Backend & Database Infrastructure)

#### 5. **New Routes or Navigation Changes**

If you add new routes or modify navigation:

- [ ] Update `/docs/business-docs/USER_FLOW.md`
  - Add new screens to flow diagrams
  - Update navigation structure
  - Add new entry points if applicable

- [ ] Update `/docs/PROJECT_KNOWLEDGE_BASE.md` (Navigation Structure section)

---

## 🚨 Common Documentation Mistakes to Avoid

### ❌ DON'T:

1. **Mark features as complete before they're implemented**
   - Always verify code exists before changing status to ✅
   - Use 📋 for planned, ⏳ for in-progress, ✅ for completed

2. **Forget to update timestamps**
   - Update "Last Updated" dates when making significant changes
   - Format: `YYYY-MM-DD` or `Month DD, YYYY`

3. **Leave contradictory information**
   - If you update one doc, check related docs for consistency
   - Example: If you change a feature in BUSINESS_MODEL.md, check PROJECT_KNOWLEDGE_BASE.md

4. **Create duplicate documentation**
   - Before creating new docs, check if similar content exists
   - Update existing docs rather than creating new ones

5. **Use vague status labels**
   - Be specific: "Implemented" vs "Specification only"
   - Add evidence: "Implemented in `/src/features/...`"

### ✅ DO:

1. **Verify implementation before marking complete**
   - Search codebase for evidence
   - Test the feature if possible

2. **Update multiple related docs**
   - Changes often affect 2-3 documentation files
   - Use the checklist above

3. **Add implementation evidence**
   - Link to file paths where feature is implemented
   - Example: "✅ Secure Magic Links - Implemented in `/app/admin/view-lead/[token].tsx`"

4. **Keep status indicators consistent**
   - Use emoji consistently: ✅ (done), ⏳ (in progress), 📋 (planned), ❌ (removed)

---

## 📋 Quick Reference: Which Docs to Update

| Code Change Type | Primary Doc | Secondary Docs |
|------------------|-------------|----------------|
| **New Feature** | BUSINESS_MODEL.md | PROJECT_KNOWLEDGE_BASE.md, CLAUDE.md |
| **UI Component** | DESIGN_SYSTEM.md | PROJECT_KNOWLEDGE_BASE.md |
| **New Route** | USER_FLOW.md | PROJECT_KNOWLEDGE_BASE.md |
| **Database Change** | CLAUDE.md | PROJECT_KNOWLEDGE_BASE.md |
| **Formula Logic** | DESIGN_SYSTEM.md | Formula specs in `/formulas/` |
| **Bug Fix** | PROJECT_KNOWLEDGE_BASE.md | None (unless major) |
| **Performance** | PROJECT_KNOWLEDGE_BASE.md | CLAUDE.md (if affects architecture) |

---

## 🔍 How to Verify Documentation Accuracy

Before finalizing your changes:

1. **Search for related documentation**
   ```bash
   # Search for mentions of the feature you changed
   grep -r "feature_name" /docs/
   ```

2. **Check for completion claims**
   - If you see ✅ next to a feature, verify it exists in code
   - If you see 📋 for something you just implemented, update it

3. **Verify timestamps**
   - Update "Last Updated" dates to current date
   - Use format: `2026-01-24` or `January 24, 2026`

4. **Cross-reference related docs**
   - If you update BUSINESS_MODEL.md, check PROJECT_KNOWLEDGE_BASE.md
   - If you update DESIGN_SYSTEM.md, check CLAUDE.md

---

## 🎯 Specific File Update Rules

### `/docs/business-docs/BUSINESS_MODEL.md`

**Update when:**
- Completing a feature listed in "Phase 3A" section
- Changing business model or pricing
- Adding new success metrics
- Modifying validation plan

**What to update:**
- Change 📋 to ✅ for completed features
- Update "Completed" date
- Add new features to appropriate phase section

### `/docs/PROJECT_KNOWLEDGE_BASE.md`

**Update when:**
- Adding new components or screens
- Fixing bugs (add to "Recent Bug Fixes" section)
- Changing project structure
- Modifying performance optimizations

**What to update:**
- "Last Updated" timestamp at top
- Relevant section (Core Features, Bug Fixes, etc.)
- File locations if structure changed

### `/docs/DESIGN_SYSTEM.md`

**Update when:**
- Adding new UI components
- Changing color palette or typography
- Modifying calculation formulas
- Adding new animation patterns

**What to update:**
- Component Patterns section
- File Organization section
- Relevant technical sections

### `/docs/CLAUDE.md`

**Update when:**
- Changing architecture
- Adding new routes or major features
- Modifying database schema
- Updating deployment process

**What to update:**
- "Last Updated" timestamp
- "Current Project Phase" progress
- Architecture Overview if structure changed
- Database section if schema changed

### `/docs/business-docs/USER_FLOW.md`

**Update when:**
- Adding new screens or routes
- Changing navigation flow
- Adding new entry points
- Modifying user journey

**What to update:**
- Flow diagrams (Mermaid syntax)
- Screen Architecture section
- Entry Points section

---

## 🤝 Example: Proper Documentation Update

**Scenario:** You just implemented the "Advanced Lead Traps" feature for Formulas 4, 5, 6.

**Required updates:**

1. **BUSINESS_MODEL.md** (line ~111):
   ```markdown
   - ✅ **Advanced Lead Traps** - Bypasses calculation for complex formulas (4, 5, 6)
     - Implemented: 2026-01-24
     - Location: `/src/utils/lead-trap-detection.ts`
   ```

2. **PROJECT_KNOWLEDGE_BASE.md**:
   ```markdown
   ### **Lead Capture System**
   
   - **Advanced Lead Traps**: Detects Formulas 4, 5, 6 and bypasses calculation
     - Implementation: `/src/utils/lead-trap-detection.ts`
     - Triggers direct inquiry form for complex cases
   ```

3. **CLAUDE.md** (if major feature):
   ```markdown
   **Progress:**
   
   - ✅ Advanced Lead Traps (Formulas 4, 5, 6) - Jan 24, 2026
   ```

4. **Update timestamps** in all three files

---

## 🔄 Automated Checks (Future Enhancement)

Consider adding a pre-commit hook that:
- Checks if code changes match documentation updates
- Warns if BUSINESS_MODEL.md hasn't been updated in 30+ days
- Validates that all ✅ features have corresponding code

---

## 📞 Questions?

If you're unsure whether to update documentation:
- **Default to YES** - Over-documentation is better than under-documentation
- Check the "Quick Reference" table above
- When in doubt, update BUSINESS_MODEL.md and PROJECT_KNOWLEDGE_BASE.md

---

**Remember:** Good documentation is as important as good code. Keep them in sync!
