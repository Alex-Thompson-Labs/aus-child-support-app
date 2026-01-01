import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// This import goes UP one folder (..), then INTO ui folder
import { theme } from '../../theme';
import Accordion from '../ui/Accordion';
// Note: 'useNavigation' removed for now to stop the warning

export const CalculatorFAQ = () => {
  return (
    <View style={styles.container}>
      {/* Section 1: The Formula */}
      <Accordion title="How is this calculated?">
        <Text style={styles.text}>
          Australian Child Support is based on the{' '}
          <Text style={styles.bold}>Income Shares</Text> model. We replicate the
          Services Australia 8-step formula exactly:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            1. <Text style={styles.bold}>Income:</Text> ATI minus Self-Support
            Amount.
          </Text>
          <Text style={styles.listItem}>
            2. <Text style={styles.bold}>Combine:</Text> Both parents&apos;
            incomes added.
          </Text>
          <Text style={styles.listItem}>
            3. <Text style={styles.bold}>Costs:</Text> Determined by government
            tables.
          </Text>
          <Text style={styles.listItem}>
            4. <Text style={styles.bold}>Share:</Text> Your share of income vs.
            your share of care.
          </Text>
        </View>
      </Accordion>

      {/* Section 2: The 50/50 Myth */}
      <Accordion title="Does 50/50 care mean $0?">
        <Text style={styles.text}>
          <Text style={styles.bold}>Not necessarily.</Text>
        </Text>
        <Text style={styles.text}>
          The 50/50 rule implies you cover 50% of the costs directly through
          care. However, if you earn significantly more than the other parent,
          you are still responsible for a larger share of the financial burden.
        </Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Higher Earner + 50/50 Care = You likely pay.
          </Text>
        </View>
      </Accordion>

      {/* Section 3: Complex Income */}
      <Accordion title="What if a parent's income is complex?">
        <Text style={styles.text}>
          The standard formula uses a parent&apos;s Adjusted Taxable Income,
          which often does not factor in property, hidden cash, or lifestyle
          discrepancies.
        </Text>
      </Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
