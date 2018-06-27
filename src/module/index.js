// store
import defaultConfig from './defaultConfig'
import initialState from './state'
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

  const docContainer = {}
  if (conf.docsStateProp) docContainer[conf.docsStateProp] = {}
  const state = Object.assign({}, initialState, defaultConfig, userState, conf, docContainer)

  return {
    namespaced: true,
    state,
    mutations: iniMutations(userMutations, Object.assign({}, initialState, userState)),
    actions: iniActions(userActions),
    getters: iniGetters(userGetters)
  }
}
