"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternize = void 0;
var CharType;
(function (CharType) {
    CharType[CharType["Digit"] = 0] = "Digit";
    CharType[CharType["Letter"] = 1] = "Letter";
    CharType[CharType["Lowercase"] = 2] = "Lowercase";
    CharType[CharType["Uppercase"] = 3] = "Uppercase";
    CharType[CharType["Symbol"] = 4] = "Symbol";
    CharType[CharType["Any"] = 5] = "Any";
    CharType[CharType["Repeat"] = 6] = "Repeat";
    CharType[CharType["Escape"] = 7] = "Escape";
    CharType[CharType["Specific"] = 8] = "Specific";
})(CharType || (CharType = {}));
const isDigit = (value) => /\d/.test(value);
const isLetter = (value) => /[A-Z]/i.test(value);
const isLowercaseLetter = (value) => /[a-z]/.test(value);
const isUppercaseLetter = (value) => /[A-Z]/.test(value);
const getSourceCharType = (char, ignoreLetterCase) => {
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
};
const getPatternCharType = (char) => {
    if (char.length !== 1)
        throw new SyntaxError(`Syntax error: getPatternCharType(${char}). Argument must be a string of length 1.`);
    switch (char) {
        case 'd': return CharType.Digit;
        case 'a': return CharType.Lowercase;
        case 'A': return CharType.Uppercase;
        case '_': return CharType.Letter;
        case '*': return CharType.Symbol;
        case '.': return CharType.Any;
        case '+': return CharType.Repeat;
        case '\\': return CharType.Escape;
        default: return CharType.Specific;
    }
};
const isLetterType = (charType) => charType && ((charType === CharType.Letter) || (charType === CharType.Lowercase) || (charType === CharType.Uppercase));
const fitsPattern = (sourceType, patternType) => (patternType === CharType.Any) ||
    (patternType === sourceType) ||
    (isLetterType(patternType) && isLetterType(sourceType));
const transformCaseIfRequired = (char, patternType) => {
    if (char.length !== 1)
        throw new Error(`Syntax error: transformCaseIfRequired(${char}, ${patternType}). First argument must be a string of length 1.`);
    if (patternType === CharType.Lowercase)
        return char.toLocaleLowerCase();
    else if (patternType === CharType.Uppercase)
        return char.toLocaleUpperCase();
    else
        return char;
};
const patternize = (pattern, source) => {
    let sourceIndex = 0;
    let patternIndex = 0;
    let result = '';
    let patternType;
    let prevPatternType = undefined;
    while (patternIndex < pattern.length) {
        const sourceChar = source[sourceIndex] || undefined;
        const patternChar = pattern[patternIndex];
        if (prevPatternType === CharType.Escape) {
            patternType = CharType.Specific;
        }
        else {
            patternType = getPatternCharType(patternChar);
        }
        if (patternType === CharType.Escape) {
            // Start of escape sequence --> advance pattern index to read whole sequence
            patternIndex++;
        }
        else if (patternType === CharType.Specific) {
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
        }
        else {
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
                }
                else {
                    // current char no longer fits repeat pattern:
                    // - advance pattern index
                    patternIndex++;
                }
            }
            else if (fitsPattern(sourceType, patternType)) {
                // same type in source and pattern, or pattern allows any character:
                // - copy char and convert case if necessary
                // - advance both indices
                result += transformCaseIfRequired(sourceChar, patternType);
                sourceIndex++;
                patternIndex++;
            }
            else {
                // source doesn't match pattern --> ignore character
                sourceIndex++;
            }
        }
        prevPatternType = patternType;
    }
    return result;
};
exports.patternize = patternize;
