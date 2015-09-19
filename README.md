spliddit
========

Spliddit - unicode-aware JS string splitting

Split a string into an array without munging emoji and other non-BMP characters.

##Why?

The native `String#split` implementation does not pay attention to [surrogate pairs](http://en.wikipedia.org/wiki/UTF-16). When the code units of a surrogate pair are split apart, they are not intelligible on their own. Unless they are put back together in the correct order, individual code units will cause problems in code that handles strings.

Consider:

```javascript
var emojiMessage = 'Hello 😤'

emojiMessage.split('').reverse().join('')
// => String with messed-up emoji
```

`spliddit` will correctly split the string into strings consisting of legible characters:

```javascript
var spliddit = require('spliddit')
var emojiMessage = 'Hello 😤'

spliddit(emojiMessage).reverse().join('')
// => '😤 olleH'
```

Also, since surrogate pairs take up two spaces in the Javascript string to represent a single character, `spliddit` can help you correctly count the number of code points (characters) in the string:

```javascript
var spliddit = require('spliddit')
var emoji = '🍔'
var han = '𠬠典'

emoji.length
// => 2
han.length
// => 3

spliddit(emoji).length
// => 1
spliddit(han).length
// => 2
```

Alternatively, you can pass `spliddit` an array that potentially has broken-apart surrogate pairs, and `spliddit` will return an array that has them put back together: 

```javascript
var myCoolString = '😎 Fooool'

// Messed-up array beginning with a split-apart surrogate pair :(
var myBustedArray = myCoolString.split('')

// Aww yeah cool guy is back
var myCoolFixedArray = spliddit(myBustedArray)
```

###Country Flags

Country flags like &#x1f1e6;&#x1f1f4; are composed of two *regional indicator* Unicode characters. Each regional indicator character is represented as a surrogate pair in JavaScript strings, so country flags take up 4 code units. The regional indicator symbols follow the alphabet, and the two regional indicators used follow the country's code.

(For example, &#x1f1ee;&#x1f1f9; , Italy's flag, is [`U+1F1EE 'REGIONAL INDICATOR SYMBOL LETTER I'`](http://www.fileformat.info/info/unicode/char/1F1EE/index.htm) then [`U+1F1F9 'REGIONAL INDICATOR SYMBOL LETTER T'`](http://www.fileformat.info/info/unicode/char/1F1F9/index.htm).)

`spliddit` will split pairs of regional indicator characters (4 total code units) into one character even though they consist of two Unicode code points.

###Skin tone emoji

Skin tone emojis (&#x1f487;&#x1f3ff;) are composed of a color-neutral emoji that depicts humans (&#x1F487;), followed by one of the 5 Unicode skin tone modifier characters ([&#x1F3FB;](http://www.fileformat.info/info/unicode/char/1F3FB/index.htm), [&#x1F3FC;](http://www.fileformat.info/info/unicode/char/1F3FC/index.htm), [&#x1F3FD;](http://www.fileformat.info/info/unicode/char/1F3FD/index.htm), [&#x1F3FE;](http://www.fileformat.info/info/unicode/char/1F3FE/index.htm), [&#x1F3FF;](http://www.fileformat.info/info/unicode/char/1F3FF/index.htm)). The emoji character and the skin tone modifier are each represented as a surrogate pair in JavaScript strings.

`spliddit` will split these sequences (4 total code units) into one character even though they consist of two Unicode code points.

##Other functions

###spliddit.hasPair(s)
Tells if `s` contains a surrogate pair.

```javascript
spliddit.hasPair('Look 👀 wow')
// => true
spliddit.hasPair('abcdef')
// => false
```

###spliddit.isFirstOfPair(c)
Tells if `c[0]` (the first item in `c`) is the first code unit of a surrogate pair. (Character codes 0xD800 through 0xDFFF)

```javascript
var s = '👴'
var sFirst = s[0]
var sArr = s.split('')

spliddit.isFirstOfPair(s)
// => true

spliddit.isFirstOfPair(sFirst)
// => true

spliddit.isFirstOfPair(sArr)
// => true

spliddit.isFirstOfPair(sArr[0])
// => true

spliddit.isFirstOfPair('a')
// => false
```
