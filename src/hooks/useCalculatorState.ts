import { useCallback, useState } from 'react';
import {
    CalculatorFormState,
    ChildInput,
    FormErrors,
    NonParentCarerInfo,
    OtherCaseChild
} from '../utils/calculator';
import { AssessmentYear } from '../utils/child-support-constants';

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
    nonParentCarer: { enabled: false },
};

export function useCalculatorState() {
    const [formState, setFormState] =
        useState<CalculatorFormState>(initialFormState);
    const [selectedYear, setSelectedYear] = useState<AssessmentYear>('2026');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isStale, setIsStale] = useState(false);
    const [resetTimestamp, setResetTimestamp] = useState<number>(0);

    const addChild = useCallback(() => {
        setFormState((prev) => ({
            ...prev,
            children: [
                ...prev.children,
                {
                    id: `child-${Date.now()}-${Math.random()}`,
                    age: 5, // Default to age 5 (Under 13)
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

    const resetState = useCallback(() => {
        setFormState(initialFormState);
        setErrors({});
        setIsStale(false);
        setSelectedYear('2026'); // Reset to default year
        setResetTimestamp(Date.now()); // Signal that reset occurred
    }, []);

    return {
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
        resetState,
    };
}
