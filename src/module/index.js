import merge from '../utils/deepmerge'
// store
import defaultConfig from './defaultConfig'
import initialState from './state'
import iniMutations from './mutations'
import iniActions from './actions'
import iniGetters from './getters'
import errorCheck from './errorCheckConfig'

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
export default function (userConfig) {
  const conf = merge(defaultConfig, userConfig)
  if (!errorCheck(conf)) return
  const userState = conf.state
  const userMutations = conf.mutations
  const userActions = conf.actions
  const userGetters = conf.getters
  delete conf.state
  delete conf.mutations
  delete conf.actions
  delete conf.getters

  const docContainer = {}
  if (conf.statePropName) docContainer[conf.statePropName] = {}
  const state = merge(initialState, userState, docContainer, {_conf: conf})
  return {
    namespaced: true,
    state,
    mutations: iniMutations(userMutations, merge(initialState, userState)),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  }
}
