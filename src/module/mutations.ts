import { isArray, isFunction, isNumber } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import { flattenObject } from 'flatten-anything'
import pathToProp from 'path-to-prop'
import logError from './errors'
import copy from 'copy-anything'
import { merge } from 'merge-anything'
import { AnyObject } from '../declarations'
import { isArrayHelper } from '../utils/arrayHelpers'
import { isIncrementHelper } from '../utils/incrementHelper'
import getStateWithSync from './state'

function convertHelpers (originVal, newVal) {
  if (isArray(originVal) && isArrayHelper(newVal)) {
    newVal = newVal.executeOn(originVal)
  }
  if (isNumber(originVal) && isIncrementHelper(newVal)) {
    newVal = newVal.executeOn(originVal)
  }
  return newVal // always return newVal as fallback!!
}

/**
 * Creates the params needed to $set a target based on a nested.path
 *
 * @param {object} target
 * @param {string} path
 * @param {*} value
 * @returns {[object, string, any]}
 */
function getSetParams (target: object, path: string, value: any): [object, string, any] {
  const pathParts = path.split('.')
  const prop = pathParts.pop()
  const pathParent = pathParts.join('.')
  const targetForNestedProp = pathToProp(target, pathParent)
  if (targetForNestedProp === undefined) {
    // the target doesn't have an object ready at this level to set the value to
    // so we need to step down a level and try again
    return getSetParams(target, pathParent, { [prop]: value })
  }
  const valueToSet = value
  return [targetForNestedProp, prop, valueToSet]
}

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
    SET_SYNCCLAUSES (state, { where, orderBy }) {
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
      const newState = merge(copy(userState), { _sync })
      const { statePropName } = state._conf
      const docContainer = statePropName ? state[statePropName] : state
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
      let ref = state._conf.statePropName ? state[state._conf.statePropName] : state
      if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
        ref = ref[patches.id]
      }
      if (!ref) return logError('patch-no-ref')

      const patchesFlat = flattenObject(patches)
      for (const [path, value] of Object.entries(patchesFlat)) {
        const targetVal = pathToProp(ref, path)
        const newVal = convertHelpers(targetVal, value)
        // do not update anything if the values are the same
        // this is technically not required, because vue takes care of this as well:
        if (targetVal === newVal) continue
        // update just the nested value
        const setParams = getSetParams(ref, path, newVal)
        this._vm.$set(...setParams)
      }
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
      const searchTarget = state._conf.statePropName ? state[state._conf.statePropName] : state
      const propArr = path.split('.')
      const target = propArr.pop()
      if (!propArr.length) {
        return this._vm.$delete(searchTarget, target)
      }
      const ref = getDeepRef(searchTarget, propArr.join('.'))
      return this._vm.$delete(ref, target)
    },
  }
}
