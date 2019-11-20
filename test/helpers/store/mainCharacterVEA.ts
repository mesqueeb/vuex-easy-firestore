import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    name: 'Satoshi',
    pokemonBelt: [],
    items: [],
    multipleFastEdits: null,
  }
}

export default {
  // easy firestore config
  firestorePath: 'playerCharactersVEA/Satoshi',
  firestoreRefType: 'doc',
  moduleName: 'mainCharacterVEA',
  statePropName: null,
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
