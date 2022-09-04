enum CharType {
    None = -1,
    Number,
    Letter,
    Other
}

const isNumber = (value: string) => /\d/.test(value);
const isLetter = (value: string) => /[A-Z]/i.test(value);
const isOther = (value: string) => /[^0-9A-Z]/i.test(value);

const getBlocks = (value: string) => {
    let result: string[] = [];
    let buffer = '';
    let lastType: CharType = CharType.None;

    for (let i = 0; i < value.length; i++) {
        const current = value[i];
        let currentType: CharType;
        if (isNumber(current))
            currentType = CharType.Number;
        else if (isLetter(current))
            currentType = CharType.Letter;
        else if (isOther(current))
            currentType = CharType.Other;
        else
            currentType = CharType.None;

        if (lastType === currentType) {
            buffer.concat(current);
        } else {
            result.push(buffer);
            buffer = '';
            lastType = currentType;
        }
    }

    return result;
}

export const patternize = (value: string, pattern: string) => {
    return getBlocks(pattern);
}