/**
 * Comprehensive list of all countries for international jurisdiction selection.
 * Sorted alphabetically for easy navigation in dropdown/picker.
 */

export const ALL_COUNTRIES = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Canada, except Quebec',
    'Cape Verde',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Democratic Republic of the Congo',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Holy See, The',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Tanzania, except Zanzibar',
    'Thailand',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United Kingdom, includes Alderney, Gibraltar, Guernsey, Isle of Man, Jersey, Sark',
    'United States of America',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Yukon, in Canada',
    'Zambia',
    'Zimbabwe',
] as const;

export type Country = (typeof ALL_COUNTRIES)[number];

/**
 * Check if a country string matches any entry in the countries list.
 * Uses case-insensitive matching and handles partial matches.
 *
 * @param input - The user input string to search for
 * @returns Array of matching countries, sorted by relevance
 */
export function searchCountries(input: string): string[] {
    if (!input || input.trim().length === 0) {
        return [...ALL_COUNTRIES];
    }

    const searchTerm = input.toLowerCase().trim();

    // Filter countries that contain the search term
    const matches = ALL_COUNTRIES.filter((country) =>
        country.toLowerCase().includes(searchTerm)
    );

    // Sort: exact start matches first, then alphabetically
    return matches.sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(searchTerm);
        const bStartsWith = b.toLowerCase().startsWith(searchTerm);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
    });
}

/**
 * Sanitize and normalize a country string.
 *
 * @param country - The country string to sanitize
 * @returns Sanitized country name or empty string if invalid
 */
export function sanitizeCountry(country: string | undefined | null): string {
    if (!country || typeof country !== 'string') {
        return '';
    }

    // Trim and normalize whitespace
    const sanitized = country.trim().replace(/\s+/g, ' ');

    // Validate it's a known country (case-insensitive match)
    const match = ALL_COUNTRIES.find(
        (c) => c.toLowerCase() === sanitized.toLowerCase()
    );

    return match || sanitized;
}
