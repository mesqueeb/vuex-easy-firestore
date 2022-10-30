import { defaultMutations } from 'vuex-easy-access'

function initialState() {
  return {
    playerName: 'Satoshi',
    pokemon: {},
    stats: {
      pokemonCount: 0,
      freedCount: 0,
    },
  }
}

export default {
  // easy firestore config
  firestorePath: 'pokemonBoxesVEA/Satoshi/pokemon',
  firestoreRefType: 'collection',
  moduleName: 'pokemonBoxVEA',
  statePropName: 'pokemon',
  // Sync:
  sync: {
    where: [['id', '==', '{pokeId}']],
    orderBy: [],
    fillables: [
      'fillable',
      'name',
      'id',
      'type',
      'freed',
      'nested',
      'addedBeforeInsert',
      'addedBeforePatch',
      'arr1',
      'arr2',
      'guarded',
      'defaultVal',
      'nestedDefaultVal',
    ],
    guard: ['guarded'],
    defaultValues: {
      defaultVal: true,
      nestedDefaultVal: {
        types: 'moon',
      },
    },
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
    },
  },
  // module
  state: initialState(),
  mutations: defaultMutations(initialState()),
  actions: {},
  getters: {},
}
