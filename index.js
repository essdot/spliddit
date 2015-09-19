module.exports = spliddit
module.exports.isFirstOfPair = is_first_of_surrogate_pair
module.exports.hasPair = has_pair

HIGH_SURROGATE_START = 0xD800
HIGH_SURROGATE_END = 0xDBFF

LOW_SURROGATE_START = 0xDC00

REGIONAL_INDICATOR_START = 0x1F1E6
REGIONAL_INDICATOR_END = 0x1F1FF

FITZPATRICK_MODIFIER_START = 0x1f3fb
FITZPATRICK_MODIFIER_END = 0x1f3ff

function spliddit(s) {
  var i = 0
    , increment
    , next_two
    , returnArr = []
    , current
    , arr

  if(s === void 0 || s === null) {
    throw new Error('s cannot be undefined or null')
  }

  if(Array.isArray(s)) {
    arr = s
  } else {
    arr = s.split('')
  }

  while(i < arr.length) {
    increment = take_how_many(i, arr)
    current = arr.slice(i, i + increment).join('')
    returnArr.push(current)
    i += increment
  }

  return returnArr
}

function take_how_many(i, arr) {
  var last_index = arr.length - 1
  var current = arr[i]
  var current_two
  var next_two

  // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i
  if (!is_first_of_surrogate_pair(current) || i === last_index) {
    return 1
  }

  // If the array isn't long enough to take another pair after this one, we
  // can only take the current pair
  if((i + 3) > last_index) {
    return 2
  }

  current_two = current + arr[i + 1]
  next_two = arr[i + 2] + arr[i + 3]

  // Flag emojis are comprised of two surrogate pairs,
  // (both regional indicator pairs)
  // See http://emojipedia.org/flags/
  // If both pairs are regional indicator pairs, take 4
  if(is_regional_indicator_pair(current_two) &&
    is_regional_indicator_pair(next_two)) {
    return 4
  }

  // If we have a surrogate pair and the next pair make a
  // Fitzpatrick skin tone modifier, take 4
  // See http://emojipedia.org/modifiers/
  if(is_fitzpatrick_modifier_pair(next_two)) {
    return 4
  }

  return 2
}

function is_first_of_surrogate_pair(c) {
  if(c === void 0 || c === null || !c.hasOwnProperty(0)) {
    return false
  }

  return between_inclusive(
    c[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END
  )
}

function has_pair(s) {
  if(typeof s !== 'string') {
    return false
  }

  return s.split('').some(is_first_of_surrogate_pair)
}

function code_point_from_surrogate_pair(first, second) {
  return (first - HIGH_SURROGATE_START) * 0x400 +
        second - LOW_SURROGATE_START + 0x10000
}

function is_regional_indicator_pair(pair) {
  var code_point = code_point_from_surrogate_pair(
    pair.charCodeAt(0), pair.charCodeAt(1)
  )

  return between_inclusive(
    code_point, REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END
  )
}

function is_fitzpatrick_modifier_pair(pair) {
  var code_point = code_point_from_surrogate_pair(
    pair.charCodeAt(0), pair.charCodeAt(1)
  )

  return between_inclusive(
    code_point, FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END
  )
}

function between_inclusive(value, lower_bound, upper_bound) {
  return value >= lower_bound &&
          value <= upper_bound
}