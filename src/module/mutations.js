import { isObject } from 'is-what'
import { getDeepRef } from 'vuex-easy-access'
import merge from '../utils/deepmerge'

const mutations = {
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
    // When patching in single 'doc' mode
    if (state._conf.firestoreRefType.toLowerCase() === 'doc') {
      // if no target prop is the state
      if (!state._conf.statePropName) {
        return Object.keys(doc).forEach(key => {
          // Merge if exists
          const newVal = (state[key] === undefined || !isObject(state[key]) || !isObject(doc[key]))
            ? doc[key]
            : merge(state[key], doc[key])
          this._vm.$set(state, key, newVal)
        })
      }
      // state[state._conf.statePropName] will always be an empty object by default
      state[state._conf.statePropName] = merge(state[state._conf.statePropName], doc)
      return
    }
    // Patching in 'collection' mode
    // get the doc ref
    const docRef = (state._conf.statePropName)
      ? state[state._conf.statePropName][doc.id]
      : state[doc.id]
    // Merge if exists
    const newVal = (docRef === undefined || !isObject(docRef) || !isObject(doc))
      ? doc
      : merge(docRef, doc)
    if (state._conf.statePropName) {
      this._vm.$set(state[state._conf.statePropName], doc.id, newVal)
    } else {
      this._vm.$set(state, doc.id, newVal)
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
    if (state._conf.firestoreRefType.toLowerCase() !== 'doc') return
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

export default function (userMutations = {}, state) {
  return Object.assign({}, mutations, userMutations)
}
