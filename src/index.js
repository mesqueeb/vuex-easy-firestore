// store
import iniState from './module/state'
import iniMutations from './module/mutations'
import iniActions from './module/actions'
import iniGetters from './module/getters'

let conf = {state: null, mutations: null, actions: null, getters: null}

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
export default function (userConfig) {
  Object.assign(conf, userConfig)
  const userState = conf.state
  const userMutations = conf.mutations
  const userActions = conf.actions
  const userGetters = conf.getters
  delete conf.state
  delete conf.mutations
  delete conf.actions
  delete conf.getters
  return {
    namespaced: true,
    state: iniState(userState, conf),
    mutations: iniMutations(userMutations),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  }
}
