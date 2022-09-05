"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
test('Patternizer', () => {
    expect((0, index_1.patternize)('', '02hello--123.4a')).toBe(['02', 'hello', '--', '123', '.', '4', 'a']);
});
