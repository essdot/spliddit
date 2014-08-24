var assert = require('assert')
var spliddit = require('../index')

suite('spliddit', function() {
  test('emoji in middle', function() {
    var result = spliddit('abc😤def')

    assert.deepEqual(result, [
        'a'
      , 'b'
      , 'c'
      , '😤'
      , 'd'
      , 'e'
      , 'f'
    ])
  })

  test('emoji start', function() {
    var s = '🍕abd'

    assert.deepEqual(spliddit(s), [
        '🍕'
      , 'a'
      , 'b'
      , 'd'
    ])
  })

  test('emoji end', function() {
    var s = '123🍥'

    assert.deepEqual(spliddit(s), [
        '1'
      , '2'
      , '3'
      , '🍥'
    ])
  })

  test('emoji party', function() {
    var result = spliddit('🍕⚽⛵✨⏳☕⏰😍👍💅😋👭👯✊')

    assert.deepEqual(result, [
        '🍕'
      , '⚽'
      , '⛵'
      , '✨'
      , '⏳'
      , '☕'
      , '⏰'
      , '😍'
      , '👍'
      , '💅'
      , '😋'
      , '👭'
      , '👯'
      , '✊'
    ])
  })

  test('check', function() {
    var result = spliddit('123🍕✓')

    assert.deepEqual(result, ['1', '2', '3', '🍕', '✓'])
  })

  test('reverse string', function() {
    var s = '123🍕✓'

    var sReverse = spliddit(s).reverse().join('')
    var sReverse2 = spliddit(sReverse).reverse().join('')

    assert.equal('✓🍕321', sReverse)
    assert.equal(s, sReverse2)
  })

  test('single char', function() {
    var s = 'a'
      , result = spliddit(s)

    assert.deepEqual(result, ['a'])
  })

  test('regular string', function() {
    var s = 'Hello how are you'
      , arr = spliddit(s)

    assert.equal(arr.length, 17)
    assert.equal(arr[0], 'H')
    assert.equal(arr[16], 'u')
  })

  test('chinese', function() {
    var s = '𨭎", "𠬠", and "𩷶"'
      , result = spliddit(s)

    assert.equal(result.length, 16)
    assert.equal(result[0], '𨭎')
    assert.equal(result[1], '"')
    assert.equal(result[5], '𠬠')
    assert.equal(result[6], '"')
    assert.equal(result[14], '𩷶')
    assert.equal(result[15], '"')
  })

  test('en dash', function() {
    var s = 'and then–boom'
      , result = spliddit(s)

    assert.equal(result.length, 13)
    assert.equal(result[8], '–')

    s = 'ab–c'
    result = spliddit(s)
    assert.deepEqual(result, ['a', 'b', '–', 'c'])
  })

  test('math script', function() {
    var s = '𝒞𝒯𝒮𝒟'

    assert.deepEqual(spliddit(s), ['𝒞', '𝒯', '𝒮', '𝒟'])
  })

  test('fraktur', function() {
    var s = '𝔅𝔎'

    assert.deepEqual(spliddit(s), ['𝔅', '𝔎'])
  })

  test('acrophonic', function() {
    var s = '𐅧, 𐅨, and 𐅩'
      , result = spliddit(s)

    assert.equal(result.length, 11)
    assert.equal(result[0], '𐅧')
    assert.equal(result[1], ',')
    assert.equal(result[3], '𐅨')
    assert.equal(result[4], ',')
    assert.equal(result[10], '𐅩')
  })

  test('pass in munged array', function() {
    var emojiString = 'No 🙅'
    var arr = emojiString.split('')

    assert(spliddit(arr), spliddit(emojiString))
    assert.deepEqual(spliddit(arr), [
        'N'
      , 'o'
      , ' '
      , '🙅'
    ])
  })

  test('arabic', function() {
    var s = 'ځڂڃڄڅچڇڈ'

    assert.deepEqual(spliddit(s), [
        'ځ'
      , 'ڂ'
      , 'ڃ'
      , 'ڄ'
      , 'څ'
      , 'چ'
      , 'ڇ'
      , 'ڈ'
    ])
  })
})

suite('has pair', function() {
  test('has pair', function(){
    assert(spliddit.hasPair('hello 𝔎 what\'s up'))
    assert(spliddit.hasPair('👔'))
    assert(spliddit.hasPair('𐅕'))

    assert.equal(spliddit.hasPair('hello'), false)
    assert.equal(spliddit.hasPair('ڃ'), false)
    assert.equal(spliddit.hasPair('–'), false)
  })
})
