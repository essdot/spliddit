module.exports = spliddit
module.exports.isFirstOfPair = is_first_of_surrogate_pair
module.exports.hasPair = has_pair

function spliddit(s) {
  var i = 0
    , returnArr = []
    , current
    , arr

  if(Array.isArray(s)) {
    arr = s
  } else {
    arr = s.split('')
  }

  while(i < arr.length) {
    current = arr[i++]

    if(is_first_of_surrogate_pair(current)) {
      current += arr[i++]
    }

    returnArr.push(current)
  }

  return returnArr
}

function is_first_of_surrogate_pair(c) {
  if(typeof c !== 'string' || c.length < 1) {
    return false
  }

  var lowerBound = 0xD800
    , upperBound = 0xDFFF
    , charCode = ('' + c).charCodeAt(0)

  return lowerBound <= charCode && charCode <= upperBound

  // return /[\uD800-\uDFFF]/.test(character)
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
