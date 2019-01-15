import test from 'ava'
import wait from './helpers/wait'
import {storeSyncConfig as store} from './helpers/index.cjs.js'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const state = store.state.user
const getters = store.getters

test('userId', async t => {
  t.is(state._sync.userId, null)
  t.is(state._sync.signedIn, false)
  t.is(firebase.auth().currentUser, null)
  await store.dispatch('user/loginWithEmail', 1)
  // await wait(3) don't wait
  t.is(state._sync.userId, null)
  t.is(state._sync.signedIn, false)
  t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  // opening db
  t.is(getters['user/firestorePathComplete'], 'user/{userId}')
  store.dispatch('user/openDBChannel')
  t.is(getters['user/firestorePathComplete'], 'user/LH3AIbCFMPMeeLclvRkmXghIaOx1')
  await wait(3)
  t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  // SUCCESS, let's try again
  await store.dispatch('user/logout')
  await wait(3)
  t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser, null)
  await store.dispatch('user/loginWithEmail', 2)
  // await wait(3) don't wait
  t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  // ↳ already replaced because firestorePathComplete uses firebase.auth().currentUser.uid
  store.dispatch('user/openDBChannel')
  t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  await wait(3)
  t.is(state._sync.userId, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
})
