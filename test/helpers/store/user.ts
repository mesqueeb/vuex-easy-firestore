import * as firebase from 'firebase/app'
import 'firebase/auth'

export default {
  firestorePath: 'user/{userId}',
  firestoreRefType: 'doc',
  moduleName: 'user',
  statePropName: '',
  actions: {
    async loginWithEmail ({dispatch}, userNr) {
      let userEmail
      if (userNr === 1) userEmail = 'test@test.com'
      if (userNr === 2) userEmail = 'test2@test.com'
      await firebase.auth()
        .signInWithEmailAndPassword(userEmail, 'test1234')
    },
    async logout ({dispatch, state}) {
      await firebase.auth().signOut()
      await dispatch('closeDBChannel', {clearModule: true})
    }
  },
  // module
  state: {},
  mutations: {},
  getters: {},
}
