import test from 'ava'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'

import * as Firebase from 'firebase/app'
import 'firebase/firestore'

test('initialDoc through openDBRef', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  let path, docR, doc
  const randomId = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, false)
  store.dispatch('initialDoc/openDBChannel', {randomId})
  const fullPath = store.getters['initialDoc/firestorePathComplete']
  t.is(fullPath.split('/').pop(), randomId)
  await wait(4)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId)
})

test('initialDoc through fetchAndAdd', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  let path, docR, doc
  const randomId = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, false)
  store.dispatch('initialDoc/fetchAndAdd', {randomId})
  const fullPath = store.getters['initialDoc/firestorePathComplete']
  t.is(fullPath.split('/').pop(), randomId)
  await wait(4)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId)
})
