spliddit
========

Spliddit - unicode-aware JS string splitting

Split a string into an array without munging emoji and other non-BMP characters.

##Why?

The native `String#split` implementation does not pay attention to [surrogate pairs](http://en.wikipedia.org/wiki/UTF-16). The two code units in the pair get split apart and then sad things happen.

Consider:

```javascript
var emojiMessage = 'Hello 😤'

emojiString.split('').reverse().join('')
// => String with messed-up emoji
```

`spliddit` will correctly split the string into strings consisting of legible characters:

```javascript
var spliddit = require('spliddit')
var emojiMessage = 'Hello 😤'

spliddit(emojiString).reverse().join('')
// => '😤 olleH'
```

Also, since surrogate pairs take up two spaces in the Javascript string for a single character, `spliddit` can help you correctly count the number of characters in the string:

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
var myCoolString = '💪 Hey Ladies'

// Messed-up array beginning with a split-apart surrogate pair :(
var myBustedArray = myCoolString.split('')

// Aww yeah the gun show is back
var myCoolFixedArray = spliddit(myBustedArray)
```
##Other functions

##spliddit.hasPair(s)
Tells if `s` contains a surrogate pair.

```javascript
spliddit.hasPair('Look 👀 wow')
// => true
spliddit.hasPair('abcdef')
// => false
```

##spliddit.isFirstOfPair(c)
Tells if the first item in `c` (`c[0]`) is the first part of a surrogate pair. (Character codes 0xD800 through 0xDFFF)

```javascript
var s = '👴'
var sFirst = s[0]
var sArr = s.split('')

spliddit.isFirstOfPair(s)
// => true

spliddit.isFirstOfPair(sFirst)
// => true

spliddit.isFirstOfPair(sArr[0])
// => true

spliddit.isFirstOfPair('please 💍 ?')
// => false
```
