import { isObject } from 'is-what'

function retrievePaths (object, path, result) {
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

export default function (object) {
  const result = {}
  return retrievePaths(object, null, result)
}
