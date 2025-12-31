// Learn more https://docs.expo.dev/router/reference/static-rendering/#root-html
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  // Note: We don't need gaMeasurementId here anymore, it's handled in _layout.tsx
  const siteUrl =
    process.env.EXPO_PUBLIC_SITE_URL || 'https://auschildsupport.com';

  // SEO Content Strategy: "Problem Aware"
  const siteTitle =
    'Child Support Calculator Australia 2025 | Services Australia Formula';
  const siteDescription =
    'Accurate Child Support Calculator for Australia (2025-2026). Estimate payments instantly using the official Services Australia formula. Supports 50/50 care, split care, and multiple family assessments. Free & anonymous.';
  const shareImage = `${siteUrl}/share-preview.png`;

  return (
    <html lang="en-AU">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Viewport: interactive-widget handles mobile keyboards better for calculators */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, interactive-widget=resizes-content"
        />

        {/* Performance: Preconnect to Google Analytics (This is GOOD, keep it!) */}
        {/* This speeds up the connection for when _layout.tsx eventually loads the script */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Performance: DNS prefetch for Supabase (form submission) */}
        <link
          rel="dns-prefetch"
          href="https://swcbcudasyiqhtkymcpy.supabase.co"
        />

        {/* Critical CSS: Above-the-fold styles to prevent FOUC and improve FCP/LCP */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html, body, #root {
              margin: 0;
              padding: 0;
              min-height: 100%;
              background-color: #ffffff;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              color: #0f172a;
            }
            /* Critical header styles for LCP element */
            .calculator-header {
              padding: 12px 16px;
              border-bottom: 1px solid #f1f5f9;
              background: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .calculator-title {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              text-align: center;
            }
          `,
          }}
        />

        {/* Primary Meta Tags */}
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta
          name="keywords"
          content="child support calculator australia, services australia formula, family tax benefit estimator, dhs child support calculator, 50/50 custody child support, csa calculator, family law lead magnet, child support estimator 2025"
        />
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

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:locale" content="en_AU" />
        <meta
          property="og:site_name"
          content="Child Support Calculator Australia"
        />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Australian Child Support Calculator Preview"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={shareImage} />

        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* JSON-LD: Software Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Child Support Calculator Australia',
              url: siteUrl,
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'AUD',
              },
              description: siteDescription,
              featureList: [
                'Services Australia Formula 2025',
                'Shared Care Percentage Calculator',
                'Cost of Children Table Lookup',
                'Multiple Family Support',
              ],
              inLanguage: 'en-AU',
              audience: {
                '@type': 'Audience',
                audienceType: 'Parents',
                geographicArea: {
                  '@type': 'Country',
                  name: 'Australia',
                },
              },
              author: {
                '@type': 'Organization',
                name: 'AusChildSupport',
                url: siteUrl,
              },
            }),
          }}
        />

        {/* JSON-LD: FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How is child support calculated in Australia for 2025?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: "The 2025 calculation uses the Services Australia 8-step formula. It accounts for both parents' adjusted taxable incomes, the percentage of care (nights per fortnight), and the cost of children table based on the combined income pool.",
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does 50/50 care mean no child support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Not necessarily. Even with 50/50 shared care, the higher-earning parent often pays child support to the lower-earning parent to balance the costs of raising the child across both households.',
                  },
                },
              ],
            }),
          }}
        />

        <ScrollViewStyleReset />

        {/* REMOVED: The manual Google Analytics script tags. 
            Reason: These are now handled in app/_layout.tsx to prevent duplication. 
        */}
      </head>
      <body>{children}</body>
    </html>
  );
}
