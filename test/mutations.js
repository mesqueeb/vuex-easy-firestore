import test from 'ava'
import {store} from './helpers/index.cjs.js'
import * as Firebase from 'firebase/app'
import 'firebase/firestore'

const char = store.state.mainCharacter

test('RESET_VUEX_EASY_FIRESTORE_STATE', t => {
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
    unsubscribe: {},
    pathVariables: {},
    patching: false,
    syncStack: {
      inserts: [],
      updates: {},
      propDeletions: {},
      deletions: [],
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
      propDeletions: {'2': {'a': Firebase.firestore.FieldValue.delete()}},
      deletions: ['2'],
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

test('SET_SYNCFILTERS', t => {
  const sync = char._conf.sync
  t.deepEqual(sync.where, [])
  t.deepEqual(sync.orderBy, [])
  store.commit('mainCharacter/SET_SYNCFILTERS', {
    where: [['hi.{userId}.docs.{nr}', '==', '{big}'], ['{userId}', '==', '{userId}']],
    orderBy: ['date']
  })
  t.deepEqual(sync.where, [['hi.{userId}.docs.{nr}', '==', '{big}'], ['{userId}', '==', '{userId}']])
  t.deepEqual(sync.orderBy, ['date'])
})

test('SET_PATHVARS', t => {
  let res
  res = char._sync.pathVariables
  t.deepEqual(res, {})
  store.commit('mainCharacter/SET_PATHVARS', {name: 'Satoshi'})
  res = char._sync.pathVariables
  t.deepEqual(res, {name: 'Satoshi'})
  const types = {nr: 1, nulll: null, undef: undefined, date: new Date(), obj: {}}
  store.commit('mainCharacter/SET_PATHVARS', types)
  res = char._sync.pathVariables
  t.deepEqual(res, {name: 'Satoshi', ...types})
})

const box = store.state.pokemonBox

test('SET_PATHVARS & where getter', async t => {
  let res
  box._conf.sync.where = [['hi.{userId}.docs.{name}', '==', '{big}']]
  box._sync.userId = 'charlie'
  // pokemonBox._sync.userId = 'charlie'
  res = store.getters['pokemonBox/getWhereArrays']()
  t.deepEqual(box._sync.pathVariables, {})
  t.deepEqual(box._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  t.deepEqual(res, [['hi.charlie.docs.{name}', '==', '{big}']])

  store.commit('pokemonBox/SET_PATHVARS', {name: 'Satoshi'})
  res = store.getters['pokemonBox/getWhereArrays']()
  t.deepEqual(box._sync.pathVariables, {name: 'Satoshi'})
  t.deepEqual(box._conf.sync.where, [['hi.{userId}.docs.{name}', '==', '{big}']])
  t.deepEqual(res, [['hi.charlie.docs.Satoshi', '==', '{big}']])
})
