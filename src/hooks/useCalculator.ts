import { useCallback, useState } from 'react';
import type {
  CalculationResults,
  CalculatorInputs,
  ChildInput,
  FormErrors,
  MultiCaseInfo,
  NonParentCarerInfo,
  OtherCaseChild,
  PayerRole,
  RelevantDependents,
} from '../utils/calculator';
import {
  applyMultiCaseCap,
  calculateMultiCaseAllowance,
  calculateMultiCaseCap,
  convertCareToPercentage,
  getChildCost,
  mapCareToCostPercent,
  roundCarePercentage,
} from '../utils/child-support-calculations';
import {
  AssessmentYear,
  getYearConstants,
} from '../utils/child-support-constants';
import {
  applyFARMultiChildCap,
  applyMARMultiCaseCap,
  checkMARCareNegation
} from '../utils/multi-case-rates';

export interface CalculatorFormState {
  incomeA: number;
  incomeB: number;
  supportA: boolean;
  supportB: boolean;
  children: ChildInput[];
  relDepA: RelevantDependents;
  relDepB: RelevantDependents;
  // Multi-case support (Formula 3)
  multiCaseA: MultiCaseInfo;
  multiCaseB: MultiCaseInfo;
  // Non-parent carer support (Formula 4)
  nonParentCarer: NonParentCarerInfo;
}

// Start with no children - user must click "Add Child" to begin
const getInitialChildren = (): ChildInput[] => {
  return [];
};

const initialFormState: CalculatorFormState = {
  incomeA: 0,
  incomeB: 0,
  supportA: false,
  supportB: false,
  children: getInitialChildren(),
  relDepA: { u13: 0, plus13: 0 },
  relDepB: { u13: 0, plus13: 0 },
  // Multi-case support (Formula 3)
  multiCaseA: { otherChildren: [] },
  multiCaseB: { otherChildren: [] },
  // Non-parent carer support (Formula 4)
  nonParentCarer: { enabled: false, carePercentage: 0 },
};

export function useCalculator() {
  const [formState, setFormState] =
    useState<CalculatorFormState>(initialFormState);
  const [selectedYear, setSelectedYear] = useState<AssessmentYear>('2026');
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [resetTimestamp, setResetTimestamp] = useState<number>(0);

  const addChild = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          id: `child-${Date.now()}-${Math.random()}`,
          age: 'Under 13',
          careAmountA: 8,
          careAmountB: 6,
          carePeriod: 'fortnight',
        },
      ],
    }));
    setErrors({});
    setIsStale(true);
  }, []);

  const removeChild = useCallback((childId: string) => {
    setFormState((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== childId),
    }));
    setErrors({});
    setIsStale(true);
  }, []);

  const updateChild = useCallback(
    (childId: string, updates: Partial<ChildInput>) => {
      setFormState((prev) => ({
        ...prev,
        children: prev.children.map((c) =>
          c.id === childId ? { ...c, ...updates } : c
        ),
      }));
      setIsStale(true);
    },
    []
  );

  // Multi-case support callbacks (Formula 3)
  const updateMultiCaseA = useCallback((otherChildren: OtherCaseChild[]) => {
    setFormState((prev) => ({
      ...prev,
      multiCaseA: { otherChildren },
    }));
    setIsStale(true);
  }, []);

  const updateMultiCaseB = useCallback((otherChildren: OtherCaseChild[]) => {
    setFormState((prev) => ({
      ...prev,
      multiCaseB: { otherChildren },
    }));
    setIsStale(true);
  }, []);

  // Non-parent carer support callbacks (Formula 4)
  const updateNonParentCarer = useCallback((info: NonParentCarerInfo) => {
    setFormState((prev) => ({
      ...prev,
      nonParentCarer: info,
    }));
    setIsStale(true);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate incomes
    if (formState.incomeA < 0) {
      newErrors.incomeA = 'Income must be $0 or more.';
    }
    if (formState.incomeB < 0) {
      newErrors.incomeB = 'Income must be $0 or more.';
    }

    // Children validation removed - allow $0 results with no children

    // Validate each child
    formState.children.forEach((child) => {
      const maxValue =
        child.carePeriod === 'week'
          ? 7
          : child.carePeriod === 'fortnight'
            ? 14
            : child.carePeriod === 'year'
              ? 365
              : 100; // percent

      const isPercent = child.carePeriod === 'percent';
      const unitLabel = isPercent ? 'percentage' : 'nights';
      const unitSymbol = isPercent ? '%' : '';

      if (child.careAmountA < 0) {
        newErrors[child.id] = `Parent A ${unitLabel} must be 0 or more.`;
      } else if (child.careAmountA > maxValue) {
        newErrors[child.id] =
          `Parent A ${unitLabel} cannot exceed ${maxValue}${unitSymbol} for ${child.carePeriod}.`;
      }
      if (child.careAmountB < 0) {
        newErrors[child.id] = `Parent B ${unitLabel} must be 0 or more.`;
      } else if (child.careAmountB > maxValue) {
        newErrors[child.id] =
          `Parent B ${unitLabel} cannot exceed ${maxValue}${unitSymbol} for ${child.carePeriod}.`;
      }
      // Validate sum
      const total = child.careAmountA + child.careAmountB;
      if (total > maxValue) {
        newErrors[child.id] =
          `Total ${unitLabel} cannot exceed ${maxValue}${unitSymbol} per ${child.carePeriod}. Currently: ${total}${unitSymbol}`;
      }
    });

    // Validate dependents
    if (formState.relDepA.u13 < 0 || formState.relDepA.plus13 < 0) {
      newErrors.relDepA = 'Dependent count cannot be negative.';
    }
    if (formState.relDepB.u13 < 0 || formState.relDepB.plus13 < 0) {
      newErrors.relDepB = 'Dependent count cannot be negative.';
    }

    // Validate multi-case (Formula 3)
    if (formState.multiCaseA.otherChildren.length > 10) {
      newErrors.multiCaseA = 'Maximum 10 children in other cases.';
    }
    if (formState.multiCaseB.otherChildren.length > 10) {
      newErrors.multiCaseB = 'Maximum 10 children in other cases.';
    }

    // Validate non-parent carer (Formula 4)
    if (formState.nonParentCarer.enabled) {
      if (formState.nonParentCarer.carePercentage < 35) {
        newErrors.nonParentCarer =
          'Non-parent carer must have at least 35% care.';
      }
      if (formState.nonParentCarer.carePercentage > 100) {
        newErrors.nonParentCarer = 'Care percentage cannot exceed 100%.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  const performCalculation = useCallback(
    (overrides?: { supportA?: boolean; supportB?: boolean }): CalculationResults | null => {
      if (!validateForm()) {
        return null;
      }

      // Get year-specific constants
      const { SSA, FAR, MAR, MAX_PPS } = getYearConstants(selectedYear);

      const { incomeA, incomeB, relDepA, relDepB } = formState;
      // Use overrides if provided, otherwise fall back to formState
      const supportA = overrides?.supportA ?? formState.supportA;
      const supportB = overrides?.supportB ?? formState.supportB;
      const ATI_A = incomeA;
      const ATI_B = incomeB;

      // Convert children to calculation format
      const children = formState.children.map((c) => ({
        age: c.age as 'Under 13' | '13+',
        careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
        careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
      }));

      // Step 1: Create virtual children for relevant dependents
      // Virtual children have 0% care since they're only used for cost calculation
      const relDepChildrenA: {
        age: 'Under 13' | '13+';
        careA: number;
        careB: number;
      }[] = [
          ...Array(relDepA.u13).fill({
            age: 'Under 13' as const,
            careA: 0,
            careB: 0,
          }),
          ...Array(relDepA.plus13).fill({
            age: '13+' as const,
            careA: 0,
            careB: 0,
          }),
        ];
      const relDepChildrenB: {
        age: 'Under 13' | '13+';
        careA: number;
        careB: number;
      }[] = [
          ...Array(relDepB.u13).fill({
            age: 'Under 13' as const,
            careA: 0,
            careB: 0,
          }),
          ...Array(relDepB.plus13).fill({
            age: '13+' as const,
            careA: 0,
            careB: 0,
          }),
        ];

      // Step 2-4: Calculate Child Support Income (CSI)
      const relDepDeductibleA = getChildCost(
        selectedYear,
        relDepChildrenA,
        Math.max(0, ATI_A - SSA)
      ).cost;
      const relDepDeductibleB = getChildCost(
        selectedYear,
        relDepChildrenB,
        Math.max(0, ATI_B - SSA)
      ).cost;

      // Step 2a: Calculate Multi-case Allowance (Formula 3)
      // For parents with children in other child support cases
      const rawCSI_A = Math.max(0, ATI_A - SSA);
      const rawCSI_B = Math.max(0, ATI_B - SSA);

      const multiCaseAllowanceA = calculateMultiCaseAllowance(
        selectedYear,
        rawCSI_A,
        children,
        formState.multiCaseA.otherChildren
      );
      const multiCaseAllowanceB = calculateMultiCaseAllowance(
        selectedYear,
        rawCSI_B,
        children,
        formState.multiCaseB.otherChildren
      );

      // CSI = ATI - Relevant Dependents - SSA - Multi-case Allowance
      const CSI_A = Math.max(
        0,
        ATI_A - relDepDeductibleA - SSA - multiCaseAllowanceA
      );
      const CSI_B = Math.max(
        0,
        ATI_B - relDepDeductibleB - SSA - multiCaseAllowanceB
      );

      const CCSI = CSI_A + CSI_B; // Combined CSI (NPC income not included)

      // Income Percentages
      const incomePercA = CCSI > 0 ? (CSI_A / CCSI) * 100 : 0;
      const incomePercB = CCSI > 0 ? (CSI_B / CCSI) * 100 : 0;

      // Step 5: Calculate Total Cost of Children
      const { cost: totalCost, bracketInfo: costBracketInfo } = getChildCost(
        selectedYear,
        children,
        CCSI
      );
      const costPerChild = children.length > 0 ? totalCost / children.length : 0;

      // Step 6–8: Calculate individual liabilities
      let totalLiabilityA = 0;
      let totalLiabilityB = 0;

      // Check if non-parent carer is enabled
      const hasNPC = formState.nonParentCarer.enabled;
      const npcCarePercent = hasNPC ? formState.nonParentCarer.carePercentage : 0;

      const childResults = children.map((c, childIndex) => {
        const roundedCareA = roundCarePercentage(c.careA);
        const roundedCareB = roundCarePercentage(c.careB);

        // Handle NPC care (Formula 4)
        // Get NPC care from the child input if available
        const childInput = formState.children[childIndex];
        const rawCareNPC = hasNPC
          ? childInput?.careAmountNPC !== undefined
            ? convertCareToPercentage(
              childInput.careAmountNPC,
              childInput.carePeriod
            )
            : npcCarePercent
          : 0;
        const roundedCareNPC = roundCarePercentage(rawCareNPC);
        const costPercNPC = mapCareToCostPercent(roundedCareNPC);

        const costPercA = mapCareToCostPercent(roundedCareA);
        const costPercB = mapCareToCostPercent(roundedCareB);

        // Child Support Percentage = Income % - Cost %
        const childSupportPercA = incomePercA - costPercA;
        const childSupportPercB = incomePercB - costPercB;

        let liabilityA = 0;
        let liabilityB = 0;

        const positivePercA = Math.max(0, childSupportPercA);
        const positivePercB = Math.max(0, childSupportPercB);

        if (positivePercA > positivePercB) {
          if (roundedCareB >= 35 || (hasNPC && roundedCareNPC >= 35)) {
            liabilityA = (positivePercA / 100) * costPerChild;
          }
        } else if (positivePercB > positivePercA) {
          if (roundedCareA >= 35 || (hasNPC && roundedCareNPC >= 35)) {
            liabilityB = (positivePercB / 100) * costPerChild;
          }
        }

        // Calculate liability to NPC (Formula 4)
        let liabilityToNPC_A = 0;
        let liabilityToNPC_B = 0;
        if (hasNPC && roundedCareNPC >= 35) {
          // Each parent's liability to NPC = their child support % × child cost
          if (childSupportPercA > 0) {
            liabilityToNPC_A =
              (childSupportPercA / 100) * costPerChild * (costPercNPC / 100);
          }
          if (childSupportPercB > 0) {
            liabilityToNPC_B =
              (childSupportPercB / 100) * costPerChild * (costPercNPC / 100);
          }
        }

        totalLiabilityA += liabilityA;
        totalLiabilityB += liabilityB;

        return {
          ...c,
          costPerChild,
          roundedCareA,
          roundedCareB,
          costPercA,
          costPercB,
          childSupportPercA,
          childSupportPercB,
          liabilityA,
          liabilityB,
          // Placeholder values - will be updated below
          finalLiabilityA: liabilityA,
          finalLiabilityB: liabilityB,
          farAppliedA: false,
          farAppliedB: false,
          marAppliedA: false,
          marAppliedB: false,
          // Multi-case cap fields (will be updated below)
          multiCaseCapA: undefined as number | undefined,
          multiCaseCapB: undefined as number | undefined,
          multiCaseCapAppliedA: false,
          multiCaseCapAppliedB: false,
          // NPC fields (Formula 4)
          careNPC: rawCareNPC,
          roundedCareNPC,
          costPercNPC,
          liabilityToNPC_A,
          liabilityToNPC_B,
        };
      });

      // Step 9–10: Apply Fixed Annual Rate (FAR) or Minimum Annual Rate (MAR)
      let FAR_A = 0,
        FAR_B = 0,
        MAR_A = 0,
        MAR_B = 0;
      let finalLiabilityA = 0;
      let finalLiabilityB = 0;
      let rateApplied = 'None';
      const appliedRates: string[] = [];

      // Check if MAR applies at case level (once per case, not per child)
      // MAR criteria:
      // 1. Parent received income support payment
      // 2. Parent has less than 14% care of ALL children
      // 3. Parent's ATI is below the self-support amount
      const marAppliesA =
        ATI_A < SSA && supportA && childResults.every((c) => c.roundedCareA < 14);
      const marAppliesB =
        ATI_B < SSA && supportB && childResults.every((c) => c.roundedCareB < 14);

      if (marAppliesA) {
        MAR_A = MAR; // Set once for the entire case
        appliedRates.push('MAR (Parent A)');
      }
      if (marAppliesB) {
        MAR_B = MAR; // Set once for the entire case
        appliedRates.push('MAR (Parent B)');
      }

      childResults.forEach((child, index) => {
        const roundedCareA = child.roundedCareA;
        const roundedCareB = child.roundedCareB;

        let liabilityA = child.liabilityA;
        let appliedRateA: string | null = null;
        let farAppliedA = false;
        let marAppliedA = false;

        // Check if MAR applies for this parent (already determined at case level)
        if (marAppliesA) {
          // MAR is paid once per case, so divide by total children to show per-child breakdown
          liabilityA = MAR / childResults.length;
          marAppliedA = true;
        } else if (ATI_A < MAX_PPS && !supportA && roundedCareB >= 66) {
          // FAR is paid per child (up to 3 children)
          if (FAR_A / FAR < 3) {
            FAR_A += FAR;
            liabilityA = FAR;
            appliedRateA = `FAR (Parent A, Child ${index + 1})`;
            farAppliedA = true;
          }
        }

        if (appliedRateA) {
          appliedRates.push(appliedRateA);
        }
        finalLiabilityA += liabilityA;

        let liabilityB = child.liabilityB;
        let appliedRateB: string | null = null;
        let farAppliedB = false;
        let marAppliedB = false;

        // Check if MAR applies for this parent (already determined at case level)
        if (marAppliesB) {
          // MAR is paid once per case, so divide by total children to show per-child breakdown
          liabilityB = MAR / childResults.length;
          marAppliedB = true;
        } else if (ATI_B < MAX_PPS && !supportB && roundedCareA >= 66) {
          // FAR is paid per child (up to 3 children)
          if (FAR_B / FAR < 3) {
            FAR_B += FAR;
            liabilityB = FAR;
            appliedRateB = `FAR (Parent B, Child ${index + 1})`;
            farAppliedB = true;
          }
        }

        if (appliedRateB) {
          appliedRates.push(appliedRateB);
        }
        finalLiabilityB += liabilityB;

        // Update child result with final liability and rate flags
        child.finalLiabilityA = liabilityA;
        child.finalLiabilityB = liabilityB;
        child.farAppliedA = farAppliedA;
        child.farAppliedB = farAppliedB;
        child.marAppliedA = marAppliedA;
        child.marAppliedB = marAppliedB;
      });

      // Step 10a: Apply Multi-case Cap (Formula 3)
      // The cap limits liability for parents with children in other cases
      let multiCaseCapAppliedA = false;
      let multiCaseCapAppliedB = false;

      const hasMultiCaseA = formState.multiCaseA.otherChildren.length > 0;
      const hasMultiCaseB = formState.multiCaseB.otherChildren.length > 0;

      if (hasMultiCaseA || hasMultiCaseB) {
        // Reset final liabilities to recalculate with caps
        finalLiabilityA = 0;
        finalLiabilityB = 0;

        childResults.forEach((child) => {
          let adjustedLiabilityA = child.finalLiabilityA;
          let adjustedLiabilityB = child.finalLiabilityB;

          // Apply multi-case cap for Parent A
          if (hasMultiCaseA && child.finalLiabilityA > 0) {
            const capA = calculateMultiCaseCap(child.costPerChild, child.costPercA);
            child.multiCaseCapA = capA;
            const capResult = applyMultiCaseCap(child.finalLiabilityA, capA);
            adjustedLiabilityA = capResult.liability;
            child.multiCaseCapAppliedA = capResult.capApplied;
            if (capResult.capApplied) {
              multiCaseCapAppliedA = true;
            }
          }

          // Apply multi-case cap for Parent B
          if (hasMultiCaseB && child.finalLiabilityB > 0) {
            const capB = calculateMultiCaseCap(child.costPerChild, child.costPercB);
            child.multiCaseCapB = capB;
            const capResult = applyMultiCaseCap(child.finalLiabilityB, capB);
            adjustedLiabilityB = capResult.liability;
            child.multiCaseCapAppliedB = capResult.capApplied;
            if (capResult.capApplied) {
              multiCaseCapAppliedB = true;
            }
          }

          child.finalLiabilityA = adjustedLiabilityA;
          child.finalLiabilityB = adjustedLiabilityB;
          finalLiabilityA += adjustedLiabilityA;
          finalLiabilityB += adjustedLiabilityB;
        });
      }

      // Step 10b: Apply MAR/FAR Multi-Case Caps (Formula 3 & 4)
      // These caps apply across ALL cases, not just per-case caps
      let marCapExplanationA: string | undefined;
      let marCapExplanationB: string | undefined;
      let farCapExplanationA: string | undefined;
      let farCapExplanationB: string | undefined;

      // Count total cases for each parent (1 current + other case children)
      const totalCasesA = 1 + formState.multiCaseA.otherChildren.length;
      const totalCasesB = 1 + formState.multiCaseB.otherChildren.length;

      // Apply MAR 3-case cap and care negation for Parent A
      if (MAR_A > 0 && hasMultiCaseA) {
        // Check care negation first (14% care of any child negates MAR)
        const careNegationA = checkMARCareNegation({
          carePercentages: childResults.map((c) => c.roundedCareA),
        });

        if (careNegationA.capApplied) {
          // MAR negated due to care threshold
          MAR_A = 0;
          marCapExplanationA = careNegationA.explanation;
          // Update child results to reflect negated MAR
          childResults.forEach((child) => {
            if (child.marAppliedA) {
              finalLiabilityA -= child.finalLiabilityA;
              child.finalLiabilityA = 0;
            }
          });
        } else if (totalCasesA > 3) {
          // Apply 3-case cap
          const marCapResultA = applyMARMultiCaseCap(selectedYear, totalCasesA);
          if (marCapResultA.capApplied) {
            const cappedMARPerCase = marCapResultA.cappedAmount;
            marCapExplanationA = marCapResultA.explanation;
            // Recalculate MAR liability with capped amount
            finalLiabilityA = 0;
            childResults.forEach((child) => {
              if (child.marAppliedA) {
                child.finalLiabilityA = cappedMARPerCase / childResults.length;
              }
              finalLiabilityA += child.finalLiabilityA;
            });
            MAR_A = cappedMARPerCase;
          }
        }
      }

      // Apply MAR 3-case cap and care negation for Parent B
      if (MAR_B > 0 && hasMultiCaseB) {
        const careNegationB = checkMARCareNegation({
          carePercentages: childResults.map((c) => c.roundedCareB),
        });

        if (careNegationB.capApplied) {
          MAR_B = 0;
          marCapExplanationB = careNegationB.explanation;
          childResults.forEach((child) => {
            if (child.marAppliedB) {
              finalLiabilityB -= child.finalLiabilityB;
              child.finalLiabilityB = 0;
            }
          });
        } else if (totalCasesB > 3) {
          const marCapResultB = applyMARMultiCaseCap(selectedYear, totalCasesB);
          if (marCapResultB.capApplied) {
            const cappedMARPerCase = marCapResultB.cappedAmount;
            marCapExplanationB = marCapResultB.explanation;
            finalLiabilityB = 0;
            childResults.forEach((child) => {
              if (child.marAppliedB) {
                child.finalLiabilityB = cappedMARPerCase / childResults.length;
              }
              finalLiabilityB += child.finalLiabilityB;
            });
            MAR_B = cappedMARPerCase;
          }
        }
      }

      // Apply FAR 3-child cap for Parent A
      // Count total children FAR applies to (current case + other cases)
      const farChildCountA = childResults.filter((c) => c.farAppliedA).length +
        formState.multiCaseA.otherChildren.length;

      if (FAR_A > 0 && farChildCountA > 3) {
        const farCapResultA = applyFARMultiChildCap(selectedYear, farChildCountA);
        if (farCapResultA.capApplied) {
          const cappedFARPerChild = farCapResultA.cappedAmount;
          farCapExplanationA = farCapResultA.explanation;
          // Recalculate FAR liability with capped amount
          finalLiabilityA = 0;
          childResults.forEach((child) => {
            if (child.farAppliedA) {
              child.finalLiabilityA = cappedFARPerChild;
            }
            finalLiabilityA += child.finalLiabilityA;
          });
          FAR_A = cappedFARPerChild * childResults.filter((c) => c.farAppliedA).length;
        }
      }

      // Apply FAR 3-child cap for Parent B
      const farChildCountB = childResults.filter((c) => c.farAppliedB).length +
        formState.multiCaseB.otherChildren.length;

      if (FAR_B > 0 && farChildCountB > 3) {
        const farCapResultB = applyFARMultiChildCap(selectedYear, farChildCountB);
        if (farCapResultB.capApplied) {
          const cappedFARPerChild = farCapResultB.cappedAmount;
          farCapExplanationB = farCapResultB.explanation;
          finalLiabilityB = 0;
          childResults.forEach((child) => {
            if (child.farAppliedB) {
              child.finalLiabilityB = cappedFARPerChild;
            }
            finalLiabilityB += child.finalLiabilityB;
          });
          FAR_B = cappedFARPerChild * childResults.filter((c) => c.farAppliedB).length;
        }
      }

      // Determine rate applied string
      if (appliedRates.length > 0) {
        const farA = appliedRates.filter((r) =>
          r.startsWith('FAR (Parent A')
        ).length;
        const farB = appliedRates.filter((r) =>
          r.startsWith('FAR (Parent B')
        ).length;
        const hasMarA = appliedRates.some((r) => r.startsWith('MAR (Parent A'));
        const hasMarB = appliedRates.some((r) => r.startsWith('MAR (Parent B'));

        if (farA > 0 && farB > 0) {
          rateApplied = 'FAR (Both Parents)';
        } else if (farA > 0) {
          rateApplied = `FAR (Parent A, ${farA} child${farA > 1 ? 'ren' : ''})`;
        } else if (farB > 0) {
          rateApplied = `FAR (Parent B, ${farB} child${farB > 1 ? 'ren' : ''})`;
        } else if (hasMarA && hasMarB) {
          rateApplied = 'MAR (Both Parents)';
        } else if (hasMarA) {
          rateApplied = 'MAR (Parent A)';
        } else if (hasMarB) {
          rateApplied = 'MAR (Parent B)';
        }
      }

      // Final Payment Calculation
      let finalPayment = finalLiabilityA - finalLiabilityB;
      let payer = finalPayment > 0 ? 'Parent A' : 'Parent B';
      let receiver = finalPayment > 0 ? 'Parent B' : 'Parent A';
      let finalPaymentAmount = Math.abs(finalPayment);

      if (rateApplied.startsWith('FAR') && FAR_A > 0 && FAR_B > 0) {
        finalPayment = FAR_A - FAR_B;
        payer = finalPayment > 0 ? 'Parent A' : 'Parent B';
        receiver = finalPayment > 0 ? 'Parent B' : 'Parent A';
        finalPaymentAmount = Math.abs(finalPayment);
        rateApplied = 'FAR (Both)';
      } else if (rateApplied.startsWith('MAR') && MAR_A > 0 && MAR_B > 0) {
        finalPayment = MAR_A - MAR_B;
        payer = 'N/A';
        receiver = 'N/A';
        finalPaymentAmount = 0;
        rateApplied = 'MAR (Both)';
      }

      if (finalPaymentAmount === 0) {
        payer = 'Neither';
        receiver = 'Neither';
      }

      // Calculate total payment to NPC (Formula 4)
      let paymentToNPC: number | undefined;
      if (hasNPC) {
        paymentToNPC = childResults.reduce(
          (sum, child) =>
            sum + (child.liabilityToNPC_A ?? 0) + (child.liabilityToNPC_B ?? 0),
          0
        );
      }

      // Determine payerRole
      let payerRole: PayerRole = 'neither';
      if (hasNPC && paymentToNPC && paymentToNPC > 0) {
        const anyPayingA = childResults.some(
          (c) => (c.liabilityToNPC_A ?? 0) > 0
        );
        const anyPayingB = childResults.some(
          (c) => (c.liabilityToNPC_B ?? 0) > 0
        );
        if (anyPayingA && anyPayingB) {
          payerRole = 'both_paying';
        } else if (anyPayingA) {
          payerRole = 'paying_parent';
        } else if (anyPayingB) {
          payerRole = 'receiving_parent';
        }
      } else if (finalPaymentAmount > 0) {
        payerRole = payer === 'Parent A' ? 'paying_parent' : 'receiving_parent';
      }

      return {
        ATI_A,
        ATI_B,
        relDepDeductibleA,
        relDepDeductibleB,
        SSA,
        FAR,
        MAR,
        MAX_PPS,
        CSI_A,
        CSI_B,
        CCSI,
        incomePercA,
        incomePercB,
        totalCost,
        costBracketInfo,
        childResults,
        totalLiabilityA,
        totalLiabilityB,
        finalLiabilityA,
        finalLiabilityB,
        FAR_A,
        FAR_B,
        MAR_A,
        MAR_B,
        rateApplied,
        payer,
        receiver,
        finalPaymentAmount,
        // Multi-case fields (Formula 3)
        multiCaseAllowanceA,
        multiCaseAllowanceB,
        multiCaseCapAppliedA,
        multiCaseCapAppliedB,
        // MAR/FAR cap explanations
        marCapExplanationA,
        marCapExplanationB,
        farCapExplanationA,
        farCapExplanationB,
        // NPC fields (Formula 4)
        payerRole,
        paymentToNPC,
      };
    }, [formState, selectedYear, validateForm]);

  const calculate = useCallback(
    (overrides?: { supportA?: boolean; supportB?: boolean }) => {
      // Optimize INP: Yield to main thread to allow UI feedback (button press) to render
      // before starting heavy blocking calculation.

      // Ensure "stale" state is set synchronously to trigger any necessary pending UI updates
      setIsStale(true);

      setTimeout(() => {
        const calculationResults = performCalculation(overrides);
        if (calculationResults) {
          setResults(calculationResults);
          setIsStale(false);
        }
      }, 0);
    },
    [performCalculation]
  );

  const reset = useCallback(() => {
    setFormState({
      incomeA: 0,
      incomeB: 0,
      supportA: false,
      supportB: false,
      children: getInitialChildren(),
      relDepA: { u13: 0, plus13: 0 },
      relDepB: { u13: 0, plus13: 0 },
      // Multi-case support (Formula 3)
      multiCaseA: { otherChildren: [] },
      multiCaseB: { otherChildren: [] },
      // Non-parent carer support (Formula 4)
      nonParentCarer: { enabled: false, carePercentage: 0 },
    });
    setResults(null);
    setErrors({});
    setIsStale(false);
    setSelectedYear('2026'); // Reset to default year
    setResetTimestamp(Date.now()); // Signal that reset occurred
  }, []);

  const getInputsForSave = useCallback((): CalculatorInputs => {
    const children = formState.children.map((c) => ({
      age: c.age as 'Under 13' | '13+',
      careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
      careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
      careNPC:
        c.careAmountNPC !== undefined
          ? convertCareToPercentage(c.careAmountNPC, c.carePeriod)
          : undefined,
    }));

    return {
      ATI_A: formState.incomeA,
      ATI_B: formState.incomeB,
      supportA: formState.supportA,
      supportB: formState.supportB,
      children,
      relDepA: formState.relDepA,
      relDepB: formState.relDepB,
      multiCaseA: formState.multiCaseA,
      multiCaseB: formState.multiCaseB,
      nonParentCarer: formState.nonParentCarer,
    };
  }, [formState]);

  return {
    formState,
    setFormState,
    selectedYear,
    setSelectedYear,
    errors,
    results,
    isStale,
    setIsStale,
    addChild,
    removeChild,
    updateChild,
    updateMultiCaseA,
    updateMultiCaseB,
    updateNonParentCarer,
    validateForm,
    calculate,
    reset,
    resetTimestamp,
    getInputsForSave,
  };
}
