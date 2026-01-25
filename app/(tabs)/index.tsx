import React from 'react';
import { PageSEO } from '../../src/components/seo/PageSEO';
import { CalculatorScreen } from '../../src/screens/CalculatorScreen'; // Adjust if your import differs

export default function HomeScreen() {
  // Enhanced PAGE SCHEMA: FAQ + SoftwareApplication
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Australian Child Support Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'AUD',
        },
        description: 'Free Australian child support calculator using the official Services Australia 8-step formula. Handles complex scenarios including income changes, multiple children, shared care arrangements, and multi-case situations.',
        featureList: [
          '8-step Services Australia formula',
          'Income change scenarios',
          'Shared care calculations',
          'Multi-case support',
          'Step-by-step breakdown',
          'Plain English explanations',
        ],
        audience: {
          '@type': 'Audience',
          geographicArea: {
            '@type': 'Country',
            name: 'Australia',
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much child support will I pay in Australia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Child support payments depend on both parents\' incomes, the number of children, and care arrangements. For example, if Parent 1 earns $80,000, Parent 2 earns $50,000, with 2 children and Parent 1 having 30% care, Parent 1 would typically pay around $450-500 per month. Use a child support calculator to get your specific estimate based on your circumstances.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the minimum child support payment in Australia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If your adjusted taxable income is below the self-support amount ($29,619 for 2025-26), you may pay a minimum annual rate of $1,815 per year ($151.25 per month) for one child, regardless of care arrangements.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is child support calculated when income changes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Services Australia reassesses child support when income changes by 15% or more from your last tax return. You can request a reassessment by providing recent payslips or profit and loss statements. The new assessment applies from the date you notify Services Australia, not retrospectively.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does child support change with 50/50 care?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. When care is exactly 50/50, the parent with higher income typically pays child support to the other parent, but the amount is much lower than in sole-care arrangements. The formula recognises both parents are directly covering costs when children are in their care.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does child support work with multiple children from different relationships?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In multi-case situations, Services Australia applies a Multi-Case Allowance that reduces your child support income to recognise you\'re supporting children in multiple cases. This prevents you from being assessed as if you had full income available for each case separately.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I use a child support calculator for court orders?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If you have a court order or binding child support agreement, that overrides the Services Australia formula. However, you can use a calculator to compare what you\'re paying vs. the formula amount, understand if the agreement is still fair, or prepare for renegotiating the agreement.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageSEO
        title="Australian Child Support Calculator | Free, Accurate Estimate 2026"
        description="Calculate your 2026 child support payments in minutes. Free Australian calculator covering complex scenarios, income changes, and care arrangements. More detailed than Services Australia's tool."
        canonicalPath="/"
        schema={pageSchema}
      />

      <CalculatorScreen />
    </>
  );
}
