import { isObject } from 'is-what'

function merge (...params) {
  const target = params[0]
  if (!isObject(target)) throw Error('merge is only for objects')
  params.reduce((carry, item) => {
    Object.keys(item).forEach(k => {
      k
    })
  }, target)
  return target
}

const a = merge({}, {a: 1}, {a: 2})
console.log('a → ', a)

// if (!isObject(item)) {
//   console.error('trying to merge a non-object: ', item)
//   return item
// }

return merge