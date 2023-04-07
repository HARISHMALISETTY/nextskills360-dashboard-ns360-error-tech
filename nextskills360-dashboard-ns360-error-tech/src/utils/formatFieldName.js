// Function to format a string into a more user-friendly name
export const formatFieldName = (name) => {
    // split the original name by underscore and capitalize first letter of each word, then join with space
    const newName = name
        .split('_')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
    // return the formatted name
    return newName;
};

export const replaceSpaceWithUnderScore = (text) => {
    return text.replace(' ', '_');
};

/**
 * Converts the first letter of each word in a text string to uppercase.
 *
 * @param {string} text - The input text to be formatted.
 * @returns {string} The input text with the first letter of each word capitalized.
 */
export const upperCaseEachFirstLetterInText = (text) => {
    // Convert the input text to lowercase and replace the first letter of each word with its uppercase equivalent.
    return text.toLowerCase().replace(/\b(\w)/g, function (s) {
        return s.toUpperCase();
    });
};
