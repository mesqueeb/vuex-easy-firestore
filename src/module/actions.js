import Firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { isArray } from 'is-what'
import merge from '../utils/deepmerge'
import setDefaultValues from '../utils/setDefaultValues'
import startDebounce from '../utils/debounceHelper'
import { makeBatchFromSyncstack } from '../utils/apiHelpers'
import { getId, getValueFromPayloadPiece } from '../utils/payloadHelpers'
import error from './errors'

const actions = {
  patchDoc (
    {state, getters, commit, dispatch},
    {id = '', ids = [], doc} = {ids: [], doc: {}}
  ) {
    // 0. payload correction (only arrays)
    if (!isArray(ids)) return console.error('ids needs to be an array')
    if (id) ids.push(id)
    if (doc.id) delete doc.id

    // 1. Prepare for patching
    const syncStackItems = getters.prepareForPatch(ids, doc)

    // 2. Push to syncStack
    Object.keys(syncStackItems).forEach(id => {
      const newVal = (!state._sync.syncStack.updates[id])
        ? syncStackItems[id]
        : merge(state._sync.syncStack.updates[id], syncStackItems[id])
      state._sync.syncStack.updates[id] = newVal
    })

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  deleteDoc (
    {state, getters, commit, dispatch},
    ids = []
  ) {
    // 0. payload correction (only arrays)
    if (!isArray(ids)) ids = [ids]

    // 1. Prepare for patching
    // 2. Push to syncStack
    const deletions = state._sync.syncStack.deletions.concat(ids)
    state._sync.syncStack.deletions = deletions

    if (!state._sync.syncStack.deletions.length) return
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  deleteProp (
    {state, getters, commit, dispatch},
    path
  ) {
    // 1. Prepare for patching
    // 2. Push to syncStack
    state._sync.syncStack.propDeletions.push(path)

    if (!state._sync.syncStack.propDeletions.length) return
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  insertDoc (
    {state, getters, commit, dispatch},
    docs = []
  ) {
    // 0. payload correction (only arrays)
    if (!isArray(docs)) docs = [docs]

    // 1. Prepare for patching
    const syncStack = getters.prepareForInsert(docs)

    // 2. Push to syncStack
    const inserts = state._sync.syncStack.inserts.concat(syncStack)
    state._sync.syncStack.inserts = inserts

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  insertInitialDoc ({state, getters, commit, dispatch}) {
    // 0. only docMode
    if (getters.collectionMode) return

    // 1. Prepare for insert
    const initialDoc = (getters.storeRef) ? getters.storeRef : {}
    const doc = getters.prepareInitialDocForInsert(initialDoc)

    // 2. insert
    return getters.dbRef.set(doc)
  },
  handleSyncStackDebounce ({state, commit, dispatch, getters}) {
    if (!getters.signedIn) return false
    if (!state._sync.syncStack.debounceTimer) {
      const debounceTimer = startDebounce(1000)
      debounceTimer.done.then(_ => dispatch('batchSync'))
      state._sync.syncStack.debounceTimer = debounceTimer
    }
    state._sync.syncStack.debounceTimer.refresh()
  },
  batchSync ({getters, commit, dispatch, state}) {
    const collectionMode = getters.collectionMode
    const dbRef = getters.dbRef
    const userId = state._sync.userId
    const batch = makeBatchFromSyncstack(state, dbRef, collectionMode, userId)
    dispatch('_startPatching')
    state._sync.syncStack.debounceTimer = null
    return new Promise((resolve, reject) => {
      batch.commit().then(res => {
        const remainingSyncStack = Object.keys(state._sync.syncStack.updates).length +
          state._sync.syncStack.deletions.length +
          state._sync.syncStack.inserts.length +
          state._sync.syncStack.propDeletions.length
        if (remainingSyncStack) { dispatch('batchSync') }
        dispatch('_stopPatching')
        return resolve()
        // // Fetch the item if it was added as an Archived item:
        // if (item.archived) {
        //   get_ters.dbRef.doc(res.id).get().then(doc => {
        //     let tempId = doc.data().id
        //     let id = doc.id
        //     let item = doc.data()
        //     item.id = id
        //     console.log('retrieved Archived new item: ', id, item)
        //     dispatch('newItemFromServer', {item, tempId})
        //   })
        // }
      }).catch(error => {
        state._sync.patching = 'error'
        state._sync.syncStack.debounceTimer = null
        Error('Error during synchronisation.', error)
        return reject(error)
      })
    })
  },
  fetch (
    {state, getters, commit, dispatch},
    {whereFilters = [], orderBy = []} = {whereFilters: [], orderBy: []}
    // whereFilters: [['archived', '==', true]]
    // orderBy: ['done_date', 'desc']
  ) {
    return new Promise((resolve, reject) => {
      console.log('[fetch] starting')
      if (!getters.signedIn) return resolve()
      const identifier = JSON.stringify({whereFilters, orderBy})
      const fetched = state._sync.fetched[identifier]
      // We've never fetched this before:
      if (!fetched) {
        let ref = getters.dbRef
        // apply where filters and orderBy
        whereFilters.forEach(paramsArr => {
          ref = ref.where(...paramsArr)
        })
        if (orderBy.length) {
          ref = ref.orderBy(...orderBy)
        }
        state._sync.fetched[identifier] = {
          ref,
          done: false,
          retrievedFetchRefs: [],
          nextFetchRef: null
        }
      }
      const fRequest = state._sync.fetched[identifier]
      // We're already done fetching everything:
      if (fRequest.done) {
        console.log('done fetching')
        return resolve('fetchedAll')
      }
      // attach fetch filters
      let fRef = state._sync.fetched[identifier].ref
      if (fRequest.nextFetchRef) {
        // get next ref if saved in state
        fRef = state._sync.fetched[identifier].nextFetchRef
      }
      fRef = fRef.limit(state._conf.fetch.docLimit)
      // Stop if all records already fetched
      if (fRequest.retrievedFetchRefs.includes(fRef)) {
        console.log('Already retrieved this part.')
        return resolve()
      }
      // make fetch request
      fRef.get().then(querySnapshot => {
        const docs = querySnapshot.docs
        if (docs.length === 0) {
          state._sync.fetched[identifier].done = true
          querySnapshot.done = true
          return resolve(querySnapshot)
        }
        if (docs.length < state._conf.fetch.docLimit) {
          state._sync.fetched[identifier].done = true
        }
        state._sync.fetched[identifier].retrievedFetchRefs.push(fRef)
        // Get the last visible document
        resolve(querySnapshot)
        const lastVisible = docs[docs.length - 1]
        // get the next records.
        const next = fRef.startAfter(lastVisible)
        state._sync.fetched[identifier].nextFetchRef = next
      }).catch(error => {
        console.error(error)
        return reject(error)
      })
    })
  },
  serverUpdate ({commit}, {change, id, doc = {}}) {
    doc.id = id
    switch (change) {
      case 'added':
        commit('INSERT_DOC', doc)
        break
      case 'removed':
        commit('DELETE_DOC', id)
        break
      default:
        commit('PATCH_DOC', doc)
        break
    }
  },
  openDBChannel ({getters, state, commit, dispatch}) {
    const store = this
    if (Firebase.auth().currentUser) {
      state._sync.signedIn = true
      state._sync.userId = Firebase.auth().currentUser.uid
    }
    let dbRef = getters.dbRef
    // apply where filters and orderBy
    if (getters.collectionMode) {
      state._conf.sync.where.forEach(paramsArr => {
        dbRef = dbRef.where(...paramsArr)
      })
      if (state._conf.sync.orderBy.length) {
        dbRef = dbRef.orderBy(...state._conf.sync.orderBy)
      }
    }
    // define handleDoc()
    function handleDoc (change, id, doc, source) {
      change = (!change) ? 'modified' : change.type
      // define storeUpdateFn()
      function storeUpdateFn (_doc) {
        return dispatch('serverUpdate', {change, id, doc: _doc})
      }
      // get user set sync hook function
      const syncHookFn = state._conf.serverChange[change + 'Hook']
      if (syncHookFn) {
        syncHookFn(storeUpdateFn, doc, id, store, source, change)
      } else {
        storeUpdateFn(doc)
      }
    }
    // make a promise
    return new Promise((resolve, reject) => {
      dbRef.onSnapshot(querySnapshot => {
        const source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server'
        if (!getters.collectionMode) {
          if (!querySnapshot.data()) {
            // No initial doc found in docMode
            console.log('insert initial doc')
            return dispatch('insertInitialDoc')
          }
          const doc = setDefaultValues(querySnapshot.data(), state._conf.serverChange.defaultValues)
          if (source === 'local') return resolve()
          handleDoc(null, null, doc, source)
          return resolve()
        }
        querySnapshot.docChanges().forEach(change => {
          // Don't do anything for local modifications & removals
          if (source === 'local' &&
            (change.type === 'modified' || change.type === 'removed')
          ) {
            return resolve()
          }
          const id = change.doc.id
          const doc = (change.type === 'added')
            ? setDefaultValues(change.doc.data(), state._conf.serverChange.defaultValues)
            : change.doc.data()
          handleDoc(change, id, doc, source)
          return resolve()
        })
      }, error => {
        state._sync.patching = 'error'
        return reject(error)
      })
    })
  },
  set ({commit, dispatch, getters, state}, doc) {
    if (!doc) return
    if (!getters.collectionMode) {
      return dispatch('patch', doc)
    }
    const id = getId(doc)
    if (
      !id ||
      (!state._conf.statePropName && !state[id]) ||
      (state._conf.statePropName && !state[state._conf.statePropName][id])
    ) {
      return dispatch('insert', doc)
    }
    return dispatch('patch', doc)
  },
  insert ({state, getters, commit, dispatch}, doc) {
    const store = this
    if (!getters.signedIn) return 'auth/invalid-user-token'
    if (!doc) return
    const newDoc = getValueFromPayloadPiece(doc)
    if (!newDoc.id) newDoc.id = getters.dbRef.doc().id
    // define the store update
    function storeUpdateFn (_doc) {
      commit('INSERT_DOC', _doc)
      return dispatch('insertDoc', _doc)
    }
    // check for hooks
    if (state._conf.sync.insertHook) {
      return state._conf.sync.insertHook(storeUpdateFn, newDoc, store)
    }
    return storeUpdateFn(newDoc)
  },
  insertBatch ({state, getters, commit, dispatch}, docs) {
    const store = this
    if (!getters.signedIn) return 'auth/invalid-user-token'
    if (!isArray(docs) || !docs.length) return

    const newDocs = docs.reduce((carry, _doc) => {
      const newDoc = getValueFromPayloadPiece(_doc)
      if (!newDoc.id) newDoc.id = getters.dbRef.doc().id
      carry.push(newDoc)
      return carry
    }, [])
    // define the store update
    function storeUpdateFn (_docs) {
      _docs.forEach(_doc => {
        commit('INSERT_DOC', _doc)
      })
      return dispatch('insertDoc', _docs)
    }
    // check for hooks
    if (state._conf.sync.insertBatchHook) {
      return state._conf.sync.insertBatchHook(storeUpdateFn, newDocs, store)
    }
    return storeUpdateFn(newDocs)
  },
  patch ({state, getters, commit, dispatch}, doc) {
    const store = this
    if (!doc) return
    const id = (getters.collectionMode) ? getId(doc) : undefined
    const value = (getters.collectionMode) ? getValueFromPayloadPiece(doc) : doc
    if (!id && getters.collectionMode) return
    // add id to value
    if (!value.id) value.id = id
    // define the store update
    function storeUpdateFn (_val) {
      commit('PATCH_DOC', _val)
      return dispatch('patchDoc', {id, doc: _val})
    }
    // check for hooks
    if (state._conf.sync.patchHook) {
      return state._conf.sync.patchHook(storeUpdateFn, value, store)
    }
    return storeUpdateFn(value)
  },
  patchBatch (
    {state, getters, commit, dispatch},
    {doc, ids = []}
  ) {
    const store = this
    if (!doc) return
    // define the store update
    function storeUpdateFn (_doc, _ids) {
      _ids.forEach(_id => {
        commit('PATCH_DOC', {id: _id, ..._doc})
      })
      return dispatch('patchDoc', {ids: _ids, doc: _doc})
    }
    // check for hooks
    if (state._conf.sync.patchBatchHook) {
      return state._conf.sync.patchBatchHook(storeUpdateFn, doc, ids, store)
    }
    return storeUpdateFn(doc, ids)
  },
  delete ({state, getters, commit, dispatch}, id) {
    if (!id) return
    const store = this
    function storeUpdateFn (_id) {
      // id is a path
      const pathDelete = (_id.includes('.') || !getters.collectionMode)
      if (pathDelete) {
        const path = _id
        if (!path) return error('actionsDeleteMissingPath')
        commit('DELETE_PROP', path)
        return dispatch('deleteProp', path)
      }
      if (!_id) return error('actionsDeleteMissingId')
      commit('DELETE_DOC', _id)
      return dispatch('deleteDoc', _id)
    }
    // check for hooks
    if (state._conf.sync.deleteHook) {
      return state._conf.sync.deleteHook(storeUpdateFn, id, store)
    }
    return storeUpdateFn(id)
  },
  deleteBatch ({state, getters, commit, dispatch}, ids) {
    if (!isArray(ids)) return
    if (!ids.length) return
    const store = this
    // define the store update
    function storeUpdateFn (_ids) {
      _ids.forEach(_id => {
        // id is a path
        const pathDelete = (_id.includes('.') || !getters.collectionMode)
        if (pathDelete) {
          const path = _id
          if (!path) return error('actionsDeleteMissingPath')
          commit('DELETE_PROP', path)
          return dispatch('deleteProp', path)
        }
        if (!_id) return error('actionsDeleteMissingId')
        commit('DELETE_DOC', _id)
        return dispatch('deleteDoc', _id)
      })
    }
    // check for hooks
    if (state._conf.sync.deleteBatchHook) {
      return state._conf.sync.deleteBatchHook(storeUpdateFn, ids, store)
    }
    return storeUpdateFn(ids)
  },
  _stopPatching ({state, commit}) {
    if (state._sync.stopPatchingTimeout) { clearTimeout(state._sync.stopPatchingTimeout) }
    state._sync.stopPatchingTimeout = setTimeout(_ => { state._sync.patching = false }, 300)
  },
  _startPatching ({state, commit}) {
    if (state._sync.stopPatchingTimeout) { clearTimeout(state._sync.stopPatchingTimeout) }
    state._sync.patching = true
  }
}

export default function (userActions = {}) {
  return Object.assign({}, actions, userActions)
}
