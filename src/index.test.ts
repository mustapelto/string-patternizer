import { patternize } from './index';

test('Patternizer', () => {
    expect(patternize('', '02hello--123.4a')).toBe(['02', 'hello', '--', '123', '.', '4', 'a']);
});