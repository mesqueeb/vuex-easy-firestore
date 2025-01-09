import { defaultMutations } from 'vuex-easy-access'

function initialState() {
  return {
    iniProp: true,
  }
}

export default {
  // easy firestore config
  firestorePath: 'docs/{randomId}', // this should be randomized each test
  firestoreRefType: 'doc',
  moduleName: 'preventInitialDoc',
  statePropName: null,
  sync: {
    preventInitialDocInsertion: true,
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
