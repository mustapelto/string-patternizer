/*
*
* x - any letter
* a - any lowercase letter
* A - any uppercase letter
* d - any digit
* * - any symbol
* . - any character
* + - repeat preceding character 0-x times
* \ - escape sequence
* anything else - that character
* escape + any above - that character
*
*/

enum CharType {
    Invalid,
    Digit,
    Letter,
    Lowercase,
    Uppercase,
    Symbol,
    Any,
    Repeat,
    Escape,
    Specific
}

const isDigit = (value: string) => /\d/u.test(value);
const isLetter = (value: string) => /[A-Z]/iu.test(value);
const isLowercaseLetter = (value: string) => /[a-z]/u.test(value);
const isUppercaseLetter = (value: string) => /[A-Z]/u.test(value);

const getSourceCharType = (char: string, ignoreLetterCase?: boolean): CharType => {
    if (isDigit(char)) {
        return CharType.Digit;
    }
    if (ignoreLetterCase && isLetter(char)) {
        return CharType.Letter;
    }
    if (isLowercaseLetter(char)) {
        return CharType.Lowercase;
    }
    if (isUppercaseLetter(char)) {
        return CharType.Uppercase;
    }

    return CharType.Symbol;
};

const getPatternCharType = (char: string): CharType => {
    if (!char) {
        return CharType.Invalid;
    }

    switch (char) {
        case 'd':
            return CharType.Digit;
        case 'a':
            return CharType.Lowercase;
        case 'A':
            return CharType.Uppercase;
        case '_':
            return CharType.Letter;
        case '*':
            return CharType.Symbol;
        case '.':
            return CharType.Any;
        case '+':
            return CharType.Repeat;
        case '\\':
            return CharType.Escape;
        default:
            return CharType.Specific;
    }
};

const isLetterType = (charType?: CharType) => charType && ((charType === CharType.Letter) || (charType === CharType.Lowercase) || (charType === CharType.Uppercase));

const fitsPattern = (sourceType: CharType, patternType: CharType) =>
    (patternType === CharType.Any) ||
    (patternType === sourceType) ||
    (isLetterType(patternType) && isLetterType(sourceType));

const transformCaseIfRequired = (char: string, patternType: CharType) => {
    if (patternType === CharType.Lowercase) {
        return char.toLocaleLowerCase();
    }
    if (patternType === CharType.Uppercase) {
        return char.toLocaleUpperCase();
    }

    return char;
};

export const patternize = (pattern: string, source: string) => {
    let sourceIndex = 0;
    let patternIndex = 0;

    let result = '';

    while (patternIndex < pattern.length) {
        const sourceChar = source[sourceIndex];
        const patternChar = pattern[patternIndex];
        const prevPatternChar = pattern[patternIndex - 1];

        const prevPatternType = getPatternCharType(prevPatternChar);
        const patternType: CharType = (prevPatternType === CharType.Escape) ?
            CharType.Specific :
            getPatternCharType(patternChar);

        if (patternType === CharType.Escape) {
            // Start of escape sequence --> advance pattern index to read whole sequence
            patternIndex++;
        } else if (patternType === CharType.Specific) {
            // pattern demands specific character
            // - check if source has same character
            // - if yes: advance both indices
            // - if no: advance only pattern index (= character gets inserted)
            // - both cases: copy character from pattern string

            if (sourceChar === patternChar) {
                sourceIndex++;
            }
            patternIndex++;
            result += patternChar;
        } else {
            if (!sourceChar) {
                break;
            } // Source ended before pattern, pattern contains remaining non-specific characters --> incomplete input, abort processing

            const sourceType = getSourceCharType(sourceChar, patternType === CharType.Letter);

            if (patternType === CharType.Repeat) {
                if (prevPatternType === CharType.Invalid) {
                    throw new SyntaxError(`Invalid pattern: ${pattern}. "Repeat" ('+') not allowed at pattern start.`);
                }

                if (fitsPattern(sourceType, prevPatternType)) {
                    // current char still fits repeat pattern:
                    // - copy char and transform case if necessary
                    // - advance source index
                    // - don't advance pattern index
                    result += transformCaseIfRequired(sourceChar, prevPatternType);
                    sourceIndex++;
                } else {
                    // current char no longer fits repeat pattern:
                    // - don't advance source index (has to be tested against next pattern char
                    // - advance pattern index
                    patternIndex++;
                }
            } else if (fitsPattern(sourceType, patternType)) {
                // same type in source and pattern, or pattern allows any character:
                // - copy char and convert case if necessary
                // - advance both indices
                result += transformCaseIfRequired(sourceChar, patternType);
                sourceIndex++;
                patternIndex++;
            } else {
                // source doesn't match pattern --> ignore character
                sourceIndex++;
            }
        }
    }

    return result;
}