import { defaultMutations } from 'vuex-easy-access'
import initialState from './state'

const vuexEasyMutations = defaultMutations(initialState())
const mutations = {
  resetSyncStack(state) {
    state.syncStack = {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    }
  },
  INSERT_DOC (state, {id, doc}) {
    this._vm.$set(state[state.docsStateProp], id, doc)
  },
  PATCH_DOC (state, {id, doc}) {
    this._vm.$set(state[state.docsStateProp], id, Object.assign(
      state[state.docsStateProp][id], doc
    ))
  },
  DELETE_DOC (state, {id}) {
    this._vm.$delete(state[state.docsStateProp], id)
  },
}
export default function (userMutations = {}) {
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
