// store
import iniState from './module/state'
import iniMutations from './module/mutations'
import iniActions from './module/actions'
import iniGetters from './module/getters'

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
export default function (userConfig) {
  const userState = userConfig.state
  const userMutations = userConfig.mutations
  const userActions = userConfig.actions
  const userGetters = userConfig.getters
  delete userConfig.state
  delete userConfig.mutations
  delete userConfig.actions
  delete userConfig.getters
  return {
    namespaced: true,
    state: iniState(userState, userConfig),
    mutations: iniMutations(userMutations),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  }
}
