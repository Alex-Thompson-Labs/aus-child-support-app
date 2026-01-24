import { theme } from '@/src/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

/**
 * SEO Content Section - Educational content explaining child support calculations
 * 
 * Positioned after the calculator form to provide context and build authority.
 * Targets informational search intent and E-E-A-T signals.
 */
export function SEOContentSection() {
  return (
    <View style={styles.container}>
      {/* How Child Support Is Calculated */}
      <View style={styles.section}>
        <Text style={styles.h2}>How Child Support Is Calculated in Australia</Text>
        <Text style={styles.paragraph}>
          Child support in Australia follows an 8-step formula set by Services Australia. 
          The calculation considers:
        </Text>

        <Text style={styles.h3}>Key Factors That Determine Your Payment</Text>
        
        <FactorItem 
          number="1"
          title="Combined Child Support Income"
          description="Both parents' taxable income minus self-support amount"
        />
        <FactorItem 
          number="2"
          title="Cost of Children"
          description="Based on number and ages of children (from official tables)"
        />
        <FactorItem 
          number="3"
          title="Income Percentage"
          description="Your share of the combined income"
        />
        <FactorItem 
          number="4"
          title="Care Percentage"
          description="Nights each parent has the children (affects who pays whom)"
        />
        <FactorItem 
          number="5"
          title="Cost Percentage"
          description="Your share of the costs based on care and income"
        />
        <FactorItem 
          number="6"
          title="Multi-Case Allowance"
          description="Reductions if you support children in other relationships"
        />
        <FactorItem 
          number="7"
          title="Relevant Dependent Allowance"
          description="Adjustments for other dependents in your household"
        />
      </View>

      {/* Why Estimates Differ */}
      <View style={styles.section}>
        <Text style={styles.h3}>Why Your Estimate Might Differ From Reality</Text>
        <Text style={styles.paragraph}>
          Most basic calculators give you a single number. But real child support is more complex:
        </Text>

        <ComplexityItem 
          title="Income changes throughout the year"
          description="Your assessment updates when income changes by 15%+"
        />
        <ComplexityItem 
          title="Care arrangements vary"
          description="School holidays, weekends, and special circumstances affect percentages"
        />
        <ComplexityItem 
          title="Multiple relationships"
          description="Supporting children from different relationships triggers special calculations"
        />
        <ComplexityItem 
          title="Self-employment income"
          description="Business income is assessed differently than wages"
        />
        <ComplexityItem 
          title="Court orders"
          description="Existing agreements can override the formula"
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            This calculator handles all of these scenarios. We show you the full breakdown, 
            not just a final number.
          </Text>
        </View>
      </View>

      {/* Why This Calculator Is Different */}
      <View style={styles.section}>
        <Text style={styles.h2}>Why This Calculator Is Different</Text>
        
        <Text style={styles.h3}>Transparency You Can Trust</Text>
        <Text style={styles.paragraph}>
          Unlike basic calculators that show a single figure, we explain:
        </Text>
        
        <BulletPoint text="Step-by-step breakdown of how your payment is calculated" />
        <BulletPoint text="What happens if your income or care arrangement changes" />
        <BulletPoint text="Warning flags when your situation is too complex for an estimate" />
        <BulletPoint text="Plain English explanations of every formula step" />
      </View>
    </View>
  );
}

function FactorItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <View style={styles.factorItem}>
      <View style={styles.factorNumber}>
        <Text style={styles.factorNumberText}>{number}</Text>
      </View>
      <View style={styles.factorContent}>
        <Text style={styles.factorTitle}>{title}</Text>
        <Text style={styles.factorDescription}>{description}</Text>
      </View>
    </View>
  );
}

function ComplexityItem({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.complexityItem}>
      <Text style={styles.bullet}>•</Text>
      <View style={styles.complexityContent}>
        <Text style={styles.complexityTitle}>{title}</Text>
        <Text style={styles.complexityDescription}> – {description}</Text>
      </View>
    </View>
  );
}

function BulletPoint({ text }: { text: string }) {
  return (
    <View style={styles.bulletPoint}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 32,
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  section: {
    marginBottom: 32,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primaryDark,
    marginBottom: 16,
    lineHeight: 32,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primaryDark,
    marginTop: 16,
    marginBottom: 12,
    lineHeight: 26,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  factorNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factorNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  factorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  complexityItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  complexityContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  complexityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  complexityDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  bullet: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  highlightBox: {
    backgroundColor: '#eff6ff', // blue-50
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
});
