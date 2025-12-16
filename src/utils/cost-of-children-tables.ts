// Cost of Children tables - massive data structure by year
// Structure: year -> ageGroup -> childCount -> brackets[]

export interface CostBracket {
  min_income: number;
  max_income: number | null;
  fixed: number;
  rate: number;
}

export type ChildCountKey = "1Child" | "2Children" | "3PlusChildren";
export type AgeGroupKey = "all0_12" | "all13Plus" | "mixedAges";

export type CostTablesByYear = Record<string, Record<AgeGroupKey, Record<ChildCountKey, CostBracket[]>>>;

export const costOfChildrenByYear: CostTablesByYear = {
  "2020": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.17 },
        { min_income: 38364, max_income: 76726, fixed: 6522, rate: 0.15 },
        { min_income: 76727, max_income: 115089, fixed: 12276, rate: 0.12 },
        { min_income: 115090, max_income: 153452, fixed: 16880, rate: 0.10 },
        { min_income: 153453, max_income: 191815, fixed: 20716, rate: 0.07 },
        { min_income: 191816, max_income: null, fixed: 23401, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.24 },
        { min_income: 38364, max_income: 76726, fixed: 9207, rate: 0.23 },
        { min_income: 76727, max_income: 115089, fixed: 18030, rate: 0.20 },
        { min_income: 115090, max_income: 153452, fixed: 25703, rate: 0.18 },
        { min_income: 153453, max_income: 191815, fixed: 32608, rate: 0.10 },
        { min_income: 191816, max_income: null, fixed: 36444, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.27 },
        { min_income: 38364, max_income: 76726, fixed: 10358, rate: 0.26 },
        { min_income: 76727, max_income: 115089, fixed: 20332, rate: 0.25 },
        { min_income: 115090, max_income: 153452, fixed: 29923, rate: 0.24 },
        { min_income: 153453, max_income: 191815, fixed: 39130, rate: 0.18 },
        { min_income: 191816, max_income: null, fixed: 46035, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.23 },
        { min_income: 38364, max_income: 76726, fixed: 8823, rate: 0.22 },
        { min_income: 76727, max_income: 115089, fixed: 17263, rate: 0.12 },
        { min_income: 115090, max_income: 153452, fixed: 21867, rate: 0.10 },
        { min_income: 153453, max_income: 191815, fixed: 25703, rate: 0.09 },
        { min_income: 191816, max_income: null, fixed: 29156, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.29 },
        { min_income: 38364, max_income: 76726, fixed: 11125, rate: 0.28 },
        { min_income: 76727, max_income: 115089, fixed: 21867, rate: 0.25 },
        { min_income: 115090, max_income: 153452, fixed: 31458, rate: 0.20 },
        { min_income: 153453, max_income: 191815, fixed: 39131, rate: 0.13 },
        { min_income: 191816, max_income: null, fixed: 44118, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.32 },
        { min_income: 38364, max_income: 76726, fixed: 12276, rate: 0.31 },
        { min_income: 76727, max_income: 115089, fixed: 24169, rate: 0.30 },
        { min_income: 115090, max_income: 153452, fixed: 35678, rate: 0.29 },
        { min_income: 153453, max_income: 191815, fixed: 46803, rate: 0.20 },
        { min_income: 191816, max_income: null, fixed: 54476, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.265 },
        { min_income: 38364, max_income: 76726, fixed: 10166, rate: 0.255 },
        { min_income: 76727, max_income: 115089, fixed: 19949, rate: 0.225 },
        { min_income: 115090, max_income: 153452, fixed: 28570, rate: 0.19 },
        { min_income: 153453, max_income: 191815, fixed: 35870, rate: 0.115 },
        { min_income: 191816, max_income: null, fixed: 40282, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 38363, fixed: 0, rate: 0.295 },
        { min_income: 38364, max_income: 76726, fixed: 11317, rate: 0.285 },
        { min_income: 76727, max_income: 115089, fixed: 22250, rate: 0.275 },
        { min_income: 115090, max_income: 153452, fixed: 32800, rate: 0.265 },
        { min_income: 153453, max_income: 191815, fixed: 42966, rate: 0.19 },
        { min_income: 191816, max_income: null, fixed: 50255, rate: 0 }
      ]
    }
  },
  "2021": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.17 },
        { min_income: 39480, max_income: 78957, fixed: 6711, rate: 0.15 },
        { min_income: 78958, max_income: 118436, fixed: 12633, rate: 0.12 },
        { min_income: 118437, max_income: 157914, fixed: 17370, rate: 0.10 },
        { min_income: 157915, max_income: 197393, fixed: 21318, rate: 0.07 },
        { min_income: 197394, max_income: null, fixed: 24082, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.24 },
        { min_income: 39480, max_income: 78957, fixed: 9475, rate: 0.23 },
        { min_income: 78958, max_income: 118436, fixed: 18555, rate: 0.20 },
        { min_income: 118437, max_income: 157914, fixed: 26451, rate: 0.18 },
        { min_income: 157915, max_income: 197393, fixed: 33557, rate: 0.10 },
        { min_income: 197394, max_income: null, fixed: 37505, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.27 },
        { min_income: 39480, max_income: 78957, fixed: 10659, rate: 0.26 },
        { min_income: 78958, max_income: 118436, fixed: 20923, rate: 0.25 },
        { min_income: 118437, max_income: 157914, fixed: 30793, rate: 0.24 },
        { min_income: 157915, max_income: 197393, fixed: 40268, rate: 0.18 },
        { min_income: 197394, max_income: null, fixed: 47374, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.23 },
        { min_income: 39480, max_income: 78957, fixed: 9080, rate: 0.22 },
        { min_income: 78958, max_income: 118436, fixed: 17765, rate: 0.12 },
        { min_income: 118437, max_income: 157914, fixed: 22502, rate: 0.10 },
        { min_income: 157915, max_income: 197393, fixed: 26450, rate: 0.09 },
        { min_income: 197394, max_income: null, fixed: 30003, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.29 },
        { min_income: 39480, max_income: 78957, fixed: 11449, rate: 0.28 },
        { min_income: 78958, max_income: 118436, fixed: 22503, rate: 0.25 },
        { min_income: 118437, max_income: 157914, fixed: 32373, rate: 0.20 },
        { min_income: 157915, max_income: 197393, fixed: 40269, rate: 0.13 },
        { min_income: 197394, max_income: null, fixed: 45401, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.32 },
        { min_income: 39480, max_income: 78957, fixed: 12633, rate: 0.31 },
        { min_income: 78958, max_income: 118436, fixed: 24871, rate: 0.30 },
        { min_income: 118437, max_income: 157914, fixed: 36715, rate: 0.29 },
        { min_income: 157915, max_income: 197393, fixed: 48164, rate: 0.20 },
        { min_income: 197394, max_income: null, fixed: 56060, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.265 },
        { min_income: 39480, max_income: 78957, fixed: 10462, rate: 0.255 },
        { min_income: 78958, max_income: 118436, fixed: 20529, rate: 0.225 },
        { min_income: 118437, max_income: 157914, fixed: 29412, rate: 0.19 },
        { min_income: 157915, max_income: 197393, fixed: 36913, rate: 0.115 },
        { min_income: 197394, max_income: null, fixed: 41453, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 39479, fixed: 0, rate: 0.295 },
        { min_income: 39480, max_income: 78957, fixed: 11646, rate: 0.285 },
        { min_income: 78958, max_income: 118436, fixed: 22897, rate: 0.275 },
        { min_income: 118437, max_income: 157914, fixed: 33754, rate: 0.265 },
        { min_income: 157915, max_income: 197393, fixed: 44216, rate: 0.19 },
        { min_income: 197394, max_income: null, fixed: 51717, rate: 0 }
      ]
    }
  },
  "2022": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.17 },
        { min_income: 40595, max_income: 81188, fixed: 6901, rate: 0.15 },
        { min_income: 81189, max_income: 121782, fixed: 12990, rate: 0.12 },
        { min_income: 121783, max_income: 162376, fixed: 17861, rate: 0.10 },
        { min_income: 162377, max_income: 202970, fixed: 21920, rate: 0.07 },
        { min_income: 202971, max_income: null, fixed: 24762, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.24 },
        { min_income: 40595, max_income: 81188, fixed: 9743, rate: 0.23 },
        { min_income: 81189, max_income: 121782, fixed: 19080, rate: 0.20 },
        { min_income: 121783, max_income: 162376, fixed: 27199, rate: 0.18 },
        { min_income: 162377, max_income: 202970, fixed: 34506, rate: 0.10 },
        { min_income: 202971, max_income: null, fixed: 38565, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.27 },
        { min_income: 40595, max_income: 81188, fixed: 10960, rate: 0.26 },
        { min_income: 81189, max_income: 121782, fixed: 21514, rate: 0.25 },
        { min_income: 121783, max_income: 162376, fixed: 31663, rate: 0.24 },
        { min_income: 162377, max_income: 202970, fixed: 41406, rate: 0.18 },
        { min_income: 202971, max_income: null, fixed: 48713, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.23 },
        { min_income: 40595, max_income: 81188, fixed: 9337, rate: 0.22 },
        { min_income: 81189, max_income: 121782, fixed: 18268, rate: 0.12 },
        { min_income: 121783, max_income: 162376, fixed: 23139, rate: 0.10 },
        { min_income: 162377, max_income: 202970, fixed: 27198, rate: 0.09 },
        { min_income: 202971, max_income: null, fixed: 30851, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.29 },
        { min_income: 40595, max_income: 81188, fixed: 12382, rate: 0.28 },
        { min_income: 81189, max_income: 121782, fixed: 24336, rate: 0.25 },
        { min_income: 121783, max_income: 162376, fixed: 35010, rate: 0.20 },
        { min_income: 162377, max_income: 202970, fixed: 43549, rate: 0.13 },
        { min_income: 202971, max_income: null, fixed: 49099, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.32 },
        { min_income: 40595, max_income: 81188, fixed: 13662, rate: 0.31 },
        { min_income: 81189, max_income: 121782, fixed: 26897, rate: 0.30 },
        { min_income: 121783, max_income: 162376, fixed: 39706, rate: 0.29 },
        { min_income: 162377, max_income: 202970, fixed: 52087, rate: 0.20 },
        { min_income: 202971, max_income: null, fixed: 60626, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.265 },
        { min_income: 40595, max_income: 81188, fixed: 11314, rate: 0.255 },
        { min_income: 81189, max_income: 121782, fixed: 22201, rate: 0.225 },
        { min_income: 121783, max_income: 162376, fixed: 31807, rate: 0.19 },
        { min_income: 162377, max_income: 202970, fixed: 39919, rate: 0.115 },
        { min_income: 202971, max_income: null, fixed: 44829, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 40594, fixed: 0, rate: 0.295 },
        { min_income: 40595, max_income: 81188, fixed: 12595, rate: 0.285 },
        { min_income: 81189, max_income: 121782, fixed: 24763, rate: 0.275 },
        { min_income: 121783, max_income: 162376, fixed: 36504, rate: 0.265 },
        { min_income: 162377, max_income: 202970, fixed: 47818, rate: 0.19 },
        { min_income: 202971, max_income: null, fixed: 55930, rate: 0 }
      ]
    }
  },
  "2023": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.17 },
        { min_income: 41263, max_income: 82524, fixed: 7015, rate: 0.15 },
        { min_income: 82525, max_income: 123786, fixed: 13204, rate: 0.12 },
        { min_income: 123787, max_income: 165048, fixed: 18155, rate: 0.10 },
        { min_income: 165049, max_income: 206310, fixed: 22281, rate: 0.07 },
        { min_income: 206311, max_income: null, fixed: 25169, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.24 },
        { min_income: 41263, max_income: 82524, fixed: 9903, rate: 0.23 },
        { min_income: 82525, max_income: 123786, fixed: 19393, rate: 0.20 },
        { min_income: 123787, max_income: 165048, fixed: 27645, rate: 0.18 },
        { min_income: 165049, max_income: 206310, fixed: 35072, rate: 0.10 },
        { min_income: 206311, max_income: null, fixed: 39198, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.27 },
        { min_income: 41263, max_income: 82524, fixed: 11141, rate: 0.26 },
        { min_income: 82525, max_income: 123786, fixed: 21869, rate: 0.25 },
        { min_income: 123787, max_income: 165048, fixed: 32185, rate: 0.24 },
        { min_income: 165049, max_income: 206310, fixed: 42088, rate: 0.18 },
        { min_income: 206311, max_income: null, fixed: 49515, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.23 },
        { min_income: 41263, max_income: 82524, fixed: 9490, rate: 0.22 },
        { min_income: 82525, max_income: 123786, fixed: 18568, rate: 0.12 },
        { min_income: 123787, max_income: 165048, fixed: 23519, rate: 0.10 },
        { min_income: 165049, max_income: 206310, fixed: 27645, rate: 0.09 },
        { min_income: 206311, max_income: null, fixed: 31359, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.29 },
        { min_income: 41263, max_income: 82524, fixed: 11966, rate: 0.28 },
        { min_income: 82525, max_income: 123786, fixed: 23519, rate: 0.25 },
        { min_income: 123787, max_income: 165048, fixed: 33835, rate: 0.20 },
        { min_income: 165049, max_income: 206310, fixed: 42087, rate: 0.13 },
        { min_income: 206311, max_income: null, fixed: 47451, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.32 },
        { min_income: 41263, max_income: 82524, fixed: 13204, rate: 0.31 },
        { min_income: 82525, max_income: 123786, fixed: 25995, rate: 0.30 },
        { min_income: 123787, max_income: 165048, fixed: 38374, rate: 0.29 },
        { min_income: 165049, max_income: 206310, fixed: 50340, rate: 0.20 },
        { min_income: 206311, max_income: null, fixed: 58592, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.265 },
        { min_income: 41263, max_income: 82524, fixed: 10934, rate: 0.255 },
        { min_income: 82525, max_income: 123786, fixed: 21456, rate: 0.225 },
        { min_income: 123787, max_income: 165048, fixed: 30740, rate: 0.19 },
        { min_income: 165049, max_income: 206310, fixed: 38580, rate: 0.115 },
        { min_income: 206311, max_income: null, fixed: 43325, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 41262, fixed: 0, rate: 0.295 },
        { min_income: 41263, max_income: 82524, fixed: 12172, rate: 0.285 },
        { min_income: 82525, max_income: 123786, fixed: 23932, rate: 0.275 },
        { min_income: 123787, max_income: 165048, fixed: 35279, rate: 0.265 },
        { min_income: 165049, max_income: 206310, fixed: 46213, rate: 0.19 },
        { min_income: 206311, max_income: null, fixed: 54053, rate: 0 }
      ]
    }
  },
  "2024": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.17 },
        { min_income: 42696, max_income: 85389, fixed: 7258, rate: 0.15 },
        { min_income: 85390, max_income: 128084, fixed: 13662, rate: 0.12 },
        { min_income: 128085, max_income: 170778, fixed: 18785, rate: 0.10 },
        { min_income: 170779, max_income: 213473, fixed: 23054, rate: 0.07 },
        { min_income: 213474, max_income: null, fixed: 26043, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.24 },
        { min_income: 42696, max_income: 85389, fixed: 10247, rate: 0.23 },
        { min_income: 85390, max_income: 128084, fixed: 20067, rate: 0.20 },
        { min_income: 128085, max_income: 170778, fixed: 28606, rate: 0.18 },
        { min_income: 170779, max_income: 213473, fixed: 36291, rate: 0.10 },
        { min_income: 213474, max_income: null, fixed: 40561, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.27 },
        { min_income: 42696, max_income: 85389, fixed: 11528, rate: 0.26 },
        { min_income: 85390, max_income: 128084, fixed: 22628, rate: 0.25 },
        { min_income: 128085, max_income: 170778, fixed: 33302, rate: 0.24 },
        { min_income: 170779, max_income: 213473, fixed: 43549, rate: 0.18 },
        { min_income: 213474, max_income: null, fixed: 51234, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.23 },
        { min_income: 42696, max_income: 85389, fixed: 9820, rate: 0.22 },
        { min_income: 85390, max_income: 128084, fixed: 19213, rate: 0.12 },
        { min_income: 128085, max_income: 170778, fixed: 24336, rate: 0.10 },
        { min_income: 170779, max_income: 213473, fixed: 28605, rate: 0.09 },
        { min_income: 213474, max_income: null, fixed: 32448, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.29 },
        { min_income: 42696, max_income: 85389, fixed: 12382, rate: 0.28 },
        { min_income: 85390, max_income: 128084, fixed: 24336, rate: 0.25 },
        { min_income: 128085, max_income: 170778, fixed: 35010, rate: 0.20 },
        { min_income: 170779, max_income: 213473, fixed: 43549, rate: 0.13 },
        { min_income: 213474, max_income: null, fixed: 49099, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.32 },
        { min_income: 42696, max_income: 85389, fixed: 13662, rate: 0.31 },
        { min_income: 85390, max_income: 128084, fixed: 26897, rate: 0.30 },
        { min_income: 128085, max_income: 170778, fixed: 39706, rate: 0.29 },
        { min_income: 170779, max_income: 213473, fixed: 52087, rate: 0.20 },
        { min_income: 213474, max_income: null, fixed: 60626, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.265 },
        { min_income: 42696, max_income: 85389, fixed: 11314, rate: 0.255 },
        { min_income: 85390, max_income: 128084, fixed: 22201, rate: 0.225 },
        { min_income: 128085, max_income: 170778, fixed: 31807, rate: 0.19 },
        { min_income: 170779, max_income: 213473, fixed: 39919, rate: 0.115 },
        { min_income: 213474, max_income: null, fixed: 44829, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 42695, fixed: 0, rate: 0.295 },
        { min_income: 42696, max_income: 85389, fixed: 12595, rate: 0.285 },
        { min_income: 85390, max_income: 128084, fixed: 24763, rate: 0.275 },
        { min_income: 128085, max_income: 170778, fixed: 36504, rate: 0.265 },
        { min_income: 170779, max_income: 213473, fixed: 47818, rate: 0.19 },
        { min_income: 213474, max_income: null, fixed: 55930, rate: 0 }
      ]
    }
  },
  "2025": {
    "all0_12": {
      "1Child": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.17 },
        { min_income: 44763, max_income: 89523, fixed: 7610, rate: 0.15 },
        { min_income: 89524, max_income: 134285, fixed: 14324, rate: 0.12 },
        { min_income: 134286, max_income: 179046, fixed: 19695, rate: 0.10 },
        { min_income: 179047, max_income: 223808, fixed: 24171, rate: 0.07 },
        { min_income: 223809, max_income: null, fixed: 27304, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.24 },
        { min_income: 44763, max_income: 89523, fixed: 10743, rate: 0.23 },
        { min_income: 89524, max_income: 134285, fixed: 21038, rate: 0.20 },
        { min_income: 134286, max_income: 179046, fixed: 29990, rate: 0.18 },
        { min_income: 179047, max_income: 223808, fixed: 38047, rate: 0.10 },
        { min_income: 223809, max_income: null, fixed: 42523, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.27 },
        { min_income: 44763, max_income: 89523, fixed: 12086, rate: 0.26 },
        { min_income: 89524, max_income: 134285, fixed: 23724, rate: 0.25 },
        { min_income: 134286, max_income: 179046, fixed: 34915, rate: 0.24 },
        { min_income: 179047, max_income: 223808, fixed: 45658, rate: 0.18 },
        { min_income: 223809, max_income: null, fixed: 53715, rate: 0 }
      ]
    },
    "all13Plus": {
      "1Child": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.23 },
        { min_income: 44763, max_income: 89523, fixed: 10295, rate: 0.22 },
        { min_income: 89524, max_income: 134285, fixed: 20142, rate: 0.12 },
        { min_income: 134286, max_income: 179046, fixed: 25513, rate: 0.10 },
        { min_income: 179047, max_income: 223808, fixed: 29989, rate: 0.09 },
        { min_income: 223809, max_income: null, fixed: 34018, rate: 0 }
      ],
      "2Children": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.29 },
        { min_income: 44763, max_income: 89523, fixed: 12981, rate: 0.28 },
        { min_income: 89524, max_income: 134285, fixed: 25514, rate: 0.25 },
        { min_income: 134286, max_income: 179046, fixed: 36705, rate: 0.20 },
        { min_income: 179047, max_income: 223808, fixed: 45657, rate: 0.13 },
        { min_income: 223809, max_income: null, fixed: 51476, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.32 },
        { min_income: 44763, max_income: 89523, fixed: 14324, rate: 0.31 },
        { min_income: 89524, max_income: 134285, fixed: 28200, rate: 0.30 },
        { min_income: 134286, max_income: 179046, fixed: 41629, rate: 0.29 },
        { min_income: 179047, max_income: 223808, fixed: 54610, rate: 0.20 },
        { min_income: 223809, max_income: null, fixed: 63562, rate: 0 }
      ]
    },
    "mixedAges": {
      "1Child": [], // Not applicable - mixed ages requires at least 2 children
      "2Children": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.265 },
        { min_income: 44763, max_income: 89523, fixed: 11862, rate: 0.255 },
        { min_income: 89524, max_income: 134285, fixed: 23276, rate: 0.225 },
        { min_income: 134286, max_income: 179046, fixed: 33347, rate: 0.19 },
        { min_income: 179047, max_income: 223808, fixed: 41852, rate: 0.115 },
        { min_income: 223809, max_income: null, fixed: 47000, rate: 0 }
      ],
      "3PlusChildren": [
        { min_income: 0, max_income: 44762, fixed: 0, rate: 0.295 },
        { min_income: 44763, max_income: 89523, fixed: 13205, rate: 0.285 },
        { min_income: 89524, max_income: 134285, fixed: 25962, rate: 0.275 },
        { min_income: 134286, max_income: 179046, fixed: 38272, rate: 0.265 },
        { min_income: 179047, max_income: 223808, fixed: 50134, rate: 0.19 },
        { min_income: 223809, max_income: null, fixed: 58639, rate: 0 }
      ]
    }
  }
};







