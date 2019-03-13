import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
  }
}

export default {
  // easy firestore config
  firestorePath: 'coll/{name}/data',
  firestoreRefType: 'collection',
  moduleName: 'multipleOpenDBChannels',
  statePropName: '',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
