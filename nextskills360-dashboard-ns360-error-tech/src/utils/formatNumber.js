// A function to format a number with commas as thousand separators
export const formatNumber = (number) => {
    return number.toLocaleString('en-in');
};

// A function to get the ratio of two numbers after simplification
export const getRatio = (numerator, denominator) => {
    // A helper function that takes two numbers and returns their greatest common divisor (GCD)
    var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    // Return the simplified ratio in the form of "a:b"
    return [numerator / gcd, denominator / gcd].join(' : ');
};
