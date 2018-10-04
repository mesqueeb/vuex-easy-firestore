import { isObject } from 'is-what'
import { AnyObject } from '../declarations'

function retrievePaths (object: object, path: string, result: object): object {
  if (
    !isObject(object) ||
    !Object.keys(object).length ||
    object.methodName === 'FieldValue.serverTimestamp'
  ) {
    if (!path) return object
    result[path] = object
    return result
  }
  return Object.keys(object).reduce((carry, key) => {
    const pathUntilNow = (path)
      ? path + '.'
      : ''
    const newPath = pathUntilNow + key
    const extra = retrievePaths(object[key], newPath, result)
    return Object.assign(carry, extra)
  }, {})
}

/**
 * Flattens an object from {a: {b: {c: 'd'}}} to {'a.b.c': 'd'}
 *
 * @export
 * @param {object} object the object to flatten
 * @returns {AnyObject} the flattened object
 */
export default function (object: object): AnyObject {
  const result = {}
  return retrievePaths(object, null, result)
}
