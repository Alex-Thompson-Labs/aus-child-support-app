# Requirements Document

## Introduction

This specification covers the refactoring of the Court Order Interpreter feature from a "Rule Extraction" architecture to a "Timeline Generation" architecture. The current implementation extracts rules from court orders and attempts to simulate complex care schedules in TypeScript (CareCalculator.ts), which fails on edge cases involving holiday rules, alternating weeks, and carry-over logic. The new approach shifts the complexity to the LLM, which will generate a strict, minute-by-minute JSON timeline covering the entire year. The frontend will simply aggregate this timeline data.

## Glossary

- **Timeline_Generator**: The Supabase Edge Function that uses an LLM to analyze court orders and produce a timeline array
- **Timeline_Block**: A single entry in the timeline array representing a continuous period of care by one parent
- **Timeline_Aggregator**: The TypeScript function that processes the timeline array to calculate care statistics
- **Care_Parent**: Either "Mother" or "Father" - the parent who has overnight care
- **Type_Code**: Classification of the care period - "base" for regular schedule, "holiday" for school holidays, "christmas" for Christmas period
- **Continuous_Coverage**: The requirement that timeline blocks must cover 100% of the year with no gaps
- **School_Term_Dates**: Official school term start/end dates for Australian states, used to determine holiday periods

## Requirements

### Requirement 1: Timeline JSON Schema

**User Story:** As a developer, I want the LLM to output a strict JSON schema, so that the frontend can reliably parse and aggregate the timeline data.

#### Acceptance Criteria

1. THE Timeline_Generator SHALL output a JSON object containing a `timeline` array
2. WHEN generating timeline blocks, THE Timeline_Generator SHALL use the format `[start_iso_string, end_iso_string, parent_code, type_code]` for each block
3. THE Timeline_Generator SHALL use "M" for Mother and "F" for Father as parent_code values
4. THE Timeline_Generator SHALL use "base", "holiday", or "christmas" as type_code values
5. WHEN outputting ISO strings, THE Timeline_Generator SHALL include minute-level precision (e.g., "2026-01-01T00:00")

### Requirement 2: Continuous Coverage Enforcement

**User Story:** As a user, I want the timeline to cover the entire year without gaps, so that care percentages are calculated accurately.

#### Acceptance Criteria

1. THE Timeline_Generator SHALL produce blocks that cover 100% of the specified year (January 1 00:00 to December 31 23:59)
2. WHEN generating consecutive blocks, THE Timeline_Generator SHALL ensure the end time of one block equals the start time of the next block
3. IF the court order does not specify care for a period, THEN THE Timeline_Generator SHALL assign that period to the primary parent
4. THE Timeline_Aggregator SHALL validate that no gaps exist between timeline blocks
5. IF gaps are detected in the timeline, THEN THE Timeline_Aggregator SHALL return an error indicating invalid timeline data

### Requirement 3: School Term Date Context Injection

**User Story:** As a developer, I want school term dates injected into the LLM prompt, so that the model can accurately identify holiday periods.

#### Acceptance Criteria

1. THE Timeline_Generator SHALL accept a `year` parameter in the request body (default: 2026)
2. THE Timeline_Generator SHALL include school term dates for 2026, 2027, and 2028 in the system prompt
3. WHEN the year parameter is provided, THE Timeline_Generator SHALL select the corresponding term dates for prompt context
4. THE Timeline_Generator SHALL include term dates for VIC state as the primary reference
5. THE Timeline_Generator SHALL derive school holiday periods from gaps between term dates

### Requirement 4: Timeline Aggregation

**User Story:** As a user, I want the system to calculate care statistics from the timeline, so that I can see accurate night counts and percentages.

#### Acceptance Criteria

1. THE Timeline_Aggregator SHALL calculate total minutes for each parent from the timeline blocks
2. THE Timeline_Aggregator SHALL convert minutes to nights using the midnight rule (who has care at 11:59 PM)
3. THE Timeline_Aggregator SHALL calculate care percentages for each parent
4. THE Timeline_Aggregator SHALL return motherNights, fatherNights, motherPercentage, and fatherPercentage
5. THE Timeline_Aggregator SHALL return motherNightsPerYear and fatherNightsPerYear values

### Requirement 5: Document Validation

**User Story:** As a user, I want invalid documents rejected before processing, so that I don't receive incorrect results from templates or guides.

#### Acceptance Criteria

1. WHEN a document contains "Example", "Guide", "Brochure", "Template", or "Sample", THEN THE Timeline_Generator SHALL return an INVALID_DOCUMENT_TYPE error
2. WHEN a document uses generic names like "John Doe" or "Jane Doe", THEN THE Timeline_Generator SHALL return an INVALID_DOCUMENT_TYPE error
3. WHEN a document lacks a Court File Number or signatures, THEN THE Timeline_Generator SHALL return an INVALID_DOCUMENT_TYPE error
4. IF the document is invalid, THEN THE Timeline_Generator SHALL return a JSON object with `error` and `reason` fields

### Requirement 6: Frontend Integration

**User Story:** As a user, I want the Court Order Tool screen to work with the new timeline architecture, so that I can continue analyzing court orders seamlessly.

#### Acceptance Criteria

1. WHEN calling the analyze-order function, THE CourtOrderToolScreen SHALL pass the selected year parameter
2. THE CourtOrderToolScreen SHALL use the Timeline_Aggregator to process the returned timeline
3. THE CourtOrderToolScreen SHALL display the calculated care statistics (nights and percentages)
4. IF the Timeline_Generator returns an error, THEN THE CourtOrderToolScreen SHALL display the error message to the user

### Requirement 7: Backward Compatibility Removal

**User Story:** As a developer, I want the old simulation logic removed, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. THE Timeline_Aggregator SHALL NOT use the CareCalculator class
2. THE Timeline_Aggregator SHALL NOT use SIMULATION_DAYS constant or day-by-day simulation
3. THE Timeline_Aggregator SHALL NOT use checkHolidayRules or getBasePatternMidnightOwner methods
4. THE Timeline_Aggregator SHALL NOT use carry-over logic for missing days
5. THE new implementation SHALL delete the CareCalculator class entirely

### Requirement 8: Pretty Printer for Timeline

**User Story:** As a developer, I want to format timeline data back to a readable string, so that I can debug and verify the timeline output.

#### Acceptance Criteria

1. THE Timeline_Aggregator module SHALL export a formatTimeline function
2. WHEN formatting a timeline, THE formatTimeline function SHALL produce a human-readable string representation
3. FOR ALL valid timeline arrays, parsing then formatting then parsing SHALL produce an equivalent timeline (round-trip property)
