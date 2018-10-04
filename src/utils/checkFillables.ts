import { isObject } from 'is-what'
import { AnyObject } from '../declarations'

/**
 * Checks all props of an object and deletes guarded and non-fillables.
 *
 * @export
 * @param {object} obj the target object to check
 * @param {string[]} [fillables=[]] an array of strings, with the props which should be allowed on returned object
 * @param {string[]} [guard=[]] an array of strings, with the props which should NOT be allowed on returned object
 * @returns {AnyObject} the cleaned object after deleting guard and non-fillables
 */
export default function (
  obj: object,
  fillables: string[] = [],
  guard: string[] = []
): AnyObject {
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
