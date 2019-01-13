import test from 'ava'
import wait from './helpers/wait'
import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import {storeGetters as store} from './helpers/index.cjs.js'

const state = store.state.serverHooks
const docRef = store.getters['serverHooks/dbRef']

test('[serverHook] server prop deletion', async t => {
  let doc, docR
  await store.dispatch('serverHooks/openDBChannel')
  // ==============================================
  // default props will never be deleted from state
  // ==============================================
  await wait(3)
  // make sure defaultPropsNotToBeDeleted is true also on the server
  store.dispatch('serverHooks/set', {defaultPropsNotToBeDeleted: true})
  t.is(state.defaultPropsNotToBeDeleted, true)
  await wait(3)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.defaultPropsNotToBeDeleted, true)
  // all is good, now let's delete it from just the server
  await docRef.update({
    defaultPropsNotToBeDeleted: Firebase.firestore.FieldValue.delete()
  })
  await wait(3)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.defaultPropsNotToBeDeleted, undefined)
  t.is(state.defaultPropsNotToBeDeleted, true)

  // ==============================================
  // non-default prop deletion is reflected locally
  // ==============================================
  await wait(3)
  // make sure defaultPropsNotToBeDeleted is true also on the server
  store.dispatch('serverHooks/set', {addedPropToBeDeleted: true})
  t.is(state.addedPropToBeDeleted, true)
  await wait(3)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.addedPropToBeDeleted, true)
  // all is good, now let's delete it from just the server
  await docRef.update({
    addedPropToBeDeleted: Firebase.firestore.FieldValue.delete()
  })
  await wait(3)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.addedPropToBeDeleted, undefined)
  t.is(state.addedPropToBeDeleted, true)
})
