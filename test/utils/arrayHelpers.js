import test from 'ava'
import { arrayUnion, arrayRemove, isArrayHelper } from '../../src/utils/arrayHelpers'

test('arrayUnion', t => {
  t.deepEqual(arrayUnion(2).executeOn([1, 2, 3]), [1, 2, 3])
  t.deepEqual(arrayUnion(0).executeOn([1, 2, 3]), [1, 2, 3, 0])
})
test('arrayRemove', t => {
  t.deepEqual(arrayRemove(2).executeOn([1, 2, 3]), [1, 3])
  t.deepEqual(arrayRemove(0).executeOn([1, 2, 3]), [1, 2, 3])
})
test('arrayUnion with objects', t => {
  t.deepEqual(arrayUnion({ id: '2' }).executeOn([{ id: '1' }, { id: '2' }, { id: '3' }]), [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ])
  t.deepEqual(arrayUnion({ id: '0' }).executeOn([{ id: '1' }, { id: '2' }, { id: '3' }]), [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '0' },
  ])
})
test('arrayRemove with objects', t => {
  t.deepEqual(arrayRemove({ id: '2' }).executeOn([{ id: '1' }, { id: '2' }, { id: '3' }]), [
    { id: '1' },
    { id: '3' },
  ])
  t.deepEqual(arrayRemove({ id: '0' }).executeOn([{ id: '1' }, { id: '2' }, { id: '3' }]), [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ])
})
test('isArrayHelper', t => {
  // true
  t.is(isArrayHelper(arrayUnion(2)), true)
  t.is(isArrayHelper(arrayRemove(0)), true)
  // false
  t.is(isArrayHelper({}), false)
  t.is(isArrayHelper('a'), false)
  class MyClass {}
  t.is(isArrayHelper(MyClass), false)
  t.is(isArrayHelper(new MyClass()), false)
})
