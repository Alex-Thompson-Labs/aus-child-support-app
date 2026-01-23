import Head from 'expo-router/head';
import React from 'react';
import { Platform } from 'react-native';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageSEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  schema?: Record<string, any>;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  canonicalPath,
  schema,
  breadcrumbs,
}) => {
  const BASE_URL = 'https://auschildsupport.com.au';
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

  // Build breadcrumb schema if provided
  const breadcrumbSchema = breadcrumbs ? {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.path && { item: `${BASE_URL}${crumb.path}` }),
    })),
  } : null;

  // Combine schemas into @graph structure
  const finalSchema = (() => {
    const schemas = [];
    
    // Add breadcrumb schema first if present
    if (breadcrumbSchema) {
      schemas.push(breadcrumbSchema);
    }
    
    // Add custom schema
    if (schema) {
      if (schema['@graph']) {
        // Schema already has @graph, merge it
        schemas.push(...schema['@graph']);
      } else {
        // Single schema object
        schemas.push(schema);
      }
    } else {
      // Use default schema
      schemas.push(defaultSchema);
    }
    
    return {
      '@context': 'https://schema.org',
      '@graph': schemas,
    };
  })();

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/share-preview.jpg`} />

      <link rel="canonical" href={fullUrl} />
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Head>
  );
};
