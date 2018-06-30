import { isObject } from 'is-what'
import deepmerge from './nanomerge'

function merge (...params) {
  let l = params.length
  for (l; l > 0; l--) {
    const item = params[l - 1]
    if (!isObject(item)) {
      console.error('trying to merge a non-object: ', item)
      return item
    }
  }
  return deepmerge(...params)
}

export default merge
