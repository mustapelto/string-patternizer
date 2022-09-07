import { patternize } from './index';

test('Empty inputs', () => {
    expect(patternize('', '')).toBe('');
});

test('Empty pattern', () => {
    expect(patternize('', 'some-text.123')).toBe('');
});

test('Empty source', () => {
    expect(patternize('fixe\\d\\.aaa', '')).toBe('fixed.');
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