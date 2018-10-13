import store from './helpers/index.cjs.js'
import test from 'ava'

test('SET_PATHVARS', t => {
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  store.commit('testPathVar/SET_PATHVARS', {name: 'Satoshi'})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/Satoshi')
})
