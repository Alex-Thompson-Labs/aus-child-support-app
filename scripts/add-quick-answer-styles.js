/**
 * Script to add Quick Answer box styles to blog posts
 * Run with: node scripts/add-quick-answer-styles.js
 */

const fs = require('fs');
const path = require('path');

const quickAnswerStyles = `
    quickAnswerBox: { backgroundColor: '#22c55e', borderRadius: 12, padding: 20, marginBottom: 24, alignItems: 'center', ...createShadow({ shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }) },
    quickAnswerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
    quickAnswerText: { fontSize: 15, lineHeight: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
    quickAnswerButton: { backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
    quickAnswerButtonText: { color: '#22c55e', fontSize: 16, fontWeight: '700' },
`;

const files = [
    'adult-disabled-child-maintenance.tsx',
    'child-support-arrears-australia.tsx',
    'child-support-care-percentage-table.tsx',
    'child-support-formula-australia.tsx',
    'estimate-vs-actual-income-child-support.tsx',
    'international-child-support-australia.tsx',
    'lump-sum-child-support-payment.tsx',
    'new-partner-income-child-support.tsx',
    'object-to-child-support-assessment.tsx',
    'overseas-parent-child-support-enforcement.tsx',
    'parental-leave-child-support.tsx',
    'private-school-fees-child-support.tsx',
];

function addStyles(filename) {
    const filePath = path.join(__dirname, '..', 'app', 'blog', filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has styles
    if (content.includes('quickAnswerBox:')) {
        console.log(`✅ Already has styles: ${filename}`);
        return true;
    }

    // Try different insertion patterns
    const patterns = [
        // Pattern 1: After paragraph style
        /(paragraph: \{[^}]+\},\n)/,
        // Pattern 2: After intro style
        /(intro: \{[^}]+\},\n)/,
        // Pattern 3: After meta style
        /(meta: \{[^}]+\},\n)/,
        // Pattern 4: After title style
        /(title: \{[^}]+\},\n)/,
    ];

    let inserted = false;
    for (const pattern of patterns) {
        if (pattern.test(content)) {
            content = content.replace(pattern, `$1${quickAnswerStyles}\n`);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        console.log(`⚠️  Could not find insertion point in: ${filename}`);
        return false;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added styles to: ${filename}`);
    return true;
}

console.log('🚀 Adding Quick Answer box styles...\n');

let successCount = 0;
let skipCount = 0;
let failCount = 0;

files.forEach(filename => {
    const result = addStyles(filename);
    if (result === true) {
        if (fs.readFileSync(path.join(__dirname, '..', 'app', 'blog', filename), 'utf8').includes('quickAnswerBox:')) {
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
console.log(`⏭️  Already had styles: ${skipCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`\n✨ Done!`);
