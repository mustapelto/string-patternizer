"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
test('Empty inputs', () => {
    expect((0, index_1.patternize)('', '')).toBe('');
});
test('Empty pattern', () => {
    expect((0, index_1.patternize)('', 'some-text.123')).toBe('');
});
test('Empty source', () => {
    expect((0, index_1.patternize)('fixe\\d\\.aaa', '')).toBe('fixed.');
});
test('US phone number', () => {
    expect((0, index_1.patternize)('(ddd) ddd dddd', '5551234567')).toBe('(555) 123 4567');
});
test('IPv4', () => {
    expect((0, index_1.patternize)('ddd\\.ddd\\.ddd\\.ddd', '123123123123')).toBe('123.123.123.123');
});
test('Full name', () => {
    expect((0, index_1.patternize)('Aa+ Aa+', 'firstname lastname')).toBe('Firstname Lastname');
});
