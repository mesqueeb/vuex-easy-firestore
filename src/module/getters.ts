import { isString, isArray } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import filter from 'filter-anything'
import { merge } from 'merge-anything'
import flatten from 'flatten-anything'
import { getPathVarMatches } from '../utils/apiHelpers'
import setDefaultValues from '../utils/setDefaultValues'
import { AnyObject } from '../declarations'
import error from './errors'
import { getFirestore, collection, doc, deleteField } from 'firebase/firestore';

export type IPluginGetters = {
  firestorePathComplete: (state: any, getters?: any, rootState?: any, rootGetters?: any) => string
  signedIn: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean
  dbRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => any
  storeRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => AnyObject
  collectionMode: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean
  prepareForPatch: (
    state: any,
    getters?: any,
    rootState?: any,
    rootGetters?: any
  ) => (ids: string[], doc: AnyObject) => AnyObject
  prepareForInsert: (
    state: any,
    getters?: any,
    rootState?: any,
    rootGetters?: any
  ) => (items: any[]) => any[]
  prepareInitialDocForInsert: (
    state: any,
    getters?: any,
    rootState?: any,
    rootGetters?: any
  ) => (doc: AnyObject) => AnyObject
}

/**
 * A function returning the getters object
 *
 * @export
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the getters object
 */
export default function (firebaseApp: any): AnyObject {
  const firestore = getFirestore(firebaseApp);
  return {
    firestorePathComplete (state, getters) {
      let path = state._conf.firestorePath
      Object.keys(state._sync.pathVariables).forEach(key => {
        const pathPiece = state._sync.pathVariables[key]
        path = path.replace(`{${key}}`, `${pathPiece}`)
      })
      const requireUser = path.includes('{userId}')
      if (requireUser) {
        const userId = state._sync.userId
        if (getters.signedIn && isString(userId) && userId !== '' && userId !== '{userId}') {
          path = path.replace('{userId}', userId)
        }
      }
      return path
    },
    signedIn: (state, getters, rootState, rootGetters) => {
      const requireUser = state._conf.firestorePath.includes('{userId}')
      if (!requireUser) return true
      return state._sync.signedIn
    },
    dbRef: (state, getters, rootState, rootGetters) => {
      const path = getters.firestorePathComplete
      return getters.collectionMode
        ? collection(firestore, path)
        : doc(firestore, path)
    },
    storeRef: (state, getters, rootState) => {
      const path = state._conf.statePropName
        ? `${state._conf.moduleName}/${state._conf.statePropName}`
        : state._conf.moduleName
      return getDeepRef(rootState, path)
    },
    collectionMode: (state, getters, rootState) => {
      return state._conf.firestoreRefType.toLowerCase() === 'collection'
    },
    docModeId: (state, getters) => {
      return getters.firestorePathComplete.split('/').pop()
    },
    fillables: state => {
      let fillables = state._conf.sync.fillables
      if (!fillables.length) return fillables
      return fillables.concat(['updated_at', 'updated_by', 'id', 'created_at', 'created_by'])
    },
    guard: state => {
      return state._conf.sync.guard.concat(['_conf', '_sync'])
    },
    defaultValues: (state, getters) => {
      return merge(
        state._conf.sync.defaultValues,
        state._conf.serverChange.defaultValues // depreciated
      )
    },
    cleanUpRetrievedDoc: (state, getters, rootState, rootGetters) => (doc, id) => {
      const defaultValues = merge(getters.defaultValues, state._conf.serverChange.convertTimestamps)
      const cleanDoc = setDefaultValues(doc, defaultValues)
      cleanDoc.id = id
      return cleanDoc
    },
    prepareForPatch: (state, getters, rootState, rootGetters) => (ids = [], doc = {}) => {
      // get relevant data from the storeRef
      const collectionMode = getters.collectionMode
      if (!collectionMode) ids.push(getters.docModeId)
      // returns {object} -> {id: data}
      return ids.reduce((carry, id) => {
        let patchData: AnyObject = {}
        // retrieve full object in case there's an empty doc passed
        if (!Object.keys(doc).length) {
          patchData = collectionMode ? getters.storeRef[id] : getters.storeRef
        } else {
          patchData = doc
        }
        // set default fields
        patchData.updated_at = new Date()
        patchData.updated_by = state._sync.userId
        // clean up item
        const cleanedPatchData = filter(patchData, getters.fillables, getters.guard)
        const itemToUpdate = flatten(cleanedPatchData)
        // add id (required to get ref later at apiHelpers.ts)
        // @ts-ignore
        itemToUpdate.id = id
        carry[id] = itemToUpdate
        return carry
      }, {})
    },
    prepareForPropDeletion: (state, getters, rootState, rootGetters) => (path = '') => {
      const collectionMode = getters.collectionMode
      const patchData: AnyObject = {}
      // set default fields
      patchData.updated_at = new Date()
      patchData.updated_by = state._sync.userId
      // add fillable and guard defaults
      // clean up item
      const cleanedPatchData = filter(patchData, getters.fillables, getters.guard)
      // add id (required to get ref later at apiHelpers.ts)
      let id, cleanedPath
      if (collectionMode) {
        id = path.substring(0, path.indexOf('.'))
        cleanedPath = path.substring(path.indexOf('.') + 1)
      } else {
        id = getters.docModeId
        cleanedPath = path
      }
      cleanedPatchData[cleanedPath] = deleteField()
      cleanedPatchData.id = id
      return { [id]: cleanedPatchData }
    },
    prepareForInsert: (state, getters, rootState, rootGetters) => (items = []) => {
      // add fillable and guard defaults
      return items.reduce((carry, item) => {
        // set default fields
        item.created_at = new Date()
        item.created_by = state._sync.userId
        // clean up item
        item = filter(item, getters.fillables, getters.guard)
        carry.push(item)
        return carry
      }, [])
    },
    prepareInitialDocForInsert: (state, getters, rootState, rootGetters) => doc => {
      // add fillable and guard defaults
      // set default fields
      doc.created_at = new Date()
      doc.created_by = state._sync.userId
      doc.id = getters.docModeId
      // clean up item
      doc = filter(doc, getters.fillables, getters.guard)
      return doc
    },
    getWhereArrays: (state, getters) => whereArrays => {
      if (!isArray(whereArrays)) whereArrays = state._conf.sync.where
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
              return error('missing-path-variables')
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
