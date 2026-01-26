# Pre-Commit Quality Checks

This directory contains Git hooks managed by Husky that automatically run quality checks before each commit.

## What Gets Checked

Every time you commit, the following checks run automatically:

1. **Type Check** (`npm run type-check`)
   - Validates TypeScript types
   - Catches type errors before they reach production

2. **Linting** (`npm run lint`)
   - Checks code style and best practices
   - Enforces consistent code formatting

3. **Tests with Coverage** (`npm run test:coverage`)
   - Runs all Jest tests
   - Generates coverage report
   - Fails if coverage drops below 50% (configured in jest.config.js)

4. **Security Audit** (`npm audit --audit-level=high`)
   - Scans for high/critical security vulnerabilities
   - Blocks commits if critical issues found

## How It Works

- Hooks run automatically on `git commit`
- If any check fails, the commit is blocked
- Fix the issues and try committing again
- All checks must pass before code can be committed

## Skipping Checks (Emergency Only)

If you absolutely need to skip checks (not recommended):

```bash
git commit --no-verify -m "your message"
```

**Warning:** Only use this in emergencies. Skipping checks can introduce bugs and security issues.

## Installation

Husky is automatically installed when you run:

```bash
npm install
```

The `prepare` script in package.json sets up the hooks.

## Disabling Temporarily

To disable all hooks temporarily:

```bash
export HUSKY=0
```

To re-enable:

```bash
unset HUSKY
```

## Benefits

- ✅ Catches errors before they're committed
- ✅ Maintains code quality standards
- ✅ Prevents security vulnerabilities
- ✅ Ensures tests pass and coverage is maintained
- ✅ No need for GitHub Actions (works offline)
- ✅ Completely free (no CI/CD costs)
