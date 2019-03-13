import test from 'ava'
import wait from './helpers/wait'
import {store} from './helpers/index.cjs.js'
import * as firebase from 'firebase/app'
import 'firebase/auth'

const state = store.state.user
const getters = store.getters

test('check {userId} on change users with logout', async t => {
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
  store.dispatch('user/openDBChannel').catch(console.error)
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
  // new ID set
  t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  // path not updated yet
  t.is(state._sync.signedIn, true)
  t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  t.is(getters['user/firestorePathComplete'], 'user/LH3AIbCFMPMeeLclvRkmXghIaOx1')
  store.dispatch('user/closeDBChannel')
  store.dispatch('user/openDBChannel').catch(console.error)
  // openDBChannel sets userId
  t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  await wait(3)
  t.is(state._sync.userId, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
// })
  await wait(5)
  await store.dispatch('user/loginWithEmail', 1)
  // await wait(3) don't wait
  // new ID set
  t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  // path not updated yet
  t.is(state._sync.signedIn, true)
  t.is(state._sync.userId, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
  store.dispatch('user/closeDBChannel')
  store.dispatch('user/openDBChannel').catch(console.error)
  // openDBChannel sets userId
  t.is(getters['user/firestorePathComplete'], 'user/LH3AIbCFMPMeeLclvRkmXghIaOx1')
  await wait(3)
  t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
  t.is(state._sync.signedIn, true)
  t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
})
// test('check {userId} on change users without logout', async t => {
//   t.is(state._sync.userId, null)
//   t.is(state._sync.signedIn, false)
//   t.is(firebase.auth().currentUser, null)
//   await store.dispatch('user/loginWithEmail', 1)
//   // await wait(3) don't wait
//   t.is(state._sync.userId, null)
//   t.is(state._sync.signedIn, false)
//   t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
//   // opening db
//   t.is(getters['user/firestorePathComplete'], 'user/{userId}')
//   store.dispatch('user/openDBChannel')
//   t.is(getters['user/firestorePathComplete'], 'user/LH3AIbCFMPMeeLclvRkmXghIaOx1')
//   await wait(3)
//   t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
//   t.is(state._sync.signedIn, true)
//   t.is(firebase.auth().currentUser.uid, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
//   // SUCCESS, let's try again
//   await wait(3)
//   await store.dispatch('user/loginWithEmail', 2)
//   // await wait(3) don't wait
//   t.is(state._sync.userId, 'LH3AIbCFMPMeeLclvRkmXghIaOx1')
//   t.is(state._sync.signedIn, true)
//   t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
//   t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
//   // ↳ already replaced because firestorePathComplete uses firebase.auth().currentUser.uid
//   store.dispatch('user/openDBChannel')
//   t.is(getters['user/firestorePathComplete'], 'user/psqOfK5yLYVTT0LDTfuZUTxuYrE2')
//   await wait(3)
//   t.is(state._sync.userId, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
//   t.is(state._sync.signedIn, true)
//   t.is(firebase.auth().currentUser.uid, 'psqOfK5yLYVTT0LDTfuZUTxuYrE2')
// })
