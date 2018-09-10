import { isObject } from 'is-what'

/**
 * Goes through an object recursively and replaces all occurences of `findVal` with `replaceWith`. Also works no non-objects.
 *
 * @export
 * @param {*} object Target object
 * @param {*} find val to find
 * @param {*} replaceWith val to replace
 * @returns the object
 */
function findAndReplaceRecursively (object, find, replaceWith) {
  if (!isObject(object)) {
    if (object === find) return replaceWith
    return object
  }
  return Object.keys(object)
    .reduce((carry, key) => {
      const val = object[key]
      carry[key] = findAndReplaceRecursively(val, find, replaceWith)
      return carry
    }, {})
}

export default findAndReplaceRecursively
