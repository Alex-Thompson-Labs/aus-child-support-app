/**
 * Timeline Validator for Court Order Interpreter
 *
 * Validates timeline blocks for format, coverage, and continuity.
 *
 * Requirements: 2.1, 2.2, 2.4, 2.5
 */

import { ParentCode, TimelineBlock, TypeCode } from './timeline-types';

/**
 * Validation error codes.
 */
export type ValidationErrorCode =
  | 'INVALID_BLOCK_FORMAT'
  | 'INVALID_TIMELINE_BOUNDS'
  | 'INVALID_TIMELINE_GAPS';

/**
 * Validation error object.
 */
export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  details?: {
    blockIndex?: number;
    expected?: string;
    actual?: string;
  };
}

/**
 * Validation result.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Valid parent codes.
 */
const VALID_PARENT_CODES: ParentCode[] = ['M', 'F'];

/**
 * Valid type codes.
 */
const VALID_TYPE_CODES: TypeCode[] = ['base', 'holiday', 'christmas'];

/**
 * ISO datetime regex pattern (YYYY-MM-DDTHH:MM format).
 */
const ISO_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * Validate a single timeline block format.
 *
 * Checks:
 * - Block is an array of exactly 4 elements
 * - Start and end are valid ISO datetime strings with minute precision
 * - Parent code is 'M' or 'F'
 * - Type code is 'base', 'holiday', or 'christmas'
 * - Start time is before end time
 *
 * @param block - The timeline block to validate
 * @param blockIndex - Optional index for error reporting
 * @returns ValidationResult with valid flag and any errors
 */
export function validateTimelineBlock(
  block: unknown,
  blockIndex?: number
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if block is an array
  if (!Array.isArray(block)) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: 'Timeline block must be an array',
      details: { blockIndex }
    });
    return { valid: false, errors };
  }

  // Check array length
  if (block.length !== 4) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: `Timeline block must have exactly 4 elements, got ${block.length}`,
      details: { blockIndex, expected: '4', actual: String(block.length) }
    });
    return { valid: false, errors };
  }

  const [start, end, parentCode, typeCode] = block;

  // Validate start datetime format
  if (typeof start !== 'string' || !ISO_DATETIME_PATTERN.test(start)) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: 'Start time must be ISO datetime with minute precision (YYYY-MM-DDTHH:MM)',
      details: { blockIndex, expected: 'YYYY-MM-DDTHH:MM', actual: String(start) }
    });
  }

  // Validate end datetime format
  if (typeof end !== 'string' || !ISO_DATETIME_PATTERN.test(end)) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: 'End time must be ISO datetime with minute precision (YYYY-MM-DDTHH:MM)',
      details: { blockIndex, expected: 'YYYY-MM-DDTHH:MM', actual: String(end) }
    });
  }

  // Validate parent code
  if (!VALID_PARENT_CODES.includes(parentCode as ParentCode)) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: `Parent code must be 'M' or 'F', got '${parentCode}'`,
      details: { blockIndex, expected: 'M or F', actual: String(parentCode) }
    });
  }

  // Validate type code
  if (!VALID_TYPE_CODES.includes(typeCode as TypeCode)) {
    errors.push({
      code: 'INVALID_BLOCK_FORMAT',
      message: `Type code must be 'base', 'holiday', or 'christmas', got '${typeCode}'`,
      details: { blockIndex, expected: 'base, holiday, or christmas', actual: String(typeCode) }
    });
  }

  // Validate start is before end (only if both are valid datetime strings)
  if (
    typeof start === 'string' &&
    typeof end === 'string' &&
    ISO_DATETIME_PATTERN.test(start) &&
    ISO_DATETIME_PATTERN.test(end)
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate >= endDate) {
      errors.push({
        code: 'INVALID_BLOCK_FORMAT',
        message: 'Start time must be before end time',
        details: { blockIndex, expected: `${start} < ${end}`, actual: `${start} >= ${end}` }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate that timeline covers the full year boundaries.
 *
 * Requirement 2.1: Timeline must cover January 1 00:00 to December 31 23:59.
 *
 * @param timeline - Array of timeline blocks
 * @param year - The year to validate against
 * @returns ValidationResult with valid flag and any errors
 */
export function validateTimelineCoverage(
  timeline: TimelineBlock[],
  year: number
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!timeline || timeline.length === 0) {
    errors.push({
      code: 'INVALID_TIMELINE_BOUNDS',
      message: 'Timeline is empty',
      details: { expected: 'At least one block', actual: '0 blocks' }
    });
    return { valid: false, errors };
  }

  // Expected boundaries
  const expectedStart = `${year}-01-01T00:00`;
  const expectedEnd = `${year}-12-31T23:59`;

  // Get first and last blocks
  const firstBlock = timeline[0];
  const lastBlock = timeline[timeline.length - 1];

  // Check start boundary
  if (firstBlock[0] !== expectedStart) {
    errors.push({
      code: 'INVALID_TIMELINE_BOUNDS',
      message: `Timeline must start at ${expectedStart}`,
      details: { expected: expectedStart, actual: firstBlock[0] }
    });
  }

  // Check end boundary
  if (lastBlock[1] !== expectedEnd) {
    errors.push({
      code: 'INVALID_TIMELINE_BOUNDS',
      message: `Timeline must end at ${expectedEnd}`,
      details: { expected: expectedEnd, actual: lastBlock[1] }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate that timeline has no gaps between consecutive blocks.
 *
 * Requirements 2.2, 2.4, 2.5: End time of block[i] must equal start time of block[i+1].
 *
 * @param timeline - Array of timeline blocks
 * @returns ValidationResult with valid flag and any errors
 */
export function validateTimelineContinuity(
  timeline: TimelineBlock[]
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!timeline || timeline.length < 2) {
    // Single block or empty timeline has no gaps by definition
    return { valid: true, errors: [] };
  }

  for (let i = 0; i < timeline.length - 1; i++) {
    const currentBlock = timeline[i];
    const nextBlock = timeline[i + 1];

    const currentEnd = currentBlock[1];
    const nextStart = nextBlock[0];

    if (currentEnd !== nextStart) {
      errors.push({
        code: 'INVALID_TIMELINE_GAPS',
        message: `Gap detected between block ${i} and block ${i + 1}`,
        details: {
          blockIndex: i,
          expected: `Block ${i} end (${currentEnd}) === Block ${i + 1} start`,
          actual: `${currentEnd} !== ${nextStart}`
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an entire timeline for format, coverage, and continuity.
 *
 * @param timeline - Array of timeline blocks
 * @param year - The year to validate against
 * @returns ValidationResult with valid flag and all errors
 */
export function validateTimeline(
  timeline: TimelineBlock[],
  year: number
): ValidationResult {
  const allErrors: ValidationError[] = [];

  // Validate each block format
  for (let i = 0; i < timeline.length; i++) {
    const blockResult = validateTimelineBlock(timeline[i], i);
    allErrors.push(...blockResult.errors);
  }

  // If any block format is invalid, skip coverage/continuity checks
  if (allErrors.length > 0) {
    return { valid: false, errors: allErrors };
  }

  // Validate coverage
  const coverageResult = validateTimelineCoverage(timeline, year);
  allErrors.push(...coverageResult.errors);

  // Validate continuity
  const continuityResult = validateTimelineContinuity(timeline);
  allErrors.push(...continuityResult.errors);

  return { valid: allErrors.length === 0, errors: allErrors };
}
