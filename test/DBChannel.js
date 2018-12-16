import test from 'ava'
import wait from './helpers/wait'
import {storeDBChannel as store} from './helpers/index.cjs.js'

const tpv = store.state.testPathVar
test('[openDBChannel] check firestorePathComplete after openDBChannel', async t => {
  // 0. initial path
  t.deepEqual(tpv._sync.pathVariables, {})
  t.is(tpv._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/{name}')
  // 1. open once
  store.dispatch('testPathVar/openDBChannel', {name: 'Luca'}).catch(console.error)
  await wait(2)
  t.deepEqual(tpv._sync.pathVariables, {name: 'Luca'})
  t.is(tpv._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/Luca')
  // 2. close once
  store.dispatch('testPathVar/closeDBChannel', {clearModule: true}).catch(console.error)
  await wait(2)
  t.deepEqual(tpv._sync.pathVariables, {})
  t.is(tpv._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/{name}')
  // 3. open again
  store.dispatch('testPathVar/openDBChannel', {name: 'Mesqueeb'}).catch(console.error)
  await wait(2)
  t.deepEqual(tpv._sync.pathVariables, {name: 'Mesqueeb'})
  t.is(tpv._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/Mesqueeb')
})

const char = store.state.mainCharacter

test('[openDBChannel] check where filter after openDBChannel', async t => {
  let res
  char._conf.sync.where = [['hi.{userId}.docs.{name}', '==', '{big}']]
  char._sync.userId = 'charlie'
  // 0. initial path
  res = store.getters['mainCharacter/where']
  t.deepEqual(char._sync.pathVariables, {})
  t.deepEqual(char._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  t.deepEqual(res, [['hi.charlie.docs.{name}', '==', '{big}']])
  // 1. open once
  store.dispatch('mainCharacter/openDBChannel', {name: 'Luca'}).catch(console.error)
  await wait(2)
  res = store.getters['mainCharacter/where']
  t.deepEqual(char._sync.pathVariables, {name: 'Luca'})
  t.deepEqual(char._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  t.deepEqual(res, [['hi.charlie.docs.Luca', '==', '{big}']])
  // 2. open again
  store.dispatch('mainCharacter/openDBChannel', {name: 'Mesqueeb'}).catch(console.error)
  await wait(2)
  res = store.getters['mainCharacter/where']
  t.deepEqual(char._sync.pathVariables, {name: 'Mesqueeb'})
  t.deepEqual(res, [['hi.charlie.docs.Mesqueeb', '==', '{big}']])
})

// test('sync: where', async t => {
//   t.pass()
//   // await wait()
// })
// test('sync: orderBy', async t => {
//   t.pass()
//   // await wait()
// })

// test('fetch', async t => {
//   t.pass()
//   // await wait()
// })
// test('fetch: docLimit', async t => {
//   t.pass()
//   // await wait()
// })

// test('Server: defaultValues', async t => {
//   t.pass()
//   // await wait()
// })
// test('Server: addedHook', async t => {
//   t.pass()
//   // await wait()
// })
// test('Server: modifiedHook', async t => {
//   t.pass()
//   // await wait()
// })
// test('Server: removedHook', async t => {
//   t.pass()
//   // await wait()
// })
