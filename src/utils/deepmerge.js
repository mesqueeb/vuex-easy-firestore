import deepmerge from '../../node_modules/deepmerge/dist/es.js'

/**
 * Makes sure to overwrite arrays completely instead of concatenating with a merge(). Usage: merge(arr1, arr2, {arrayOverwrite: true})
 *
 * @returns the latter array passed
 */
function overwriteMerge (destinationArray, sourceArray, options) {
  return sourceArray
}

function merge (a, b, options) {
  if (options && options.arrayOverwrite) {
    return deepmerge(a, b, {arrayMerge: overwriteMerge})
  }
  return deepmerge(a, b)
}

merge.all = function (array, options) {
  if (options && options.arrayOverwrite) {
    return deepmerge.all(array, {arrayMerge: overwriteMerge})
  }
  return deepmerge.all(array)
}

export default merge
