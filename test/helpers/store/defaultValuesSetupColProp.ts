import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    NOT: false,
    prop: {
      defaultVal1: true,
      nestedDefaultVal: {
        type1: 'sun'
      },
    }
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/defaultValuesSetupColProp',
  firestoreRefType: 'collection',
  moduleName: 'defaultValuesSetupColProp',
  statePropName: 'prop',
  sync: {
    defaultValues: {
      defaultVal: true,
      nestedDefaultVal: {
        type: 'moon'
      },
    },
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
