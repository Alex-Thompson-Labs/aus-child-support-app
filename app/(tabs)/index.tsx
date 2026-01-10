import React from 'react';
import { PageSEO } from '../../src/components/seo/PageSEO';
import { CalculatorScreen } from '../../src/screens/CalculatorScreen'; // Adjust if your import differs

export default function HomeScreen() {
  // PAGE SCHEMA: FAQ + HowTo combined
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How is Australian Child Support calculated in 2026?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It is calculated using the official 8-step formula based on combined income, care percentages, and cost of living tables provided by Services Australia.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does 50/50 care mean no child support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Not necessarily. If there is a significant income disparity between parents, child support may still be payable even with 50/50 shared care.',
            },
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Calculate Child Support in Australia',
        description: 'Use this free calculator to estimate child support payments using the official Services Australia formula.',
        totalTime: 'PT2M',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Enter Incomes',
            text: 'Enter your adjusted taxable income and the other parent\'s income in the Income section.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Add Children',
            text: 'Add each child and enter how many nights per fortnight each parent has care.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Calculate',
            text: 'Click Calculate to see your estimated child support payment based on the 2026 formula.',
          },
        ],
      },
    ],
  };

  return (
    <>
      <PageSEO
        title="Child Support Calculator Australia 2026 | Free & Accurate"
        description="Official 2026 Services Australia formula. Calculate child support payments instantly. Supports 50/50 shared care and split care."
        canonicalPath="/"
        schema={pageSchema}
      />

      <CalculatorScreen />
    </>
  );
}
