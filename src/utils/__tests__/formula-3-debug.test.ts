/**
 * Formula 3 Debug Test
 * 
 * This test traces through the Formula 3 calculation step-by-step
 * to understand why the final liability is $8,163 instead of $9,748.
 */

import { calculateChildSupport } from '../calculateResults';
import { CalculatorFormState, deriveAgeRange } from '../calculator';
import { AssessmentYear } from '../child-support-constants';
import { calculateSoloCostPerChild } from '../engine/multi-case-engine';

const createBaseFormState = (): CalculatorFormState => ({
  incomeA: 0,
  incomeB: 0,
  supportA: false,
  supportB: false,
  relDepA: { u13: 0, plus13: 0 },
  relDepB: { u13: 0, plus13: 0 },
  children: [],
  multiCaseA: { otherChildren: [] },
  multiCaseB: { otherChildren: [] },
  nonParentCarer: { enabled: false },
});

describe('Formula 3 Debug - Trace Execution', () => {
  const year: AssessmentYear = '2026';
  const SSA = 31046;
  
  test('DEBUG-F3-001: Trace multi-case cap calculation', () => {
    /**
     * SCENARIO:
     * Parent A: $100,000 income, 0 nights, has 1 other child aged 8
     * Parent B: $60,000 income, 365 nights
     * Current case: 1 child aged 10
     */
    
    const formState: CalculatorFormState = {
      ...createBaseFormState(),
      incomeA: 100000,
      incomeB: 60000,
      multiCaseA: {
        otherChildren: [{ age: 8 }],
      },
      children: [{
        id: '1',
        age: 10,
        careAmountA: 0,
        careAmountB: 365,
        carePeriod: 'year',
      }],
    };
    
    const result = calculateChildSupport(formState, year);
    
    expect(result).not.toBeNull();
    if (result && result.resultType !== 'COMPLEXITY_TRAP') {
      console.log('\n========================================');
      console.log('FORMULA 3 DEBUG TRACE');
      console.log('========================================\n');
      
      // Step 1: Income calculations
      console.log('STEP 1: Income Calculations');
      console.log('----------------------------');
      const ATI_A = 100000;
      const ATI_B = 60000;
      const preliminaryCSI_A = ATI_A - SSA;
      const preliminaryCSI_B = ATI_B - SSA;
      console.log(`ATI_A: $${ATI_A.toLocaleString()}`);
      console.log(`ATI_B: $${ATI_B.toLocaleString()}`);
      console.log(`Preliminary CSI_A: $${preliminaryCSI_A.toLocaleString()}`);
      console.log(`Preliminary CSI_B: $${preliminaryCSI_B.toLocaleString()}`);
      console.log(`Multi-case Allowance A: $${result.multiCaseAllowanceA.toLocaleString()}`);
      console.log(`Final CSI_A: $${result.CSI_A.toLocaleString()}`);
      console.log(`Final CSI_B: $${result.CSI_B.toLocaleString()}`);
      console.log(`CCSI: $${result.CCSI.toLocaleString()}`);
      
      // Step 2: Income percentages
      console.log('\nSTEP 2: Income Percentages');
      console.log('---------------------------');
      console.log(`Income% A: ${result.incomePercA.toFixed(2)}%`);
      console.log(`Income% B: ${result.incomePercB.toFixed(2)}%`);
      
      // Step 3: Care and cost percentages
      console.log('\nSTEP 3: Care & Cost Percentages');
      console.log('--------------------------------');
      const child = result.childResults[0];
      console.log(`Care% A: ${child.roundedCareA}%`);
      console.log(`Care% B: ${child.roundedCareB}%`);
      console.log(`Cost% A: ${child.costPercA}%`);
      console.log(`Cost% B: ${child.costPercB}%`);
      
      // Step 4: Child support percentages
      console.log('\nSTEP 4: Child Support Percentages');
      console.log('----------------------------------');
      console.log(`CS% A: ${child.childSupportPercA.toFixed(2)}%`);
      console.log(`CS% B: ${child.childSupportPercB.toFixed(2)}%`);
      
      // Step 5: COTC
      console.log('\nSTEP 5: Cost of Children');
      console.log('-------------------------');
      console.log(`Total COTC: $${Math.round(result.totalCost).toLocaleString()}`);
      console.log(`Cost per child: $${Math.round(child.costPerChild).toLocaleString()}`);
      
      // Step 6: Standard liability (before multi-case cap)
      console.log('\nSTEP 6: Standard Liability Calculation');
      console.log('---------------------------------------');
      const standardLiabilityA = (child.childSupportPercA / 100) * child.costPerChild;
      console.log(`Standard Liability A: ${child.childSupportPercA.toFixed(2)}% × $${Math.round(child.costPerChild).toLocaleString()} = $${Math.round(standardLiabilityA).toLocaleString()}`);
      console.log(`Initial liabilityA: $${Math.round(child.liabilityA).toLocaleString()}`);
      
      // Step 7: Multi-case cap calculation
      console.log('\nSTEP 7: Multi-Case Cap Calculation');
      console.log('-----------------------------------');
      
      // Calculate solo cost per child
      const assessableChildren = [{ age: 10, ageRange: deriveAgeRange(10) }];
      const otherChildren = [{ age: 8 }];
      
      const soloCostPerChild = calculateSoloCostPerChild({
        parentPreliminaryCSI: preliminaryCSI_A,
        assessableChildren,
        otherCaseChildren: otherChildren,
        selectedYear: year,
      });
      
      console.log(`Solo Cost Per Child: $${Math.round(soloCostPerChild).toLocaleString()}`);
      console.log(`  (Based on Parent A's preliminary CSI: $${preliminaryCSI_A.toLocaleString()})`);
      console.log(`  (Total children: 2 - current case child + 1 other case child)`);
      
      const multiCaseCap = Math.round(soloCostPerChild * ((100 - child.costPercA) / 100));
      console.log(`Multi-case Cap: $${Math.round(soloCostPerChild).toLocaleString()} × (100% - ${child.costPercA}%) = $${multiCaseCap.toLocaleString()}`);
      console.log(`  (Cap = Solo Cost × (100% - Parent's Cost%))`);
      
      console.log(`\nMulti-case Cap from result: $${child.multiCaseCapA?.toLocaleString() ?? 'undefined'}`);
      console.log(`Multi-case Cap Applied: ${child.multiCaseCapAppliedA ? 'YES' : 'NO'}`);
      
      // Step 8: Final liability
      console.log('\nSTEP 8: Final Liability');
      console.log('------------------------');
      console.log(`Final Liability A (per child): $${Math.round(child.finalLiabilityA).toLocaleString()}`);
      console.log(`Total Final Liability A: $${Math.round(result.finalLiabilityA).toLocaleString()}`);
      console.log(`Total Final Liability B: $${Math.round(result.finalLiabilityB).toLocaleString()}`);
      
      // Step 9: Payment resolution
      console.log('\nSTEP 9: Payment Resolution');
      console.log('---------------------------');
      console.log(`Payer: ${result.payer}`);
      console.log(`Receiver: ${result.receiver}`);
      console.log(`Final Payment Amount: $${Math.round(result.finalPaymentAmount).toLocaleString()}`);
      
      // Analysis
      console.log('\n========================================');
      console.log('ANALYSIS');
      console.log('========================================');
      console.log(`\nExpected Liability (67.73% × $14,393): $9,748`);
      console.log(`Actual Liability: $${Math.round(result.finalLiabilityA).toLocaleString()}`);
      console.log(`Discrepancy: $${Math.abs(9748 - Math.round(result.finalLiabilityA)).toLocaleString()}`);
      
      if (child.multiCaseCapAppliedA) {
        console.log(`\n⚠️  Multi-case cap WAS applied!`);
        console.log(`Standard liability ($${Math.round(standardLiabilityA).toLocaleString()}) exceeded cap ($${child.multiCaseCapA?.toLocaleString()})`);
        console.log(`Liability capped to: $${Math.round(child.finalLiabilityA).toLocaleString()}`);
      } else {
        console.log(`\n✓ Multi-case cap was NOT applied`);
        console.log(`Standard liability ($${Math.round(standardLiabilityA).toLocaleString()}) did not exceed cap ($${child.multiCaseCapA?.toLocaleString() ?? 'N/A'})`);
      }
      
      console.log('\n========================================\n');
    }
  });
});
