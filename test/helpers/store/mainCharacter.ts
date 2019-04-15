import { defaultMutations } from 'vuex-easy-access'

function initialState () {
  return {
    name: 'Satoshi',
    pokemonBelt: [],
    items: [],
    multipleFastEdits: null,
    stepCounter: 0,
  }
}

export default {
  // easy firestore config
  firestorePath: 'playerCharacters/Satoshi',
  firestoreRefType: 'doc',
  moduleName: 'mainCharacter',
  statePropName: '',
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
