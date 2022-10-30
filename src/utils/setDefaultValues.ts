import { isPlainObject, isFunction, isString, isDate, isAnyObject } from 'is-what'
import { merge } from 'merge-anything'
import { findAndReplace } from 'find-and-replace-anything'
import { AnyObject } from '../declarations'

/**
 * convert to new Date() if defaultValue == '%convertTimestamp%'
 *
 * @param {*} originVal
 * @param {*} targetVal
 * @returns {Date}
 */
function convertTimestamps(originVal: any, targetVal: any): Date {
  if (originVal === '%convertTimestamp%') {
    // firestore timestamps
    if (
      isAnyObject(targetVal) &&
      !isPlainObject(targetVal) &&
      // @ts-ignore
      isFunction(targetVal.toDate)
    ) {
      // @ts-ignore
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
  if (!isPlainObject(defaultValues)) {
    console.error(
      '[vuex-easy-firestore] Trying to merge target:',
      obj,
      'onto a non-object (defaultValues):',
      defaultValues
    )
  }
  if (!isPlainObject(obj)) {
    console.error(
      '[vuex-easy-firestore] Trying to merge a non-object:',
      obj,
      'onto the defaultValues:',
      defaultValues
    )
  }
  const result = merge({ extensions: [convertTimestamps] }, defaultValues, obj)
  return findAndReplace(result, '%convertTimestamp%', null, {
    onlyPlainObjects: true,
  })
}
