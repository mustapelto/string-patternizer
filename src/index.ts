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

const isDigit = (value: string) => /\d/.test(value);
const isLetter = (value: string) => /[A-Z]/i.test(value);
const isLowercaseLetter = (value: string) => /[a-z]/.test(value);
const isUppercaseLetter = (value: string) => /[A-Z]/.test(value);

const getSourceCharType = (char: string, ignoreLetterCase?: boolean): CharType => {
    if (char.length !== 1)
        throw new SyntaxError(`Syntax error: getSourceCharType(${char}). Argument must be a string of length 1.`);

    if (isDigit(char))
        return CharType.Digit;
    if (ignoreLetterCase && isLetter(char))
        return CharType.Letter;
    if (isLowercaseLetter(char))
        return CharType.Lowercase;
    if (isUppercaseLetter(char))
        return CharType.Uppercase;
    return CharType.Symbol;
}

const getPatternCharType = (char: string): CharType => {
    if (char.length !== 1)
        throw new SyntaxError(`Syntax error: getPatternCharType(${char}). Argument must be a string of length 1.`);

    switch (char) {
        case 'd': return CharType.Digit;
        case 'x': return CharType.Letter;
        case 'a': return CharType.Lowercase;
        case 'A': return CharType.Uppercase;
        case '*': return CharType.Symbol;
        case '.': return CharType.Any;
        case '+': return CharType.Repeat;
        case '\\': return CharType.Escape;
        default: return CharType.Specific;
    }
}

const isLetterType = (charType?: CharType) => charType && ((charType === CharType.Letter) || (charType === CharType.Lowercase) || (charType === CharType.Uppercase));

const fitsPattern = (sourceType: CharType, patternType: CharType) =>
    (patternType === CharType.Any) || 
    (patternType === sourceType) ||
    (isLetterType(patternType) && isLetterType(sourceType));

const transformCaseIfRequired = (char: string, patternType: CharType) => {
    if (char.length !== 1)
        throw new Error(`Syntax error: transformCaseIfRequired(${char}, ${patternType}). First argument must be a string of length 1.`);
    
    if (patternType === CharType.Lowercase)
        return char.toLocaleLowerCase();
    else if (patternType === CharType.Uppercase)
        return char.toLocaleUpperCase();
    else
        return char;
}

export const patternize = (pattern: string, source: string) => {
    let sourceIndex = 0;
    let patternIndex = 0;

    let result = '';

    let patternType: CharType;
    let prevPatternType: CharType | undefined = undefined;

    while (patternIndex < pattern.length) {
        const sourceChar = source[sourceIndex] || undefined;
        const patternChar = pattern[patternIndex];
        
        if (prevPatternType === CharType.Escape) {
            patternType = CharType.Specific;
        } else {
            patternType = getPatternCharType(patternChar);
        }

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
            if (!sourceChar)
                break; // Source ended before pattern, pattern contains remaining non-specific characters --> incomplete input, abort processing
        
            const sourceType = getSourceCharType(sourceChar, patternType === CharType.Letter);

            if (patternType === CharType.Repeat) {
                if (!prevPatternType) {
                    throw new SyntaxError(`Invalid pattern: ${pattern}. "Repeat" ('+') not allowed at pattern start.`);
                }

                if (fitsPattern(sourceType, prevPatternType)) {
                    // current char still fits repeat pattern:
                    // - copy char and transform case if necessary
                    // - advance source index
                    // - skip prevPatternType update
                    result += transformCaseIfRequired(sourceChar, prevPatternType);
                    sourceIndex++;
                    continue;
                } else {
                    // current char no longer fits repeat pattern:
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

        prevPatternType = patternType;
    }

    return result;
}