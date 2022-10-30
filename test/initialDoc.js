import test from 'ava'
import wait from './helpers/wait'
import { firebaseApp, store } from './helpers/index.cjs.js'
import * as firestore from 'firebase/firestore'

test('initialDoc through openDBRef & fetchAndAdd', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  let path, docR, doc
  const randomId = firestore.doc(store.getters['pokemonBox/dbRef']).id
  path = `docs/${randomId}`
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  // doc doesn't exist yet
  t.is(docR.exists(), false)
  try {
    await store.dispatch('initialDoc/openDBChannel', { randomId })
  } catch (error) {
    console.error(error)
    t.fail()
  }
  const testFullPath = store.getters['initialDoc/firestorePathComplete']
  t.is(testFullPath.split('/').pop(), randomId)
  const fullPath = store.getters['initialDoc/firestorePathComplete']
  await wait(3)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), fullPath))
  t.is(docR.exists(), true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId)

  // START NEXT TEST
  await wait(1)
  // test('initialDoc through fetchAndAdd', async t => {
  t.is(store.state.initialDoc.iniProp, true)
  const randomId2 = firestore.doc(store.getters['pokemonBox/dbRef']).id
  path = `docs/${randomId2}`
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  t.is(docR.exists(), false)
  try {
    store.dispatch('initialDoc/fetchAndAdd', { pathVariables: { randomId: randomId2 } })
  } catch (error) {
    t.fail()
  }
  const fullPath2 = store.getters['initialDoc/firestorePathComplete']
  t.is(fullPath2.split('/').pop(), randomId2)
  await wait(4)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  t.is(docR.exists(), true)
  doc = docR.data()
  t.is(doc.iniProp, true)
  t.is(doc.id, randomId2)
})

test('preventInitialDoc through openDBRef & fetchAndAdd', async t => {
  t.is(store.state.preventInitialDoc.iniProp, true)
  let path, docR, doc
  const randomId = firestore.doc(store.getters['pokemonBox/dbRef']).id
  path = `docs/${randomId}`
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  // doc doesn't exist yet
  t.is(docR.exists(), false)
  try {
    await store.dispatch('preventInitialDoc/openDBChannel', { randomId })
  } catch (error) {
    console.error(error)
    t.is(error, 'preventInitialDocInsertion')
  }
  const testFullPath = store.getters['preventInitialDoc/firestorePathComplete']
  t.is(testFullPath.split('/').pop(), randomId)
  const fullPath = store.getters['preventInitialDoc/firestorePathComplete']
  await wait(3)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), fullPath))
  t.is(docR.exists(), false)

  // START NEXT TEST
  await wait(1)
  // test('preventInitialDoc through fetchAndAdd', async t => {
  t.is(store.state.preventInitialDoc.iniProp, true)
  const randomId2 = firestore.doc(store.getters['pokemonBox/dbRef']).id
  path = `docs/${randomId2}`
  await wait(2)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  t.is(docR.exists(), false)
  try {
    await store.dispatch('preventInitialDoc/fetchAndAdd', { randomId: randomId2 })
  } catch (error) {
    console.error(error)
    t.is(error, 'preventInitialDocInsertion')
  }
  const fullPath2 = store.getters['preventInitialDoc/firestorePathComplete']
  t.is(fullPath2.split('/').pop(), randomId2)
  await wait(4)
  docR = await firestore.getDoc(firestore.doc(firestore.getFirestore(firebaseApp), path))
  t.is(docR.exists(), false)
})
