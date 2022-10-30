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

export type FirestoreConfig = {
  FirebaseDependency?: any
  enablePersistence?: boolean
  synchronizeTabs?: boolean
}

/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {IEasyFirestoreModule} userConfig Takes a config object per module
 * @param {*} FirebaseDependency The firebase dependency (non-instanciated), defaults to the firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
export default function (
  userConfig: IEasyFirestoreModule,
  firestoreConfig: FirestoreConfig
): IStore {
  const { FirebaseDependency } = firestoreConfig
  // prepare state._conf
  const conf: IEasyFirestoreModule = copy(
    merge({ state: {}, mutations: {}, actions: {}, getters: {} }, defaultConfig, userConfig)
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
    const defaultValsInState = conf.statePropName ? restOfState[conf.statePropName] : restOfState
    conf.sync.defaultValues = copy(merge(defaultValsInState, conf.sync.defaultValues))
  }

  // Warn overloaded mutations / actions / getters
  let uKeys, pKeys
  const pMutations = pluginMutations(merge(userState, { _conf: conf }))
  const pActions = pluginActions(firestoreConfig)
  const pGetters = pluginGetters(FirebaseDependency)

  uKeys = Object.keys(userMutations)
  pKeys = Object.keys(pMutations)
  for (const key of uKeys) {
    if (pKeys.includes(key)) {
      console.warn(`[vuex-easy-firestore] Overloaded mutation: ${conf.moduleName}/${key}`)
    }
  }

  uKeys = Object.keys(userActions)
  pKeys = Object.keys(pActions)
  for (const key of uKeys) {
    if (pKeys.includes(key)) {
      console.warn(`[vuex-easy-firestore] Overloaded action: ${conf.moduleName}/${key}`)
    }
  }

  uKeys = Object.keys(userGetters)
  pKeys = Object.keys(pGetters)
  for (const key of uKeys) {
    if (pKeys.includes(key)) {
      console.warn(`[vuex-easy-firestore] Overloaded getter: ${conf.moduleName}/${key}`)
    }
  }

  return {
    namespaced: true,
    state: merge(pluginState(), restOfState, { _conf: conf }),
    mutations: { ...userMutations, ...pMutations },
    actions: { ...userActions, ...pActions },
    getters: { ...userGetters, ...pGetters },
  }
}
