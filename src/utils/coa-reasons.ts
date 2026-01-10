/**
 * Change of Assessment (CoA) Reason Pages Data
 *
 * Contains all 10 official Services Australia Change of Assessment grounds
 * with SEO metadata, plain English explanations, and example scenarios.
 *
 * @module coa-reasons
 */

/**
 * Represents a Change of Assessment reason page
 */
export interface CoAReasonPage {
  /** URL slug (kebab-case) */
  slug: string;
  /** Display number: "1", "2", ..., "8A", "8B", "9", "10" */
  reasonNumber: string;
  /** Official Services Australia code: "5.2.1" - "5.2.11" */
  officialCode: string;
  /** Full SEO title */
  title: string;
  /** Short name for navigation/breadcrumbs */
  shortName: string;
  /** Meta description (150-160 chars) */
  metaDescription: string;
  /** Plain English explanation of this ground */
  plainEnglishExplanation: string;
  /** Example scenario with John and Sarah */
  exampleScenario: {
    title: string;
    content: string;
  };
  /** Related special circumstance ID for pre-selection, or null */
  relatedCircumstanceId: string | null;
  /** Canonical URL path */
  canonicalPath: string;
}

/**
 * All 10 official Change of Assessment reason pages
 */
export const COA_REASON_PAGES: readonly CoAReasonPage[] = [
  {
    slug: 'high-costs-of-contact',
    reasonNumber: '1',
    officialCode: '5.2.1',
    title: 'Reason 1: High Costs of Contact - Child Support Change of Assessment',
    shortName: 'High Costs of Contact',
    metaDescription:
      'Learn about Change of Assessment Reason 1: High costs of maintaining contact with your children. Understand when travel costs can reduce your child support.',
    plainEnglishExplanation: `If you spend a lot of money travelling to see your children, you may be able to have your child support assessment changed. This is known as "Reason 1" under the Child Support (Assessment) Act.

This reason applies when a parent has significant costs to maintain contact with their children, such as:
- Regular interstate or long-distance travel
- Airfares for children to visit during school holidays
- Accommodation costs during contact periods
- Vehicle costs for frequent long drives

The Registrar will consider whether these costs are necessary and reasonable, and whether they significantly affect your capacity to pay child support.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John lives in Perth while his two children live with Sarah in Sydney. To maintain regular contact, John flies to Sydney twice a month and pays for the children to fly to Perth during school holidays.

John's annual contact costs total $18,000 - airfares, accommodation, and car hire. This is a significant portion of his income.

John applied for a Change of Assessment under Reason 1. The Registrar reviewed his travel expenses and flight records, and determined that his high contact costs justified a reduction in his child support payments.`,
    },
    relatedCircumstanceId: 'contact_costs',
    canonicalPath: '/change-of-assessment/high-costs-of-contact',
  },
  {
    slug: 'special-needs-care-costs',
    reasonNumber: '2',
    officialCode: '5.2.2',
    title: 'Reason 2: Special Needs Care Costs - Child Support Change of Assessment',
    shortName: 'Special Needs Care Costs',
    metaDescription:
      'Learn about Change of Assessment Reason 2: High costs of caring for a child with special needs. Understand how disability or medical costs affect child support.',
    plainEnglishExplanation: `If your child has special needs that require expensive care beyond what the standard child support formula considers, you may be able to have your assessment changed. This is "Reason 2" under the Child Support (Assessment) Act.

This reason applies when a child has:
- A disability requiring specialist care or equipment
- A chronic medical condition requiring ongoing treatment
- Mental health needs requiring therapy or support services
- Learning difficulties requiring specialist education support

The costs must be necessary for the child's wellbeing and significantly higher than what the formula assumes for children generally.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John and Sarah's daughter Emma has autism spectrum disorder. Sarah, who has primary care of Emma, pays for:
- Weekly occupational therapy sessions ($200/week)
- Fortnightly speech therapy ($150/fortnight)
- A support worker for after-school care ($15,000/year)
- Specialist equipment and sensory toys ($3,000/year)

These costs total over $25,000 annually - far more than typical child-raising costs.

Sarah applied for a Change of Assessment under Reason 2. She provided medical reports confirming Emma's diagnosis and invoices for her care costs. The Registrar increased John's child support to help cover these necessary expenses.`,
    },
    relatedCircumstanceId: 'special_needs',
    canonicalPath: '/change-of-assessment/special-needs-care-costs',
  },
  {
    slug: 'high-costs-caring-educating-child',
    reasonNumber: '3',
    officialCode: '5.2.3',
    title: 'Reason 3: High Costs of Caring for or Educating a Child - Child Support Change of Assessment',
    shortName: 'High Costs of Caring/Educating',
    metaDescription:
      'Learn about Change of Assessment Reason 3: High costs of caring for or educating a child. Includes private school fees and extracurricular activities.',
    plainEnglishExplanation: `If you have high costs for your child's education or care that go beyond what the standard formula considers, you may be able to change your assessment. This is "Reason 3" under the Child Support (Assessment) Act.

This reason commonly applies to:
- Private school or boarding school fees
- Elite sports or music programs
- Expensive extracurricular activities (both parents agreed to)
- High childcare costs for younger children
- Tutoring or educational support programs

The key is that these costs must be necessary for the child and significantly higher than what the formula assumes. Both parents having previously agreed to these expenses strengthens the case.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John and Sarah agreed when married that their children would attend the private school they both attended. After separation, Sarah has primary care and pays the school fees of $28,000 per year for their two children.

John's current child support payment doesn't come close to covering his share of the fees. Sarah struggles to meet the payments on her income alone.

Sarah applied for a Change of Assessment under Reason 3. She provided evidence that both parents had agreed to private schooling before separation, the fee invoices, and showed the standard assessment didn't cover these costs. The Registrar increased John's child support to help cover the school fees.`,
    },
    relatedCircumstanceId: 'school_fees',
    canonicalPath: '/change-of-assessment/high-costs-caring-educating-child',
  },
  {
    slug: 'childs-income-resources',
    reasonNumber: '4',
    officialCode: '5.2.4',
    title: "Reason 4: Child's Income or Resources - Child Support Change of Assessment",
    shortName: "Child's Income/Resources",
    metaDescription:
      "Learn about Change of Assessment Reason 4: When a child has their own income, property, or financial resources that affect child support calculations.",
    plainEnglishExplanation: `If your child has their own income or financial resources, this may affect how much child support should be paid. This is "Reason 4" under the Child Support (Assessment) Act.

This reason may apply when a child:
- Has part-time or casual employment earning significant income
- Has received an inheritance or trust fund
- Owns property or investments in their name
- Receives income from a family business
- Has a substantial savings account

The Registrar considers whether the child's resources reduce the need for parental financial support, and whether it's appropriate for the child to contribute to their own costs.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John and Sarah's 16-year-old son Michael received an inheritance of $150,000 from his grandparents. The money is held in a trust for him but can be used for his education and living expenses.

Michael also works part-time, earning $15,000 per year.

John applied for a Change of Assessment under Reason 4. He argued that Michael's inheritance and income meant he required less financial support from his parents. The Registrar reviewed the trust deed and Michael's earnings, and reduced John's child support to reflect that Michael's own resources could cover some of his expenses.`,
    },
    relatedCircumstanceId: 'child_resources',
    canonicalPath: '/change-of-assessment/childs-income-resources',
  },
  {
    slug: 'property-settlement-impacts-capacity',
    reasonNumber: '5',
    officialCode: '5.2.5',
    title: 'Reason 5: Property Settlement Affects Capacity to Pay - Child Support Change of Assessment',
    shortName: 'Property Settlement Impact',
    metaDescription:
      'Learn about Change of Assessment Reason 5: When a property settlement significantly affects your capacity to pay child support or meet your own needs.',
    plainEnglishExplanation: `If your property settlement from separation has significantly affected your ability to pay child support (or your need to receive it), you may be able to change your assessment. This is "Reason 5" under the Child Support (Assessment) Act.

This reason applies when:
- You received significantly less property than your ex-partner
- You gave up property to keep the family home for the children
- The property split left you with debts but few assets
- Your ex-partner received property that generates income not captured in their assessment

Property settlements are supposed to be final, but sometimes they create ongoing financial impacts that make the standard child support assessment unfair.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `In their property settlement, Sarah kept the family home (worth $800,000 with a $300,000 mortgage) while John received $200,000 in superannuation he can't access until retirement, plus took on $100,000 of the couple's debts.

Although the split was technically "equal," John now pays rent while servicing debt, leaving him with far less disposable income than Sarah who owns an appreciating asset.

John applied for a Change of Assessment under Reason 5. He demonstrated that the property settlement left him with significantly reduced capacity to pay child support compared to what his income alone would suggest. The Registrar reduced his payments accordingly.`,
    },
    relatedCircumstanceId: 'property_settlement',
    canonicalPath: '/change-of-assessment/property-settlement-impacts-capacity',
  },
  {
    slug: 'high-childcare-costs',
    reasonNumber: '6',
    officialCode: '5.2.6',
    title: 'Reason 6: High Childcare Costs - Child Support Change of Assessment',
    shortName: 'High Childcare Costs',
    metaDescription:
      'Learn about Change of Assessment Reason 6: When childcare costs are exceptionally high and not adequately covered by the standard child support formula.',
    plainEnglishExplanation: `If you pay significantly more for childcare than the standard formula accounts for, you may be able to change your assessment. This is "Reason 6" under the Child Support (Assessment) Act.

This reason applies when:
- You need full-time childcare to work (especially for infants/toddlers)
- You live in an area with expensive childcare
- Your work hours require before and after school care
- You need holiday care programs during school breaks
- Your childcare costs are substantially higher than average

After the Child Care Subsidy, if your out-of-pocket childcare costs are still significant, you may have grounds to seek an adjustment.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `Sarah works full-time and needs childcare for their 2-year-old daughter and before/after school care for their 6-year-old son. Her annual childcare costs are:
- Full-time daycare: $22,000 (after Child Care Subsidy)
- Before/after school care: $8,000
- School holiday programs: $3,000
- Total: $33,000 per year

The standard child support assessment doesn't adequately cover these costs, leaving Sarah struggling to pay for the childcare she needs to work.

Sarah applied for a Change of Assessment under Reason 6. She provided childcare invoices and her work roster showing she needed this care to maintain her employment. The Registrar increased John's child support to help cover these necessary costs.`,
    },
    relatedCircumstanceId: 'high_childcare_costs',
    canonicalPath: '/change-of-assessment/high-childcare-costs',
  },
  {
    slug: 'reduced-capacity-commitments',
    reasonNumber: '7',
    officialCode: '5.2.7',
    title: 'Reason 7: Reduced Capacity Due to Commitments - Child Support Change of Assessment',
    shortName: 'Reduced Capacity - Commitments',
    metaDescription:
      'Learn about Change of Assessment Reason 7: When your legal commitments to support other people reduce your capacity to pay child support.',
    plainEnglishExplanation: `If you have legal obligations to financially support other people that weren't considered in your child support assessment, you may be able to have it changed. This is "Reason 7" under the Child Support (Assessment) Act.

This reason applies when you have:
- Children from another relationship you support
- A new partner who is unable to work (illness, disability, caring responsibilities)
- Elderly parents you're legally required to support
- Other dependants you have a duty to maintain

The costs must be necessary, not voluntary, and must genuinely reduce your capacity to pay child support.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `After separating from Sarah, John remarried. His new wife Emma has a chronic illness that prevents her from working, and they have a new baby together. John is the sole income earner supporting four people.

John pays child support for his two children with Sarah based on his full income. But after supporting Emma and their baby, he has very little left.

John applied for a Change of Assessment under Reason 7. He provided medical evidence of Emma's condition, proof she couldn't work, and showed his necessary living costs for his new family. The Registrar reduced his child support to reflect his reduced capacity due to his other commitments.`,
    },
    relatedCircumstanceId: 'duty_to_maintain',
    canonicalPath: '/change-of-assessment/reduced-capacity-commitments',
  },
  {
    slug: 'income-property-resources',
    reasonNumber: '8A',
    officialCode: '5.2.8',
    title: 'Reason 8A: Income, Property, or Financial Resources - Child Support Change of Assessment',
    shortName: 'Income/Property/Resources',
    metaDescription:
      "Learn about Change of Assessment Reason 8A: When a parent's true income, property, or resources aren't reflected in the standard assessment.",
    plainEnglishExplanation: `If you believe the other parent has income, property, or financial resources that aren't reflected in their child support assessment, you may be able to have it changed. This is "Reason 8A" under the Child Support (Assessment) Act.

This is one of the most common reasons for a Change of Assessment. It applies when:
- The other parent runs a cash business and underreports income
- They have investments, rental properties, or trust income not in their tax return
- They receive fringe benefits, allowances, or income not captured in taxable income
- They have significant assets that could generate income
- Company structures hide their true financial position

The Registrar can look beyond tax returns to determine a parent's true financial capacity.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John runs a successful building business. His tax return shows a modest income of $60,000, but Sarah notices he drives a new $150,000 car, recently bought an investment property, and takes expensive overseas holidays.

Looking at the business structure, Sarah discovers John pays himself a low wage while the company covers his car, phone, meals, and travel. His lifestyle clearly doesn't match his declared income.

Sarah applied for a Change of Assessment under Reason 8A. She provided evidence of John's lifestyle, business records, and company expenses. The Registrar determined John's true financial position was much higher than his tax return suggested and increased his child support accordingly.`,
    },
    relatedCircumstanceId: 'income_resources_not_reflected',
    canonicalPath: '/change-of-assessment/income-property-resources',
  },
  {
    slug: 'earning-capacity',
    reasonNumber: '8B',
    officialCode: '5.2.9',
    title: 'Reason 8B: Earning Capacity - Child Support Change of Assessment',
    shortName: 'Earning Capacity',
    metaDescription:
      'Learn about Change of Assessment Reason 8B: When a parent is not working to their full earning capacity and could earn more if they chose to.',
    plainEnglishExplanation: `If you believe the other parent could earn more than they currently do, but chooses not to, you may be able to have the assessment changed. This is "Reason 8B" under the Child Support (Assessment) Act.

This reason applies when a parent:
- Voluntarily reduced their working hours after separation
- Quit a well-paying job without good reason
- Refuses to seek employment despite being able to work
- Works part-time when they could work full-time
- Takes a lower-paying job when better options are available

The Registrar looks at their qualifications, work history, job market, and any legitimate reasons for not working (like caring responsibilities or health issues).`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `Before separation, John worked as an IT manager earning $150,000 per year. Shortly after Sarah filed for child support, John quit his job and now works part-time as a barista earning $35,000.

John has a computer science degree, 15 years of IT experience, and no health issues preventing him from working. IT jobs in his field are readily available in their city.

Sarah applied for a Change of Assessment under Reason 8B. She provided evidence of John's qualifications, work history, and current job market for IT professionals. The Registrar determined John was deliberately underemployed and assessed his child support based on his earning capacity of $140,000, not his actual income of $35,000.`,
    },
    relatedCircumstanceId: 'earning_capacity',
    canonicalPath: '/change-of-assessment/earning-capacity',
  },
  {
    slug: 'duty-to-maintain-another',
    reasonNumber: '9',
    officialCode: '5.2.10',
    title: 'Reason 9: Duty to Maintain Another Person - Child Support Change of Assessment',
    shortName: 'Duty to Maintain Another',
    metaDescription:
      'Learn about Change of Assessment Reason 9: When you have a legal duty to financially support another person that affects your child support capacity.',
    plainEnglishExplanation: `If you have a legal obligation to financially maintain another person (not covered by Reason 7), you may be able to have your assessment changed. This is "Reason 9" under the Child Support (Assessment) Act.

This reason is similar to Reason 7 but applies more broadly to:
- Spousal maintenance orders from a previous relationship
- Caring for elderly or disabled relatives
- Supporting adult children with disabilities
- Court-ordered obligations to maintain another person

The key is that the obligation is legally required, not just voluntary support you choose to provide.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John has a court order requiring him to pay spousal maintenance of $1,500 per month to his first wife, Lisa, who has a disability. This was ordered before he married Sarah and had children with her.

After separating from Sarah, John's child support is calculated on his full income without considering his existing legal obligation to support Lisa.

John applied for a Change of Assessment under Reason 9. He provided the court order for Lisa's maintenance and evidence of his payments. The Registrar reduced his child support to Sarah to account for his pre-existing legal duty to maintain Lisa.`,
    },
    relatedCircumstanceId: 'duty_to_maintain',
    canonicalPath: '/change-of-assessment/duty-to-maintain-another',
  },
  {
    slug: 'other-special-circumstances',
    reasonNumber: '10',
    officialCode: '5.2.11',
    title: 'Reason 10: Other Special Circumstances - Child Support Change of Assessment',
    shortName: 'Other Special Circumstances',
    metaDescription:
      'Learn about Change of Assessment Reason 10: The catch-all ground for special circumstances not covered by other reasons. Includes just and equitable considerations.',
    plainEnglishExplanation: `If your situation doesn't fit neatly into Reasons 1-9 but you believe special circumstances make the standard assessment unfair, you may still be able to have it changed. This is "Reason 10" under the Child Support (Assessment) Act.

This catch-all reason considers whether, in the special circumstances of your case, the assessment is "just and equitable" (fair) to both parents and the children. It might apply when:

- You have an unusual combination of circumstances
- Something unexpected has changed your situation
- The formula produces a clearly unfair result in your case
- There are special circumstances the other reasons don't cover

The Registrar has broad discretion to consider any relevant factors.`,
    exampleScenario: {
      title: "John and Sarah's Story",
      content: `John was seriously injured in a workplace accident. While he receives workers compensation payments (which count as income for child support), he also has significant ongoing medical costs and has had to modify his home for wheelchair access.

None of the specific reasons quite fit John's situation - he's not supporting another person, and his income is accurately assessed. But his necessary medical and disability expenses mean the standard assessment leaves him unable to meet his own basic needs.

John applied for a Change of Assessment under Reason 10. He provided evidence of his injury, medical expenses, and necessary home modifications. The Registrar determined that in his special circumstances, the standard assessment was not just and equitable, and reduced his child support to reflect his genuine capacity to pay.`,
    },
    relatedCircumstanceId: 'property_settlement',
    canonicalPath: '/change-of-assessment/other-special-circumstances',
  },
] as const;

/**
 * Gets a CoA reason page by its URL slug
 *
 * @param slug - The URL slug to look up
 * @returns The matching CoAReasonPage, or undefined if not found
 */
export function getCoAReasonBySlug(slug: string): CoAReasonPage | undefined {
  return COA_REASON_PAGES.find((reason) => reason.slug === slug);
}

/**
 * Gets all slugs for static generation
 *
 * @returns Array of all reason slugs
 */
export function getAllCoAReasonSlugs(): string[] {
  return COA_REASON_PAGES.map((reason) => reason.slug);
}
