import { defaultMutations } from 'vuex-easy-access'
import { isObject } from 'is-what'
import merge from '../../node_modules/deepmerge/dist/es.js'
import overwriteMerge from '../utils/overwriteMerge'

const mutations = {
  resetSyncStack (state) {
    state.syncStack = {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    }
  },
  INSERT_DOC (state, doc) {
    if (state.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$set(state[state.docsStateProp], doc.id, doc)
  },
  PATCH_DOC (state, doc) {
    if (state.firestoreRefType.toLowerCase() === 'doc') {
      if (!state.docsStateProp) {
        return Object.keys(doc).forEach(key => {
          // Merge if exists
          const newVal = (state[key] === undefined)
            ? doc[key]
            : (!isObject(state[key]) || !isObject(doc[key]))
              ? doc[key]
              : merge(state[key], doc[key], {arrayMerge: overwriteMerge})
          this._vm.$set(state, key, newVal)
        })
      }
      // state[state.docsStateProp] will always be an empty object by default
      state[state.docsStateProp] = merge(
        state[state.docsStateProp],
        doc,
        {arrayMerge: overwriteMerge}
      )
      return
    }
    // Merge if exists
    const newVal = (state[state.docsStateProp][doc.id] === undefined)
      ? doc
      : (!isObject(state[state.docsStateProp][doc.id]) || !isObject(doc))
        ? doc
        : merge(state[state.docsStateProp][doc.id], doc, {arrayMerge: overwriteMerge})
    this._vm.$set(state[state.docsStateProp], doc.id, newVal)
  },
  DELETE_DOC (state, id) {
    if (state.firestoreRefType.toLowerCase() === 'doc') return
    this._vm.$delete(state[state.docsStateProp], id)
  }
}

export default function (userMutations = {}, state) {
  const vuexEasyMutations = defaultMutations(state)
  return Object.assign({}, vuexEasyMutations, mutations, userMutations)
}
