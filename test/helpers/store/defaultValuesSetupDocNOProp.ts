import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    defaultVal1: true,
    nestedDefaultVal: {
      type1: 'sun',
    },
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/defaultValuesSetupDocNOProp',
  firestoreRefType: 'doc',
  moduleName: 'defaultValuesSetupDocNOProp',
  statePropName: null,
  sync: {
    defaultValues: {
      defaultVal2: true,
      nestedDefaultVal: {
        type2: 'moon',
      },
    },
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
