import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
  }
}

export default {
  // easy firestore config
  firestorePath: 'playerCharacters/{name}',
  firestoreRefType: 'doc',
  moduleName: 'docModeWithPathVar',
  statePropName: '',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
