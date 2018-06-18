/**
 * copyObj helper
 *
 * @author     Adam Dorling
 * @contact    https://codepen.io/naito
 */
export default function copyObj (obj) {
  let newObj
  if (typeof obj != 'object') {
    return obj
  }
  if (!obj) {
    return obj
  }
  if ('[object Object]' !== Object.prototype.toString.call(obj) ||
    '[object Array]' !== Object.prototype.toString.call(obj)
  ) {
    return JSON.parse(JSON.stringify(obj))
  }
  // Object is an Array
  if ('[object Array]' === Object.prototype.toString.call(obj)) {
    newObj = []
    for (let i = 0, len = obj.length; i < len; i++) {
      newObj[i] = copyObj(obj[i])
    }
    return newObj
  }
  // Object is an Object
  newObj = {}
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = copyObj(obj[i])
    }
  }
  return newObj
}
