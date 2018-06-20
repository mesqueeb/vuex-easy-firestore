import Firebase from 'firebase/app'
import 'firebase/firestore'
import copyObj from '../utils/copyObj'
import { isArray, isString } from 'is-what'

import setDefaultValues from '../utils/setDefaultValues'
import startDebounce from '../utils/debounceHelper'

const actions = {
  patch (
    {state, getters, commit, dispatch},
    {id = '', ids = [], field = '', fields = []} = {ids: [], fields: []}
  ) {
    // 0. payload correction (only arrays)
    if (!isArray(ids) || !isArray(fields)) return console.log('ids, fields need to be arrays')
    if (!isString(id) || !isString(field)) return console.log('id, field need to be strings')
    if (id) ids.push(id)
    if (field) fields.push(field)

    // 1. Prepare for patching
    let syncStackItems = getters.prepareForPatch(ids, fields)

    // 2. Push to syncStack
    Object.keys(syncStackItems).forEach(id => {
      if (!state.syncStack.updates[id]) {
        state.syncStack.updates[id] = {}
      }
      Object.assign(state.syncStack.updates[id], syncStackItems[id])
    })

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  delete ({state, getters, commit, dispatch},
  {id = '', ids = []} = {ids: []}) {
    // 0. payload correction (only arrays)
    if (!isArray(ids)) return console.log('ids needs to be an array')
    if (!isString(id)) return console.log('id needs to be a string')
    if (id) ids.push(id)

    // 1. Prepare for patching
    const syncStackIds = getters.prepareForDeletion(ids)

    // 2. Push to syncStack
    const deletions = state.syncStack.deletions.concat(syncStackIds)
    commit('SET_SYNCSTACK.DELETIONS', deletions)

    if (!state.syncStack.deletions.length) return
    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  insert ({state, getters, commit, dispatch},
  {item, items = []} = {items: []}) {
    // 0. payload correction (only arrays)
    if (!isArray(items)) return console.log('items needs to be an array')
    if (item) items.push(item)

    // 1. Prepare for patching
    const syncStackItems = getters.prepareForInsert(items)

    // 2. Push to syncStack
    const inserts = state.syncStack.inserts.concat(syncStackItems)
    commit('SET_SYNCSTACK.INSERTS', inserts)

    // 3. Create or refresh debounce
    return dispatch('handleSyncStackDebounce')
  },
  handleSyncStackDebounce ({state, commit, dispatch, getters}) {
    if (!getters.signedIn) return false
    if (!state.syncStack.debounceTimer) {
      const debounceTimer = startDebounce(1000)
      debounceTimer.done.then(_ => dispatch('batchSync'))
      commit('SET_SYNCSTACK.DEBOUNCETIMER', debounceTimer)
    }
    state.syncStack.debounceTimer.refresh()
  },
  async batchSync ({getters, commit, dispatch, state}) {
    const dbRef = getters.dbRef
    let batch = Firebase.firestore().batch()
    let count = 0
    // Add 'updateds' to batch
    let updatesOriginal = copyObj(state.syncStack.updates)
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
      state.syncStack.updates = updatesLeft.reduce((carry, item) => {
        carry[item.id] = item
        delete item.id
        return carry
      }, {})
      updates = updatesOK
    } else {
      state.syncStack.updates = {}
    }
    // Add to batch
    updates.forEach(item => {
      let id = item.id
      let docRef = dbRef.doc(id)
      let fields = item.fields
      batch.update(docRef, fields)
    })
    // Add 'deletions' to batch
    let deletions = copyObj(state.syncStack.deletions)
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
      commit('SET_SYNCSTACK.DELETIONS', deletionsLeft)
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
    let inserts = copyObj(state.syncStack.inserts)
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
      commit('SET_SYNCSTACK.INSERTS', insertsLeft)
      count = count + insertsOK.length
      // Define the items we'll add below
      inserts = insertsOK
    }
    // Add to batch
    inserts.forEach(item => {
      let newRef = getters.dbRef.doc()
      batch.set(newRef, item)
    })
    // Commit the batch:
    // console.log(`[batchSync] START:
    //   ${Object.keys(updates).length} updates,
    //   ${deletions.length} deletions,
    //   ${inserts.length} inserts`
    // )
    dispatch('startPatching')
    commit('SET_SYNCSTACK.DEBOUNCETIMER', null)
    await batch.commit()
    .then(res => {
      console.log(`[batchSync] RESOLVED:`, res, `
        updates: `, Object.keys(updates).length ? updates : {}, `
        deletions: `, deletions.length ? deletions : [], `
        inserts: `, inserts.length ? inserts : []
      )
      let remainingSyncStack = Object.keys(state.syncStack.updates).length
        + state.syncStack.deletions.length
        + state.syncStack.inserts.length
      if (remainingSyncStack) { dispatch('batchSync') }
      dispatch('stopPatching')

      // // Fetch the item if it was added as an Archived item:
      // if (item.archived) {
        //   getters.dbRef.doc(res.id).get()
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
      commit('SET_PATCHING', 'error')
      commit('SET_SYNCSTACK.DEBOUNCETIMER', null)
      throw error
    })
  },
  fetch (
    {state, getters, commit},
    {whereFilters = [], orderBy = []} = {whereFilters: [], orderBy: []}
    // whereFilters: [['archived', '==', true]]
    // orderBy: ['done_date', 'desc']
  ) {
    return new Promise((resolve, reject) => {
      console.log('[fetch] starting')
      if (!getters.signedIn) return resolve()
      if (state.doneFetching) {
        console.log('done fetching')
        return resolve('fetchedAll')
      }
      // attach fetch filters
      let fetchRef
      if (state.nextFetchRef) {
        // get next ref if saved in state
        fetchRef = state.nextFetchRef
      } else {
        // apply where filters and orderBy
        fetchRef = getters.dbRef
        whereFilters.forEach(paramsArr => {
          fetchRef = fetchRef.where(...paramsArr)
        })
        if (orderBy.length) {
          fetchRef = fetchRef.orderBy(...orderBy)
        }
      }
      fetchRef = fetchRef.limit(state.fetch.docLimit)
      // Stop if all records already fetched
      if (state.retrievedFetchRefs.includes(fetchRef)) {
        console.log('Already retrieved this part.')
        return resolve()
      }
      // make fetch request
      fetchRef.get()
      .then(querySnapshot => {
        const docs = querySnapshot.docs
        if (docs.length === 0) {
          commit('SET_DONEFETCHING', true)
          return resolve('fetchedAll')
        }
        if (docs.length < state.fetch.docLimit) {
          commit('SET_DONEFETCHING', true)
        }
        commit('PUSH_RETRIEVEDFETCHREFS', fetchRef)
        // Get the last visible document
        resolve(querySnapshot)
        const lastVisible = docs[docs.length - 1]
        // get the next records.
        const next = fetchRef.startAfter(lastVisible)
        commit('SET_NEXTFETCHREF', next)
      }).catch(error => {
        console.log(error)
        return reject(error)
      })
    })
  },
  dbUpdate ({dispatch}, {change, id, doc}) {
    switch (change) {
      case 'added':
        dispatch('SET_DOC', {id, doc})
        break
      case 'modified':
        dispatch('OVERWRITE_DOC', {id, doc})
        break
      case 'removed':
        dispatch('DELETE_DOC', {id})
        break
    }
  },
  openDBChannel ({getters, state, commit, dispatch}) {
    let dbRef = getters.dbRef
    // apply where filters and orderBy
    state.sync.where.forEach(paramsArr => {
      dbRef = dbRef.where(...paramsArr)
    })
    if (state.sync.orderBy.length) {
      dbRef = dbRef.orderBy(...state.sync.orderBy)
    }
    // make a promise
    return new Promise ((resolve, reject) => {
      dbRef
      .onSnapshot(querySnapshot => {
        let source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server'
        console.log(`found ${querySnapshot.docs.length} documents`)
        querySnapshot.docChanges().forEach(change => {
          // Don't do anything for local modifications & removals
          if (source === 'local' &&
            (change.type === 'modified' || change.type === 'removed')
          ) {
            return resolve()
          }
          const id = change.doc.id
          const doc = (change.type === 'added')
            ? setDefaultValues(change.doc.data(), state.sync.defaultValues)
            : change.doc.data()
          // prepare dbUpdate action
          function storeUpdateFn () { return dispatch('dbUpdate', {change: change.type, id, doc}) }
          // get user set sync hook function
          const syncHookFn = state.sync[change.type]
          if (syncHookFn) {
            syncHookFn(storeUpdateFn, this, id, doc, source)
          } else {
            storeUpdateFn()
          }
          resolve()
        })
      }, error => {
        commit('SET_PATCHING', 'error')
        return reject(error)
      })
    })
  },
  SET_DOC ({getters}, {id, doc}) {
    this._vm.$set(getters.storeRef, id, doc)
  },
  OVERWRITE_DOC ({getters}, {id, doc}) {
    this._vm.$set(getters.storeRef, id, Object.assign(
      getters.storeRef[id], doc
    ))
  },
  DELETE_DOC ({getters}, {id}) {
    this._vm.$delete(getters.storeRef, id)
  },
  stopPatching ({state, commit}) {
    if (state.stopPatchingTimeout) { clearTimeout(state.stopPatchingTimeout) }
    state.stopPatchingTimeout = setTimeout(_ => { commit('SET_PATCHING', false) }, 300)
  },
  startPatching ({state, commit}) {
    if (state.stopPatchingTimeout) { clearTimeout(state.stopPatchingTimeout) }
    commit('SET_PATCHING', true)
  }
}

export default function (userActions = {}) {
  return Object.assign({}, actions, userActions)
}
