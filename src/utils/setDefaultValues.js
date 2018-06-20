
import copyObj from 'nanoclone'

/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */
export default function (obj, defaultValues) {
  return copyObj(Object.assign({}, defaultValues, obj))
}
