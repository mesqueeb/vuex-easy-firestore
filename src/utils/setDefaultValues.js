import { isObject, isFunction, isString, isDate } from 'is-what'
import findAndReplace from 'find-and-replace-anything'

function mergeRecursively (defaultValues, obj) {
  if (!isObject(obj)) return obj
  // define newObject to merge all values upon
  const newObject = (isObject(defaultValues))
    ? Object.keys(defaultValues)
      .reduce((carry, key) => {
        const targetVal = findAndReplace(defaultValues[key], '%convertTimestamp%', null)
        if (!Object.keys(obj).includes(key)) carry[key] = targetVal
        return carry
      }, {})
    : {}
  return Object.keys(obj)
    .reduce((carry, key) => {
      const newVal = obj[key]
      const targetVal = defaultValues[key]
      // early return when targetVal === undefined
      if (targetVal === undefined) {
        carry[key] = newVal
        return carry
      }
      // convert to new Date() if defaultValue == '%convertTimestamp%'
      if (targetVal === '%convertTimestamp%') {
        // firestore timestamps
        if (isObject(newVal) && isFunction(newVal.toDate)) {
          carry[key] = newVal.toDate()
          return carry
        }
        // strings
        if (isString(newVal) && isDate(new Date(newVal))) {
          carry[key] = new Date(newVal)
          return carry
        }
      }
      // When newVal is an object do the merge recursively
      if (isObject(newVal)) {
        carry[key] = mergeRecursively(targetVal, newVal)
        return carry
      }
      // all the rest
      carry[key] = newVal
      return carry
    }, newObject)
}

/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */
export default function (obj, defaultValues) {
  if (!isObject(defaultValues)) console.error('Trying to merge target:', obj, 'onto a non-object:', defaultValues)
  if (!isObject(obj)) console.error('Trying to merge a non-object:', obj, 'onto:', defaultValues)
  return mergeRecursively(defaultValues, obj)
  // return merge(defaultValues, obj)
}
