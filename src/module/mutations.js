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
  }
}

export default function (userMutations) {
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
