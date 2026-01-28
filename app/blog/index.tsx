import { PageSEO } from '@/src/components/seo/PageSEO';
import { CalculatorHeader } from '@/src/features/calculator';
import { MAX_CALCULATOR_WIDTH, isWeb, webClickableStyles } from '@/src/utils/responsive';
import { createShadow } from '@/src/utils/shadow-styles';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Blog post data - add new posts here
const BLOG_POSTS = [
    {
        slug: 'child-support-arrears-australia',
        title: 'Child Support Arrears Australia: What Happens If You Don\'t Pay',
        excerpt: 'Behind on child support? Learn what enforcement actions Services Australia can take, how arrears accumulate, and your options to resolve debt before serious consequences.',
        category: 'Arrears & Debt',
        date: '2026-01-24',
        readTime: '13 min read',
    },
    {
        slug: 'child-support-after-18',
        title: 'Child Support After 18 in Australia: When Does It Stop?',
        excerpt: 'Child turning 18? Learn when child support ends, what happens if they\'re still in school, university exceptions, and how to handle the transition.',
        category: 'Age Transitions',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'new-partner-income-child-support',
        title: 'New Partner Income & Child Support: Does It Affect Your Assessment?',
        excerpt: 'Remarried or living with a new partner? Learn how their income affects child support, when Change of Assessment applies, and how to protect your assessment.',
        category: 'New Relationships',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'binding-child-support-agreement',
        title: 'Binding Child Support Agreement Australia: Complete Guide (2026)',
        excerpt: 'Considering a Binding Child Support Agreement? Learn how they work, legal requirements, risks, and when to use them instead of the standard formula.',
        category: 'Agreements',
        date: '2026-01-24',
        readTime: '13 min read',
    },
    {
        slug: 'lump-sum-child-support-payment',
        title: 'Lump Sum Child Support Payment Australia: How It Works (2026)',
        excerpt: 'Considering a lump sum child support payment? Learn how to calculate it, legal requirements, tax implications, and risks before making this permanent decision.',
        category: 'Payment Options',
        date: '2026-01-24',
        readTime: '13 min read',
    },
    {
        slug: 'backdating-child-support-australia',
        title: 'Backdating Child Support Australia: How Far Back Can You Claim?',
        excerpt: 'Can child support be backdated? Learn the 18-month rule, how to apply, what evidence you need, and how backdated payments are collected.',
        category: 'Backdating',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'child-support-overpayment-refund',
        title: 'Child Support Overpayment Refund Australia: How to Get Your Money Back',
        excerpt: 'Overpaid child support? Learn how to claim a refund, what evidence you need, and when Services Australia will recover overpayments from the receiving parent.',
        category: 'Overpayments',
        date: '2026-01-24',
        readTime: '11 min read',
    },
    {
        slug: 'shared-care-5050-child-support',
        title: 'Shared Care 50/50 Child Support: Do You Still Pay?',
        excerpt: 'Have 50/50 care but still paying child support? Learn how shared care affects payments, when you pay $0, and how income differences matter.',
        category: 'Shared Care',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'child-support-reduction-strategies',
        title: 'Child Support Reduction Strategies Australia: Legal Ways to Lower Payments',
        excerpt: 'Want to reduce child support legally? Learn 7 legitimate strategies including Change of Assessment, increased care, and income management.',
        category: 'Reduction Strategies',
        date: '2026-01-24',
        readTime: '11 min read',
    },
    {
        slug: 'child-support-centrelink-income-support',
        title: 'Child Support on Centrelink Income Support: Complete Guide',
        excerpt: 'Receiving Centrelink payments? Learn how income support affects child support, minimum payments, and what happens when you return to work.',
        category: 'Centrelink',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'court-order-child-support-calculator',
        title: 'Court Order Child Support Calculator: How to Read Your Court Order (Free Tool)',
        excerpt: 'Have a court order for child support? Learn how to read it, when it expires, and how to use a calculator to understand what happens next. Free tool included.',
        category: 'Court Orders',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'accurate-child-support-calculator',
        title: 'Accurate Child Support Calculator Australia: Estimate Your Payments (2026)',
        excerpt: 'Free calculator using the official 2026 formula. Get instant, accurate estimates in under 5 minutes. Learn what makes calculators accurate and when to get legal advice.',
        category: 'Calculator Guide',
        date: '2026-01-24',
        readTime: '11 min read',
    },
    {
        slug: 'when-to-hire-family-lawyer',
        title: 'When to Hire a Family Lawyer for Child Support: 3 Key Signs',
        excerpt: 'Learn the 3 critical signs you need a family lawyer for child support. Understand when DIY is risky, what lawyers cost, and how to find the right representation.',
        category: 'Legal Advice',
        date: '2026-01-24',
        readTime: '13 min read',
    },
    {
        slug: 'child-support-vs-spousal-maintenance',
        title: 'Child Support vs Spousal Maintenance Australia: Key Differences',
        excerpt: 'Child support is mandatory and formula-based. Spousal maintenance is discretionary and court-ordered. Learn the key differences, how they work together, and when each applies.',
        category: 'Legal Advice',
        date: '2026-01-28',
        readTime: '14 min read',
    },
    {
        slug: 'child-support-self-employed',
        title: 'Child Support for Self-Employed Parents: How Business Income is Assessed',
        excerpt: 'Self-employed? Learn how Services Australia assesses business income, what expenses get added back, and when you need legal advice to protect your interests.',
        category: 'Self-Employment',
        date: '2026-01-24',
        readTime: '14 min read',
    },
    {
        slug: 'how-to-calculate-child-support',
        title: 'How to Calculate Child Support in Australia: The 2026 Guide',
        excerpt: 'Step-by-step guide to calculating child support in Australia. Learn what information you need, how the formula works, and use our free calculator for instant results.',
        category: 'Calculator Guide',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'child-support-formula-australia',
        title: 'Child Support Formula Australia: How Income & Care Work',
        excerpt: 'Complete guide to the Australian child support formula. Learn the 8-step calculation, how income and care percentages affect payments, with real examples.',
        category: 'Child Support',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'complicated-child-support-situations',
        title: 'Complicated Child Support in Australia: 8 Situations That Need Legal Advice',
        excerpt: 'Self-employed? Trusts? Overseas income? Learn when child support gets too complicated for DIY and why legal advice protects your financial interests.',
        category: 'Legal Advice',
        date: '2026-01-24',
        readTime: '15 min read',
    },
    {
        slug: 'child-support-care-percentage-table',
        title: 'Official Child Support Care Percentage Table (2026)',
        excerpt: 'Complete care percentage table showing how nights per year convert to child support percentages. Includes thresholds, examples, and how care affects payments.',
        category: 'Child Support',
        date: '2026-01-24',
        readTime: '12 min read',
    },
    {
        slug: 'object-to-child-support-assessment',
        title: 'How to Object to a Child Support Assessment in Australia',
        excerpt: 'Received an unfair child support assessment? Learn how to object within 28 days, what evidence you need, and when to appeal to SSAT.',
        category: 'Child Support',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'international-child-support-australia',
        title: 'International Child Support Australia: When Your Ex Lives Overseas',
        excerpt: 'Ex lives overseas? Australian child support still applies. Learn about reciprocating jurisdictions, enforcement options, and what to do next.',
        category: 'Child Support',
        date: '2026-01-24',
        readTime: '8 min read',
    },
    {
        slug: 'adult-disabled-child-maintenance',
        title: 'Adult Disabled Child Maintenance: Complete Guide to Child Support Beyond 18',
        excerpt: 'Child support can continue indefinitely for adult children with disabilities. Learn eligibility criteria, application process, and how assessments work.',
        category: 'Disability Support',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'overseas-parent-child-support-enforcement',
        title: 'Overseas Parent Child Support Enforcement: Complete Guide for Australia',
        excerpt: 'Enforcing child support when a parent lives overseas. Learn about reciprocating jurisdictions, international treaties, and enforcement mechanisms.',
        category: 'International',
        date: '2026-01-24',
        readTime: '11 min read',
    },
    {
        slug: 'private-school-fees-child-support',
        title: 'Private School Fees and Child Support: Complete Guide for Australia',
        excerpt: 'Private school fees aren\'t automatically included in child support. Learn about Change of Assessment, Binding Agreements, and how to split education costs.',
        category: 'Education Costs',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'parental-leave-child-support',
        title: 'Parental Leave and Child Support: Complete Guide for Australia',
        excerpt: 'How parental leave affects child support. Learn about temporary assessment changes, Parental Leave Pay, returning to work, and planning ahead.',
        category: 'Parental Leave',
        date: '2026-01-24',
        readTime: '10 min read',
    },
    {
        slug: 'estimate-vs-actual-income-child-support',
        title: 'Estimate vs Actual Income for Child Support: Complete Guide Australia',
        excerpt: 'Understand the difference between estimated and actual income. Learn about reconciliation, overpayments, underpayments, and how to update your estimate.',
        category: 'Income Assessment',
        date: '2026-01-24',
        readTime: '11 min read',
    },
];

// Featured posts for complex situations
const FEATURED_SLUGS = [
    'complicated-child-support-situations',
    'when-to-hire-family-lawyer',
    'child-support-self-employed',
];

// All unique categories
const CATEGORIES = [
    'All Posts',
    'Legal Advice',
    'Calculator Guide',
    'Self-Employment',
    'Agreements',
    'Court Orders',
    'Income Assessment',
    'Arrears & Debt',
    'Shared Care',
];

export default function BlogIndexPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All Posts');

    const webContainerStyle = isWeb
        ? {
            maxWidth: MAX_CALCULATOR_WIDTH,
            width: '100%' as const,
            alignSelf: 'center' as const,
        }
        : {};

    // Filter posts by category
    const filteredPosts = useMemo(() => {
        if (selectedCategory === 'All Posts') {
            return BLOG_POSTS;
        }
        return BLOG_POSTS.filter(post => post.category === selectedCategory);
    }, [selectedCategory]);

    // Get featured posts
    const featuredPosts = useMemo(() => {
        return BLOG_POSTS.filter(post => FEATURED_SLUGS.includes(post.slug));
    }, []);

    return (
        <>
            <PageSEO
                title="Blog | AusChildSupport"
                description="Expert guides on Australian child support, international enforcement, Change of Assessment applications, and family law advice."
                canonicalPath="/blog"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Blog' },
                ]}
            />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <CalculatorHeader
                    title=""
                    showBackButton={true}
                    showCenterLogo={true}
                    maxWidth={MAX_CALCULATOR_WIDTH}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, webContainerStyle]}
                >
                    <Text
                        style={styles.pageTitle}
                        accessibilityRole="header"
                        // @ts-ignore
                        aria-level="1"
                    >
                        Child Support Guides & Resources
                    </Text>

                    <Text style={styles.introText}>
                        Expert advice on Australian child support calculations, international enforcement,
                        and when to seek legal help.
                    </Text>

                    {/* Featured Posts Section */}
                    <View style={styles.featuredSection}>
                        <Text style={styles.featuredTitle}>Complex Situation? Start Here:</Text>
                        <Text style={styles.featuredSubtitle}>
                            These guides help you understand when you need legal advice and what to expect.
                        </Text>
                        <View style={styles.featuredGrid}>
                            {featuredPosts.map((post) => (
                                <Pressable
                                    key={post.slug}
                                    style={[styles.featuredCard, isWeb && webClickableStyles]}
                                    onPress={() => router.push(`/blog/${post.slug}` as any)}
                                    accessibilityRole="button"
                                >
                                    <Text style={styles.featuredCategory}>{post.category}</Text>
                                    <Text style={styles.featuredCardTitle}>{post.title}</Text>
                                    <Text style={styles.featuredExcerpt} numberOfLines={2}>{post.excerpt}</Text>
                                    <Text style={styles.featuredReadMore}>Read guide →</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Category Filter */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterTitle}>Filter by Category:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterScrollContent}
                        >
                            {CATEGORIES.map((category) => (
                                <Pressable
                                    key={category}
                                    style={[
                                        styles.filterButton,
                                        selectedCategory === category && styles.filterButtonActive,
                                        isWeb && webClickableStyles,
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                    accessibilityRole="button"
                                >
                                    <Text style={[
                                        styles.filterButtonText,
                                        selectedCategory === category && styles.filterButtonTextActive,
                                    ]}>
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Results Count */}
                    <Text style={styles.resultsCount}>
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                        {selectedCategory !== 'All Posts' && ` in ${selectedCategory}`}
                    </Text>

                    {/* Blog Posts Grid */}
                    <View style={styles.postsGrid}>
                        {filteredPosts.map((post) => (
                            <Pressable
                                key={post.slug}
                                style={[styles.postCard, isWeb && webClickableStyles]}
                                onPress={() => router.push(`/blog/${post.slug}` as any)}
                                accessibilityRole="button"
                                accessibilityLabel={`Read article: ${post.title}`}
                            >
                                <View style={styles.postHeader}>
                                    <Text style={styles.postCategory}>{post.category}</Text>
                                    <Text style={styles.postDate}>{post.date}</Text>
                                </View>
                                <Text style={styles.postTitle}>{post.title}</Text>
                                <Text style={styles.postExcerpt}>{post.excerpt}</Text>
                                <View style={styles.postFooter}>
                                    <Text style={styles.readTime}>{post.readTime}</Text>
                                    <Text style={styles.readMore}>Read more →</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>

                    {/* Trust Signal Box */}
                    <View style={styles.trustSignalBox}>
                        <Text style={styles.trustSignalTitle}>💼 Free Legal Consultation Available</Text>
                        <Text style={styles.trustSignalText}>
                            Most family lawyers offer free initial consultations (15-30 minutes). Get expert advice
                            on complex child support situations with no obligation to proceed.
                        </Text>
                        <View style={styles.trustSignalFeatures}>
                            <Text style={styles.trustSignalFeature}>✓ Confidential discussion</Text>
                            <Text style={styles.trustSignalFeature}>✓ Clear fee structure explained</Text>
                            <Text style={styles.trustSignalFeature}>✓ Specialist family law advice</Text>
                        </View>
                    </View>

                    {/* CTA Section */}
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Need Help With Your Child Support?</Text>
                        <Text style={styles.ctaText}>
                            Use our free calculator or connect with experienced family lawyers.
                        </Text>
                        <View style={styles.ctaButtons}>
                            <Pressable
                                style={[styles.primaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.primaryButtonText}>Try Calculator</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.secondaryButton, isWeb && webClickableStyles]}
                                onPress={() => router.push('/lawyer-inquiry')}
                                accessibilityRole="button"
                            >
                                <Text style={styles.secondaryButtonText}>Get Legal Help</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 12,
        textAlign: 'center',
        ...(Platform.OS === 'web' ? { lineHeight: 40 } : {}),
    },
    introText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#475569',
        marginBottom: 24,
        textAlign: 'center',
    },
    postsGrid: {
        gap: 16,
    },
    postCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
        }),
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    postCategory: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    postDate: {
        fontSize: 12,
        color: '#64748b',
    },
    postTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 8,
        lineHeight: 28,
    },
    postExcerpt: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
        marginBottom: 16,
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    readTime: {
        fontSize: 13,
        color: '#64748b',
    },
    readMore: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },
    ctaSection: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 24,
        marginTop: 32,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 8,
        textAlign: 'center',
    },
    ctaText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        marginBottom: 20,
        textAlign: 'center',
    },
    ctaButtons: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        ...createShadow({
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
        }),
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: '#2563EB',
    },
    secondaryButtonText: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: '600',
    },

    // Featured Section
    featuredSection: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    featuredTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 6,
    },
    featuredSubtitle: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 16,
        lineHeight: 20,
    },
    featuredGrid: {
        gap: 12,
    },
    featuredCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        ...createShadow({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
        }),
    },
    featuredCategory: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563EB',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    featuredCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e3a8a',
        marginBottom: 6,
        lineHeight: 22,
    },
    featuredExcerpt: {
        fontSize: 13,
        lineHeight: 18,
        color: '#64748b',
        marginBottom: 8,
    },
    featuredReadMore: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },

    // Filter Section
    filterSection: {
        marginBottom: 20,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e3a8a',
        marginBottom: 12,
    },
    filterScrollContent: {
        gap: 8,
        paddingRight: 16,
    },
    filterButton: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    filterButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    filterButtonTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
    resultsCount: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 16,
    },

    // Trust Signal Box
    trustSignalBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 20,
        marginTop: 32,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    trustSignalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 8,
    },
    trustSignalText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#475569',
        marginBottom: 12,
    },
    trustSignalFeatures: {
        gap: 6,
    },
    trustSignalFeature: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
});
