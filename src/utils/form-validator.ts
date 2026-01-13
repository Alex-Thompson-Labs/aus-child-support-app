import { CalculatorFormState, FormErrors } from './calculator';
import { getMaxCareForPeriod } from './care-utils';

/**
 * Validates the calculator form state and returns any validation errors.
 * 
 * @param formState - The current state of the calculator form
 * @returns FormErrors object containing field-specific error messages
 */
export const validateCalculatorForm = (formState: CalculatorFormState): FormErrors => {
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
        const maxValue = getMaxCareForPeriod(child.carePeriod);

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

    return newErrors;
};
