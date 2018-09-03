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
  firestorePath: 'playerCharacters/player7',
  firestoreRefType: 'doc',
  moduleName: 'mainCharacter',
  statePropName: '',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
