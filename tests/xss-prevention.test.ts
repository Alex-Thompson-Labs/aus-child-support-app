/**
 * XSS Prevention Test
 * 
 * This file contains test cases to verify that the escapeHtml function
 * properly sanitizes user input to prevent XSS attacks.
 */

// Test the escapeHtml function
function escapeHtml(unsafe: string | null | undefined): string {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Test cases
const testCases = [
    {
        name: 'Script tag injection',
        input: '<script>alert("XSS")</script>',
        expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
    },
    {
        name: 'Image onerror injection',
        input: '<img src=x onerror=alert("XSS")>',
        expected: '&lt;img src=x onerror=alert(&quot;XSS&quot;)&gt;',
    },
    {
        name: 'Iframe injection',
        input: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        expected: '&lt;iframe src=&quot;javascript:alert(&#039;XSS&#039;)&quot;&gt;&lt;/iframe&gt;',
    },
    {
        name: 'Normal text with quotes',
        input: 'John "Johnny" O\'Brien',
        expected: 'John &quot;Johnny&quot; O&#039;Brien',
    },
    {
        name: 'Ampersands',
        input: 'Smith & Associates',
        expected: 'Smith &amp; Associates',
    },
    {
        name: 'Angle brackets in text',
        input: 'Income < $50,000',
        expected: 'Income &lt; $50,000',
    },
    {
        name: 'Null value',
        input: null,
        expected: '',
    },
    {
        name: 'Undefined value',
        input: undefined,
        expected: '',
    },
    {
        name: 'Empty string',
        input: '',
        expected: '',
    },
    {
        name: 'Complex XSS attempt',
        input: '"><script>alert(String.fromCharCode(88,83,83))</script>',
        expected: '&quot;&gt;&lt;script&gt;alert(String.fromCharCode(88,83,83))&lt;/script&gt;',
    },
];

// Run tests
console.log('Running XSS Prevention Tests...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase) => {
    const result = escapeHtml(testCase.input);
    const success = result === testCase.expected;

    if (success) {
        passed++;
        console.log(`✅ PASS: ${testCase.name}`);
    } else {
        failed++;
        console.log(`❌ FAIL: ${testCase.name}`);
        console.log(`   Input:    ${testCase.input}`);
        console.log(`   Expected: ${testCase.expected}`);
        console.log(`   Got:      ${result}`);
    }
});

console.log(`\n${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('\n✅ All tests passed! XSS prevention is working correctly.');
} else {
    console.log('\n❌ Some tests failed. Please review the implementation.');
    throw new Error(`${failed} test(s) failed`);
}
