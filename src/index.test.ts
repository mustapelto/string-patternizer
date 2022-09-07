import { patternize } from './index';

test('Empty inputs', () => {
    expect(patternize('', '')).toBe('');
});

test('Empty pattern', () => {
    expect(patternize('', 'some-text.123')).toBe('');
});

test('Empty source', () => {
    expect(patternize('aaa', '')).toBe('');
});

test('Digit', () => {
    expect(patternize('ddd', '012')).toBe('012');
});

test('Letter', () => {
    expect(patternize('___', 'abc')).toBe('abc');
});

test('Symbol', () => {
    expect(patternize('***', '-+/')).toBe('-+/');
});

test('Any', () => {
    expect(patternize('...', 'a*2')).toBe('a*2');
});

test('Fixed', () => {
    expect(patternize('g#2', '')).toBe('g#2');
});

test('Escape sequence', () => {
    expect(patternize('\\.\\*\\a', '')).toBe('.*a');
});

test('Remove non-matching', () => {
    expect(patternize('ddd', '12abc3')).toBe('123');
});

test('Truncate', () => {
    expect(patternize('___', 'abcde')).toBe('abc');
});

test('Add fixed characters', () => {
    expect(patternize('"___"\\+dd="___dd"', 'abc12abc12')).toBe('"abc"+12="abc12"');
});

test('Case change', () => {
    expect(patternize('AaaaAaaa', 'testCASE')).toBe('TestCase');
});

test('Repetition', () => {
    expect(patternize('d+\\.a+', '1234abcd')).toBe('1234.abcd');
});

test('Repetition at start of pattern', () => {
    expect(() => patternize('+aaa', '123asd')).toThrow();
});

test('Digit', () => {
    expect(patternize('d', '0')).toBe('0');
});

test('US phone number', () => {
    expect(patternize('(ddd) ddd dddd', '5551234567')).toBe('(555) 123 4567');
});

test('IPv4', () => {
    expect(patternize('ddd\\.ddd\\.ddd\\.ddd', '123123123123')).toBe('123.123.123.123');
});

test('Full name', () => {
    expect(patternize('Aa+ Aa+', 'firstname lastname')).toBe('Firstname Lastname');
});