[![codecov](https://codecov.io/gh/mustapelto/string-patternizer/branch/main/graph/badge.svg?token=TGKZZDARZZ)](https://codecov.io/gh/mustapelto/string-patternizer)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/mustapelto/string-patternizer/build)

# string-patternizer

## Overview

---

Inspired by (but not copied from) [format-string-by-pattern](https://github.com/arthurdenner/format-string-by-pattern). Converts any string to match a given pattern. Currently supports
letters (case-sensitive or -insensitive), digits, symbols, "any character" and specific/required characters.

## Install

---

    yarn add string-patternizer

    npm i string-patternizer

    pnpm add string-patternizer

## Usage

---

### patternize(pattern, source)

Returns a `string` based on `source`, formatted according to `pattern`.

Note that this is *not* a validation tool: it will only convert strings according to the pattern provided, but not otherwise check for their content.
In other words, no function is provided to e.g. limit an IP address string to numbers smaller than 256.

**pattern**: `string`

Describes how the input should be formatted.

Characters with special meaning:
- d: any digit
- a: any lowercase letter
- A: any uppercase letter
- _: any letter
- *: any "other" (not digit or letter) character
- .: any character
- +: repeat previous character type 0-infinite times
- \: start of escape sequence

Any other character will be interpreted as "required", i.e. will automatically be copied *as-is* into the result string, even if not present in the source string.
The special characters above need to be escaped to be used as "required".

**source**: `string`

The input value to be formatted.

### Example usage:

    import patternize from 'string-patternizer'

    // US phone number (including country code)
    patternize('5551234567', '\+1 (ddd) ddd dddd');
    // '+1 (555) 123 4567'

    // Full name
    patternize('firstname lastname', 'Aa+ Aa+');
    // 'Firstname Lastname'

    // IP address (format only, no validation i.e. numbers over 255 are possible)
    patternize('111222333444', 'ddd\.ddd\.ddd\.ddd');
    // '111.222.333.444'

    // Currency
    patternize('1234', 'd+\.dd€');
    // '12.34€'