import React from 'react';
import { PageSEO } from '../../src/components/seo/PageSEO';
import { CalculatorScreen } from '../../src/screens/CalculatorScreen'; // Adjust if your import differs

export default function HomeScreen() {
  // PAGE SCHEMA: FAQ + SoftwareApp
  const faqSchema = {
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
  };

  return (
    <>
      <PageSEO
        title="Child Support Calculator Australia 2026 | Free & Accurate"
        description="Official 2026 Services Australia formula. Calculate child support payments instantly. Supports 50/50 shared care and split care."
        canonicalPath="/"
        schema={faqSchema}
      />

      <CalculatorScreen />
    </>
  );
}
