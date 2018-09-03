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
  firestorePath: 'pokemonBoxes/{playerName}/pokemon',
  firestoreRefType: 'collection',
  moduleName: 'pokemonBox',
  statePropName: 'pokemon',
  // Sync:
  sync: {
    where: [['id', '==', '{pokeId}']],
    orderBy: [],
    fillables: ['fillable', 'name', 'id', 'type', 'freed'],
    guard: ['guarded'],
    // HOOKS for local changes:
    insertHook: function (updateStore, doc, store) {
      doc.addedBeforeInsert = true
      return updateStore(doc)
    },
    patchHook: function (updateStore, doc, store) {
      doc.addedBeforePatch = true
      return updateStore(doc)
    },
    deleteHook: function (updateStore, id, store) {
      if (id === 'stopBeforeDelete') return
      return updateStore(id)
    }
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
