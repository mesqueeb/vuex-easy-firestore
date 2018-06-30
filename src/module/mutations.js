import { defaultMutations } from 'vuex-easy-access'
import { isObject } from 'is-what'
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
    if (state._conf.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$set(state[state._conf.statePropName], doc.id, doc)
  },
  PATCH_DOC (state, doc) {
    if (state._conf.firestoreRefType.toLowerCase() === 'doc') {
      if (!state._conf.statePropName) {
        return Object.keys(doc).forEach(key => {
          // Merge if exists
          const newVal = (state[key] === undefined)
            ? doc[key]
            : (!isObject(state[key]) || !isObject(doc[key]))
              ? doc[key]
              : merge(state[key], doc[key])
          this._vm.$set(state, key, newVal)
        })
      }
      // state[state._conf.statePropName] will always be an empty object by default
      state[state._conf.statePropName] = merge(state[state._conf.statePropName], doc)
      return
    }
    // Merge if exists
    const newVal = (state[state._conf.statePropName][doc.id] === undefined)
      ? doc
      : (!isObject(state[state._conf.statePropName][doc.id]) || !isObject(doc))
        ? doc
        : merge(state[state._conf.statePropName][doc.id], doc)
    this._vm.$set(state[state._conf.statePropName], doc.id, newVal)
  },
  DELETE_DOC (state, id) {
    if (state._conf.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$delete(state[state._conf.statePropName], id)
  }
}

export default function (userMutations = {}, state) {
  const vuexEasyMutations = defaultMutations(state)
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
