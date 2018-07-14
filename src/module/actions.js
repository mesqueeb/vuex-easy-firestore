import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { isArray, isString } from 'is-what'
import merge from '../utils/deepmerge'
import copyObj from '../utils/copyObj'
import setDefaultValues from '../utils/setDefaultValues'
import startDebounce from '../utils/debounceHelper'
import flattenToPaths from '../utils/objectFlattenToPaths'
import error from './errors'

const actions = {
  patchDoc (
    {state, getters, commit, dispatch},
    {id = '', ids = [], doc} = {ids: [], doc: {}}
  ) {
    // 0. payload correction (only arrays)
    if (!isArray(ids)) return console.log('ids needs to be an array')
    if (id) ids.push(id)
    if (doc.id) delete doc.id

    // 1. Prepare for patching
    let syncStackItems = getters.prepareForPatch(ids, doc)

    // 2. Push to syncStack
    Object.keys(syncStackItems).forEach(id => {
      const newVal = (!state._sync.syncStack.updates[id])
        ? syncStackItems[id]
        : merge(state._sync.syncStack.updates[id],
                syncStackItems[id])
      state._sync.syncStack.updates[id] = newVal
    })

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  deleteDoc ({state, getters, commit, dispatch},
  ids = []) {
    // 0. payload correction (only arrays)
    if (!isArray(ids)) ids = [ids]

    // 1. Prepare for patching
    const syncStackIds = getters.prepareForDeletion(ids)

    // 2. Push to syncStack
    const deletions = state._sync.syncStack.deletions.concat(syncStackIds)
    state._sync.syncStack.deletions = deletions

    if (!state._sync.syncStack.deletions.length) return
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  deleteProp ({state, getters, commit, dispatch},
  path) {
    // 1. Prepare for patching
    // 2. Push to syncStack
    state._sync.syncStack.propDeletions.push(path)

    if (!state._sync.syncStack.propDeletions.length) return
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  insertDoc ({state, getters, commit, dispatch},
  docs = []) {
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
  handleSyncStackDebounce ({state, commit, dispatch, getters}) {
    if (!getters.signedIn) return false
    if (!state._sync.syncStack.debounceTimer) {
      const debounceTimer = startDebounce(1000)
      debounceTimer.done.then(_ => dispatch('batchSync'))
      state._sync.syncStack.debounceTimer = debounceTimer
    }
    state._sync.syncStack.debounceTimer.refresh()
  },
  batchSync ({getters, commit, dispatch, state, rootGetters}) {
    const collectionMode = getters.collectionMode
    const dbRef = getters.dbRef
    let batch = Firebase.firestore().batch()
    let count = 0
    // Add 'updates' to batch
    let updatesOriginal = copyObj(state._sync.syncStack.updates)
    let updates = Object.keys(updatesOriginal).map(k => {
      let fields = updatesOriginal[k]
      return {id: k, fields}
    })
    // Check if there are more than 500 batch items already
    if (updates.length >= 500) {
      // Batch supports only until 500 items
      count = 500
      let updatesOK = updates.slice(0, 500)
      let updatesLeft = updates.slice(500, -1)
      // Put back the remaining items over 500
      state._sync.syncStack.updates = updatesLeft.reduce((carry, item) => {
        carry[item.id] = item
        delete item.id
        return carry
      }, {})
      updates = updatesOK
    } else {
      state._sync.syncStack.updates = {}
      count = updates.length
    }
    // Add to batch
    updates.forEach(item => {
      let id = item.id
      let docRef = (collectionMode) ? dbRef.doc(id) : dbRef
      let fields = flattenToPaths(item.fields)
      fields.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
      // console.log('fields → ', fields)
      batch.update(docRef, fields)
    })
    // Add 'propDeletions' to batch
    let propDeletions = copyObj(state._sync.syncStack.propDeletions)
    // Check if there are more than 500 batch items already
    if (count >= 500) {
      // already at 500 or more, leave items in syncstack, and don't add anything to batch
      propDeletions = []
    } else {
      // Batch supports only until 500 items
      let deletionsAmount = 500 - count
      let deletionsOK = propDeletions.slice(0, deletionsAmount)
      let deletionsLeft = propDeletions.slice(deletionsAmount, -1)
      // Put back the remaining items over 500
      state._sync.syncStack.propDeletions = deletionsLeft
      count = count + deletionsOK.length
      // Define the items we'll add below
      propDeletions = deletionsOK
    }
    // Add to batch
    propDeletions.forEach(path => {
      const updateObj = {}
      updateObj[path] = Firebase.firestore.FieldValue.delete()
      updateObj.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
      let docRef = dbRef
      batch.update(docRef, updateObj)
    })
    // Add 'deletions' to batch
    let deletions = copyObj(state._sync.syncStack.deletions)
    // Check if there are more than 500 batch items already
    if (count >= 500) {
      // already at 500 or more, leave items in syncstack, and don't add anything to batch
      deletions = []
    } else {
      // Batch supports only until 500 items
      let deletionsAmount = 500 - count
      let deletionsOK = deletions.slice(0, deletionsAmount)
      let deletionsLeft = deletions.slice(deletionsAmount, -1)
      // Put back the remaining items over 500
      state._sync.syncStack.deletions = deletionsLeft
      count = count + deletionsOK.length
      // Define the items we'll add below
      deletions = deletionsOK
    }
    // Add to batch
    deletions.forEach(id => {
      let docRef = dbRef.doc(id)
      batch.delete(docRef)
    })
    // Add 'inserts' to batch
    let inserts = copyObj(state._sync.syncStack.inserts)
    // Check if there are more than 500 batch items already
    if (count >= 500) {
      // already at 500 or more, leave items in syncstack, and don't add anything to batch
      inserts = []
    } else {
      // Batch supports only until 500 items
      let insertsAmount = 500 - count
      let insertsOK = inserts.slice(0, insertsAmount)
      let insertsLeft = inserts.slice(insertsAmount, -1)
      // Put back the remaining items over 500
      state._sync.syncStack.inserts = insertsLeft
      count = count + insertsOK.length
      // Define the items we'll add below
      inserts = insertsOK
    }
    // Add to batch
    inserts.forEach(item => {
      item.created_at = Firebase.firestore.FieldValue.serverTimestamp()
      item.created_by = rootGetters['user/id']
      let newRef = getters.dbRef.doc(item.id)
      batch.set(newRef, item)
    })
    // Commit the batch:
    // console.log(`[batchSync] START:
    //   ${Object.keys(updates).length} updates,
    //   ${deletions.length} deletions,
    //   ${inserts.length} inserts`
    // )
    dispatch('_startPatching')
    state._sync.syncStack.debounceTimer = null
    return new Promise((resolve, reject) => {
      batch.commit()
      .then(res => {
        if (Object.keys(updates).length) console.log(`updates: `, updates)
        if (deletions.length) console.log(`deletions: `, deletions)
        if (inserts.length) console.log(`inserts: `, inserts)
        if (propDeletions.length) console.log(`propDeletions: `, propDeletions)
        const remainingSyncStack = Object.keys(state._sync.syncStack.updates).length
          + state._sync.syncStack.deletions.length
          + state._sync.syncStack.inserts.length
          + state._sync.syncStack.propDeletions.length
        if (remainingSyncStack) { dispatch('batchSync') }
        dispatch('_stopPatching')
        return resolve()
        // // Fetch the item if it was added as an Archived item:
        // if (item.archived) {
          //   get_ters.dbRef.doc(res.id).get()
          //   .then(doc => {
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
        return reject()
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
      fRef.get()
      .then(querySnapshot => {
        const docs = querySnapshot.docs
        if (docs.length === 0) {
          state._sync.fetched[identifier].done = true
          resolve('fetchedAll')

          return
        }
        if (docs.length < state._conf.fetch.docLimit) {
          state._sync.fetched[identifier].done = true
        }
        state._sync.fetched[identifier].retrievedFetchRefs.push(fetchRef)
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
    if (Firebase.auth().currentUser) state._sync.signedIn = true
    const collectionMode = getters.collectionMode
    let dbRef = getters.dbRef
    // apply where filters and orderBy
    if (state._conf.firestoreRefType.toLowerCase() !== 'doc') {
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
    return new Promise ((resolve, reject) => {
      dbRef
      .onSnapshot(querySnapshot => {
        let source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server'
        if (!collectionMode) {
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
    if (
      !doc.id ||
      (!state._conf.statePropName && !state[doc.id]) ||
      (state._conf.statePropName && !state[state._conf.statePropName][doc.id])
    ) {
      return dispatch('insert', doc)
    }
    return dispatch('patch', doc)
  },
  insert ({state, getters, commit, dispatch}, doc) {
    const store = this
    if (!doc) return
    if (!doc.id) doc.id = getters.dbRef.doc().id
    // define the store update
    function storeUpdateFn (_doc) {
      commit('INSERT_DOC', _doc)
      return dispatch('insertDoc', _doc)
    }
    // check for hooks
    if (state._conf.sync.insertHook) {
      return state._conf.sync.insertHook(storeUpdateFn, doc, store)
    }
    return storeUpdateFn(doc)
  },
  patch ({state, getters, commit, dispatch}, doc) {
    const store = this
    if (!doc) return
    if (!doc.id && getters.collectionMode) return
    // define the store update
    function storeUpdateFn (_doc) {
      commit('PATCH_DOC', _doc)
      return dispatch('patchDoc', {id: _doc.id, doc: _doc})
    }
    // check for hooks
    if (state._conf.sync.patchHook) {
      return state._conf.sync.patchHook(storeUpdateFn, doc, store)
    }
    return storeUpdateFn(doc)
  },
  patchBatch (
    {state, getters, commit, dispatch},
    {doc, ids = []}
  ) {
    const store = this
    if (!doc) return
    // define the store update
    function storeUpdateFn (_doc) {
      commit('PATCH_DOC', _doc)
      return dispatch('patchDoc', {ids, doc: _doc})
    }
    // check for hooks
    if (state._conf.sync.patchHook) {
      return state._conf.sync.patchHook(storeUpdateFn, doc, store)
    }
    return storeUpdateFn(doc)
  },
  delete ({state, getters, commit, dispatch}, id) {
    const store = this
    // define the store update
    function storeUpdateFn (_id) {
      if (state._conf.firestoreRefType.toLowerCase() === 'doc') {
        const path = _id // id is a path in this case
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
