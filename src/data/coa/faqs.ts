/**
 * Change of Assessment FAQ Data
 *
 * Contains frequently asked questions for each of the 11 CoA reason pages.
 * Used for both visible FAQ sections and FAQPage schema markup.
 */

import type { CoAFaq } from './types';

/**
 * FAQ data for all Change of Assessment reason pages
 */
export const COA_FAQ_DATA: Record<string, CoAFaq[]> = {
  'high-costs-of-contact': [
    {
      question: 'Who can apply for Reason 1 (High Costs of Contact)?',
      answer:
        'Any parent who pays significant costs to maintain contact with their children can apply. This includes costs for travel, accommodation, and transportation when children live far away.',
    },
    {
      question: 'What evidence do I need for high contact costs?',
      answer:
        'You should provide receipts, invoices, or bank statements showing travel expenses (flights, fuel, tolls), accommodation costs, and any other expenses directly related to maintaining contact with your children.',
    },
    {
      question: 'How much can my child support be reduced under Reason 1?',
      answer:
        'The reduction depends on your specific circumstances. The Registrar will consider how much you spend on contact relative to your income and whether the costs are necessary and reasonable.',
    },
    {
      question: 'Can I claim travel costs if I moved away?',
      answer:
        'Generally, if you voluntarily moved away from your children, it may be harder to claim high contact costs. The Registrar considers whether the distance was created by your own choice or due to circumstances beyond your control.',
    },
  ],

  'special-needs-care-costs': [
    {
      question: 'Who can apply for Reason 2 (Special Needs Care Costs)?',
      answer:
        'Either parent can apply if their child has a disability, chronic illness, or special needs that require care costs beyond what the standard formula considers.',
    },
    {
      question: 'What medical evidence do I need for a special needs claim?',
      answer:
        'You should provide medical reports, diagnosis letters from specialists, NDIS plans if applicable, and invoices showing the costs of therapies, equipment, medications, or specialist care.',
    },
    {
      question: 'Does NDIS funding affect a Reason 2 application?',
      answer:
        'Yes. The Registrar will consider your NDIS package when assessing your claim. Out-of-pocket costs not covered by NDIS are most relevant for a Change of Assessment.',
    },
    {
      question: 'Can both parents apply for special needs costs?',
      answer:
        'Yes, but typically the parent with primary care who incurs most costs applies. If both parents have significant costs, each can submit their own application with supporting evidence.',
    },
  ],

  'high-costs-caring-educating-child': [
    {
      question: 'Can I claim private school fees under Reason 3?',
      answer:
        "Yes, private school fees are one of the most common grounds for Reason 3. However, you should show that both parents agreed to private schooling (especially if agreed before separation) or that it is in the child's best interests.",
    },
    {
      question: 'What if the other parent refuses to pay school fees?',
      answer:
        "If you have evidence of a prior agreement (court order, financial agreement, emails, or texts), you may be able to apply for a Change of Assessment. The Registrar can order contribution even without the other parent's current agreement.",
    },
    {
      question: 'Are extracurricular activities covered under Reason 3?',
      answer:
        'Yes, if the costs are substantial and both parents previously agreed to enrol the child in those activities. Representative sport, elite music programs, and competitive dance are common examples.',
    },
    {
      question: 'What evidence do I need for education costs?',
      answer:
        'Provide school fee invoices, receipts for uniforms and books, evidence of prior parental agreement (emails, texts, court orders), and any tutor or program costs.',
    },
  ],

  'childs-income-resources': [
    {
      question: "When does a child's income affect child support?",
      answer:
        "A child's income or resources may affect child support when they are significant enough to reduce the child's need for parental financial support—for example, a substantial inheritance or trust fund.",
    },
    {
      question: "Does a teenager's part-time job affect child support?",
      answer:
        'Usually not, unless the income is substantial. Small part-time earnings (e.g., $50-100/week) are unlikely to affect the assessment, but significant income may be considered.',
    },
    {
      question: 'Can trust funds or inheritances be considered?',
      answer:
        'Yes. If a child has access to a trust fund or received an inheritance that can be used for their expenses, this can be considered under Reason 4.',
    },
    {
      question: 'What evidence do I need for a Reason 4 application?',
      answer:
        "Provide evidence of the child's income (payslips), bank statements, trust deeds, inheritance documentation, or any other proof of the child's financial resources.",
    },
  ],

  'transferred-benefits': [
    {
      question: 'What counts as a transferred benefit under Reason 5?',
      answer:
        "Transferred benefits include lump sum payments made as part of a property settlement for the child, prepaid school fees, direct payment of medical expenses, or assets transferred into the child's name.",
    },
    {
      question: 'Can property settlement payments reduce child support?',
      answer:
        "Yes, if you transferred money or property specifically for your child's benefit as part of a property settlement, this can be considered. You need to show the transfer was intended for the child, not just general spousal division.",
    },
    {
      question: 'How long do transferred benefits affect child support?',
      answer:
        "The Registrar determines how long the benefit should offset payments based on the amount transferred and the child's ongoing needs. Large transfers may affect multiple years.",
    },
    {
      question: 'What evidence do I need for transferred benefits?',
      answer:
        "Provide property settlement orders or agreements, receipts for prepaid expenses, bank statements showing transfers, and any documentation showing the transfer was for the child's benefit.",
    },
  ],

  'high-childcare-costs': [
    {
      question: 'What childcare costs qualify under Reason 6?',
      answer:
        "Qualifying costs include long daycare, family daycare, before and after school care, vacation care programs, and in-home care (nannies) when necessary for work. Costs must be out-of-pocket after Child Care Subsidy.",
    },
    {
      question: 'Does Child Care Subsidy affect a Reason 6 application?',
      answer:
        "Yes. The Registrar considers your out-of-pocket costs after the Child Care Subsidy. If your subsidy is low or you're ineligible, your case may be stronger.",
    },
    {
      question: 'Can I claim nanny or au pair costs?',
      answer:
        'Yes, if you can demonstrate these are necessary for you to work and are reasonable for your situation. You should show why centre-based care is not suitable.',
    },
    {
      question: 'What evidence do I need for childcare costs?',
      answer:
        'Provide childcare invoices showing the total cost and CCS received, your work schedule or contract showing hours worked, and evidence that childcare is necessary for employment.',
    },
  ],

  'reduced-capacity-commitments': [
    {
      question: 'What commitments qualify under Reason 7?',
      answer:
        'Qualifying commitments include supporting children from another relationship, caring for a new partner who cannot work due to illness or disability, or supporting elderly parents you have a legal duty to maintain.',
    },
    {
      question: 'Does a new partner reduce my child support obligation?',
      answer:
        'Not automatically. Only if your new partner cannot work (due to illness, disability, or caring responsibilities) and you are their sole source of support may this reduce your capacity to pay.',
    },
    {
      question: 'How do children from another relationship affect my assessment?',
      answer:
        'If you have children from another relationship you support, either through another child support assessment or as resident children, this may reduce your capacity to pay for the children in this assessment.',
    },
    {
      question: 'What evidence do I need for reduced capacity?',
      answer:
        'Provide medical certificates for an unwell partner, care responsibilities documentation, evidence of financial support provided to other dependants, and your living expense budget.',
    },
  ],

  'income-property-resources': [
    {
      question: 'What if the other parent is hiding income?',
      answer:
        'Reason 8A allows you to apply if you believe the other parent has income, property, or resources not reflected in their tax return. This includes cash business income, company benefits, trust distributions, and investment income.',
    },
    {
      question: 'Can lifestyle be used as evidence of hidden income?',
      answer:
        'Yes. If the other parent lives a lifestyle inconsistent with their declared income (expensive cars, holidays, properties), this can be evidence for a Reason 8A application.',
    },
    {
      question: 'What if the other parent uses a company structure?',
      answer:
        "The Registrar can look through company structures to determine a parent's true financial position. Company cars, expense accounts, and retained profits may all be considered.",
    },
    {
      question: 'What evidence do I need for hidden income claims?',
      answer:
        'Provide evidence of lifestyle (photos of cars, property, holidays), social media posts, business searches showing company ownership, and any documents suggesting undeclared income.',
    },
  ],

  'earning-capacity': [
    {
      question: 'What is earning capacity?',
      answer:
        'Earning capacity is what a person could reasonably earn if they were working to their full potential, based on their qualifications, experience, health, and the job market in their area.',
    },
    {
      question: 'Can child support be based on potential income rather than actual income?',
      answer:
        'Yes. Under Reason 8B, if a parent is deliberately underemployed or has reduced their income without good reason, the Registrar can assess child support based on their earning capacity rather than actual income.',
    },
    {
      question: 'What if the other parent quit their job after separation?',
      answer:
        'If they quit without a good reason (such as illness or caring responsibilities), you may apply under Reason 8B. The Registrar will consider their work history, qualifications, and available jobs.',
    },
    {
      question: 'What evidence do I need for an earning capacity claim?',
      answer:
        'Provide their work history (LinkedIn, resume), qualifications and degrees, job advertisements showing available positions in their field, and evidence of their previous income.',
    },
  ],

  'duty-to-maintain-another': [
    {
      question: 'What is a duty to maintain another person?',
      answer:
        'A duty to maintain is a legal obligation to financially support someone, such as a court-ordered spousal maintenance payment to a former partner or legal obligation to support an elderly or disabled relative.',
    },
    {
      question: 'How is Reason 9 different from Reason 7?',
      answer:
        'Reason 7 covers commitments that reduce your capacity (like supporting a new family), while Reason 9 specifically covers pre-existing legal obligations like court-ordered spousal maintenance from a previous relationship.',
    },
    {
      question: 'Does spousal maintenance reduce child support?',
      answer:
        'Court-ordered spousal maintenance can be considered under Reason 9 if it significantly affects your capacity to pay child support. Voluntary payments may be harder to claim.',
    },
    {
      question: 'What evidence do I need for a duty to maintain claim?',
      answer:
        'Provide court orders for spousal maintenance, payment records showing compliance, and evidence that the obligation is legally required (not voluntary).',
    },
  ],

  'resident-child-responsibility': [
    {
      question: 'What is a resident child under Reason 10?',
      answer:
        "A resident child is a child who lives with you but is not your biological or legal child—for example, a stepchild whose other parent cannot provide support due to death, illness, or absence.",
    },
    {
      question: 'Can stepchildren affect my child support obligation?',
      answer:
        'Yes, under specific conditions. The child must live with you primarily, you must have been with their parent for at least 2 years, and their other biological parent must be unable to support them.',
    },
    {
      question: "What if the stepchild's other parent is deceased?",
      answer:
        "If the other biological parent has passed away, you may be able to apply under Reason 10 if you have taken on responsibility for supporting the child and have been their parent's partner for 2+ years.",
    },
    {
      question: 'What evidence do I need for a resident child claim?',
      answer:
        "Provide proof of your relationship duration (marriage certificate, lease agreements), death certificate if applicable, evidence the child lives with you, and documentation of the child's financial needs.",
    },
  ],
};
