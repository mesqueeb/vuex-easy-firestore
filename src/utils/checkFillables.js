import { isObject } from 'is-what'

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @param {object}  obj       the target object to check
 * @param {array}   fillables an array of strings, with the props which should be allowed on returned object
 * @param {array}   guard     an array of strings, with the props which should NOT be allowed on returned object
 *
 * @returns {object} the cleaned object after deleting guard and non-fillables
 */
export default function (obj, fillables = [], guard = []) {
  if (!isObject(obj)) return obj
  return Object.keys(obj).reduce((carry, key) => {
    // check fillables
    if (fillables.length && !fillables.includes(key)) {
      return carry
    }
    // check guard
    guard.push('_conf')
    guard.push('_sync')
    if (guard.includes(key)) {
      return carry
    }
    carry[key] = obj[key]
    return carry
  }, {})
}
