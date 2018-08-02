import { grabUntilApiLimit, makeBatchFromSyncstack } from './helpers/apiHelpers.cjs'
import test from 'ava'

const state = {
  _sync: {
    syncStack: {
      inserts: [],
      updates: {},
      deletions: [],
      propDeletions: [],
      debounceTimer: null,
    }
  }
}
test('grabUntilApiLimit', t => {
  let res, syncStackProp, count, maxCount, ex
  count = 0
  maxCount = 500
  // INSERTS
  syncStackProp = 'inserts'
  ex = [
    {id: 1, name: '1'},
    {id: 2, name: '2'},
  ]
  state._sync.syncStack.inserts = ex
  res = grabUntilApiLimit(syncStackProp, count, maxCount, state)
  t.deepEqual(res, ex)
  t.deepEqual(state._sync.syncStack.inserts, [])
  // UPDATES
  syncStackProp = 'updates'
  ex = {
    '1': {name: '_1', id: '1'},
    '2': {name: '_2', id: '2'}
  }
  state._sync.syncStack.updates = ex
  res = grabUntilApiLimit(syncStackProp, count, maxCount, state)
  t.deepEqual(res, [
    {name: '_1', id: '1'},
    {name: '_2', id: '2'}
  ])
  t.deepEqual(state._sync.syncStack.updates, {})
  // OVER 5000!!!!!
  syncStackProp = 'inserts'
  let i = 0
  while (i < 600) {
    state._sync.syncStack.inserts.push({id: 1, name: '1'})
    i++
  }
  res = grabUntilApiLimit(syncStackProp, count, maxCount, state)
  t.is(res.length, 500)
  t.is(state._sync.syncStack.inserts.length, 100)
})

test('makeBatchFromSyncstack', t => {
  // let res, dbRef, collectionMode, userId
  // res = makeBatchFromSyncstack()
  t.pass()
})
