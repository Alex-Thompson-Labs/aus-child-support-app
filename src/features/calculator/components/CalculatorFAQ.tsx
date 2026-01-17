import Accordion from '@/src/components/ui/Accordion';
import { theme, useAppTheme } from '@/src/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CalculatorFAQ = () => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Section 1: The Formula */}
      <Accordion
        title="How is this calculated?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          Australian Child Support is based on the Income Shares Model. Our
          calculator replicates the official Services Australia 8-step formula.
          Key factors include Combined Income (Adjusted Taxable Income minus the
          Self-Support Amount), Cost of Children (determined by government
          tables), and Care Percentage (comparing your share of the income
          against your share of the care).
        </Text>
      </Accordion>

      {/* Section 2: The 50/50 Myth */}
      <Accordion
        title="Does 50/50 care mean $0?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          Not necessarily. In Australia, Shared Care (such as 50/50) does not
          automatically result in $0. The formula balances your income share
          against your care share. If you earn significantly more than the other
          parent, you are likely liable for payments to bridge the financial
          gap.
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Higher Earner + 50/50 Care = You likely pay.
          </Text>
        </View>
      </Accordion>

      {/* Section 3: Complex Income */}
      <Accordion
        title="What income sources are included?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          The formula relies on Adjusted Taxable Income (ATI), not just gross
          salary. ATI includes taxable income, reportable fringe benefits,
          target foreign income, total net investment losses, and reportable
          superannuation contributions. Complex assets (like hidden cash or
          business structures) generally require a specialised &apos;Change of
          Assessment&apos; application.
        </Text>
      </Accordion>

      {/* Section 4: Self-Support Amount */}
      <Accordion
        title="What is the Self-Support Amount?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          The Self-Support Amount is a protected portion of your income reserved
          for your own basic living expenses. Child support is only calculated
          on income above this threshold. This amount is indexed annually by
          Services Australia ($31,046 in 2026).
        </Text>
      </Accordion>

      {/* Section 5: Private School Fees */}
      <Accordion
        title="Does this include private school fees?"
        titleStyle={{ color: colors.primaryDark }}
        iconColor={colors.primaryDark}
      >
        <Text style={styles.text}>
          No. The standard formula covers day-to-day costs like food and
          housing. Significant extra costs—such as private school fees,
          orthodontics, or high-level extracurriculars—are often classified as
          &apos;Non-Agency Payments&apos; or specific &apos;Prescribed
          Expenses&apos;. These usually require a separate binding child support
          agreement or court order.
        </Text>
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
