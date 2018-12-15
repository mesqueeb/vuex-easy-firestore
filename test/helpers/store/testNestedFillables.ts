import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    nested: {
      fillables: {
        yes: 0,
        no: 0,
      },
    }
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/nestedFillables',
  firestoreRefType: 'doc',
  moduleName: 'nestedFillables',
  statePropName: '',
  sync: {
    fillables: ['nested.fillables.yes'],
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
