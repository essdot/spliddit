module.exports = spliddit
module.exports.isFirstOfPair = is_first_of_surrogate_pair
module.exports.hasPair = has_pair

REGIONAL_INDICATOR_START = 0x1F1E6
REGIONAL_INDICATOR_END = 0x1F1FF

function spliddit(s) {
  var i = 0
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
    current = arr[i++]

    if(is_first_of_surrogate_pair(current)) {
      current += arr[i++]

      if(is_regional_indicator_pair(current)) {
        next_two = arr[i] + arr[i + 1]

        if(is_regional_indicator_pair(next_two)) {
          current += next_two
          i += 2
        }
      }
    }

    returnArr.push(current)
  }

  return returnArr
}

function is_first_of_surrogate_pair(c) {
  if(c === void 0 || c === null || !c.hasOwnProperty(0)) {
    return false
  }

  return /[\uD800-\uDFFF]/.test(c[0])
}

function has_pair(s) {
  if(typeof s !== 'string') {
    return false
  }

  var arr = s.split('')

  return arr.some(function(item) {
    return is_first_of_surrogate_pair(item)
  })
}

function code_point_from_surrogate_pair(first, second) {
  return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000
}

function is_regional_indicator_pair(pair) {
  var code_point = code_point_from_surrogate_pair(
    pair.charCodeAt(0), pair.charCodeAt(1)
  )

  return (
    code_point >= REGIONAL_INDICATOR_START &&
    code_point <= REGIONAL_INDICATOR_END
  )
}