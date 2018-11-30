import { isString, isPlainObject, isAnyObject } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import { findAndReplaceIf } from 'find-and-replace-anything'
import flattenToPaths from '../utils/objectFlattenToPaths'
import checkFillables from '../utils/checkFillables'
import { getPathVarMatches } from '../utils/apiHelpers'
import { isArrayHelper } from '../utils/arrayHelpers'
import { AnyObject } from '../declarations'
import error from './errors'

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
          let patchData: AnyObject = {}
          // retrieve full object in case there's an empty doc passed
          if (!Object.keys(doc).length) {
            patchData = (collectionMode)
              ? getters.storeRef[id]
              : getters.storeRef
          } else {
            patchData = doc
          }
          // set default fields
          patchData.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
          patchData.updated_by = state._sync.userId
          // replace arrayUnion and arrayRemove
          function checkFn (foundVal) {
            if (isArrayHelper(foundVal)) {
              return foundVal.getFirestoreFieldValue()
            }
            return foundVal
          }
          patchData = findAndReplaceIf(patchData, checkFn)
          // add fillable and guard defaults
          let fillables = state._conf.sync.fillables
          if (fillables.length) fillables = fillables.concat(['updated_at', 'updated_by'])
          const guard = state._conf.sync.guard.concat(['_conf', '_sync'])
          // clean up item
          const cleanedPatchData = checkFillables(patchData, fillables, guard)
          const itemToUpdate = flattenToPaths(cleanedPatchData)
          // add id (required to get ref later at apiHelpers.ts)
          itemToUpdate.id = id
          carry[id] = itemToUpdate
          return carry
        }, {})
      },
    prepareForPropDeletion: (state, getters, rootState, rootGetters) =>
      (path = '') => {
        const collectionMode = getters.collectionMode
        const patchData: AnyObject = {}
        // set default fields
        patchData.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
        patchData.updated_by = state._sync.userId
        // add fillable and guard defaults
        let fillables = state._conf.sync.fillables
        if (fillables.length) fillables = fillables.concat(['updated_at', 'updated_by'])
        const guard = state._conf.sync.guard.concat(['_conf', '_sync'])
        // clean up item
        const cleanedPatchData = checkFillables(patchData, fillables, guard)
        // add id (required to get ref later at apiHelpers.ts)
        let id, cleanedPath
        if (collectionMode) {
          id = path.substring(0, path.indexOf('.'))
          cleanedPath = path.substring(path.indexOf('.') + 1)
        } else {
          id = 'singleDoc'
          cleanedPath = path
        }
        cleanedPatchData[cleanedPath] = Firebase.firestore.FieldValue.delete()
        cleanedPatchData.id = id
        return {[id]: cleanedPatchData}
      },
    prepareForInsert: (state, getters, rootState, rootGetters) =>
      (items = []) => {
        // add fillable and guard defaults
        let fillables = state._conf.sync.fillables
        if (fillables.length) fillables = fillables.concat(['id', 'created_at', 'created_by'])
        const guard = state._conf.sync.guard.concat(['_conf', '_sync'])
        return items.reduce((carry, item) => {
          // set default fields
          item.created_at = Firebase.firestore.FieldValue.serverTimestamp()
          item.created_by = state._sync.userId
          // clean up item
          item = checkFillables(item, fillables, guard)
          carry.push(item)
          return carry
        }, [])
      },
    prepareInitialDocForInsert: (state, getters, rootState, rootGetters) =>
      (doc) => {
        // add fillable and guard defaults
        let fillables = state._conf.sync.fillables
        if (fillables.length) fillables = fillables.concat(['id', 'created_at', 'created_by'])
        const guard = state._conf.sync.guard.concat(['_conf', '_sync'])
        // set default fields
        doc.created_at = Firebase.firestore.FieldValue.serverTimestamp()
        doc.created_by = state._sync.userId
        // clean up item
        doc = checkFillables(doc, fillables, guard)
        return doc
      },
    whereFilters: (state, getters) => {
      const whereArrays = state._conf.sync.where
      return whereArrays.map(whereClause => {
        return whereClause.map(param => {
          if (!isString(param)) return param
          let cleanedParam = param
          getPathVarMatches(param).forEach(key => {
            const keyRegEx = new RegExp(`\{${key}\}`, 'g')
            if (key === 'userId') {
              cleanedParam = cleanedParam.replace(keyRegEx, state._sync.userId)
              return
            }
            if (!Object.keys(state._sync.pathVariables).includes(key)) {
              return error('missingPathVarKey')
            }
            const varVal = state._sync.pathVariables[key]
            // if path is only a param we need to just assign to avoid stringification
            if (param === `{${key}}`) {
              cleanedParam = varVal
              return
            }
            cleanedParam = cleanedParam.replace(keyRegEx, varVal)
          })
          return cleanedParam
        })
      })
    },
  }
}
