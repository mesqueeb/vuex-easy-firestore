import test from 'ava'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'

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
  // 0. initial path
  char._sync.userId = 'charlie'
  char._sync.signedIn = true
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(char._sync.pathVariables, {})
  t.deepEqual(char._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  t.deepEqual(res, [['hi.charlie.docs.{name}', '==', '{big}']])
  // 1. open once
  store.dispatch('mainCharacter/openDBChannel', {name: 'Luca'}).catch(console.error)
  await wait(2)
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(char._sync.pathVariables, {name: 'Luca'})
  t.deepEqual(char._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  // 'charlie' is replaced by 'null' because there is no actual authenticated user in this test
  t.deepEqual(res, [['hi.null.docs.Luca', '==', '{big}']])
  // 2. open again
  store.dispatch('mainCharacter/openDBChannel', {name: 'Mesqueeb'}).catch(console.error)
  await wait(2)
  res = store.getters['mainCharacter/getWhereArrays']()
  t.deepEqual(char._sync.pathVariables, {name: 'Mesqueeb'})
  t.deepEqual(res, [['hi.null.docs.Mesqueeb', '==', '{big}']])
})

const docModeWithPathVar = store.state.docModeWithPathVar
test('[openDBChannel] check doc ID (doc mode) after openDBChannel', async t => {
  t.is(store.getters['docModeWithPathVar/firestorePathComplete'], 'playerCharacters/{name}')
  await store.dispatch('docModeWithPathVar/openDBChannel', {name: 'Lucaz'}).catch(console.error)
  await wait(2)
  t.is(store.getters['docModeWithPathVar/firestorePathComplete'], 'playerCharacters/Lucaz')
  t.is(docModeWithPathVar.id, 'Lucaz')
  await store.dispatch('docModeWithPathVar/patch', {description: 'Test'}).catch(console.error)
  await wait(2)
  t.is(store.getters['docModeWithPathVar/firestorePathComplete'], 'playerCharacters/Lucaz')
  t.is(docModeWithPathVar.description, 'Test')
  t.is(docModeWithPathVar.id, 'Lucaz')
})

test('[openDBChannel] open multiple times', async t => {
  try {
    await store.dispatch('multipleOpenDBChannels/openDBChannel')
  } catch (e) {
    t.fail()
  }
  try {
    await store.dispatch('multipleOpenDBChannels/openDBChannel')
  } catch (e) {
    t.is(e, `openDBChannel was already called for these filters and pathvariables. Identifier: [where][orderBy][pathVariables]{}`)
  }
  try {
    await store.dispatch('multipleOpenDBChannels/openDBChannel', {name: 'Lucaz'})
  } catch (e) {
    t.fail()
  }
  try {
    await store.dispatch('multipleOpenDBChannels/openDBChannel', {name: 'Lucas'})
  } catch (e) {
    t.fail()
  }
  try {
    await store.dispatch('multipleOpenDBChannels/openDBChannel', {name: 'Lucas'})
  } catch (e) {
    t.is(e, `openDBChannel was already called for these filters and pathvariables. Identifier: [where][orderBy][pathVariables]{"name":"Lucas"}`)
  }
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
