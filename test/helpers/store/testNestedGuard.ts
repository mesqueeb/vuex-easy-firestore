import { defaultMutations } from 'vuex-easy-access'

function initialState() {
  return {
    nested: {
      guard: true,
    },
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/nestedGuard',
  firestoreRefType: 'doc',
  moduleName: 'nestedGuard',
  statePropName: null,
  sync: {
    guard: ['nested.guard'],
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
