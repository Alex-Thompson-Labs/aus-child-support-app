# Requirements Document

## Introduction

Refactor the `calculateResults.ts` file (~580 lines) into separate, focused modules with clear single responsibilities. The current file mixes form validation, income calculations, child cost calculations, liability calculations, rate applications (FAR/MAR), multi-case cap logic, and final payment determination. This refactoring will improve maintainability, testability, and make it easier to add new features.

## Glossary

- **Calculator_Engine**: The main orchestration module that coordinates all calculation steps
- **Form_Validator**: Module responsible for validating calculator form inputs
- **Income_Calculator**: Module that calculates Child Support Income (CSI) for each parent
- **Liability_Calculator**: Module that calculates per-child liabilities based on income percentages and care
- **Rates_Engine**: Engine module (`rates-engine.ts`) that applies Fixed Annual Rate (FAR) and Minimum Annual Rate (MAR)
- **MultiCase_Engine**: Engine module (`multi-case-engine.ts`) that handles multi-case allowances and caps (Formula 3)
- **Payment_Resolver**: Module that determines final payment amounts and payer/receiver roles
- **ATI**: Adjusted Taxable Income
- **CSI**: Child Support Income (ATI - SSA - deductions)
- **CCSI**: Combined Child Support Income (CSI_A + CSI_B)
- **SSA**: Self-Support Amount
- **FAR**: Fixed Annual Rate (for low-income parents without income support)
- **MAR**: Minimum Annual Rate (for parents on income support)
- **NPC**: Non-Parent Carer (Formula 4)

## Requirements

### Requirement 1: Extract Form Validation

**User Story:** As a developer, I want form validation logic in a separate module, so that validation rules can be tested and modified independently.

#### Acceptance Criteria

1. THE Form_Validator SHALL export a `validateCalculatorForm` function that accepts `CalculatorFormState` and returns `FormErrors`
2. WHEN validating incomes, THE Form_Validator SHALL reject negative values for `incomeA` or `incomeB`
3. WHEN validating children care amounts, THE Form_Validator SHALL reject values exceeding the maximum for the care period
4. WHEN validating children care amounts, THE Form_Validator SHALL reject negative values
5. WHEN validating total care, THE Form_Validator SHALL reject when `careAmountA + careAmountB` exceeds the period maximum
6. WHEN validating relevant dependents, THE Form_Validator SHALL reject negative counts
7. WHEN validating multi-case children, THE Form_Validator SHALL reject more than 10 children in other cases

### Requirement 2: Extract Income Calculations

**User Story:** As a developer, I want income calculation logic in a separate module, so that CSI calculations can be understood and tested in isolation.

#### Acceptance Criteria

1. THE Income_Calculator SHALL export a function to calculate Child Support Income for a parent
2. WHEN calculating CSI, THE Income_Calculator SHALL apply the formula: `max(0, ATI - SSA - relDepDeductible - multiCaseAllowance)`
3. THE Income_Calculator SHALL export a function to calculate relevant dependent deductibles
4. THE Income_Calculator SHALL export a function to calculate Combined CSI (CCSI)
5. THE Income_Calculator SHALL export a function to calculate income percentages from CSI values

### Requirement 3: Extract Liability Calculations

**User Story:** As a developer, I want per-child liability calculations in a separate module, so that the core formula logic is isolated and testable.

#### Acceptance Criteria

1. THE Liability_Calculator SHALL export a function to calculate per-child liability
2. WHEN calculating liability, THE Liability_Calculator SHALL use the formula: `(childSupportPercent / 100) * costPerChild`
3. WHEN the receiving parent has less than 35% care, THE Liability_Calculator SHALL return zero liability
4. WHEN a child is 18+, THE Liability_Calculator SHALL return zero liability (adult children excluded)
5. THE Liability_Calculator SHALL calculate child support percentage as `incomePercent - costPercent`

### Requirement 4: Extract Rates Engine

**User Story:** As a developer, I want FAR/MAR rate application in a dedicated engine module (`src/utils/engine/rates-engine.ts`), so that rate rules can be modified without affecting other calculations.

#### Acceptance Criteria

1. THE Rates_Engine SHALL be located at `src/utils/engine/rates-engine.ts`
2. THE Rates_Engine SHALL export a function to determine if MAR applies for a parent
3. WHEN a parent receives income support AND has ATI below SSA AND has less than 14% care of all children, THE Rates_Engine SHALL indicate MAR applies
4. THE Rates_Engine SHALL export a function to determine if FAR applies for a parent
5. WHEN a parent has ATI below MAX_PPS AND does not receive income support AND the other parent has 66%+ care, THE Rates_Engine SHALL indicate FAR applies
6. THE Rates_Engine SHALL export a function to apply rates to child liabilities
7. WHEN FAR applies, THE Rates_Engine SHALL cap at 3 children maximum

### Requirement 5: Extract Multi-Case Engine

**User Story:** As a developer, I want multi-case cap logic in a dedicated engine module (`src/utils/engine/multi-case-engine.ts`), so that Formula 3 complexity is isolated.

#### Acceptance Criteria

1. THE MultiCase_Engine SHALL be located at `src/utils/engine/multi-case-engine.ts`
2. THE MultiCase_Engine SHALL export a `calculateSoloCostPerChild` function at module scope (not inside any other function)
3. WHEN calculating solo cost, THE MultiCase_Engine SHALL use only the payer's preliminary CSI (not CCSI)
4. THE MultiCase_Engine SHALL export a function to apply multi-case caps to liabilities
5. WHEN a parent has children in other cases, THE MultiCase_Engine SHALL apply the cap formula
6. THE MultiCase_Engine SHALL handle MAR 3-case cap and care negation rules
7. THE MultiCase_Engine SHALL handle FAR 3-child cap across all cases

### Requirement 6: Extract Payment Resolution

**User Story:** As a developer, I want final payment determination in a separate module, so that payer/receiver logic is clear and testable.

#### Acceptance Criteria

1. THE Payment_Resolver SHALL export a function to determine final payment amount
2. WHEN both parents have liabilities, THE Payment_Resolver SHALL calculate net payment as `liabilityA - liabilityB`
3. THE Payment_Resolver SHALL determine payer as the parent with higher liability
4. THE Payment_Resolver SHALL determine receiver as the parent with lower liability
5. WHEN final payment is zero, THE Payment_Resolver SHALL set payer and receiver to "Neither"
6. THE Payment_Resolver SHALL calculate NPC payment totals when non-parent carer is enabled

### Requirement 7: Create Orchestration Module

**User Story:** As a developer, I want a clean orchestration module that coordinates all calculation steps, so that the calculation flow is easy to follow.

#### Acceptance Criteria

1. THE Calculator_Engine SHALL export a `calculateChildSupport` function with the same signature as the current implementation
2. THE Calculator_Engine SHALL call modules in the correct order: validation → income → cost → liability → rates → caps → payment
3. THE Calculator_Engine SHALL return `null` when validation fails
4. THE Calculator_Engine SHALL return a complete `CalculationResults` object on success
5. WHEN overrides are provided, THE Calculator_Engine SHALL use override values for `supportA` and `supportB`

### Requirement 8: Maintain Backward Compatibility

**User Story:** As a developer, I want the refactored code to produce identical results, so that existing functionality is preserved.

#### Acceptance Criteria

1. THE refactored modules SHALL produce identical `CalculationResults` for all valid inputs
2. THE refactored modules SHALL produce identical `FormErrors` for all invalid inputs
3. THE public API (`calculateChildSupport`, `validateCalculatorForm`) SHALL remain unchanged
4. THE existing imports from `calculateResults.ts` SHALL continue to work

### Requirement 9: Organize Module Structure

**User Story:** As a developer, I want a clear directory structure for calculation modules, so that related code is easy to find.

#### Acceptance Criteria

1. THE engine modules SHALL be placed in `src/utils/engine/` directory
2. THE `src/utils/engine/` directory SHALL contain `rates-engine.ts` for FAR/MAR logic
3. THE `src/utils/engine/` directory SHALL contain `multi-case-engine.ts` for Formula 3 logic
4. THE directory SHALL contain an `index.ts` that re-exports public APIs
5. THE original `calculateResults.ts` SHALL re-export from the new modules for backward compatibility
6. WHEN importing calculation functions, developers SHALL be able to import from either location

### Requirement 10: Optimize Helper Functions

**User Story:** As a developer, I want helper functions defined at module scope, so that they are not recreated on every function call.

#### Acceptance Criteria

1. THE `calculateSoloCostPerChild` helper SHALL be defined at module scope in `multi-case-engine.ts`
2. THE helper function SHALL NOT be defined inside any other function body
3. THE helper function SHALL accept all required parameters explicitly rather than using closure variables
4. WHEN the main calculation function is called multiple times, THE helper function SHALL NOT be recreated
