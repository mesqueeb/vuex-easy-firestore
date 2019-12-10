import { isArray, isFunction, isNumber } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import logError from './errors'
import copy from 'copy-anything'
import merge from 'merge-anything'
import { AnyObject } from '../declarations'
import { isArrayHelper } from '../utils/arrayHelpers'
import { isIncrementHelper } from '../utils/incrementHelper'
import getStateWithSync from './state'

/**
 * a function returning the mutations object
 *
 * @export
 * @param {object} userState
 * @returns {AnyObject} the mutations object
 */
export default function (userState: object): AnyObject {
  return {
    SET_PATHVARS (state, pathVars) {
      const self = this
      Object.keys(pathVars).forEach(key => {
        const pathPiece = pathVars[key]
        self._vm.$set(state._sync.pathVariables, key, pathPiece)
      })
    },
    SET_SYNCCLAUSES (state, {where, orderBy}) {
      if (where && isArray(where)) state._conf.sync.where = where
      if (orderBy && isArray(orderBy)) state._conf.sync.orderBy = orderBy
    },
    SET_USER_ID (state, userId) {
      if (!userId) {
        state._sync.signedIn = false
        state._sync.userId = null
      } else {
        state._sync.signedIn = true
        state._sync.userId = userId
      }
    },
    CLEAR_USER (state) {
      state._sync.signedIn = false
      state._sync.userId = null
    },
    RESET_VUEX_EASY_FIRESTORE_STATE (state) {
      // unsubscribe all DBChannel listeners:
      Object.keys(state._sync.unsubscribe).forEach(unsubscribe => {
        if (isFunction(unsubscribe)) unsubscribe()
      })
      const self = this
      const { _sync } = getStateWithSync()
      const newState = merge(copy(userState), {_sync})
      const { statePropName } = state._conf
      const docContainer = (statePropName)
        ? state[statePropName]
        : state
      Object.keys(newState).forEach(key => {
        self._vm.$set(state, key, newState[key])
      })
      Object.keys(docContainer).forEach(key => {
        if (Object.keys(newState).includes(key)) return
        self._vm.$delete(docContainer, key)
      })
    },
    resetSyncStack (state) {
      const { _sync } = getStateWithSync()
      const { syncStack } = _sync
      state._sync.syncStack = syncStack
    },
    INSERT_DOC (state, doc) {
      if (state._conf.firestoreRefType.toLowerCase() !== 'collection') return
      if (state._conf.statePropName) {
        this._vm.$set(state[state._conf.statePropName], doc.id, doc)
      } else {
        this._vm.$set(state, doc.id, doc)
      }
    },
    PATCH_DOC (state, patches) {
      // Get the state prop ref
      let ref = (state._conf.statePropName)
        ? state[state._conf.statePropName]
        : state
      if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
        ref = ref[patches.id]
      }
      if (!ref) return logError('patch-no-ref')
      return Object.keys(patches).forEach(key => {
        let newVal = patches[key]
        // Merge if exists
        function helpers (originVal, newVal) {
          if (isArray(originVal) && isArrayHelper(newVal)) {
            newVal = newVal.executeOn(originVal)
          }
          if (isNumber(originVal) && isIncrementHelper(newVal)) {
            newVal = newVal.executeOn(originVal)
          }
          return newVal // always return newVal as fallback!!
        }
        newVal = merge({extensions: [helpers]}, ref[key], patches[key])
        this._vm.$set(ref, key, newVal)
      })
    },
    DELETE_DOC (state, id) {
      if (state._conf.firestoreRefType.toLowerCase() !== 'collection') return
      if (state._conf.statePropName) {
        this._vm.$delete(state[state._conf.statePropName], id)
      } else {
        this._vm.$delete(state, id)
      }
    },
    DELETE_PROP (state, path) {
      const searchTarget = (state._conf.statePropName)
        ? state[state._conf.statePropName]
        : state
      const propArr = path.split('.')
      const target = propArr.pop()
      if (!propArr.length) {
        return this._vm.$delete(searchTarget, target)
      }
      const ref = getDeepRef(searchTarget, propArr.join('.'))
      return this._vm.$delete(ref, target)
    }
  }
}
