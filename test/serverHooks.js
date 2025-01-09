import test from 'ava'
import wait from './helpers/wait'
import * as firestore from 'firebase/firestore'
import { store } from './helpers/index.cjs.js'

const state = store.state.serverHooks
const docRef = store.getters['serverHooks/dbRef']

test('[MANUAL TEST] server prop deletion - no defaults', async t => {
  let doc, docR
  await store.dispatch('serverHooks/openDBChannel').catch(console.error)
  // ==============================================
  // default props will never be deleted from state
  // ==============================================
  await wait(1)
  // make sure defaultPropsNotToBeDeleted is true also on the server
  store.dispatch('serverHooks/set', { defaultPropsNotToBeDeleted: 'DELETE ME' })
  t.is(state.defaultPropsNotToBeDeleted, 'DELETE ME')
  await wait(3)
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.is(doc.defaultPropsNotToBeDeleted, 'DELETE ME')
  // all is good, now let's delete it from just the server
  console.log(
    'start manual delete of [defaultPropsNotToBeDeleted]',
    'https://console.firebase.google.com/u/0/project/tests-firestore/database/firestore/data~2FconfigTests~2FserverHooks'
  )
  await firestore.updateDoc(docRef, {
    defaultPropsNotToBeDeleted: firestore.deleteField()
  })
  await wait(15)
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.is(doc.defaultPropsNotToBeDeleted, undefined)
  t.is(state.defaultPropsNotToBeDeleted, true)
})
test('[MANUAL TEST] server prop deletion - top lvl', async t => {
  let doc, docR
  await store.dispatch('serverHooks/openDBChannel').catch(console.error)
  await wait(3)
  // ==============================================
  // non-default prop deletion is reflected locally
  // ==============================================
  // make sure defaultPropsNotToBeDeleted is true also on the server
  store.dispatch('serverHooks/set', { addedPropToBeDeleted: 'DELETE ME' })
  t.is(state.addedPropToBeDeleted, 'DELETE ME')
  await wait(3)
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.is(doc.addedPropToBeDeleted, 'DELETE ME')
  // all is good, now let's delete it from just the server
  console.log(
    'start manual delete of [addedPropToBeDeleted]',
    'https://console.firebase.google.com/u/0/project/tests-firestore/database/firestore/data~2FconfigTests~2FserverHooks'
  )
  await firestore.updateDoc(docRef, {
    addedPropToBeDeleted: firestore.deleteField()
  })
  await wait(15)
  console.log('waited for delete')
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.is(doc.addedPropToBeDeleted, undefined)
  t.is(state.addedPropToBeDeleted, undefined)
})
test('[MANUAL TEST] server prop deletion - nested', async t => {
  let doc, docR
  await store.dispatch('serverHooks/openDBChannel').catch(console.error)
  await wait(5)
  // ==============================================
  // nested props deletion is reflected locally
  // ==============================================
  // make sure defaultPropsNotToBeDeleted is true also on the server
  store.dispatch('serverHooks/set', { nestedD: { tobe: { deleted: 'DELETE ME', stay: true } } })
  t.deepEqual(state.nestedD, { tobe: { deleted: 'DELETE ME', stay: true } })
  await wait(3)
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.deepEqual(doc.nestedD, { tobe: { deleted: 'DELETE ME', stay: true } })
  // all is good, now let's delete it from just the server
  console.log(
    'start manual delete of [nestedD.tobe.deleted]',
    'https://console.firebase.google.com/u/0/project/tests-firestore/database/firestore/data~2FconfigTests~2FserverHooks'
  )
  await firestore.updateDoc(docRef, {
    'nestedD.tobe.deleted': firestore.deleteField()
  })
  await wait(15)
  docR = await firestore.getDoc(docRef)
  doc = docR.data()
  t.deepEqual(doc.nestedD, { tobe: { stay: true } })
  t.deepEqual(state.nestedD, { tobe: { stay: true } })
})
