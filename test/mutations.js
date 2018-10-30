import store from './helpers/index.cjs.js'
import test from 'ava'

test('SET_PATHVARS', t => {
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {})
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/{name}')
  store.commit('testPathVar/SET_PATHVARS', {name: 'Satoshi'})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.is(store.getters['testPathVar/firestorePathComplete'], 'coll/Satoshi')
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {name: 'Satoshi'})
})
