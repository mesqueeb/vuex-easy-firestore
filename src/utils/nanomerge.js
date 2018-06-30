var nanoclone = require('nanoclone').default

function toArray (object) {
  var result = []

  for (var i = 0; i < object.length; ++i) {
    result.push(object[i])
  }

  return result
}

var types = [
  {
    name: 'primitive',

    is: function (el) {
      var type = typeof el

      return (type === 'number' || type === 'string' || type === 'boolean')
    },

    default: 'default',

    merge: {
      default: function (merger, a, b) {
        return b
      }
    }
  },

  {
    name: 'object',

    is: function (el) {
      return el !== null && (typeof el === 'object')
    },

    default: 'deep',

    merge: {
      deep: function (merger, a, b) {
        var result = {}

        var keys = {
          a: Object.keys(a),
          b: Object.keys(b)
        }

        keys.a.concat(keys.b).forEach(function (key) {
          result[key] = merger(a[key], b[key])
        })

        return result
      }
    }
  },

  {
    name: 'array',

    is: function (el) {
      return Array.isArray(el)
    },

    default: 'replace',

    merge: {
      merge: function (merger, a, b) {
        var result = []

        for (var i = 0; i < Math.max(a.length, b.length); ++i) {
          result.push(merger(a[i], b[i]))
        }

        return result
      },

      replace: function (merger, a, b) {
        return nanoclone(b)
      },

      concat: function (merger, a, b) {
        return (([]).concat(a)).concat(b)
      }
    }
  }
]

function merge (config) {
  if (!config) {
    config = {}
  }

  config = {
    strategy: config.strategy || {}
  }

  function determineType (a, b) {
    for (var i = types.length - 1; i >= 0; --i) {
      var type = types[i]

      if (type.is(a) && type.is(b)) {
        return type
      } else if (type.is(a) || type.is(b)) {
        break
      }
    }

    return null
  }

  function merger (a, b) {
    if (b === void 0) {
      return nanoclone(a)
    }

    var type = determineType(a, b)

    if (!type) {
      return nanoclone(b)
    }

    var strategy = config.strategy[type.name] || type.default

    return type.merge[strategy](merger, a, b)
  }

  return function () {
    var elements = toArray(arguments)

    return elements.reduceRight(function (result, element) {
      return merger(element, result)
    })
  }
}

function wrapper () {
  var args = toArray(arguments)

  // custom config
  if (args.length === 1) {
    return merge(args[0])
  }

  return merge().apply(null, args)
}

export default wrapper
// module.exports = wrapper
