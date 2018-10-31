import store from './helpers/index.cjs'
import test from 'ava'

test('test mutations synchronously', t => {
  // test('SET_PATHVARS', t => {
  t.is(store.state.testMutationsNoStateProp._conf.firestorePath, 'coll/{name}')
  t.deepEqual(store.state.testMutationsNoStateProp._sync.pathVariables, {})
  t.is(store.getters['testMutationsNoStateProp/firestorePathComplete'], 'coll/{name}')
  store.commit('testMutationsNoStateProp/SET_PATHVARS', {name: 'Satoshi'})
  t.is(store.state.testMutationsNoStateProp._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testMutationsNoStateProp/firestorePathComplete'], 'coll/Satoshi')
  t.deepEqual(store.state.testMutationsNoStateProp._sync.pathVariables, {name: 'Satoshi'})

  // test('RESET_VUEX_EASY_FIRESTORE_STATE', t => {
  const defaultState = {
    unsubscribe: null,
    pathVariables: {},
    patching: false,
    syncStack: {
      inserts: [],
      updates: {},
      deletions: [],
      propDeletions: [],
      debounceTimer: null,
    },
    fetched: {},
    stopPatchingTimeout: null
  }
  const testState = {
    unsubscribe: true,
    pathVariables: {name: 'Luca'},
    patching: true,
    syncStack: {
      inserts: [{a: true}],
      updates: {a: true},
      deletions: ['2'],
      propDeletions: ['2.a'],
      debounceTimer: true,
    },
    fetched: {a: true},
    stopPatchingTimeout: 1
  }
  // 1. WithStateProp (collection)
  const statePropModule = store.state.testMutationsWithStateProp
  // insert docs
  const a = {id: '_a', name: 'Bulbasaur', type: {grass: true}}
  const b = {id: '_b', name: 'Charmander', type: {fire: true}}
  const docs = [a, b]
  store.dispatch('testMutationsWithStateProp/insertBatch', docs).catch(console.error)
  // check docs existence
  t.deepEqual(statePropModule.putItHere['_a'], a)
  t.deepEqual(statePropModule.putItHere['_b'], b)
  // set _sync state
  statePropModule._sync = testState
  t.deepEqual(statePropModule._sync, testState)
  // reset and check
  store.commit('testMutationsWithStateProp/RESET_VUEX_EASY_FIRESTORE_STATE', {clearModule: true})
  t.deepEqual(statePropModule._sync, defaultState)
  t.deepEqual(statePropModule.putItHere, {})
  // 2. NoStateProp (doc)
  const noStatePropModule = store.state.testMutationsNoStateProp
  // edit props
  store.dispatch('testMutationsNoStateProp/set', {name: 'Miles Morales'})
  store.dispatch('testMutationsNoStateProp/set', {items: ['Pokeball']})
  // add new props
  store.dispatch('testMutationsNoStateProp/set', {golden: {birdy: true}})
  store.dispatch('testMutationsNoStateProp/set', {umbrella: true})
  store.dispatch('testMutationsNoStateProp/set', {rain: 'y day'})
  // check props existence
  t.is(noStatePropModule.name, 'Miles Morales')
  t.deepEqual(noStatePropModule.items, ['Pokeball'])
  t.deepEqual(noStatePropModule.golden, {birdy: true})
  t.is(noStatePropModule.umbrella, true)
  t.is(noStatePropModule.rain, 'y day')
  // set _sync state
  noStatePropModule._sync = testState
  t.deepEqual(noStatePropModule._sync, testState)
  // reset and check
  store.commit('testMutationsNoStateProp/RESET_VUEX_EASY_FIRESTORE_STATE', {clearModule: true})
  t.deepEqual(noStatePropModule._sync, defaultState)
  t.is(noStatePropModule.name, 'Satoshi') // == module ini state
  t.deepEqual(noStatePropModule.items, []) // == module ini state
  t.falsy(noStatePropModule.golden)
  t.falsy(noStatePropModule.umbrella)
  t.falsy(noStatePropModule.rain)
})
