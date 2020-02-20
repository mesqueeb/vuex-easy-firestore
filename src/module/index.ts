import copy from 'copy-anything'
import { merge } from 'merge-anything'
// store
import { IStore, IEasyFirestoreModule } from '../declarations'
import defaultConfig from './defaultConfig'
import pluginState from './state'
import pluginMutations from './mutations'
import pluginActions from './actions'
import pluginGetters from './getters'
import errorCheck from './errorCheckConfig'

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {IEasyFirestoreModule} userConfig Takes a config object per module
 * @param {*} FirebaseDependency The Firebase dependency (non-instanciated), defaults to the Firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
export default function (
  userConfig: IEasyFirestoreModule,
  FirebaseDependency: any
): IStore {
  // prepare state._conf
  const conf: IEasyFirestoreModule = copy(
    merge(
      { state: {}, mutations: {}, actions: {}, getters: {} },
      defaultConfig,
      userConfig
    )
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
  // prepare rest of state
  const docContainer = {}
  if (conf.statePropName) docContainer[conf.statePropName] = {}
  const restOfState = merge(userState, docContainer)
  // if 'doc' mode, set merge initial state onto default values
  if (conf.firestoreRefType === 'doc') {
    const defaultValsInState = conf.statePropName
      ? restOfState[conf.statePropName]
      : restOfState
    conf.sync.defaultValues = copy(
      merge(defaultValsInState, conf.sync.defaultValues)
    )
  }
  return {
    namespaced: true,
    state: merge(pluginState(), restOfState, { _conf: conf }),
    mutations: merge(
      userMutations,
      pluginMutations(merge(userState, { _conf: conf }))
    ),
    actions: merge(userActions, pluginActions(FirebaseDependency)),
    getters: merge(userGetters, pluginGetters(FirebaseDependency))
  }
}
