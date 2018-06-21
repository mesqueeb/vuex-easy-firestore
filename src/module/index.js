// store
import iniState from './state'
import iniMutations from './mutations'
import iniActions from './actions'
import iniGetters from './getters'
import errorCheck from './errorCheck'

let conf = {state: null, mutations: null, actions: null, getters: null}

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
export default function (userConfig) {
  Object.assign(conf, userConfig)
  if (!errorCheck(conf)) return
  const userState = conf.state
  const userMutations = conf.mutations
  const userActions = conf.actions
  const userGetters = conf.getters
  delete conf.state
  delete conf.mutations
  delete conf.actions
  delete conf.getters
  const state = iniState(userState, conf)
  return {
    namespaced: true,
    state,
    mutations: iniMutations(userMutations, state),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  }
}
