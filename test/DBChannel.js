import test from 'ava'
import wait from './helpers/wait'
import store from './helpers/index.cjs'

test('[openDBChannel] check path', async t => {
  // 0. initial path
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/{name}')
  // 1. open once
  store.dispatch('testPathVar/openDBChannel', {name: 'Luca'}).catch(console.error)
  await wait(2)
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {name: 'Luca'})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/Luca')
  // 2. close once
  store.dispatch('testPathVar/closeDBChannel', {clearModule: true}).catch(console.error)
  await wait(2)
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/{name}')
  // 3. open again
  store.dispatch('testPathVar/openDBChannel', {name: 'Mesqueeb'}).catch(console.error)
  await wait(2)
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {name: 'Mesqueeb'})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/Mesqueeb')
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
