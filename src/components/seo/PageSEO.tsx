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
  schema,
}) => {
  const BASE_URL = 'https://auschildsupport.com';
  const fullUrl = `${BASE_URL}${canonicalPath}`;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Child Support Calculator Australia',
    url: BASE_URL,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
    },
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
      <meta property="og:image" content={`${BASE_URL}/share-preview.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Child Support Calculator Australia - Free calculator using official Services Australia 2026 formula"
      />

      {/* Twitter/X - also used by Slack, Discord, LinkedIn, iMessage, etc */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/share-preview.jpg`} />

      <link rel="canonical" href={fullUrl} />
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Head>
  );
};
