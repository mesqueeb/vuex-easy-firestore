import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    name: 'Satoshi',
    pokemonBelt: [],
    items: []
  }
}

export default {
  // easy firestore config
  firestorePath: 'coll/{name}',
  firestoreRefType: 'collection',
  moduleName: 'testMutationsWithStateProp',
  statePropName: 'putItHere',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
