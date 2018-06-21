import { defaultMutations } from 'vuex-easy-access'

export default function (userMutations = {}, state) {
  const vuexEasyMutations = defaultMutations(state)
  const mutations = {
    resetSyncStack(state) {
      state.syncStack = {
        updates: {},
        deletions: [],
        inserts: [],
        debounceTimer: null
      }
    },
    INSERT_DOC (state, doc) {
      this._vm.$set(state[state.docsStateProp], doc.id, doc)
    },
    PATCH_DOC (state, doc) {
      this._vm.$set(state[state.docsStateProp], doc.id, Object.assign(
        state[state.docsStateProp][doc.id], doc
      ))
    },
    DELETE_DOC (state, id) {
      this._vm.$delete(state[state.docsStateProp], id)
    },
  }
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
