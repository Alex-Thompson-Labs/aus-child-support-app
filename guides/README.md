# Implementation Guides

Practical guides for building and troubleshooting the app.

---

## 💡 IMPORTANT: Production Code Prompting

**Before using any guide:** Read the "💡 CRITICAL: How to Prompt Claude for Production Code" section at the top of Phase 1 CHECKLIST.md.

**TL;DR:** Claude builds exactly what you ask for. If you ask for "a component", you get a working demo. If you ask for "a production-ready component with error handling, validation, and edge cases", you get that instead.

**Every prompt should include:**
- What could go wrong? (error cases)
- What am I forgetting? (loading states, validation)
- Is this production-ready or just a demo?

See Phase 1 CHECKLIST.md for detailed examples and best practices that apply to ALL phases.

---

## 🤖 Which Claude Model to Use?

**Phase 1 (Current):** Sonnet 4.5 ✅
- Standard React Native work
- Perfect for learning and iteration
- Cost-effective for beginners

**Phase 2-3:** Sonnet 4.5 ✅
- Most tasks are straightforward
- Only use Opus for payment security decisions

**Phase 4:** Sonnet 4.5 + Opus (selectively)
- Use Opus only for architectural decisions
- Sonnet handles implementation

**See `docs/CLAUDE.md` for detailed model recommendations by phase.**

---

## 💭 Thinking Mode Settings

**Phase 1:** Keep ON ✅ (worth extra $1 for better debugging)  
**Phase 2:** Can turn OFF (simple integrations)  
**Phase 3:** Keep ON (payment security critical)  
**Phase 4:** Situational (ON for architecture, OFF for routine work)

---

## 🛠️ Which Tool to Use?

**Claude Code (claude.ai/code):**
- ✅ Best for writing actual code
- ✅ Multi-file editing
- ✅ Integrated with editor
- **Use for:** All implementation tasks (Tasks 1-5)

**Desktop Commander (this MCP chat):**
- ✅ Best for planning and strategy
- ✅ File organization
- ✅ Documentation updates
- ✅ Getting unstuck
- **Use for:** Guidance, planning, doc updates

**Cost:** Similar, but Claude Code is better for coding specifically.

---

## 🚀 Phase 1 (Current)

**Location:** `guides/phase1/`

- **[CHECKLIST.md](phase1/CHECKLIST.md)** - Day-by-day tasks for this week (Dec 18-24)
- **[TESTING.md](phase1/TESTING.md)** - Test before launching to users

**Start here:** Read CHECKLIST.md and follow it day by day.

---

## 🔧 General Guides

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and quick fixes (applies to all phases)

---

## 📚 Other Documentation

**Strategic planning:**
- `docs/MASTER_PLAN.md` - Complete implementation roadmap (all 4 phases)

**Technical reference:**
- `docs/DESIGN_SYSTEM.md` - Design patterns, colors, formulas
- `docs/CLAUDE.md` - Architecture and AI assistant guidance
- `docs/CHANGELOG.md` - Change history

**Project overview:**
- `README.md` (root) - Quick start and project summary
