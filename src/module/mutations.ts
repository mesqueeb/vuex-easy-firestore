import { isObject } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import error from './errors'
import merge from 'merge-anything'
import { AnyObject } from '../declarations'

/**
 * a function returning the mutations object
 *
 * @export
 * @returns {AnyObject} the mutations object
 */
export default function (): AnyObject {
  return {
    SET_PATHVARS (state, pathVars) {
      const self = this
      Object.keys(pathVars).forEach(key => {
        const pathPiece = pathVars[key]
        self._vm.$set(state._sync.pathVariables, key, pathPiece)
        const path = state._conf.firestorePath.replace(`{${key}}`, `${pathPiece}`)
        state._conf.firestorePath = path
      })
    },
    resetSyncStack (state) {
      state._sync.syncStack = {
        updates: {},
        deletions: [],
        inserts: [],
        debounceTimer: null
      }
    },
    INSERT_DOC (state, doc) {
      if (state._conf.firestoreRefType.toLowerCase() !== 'collection') return
      if (state._conf.statePropName) {
        this._vm.$set(state[state._conf.statePropName], doc.id, doc)
      } else {
        this._vm.$set(state, doc.id, doc)
      }
    },
    PATCH_DOC (state, doc) {
      // Get the state prop ref
      let ref = (state._conf.statePropName)
        ? state[state._conf.statePropName]
        : state
      if (state._conf.firestoreRefType.toLowerCase() === 'collection') {
        ref = ref[doc.id]
      }
      if (!ref) return error('patchNoRef')
      return Object.keys(doc).forEach(key => {
        // Merge if exists
        const newVal = (isObject(ref[key]) && isObject(doc[key]))
          ? merge(ref[key], doc[key])
          : doc[key]
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
