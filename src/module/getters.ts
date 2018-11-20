import { getDeepRef } from 'vuex-easy-access'
import checkFillables from '../utils/checkFillables'
import { AnyObject } from '../declarations'

export type IPluginGetters = {
  firestorePathComplete: (state: any, getters?: any, rootState?: any, rootGetters?: any) => string
  signedIn: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean
  dbRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => any
  storeRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => AnyObject
  collectionMode: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean
  prepareForPatch: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (ids: string[], doc: AnyObject) => AnyObject
  prepareForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (items: any[]) => any[]
  prepareInitialDocForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (doc: AnyObject) => AnyObject
}

/**
 * A function returning the getters object
 *
 * @export
 * @param {*} Firebase The Firebase dependency
 * @returns {AnyObject} the getters object
 */
export default function (Firebase: any): AnyObject {
  return {
    firestorePathComplete (state, getters) {
      let path = state._conf.firestorePath
      const requireUser = path.includes('{userId}')
      if (requireUser) {
        if (!getters.signedIn) return path
        if (!Firebase.auth().currentUser) return path
        const userId = Firebase.auth().currentUser.uid
        path = path.replace('{userId}', userId)
      }
      Object.keys(state._sync.pathVariables).forEach(key => {
        const pathPiece = state._sync.pathVariables[key]
        path = path.replace(`{${key}}`, `${pathPiece}`)
      })
      return path
    },
    signedIn: (state, getters, rootState, rootGetters) => {
      const requireUser = state._conf.firestorePath.includes('{userId}')
      if (!requireUser) return true
      return state._sync.signedIn
    },
    dbRef: (state, getters, rootState, rootGetters) => {
      const path = getters.firestorePathComplete
      return (getters.collectionMode)
        ? Firebase.firestore().collection(path)
        : Firebase.firestore().doc(path)
    },
    storeRef: (state, getters, rootState) => {
      const path = (state._conf.statePropName)
        ? `${state._conf.moduleName}/${state._conf.statePropName}`
        : state._conf.moduleName
      return getDeepRef(rootState, path)
    },
    collectionMode: (state, getters, rootState) => {
      return (state._conf.firestoreRefType.toLowerCase() === 'collection')
    },
    prepareForPatch: (state, getters, rootState, rootGetters) =>
      (ids = [], doc = {}) => {
        // get relevant data from the storeRef
        const collectionMode = getters.collectionMode
        if (!collectionMode) ids.push('singleDoc')
        // returns {object} -> {id: data}
        return ids.reduce((carry, id) => {
          let patchData = {}
          // retrieve full object
          if (!Object.keys(doc).length) {
            patchData = (collectionMode)
              ? getters.storeRef[id]
              : getters.storeRef
          } else {
            patchData = doc
          }
          const cleanedPatchData = checkFillables(patchData, state._conf.sync.fillables, state._conf.sync.guard)
          cleanedPatchData.id = id
          carry[id] = cleanedPatchData
          return carry
        }, {})
      },
    prepareForInsert: (state, getters, rootState, rootGetters) =>
      (items = []) => {
        return items.reduce((carry, item) => {
          item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard)
          carry.push(item)
          return carry
        }, [])
      },
    prepareInitialDocForInsert: (state, getters, rootState, rootGetters) =>
      (doc) => {
        doc = checkFillables(doc, state._conf.sync.fillables, state._conf.sync.guard)
        return doc
      }
  }
}
