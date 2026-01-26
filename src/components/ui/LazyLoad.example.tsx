/**
 * LazyLoad Component - Usage Examples
 * 
 * This file demonstrates how to use the LazyLoad component for code splitting
 * and lazy loading heavy dependencies.
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LazyLoad } from './LazyLoad';

// ============================================================================
// Example 1: Basic Lazy Loading
// ============================================================================

/**
 * Lazy load a PDF export button that includes heavy dependencies
 * (@react-pdf/renderer, expo-print, expo-sharing)
 */
export function Example1_BasicLazyLoading() {
  const [showPDF, setShowPDF] = React.useState(false);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setShowPDF(true)}>
        <Text>Export PDF</Text>
      </TouchableOpacity>
      
      {showPDF && (
        <LazyLoad
          loader={() => import('../features/calculator/components/results/PDFExportButton')}
          componentProps={{
            assessment: {
              /* assessment data */
            },
          }}
        />
      )}
    </View>
  );
}

// ============================================================================
// Example 2: Custom Loading Fallback
// ============================================================================

/**
 * Use a custom loading indicator instead of the default LoadingFallback
 */
export function Example2_CustomLoadingFallback() {
  const CustomLoader = () => (
    <View style={{ padding: 20 }}>
      <Text>Loading PDF export...</Text>
    </View>
  );
  
  return (
    <LazyLoad
      loader={() => import('../features/calculator/components/results/PDFExportButton')}
      componentProps={{ assessment: {} }}
      fallback={<CustomLoader />}
    />
  );
}

// ============================================================================
// Example 3: Custom Error Fallback
// ============================================================================

/**
 * Provide a custom error UI when lazy loading fails
 */
export function Example3_CustomErrorFallback() {
  const CustomError = () => (
    <View style={{ padding: 20 }}>
      <Text>Failed to load PDF export feature</Text>
      <Text>Please check your internet connection</Text>
    </View>
  );
  
  return (
    <LazyLoad
      loader={() => import('../features/calculator/components/results/PDFExportButton')}
      componentProps={{ assessment: {} }}
      errorFallback={<CustomError />}
    />
  );
}

// ============================================================================
// Example 4: Lazy Loading Supabase Client
// ============================================================================

/**
 * Lazy load Supabase client only when admin features are accessed
 */
export function Example4_LazyLoadSupabase() {
  const [showAdmin, setShowAdmin] = React.useState(false);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setShowAdmin(true)}>
        <Text>Open Admin Dashboard</Text>
      </TouchableOpacity>
      
      {showAdmin && (
        <LazyLoad
          loader={() => import('../pages/admin/AdminDashboardScreen')}
          componentProps={{}}
        />
      )}
    </View>
  );
}

// ============================================================================
// Example 5: Type-Safe Props with Generics
// ============================================================================

/**
 * LazyLoad automatically infers component prop types for type safety
 */
interface MyComponentProps {
  title: string;
  count: number;
  onPress: () => void;
}

export function Example5_TypeSafeProps() {
  return (
    <LazyLoad
      loader={() => import('./MyComponent')}
      componentProps={{
        title: 'Hello',
        count: 42,
        onPress: () => console.log('Pressed'),
        // TypeScript will error if you pass wrong types or missing props
      }}
    />
  );
}

// ============================================================================
// Example 6: Conditional Lazy Loading
// ============================================================================

/**
 * Only load heavy features when certain conditions are met
 */
export function Example6_ConditionalLazyLoading({ hasComplexCase }: { hasComplexCase: boolean }) {
  // Only load the complexity analysis component for complex cases
  if (!hasComplexCase) {
    return <Text>Simple case - no additional analysis needed</Text>;
  }
  
  return (
    <LazyLoad
      loader={() => import('../features/calculator/components/ComplexityAnalysis')}
      componentProps={{
        caseData: {
          /* complex case data */
        },
      }}
    />
  );
}

// ============================================================================
// Example 7: Multiple Lazy Loaded Components
// ============================================================================

/**
 * Lazy load multiple components independently
 */
export function Example7_MultipleLazyComponents() {
  const [activeTab, setActiveTab] = React.useState<'pdf' | 'admin' | null>(null);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setActiveTab('pdf')}>
        <Text>PDF Export</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setActiveTab('admin')}>
        <Text>Admin Dashboard</Text>
      </TouchableOpacity>
      
      {activeTab === 'pdf' && (
        <LazyLoad
          loader={() => import('../features/calculator/components/results/PDFExportButton')}
          componentProps={{ assessment: {} }}
        />
      )}
      
      {activeTab === 'admin' && (
        <LazyLoad
          loader={() => import('../pages/admin/AdminDashboardScreen')}
          componentProps={{}}
        />
      )}
    </View>
  );
}
