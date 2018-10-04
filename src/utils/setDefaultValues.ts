import { isObject, isFunction, isString, isDate } from 'is-what'
import merge from 'merge-anything'
import findAndReplace from 'find-and-replace-anything'
import { AnyObject } from '../declarations'

/**
 * convert to new Date() if defaultValue == '%convertTimestamp%'
 *
 * @param {*} originVal
 * @param {*} targetVal
 * @returns {Date}
 */
function convertTimestamps (originVal: any, targetVal: any): Date {
  if (originVal === '%convertTimestamp%') {
    // firestore timestamps
    if (isObject(targetVal) && isFunction(targetVal.toDate)) {
      return targetVal.toDate()
    }
    // strings
    if (isString(targetVal) && isDate(new Date(targetVal))) {
      return new Date(targetVal)
    }
  }
  return targetVal
}

/**
 * Merge an object onto defaultValues
 *
 * @export
 * @param {object} obj
 * @param {object} defaultValues
 * @returns {AnyObject} the new object
 */
export default function (obj: object, defaultValues: object): AnyObject {
  if (!isObject(defaultValues)) console.error('[vuex-easy-firestore] Trying to merge target:', obj, 'onto a non-object (defaultValues):', defaultValues)
  if (!isObject(obj)) console.error('[vuex-easy-firestore] Trying to merge a non-object:', obj, 'onto the defaultValues:', defaultValues)
  const result = merge({extensions: [convertTimestamps]}, defaultValues, obj)
  return findAndReplace(result, '%convertTimestamp%', null)
}
