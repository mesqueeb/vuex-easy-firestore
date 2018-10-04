import merge from 'merge-anything'
// store
import { IStore, IUserConfig, IPluginState } from '../declarations'
import defaultConfig from './defaultConfig'
import pluginState from './state'
import pluginMutations from './mutations'
import pluginActions from './actions'
import pluginGetters from './getters'
import errorCheck from './errorCheckConfig'

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {object} userConfig Takes a config object as per ...
 * @returns {object} the module ready to be included in your vuex store
 */
export default function (userConfig: IUserConfig): IStore {
  const conf: IUserConfig = merge(
    {state: {}, mutations: {}, actions: {},getters: {}},
    defaultConfig,
    userConfig
  )
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
  return {
    namespaced: true,
    state: merge(pluginState, userState, docContainer, {_conf: conf}),
    mutations: merge(userMutations, pluginMutations),
    actions: merge(userActions, pluginActions),
    getters: merge(userGetters, pluginGetters)
  }
}
