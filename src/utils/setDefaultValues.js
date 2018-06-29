import merge from './deepmerge'

/**
 * Sets default values on an object
 *
 * @param {object} obj on which to set the default values
 * @param {object} defaultValues the default values
 */
export default function (obj, defaultValues) {
  return merge(defaultValues, obj, {arrayOverwrite: true})
}
