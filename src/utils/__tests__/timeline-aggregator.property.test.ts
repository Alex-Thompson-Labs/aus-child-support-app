/**
 * Property-Based Tests for Timeline Aggregator
 *
 * Feature: court-order-timeline-refactor
 *
 * Property 3: Total Minutes Conservation
 * Validates: Requirements 4.1
 *
 * Property 4: Midnight Rule Night Counting
 * Validates: Requirements 4.2
 *
 * Property 5: Percentage Sum Invariant
 * Validates: Requirements 4.3
 */

import * as fc from 'fast-check';
import {
    calculateCareFromTimeline,
    calculateMinutesPerParent,
    countNightsPerParent,
    formatTimeline,
    parseTimelineString,
} from '../timeline-aggregator';
import {
    ParentCode,
    TimelineBlock,
    TimelineResponse,
    TypeCode,
    getTotalDaysInYear
} from '../timeline-types';

// ============================================================================
// Generators (reused from timeline-validator tests)
// ============================================================================

const parentCodeArb: fc.Arbitrary<ParentCode> = fc.constantFrom('M', 'F');
const typeCodeArb: fc.Arbitrary<TypeCode> = fc.constantFrom('base', 'holiday', 'christmas');
const yearArb: fc.Arbitrary<number> = fc.constantFrom(2026, 2027, 2028);

function formatISOMinute(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Generate a valid continuous timeline for a given year.
 */
function validContinuousTimelineArb(year: number): fc.Arbitrary<TimelineBlock[]> {
  const yearStart = new Date(year, 0, 1, 0, 0);
  const yearEnd = new Date(year, 11, 31, 23, 59);
  const totalMinutes = Math.floor((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60));

  return fc
    .array(fc.integer({ min: 1, max: totalMinutes - 1 }), { minLength: 0, maxLength: 49 })
    .chain((splitPoints) => {
      // Sort and deduplicate split points, filter out 0 to avoid zero-duration blocks
      const uniqueSorted = [...new Set(splitPoints)].filter(p => p > 0).sort((a, b) => a - b);
      const numBlocks = uniqueSorted.length + 1;

      return fc
        .tuple(
          fc.array(parentCodeArb, { minLength: numBlocks, maxLength: numBlocks }),
          fc.array(typeCodeArb, { minLength: numBlocks, maxLength: numBlocks })
        )
        .map(([parentCodes, typeCodes]): TimelineBlock[] => {
          const blocks: TimelineBlock[] = [];
          let currentStart = yearStart;

          for (let i = 0; i < uniqueSorted.length; i++) {
            const endMinutes = uniqueSorted[i];
            const endDate = new Date(yearStart.getTime() + endMinutes * 60 * 1000);

            blocks.push([
              formatISOMinute(currentStart),
              formatISOMinute(endDate),
              parentCodes[i],
              typeCodes[i],
            ]);

            currentStart = endDate;
          }

          blocks.push([
            formatISOMinute(currentStart),
            formatISOMinute(yearEnd),
            parentCodes[uniqueSorted.length],
            typeCodes[uniqueSorted.length],
          ]);

          return blocks;
        });
    });
}

/**
 * Generate a valid TimelineResponse for a given year.
 */
function validTimelineResponseArb(year: number): fc.Arbitrary<TimelineResponse> {
  return fc.tuple(validContinuousTimelineArb(year), parentCodeArb).map(([timeline, primaryParent]) => ({
    timeline,
    year,
    primary_parent: primaryParent,
  }));
}

// ============================================================================
// Property Tests
// ============================================================================

describe('Timeline Aggregator Property Tests', () => {
  /**
   * Feature: court-order-timeline-refactor
   * Property 3: Total Minutes Conservation
   * Validates: Requirements 4.1
   *
   * For any valid timeline covering a full year, the sum of all block durations
   * (motherMinutes + fatherMinutes) must equal the total minutes in that year
   * from Jan 1 00:00 to Dec 31 23:59 (525,599 for non-leap years, 527,039 for leap years).
   */
  describe('Property 3: Total Minutes Conservation', () => {
    it('sum of parent minutes equals total minutes in year', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const { motherMinutes, fatherMinutes } = calculateMinutesPerParent(timeline);
              const totalMinutes = motherMinutes + fatherMinutes;
              
              // Timeline covers Jan 1 00:00 to Dec 31 23:59
              // This is (365 or 366 days * 24 hours * 60 minutes) - 1 minute
              const totalDays = getTotalDaysInYear(year);
              const expectedMinutes = totalDays * 24 * 60 - 1;

              expect(totalMinutes).toBe(expectedMinutes);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });
  });


  /**
   * Feature: court-order-timeline-refactor
   * Property 4: Midnight Rule Night Counting
   * Validates: Requirements 4.2
   *
   * For any valid timeline and any day within the year, the night is attributed
   * to the parent who has care at 23:59 of that day. The sum of motherNights +
   * fatherNights must equal 365 (or 366 for leap years).
   */
  describe('Property 4: Midnight Rule Night Counting', () => {
    it('sum of parent nights equals total days in year', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const { motherNights, fatherNights } = countNightsPerParent(timeline, year);
              const totalNights = motherNights + fatherNights;
              const expectedDays = getTotalDaysInYear(year);

              expect(totalNights).toBe(expectedDays);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('nights are non-negative', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const { motherNights, fatherNights } = countNightsPerParent(timeline, year);

              expect(motherNights).toBeGreaterThanOrEqual(0);
              expect(fatherNights).toBeGreaterThanOrEqual(0);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });
  });


  /**
   * Feature: court-order-timeline-refactor
   * Property 5: Percentage Sum Invariant
   * Validates: Requirements 4.3
   *
   * For any valid CareCalculationResult, motherPercentage + fatherPercentage
   * must equal 100 (within floating-point tolerance of ±0.1 due to rounding).
   */
  describe('Property 5: Percentage Sum Invariant', () => {
    it('percentages sum to 100 within tolerance', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validTimelineResponseArb(year), (response) => {
              const result = calculateCareFromTimeline(response);
              const percentageSum = result.motherPercentage + result.fatherPercentage;

              // Allow ±0.1 tolerance for floating-point rounding
              expect(percentageSum).toBeGreaterThanOrEqual(99.9);
              expect(percentageSum).toBeLessThanOrEqual(100.1);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('percentages are between 0 and 100', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validTimelineResponseArb(year), (response) => {
              const result = calculateCareFromTimeline(response);

              expect(result.motherPercentage).toBeGreaterThanOrEqual(0);
              expect(result.motherPercentage).toBeLessThanOrEqual(100);
              expect(result.fatherPercentage).toBeGreaterThanOrEqual(0);
              expect(result.fatherPercentage).toBeLessThanOrEqual(100);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('nightsPerYear matches nights', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validTimelineResponseArb(year), (response) => {
              const result = calculateCareFromTimeline(response);

              expect(result.motherNightsPerYear).toBe(result.motherNights);
              expect(result.fatherNightsPerYear).toBe(result.fatherNights);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('totalDays matches year', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validTimelineResponseArb(year), (response) => {
              const result = calculateCareFromTimeline(response);
              const expectedDays = getTotalDaysInYear(year);

              expect(result.totalDays).toBe(expectedDays);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });
  });


  /**
   * Feature: court-order-timeline-refactor
   * Property 6: Round-trip Serialization
   * Validates: Requirements 8.3
   *
   * For any valid timeline array, formatting the timeline to a string and then
   * parsing it back must produce an equivalent timeline array.
   */
  describe('Property 6: Round-trip Serialization', () => {
    it('format then parse produces equivalent timeline', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const formatted = formatTimeline(timeline);
              const parsed = parseTimelineString(formatted);

              // Check that the parsed timeline has the same length
              expect(parsed.length).toBe(timeline.length);

              // Check each block is equivalent
              for (let i = 0; i < timeline.length; i++) {
                const [origStart, origEnd, origParent, origType] = timeline[i];
                const [parsedStart, parsedEnd, parsedParent, parsedType] = parsed[i];

                expect(parsedStart).toBe(origStart);
                expect(parsedEnd).toBe(origEnd);
                expect(parsedParent).toBe(origParent);
                expect(parsedType).toBe(origType);
              }
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('empty timeline round-trips correctly', () => {
      const emptyTimeline: TimelineBlock[] = [];
      const formatted = formatTimeline(emptyTimeline);
      const parsed = parseTimelineString(formatted);

      expect(parsed).toEqual([]);
    });
  });
});
