
import { validateTotalCare } from '../care-utils';

describe('validateTotalCare', () => {
    it('should return true for valid annual nights summing to 365', () => {
        // 182.5 + 182.5 = 365
        expect(validateTotalCare(50, 50, 'percent')).toBe(true);
    });

    it('should return true for valid weekly nights summing to 7', () => {
        // 3 + 4 = 7. 3/7*365 + 4/7*365 = 156.4 + 208.5 = 365
        expect(validateTotalCare(3, 4, 'week')).toBe(true);
    });

    it('should return true for valid fortnightly nights summing to 14', () => {
        // 7 + 7 = 14
        expect(validateTotalCare(7, 7, 'fortnight')).toBe(true);
    });

    it('should return false for invalid sum', () => {
        // 3 + 3 = 6 (per week) -> 312 nights
        expect(validateTotalCare(3, 3, 'week')).toBe(false);
    });

    it('should return false for roughly correct but outside tolerance', () => {
        // 182 + 182 = 364 (percent) -> 364 nights. Difference is 1. Tolerance is 0.5.
        expect(validateTotalCare(182, 182, 'year')).toBe(false);
    });

    it('should return true for sum within tolerance', () => {
        // 182.25 + 182.25 = 364.5. 
        // If we input nights per year.
        // 182.25 is not integer, but let's assume float input is allowed.
        expect(validateTotalCare(182.5, 182.5, 'year')).toBe(true);
    });
});
