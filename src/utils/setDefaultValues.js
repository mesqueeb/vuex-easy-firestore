
/**
 * Sets default values on an object through object.Assign
 *
 * @export
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */
export default function (obj, defaultValues) {
  return Object.assign(defaultValues, obj)
}
