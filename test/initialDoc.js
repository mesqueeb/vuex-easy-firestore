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
  try {
    await store.dispatch('initialDoc/openDBChannel', {randomId})
  } catch (error) {
    console.error(error)
    t.fail()
  }
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
  try {
    store.dispatch('initialDoc/fetchAndAdd', {randomId: randomId2})
  } catch (error) {
    t.fail()
  }
  const fullPath2 = store.getters['initialDoc/firestorePathComplete']
  t.is(fullPath2.split('/').pop(), randomId2)
  await wait(4)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId2)
})

test('preventInitialDoc through openDBRef & fetchAndAdd', async t => {
  t.is(store.state.preventInitialDoc.iniProp, true)
  let path, docR, doc
  const randomId = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  // doc doesn't exist yet
  t.is(docR.exists, false)
  // WHY DOES THIS GIVE 1 unhandled rejection:
  // try {
  //   store.dispatch('preventInitialDoc/openDBChannel', {randomId})
  // } catch (error) {
  //   t.is(error, 'preventInitialDocInsertion')
  // }
  // THIS WORKS:
  store.dispatch('preventInitialDoc/openDBChannel', {randomId})
    .catch(error => {
      t.is(error, 'preventInitialDocInsertion')
    })
  const testFullPath = store.getters['preventInitialDoc/firestorePathComplete']
  t.is(testFullPath.split('/').pop(), randomId)
  const fullPath = store.getters['preventInitialDoc/firestorePathComplete']
  await wait(3)
  docR = await Firebase.firestore().doc(fullPath).get()
  t.is(docR.exists, false)

  // START NEXT TEST
  await wait(1)
  // test('preventInitialDoc through fetchAndAdd', async t => {
  t.is(store.state.preventInitialDoc.iniProp, true)
  const randomId2 = store.getters['pokemonBox/dbRef'].doc().id
  path = `docs/${randomId2}`
  await wait(2)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, false)
  try {
    store.dispatch('preventInitialDoc/fetchAndAdd', {randomId: randomId2})
  } catch (error) {
    t.is(error, 'preventInitialDocInsertion')
  }
  const fullPath2 = store.getters['preventInitialDoc/firestorePathComplete']
  t.is(fullPath2.split('/').pop(), randomId2)
  await wait(4)
  docR = await Firebase.firestore().doc(path).get()
  t.is(docR.exists, false)
})
