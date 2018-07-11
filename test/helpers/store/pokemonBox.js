import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    playerName: 'Satoshi',
    pokemon: {},
    stats: {
      pokemonCount: 0,
      freedCount: 0,
    }
  }
}

export default {
  // easy firestore config
  firestorePath: 'pokemonBoxes/Satoshi/pokemon',
  firestoreRefType: 'collection',
  moduleName: 'pokemonBox',
  statePropName: 'pokemon',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
