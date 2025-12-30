// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = process.env.EXPO_PUBLIC_GA_MEASUREMENT_ID || "G-53139BKGD7";
  const siteUrl = process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';

  // SEO Content Strategy: "Problem Aware"
  // Captures users in the "Research" phase before they seek legal counsel.
  const siteTitle = 'Child Support Calculator Australia 2025 | Services Australia Formula';
  const siteDescription = 'Accurate Child Support Calculator for Australia (2025-2026). Estimate payments instantly using the official Services Australia formula. Supports 50/50 care, split care, and multiple family assessments. Free & anonymous.';
  const shareImage = `${siteUrl}/share-preview.png`; // Ensure this image exists in your public folder

  return (
    <html lang="en-AU">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Viewport: interactive-widget handles mobile keyboards better for calculators */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, interactive-widget=resizes-content" />

        {/* Performance: Preconnect to Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Primary Meta Tags */}
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content="child support calculator australia, services australia formula, family tax benefit estimator, dhs child support calculator, 50/50 custody child support, csa calculator, family law lead magnet, child support estimator 2025" />
        <meta name="author" content="AusChildSupport" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="7 days" />

        {/* Geo Tags - Critical for Local AU SEO */}
        <meta name="geo.region" content="AU" />
        <meta name="geo.placename" content="Australia" />

        {/* Mobile App Capabilities */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CS Calculator" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Open Graph / Facebook (Uses underscores for locale) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:locale" content="en_AU" />
        <meta property="og:site_name" content="Child Support Calculator Australia" />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Australian Child Support Calculator Preview" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={shareImage} />

        {/* Canonical URL - Important: If you add sub-pages later, move this to the specific page Layouts */}
        <link rel="canonical" href={siteUrl} />

        {/* JSON-LD: Software Application Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Child Support Calculator Australia",
            "url": siteUrl,
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "AUD"
            },
            "description": siteDescription,
            "featureList": [
              "Services Australia Formula 2025",
              "Shared Care Percentage Calculator",
              "Cost of Children Table Lookup",
              "Multiple Family Support"
            ],
            "inLanguage": "en-AU",
            "audience": {
              "@type": "Audience",
              "audienceType": "Parents",
              "geographicArea": {
                "@type": "Country",
                "name": "Australia"
              }
            },
            "author": {
              "@type": "Organization",
              "name": "AusChildSupport",
              "url": siteUrl
            }
          })
        }} />

        {/* JSON-LD: FAQ Schema (Great for 'People Also Ask' snippets) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How is child support calculated in Australia for 2025?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 2025 calculation uses the Services Australia 8-step formula. It accounts for both parents' adjusted taxable incomes, the percentage of care (nights per fortnight), and the cost of children table based on the combined income pool."
                }
              },
              {
                "@type": "Question",
                "name": "Does 50/50 care mean no child support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not necessarily. Even with 50/50 shared care, the higher-earning parent often pays child support to the lower-earning parent to balance the costs of raising the child across both households."
                }
              }
            ]
          })
        }} />

        <ScrollViewStyleReset />

        {/* Google Analytics */}
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
                  gtag('config', '${gaMeasurementId}', { 
                    'anonymize_ip': true,
                    'send_page_view': true 
                  });
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