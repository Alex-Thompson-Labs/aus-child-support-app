# Implementation Plan: Court Order Timeline Refactor

## Overview

This implementation refactors the Court Order Interpreter from rule extraction to timeline generation. The work is organized into three main phases: Edge Function update, CareCalculator replacement, and Frontend integration.

## Tasks

- [x] 1. Create Timeline Types and Validation Module
  - [x] 1.1 Create `src/utils/timeline-types.ts` with TimelineBlock, TimelineResponse, and CareCalculationResult types
    - Define TimelineBlock tuple type: `[string, string, 'M' | 'F', 'base' | 'holiday' | 'christmas']`
    - Define TimelineResponse interface with timeline array, year, and primary_parent
    - Define CareCalculationResult interface matching existing structure
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 1.2 Create `src/utils/timeline-validator.ts` with validation functions
    - Implement `validateTimelineBlock(block)` to check format
    - Implement `validateTimelineCoverage(timeline, year)` to check year boundaries
    - Implement `validateTimelineContinuity(timeline)` to check for gaps
    - Return error objects with code and message
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  - [x] 1.3 Write property test for continuous coverage validation
    - **Property 2: Continuous Coverage (No Gaps)**
    - **Validates: Requirements 2.2, 2.4, 2.5**
  - [x] 1.4 Write property test for year boundary coverage
    - **Property 1: Year Boundary Coverage**
    - **Validates: Requirements 2.1**

- [x] 2. Implement Timeline Aggregator
  - [x] 2.1 Create `src/utils/timeline-aggregator.ts` with calculateCareFromTimeline function
    - Parse ISO strings to Date objects
    - Calculate duration in minutes for each block
    - Sum minutes per parent (M → motherMinutes, F → fatherMinutes)
    - _Requirements: 4.1_
  - [x] 2.2 Implement midnight rule night counting
    - For each day in the year, determine who has care at 23:59
    - Count nights per parent
    - _Requirements: 4.2_
  - [x] 2.3 Implement percentage calculation
    - Calculate motherPercentage and fatherPercentage
    - Calculate motherNightsPerYear and fatherNightsPerYear
    - Return complete CareCalculationResult
    - _Requirements: 4.3, 4.4, 4.5_
  - [x] 2.4 Write property test for total minutes conservation
    - **Property 3: Total Minutes Conservation**
    - **Validates: Requirements 4.1**
  - [x] 2.5 Write property test for midnight rule night counting
    - **Property 4: Midnight Rule Night Counting**
    - **Validates: Requirements 4.2**
  - [x] 2.6 Write property test for percentage sum invariant
    - **Property 5: Percentage Sum Invariant**
    - **Validates: Requirements 4.3**

- [x] 3. Implement Timeline Formatter (Round-trip)
  - [x] 3.1 Add `formatTimeline(timeline)` function to timeline-aggregator.ts
    - Convert timeline array to human-readable string
    - Include start, end, parent, and type for each block
    - _Requirements: 8.1, 8.2_
  - [x] 3.2 Add `parseTimelineString(str)` function for round-trip testing
    - Parse formatted string back to timeline array
    - _Requirements: 8.3_
  - [x] 3.3 Write property test for round-trip serialization
    - **Property 6: Round-trip Serialization**
    - **Validates: Requirements 8.3**

- [x] 4. Checkpoint - Ensure all aggregator tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update Edge Function with Timeline Generation Prompt
  - [x] 5.1 Add TERM_DATES constant to `supabase/functions/analyze-order/index.ts`
    - Include 2026, 2027, 2028 VIC school term dates
    - _Requirements: 3.2, 3.4_
  - [x] 5.2 Update request handling to accept year parameter
    - Extract year from request body (default: 2026)
    - Select corresponding term dates
    - _Requirements: 3.1, 3.3_
  - [x] 5.3 Replace system prompt with timeline generation instructions
    - Instruct LLM to generate timeline array covering 100% of year
    - Enforce continuous coverage (no gaps)
    - Specify JSON schema: `timeline: [string, string, ParentCode, TypeCode][]`
    - Inject school term dates for context
    - Keep document validation (INVALID_DOCUMENT_TYPE check)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 3.5, 5.1, 5.2, 5.3, 5.4_

- [x] 6. Delete Old CareCalculator Implementation
  - [x] 6.1 Remove CareCalculator class and simulation logic from `src/utils/CareCalculator.ts`
    - Delete CareCalculator class
    - Delete SIMULATION_DAYS constant
    - Delete checkHolidayRules method
    - Delete getBasePatternMidnightOwner method
    - Delete carry-over logic
    - Keep SCHOOL_TERMS_2026 if needed elsewhere, or move to timeline-types.ts
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 6.2 Re-export new functions from CareCalculator.ts for backward compatibility
    - Export calculateCareFromTimeline as calculateCareFromOrder (or update all imports)
    - Export CareCalculationResult type
    - _Requirements: 7.5_

- [x] 7. Update CourtOrderToolScreen
  - [x] 7.1 Update analyzeOrder function to pass year parameter
    - Add year to request body (default to current year or 2026)
    - _Requirements: 6.1_
  - [x] 7.2 Update result handling to use new timeline aggregator
    - Import calculateCareFromTimeline
    - Pass timeline response to aggregator
    - Handle validation errors
    - _Requirements: 6.2, 6.3_
  - [x] 7.3 Update error handling for new error types
    - Display INVALID_DOCUMENT_TYPE errors
    - Display timeline validation errors
    - _Requirements: 6.4_
  - [x] 7.4 Remove references to old CourtOrderJSON type
    - Update orderJson state to use TimelineResponse
    - Update debug view to show timeline blocks
    - _Requirements: 6.2_

- [x] 8. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Verify Edge Function deploys successfully
  - Test end-to-end with sample court order

## Notes

- All property-based tests are required for comprehensive validation
- Each property test should run minimum 100 iterations
- The Edge Function uses Claude claude-sonnet-4-5-20250929 model
- School term dates are for VIC state only in initial implementation
