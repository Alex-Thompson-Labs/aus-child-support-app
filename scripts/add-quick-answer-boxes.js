/**
 * Script to add Quick Answer boxes to blog posts
 * Run with: node scripts/add-quick-answer-boxes.js
 */

const fs = require('fs');
const path = require('path');

// Quick Answer content for each post (40-60 words each)
const quickAnswers = {
    'child-support-after-18.tsx': {
        text: 'Child support ends when your child turns 18, unless they\'re still in secondary school (then it continues until they finish Year 12 or turn 19). Calculate how this affects your payments below.',
        words: 37
    },
    'new-partner-income-child-support.tsx': {
        text: 'Your new partner\'s income doesn\'t directly affect child support calculations. However, if they support your household, you may apply for Change of Assessment. Calculate your current amount below.',
        words: 32
    },
    'binding-child-support-agreement.tsx': {
        text: 'A Binding Child Support Agreement lets parents set their own child support amount outside the formula. Both need legal advice, and it must be fair. Calculate the standard formula amount first.',
        words: 35
    },
    'lump-sum-child-support-payment.tsx': {
        text: 'A lump sum payment can satisfy future child support obligations. You transfer property or cash instead of monthly payments. Requires legal agreement and careful calculation. See your estimated annual amount below.',
        words: 33
    },
    'backdating-child-support-australia.tsx': {
        text: 'Child support can be backdated up to 18 months from your application date. Services Australia collects arrears from the paying parent. Calculate your current and backdated amounts below.',
        words: 30
    },
    'child-support-overpayment-refund.tsx': {
        text: 'If you overpaid child support, Services Australia can recover it from future payments or directly from the receiving parent. You must apply within 12 months. Calculate your correct amount below.',
        words: 32
    },
    'child-support-reduction-strategies.tsx': {
        text: 'Legal ways to reduce child support include increasing care time, applying for Change of Assessment, or updating income estimates. Avoid illegal strategies that risk penalties. Calculate your current amount below.',
        words: 33
    },
    'child-support-centrelink-income-support.tsx': {
        text: 'Receiving Centrelink payments? You pay minimum child support ($1,815/year in 2026) regardless of income. When you return to work, payments increase based on actual income. Calculate your amount below.',
        words: 32
    },
    'court-order-child-support-calculator.tsx': {
        text: 'Have a court order for child support? It overrides the standard formula until it expires. Learn when it ends and what happens next. Calculate the formula amount below.',
        words: 31
    },
    'accurate-child-support-calculator.tsx': {
        text: 'Get accurate child support estimates using the official 2026 formula. Our calculator handles all formula variations, shows full breakdowns, and flags complex cases. Free, instant results in 5 minutes.',
        words: 31
    },
    'child-support-self-employed.tsx': {
        text: 'Self-employed? Services Australia assesses business income differently, adding back certain expenses. Complex cases need legal advice. Calculate your estimated amount below to understand the baseline.',
        words: 27
    },
    'child-support-formula-australia.tsx': {
        text: 'The Australian child support formula uses 8 steps: calculate income, determine percentages, look up costs, apply care adjustments. Payments range from $1,815 minimum to $30,000+ annually. Calculate your amount below.',
        words: 33
    },
    'complicated-child-support-situations.tsx': {
        text: 'Self-employment, trusts, overseas income, or court orders make child support complex. These situations need legal advice to avoid costly mistakes. Calculate your baseline amount below, then get expert help.',
        words: 30
    },
    'child-support-care-percentage-table.tsx': {
        text: 'Care percentage determines how much of child costs you cover through direct care. 52 nights = 14%, 128 nights = 35%, 183 nights = 50%. See how care affects your payments below.',
        words: 35
    },
    'object-to-child-support-assessment.tsx': {
        text: 'Disagree with your assessment? You have 28 days to object to Services Australia. Provide evidence of errors or special circumstances. If rejected, appeal to SSAT. Calculate your current amount below.',
        words: 33
    },
    'international-child-support-australia.tsx': {
        text: 'Ex lives overseas? Australian child support still applies in reciprocating jurisdictions. Enforcement varies by country. Calculate your Australian assessment amount below, then seek legal advice for international enforcement.',
        words: 29
    },
    'adult-disabled-child-maintenance.tsx': {
        text: 'Child support can continue indefinitely for adult children with disabilities. You must apply before they turn 18 and prove they can\'t self-support. Calculate standard child support amounts below.',
        words: 31
    },
    'overseas-parent-child-support-enforcement.tsx': {
        text: 'Enforcing child support when a parent lives overseas requires reciprocating jurisdiction agreements. Australia has treaties with 30+ countries. Calculate your Australian assessment below, then seek legal advice for enforcement.',
        words: 31
    },
    'private-school-fees-child-support.tsx': {
        text: 'Private school fees aren\'t automatically included in child support. You can apply for Change of Assessment or negotiate a Binding Agreement to split education costs. Calculate standard child support below.',
        words: 32
    },
    'parental-leave-child-support.tsx': {
        text: 'Taking parental leave? Your child support temporarily decreases based on Parental Leave Pay income. Notify Services Australia immediately to avoid overpayments. Calculate your adjusted amount below.',
        words: 27
    },
    'estimate-vs-actual-income-child-support.tsx': {
        text: 'Child support uses estimated income during the year, then reconciles with actual income from tax returns. Differences create overpayments or underpayments. Calculate your estimated amount below.',
        words: 28
    },
    'child-support-arrears-australia.tsx': {
        text: 'Behind on child support? Services Australia can garnish wages, intercept tax refunds, suspend passports, or take legal action. Arrears accumulate with interest. Calculate your current amount and payment plan options below.',
        words: 33
    },
};

// Style definitions to add
const quickAnswerStyles = `
    quickAnswerBox: { backgroundColor: '#22c55e', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#22c55e', fontSize: 16, fontWeight: '700' },
`;

function addQuickAnswerBox(filename) {
    const filePath = path.join(__dirname, '..', 'app', 'blog', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has Quick Answer box
    if (content.includes('quickAnswerBox')) {
        console.log(`✅ Already has Quick Answer: ${filename}`);
        return true;
    }

    const answer = quickAnswers[filename];
    if (!answer) {
        console.log(`⚠️  No Quick Answer defined for: ${filename}`);
        return false;
    }

    // Create Quick Answer JSX
    const quickAnswerJSX = `
                    <View style={styles.quickAnswerBox}>
                        <Text style={styles.quickAnswerTitle}>⚡ Quick Answer</Text>
                        <Text style={styles.quickAnswerText}>
                            ${answer.text}
                        </Text>
                        <Pressable style={[styles.quickAnswerButton, isWeb && webClickableStyles]} onPress={() => router.push('/')} accessibilityRole="button">
                            <Text style={styles.quickAnswerButtonText}>Calculate Your Amount →</Text>
                        </Pressable>
                    </View>
`;

    // Find insertion point (after intro paragraph, before first H2 or special box)
    const introEndPattern = /(<Text style={styles\.intro}>[\s\S]*?<\/Text>)/;
    const match = content.match(introEndPattern);
    
    if (!match) {
        console.log(`⚠️  Could not find intro paragraph in: ${filename}`);
        return false;
    }

    // Insert Quick Answer after intro
    content = content.replace(introEndPattern, `$1\n${quickAnswerJSX}`);

    // Add styles if not present
    if (!content.includes('quickAnswerBox:')) {
        // Find the styles section
        const stylesPattern = /(bulletItem:[\s\S]*?},\n\n)/;
        const stylesMatch = content.match(stylesPattern);
        
        if (stylesMatch) {
            content = content.replace(stylesPattern, `$1${quickAnswerStyles}\n`);
        } else {
            console.log(`⚠️  Could not find styles section in: ${filename}`);
            return false;
        }
    }

    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added Quick Answer to: ${filename} (${answer.words} words)`);
    return true;
}

// Main execution
console.log('🚀 Adding Quick Answer boxes to blog posts...\n');

const files = Object.keys(quickAnswers);
let successCount = 0;
let skipCount = 0;
let failCount = 0;

files.forEach(filename => {
    const result = addQuickAnswerBox(filename);
    if (result === true) {
        if (fs.readFileSync(path.join(__dirname, '..', 'app', 'blog', filename), 'utf8').includes('quickAnswerBox')) {
            successCount++;
        } else {
            skipCount++;
        }
    } else {
        failCount++;
    }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Successfully added: ${successCount}`);
console.log(`⏭️  Already had Quick Answer: ${skipCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`\n✨ Done! Run 'npm run lint' to check for any issues.`);
