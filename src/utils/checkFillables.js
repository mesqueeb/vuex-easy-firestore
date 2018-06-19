
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
  if (fillables.length) {
    Object.keys[obj].forEach(key => {
      if (!fillables.includes(key)) {
        delete obj[key]
      }
    })
  }
  guard.forEach(key => {
    delete obj[key]
  })
  return obj
}
