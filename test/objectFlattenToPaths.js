import test from 'ava'
// import flatten from '../src/utils/objectFlattenToPaths'
import flatten from './helpers/objectFlattenToPaths.cjs'

// Mock for Firebase.firestore.FieldValue.serverTimestamp()
const Firebase = {
  firestore: {
    FieldValue: {
      serverTimestamp: function () {
        return {methodName: 'FieldValue.serverTimestamp'}
      }
    }
  }
}

test('flatten', t => {
  let res, target
  target = {
    a: 1,
    b: {
      c: {d: true},
      e: 'yes'
    }
  }
  res = flatten(target)
  t.deepEqual(res, {
    'a': 1,
    'b.c.d': true,
    'b.e': 'yes'
  })
  target = {}
  res = flatten(target)
  t.deepEqual(res, {})
  target = {
    a: Firebase.firestore.FieldValue.serverTimestamp(),
  }
  res = flatten(target)
  t.deepEqual(res, {
    'a': {methodName: 'FieldValue.serverTimestamp'},
  })
})
