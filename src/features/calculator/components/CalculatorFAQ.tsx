import Accordion from '@/src/components/ui/Accordion';
import { theme, useAppTheme } from '@/src/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CalculatorFAQ = () => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Common Questions About Child Support</Text>

      {/* Question 1: How much will I pay */}
      <Accordion
        title="How much child support will I pay in Australia?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          Child support payments depend on both parents&apos; incomes, the number of children, 
          and how much time each parent cares for the children. For example:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Parent 1 earns $80,000, Parent 2 earns $50,000</Text>
          <Text style={styles.listItem}>• 2 children under 13</Text>
          <Text style={styles.listItem}>• Parent 1 has children 30% of nights (4 nights per fortnight)</Text>
        </View>
        <Text style={[styles.text, styles.marginTop]}>
          In this scenario, Parent 1 would typically pay around <Text style={styles.bold}>$450-500 per month</Text> to 
          Parent 2. The exact amount depends on other factors like relevant dependents and whether 
          either parent supports children from other relationships.
        </Text>
        <Text style={[styles.text, styles.marginTop]}>
          Use the calculator above to get your specific estimate.
        </Text>
      </Accordion>

      {/* Question 2: Minimum payment */}
      <Accordion
        title="What is the minimum child support payment in Australia?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          If your adjusted taxable income is below the self-support amount ($29,619 for 2025-26), 
          you may pay a <Text style={styles.bold}>minimum annual rate</Text> rather than a percentage of income. 
          This is currently <Text style={styles.bold}>$1,815 per year ($151.25 per month)</Text> for one child, 
          regardless of care arrangements.
        </Text>
        <Text style={[styles.text, styles.marginTop]}>
          Parents receiving income support payments may have this amount collected directly from their payments.
        </Text>
      </Accordion>

      {/* Question 3: Income changes */}
      <Accordion
        title="How is child support calculated when income changes?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          Services Australia reassesses your child support when your income changes by <Text style={styles.bold}>15% or more</Text> from 
          your last tax return. You can request a reassessment by providing:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Recent payslips (for wage earners)</Text>
          <Text style={styles.listItem}>• Profit and loss statements (for self-employed)</Text>
          <Text style={styles.listItem}>• Evidence of job loss or reduced hours</Text>
        </View>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            The new assessment applies from the date you notify Services Australia, not retrospectively. 
            This is why it&apos;s important to report income changes quickly – you could be overpaying or 
            underpaying for months.
          </Text>
        </View>
      </Accordion>

      {/* Question 4: 50/50 care */}
      <Accordion
        title="Does child support change with 50/50 care?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          Yes, significantly. When care is exactly 50/50 (182-183 nights each per year), the parent 
          with the higher income typically pays child support to the other parent, but the amount is{' '}
          <Text style={styles.bold}>much lower</Text> than in sole-care arrangements.
        </Text>
        <Text style={[styles.text, styles.marginTop]}>
          For example:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Sole care (0% to parent 1): Parent 1 pays $800/month</Text>
          <Text style={styles.listItem}>• Shared care (50/50): Parent 1 pays $200/month</Text>
        </View>
        <Text style={[styles.text, styles.marginTop]}>
          The formula recognises that both parents are directly covering costs when children are in their care.
        </Text>
      </Accordion>

      {/* Question 5: Multiple children from different relationships */}
      <Accordion
        title="How does child support work with multiple children from different relationships?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          This is called a <Text style={styles.bold}>multi-case situation</Text>, and it significantly affects calculations. 
          Services Australia applies a Multi-Case Allowance that reduces your child support income to 
          recognise you&apos;re supporting children in multiple cases.
        </Text>
        <Text style={[styles.text, styles.marginTop]}>
          For example, if you have:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• 2 children with Partner A</Text>
          <Text style={styles.listItem}>• 1 child with Partner B</Text>
        </View>
        <Text style={[styles.text, styles.marginTop]}>
          Your income is reduced by a percentage before calculating what you owe to each case. 
          This prevents you from being assessed as if you had full income available for each case separately.
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Most basic calculators get this wrong. Our calculator applies the correct multi-case formula.
          </Text>
        </View>
      </Accordion>

      {/* Question 6: Court orders */}
      <Accordion
        title="Can I use a child support calculator for court orders?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          If you have a <Text style={styles.bold}>court order</Text> or <Text style={styles.bold}>binding child support agreement</Text> that 
          sets a specific amount, that overrides the Services Australia formula. However, you can still 
          use this calculator to:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Compare what you&apos;re paying vs. the formula amount</Text>
          <Text style={styles.listItem}>• Understand if the agreement is still fair as circumstances change</Text>
          <Text style={styles.listItem}>• Prepare for renegotiating the agreement</Text>
        </View>
        <Text style={[styles.text, styles.marginTop]}>
          Court orders and agreements can be changed if both parents agree, or through court application 
          if circumstances have significantly changed.
        </Text>
      </Accordion>

      {/* Question 7: School fees */}
      <Accordion
        title="Does child support cover school fees and medical costs?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          <Text style={styles.bold}>No.</Text> The child support formula is designed to cover basic living costs only. 
          It does not include:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Private school fees</Text>
          <Text style={styles.listItem}>• Extracurricular activities (sports, music lessons)</Text>
          <Text style={styles.listItem}>• Medical costs not covered by Medicare</Text>
          <Text style={styles.listItem}>• Childcare fees</Text>
        </View>
        <Text style={[styles.text, styles.marginTop]}>
          Parents can agree to share these costs separately, or include them in a binding child support agreement. 
          If you can&apos;t agree, you may need to apply to court for orders about additional expenses.
        </Text>
      </Accordion>

      {/* Question 8: Accuracy */}
      <Accordion
        title="How accurate is this calculator?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          This calculator uses the official Services Australia 8-step formula and is accurate for the 
          scenarios it covers. However, it provides <Text style={styles.bold}>estimates only</Text>, not formal assessments.
        </Text>
        <Text style={[styles.text, styles.marginTop]}>
          Accuracy depends on:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• How accurately you enter your income and care details</Text>
          <Text style={styles.listItem}>• Whether your situation involves factors we can&apos;t calculate (e.g., Change of Assessment decisions)</Text>
          <Text style={styles.listItem}>• Timing – rates and thresholds change each financial year</Text>
        </View>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            For a formal assessment, you must apply through Services Australia. They will verify your 
            income with the ATO and issue an official decision you can rely on.
          </Text>
        </View>
      </Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 16,
    width: '100%',
    // maxWidth: 600, // Optional: restricts width on huge screens
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  list: {
    marginTop: 8,
    paddingLeft: 4,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  highlightBox: {
    backgroundColor: theme.colors.backgroundNeutral,
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  marginTop: {
    marginTop: 8,
  },
});
