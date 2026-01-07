import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// GLOBAL SCHEMA: Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AusChildSupport',
  url: 'https://auschildsupport.com',
  logo: 'https://auschildsupport.com/logo.png',
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
          content="https://auschildsupport.com/share-preview.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/assets/source_images/favicon-rounded-white-bg.png?v=4" />

        {/* Apple Touch Icon (iOS home screen) */}
        <link rel="apple-touch-icon" href="/assets/source_images/favicon-rounded-white-bg.png?v=4" />

        {/* Android home screen icon */}
        <link rel="icon" type="image/png" sizes="192x192" href="/assets/source_images/favicon-rounded-white-bg.png?v=4" />

        {/* GLOBAL SCHEMA INJECTION */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
