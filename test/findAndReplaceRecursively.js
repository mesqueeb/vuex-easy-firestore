import test from 'ava'
import findAndReplaceRecursively from './helpers/findAndReplaceRecursively.cjs'

test('findAndReplaceRecursively', t => {
  let res
  res = findAndReplaceRecursively('_', 'a', 'b')
  t.is(res, '_')
  res = findAndReplaceRecursively('a', 'a', 'b')
  t.is(res, 'b')
  res = findAndReplaceRecursively({a: {b: {c: 'a'}}}, 'a', 'b')
  t.deepEqual(res, {a: {b: {c: 'b'}}})
})
