/**
 * AssessmentPDFDocument Component
 *
 * Professional PDF document for child support assessment estimates.
 * Uses @react-pdf/renderer primitives for A4 layout.
 *
 * Usage:
 * - Web: Use with PDFDownloadLink or pdf().toBlob()
 * - Mobile: Generate blob and use expo-sharing
 */

import type { CalculationResults } from '@/src/utils/calculator';
import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';

// Register fonts for professional appearance
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
      fontWeight: 700,
    },
  ],
});

// A4 dimensions: 595.28 x 841.89 points
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIconText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 700,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1e3a8a',
  },
  brandTagline: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0f172a',
  },
  documentDate: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  // Hero section
  heroSection: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtext: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.9,
  },
  heroSecondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  heroSecondaryItem: {
    alignItems: 'center',
  },
  heroSecondaryValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#ffffff',
  },
  heroSecondaryLabel: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.8,
  },

  // Summary table
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 12,
    marginTop: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontSize: 9,
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    color: '#334155',
  },
  tableCellBold: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    fontWeight: 600,
    color: '#0f172a',
  },
  tableCellRight: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    color: '#334155',
    textAlign: 'right',
  },
  tableCellRightBold: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    fontWeight: 600,
    color: '#0f172a',
    textAlign: 'right',
  },
  // Care arrangement
  careTable: {
    marginTop: 8,
  },
  careRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  careLabel: {
    flex: 2,
    fontSize: 10,
    color: '#334155',
  },
  careValue: {
    flex: 1,
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'right',
  },
  // Summary box
  summaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 10,
    color: '#334155',
  },
  summaryLabelBold: {
    fontSize: 11,
    fontWeight: 600,
    color: '#0f172a',
  },
  summaryValueBold: {
    fontSize: 11,
    fontWeight: 600,
    color: '#2563eb',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
  },
  footerDivider: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginBottom: 12,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  disclaimer: {
    flex: 1,
    paddingRight: 20,
  },
  disclaimerTitle: {
    fontSize: 8,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 7,
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 600,
    color: '#2563eb',
  },
  footerUrl: {
    fontSize: 7,
    color: '#64748b',
    marginTop: 2,
  },
  pageNumber: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 4,
  },
});

// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getPayerText(payer: string): string {
  if (payer === 'Parent A') return 'You pay';
  if (payer === 'Parent B') return 'Other parent pays';
  if (payer === 'Neither') return 'No payment required';
  return payer;
}

export interface AssessmentPDFProps {
  results: CalculationResults;
  supportA?: boolean;
  supportB?: boolean;
  generatedDate?: Date;
}

export function AssessmentPDFDocument({
  results,
  supportA = false,
  supportB = false,
  generatedDate = new Date(),
}: AssessmentPDFProps) {
  const monthlyAmount = results.finalPaymentAmount / 12;
  const fortnightlyAmount = results.finalPaymentAmount / 26;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>A</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Aus Child Support Calculator</Text>
              <Text style={styles.brandTagline}>Services Australia 8-Step Formula</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.documentTitle}>Assessment Estimate</Text>
            <Text style={styles.documentDate}>Generated {formatDate(generatedDate)}</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLabel}>{getPayerText(results.payer)}</Text>
          <Text style={styles.heroAmount}>{formatCurrency(results.finalPaymentAmount)}</Text>
          <Text style={styles.heroSubtext}>per year</Text>
          <View style={styles.heroSecondaryRow}>
            <View style={styles.heroSecondaryItem}>
              <Text style={styles.heroSecondaryValue}>{formatCurrency(monthlyAmount)}</Text>
              <Text style={styles.heroSecondaryLabel}>per month</Text>
            </View>
            <View style={styles.heroSecondaryItem}>
              <Text style={styles.heroSecondaryValue}>{formatCurrency(fortnightlyAmount)}</Text>
              <Text style={styles.heroSecondaryLabel}>per fortnight</Text>
            </View>
          </View>
        </View>

        {/* Income Summary */}
        <Text style={styles.sectionTitle}>Income Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Description</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>You (Parent A)</Text>
            <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Other Parent (B)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Adjusted Taxable Income</Text>
            <Text style={styles.tableCellRight}>{formatCurrency(results.ATI_A)}</Text>
            <Text style={styles.tableCellRight}>{formatCurrency(results.ATI_B)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Child Support Income</Text>
            <Text style={styles.tableCellRight}>{formatCurrency(results.CSI_A)}</Text>
            <Text style={styles.tableCellRight}>{formatCurrency(results.CSI_B)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Income Percentage</Text>
            <Text style={styles.tableCellRight}>{results.incomePercA.toFixed(1)}%</Text>
            <Text style={styles.tableCellRight}>{results.incomePercB.toFixed(1)}%</Text>
          </View>
          {(supportA || supportB) && (
            <View style={styles.tableRowLast}>
              <Text style={styles.tableCell}>Income Support</Text>
              <Text style={styles.tableCellRight}>{supportA ? 'Yes' : 'No'}</Text>
              <Text style={styles.tableCellRight}>{supportB ? 'Yes' : 'No'}</Text>
            </View>
          )}
        </View>

        {/* Care Arrangement */}
        {results.childResults.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Care Arrangement</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Child</Text>
                <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Your Care %</Text>
                <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Other Parent %</Text>
                <Text style={[styles.tableHeaderCell, { textAlign: 'right' }]}>Cost Share</Text>
              </View>
              {results.childResults.map((child, index) => (
                <View
                  key={index}
                  style={index === results.childResults.length - 1 ? styles.tableRowLast : styles.tableRow}
                >
                  <Text style={styles.tableCell}>
                    Child {index + 1} (Age {child.age})
                  </Text>
                  <Text style={styles.tableCellRight}>{child.roundedCareA}%</Text>
                  <Text style={styles.tableCellRight}>{child.roundedCareB}%</Text>
                  <Text style={styles.tableCellRight}>{formatCurrency(child.costPerChild)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Calculation Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Combined Child Support Income</Text>
            <Text style={styles.summaryValue}>{formatCurrency(results.CCSI)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost of Children</Text>
            <Text style={styles.summaryValue}>{formatCurrency(results.totalCost)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Self-Support Amount (each parent)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(results.SSA)}</Text>
          </View>
          {results.rateApplied !== 'None' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate Applied</Text>
              <Text style={styles.summaryValue}>{results.rateApplied}</Text>
            </View>
          )}
          <View style={styles.summaryRowLast}>
            <Text style={styles.summaryLabelBold}>Annual Child Support Liability</Text>
            <Text style={styles.summaryValueBold}>{formatCurrency(results.finalPaymentAmount)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerDivider} />
          <View style={styles.footerContent}>
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>GENERAL INFORMATION ONLY</Text>
              <Text style={styles.disclaimerText}>
                This estimate is for general information purposes only and does not constitute legal or financial advice.
                The calculation is based on the Services Australia 8-step formula and may not reflect your actual
                assessment. For accurate assessments, contact Services Australia or consult a family law professional.
              </Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerBrand}>Aus Child Support Calculator</Text>
              <Text style={styles.footerUrl}>auschildsupport.com</Text>
              <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Page ${pageNumber} of ${totalPages}`}
              />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
