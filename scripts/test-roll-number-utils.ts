import { normalizeRollNumber, formatRollNumber, isValidRollNumber, rollNumbersMatch } from "../lib/roll-number-utils";

/**
 * Test Suite for Roll Number Utilities
 * 
 * Run with: npx tsx scripts/test-roll-number-utils.ts
 */

console.log("🧪 Testing Roll Number Utilities\n");
console.log("=".repeat(60));

// Test 1: Normalization
console.log("\n✅ Test 1: Normalization");
console.log("-".repeat(60));

const testCases = [
    { input: "BSE-24F-623", expected: "bse24f623" },
    { input: "bse-24f-623", expected: "bse24f623" },
    { input: "BSE24F623", expected: "bse24f623" },
    { input: "bse24f623", expected: "bse24f623" },
    { input: "Bse-24F-623", expected: "bse24f623" },
    { input: "BSE 24F 623", expected: "bse24f623" },
    { input: "BSE_24F_623", expected: "bse24f623" },
];

testCases.forEach(({ input, expected }) => {
    const result = normalizeRollNumber(input);
    const status = result === expected ? "✅" : "❌";
    console.log(`${status} "${input}" → "${result}" ${result === expected ? "(PASS)" : `(FAIL - expected: ${expected})`}`);
});

// Test 2: Formatting
console.log("\n✅ Test 2: Formatting");
console.log("-".repeat(60));

const formatTests = [
    { input: "bse24f623", expected: "bse-24f-623" },
    { input: "BSE24F623", expected: "bse-24f-623" },
    { input: "csc21s100", expected: "csc-21s-100" },
];

formatTests.forEach(({ input, expected }) => {
    const result = formatRollNumber(input);
    const status = result === expected ? "✅" : "ℹ️";
    console.log(`${status} "${input}" → "${result}"`);
});

// Test 3: Validation
console.log("\n✅ Test 3: Validation");
console.log("-".repeat(60));

const validationTests = [
    { input: "BSE-24F-623", shouldBeValid: true },
    { input: "abc123", shouldBeValid: true },
    { input: "12345", shouldBeValid: false },  // No letters
    { input: "abcde", shouldBeValid: false },  // No numbers
    { input: "a1", shouldBeValid: false },     // Too short
    { input: "", shouldBeValid: false },
];

validationTests.forEach(({ input, shouldBeValid }) => {
    const result = isValidRollNumber(input);
    const status = result === shouldBeValid ? "✅" : "❌";
    console.log(`${status} "${input}" → ${result ? "VALID" : "INVALID"} ${result === shouldBeValid ? "(PASS)" : "(FAIL)"}`);
});

// Test 4: Matching
console.log("\n✅ Test 4: Roll Number Matching");
console.log("-".repeat(60));

const matchTests = [
    { roll1: "BSE-24F-623", roll2: "bse-24f-623", shouldMatch: true },
    { roll1: "BSE-24F-623", roll2: "BSE24F623", shouldMatch: true },
    { roll1: "bse24f623", roll2: "BSE-24F-623", shouldMatch: true },
    { roll1: "BSE-24F-623", roll2: "BSE-24F-624", shouldMatch: false },
    { roll1: "CSC-21S-100", roll2: "BSE-24F-623", shouldMatch: false },
];

matchTests.forEach(({ roll1, roll2, shouldMatch }) => {
    const result = rollNumbersMatch(roll1, roll2);
    const status = result === shouldMatch ? "✅" : "❌";
    console.log(`${status} "${roll1}" vs "${roll2}" → ${result ? "MATCH" : "NO MATCH"} ${result === shouldMatch ? "(PASS)" : "(FAIL)"}`);
});

// Summary
console.log("\n" + "=".repeat(60));
console.log("🎉 All tests completed!\n");

// Practical Examples
console.log("📝 Practical Examples:");
console.log("-".repeat(60));

const practicalExamples = [
    "BSE-24F-623",
    "bse-24f-623",
    "BSE24F623",
    "bse24f623",
];

console.log("\nThese roll numbers are all considered THE SAME:");
practicalExamples.forEach(roll => {
    console.log(`  - "${roll}" → normalized: "${normalizeRollNumber(roll)}"`);
});

console.log("\n✨ This means:");
console.log("  • They can't all register separately (duplicate prevention)");
console.log("  • Found ID cards will match regardless of format");
console.log("  • Searches will find them all\n");
