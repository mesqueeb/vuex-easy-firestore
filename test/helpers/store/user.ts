import { firebaseApp } from '../firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  firestorePath: 'user/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user',
  statePropName: null,
  actions: {
    async loginWithEmail({ dispatch }, userNr) {
      let userEmail
      if (userNr === 1) userEmail = 'test@test.com'
      if (userNr === 2) userEmail = 'test2@test.com'
      await signInWithEmailAndPassword(getAuth(firebaseApp), userEmail, 'test1234')
    },
    async logout({ dispatch, state }) {
      await getAuth(firebaseApp).signOut()
    },
  },
  // module
  state: {},
  mutations: {},
  getters: {},
}
