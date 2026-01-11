/**
 * List of reciprocating jurisdictions for child support assessment.
 * These are countries that have an agreement with Australia regarding child support.
 * 
 * Source: Captured from reciprocating jurisdictions documentation (2026).
 */
export const RECIPROCATING_JURISDICTIONS = [
    "Albania",
    "Algeria",
    "Andorra",
    "Argentina",
    "Austria",
    "Barbados",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Brazil",
    "Burkina Faso",
    "Canada, except Quebec",
    "Cape Verde",
    "Central African Republic",
    "Chile",
    "Colombia",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Ecuador",
    "Estonia",
    "Fiji",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Guatemala",
    "Haiti",
    "Holy See, The",
    "Hong Kong",
    "Hungary",
    "India",
    "Ireland",
    "Italy",
    "Kazakhstan",
    "Kenya",
    "Kyrgyzstan",
    "Liberia",
    "Lithuania",
    "Luxembourg",
    "Malawi",
    "Malaysia",
    "Malta",
    "Mexico",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Morocco",
    "Nauru",
    "Netherlands",
    "New Zealand",
    "Niger",
    "North Macedonia",
    "Norway",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Romania",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Tanzania, except Zanzibar",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Ukraine",
    "United Kingdom, includes Alderney, Gibraltar, Guernsey, Isle of Man, Jersey, Sark",
    "United States of America",
    "Uruguay",
    "Zambia",
    "Zimbabwe"
] as const;

export type ReciprocatingJurisdiction = typeof RECIPROCATING_JURISDICTIONS[number];

/**
 * List of excluded jurisdictions.
 * These are countries that can't accept Australian assessments.
 * We can't make a child support assessment if the other parent lives in one of these countries.
 * You may be able to get an Australian court order which we can send to the other country.
 * 
 * Source: Captured from excluded jurisdictions documentation (2026).
 */
export const EXCLUDED_JURISDICTIONS = [
    "Brunei Darussalam",
    "Cook Islands",
    "Israel",
    "Niue",
    "Papua New Guinea",
    "Samoa",
    "Yukon, in Canada"
] as const;

export type ExcludedJurisdiction = typeof EXCLUDED_JURISDICTIONS[number];

/**
 * Non-reciprocating jurisdictions.
 * These are any countries that aren't on the RECIPROCATING_JURISDICTIONS or EXCLUDED_JURISDICTIONS lists.
 * We can't make a child support assessment. We also can't send an Australian court order to the other country.
 */
