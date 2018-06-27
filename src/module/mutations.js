import { defaultMutations } from 'vuex-easy-access'

const mutations = {
  resetSyncStack (state) {
    state.syncStack = {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    }
  },
  INSERT_DOC (state, doc) {
    if (state.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$set(state[state.docsStateProp], doc.id, doc)
  },
  PATCH_DOC (state, doc) {
    if (state.firestoreRefType.toLowerCase() === 'doc') {
      if (!state.docsStateProp) {
        return Object.keys(doc).forEach(key => {
          this._vm.$set(state, key, doc[key])
        })
      }
      doc = Object.assign(state[state.docsStateProp], doc)
      state[state.docsStateProp] = doc
      return
    }
    doc = (state[state.docsStateProp][doc.id])
      ? Object.assign(state[state.docsStateProp][doc.id], doc)
      : doc
    this._vm.$set(state[state.docsStateProp], doc.id, doc)
  },
  DELETE_DOC (state, id) {
    if (state.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$delete(state[state.docsStateProp], id)
  }
}

export default function (userMutations = {}, state) {
  const vuexEasyMutations = defaultMutations(state)
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
