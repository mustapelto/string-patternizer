type CharType = 'number' | 'letter' | 'other';

const isNumber = (value: string) => /\d/.test(value);
const isLetter = (value: string) => /[A-Z]/i.test(value);
const isOther = (value: string) => /[^0-9A-Z]/i.test(value);

const getCharType = (char: string): CharType | undefined => {
    if (char.length === 0 || char.length > 1)
        return undefined;
    if (isNumber(char))
        return 'number';
    if (isLetter(char))
        return 'letter';
    if (isOther(char))
        return 'other';
    return undefined;
}

const getCharTypes = (value: string) => {
    let result: string[] = [];

    for (let i = 0; i < value.length; i++) {
        const def = getCharType(value[i]);

        if (def)
            result.push(def);
    }

    return result;
}

export const patternize = (source: string, pattern: string) => {
    const sourceTypes = getCharTypes(source);
    const patternTypes = getCharTypes(pattern);

    if (sourceTypes.length !== source.length) {
        throw new Error('Invalid patternize input: source contains invalid characters!');
    }
    
    if (patternTypes.length !== pattern.length) {
        throw new Error('Invalid patternize input: pattern contains invalid characters!');
    }

    let sourceIndex = 0;
    let patternIndex = 0;

    let result = '';

    while (sourceIndex < sourceTypes.length && patternIndex < patternTypes.length) {
        const sourceType = sourceTypes[sourceIndex];
        const patternType = patternTypes[patternIndex];
        const sourceChar = source[sourceIndex];
        const patternChar = pattern[patternIndex];

        if (sourceType === patternType) {
            // same type in source and pattern --> copy char and advance both indices
            result += sourceChar;
            sourceIndex++;
            patternIndex++;
        } else if (patternTypes[patternIndex] === 'other') {
            // pattern contains "delimiter" char not in source --> copy pattern char and advance pattern index
            result += patternChar;
            patternIndex++;
        } else {
            // source doesn't match pattern --> jump over
            sourceIndex++;
        }
    }

    return result;
}