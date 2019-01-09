import test from 'ava'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'

import * as Firebase from 'firebase/app'
import 'firebase/firestore'

test('initialDoc through openDBRef & fetchAndAdd', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  let path, docR, doc
  const randomId = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  // doc doesn't exist yet
  t.is(docR.exists, false)
  store.dispatch('initialDoc/openDBChannel', {randomId})
  const testFullPath = store.getters['initialDoc/firestorePathComplete']
  t.is(testFullPath.split('/').pop(), randomId)
  const fullPath = store.getters['initialDoc/firestorePathComplete']
  await wait(3)
  docR = await Firebase.firestore().doc(fullPath).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId)

  // START NEXT TEST
  await wait(1)
  // test('initialDoc through fetchAndAdd', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  const randomId2 = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId2}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, false)
  store.dispatch('initialDoc/fetchAndAdd', {randomId: randomId2})
  const fullPath2 = store.getters['initialDoc/firestorePathComplete']
  t.is(fullPath2.split('/').pop(), randomId2)
  await wait(4)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId2)
})
