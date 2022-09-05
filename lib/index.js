"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternize = void 0;
var CharType;
(function (CharType) {
    CharType[CharType["None"] = -1] = "None";
    CharType[CharType["Number"] = 0] = "Number";
    CharType[CharType["Letter"] = 1] = "Letter";
    CharType[CharType["Other"] = 2] = "Other";
})(CharType || (CharType = {}));
const isNumber = (value) => /\d/.test(value);
const isLetter = (value) => /[A-Z]/i.test(value);
const isOther = (value) => /[^0-9A-Z]/i.test(value);
const getBlocks = (value) => {
    let result = [];
    let buffer = '';
    let lastType = CharType.None;
    console.log('test');
    for (let i = 0; i < value.length; i++) {
        const current = value[i];
        let currentType;
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
        }
        else {
            result.push(buffer);
            buffer = '';
            lastType = currentType;
        }
        console.log(current);
        console.log(currentType);
    }
    return result;
};
const patternize = (value, pattern) => {
    return getBlocks(pattern);
};
exports.patternize = patternize;
