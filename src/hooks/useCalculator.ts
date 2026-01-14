import { useCallback, useState } from 'react';
import type {
    CalculationResults,
    CalculatorInputs,
} from '../utils/calculator';
import { deriveAgeRange } from '../utils/calculator';
import { convertCareToPercentage } from '../utils/care-utils';
import { triggerSuccessHaptic } from '../utils/haptics';
import { useCalculatorState } from './useCalculatorState';

// Re-export types for backward compatibility
export type { CalculatorFormState } from '../utils/calculator';

// Lazy import for heavy calculation module - only loaded when calculate() is called
let calculateModule: typeof import('../utils/calculateResults') | null = null;

async function getCalculateModule() {
  if (!calculateModule) {
    calculateModule = await import('../utils/calculateResults');
  }
  return calculateModule;
}

export function useCalculator() {
  const {
    formState,
    setFormState,
    selectedYear,
    setSelectedYear,
    errors,
    setErrors,
    isStale,
    setIsStale,
    resetTimestamp,
    addChild,
    removeChild,
    updateChild,
    updateMultiCaseA,
    updateMultiCaseB,
    updateNonParentCarer,
    updateCareDispute,
    resetState
  } = useCalculatorState();

  const [results, setResults] = useState<CalculationResults | null>(null);

  const validateForm = useCallback(async (): Promise<boolean> => {
    const { validateCalculatorForm } = await getCalculateModule();
    const newErrors = validateCalculatorForm(formState);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, setErrors]);

  const calculate = useCallback(
    (overrides?: { supportA?: boolean; supportB?: boolean }) => {
      // Optimize INP: Yield to main thread to allow UI feedback (button press) to render
      // before starting heavy blocking calculation.

      // Ensure "stale" state is set synchronously to trigger any necessary pending UI updates
      setIsStale(true);

      // Use async/await with dynamic import for code splitting
      (async () => {
        try {
          const { calculateChildSupport, validateCalculatorForm } = await getCalculateModule();
          
          // Run validation and set errors in state
          const newErrors = validateCalculatorForm(formState);
          setErrors(newErrors);

          if (Object.keys(newErrors).length > 0) {
            // Validation failed
            return;
          }

          const calculationResults = calculateChildSupport(formState, selectedYear, overrides);
          if (calculationResults) {
            setResults(calculationResults);
            setIsStale(false);
            // Trigger haptic feedback on successful calculation (mobile only)
            triggerSuccessHaptic();
          }
        } catch (error) {
          console.error('Calculation error:', error);
        }
      })();
    },
    [formState, selectedYear, setIsStale, setErrors]
  );

  const reset = useCallback(() => {
    resetState();
    setResults(null);
  }, [resetState]);

  const getInputsForSave = useCallback((): CalculatorInputs => {
    const children = formState.children.map((c) => ({
      age: c.age,
      ageRange: deriveAgeRange(c.age),
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
    updateCareDispute,
    validateForm,
    calculate,
    reset,
    resetTimestamp,
    getInputsForSave,
  };
}
