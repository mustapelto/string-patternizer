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
    expect((0, index_1.patternize)('aaa', '')).toBe('');
});
test('Digit', () => {
    expect((0, index_1.patternize)('ddd', '012')).toBe('012');
});
test('Letter', () => {
    expect((0, index_1.patternize)('___', 'abc')).toBe('abc');
});
test('Symbol', () => {
    expect((0, index_1.patternize)('***', '-+/')).toBe('-+/');
});
test('Any', () => {
    expect((0, index_1.patternize)('...', 'a*2')).toBe('a*2');
});
test('Fixed', () => {
    expect((0, index_1.patternize)('g#2', '')).toBe('g#2');
});
test('Escape sequence', () => {
    expect((0, index_1.patternize)('\\.\\*\\a', '')).toBe('.*a');
});
test('Remove non-matching', () => {
    expect((0, index_1.patternize)('ddd', '12abc3')).toBe('123');
});
test('Truncate', () => {
    expect((0, index_1.patternize)('___', 'abcde')).toBe('abc');
});
test('Add fixed characters', () => {
    expect((0, index_1.patternize)('"___"\\+dd="___dd"', 'abc12abc12')).toBe('"abc"+12="abc12"');
});
test('Case change', () => {
    expect((0, index_1.patternize)('AaaaAaaa', 'testCASE')).toBe('TestCase');
});
test('Repetition', () => {
    expect((0, index_1.patternize)('d+\\.a+', '1234abcd')).toBe('1234.abcd');
});
test('Repetition at start of pattern', () => {
    expect(() => (0, index_1.patternize)('+aaa', '123asd')).toThrow();
});
test('Digit', () => {
    expect((0, index_1.patternize)('d', '0')).toBe('0');
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
