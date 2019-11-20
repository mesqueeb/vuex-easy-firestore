import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    iniProp: true,
    defaultPropsNotToBeDeleted: true
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/serverHooks', // this should be randomized each test
  firestoreRefType: 'doc',
  moduleName: 'serverHooks',
  statePropName: null,
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
  sync: {
    guard: ['created_by', 'created_at', 'updated_by', 'updated_at']
  }
}
