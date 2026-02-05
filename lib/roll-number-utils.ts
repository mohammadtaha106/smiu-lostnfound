/**
 * Roll Number Normalization Utilities
 * 
 * Handles different formats of roll numbers:
 * - BSE-24F-623 (uppercase with dashes)
 * - bse-24f-623 (lowercase with dashes) ✅ Standard format
 * - BSE24F623 (uppercase without dashes)
 * - bse24f623 (lowercase without dashes)
 * - Any combination of above
 */

/**
 * Normalizes a roll number to a consistent format: lowercase without dashes or spaces
 * 
 * Examples:
 * - "BSE-24F-623" → "bse24f623"
 * - "bse-24f-623" → "bse24f623"
 * - "BSE 24F 623" → "bse24f623"
 * 
 * @param rollNumber - The roll number to normalize
 * @returns Normalized roll number (lowercase, no dashes/spaces)
 */
export function normalizeRollNumber(rollNumber: string | null | undefined): string {
    if (!rollNumber) return "";

    return rollNumber
        .toLowerCase()       // Convert to lowercase
        .replace(/[-_\s]/g, ""); // Remove dashes, underscores, and spaces
}

/**
 * Formats a normalized roll number to the standard display format
 * 
 * Example:
 * - "bse24f623" → "bse-24f-623"
 * 
 * @param rollNumber - The normalized roll number
 * @returns Formatted roll number with dashes
 */
export function formatRollNumber(rollNumber: string): string {
    const normalized = normalizeRollNumber(rollNumber);

    // Attempt to detect common patterns and format accordingly
    // Example: bse24f623 → bse-24f-623

    // Pattern: 3 letters + 2-3 chars + 1 letter + 3-4 digits
    const match = normalized.match(/^([a-z]{2,4})(\d{2,3})([a-z])(\d{3,4})$/);

    if (match) {
        return `${match[1]}-${match[2]}${match[3]}-${match[4]}`;
    }

    // Return normalized if pattern doesn't match
    return normalized;
}

/**
 * Validates if a roll number follows a basic pattern
 * 
 * @param rollNumber - The roll number to validate
 * @returns true if valid, false otherwise
 */
export function isValidRollNumber(rollNumber: string): boolean {
    const normalized = normalizeRollNumber(rollNumber);

    // Basic validation: should have at least 5 characters with letters and numbers
    const hasLetters = /[a-z]/.test(normalized);
    const hasNumbers = /\d/.test(normalized);
    const hasMinLength = normalized.length >= 5;

    return hasLetters && hasNumbers && hasMinLength;
}

/**
 * Compares two roll numbers for equality (case-insensitive, ignores formatting)
 * 
 * @param rollNumber1 - First roll number
 * @param rollNumber2 - Second roll number
 * @returns true if they're the same roll number
 */
export function rollNumbersMatch(
    rollNumber1: string | null | undefined,
    rollNumber2: string | null | undefined
): boolean {
    return normalizeRollNumber(rollNumber1) === normalizeRollNumber(rollNumber2);
}
