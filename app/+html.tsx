// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html

import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || "G-53139BKGD7";
  // SEO Configuration - Utility-First Strategy
  // Focus: High-volume calculation & formula queries, not lawyer keywords
  const siteTitle = 'Child Support Calculator Australia | Free CS Calculator 2024';
  const siteDescription = 'Free child support calculator using the official Services Australia formula. Calculate payments instantly based on income, care percentage, and number of children. Accurate results for shared care, split care, and multiple families. Updated for 2024-2025 financial year.';
  const siteUrl = process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';
  const siteKeywords = 'child support calculator Australia, child support formula, how to calculate child support, child support payment calculator, Services Australia child support, child support formula Australia, child support rates 2024, shared care calculator, child support estimator, calculate child support payments, child support amount calculator, Australian child support calculation';
  return (
    <html lang="en_AU">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary Meta Tags */}
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="author" content="Child Support Calculator" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* Geo Tags */}
        <meta name="geo.region" content="AU" />
        <meta name="geo.placename" content="Australia" />

        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:locale" content="en_AU" />
        <meta property="og:site_name" content="Child Support Calculator" />

        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={siteTitle} />
        <meta property="twitter:description" content={siteDescription} />

        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* Structured Data - Calculator Tool */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Child Support Calculator Australia",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "AUD"
            },
            "description": "Free online calculator for Australian child support payments using the official Services Australia formula",
            "featureList": [
              "Calculate child support payments",
              "Shared care calculations",
              "Split care arrangements",
              "Multiple families support",
              "Income assessment",
              "Care percentage calculator"
            ],
            "inLanguage": "en-AU",
            "isAccessibleForFree": true,
            "audience": {
              "@type": "Audience",
              "geographicArea": {
                "@type": "Country",
                "name": "Australia"
              }
            }
          })
        }} />

        {/* FAQ Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I calculate child support in Australia?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Child support in Australia is calculated using the Services Australia formula based on parents' combined income, number of children, care percentage, and costs of children. Our free calculator provides instant accurate estimates."
                }
              },
              {
                "@type": "Question",
                "name": "What is the child support formula?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Australian child support formula considers: 1) Parents' combined child support income, 2) Cost of children based on number and age, 3) Care percentage for each parent, 4) Income percentage of each parent, 5) Self-support amount deductions."
                }
              },
              {
                "@type": "Question",
                "name": "How much child support will I pay with 50/50 care?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "With 50/50 shared care, the parent with higher income typically pays child support to the other parent. The amount depends on the income difference and number of children. Use our calculator for your specific situation."
                }
              }
            ]
          })
        }} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Google Analytics - Web only */}
        {gaMeasurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', { 'anonymize_ip': true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
