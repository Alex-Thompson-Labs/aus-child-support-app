#!/usr/bin/env node

/**
 * Fix Meta Descriptions and Titles
 * 
 * Fixes meta descriptions that are too short/long and titles that are too long
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../app/blog');

const fixes = [
  {
    file: 'accurate-child-support-calculator.tsx',
    oldDesc: 'Most calculators get it wrong. Ours uses official 2026 formula + flags complex cases. Get accurate estimates in 5 minutes. No registration required.',
    newDesc: 'Manual calculation errors cost $1,000s/year. Our calculator uses official 2026 formula + 500+ cost tables. Get accurate results in 5 minutes. Free, no registration.',
    oldTitle: 'Accurate Child Support Calculator Australia 2026 | Free Estimate',
    newTitle: 'Child Support Calculator Australia 2026 | Free & Accurate',
  },
  {
    file: 'child-support-after-18.tsx',
    oldDesc: 'Child support ends at 18 (or Year 12 completion). Early termination possible. Adult child maintenance rare. See exact rules + exceptions.',
    newDesc: 'Child support ends at 18 (or Year 12 completion). Early termination possible. Adult child maintenance rare. See exact rules + exceptions for your situation.',
  },
  {
    file: 'backdating-child-support-australia.tsx',
    oldDesc: 'Claim up to 18 months backdated child support—but only if you apply now. See evidence requirements + collection process. Don\'t miss the window.',
    newDesc: 'Backdating limited to 3 months (9 if special circumstances). Arrears recoverable for 7 years. See rules + evidence requirements. Act fast to maximize recovery.',
    oldTitle: 'Backdating Child Support Australia 2026: How Far Back Can You Claim?',
    newTitle: 'Backdating Child Support Australia 2026 | How Far Back?',
  },
  {
    file: 'binding-child-support-agreement.tsx',
    oldDesc: 'Binding agreements are permanent—no refunds if circumstances change. See legal requirements + $2,500-6,500 costs. Get legal advice before signing.',
    newDesc: 'Binding agreements are permanent—no refunds if circumstances change. See legal requirements + $2,500-6,500 costs. Get legal advice before signing any agreement.',
  },
  {
    file: 'child-support-arrears-australia.tsx',
    oldDesc: 'Arrears never expire. Services Australia can garnish wages, seize tax refunds, suspend licenses. See enforcement powers + payment plans. Act now.',
    newDesc: 'Arrears never expire. Services Australia can garnish wages, seize tax refunds, suspend licenses. See enforcement powers + payment plans. Act now to avoid penalties.',
    oldTitle: 'Child Support Arrears Australia 2026: Collection & Penalties',
    newTitle: 'Child Support Arrears Australia 2026 | Collection Guide',
  },
  {
    file: 'child-support-care-percentage-table.tsx',
    oldDesc: '52 nights = 14% care, 183 nights = 50%. One night difference can change payments by $100s/month. See full table + free calculator. Check now.',
    newDesc: '52 nights = 14% care, 183 nights = 50%. One night difference can change payments by $100s/month. See full table + free calculator. Check your care % now.',
    oldTitle: 'Child Support Care Percentage Table Australia 2026 | Nights to %',
    newTitle: 'Child Support Care % Table Australia 2026 | Nights to %',
  },
  {
    file: 'child-support-centrelink-income-support.tsx',
    oldDesc: 'On income support? Minimum payment $534/year (with regular care). Fixed rate $1,815/year (no care). See rates + exemptions. Calculate now.',
    newDesc: 'On income support? Minimum payment $534/year (with regular care). Fixed rate $1,815/year (no care). See rates + exemptions. Calculate your payment now.',
    oldTitle: 'Child Support on Centrelink Income Support Australia 2026: Complete Guide',
    newTitle: 'Child Support on Centrelink Income Support 2026',
  },
  {
    file: 'child-support-overpayment-refund.tsx',
    oldDesc: 'Overpaid child support? Refunds possible but complex. See 3 recovery methods + time limits. Services Australia won\'t tell you. Check now.',
    newDesc: 'Overpaid child support? Refunds possible but complex. See 3 recovery methods + time limits. Services Australia won\'t tell you. Check your overpayment now.',
    oldTitle: 'Child Support Overpayment Refund Australia 2026: How to Claim Back Money',
    newTitle: 'Child Support Overpayment Refund Australia 2026',
  },
  {
    file: 'child-support-reduction-strategies.tsx',
    oldDesc: 'Reduce child support legally—not by hiding income. 7 strategies with 40-80% success rates. Change of Assessment + care increases. See options now.',
    newDesc: 'Reduce child support legally—not by hiding income. 7 strategies with 40-80% success rates. Change of Assessment + care increases. See your options now.',
    oldTitle: 'How to Reduce Child Support Payments Australia 2026: 7 Legal Ways',
    newTitle: 'Reduce Child Support Payments Australia 2026 | 7 Legal Ways',
  },
  {
    file: 'child-support-vs-spousal-maintenance.tsx',
    oldDesc: 'Child support is mandatory and formula-based. Spousal maintenance is discretionary and court-ordered. Learn the key differences, how they work together, and when each applies.',
    newDesc: 'Child support is mandatory and formula-based. Spousal maintenance is discretionary and court-ordered. Learn key differences and when each applies.',
    oldTitle: 'Child Support vs Spousal Maintenance Australia 2026 | Key Differences',
    newTitle: 'Child Support vs Spousal Maintenance Australia 2026',
  },
  {
    file: 'complicated-child-support-situations.tsx',
    oldDesc: 'Self-employment, trusts, overseas income, multiple cases—complex situations need legal help. See 8 red flags + when DIY fails. Get advice now.',
    newDesc: 'Self-employment, trusts, overseas income, multiple cases—complex situations need legal help. See 8 red flags + when DIY fails. Get professional advice now.',
    oldTitle: 'Complicated Child Support Situations Australia 2026: When to Get Help',
    newTitle: 'Complicated Child Support Situations Australia 2026',
  },
  {
    file: 'court-order-child-support-calculator.tsx',
    oldDesc: 'Court orders override formula—but only if properly drafted. See calculation methods + enforcement. Errors cost $10k-30k+. Get legal advice first.',
    newDesc: 'Court orders override formula—but only if properly drafted. See calculation methods + enforcement. Errors cost $10k-30k+. Get legal advice before signing.',
    oldTitle: 'Court Order Child Support Calculator Australia 2026: Legal Guide',
    newTitle: 'Court Order Child Support Calculator Australia 2026',
  },
  {
    file: 'estimate-vs-actual-income-child-support.tsx',
    oldDesc: 'Income reconciliation can trigger $1,000s in surprise bills. See estimated vs actual income differences + how to update estimates. Avoid shock payments.',
    newDesc: 'Income reconciliation can trigger $1,000s in surprise bills. See estimated vs actual income differences + how to update estimates. Avoid shock payments now.',
    oldTitle: 'Estimate vs Actual Income Child Support Australia 2026 | Complete Guide',
    newTitle: 'Estimate vs Actual Income Child Support Australia 2026',
  },
  {
    file: 'how-to-calculate-child-support.tsx',
    oldDesc: 'Manual calculation takes 60 minutes + risks $1,000s in errors. Our calculator uses official 2026 formula. Get accurate results in 5 minutes. Free.',
    newDesc: 'Manual calculation takes 60 minutes + risks $1,000s in errors. Our calculator uses official 2026 formula. Get accurate results in 5 minutes. Free, no registration.',
    oldTitle: 'How to Calculate Child Support Australia 2026 | Free Calculator',
    newTitle: 'Calculate Child Support Australia 2026 | Free Calculator',
  },
  {
    file: 'international-child-support-australia.tsx',
    oldDesc: 'Parent overseas? Enforcement works in 80+ countries. See reciprocating jurisdictions + Hague Convention. International recovery takes 6-18 months.',
    newDesc: 'Parent overseas? Enforcement works in 80+ countries. See reciprocating jurisdictions + Hague Convention. International recovery takes 6-18 months. Start now.',
    oldTitle: 'International Child Support Australia 2026: Overseas Parent Enforcement',
    newTitle: 'International Child Support Australia 2026',
  },
  {
    file: 'lump-sum-child-support-payment.tsx',
    oldDesc: 'Lump sum = permanent—no refunds if circumstances change. $240k over 10 years = $180-200k today. See calculation + risks. Get legal advice first.',
    newDesc: 'Lump sum = permanent—no refunds if circumstances change. $240k over 10 years = $180-200k today. See calculation + risks. Get legal advice before agreeing.',
    oldTitle: 'Lump Sum Child Support Payment Australia 2026: Complete Guide',
    newTitle: 'Lump Sum Child Support Payment Australia 2026',
  },
  {
    file: 'new-partner-income-child-support.tsx',
    oldDesc: 'New partner\'s income doesn\'t count—unless you\'re not working. See earning capacity exception + when it applies. Protect your new relationship.',
    newDesc: 'New partner\'s income doesn\'t count—unless you\'re not working. See earning capacity exception + when it applies. Protect your new relationship from assessment.',
    oldTitle: 'New Partner Income Child Support Australia 2026: Does It Count?',
    newTitle: 'New Partner Income Child Support Australia 2026',
  },
  {
    file: 'object-to-child-support-assessment.tsx',
    oldDesc: '28-day deadline to object—miss it and you\'re stuck. See valid grounds + evidence requirements. SSAT appeal process explained. Act now.',
    newDesc: '28-day deadline to object—miss it and you\'re stuck. See valid grounds + evidence requirements. SSAT appeal process explained. Act now to preserve your rights.',
  },
  {
    file: 'overseas-parent-child-support-enforcement.tsx',
    oldDesc: 'Parent overseas? Enforcement works in 80+ countries through reciprocating jurisdictions. See Hague Convention agreements + enforcement process. Start now.',
    newDesc: 'Parent overseas? Enforcement works in 80+ countries through reciprocating jurisdictions. See Hague Convention agreements + enforcement process. Start recovery now.',
    oldTitle: 'Overseas Parent Child Support Enforcement Australia 2026: International Recovery',
    newTitle: 'Overseas Parent Child Support Enforcement Australia 2026',
  },
  {
    file: 'parental-leave-child-support.tsx',
    oldDesc: 'Parental leave income = $0 for child support. See how PPL affects assessments + when to update. Temporary reduction possible. Apply now.',
    newDesc: 'Parental leave income = $0 for child support. See how PPL affects assessments + when to update. Temporary reduction possible. Apply now to reduce payments.',
    oldTitle: 'Parental Leave Child Support Australia 2026: How PPL Affects Payments',
    newTitle: 'Parental Leave Child Support Australia 2026',
  },
  {
    file: 'private-school-fees-child-support.tsx',
    oldDesc: 'Private school fees NOT covered by basic child support. See Change of Assessment process + success rates. Costs $2,500-6,500 in legal fees.',
    newDesc: 'Private school fees NOT covered by basic child support. See Change of Assessment process + success rates. Costs $2,500-6,500 in legal fees. Apply strategically.',
    oldTitle: 'Private School Fees Child Support Australia 2026: Who Pays Extra Costs?',
    newTitle: 'Private School Fees Child Support Australia 2026',
  },
  {
    file: 'shared-care-5050-child-support.tsx',
    oldDesc: '50/50 care doesn\'t mean $0 child support. Higher earner still pays. See calculation + income thresholds. One night difference = $100s/month.',
    newDesc: '50/50 care doesn\'t mean $0 child support. Higher earner still pays. See calculation + income thresholds. One night difference = $100s/month. Calculate now.',
    oldTitle: 'Shared Care 50/50 Child Support Australia 2026: Do You Still Pay?',
    newTitle: 'Shared Care 50/50 Child Support Australia 2026',
  },
  {
    file: 'what-happens-if-dont-pay-child-support.tsx',
    oldDesc: 'Services Australia has extensive powers to collect unpaid child support, including wage garnishing, tax refund intercepts, and international travel bans. Learn the risks of non-payment.',
    newDesc: 'Services Australia can garnish wages, seize tax refunds, suspend licenses, and ban international travel. See enforcement powers + payment plans. Act now.',
  },
  {
    file: 'when-to-hire-family-lawyer.tsx',
    oldDesc: 'DIY child support fails with self-employment, trusts, or court orders. 3 signs you need a lawyer. Free consultations. Errors cost $10k-30k+.',
    newDesc: 'DIY child support fails with self-employment, trusts, or court orders. 3 signs you need a lawyer. Free consultations available. Errors cost $10k-30k+.',
    oldTitle: 'When to Hire a Family Lawyer for Child Support Australia 2026',
    newTitle: 'When to Hire a Family Lawyer Child Support Australia 2026',
  },
];

let filesModified = 0;
let descriptionsFixed = 0;
let titlesFixed = 0;

console.log('🔧 Fixing meta descriptions and titles...\n');

fixes.forEach(fix => {
  const filePath = path.join(BLOG_DIR, fix.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${fix.file} - File not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix description
  if (fix.oldDesc && fix.newDesc) {
    const oldDescEscaped = fix.oldDesc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const descRegex = new RegExp(`description="${oldDescEscaped}"`, 'g');
    
    if (descRegex.test(content)) {
      content = content.replace(descRegex, `description="${fix.newDesc}"`);
      modified = true;
      descriptionsFixed++;
      console.log(`✅ ${fix.file} - Fixed description`);
    }
  }
  
  // Fix title
  if (fix.oldTitle && fix.newTitle) {
    const oldTitleEscaped = fix.oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titleRegex = new RegExp(`title="${oldTitleEscaped}"`, 'g');
    
    if (titleRegex.test(content)) {
      content = content.replace(titleRegex, `title="${fix.newTitle}"`);
      modified = true;
      titlesFixed++;
      console.log(`✅ ${fix.file} - Fixed title`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    filesModified++;
  }
});

console.log('\n📊 Summary:');
console.log(`   Files modified: ${filesModified}`);
console.log(`   Descriptions fixed: ${descriptionsFixed}`);
console.log(`   Titles fixed: ${titlesFixed}`);
console.log('\n✅ Meta description and title fixes complete!');
