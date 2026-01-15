/**
 * Property-Based Tests for Timeline Validator
 *
 * Feature: court-order-timeline-refactor
 * Property 2: Continuous Coverage (No Gaps)
 * Validates: Requirements 2.2, 2.4, 2.5
 *
 * Property 1: Year Boundary Coverage
 * Validates: Requirements 2.1
 */

import * as fc from 'fast-check';
import { ParentCode, TimelineBlock, TypeCode } from '../timeline-types';
import {
    validateTimelineBlock,
    validateTimelineContinuity,
    validateTimelineCoverage
} from '../timeline-validator';

// ============================================================================
// Generators
// ============================================================================

/**
 * Generate a valid parent code.
 */
const parentCodeArb: fc.Arbitrary<ParentCode> = fc.constantFrom('M', 'F');

/**
 * Generate a valid type code.
 */
const typeCodeArb: fc.Arbitrary<TypeCode> = fc.constantFrom('base', 'holiday', 'christmas');

/**
 * Generate a valid year (2026-2028 as per design).
 */
const yearArb: fc.Arbitrary<number> = fc.constantFrom(2026, 2027, 2028);

/**
 * Format a date as ISO datetime with minute precision.
 */
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
 * This generator creates timelines that are guaranteed to be continuous
 * (no gaps between blocks).
 */
function validContinuousTimelineArb(year: number): fc.Arbitrary<TimelineBlock[]> {
  const yearStart = new Date(year, 0, 1, 0, 0); // Jan 1 00:00
  const yearEnd = new Date(year, 11, 31, 23, 59); // Dec 31 23:59
  const totalMinutes = Math.floor((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60));

  return fc
    .array(fc.nat({ max: totalMinutes - 1 }), { minLength: 1, maxLength: 50 })
    .chain((splitPoints) => {
      // Sort and deduplicate split points
      const uniqueSorted = [...new Set(splitPoints)].sort((a, b) => a - b);

      // Generate parent and type codes for each block
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
              typeCodes[i]
            ]);

            currentStart = endDate;
          }

          // Final block to year end
          blocks.push([
            formatISOMinute(currentStart),
            formatISOMinute(yearEnd),
            parentCodes[uniqueSorted.length],
            typeCodes[uniqueSorted.length]
          ]);

          return blocks;
        });
    });
}

/**
 * Generate a timeline with at least one gap (for negative testing).
 */
function timelineWithGapArb(year: number): fc.Arbitrary<TimelineBlock[]> {
  return validContinuousTimelineArb(year).chain((timeline) => {
    if (timeline.length < 2) {
      // Can't create a gap with single block, return as-is
      return fc.constant(timeline);
    }

    // Pick a random index to introduce a gap
    return fc.nat({ max: timeline.length - 2 }).map((gapIndex) => {
      const result = [...timeline];
      const block = result[gapIndex];

      // Modify the end time to create a gap (subtract 1 minute)
      const endDate = new Date(block[1].replace('T', ' ').replace(/-/g, '/'));
      endDate.setMinutes(endDate.getMinutes() - 1);

      result[gapIndex] = [block[0], formatISOMinute(endDate), block[2], block[3]];
      return result;
    });
  });
}

// ============================================================================
// Property Tests
// ============================================================================

describe('Timeline Validator Property Tests', () => {
  /**
   * Feature: court-order-timeline-refactor
   * Property 2: Continuous Coverage (No Gaps)
   * Validates: Requirements 2.2, 2.4, 2.5
   *
   * For any valid timeline, for all consecutive block pairs (block[i], block[i+1]),
   * the end time of block[i] must exactly equal the start time of block[i+1].
   * If any gap exists, the validation function must return an error.
   */
  describe('Property 2: Continuous Coverage (No Gaps)', () => {
    it('should validate continuous timelines as valid', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const result = validateTimelineContinuity(timeline);
              expect(result.valid).toBe(true);
              expect(result.errors).toHaveLength(0);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 } // Run for each year
      );
    });

    it('should detect gaps in timelines', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(timelineWithGapArb(year), (timeline) => {
              // Only test if we actually have multiple blocks (gap possible)
              if (timeline.length < 2) return;

              // Check if there's actually a gap
              let hasGap = false;
              for (let i = 0; i < timeline.length - 1; i++) {
                if (timeline[i][1] !== timeline[i + 1][0]) {
                  hasGap = true;
                  break;
                }
              }

              if (hasGap) {
                const result = validateTimelineContinuity(timeline);
                expect(result.valid).toBe(false);
                expect(result.errors.length).toBeGreaterThan(0);
                expect(result.errors.some((e) => e.code === 'INVALID_TIMELINE_GAPS')).toBe(true);
              }
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('should report correct gap location', () => {
      fc.assert(
        fc.property(
          yearArb,
          fc.nat({ max: 10 }),
          (year, gapIndex) => {
            return fc.assert(
              fc.property(validContinuousTimelineArb(year), (timeline) => {
                if (timeline.length < 2) return;

                // Introduce gap at specific index
                const actualGapIndex = Math.min(gapIndex, timeline.length - 2);
                const modifiedTimeline = [...timeline];
                const block = modifiedTimeline[actualGapIndex];

                // Create a 1-minute gap
                const endDate = new Date(block[1].replace('T', ' ').replace(/-/g, '/'));
                endDate.setMinutes(endDate.getMinutes() - 1);
                modifiedTimeline[actualGapIndex] = [
                  block[0],
                  formatISOMinute(endDate),
                  block[2],
                  block[3]
                ];

                const result = validateTimelineContinuity(modifiedTimeline);
                expect(result.valid).toBe(false);

                // Check that the error references the correct block index
                const gapError = result.errors.find(
                  (e) => e.code === 'INVALID_TIMELINE_GAPS' && e.details?.blockIndex === actualGapIndex
                );
                expect(gapError).toBeDefined();
              }),
              { numRuns: 50 }
            );
          }
        ),
        { numRuns: 3 }
      );
    });
  });

  /**
   * Feature: court-order-timeline-refactor
   * Property 1: Year Boundary Coverage
   * Validates: Requirements 2.1
   *
   * For any valid timeline for a given year, the first block must start at
   * January 1st 00:00 and the last block must end at December 31st 23:59 of that year.
   */
  describe('Property 1: Year Boundary Coverage', () => {
    it('should validate timelines with correct year boundaries', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              const result = validateTimelineCoverage(timeline, year);
              expect(result.valid).toBe(true);
              expect(result.errors).toHaveLength(0);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('should reject timelines that do not start at year beginning', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              if (timeline.length === 0) return;

              // Modify first block to start later
              const modifiedTimeline = [...timeline];
              const firstBlock = modifiedTimeline[0];
              const laterStart = `${year}-01-01T01:00`; // 1 hour later

              modifiedTimeline[0] = [laterStart, firstBlock[1], firstBlock[2], firstBlock[3]];

              const result = validateTimelineCoverage(modifiedTimeline, year);
              expect(result.valid).toBe(false);
              expect(result.errors.some((e) => e.code === 'INVALID_TIMELINE_BOUNDS')).toBe(true);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('should reject timelines that do not end at year end', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          return fc.assert(
            fc.property(validContinuousTimelineArb(year), (timeline) => {
              if (timeline.length === 0) return;

              // Modify last block to end earlier
              const modifiedTimeline = [...timeline];
              const lastBlock = modifiedTimeline[modifiedTimeline.length - 1];
              const earlierEnd = `${year}-12-31T22:59`; // 1 hour earlier

              modifiedTimeline[modifiedTimeline.length - 1] = [
                lastBlock[0],
                earlierEnd,
                lastBlock[2],
                lastBlock[3]
              ];

              const result = validateTimelineCoverage(modifiedTimeline, year);
              expect(result.valid).toBe(false);
              expect(result.errors.some((e) => e.code === 'INVALID_TIMELINE_BOUNDS')).toBe(true);
            }),
            { numRuns: 100 }
          );
        }),
        { numRuns: 3 }
      );
    });

    it('should reject empty timelines', () => {
      fc.assert(
        fc.property(yearArb, (year) => {
          const result = validateTimelineCoverage([], year);
          expect(result.valid).toBe(false);
          expect(result.errors.some((e) => e.code === 'INVALID_TIMELINE_BOUNDS')).toBe(true);
        }),
        { numRuns: 3 }
      );
    });
  });

  /**
   * Block format validation tests.
   */
  describe('Block Format Validation', () => {
    it('should validate correctly formatted blocks', () => {
      fc.assert(
        fc.property(
          yearArb,
          fc.nat({ max: 364 }),
          fc.nat({ max: 23 }),
          fc.nat({ max: 59 }),
          parentCodeArb,
          typeCodeArb,
          (year, dayOffset, hour, minute, parent, type) => {
            const startDate = new Date(year, 0, 1 + dayOffset, hour, minute);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

            const block: TimelineBlock = [
              formatISOMinute(startDate),
              formatISOMinute(endDate),
              parent,
              type
            ];

            const result = validateTimelineBlock(block);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject blocks with invalid parent codes', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => s !== 'M' && s !== 'F'),
          (invalidParent) => {
            const block = ['2026-01-01T00:00', '2026-01-01T12:00', invalidParent, 'base'];
            const result = validateTimelineBlock(block);
            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.code === 'INVALID_BLOCK_FORMAT')).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject blocks with invalid type codes', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => !['base', 'holiday', 'christmas'].includes(s)),
          (invalidType) => {
            const block = ['2026-01-01T00:00', '2026-01-01T12:00', 'M', invalidType];
            const result = validateTimelineBlock(block);
            expect(result.valid).toBe(false);
            expect(result.errors.some((e) => e.code === 'INVALID_BLOCK_FORMAT')).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject blocks where start >= end', () => {
      fc.assert(
        fc.property(yearArb, parentCodeArb, typeCodeArb, (year, parent, type) => {
          // Same time
          const sameTimeBlock: TimelineBlock = [
            `${year}-06-15T12:00`,
            `${year}-06-15T12:00`,
            parent,
            type
          ];
          const sameResult = validateTimelineBlock(sameTimeBlock);
          expect(sameResult.valid).toBe(false);

          // End before start
          const reversedBlock: TimelineBlock = [
            `${year}-06-15T14:00`,
            `${year}-06-15T12:00`,
            parent,
            type
          ];
          const reversedResult = validateTimelineBlock(reversedBlock);
          expect(reversedResult.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
