import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// GLOBAL SCHEMA: Organization (only - pages control their own schemas)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AusChildSupport',
  url: 'https://auschildsupport.com.au',
  logo: 'https://auschildsupport.com.au/favicon-rounded-white-bg.webp',
  areaServed: {
    '@type': 'Country',
    name: 'Australia',
  },
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

        {/* GLOBAL SOCIAL (STATIC) */}
        <meta property="og:site_name" content="AusChildSupport" />

        {/* Resource Hints - Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://swcbcudasyiqhtkymcpy.supabase.co" />
        <link rel="dns-prefetch" href="https://swcbcudasyiqhtkymcpy.supabase.co" />
        
        {/* Preload critical JavaScript bundles */}
        <link 
          rel="modulepreload" 
          href="/_expo/static/js/web/__common-*.js"
          // @ts-ignore - Web-only fetchpriority attribute
          fetchPriority="high"
        />

        {/* Preload critical assets for LCP optimization */}
        <link 
          rel="preload" 
          as="image" 
          href="/main-page-logo.webp" 
          type="image/webp"
          // @ts-ignore - Web-only fetchpriority attribute
          fetchPriority="high"
        />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/webp"
          href="/favicon-rounded-white-bg.webp?v=5"
        />

        {/* Apple Touch Icon (iOS home screen) */}
        <link rel="apple-touch-icon" href="/favicon-rounded-white-bg.webp?v=5" />

        {/* Android home screen icon */}
        <link
          rel="icon"
          type="image/webp"
          sizes="192x192"
          href="/favicon-rounded-white-bg.webp?v=5"
        />

        {/* CRITICAL CSS: Inline styles for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* CRITICAL: Prevent black flash */
              html {
                background-color: #ffffff;
              }
              
              /* Base styles for immediate render */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              
              /* Font display optimization */
              @font-face {
                font-family: system-ui;
                font-display: swap;
              }
              
              /* Icon fonts from @expo/vector-icons - apply font-display: swap */
              @font-face {
                font-family: 'Feather';
                font-display: swap;
              }
              
              @font-face {
                font-family: 'Ionicons';
                font-display: swap;
              }
              
              @font-face {
                font-family: 'MaterialIcons';
                font-display: swap;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-color: #ffffff;
                color: #1f2937;
                line-height: 1.5;
                font-display: swap;
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
                width: 100%;
                min-height: 400px;
              }
              
              /* ScrollView content centering for React Native Web */
              [role="main"] > div {
                display: flex;
                justify-content: center;
                width: 100%;
              }
              
              [role="main"] > div > div {
                max-width: 850px;
                width: 100%;
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
                align-items: center;
                width: 100%;
              }
              
              /* Center all direct children of root */
              #root > * {
                width: 100%;
                max-width: 100%;
              }
              
              /* Reduce layout shift for cards */
              .card-skeleton {
                min-height: 200px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
                border-radius: 12px;
              }
              
              @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `,
          }}
        />

        {/* GLOBAL SCHEMA INJECTION - Organization only, pages control their own schemas */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
