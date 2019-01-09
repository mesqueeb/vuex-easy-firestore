import test from 'ava'
import wait from './helpers/wait'
import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import {storeGetters as store} from './helpers/index.cjs.js'

const state = store.state.serverHooks
const docRef = store.getters['serverHooks/dbRef']

test('[serverHook] prop deletion is reflected locally', async t => {
  let doc, docR
  t.is(state.propToBeDeleted, true)
  await store.dispatch('serverHooks/openDBChannel')
  t.is(state.propToBeDeleted, true)
  await wait(2)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.propToBeDeleted, true)
  await docRef.update({
    propToBeDeleted: Firebase.firestore.FieldValue.delete()
  })
  await wait(2)
  docR = await docRef.get()
  doc = docR.data()
  t.is(doc.propToBeDeleted, undefined)
  t.is(state.propToBeDeleted, undefined)
})
