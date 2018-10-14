import store from './helpers/index.cjs.js'
import test from 'ava'
import wait from './helpers/wait'

test('test wait', async t => {
  console.log('_0')
  try { await wait() } catch (e) { console.error(e) }
  console.log('_1')
  try { await wait(2) } catch (e) { console.error(e) }
  console.log('_2')
  t.pass()
})

test('SET_PATHVARS', t => {
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/{name}')
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {})
  store.commit('testPathVar/SET_PATHVARS', {name: 'Satoshi'})
  t.is(store.state.testPathVar._conf.firestorePath, 'coll/Satoshi')
  t.deepEqual(store.state.testPathVar._sync.pathVariables, {name: 'Satoshi'})
})
