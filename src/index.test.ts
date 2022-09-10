import { patternize } from './index';
import { expect } from 'chai';

describe('empty results', function() {
    it('should return an empty string when pattern and source are empty', function() {
        expect(patternize('', '')).to.equal('');
    });

    it('should return an empty string for any source when pattern is empty', function() {
        expect(patternize('', 'asdf-+.123xoASDF')).to.equal('');
    });

    it('should return an empty string for any pattern not containing fixed characters when source is empty', function() {
        expect(patternize('aaddA-.*da', '')).to.equal('');
    });
});

describe('single character tests', function() {
    it('should return the source digits', function() {
        const source = '012';
        expect(patternize('ddd', source)).to.equal(source);
    });

    it('should return the source letters without changing case', function() {
        const source = 'AbcD';
        expect(patternize('____', source)).to.equal(source);
    });

    it('should return the source symbols', function() {
        const source = '-+/';
        expect(patternize('***', source)).to.equal(source);
    });

    it('should return any characters in the source', function() {
        const source = 'a+2*D';
        expect(patternize('.....', source)).to.equal(source);
    });

    it('should return the characters in the pattern', function() {
        const pattern = 'g#X2';
        expect(patternize(pattern, '')).to.equal(pattern);
    });

    it('should return the escaped characters in the pattern', function() {
        expect(patternize('\\.\\*\\a', '')).to.equal('.*a');
    });
});

describe('basic modification tests', function() {
    it('should remove non-matching characters', function() {
        expect(patternize('dddaaa', '12abc3d45ef6')).to.equal('123def');
    });

    it('should truncate the source to the pattern\'s length', function() {
        expect(patternize('___', 'abcdef')).to.equal('abc');
    });

    it('should add missing fixed characters', function() {
        expect(patternize('"___"\\+dd="___dd"', 'abc12abc12')).to.equal('"abc"+12="abc12"');
    });

    it('should change the source letters\' case to match the pattern', function() {
        expect(patternize('AaaaAaaa', 'testCASE')).to.equal('TestCase');
    });

    it('should output repeating character types', function() {
        expect(patternize('d+\\.a+', '1234abcd')).to.equal('1234.abcd');
    });
});

describe('invalid pattern tests', function() {
    it('should throw if the pattern starts with a \'+\' (repetition)', function() {
        expect(() => { patternize('+aaa', '123asd') }).to.throw();
    });
});

describe('specific pattern tests', function() {
    it('should convert the source string to US phone number format', function() {
        expect(patternize('(ddd) ddd dddd', '5551234567')).to.equal('(555) 123 4567');
    });

    it('should convert the source string to IPv4 format', function() {
        expect(patternize('ddd\\.ddd\\.ddd\\.ddd', '123123123123')).to.equal('123.123.123.123');
    });

    it('should convert any two-part string into a "Firstname Lastname" form', () => {
        expect(patternize('Aa+ Aa+', 'lowercase fullname')).to.equal('Lowercase Fullname');
    });
});