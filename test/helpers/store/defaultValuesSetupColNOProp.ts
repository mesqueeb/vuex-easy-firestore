import { defaultMutations } from 'vuex-easy-access'

function initialState() {
  return {
    defaultVal1: true,
    nestedDefaultVal: {
      type1: 'sun',
    },
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/defaultValuesSetupColNOProp',
  firestoreRefType: 'collection',
  moduleName: 'defaultValuesSetupColNOProp',
  statePropName: null,
  sync: {
    defaultValues: {
      defaultVal: true,
      nestedDefaultVal: {
        type: 'moon',
      },
    },
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
