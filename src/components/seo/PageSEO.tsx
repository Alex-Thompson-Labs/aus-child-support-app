import Head from 'expo-router/head';
import React from 'react';
import { Platform } from 'react-native';

interface PageSEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  schema?: Record<string, any>;
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  canonicalPath,
  schema
}) => {
  const BASE_URL = 'https://auschildsupport.com';
  const fullUrl = `${BASE_URL}${canonicalPath}`;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Child Support Calculator Australia",
    "url": BASE_URL,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD"
    }
  };

  const finalSchema = schema ? { ...defaultSchema, ...schema } : defaultSchema;

  if (Platform.OS !== 'web') return null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter/X - also used by Slack, Discord, LinkedIn, iMessage, etc */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/share-preview.png`} />

      <link rel="canonical" href={fullUrl} />
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Head>
  );
};