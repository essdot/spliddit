module.exports = spliddit
module.exports.isFirstOfPair = is_first_of_surrogate_pair
module.exports.hasPair = has_pair

function spliddit(s) {
  var i = 0
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
