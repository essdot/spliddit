var test = require('tape')

var spliddit = require('../index')

test('emoji in middle', function(t) {
  var result = spliddit('abc😤def')

  t.deepEqual(result, ['a', 'b', 'c', '😤', 'd', 'e', 'f'])
  t.end()
})

test('emoji start', function(t) {
  var s = '🍕abd'

  t.deepEqual(spliddit(s), ['🍕', 'a', 'b', 'd'])
  t.end()
})

test('emoji end', function(t) {
  var s = '123🍥'

  t.deepEqual(spliddit(s), ['1', '2', '3', '🍥'])
  t.end()
})

test('emoji party', function(t) {
  var result = spliddit('🍕⚽⛵✨⏳☕⏰🇯🇲😍👍💅😋👭👯✊👸🏽')

  t.deepEqual(result, [
    '🍕', '⚽', '⛵', '✨', '⏳', '☕', '⏰', '🇯🇲',
    '😍','👍', '💅', '😋', '👭', '👯', '✊', '👸🏽'
  ])

  t.end()
})

test('check', function(t) {
  var result = spliddit('123🍕✓')

  t.deepEqual(result, ['1', '2', '3', '🍕', '✓'])
  t.end()
})

test('reverse string', function(t) {
  var s = '123🍕✓'

  var sReverse = spliddit(s).reverse().join('')
  var sReverse2 = spliddit(sReverse).reverse().join('')

  t.equal('✓🍕321', sReverse)
  t.equal(s, sReverse2)
  t.end()
})

test('single char', function(t) {
  var s = 'a'

  t.deepEqual(spliddit(s), ['a'])
  t.end()
})

test('regular string', function(t) {
  var s = 'Hello how are you'
  var arr = spliddit(s)

  t.equal(arr.length, 17)
  t.equal(arr[0], 'H')
  t.equal(arr[16], 'u')
  t.end()
})

test('chinese', function(t) {
  var s = '𨭎", "𠬠", and "𩷶"'
  var result = spliddit(s)

  t.equal(result.length, 16)
  t.equal(result[0], '𨭎')
  t.equal(result[1], '"')
  t.equal(result[5], '𠬠')
  t.equal(result[6], '"')
  t.equal(result[14], '𩷶')
  t.equal(result[15], '"')
  t.end()
})

test('en dash', function(t) {
  var s = 'and then–boom'
  var result = spliddit(s)

  t.equal(result.length, 13)
  t.equal(result[8], '–')

  s = 'ab–c'
  result = spliddit(s)
  t.deepEqual(result, ['a', 'b', '–', 'c'])
  t.end()
})

test('math script', function(t) {
  var s = '𝒞𝒯𝒮𝒟'

  t.deepEqual(spliddit(s), ['𝒞', '𝒯', '𝒮', '𝒟'])
  t.end()
})

test('fraktur', function(t) {
  var s = '𝔅𝔎'

  t.deepEqual(spliddit(s), ['𝔅', '𝔎'])
  t.end()
})

test('acrophonic', function(t) {
  var s = '𐅧, 𐅨, and 𐅩'
    , result = spliddit(s)

  t.equal(result.length, 11)
  t.equal(result[0], '𐅧')
  t.equal(result[1], ',')
  t.equal(result[3], '𐅨')
  t.equal(result[4], ',')
  t.equal(result[10], '𐅩')
  t.end()
})

test('pass in munged array', function(t) {
  var emojiString = 'No 🙅'
  var arr = emojiString.split('')

  t.deepEqual(spliddit(arr), spliddit(emojiString))
  t.deepEqual(spliddit(arr), ['N', 'o', ' ', '🙅'])
  t.end()
})

test('throws for null and undefined', function(t) {
  var undefinedFunction = function() { spliddit(void 0)}
  var nullFunction = function() { spliddit(null)}

  t.throws(undefinedFunction)
  t.throws(nullFunction)
  t.end()
})

test('arabic', function(t) {
  var s = 'ځڂڃڄڅچڇڈ'

  t.deepEqual(spliddit(s), ['ځ', 'ڂ', 'ڃ', 'ڄ', 'څ', 'چ', 'ڇ', 'ڈ'])
  t.end()
})

test('country flags/regional indicator characters', function(t) {
  var s = '🇦🇸' // American Samoa flag
  var flagInMiddle = 'Sup 🇮🇹 Italy' // Italian flag in middle

  t.deepEqual(spliddit(s), [s])
  t.equal(spliddit(s).join(''), s)

  t.equal(spliddit(flagInMiddle).length, 11)
  t.equal(spliddit(flagInMiddle).join(''), flagInMiddle)
  t.end()
})

test('emoji with skin tone indicators', function(t) {
  var s = '🎅🏻🎅🏼🎅🏽🎅🏾🎅🏿'
  var s2 = 'hi santa 🎅🏾 lol'

  t.deepEqual(spliddit(s), ['🎅🏻','🎅🏼','🎅🏽','🎅🏾','🎅🏿'])
  t.equal(spliddit(s).join(''), s)
  t.equal(spliddit(s2).length, 14)
  t.equal(spliddit(s2).join(''), s2)
  t.end()
})

test('has pair', function(t) {
  t.ok(spliddit.hasPair('hello 𝔎 what\'s up'))
  t.ok(spliddit.hasPair('👔'))
  t.ok(spliddit.hasPair('𐅕'))

  t.equal(spliddit.hasPair('hello'), false)
  t.equal(spliddit.hasPair('ڃ'), false)
  t.equal(spliddit.hasPair('–'), false)
  t.end()
})

test('first of pair', function(t) {
  t.ok(spliddit.isFirstOfPair('🐳'))
  t.ok(spliddit.isFirstOfPair(['🐣']))
  t.ok(spliddit.isFirstOfPair('🚯'.charAt(0)))
  t.ok(spliddit.isFirstOfPair(['🔫'.charAt(0)]))
  t.ok(spliddit.isFirstOfPair(String.fromCharCode(0xD801)))

  t.equal(spliddit.isFirstOfPair('a'), false)
  t.equal(spliddit.isFirstOfPair('Hello'), false)
  t.equal(spliddit.isFirstOfPair('–'), false)
  t.end()
})
