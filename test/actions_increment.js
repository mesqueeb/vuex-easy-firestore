import test from 'ava'
import { isNumber } from 'is-what'
import wait from './helpers/wait'
import { store } from './helpers/index.cjs.js'
import { increment } from '../src/index'
import * as firestore from 'firebase/firestore'

const char = store.state.mainCharacter
const charRef = store.getters['mainCharacter/dbRef']

// actions
test('store set up', async t => {
  t.true(isNumber(char.stepCounter))
})

test('[COLLECTION] increment', async t => {
  let docR, doc
  // ini set
  store.dispatch('mainCharacter/patch', { stepCounter: 0 })
  t.is(char.stepCounter, 0)
  await wait(2)
  store.dispatch('mainCharacter/patch', { stepCounter: increment(10) })
  t.is(char.stepCounter, 10)
  await wait(2)
  docR = await firestore.getDoc(charRef)
  doc = docR.data()
  t.is(doc.stepCounter, 10)
  store.dispatch('mainCharacter/patch', { stepCounter: increment(2) })
  store.dispatch('mainCharacter/patch', { stepCounter: increment(2) })
  store.dispatch('mainCharacter/patch', { stepCounter: increment(2) })
  t.is(char.stepCounter, 16)
  await wait(2)
  docR = await firestore.getDoc(charRef)
  doc = docR.data()
  t.is(doc.stepCounter, 16)
})
