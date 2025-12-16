import type { AssessmentYear } from '../utils/child-support-constants';

export interface ChildInput {
  id: string;
  age: 'Under 13' | '13+';
  careAmountA: number;
  careAmountB: number;
  carePeriod: 'week' | 'fortnight' | 'year';
}

export interface RelevantDependents {
  u13: number;
  plus13: number;
}

export interface CalculatorInputs {
  year: AssessmentYear;
  ATI_A: number;
  ATI_B: number;
  supportA: boolean;
  supportB: boolean;
  children: Array<{
    age: 'Under 13' | '13+';
    careA: number;
    careB: number;
  }>;
  relDepA: RelevantDependents;
  relDepB: RelevantDependents;
}

export interface ChildResult {
  age: 'Under 13' | '13+';
  careA: number;
  careB: number;
  costPerChild: number;
  roundedCareA: number;
  roundedCareB: number;
  costPercA: number;
  costPercB: number;
  childSupportPercA: number;
  childSupportPercB: number;
  liabilityA: number;
  liabilityB: number;
}

export interface CalculationResults {
  year: AssessmentYear;
  ATI_A: number;
  ATI_B: number;
  relDepDeductibleA: number;
  relDepDeductibleB: number;
  SSA: number;
  FAR: number;
  MAR: number;
  MAX_PPS: number;
  CSI_A: number;
  CSI_B: number;
  CCSI: number;
  incomePercA: number;
  incomePercB: number;
  totalCost: number;
  childResults: ChildResult[];
  totalLiabilityA: number;
  totalLiabilityB: number;
  finalLiabilityA: number;
  finalLiabilityB: number;
  FAR_A: number;
  FAR_B: number;
  MAR_A: number;
  MAR_B: number;
  rateApplied: string;
  payer: string;
  receiver: string;
  finalPaymentAmount: number;
}

export interface FormErrors {
  incomeA?: string;
  incomeB?: string;
  children?: string;
  [childId: string]: string | undefined;
}







