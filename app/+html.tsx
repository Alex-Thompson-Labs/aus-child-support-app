import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// GLOBAL SCHEMA: Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AusChildSupport',
  url: 'https://auschildsupport.com',
  logo: 'https://auschildsupport.com/favicon-rounded-white-bg.png',
};

// GLOBAL SCHEMA: SoftwareApplication
const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Child Support Calculator Australia',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
  // Note: aggregateRating removed - Google requires real, verified ratings
  // Add back only when you have actual user reviews to reference
};

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en-AU">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* FALLBACK METADATA */}
        <title>Child Support Calculator Australia 2026 | Free & Accurate</title>
        <meta
          name="description"
          content="Official 2026 Services Australia formula. Calculate child support payments instantly."
        />

        {/* GLOBAL SOCIAL (STATIC) */}
        <meta property="og:site_name" content="AusChildSupport" />
        <meta
          property="og:image"
          content="https://auschildsupport.com/share-preview.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Child Support Calculator Australia - Free calculator using official Services Australia 2026 formula"
        />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-rounded-white-bg.png?v=4"
        />

        {/* Apple Touch Icon (iOS home screen) */}
        <link rel="apple-touch-icon" href="/favicon-rounded-white-bg.png?v=4" />

        {/* Android home screen icon */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon-rounded-white-bg.png?v=4"
        />

        {/* CRITICAL: Preload hero logo for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="/assets/images/webp/aus-child-support-logo-header-transparent.webp"
          type="image/webp"
        />

        {/* CRITICAL CSS: Inline styles for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Base styles for immediate render */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-color: #ffffff;
                color: #1f2937;
                line-height: 1.5;
              }
              
              /* Header styles - critical for LCP */
              [role="banner"], header {
                padding: 12px 16px;
                border-bottom: 1px solid #f1f5f9;
                background-color: #ffffff;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              /* Main content container - prevent layout shift */
              [role="main"], main {
                flex: 1;
                padding: 16px;
                max-width: 850px;
                margin: 0 auto;
                width: 100%;
                min-height: 400px;
              }
              
              /* Logo - reserve space to prevent CLS */
              img[alt*="Calculator"], img[alt*="Logo"] {
                height: 52px;
                width: 286px;
                max-width: 100%;
                object-fit: contain;
              }
              
              /* Form inputs - quick render */
              input, select, textarea, button {
                font-family: inherit;
                font-size: 16px;
                line-height: 1.5;
              }
              
              /* Loading state - prevent white flash */
              #root, #__next, body > div:first-child {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
            `,
          }}
        />

        {/* GLOBAL SCHEMA INJECTION */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(softwareApplicationSchema)}
        </script>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
