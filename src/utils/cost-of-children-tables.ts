// Cost of Children tables - massive data structure by year
// Structure: year -> ageGroup -> childCount -> brackets[]

export interface CostBracket {
  min_income: number;
  max_income: number | null;
  fixed: number;
  rate: number;
}

export type ChildCountKey = '1Child' | '2Children' | '3PlusChildren';
export type AgeGroupKey = 'all0_12' | 'all13Plus' | 'mixedAges';

export type CostTablesByYear = Record<
  string,
  Record<AgeGroupKey, Record<ChildCountKey, CostBracket[]>>
>;

export const costOfChildrenByYear: CostTablesByYear = {
  '2025': {
    all0_12: {
      '1Child': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.17 },
        { min_income: 44763, max_income: 89523, fixed: 7610, rate: 0.15 },
        { min_income: 89524, max_income: 134285, fixed: 14324, rate: 0.12 },
        { min_income: 134286, max_income: 179046, fixed: 19695, rate: 0.1 },
        { min_income: 179047, max_income: 223808, fixed: 24171, rate: 0.07 },
        { min_income: 223809, max_income: null, fixed: 27304, rate: 0 },
      ],
      '2Children': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.24 },
        { min_income: 44763, max_income: 89523, fixed: 10743, rate: 0.23 },
        { min_income: 89524, max_income: 134285, fixed: 21038, rate: 0.2 },
        { min_income: 134286, max_income: 179046, fixed: 29990, rate: 0.18 },
        { min_income: 179047, max_income: 223808, fixed: 38047, rate: 0.1 },
        { min_income: 223809, max_income: null, fixed: 42523, rate: 0 },
      ],
      '3PlusChildren': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.27 },
        { min_income: 44763, max_income: 89523, fixed: 12086, rate: 0.26 },
        { min_income: 89524, max_income: 134285, fixed: 23724, rate: 0.25 },
        { min_income: 134286, max_income: 179046, fixed: 34915, rate: 0.24 },
        { min_income: 179047, max_income: 223808, fixed: 45658, rate: 0.18 },
        { min_income: 223809, max_income: null, fixed: 53715, rate: 0 },
      ],
    },
    all13Plus: {
      '1Child': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.23 },
        { min_income: 44763, max_income: 89523, fixed: 10295, rate: 0.22 },
        { min_income: 89524, max_income: 134285, fixed: 20142, rate: 0.12 },
        { min_income: 134286, max_income: 179046, fixed: 25513, rate: 0.1 },
        { min_income: 179047, max_income: 223808, fixed: 29989, rate: 0.09 },
        { min_income: 223809, max_income: null, fixed: 34018, rate: 0 },
      ],
      '2Children': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.29 },
        { min_income: 44763, max_income: 89523, fixed: 12981, rate: 0.28 },
        { min_income: 89524, max_income: 134285, fixed: 25514, rate: 0.25 },
        { min_income: 134286, max_income: 179046, fixed: 36705, rate: 0.2 },
        { min_income: 179047, max_income: 223808, fixed: 45657, rate: 0.13 },
        { min_income: 223809, max_income: null, fixed: 51476, rate: 0 },
      ],
      '3PlusChildren': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.32 },
        { min_income: 44763, max_income: 89523, fixed: 14324, rate: 0.31 },
        { min_income: 89524, max_income: 134285, fixed: 28200, rate: 0.3 },
        { min_income: 134286, max_income: 179046, fixed: 41629, rate: 0.29 },
        { min_income: 179047, max_income: 223808, fixed: 54610, rate: 0.2 },
        { min_income: 223809, max_income: null, fixed: 63562, rate: 0 },
      ],
    },
    mixedAges: {
      '1Child': [], // Not applicable - mixed ages requires at least 2 children
      '2Children': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.265 },
        { min_income: 44763, max_income: 89523, fixed: 11862, rate: 0.255 },
        { min_income: 89524, max_income: 134285, fixed: 23276, rate: 0.225 },
        { min_income: 134286, max_income: 179046, fixed: 33347, rate: 0.19 },
        { min_income: 179047, max_income: 223808, fixed: 41852, rate: 0.115 },
        { min_income: 223809, max_income: null, fixed: 47000, rate: 0 },
      ],
      '3PlusChildren': [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.295 },
        { min_income: 44763, max_income: 89523, fixed: 13205, rate: 0.285 },
        { min_income: 89524, max_income: 134285, fixed: 25962, rate: 0.275 },
        { min_income: 134286, max_income: 179046, fixed: 38272, rate: 0.265 },
        { min_income: 179047, max_income: 223808, fixed: 50134, rate: 0.19 },
        { min_income: 223809, max_income: null, fixed: 58639, rate: 0 },
      ],
    },
  },
};
