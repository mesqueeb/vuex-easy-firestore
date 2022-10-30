import { defaultMutations } from 'vuex-easy-access'

function initialState() {
  return {
    NOT: false,
    prop: {
      defaultVal1: true,
      nestedDefaultVal: {
        type1: 'sun',
      },
    },
  }
}

export default {
  // easy firestore config
  firestorePath: 'configTests/defaultValuesSetupDocProp',
  firestoreRefType: 'doc',
  moduleName: 'defaultValuesSetupDocProp',
  statePropName: 'prop',
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
