import { useCallback, useEffect, useRef, useState } from "react";
import type {
    CalculationResults,
    CalculatorInputs,
    ChildInput,
    FormErrors,
    RelevantDependents,
} from "../types/calculator";
import {
    convertCareToPercentage,
    getChildCost,
    mapCareToCostPercent,
    roundCarePercentage,
} from "../utils/child-support-calculations";
import { FAR, MAR, MAX_PPS, SSA } from "../utils/child-support-constants";

export interface CalculatorFormState {
  incomeA: number;
  incomeB: number;
  supportA: boolean;
  supportB: boolean;
  children: ChildInput[];
  relDepA: RelevantDependents;
  relDepB: RelevantDependents;
  courtDate?: string; // Optional court date in dd/mm/yyyy format
}

const initialFormState: CalculatorFormState = {
  incomeA: 0,
  incomeB: 0,
  supportA: false,
  supportB: false,
  children: [
    {
      id: `child-${Date.now()}`,
      age: "Under 13",
      careAmountA: 8,
      careAmountB: 6,
      carePeriod: "fortnight",
    },
  ],
  relDepA: { u13: 0, plus13: 0 },
  relDepB: { u13: 0, plus13: 0 },
  courtDate: "", // Empty string by default
};

export function useCalculator() {
  const [formState, setFormState] =
    useState<CalculatorFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [results, setResults] = useState<CalculationResults | null>(null);

  const addChild = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        {
          id: `child-${Date.now()}-${Math.random()}`,
          age: "Under 13",
          careAmountA: 8,
          careAmountB: 6,
          carePeriod: "fortnight",
        },
      ],
    }));
    setErrors({});
  }, []);

  const removeChild = useCallback((childId: string) => {
    setFormState((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== childId),
    }));
    setErrors({});
  }, []);

  const updateChild = useCallback(
    (childId: string, updates: Partial<ChildInput>) => {
      setFormState((prev) => ({
        ...prev,
        children: prev.children.map((c) =>
          c.id === childId ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate incomes
    if (formState.incomeA < 0) {
      newErrors.incomeA = "Income must be $0 or more.";
    }
    if (formState.incomeB < 0) {
      newErrors.incomeB = "Income must be $0 or more.";
    }

    // Children validation removed - allow $0 results with no children

    // Validate each child
    formState.children.forEach((child) => {
      const maxNights =
        child.carePeriod === "week"
          ? 7
          : child.carePeriod === "fortnight"
            ? 14
            : child.carePeriod === "year"
              ? 365
              : 14;

      if (child.careAmountA < 0) {
        newErrors[child.id] = "Parent A nights must be 0 or more.";
      } else if (child.careAmountA > maxNights) {
        newErrors[child.id] =
          `Parent A nights cannot exceed ${maxNights} for ${child.carePeriod}.`;
      }
      if (child.careAmountB < 0) {
        newErrors[child.id] = "Parent B nights must be 0 or more.";
      } else if (child.careAmountB > maxNights) {
        newErrors[child.id] =
          `Parent B nights cannot exceed ${maxNights} for ${child.carePeriod}.`;
      }
      // Validate sum of nights
      const totalNights = child.careAmountA + child.careAmountB;
      if (totalNights > maxNights) {
        newErrors[child.id] = `Total nights cannot exceed ${maxNights} per ${child.carePeriod}. Currently: ${totalNights}`;
      }
    });

    // Validate dependents
    if (formState.relDepA.u13 < 0 || formState.relDepA.plus13 < 0) {
      newErrors.relDepA = "Dependent count cannot be negative.";
    }
    if (formState.relDepB.u13 < 0 || formState.relDepB.plus13 < 0) {
      newErrors.relDepB = "Dependent count cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  const performCalculation = useCallback((): CalculationResults | null => {
    if (!validateForm()) {
      return null;
    }

    const { incomeA, incomeB, supportA, supportB, relDepA, relDepB } = formState;
    const ATI_A = incomeA;
    const ATI_B = incomeB;
    // Using 2025 rates - current calendar year

    // Convert children to calculation format
    const children = formState.children.map((c) => ({
      age: c.age as "Under 13" | "13+",
      careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
      careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
    }));

    // Step 1: Create virtual children for relevant dependents
    // Virtual children have 0% care since they're only used for cost calculation
    const relDepChildrenA: Array<{ age: "Under 13" | "13+"; careA: number; careB: number }> = [
      ...Array(relDepA.u13).fill({ age: "Under 13" as const, careA: 0, careB: 0 }),
      ...Array(relDepA.plus13).fill({ age: "13+" as const, careA: 0, careB: 0 }),
    ];
    const relDepChildrenB: Array<{ age: "Under 13" | "13+"; careA: number; careB: number }> = [
      ...Array(relDepB.u13).fill({ age: "Under 13" as const, careA: 0, careB: 0 }),
      ...Array(relDepB.plus13).fill({ age: "13+" as const, careA: 0, careB: 0 }),
    ];

    // Step 2-4: Calculate Child Support Income (CSI)
    const relDepDeductibleA = getChildCost(
      "2025",
      relDepChildrenA,
      Math.max(0, ATI_A - SSA)
    ).cost;
    const relDepDeductibleB = getChildCost(
      "2025",
      relDepChildrenB,
      Math.max(0, ATI_B - SSA)
    ).cost;

    const CSI_A = Math.max(0, ATI_A - relDepDeductibleA - SSA);
    const CSI_B = Math.max(0, ATI_B - relDepDeductibleB - SSA);

    const CCSI = CSI_A + CSI_B; // Combined CSI

    // Income Percentages
    const incomePercA = CCSI > 0 ? (CSI_A / CCSI) * 100 : 0;
    const incomePercB = CCSI > 0 ? (CSI_B / CCSI) * 100 : 0;

    // Step 5: Calculate Total Cost of Children
    const { cost: totalCost, bracketInfo: costBracketInfo } = getChildCost("2025", children, CCSI);
    const costPerChild = children.length > 0 ? totalCost / children.length : 0;

    // Step 6–8: Calculate individual liabilities
    let totalLiabilityA = 0;
    let totalLiabilityB = 0;

    const childResults = children.map((c) => {
      const roundedCareA = roundCarePercentage(c.careA);
      const roundedCareB = roundCarePercentage(c.careB);

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
        if (roundedCareB >= 35) {
          liabilityA = (positivePercA / 100) * costPerChild;
        }
      } else if (positivePercB > positivePercA) {
        if (roundedCareA >= 35) {
          liabilityB = (positivePercB / 100) * costPerChild;
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
      };
    });

    // Step 9–10: Apply Fixed Annual Rate (FAR) or Minimum Annual Rate (MAR)
    let FAR_A = 0,
      FAR_B = 0,
      MAR_A = 0,
      MAR_B = 0;
    let finalLiabilityA = 0;
    let finalLiabilityB = 0;
    let rateApplied = "None";
    const appliedRates: string[] = [];

    childResults.forEach((child, index) => {
      const roundedCareA = child.roundedCareA;
      const roundedCareB = child.roundedCareB;

      let liabilityA = child.liabilityA;
      let appliedRateA: string | null = null;
      let farAppliedA = false;
      let marAppliedA = false;

      if (ATI_A < SSA && supportA && roundedCareB >= 87) {
        MAR_A += MAR;
        liabilityA = MAR;
        appliedRateA = `MAR (Parent A, Child ${index + 1})`;
        marAppliedA = true;
      } else if (ATI_A < MAX_PPS && !supportA && roundedCareB >= 66) {
        FAR_A += FAR;
        liabilityA = FAR;
        appliedRateA = `FAR (Parent A, Child ${index + 1})`;
        farAppliedA = true;
      }

      if (appliedRateA) {
        appliedRates.push(appliedRateA);
      }
      finalLiabilityA += liabilityA;

      let liabilityB = child.liabilityB;
      let appliedRateB: string | null = null;
      let farAppliedB = false;
      let marAppliedB = false;

      if (ATI_B < SSA && supportB && roundedCareA >= 87) {
        MAR_B += MAR;
        liabilityB = MAR;
        appliedRateB = `MAR (Parent B, Child ${index + 1})`;
        marAppliedB = true;
      } else if (ATI_B < MAX_PPS && !supportB && roundedCareA >= 66) {
        FAR_B += FAR;
        liabilityB = FAR;
        appliedRateB = `FAR (Parent B, Child ${index + 1})`;
        farAppliedB = true;
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

    // Determine rate applied string
    if (appliedRates.length > 0) {
      const farA = appliedRates.filter((r) =>
        r.startsWith("FAR (Parent A")
      ).length;
      const farB = appliedRates.filter((r) =>
        r.startsWith("FAR (Parent B")
      ).length;
      const marA = appliedRates.filter((r) =>
        r.startsWith("MAR (Parent A")
      ).length;
      const marB = appliedRates.filter((r) =>
        r.startsWith("MAR (Parent B")
      ).length;

      if (farA > 0 && farB > 0) {
        rateApplied = "FAR (Both Parents)";
      } else if (farA > 0) {
        rateApplied = `FAR (Parent A, ${farA} child${farA > 1 ? "ren" : ""})`;
      } else if (farB > 0) {
        rateApplied = `FAR (Parent B, ${farB} child${farB > 1 ? "ren" : ""})`;
      } else if (marA > 0 && marB > 0) {
        rateApplied = "MAR (Both Parents)";
      } else if (marA > 0) {
        rateApplied = `MAR (Parent A, ${marA} child${marA > 1 ? "ren" : ""})`;
      } else if (marB > 0) {
        rateApplied = `MAR (Parent B, ${marB} child${marB > 1 ? "ren" : ""})`;
      }
    }

    // Final Payment Calculation
    let finalPayment = finalLiabilityA - finalLiabilityB;
    let payer = finalPayment > 0 ? "Parent A" : "Parent B";
    let receiver = finalPayment > 0 ? "Parent B" : "Parent A";
    let finalPaymentAmount = Math.abs(finalPayment);

    if (rateApplied.startsWith("FAR") && FAR_A > 0 && FAR_B > 0) {
      finalPayment = FAR_A - FAR_B;
      payer = finalPayment > 0 ? "Parent A" : "Parent B";
      receiver = finalPayment > 0 ? "Parent B" : "Parent A";
      finalPaymentAmount = Math.abs(finalPayment);
      rateApplied = "FAR (Both)";
    } else if (rateApplied.startsWith("MAR") && MAR_A > 0 && MAR_B > 0) {
      finalPayment = MAR_A - MAR_B;
      payer = "N/A";
      receiver = "N/A";
      finalPaymentAmount = 0;
      rateApplied = "MAR (Both)";
    }

    if (finalPaymentAmount === 0) {
      payer = "Neither";
      receiver = "Neither";
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
    };
  }, [formState, validateForm]);

  const calculate = useCallback(() => {
    const calculationResults = performCalculation();
    if (calculationResults) {
      setResults(calculationResults);
    }
  }, [performCalculation]);

  // Live calculation with debounce
  const debounceRef = useRef<number | null>(null);  
  useEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the calculation by 300ms
    debounceRef.current = setTimeout(() => {
      const calculationResults = performCalculation();
      if (calculationResults) {
        setResults(calculationResults);
      }
    }, 300);
    
    // Cleanup on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formState, performCalculation]);

  const getInputsForSave = useCallback((): CalculatorInputs => {
    const children = formState.children.map((c) => ({
      age: c.age as "Under 13" | "13+",
      careA: convertCareToPercentage(c.careAmountA, c.carePeriod),
      careB: convertCareToPercentage(c.careAmountB, c.carePeriod),
    }));

    return {
      ATI_A: formState.incomeA,
      ATI_B: formState.incomeB,
      supportA: formState.supportA,
      supportB: formState.supportB,
      children,
      relDepA: formState.relDepA,
      relDepB: formState.relDepB,
    };
  }, [formState]);

  return {
    formState,
    setFormState,
    errors,
    results,
    addChild,
    removeChild,
    updateChild,
    validateForm,
    calculate,
    getInputsForSave,
  };
}

