/**
 * Cost Percentage Table for Child Support Calculations
 *
 * This table shows how care percentage is converted to cost percentage
 * in the child support formula.
 */
export const COST_PERCENTAGE_TABLE = [
    { careRange: '0% - 13%', costResult: 'Nil' },
    { careRange: '14% - 34%', costResult: '24%' },
    { careRange: '35% - 47%', costResult: '25% + 2% per point over 35%' },
    { careRange: '48% - 52%', costResult: '50%' },
    { careRange: '53% - 65%', costResult: '51% + 2% per point over 53%' },
] as const;

export type CostPercentageRow = (typeof COST_PERCENTAGE_TABLE)[number];
