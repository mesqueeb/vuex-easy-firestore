import { defaultMutations, getDeepRef } from 'vuex-easy-access'
import { isArray, isFunction } from 'is-what'
import startDebounce from './utils/debounceHelper'
import copyObj from './utils/copyObj'
import setDefaultValues from './utils/setDefaultValues'
import checkFillables from './utils/checkFillables'
import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import testConfig from './testConfig'
import defaultConfig from './defaultConfig'

function initialState () {
  return {
    syncStack: {
      updates: {},
      deletions: [],
      inserts: [],
      debounceTimer: null
    },
    retrievedFetchRefs: [],
    nextFetchRef: null,
    patching: false,
    doneFetching: false,
    stopPatchingTimeout: null,
  }
}

const interface = Object.assign(defaultConfig, testConfig)

export default {
  state: {
    ...initialState(),
    ...interface,
  },
  mutations:
  {
    ...defaultMutations(initialState()),
    resetSyncStack (state) {
      state.syncStack = {
        updates: {},
        deletions: [],
        inserts: [],
        debounceTimer: null
      }
    },
  },
  actions:
  {
    patch (
      {state, rootState, getters, rootGetters, commit, dispatch},
      {id, ids = [], field = '', fields = []} = {id: '', ids: [], field: '', fields: []}
    ) {
      // 0. payload correction (only arrays)
      if (id) { ids = ids.push(id) }
      if (field) { fields = fields.push(field) }

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
    delete ({state, rootState, getters, rootGetters, commit, dispatch},
    {id = '', ids = []} = {id: '', ids: []}) {
      // 0. payload correction (only arrays)
      if (id) { ids = ids.push(id) }

      // 1. Prepare for patching
      const syncStackIds = getters.prepareForDeletion(ids)

      // 2. Push to syncStack
      const deletions = state.syncStack.deletions.concat(syncStackIds)
      commit('SET_SYNCSTACK.DELETIONS', deletions)

      if (!state.syncStack.deletions.length) return
      // 3. Create or refresh debounce
      return dispatch('handleSyncStackDebounce')
    },
    insert ({state, rootState, getters, rootGetters, commit, dispatch},
    {item, items = []} = {items: []}) {
      // 0. payload correction (only arrays)
      if (item) { items = items.push(item) }

      // 1. Prepare for patching
      const syncStackItems = getters.prepareForInsert(items)

      // 2. Push to syncStack
      const inserts = state.syncStack.inserts.concat(syncStackItems)
      commit('SET_SYNCSTACK.INSERTS', inserts)

      // 3. Create or refresh debounce
      return dispatch('handleSyncStackDebounce')
    },
    handleSyncStackDebounce ({commit, dispatch, state, rootGetters}) {
      if (!getters.signedIn) return false
      if (!state.syncStack.debounceTimer) {
        let debounceTimer = startDebounce(1000)
        debounceTimer.done.then(_ => dispatch('batchSync'))
        commit('SET_SYNCSTACK.DEBOUNCETIMER', debounceTimer)
      }
      state.syncStack.debounceTimer.refresh()
    },
    async batchSync ({getters, commit, dispatch, state, rootState, rootGetters}) {
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
      {state, rootState, dispatch, getters, rootGetters},
      {whereFilters = [], orderBy = [], callback} = {whereFilters: [], orderBy: [], callback: _ => {}}
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
        fetchRef = fetchRef.limit(getters.fetch.docLimit)
        // Stop if all records already fetched
        if (state.retrievedFetchRefs.includes(fetchRef)) {
          console.log('Already retrieved this part.')
          return resolve()
        }
        // make fetch request
        fetchRef.get()
        .then(querySnapshot => {
          console.log(`[fetch] querySnapshot: (${querySnapshot.docs.length}) `, querySnapshot)
          if (querySnapshot.docs.length === 0) {
            commit('SET_DONEFETCHING', true)
            return resolve('fetchedAll')
          }
          if (querySnapshot.docs.length < getters.fetch.docLimit) {
            commit('SET_DONEFETCHING', true)
          }
          return callback(querySnapshot)
          querySnapshot.forEach(doc => {
            let id = doc.id
            let item = doc.data()
            item.id = id
            console.log('[fetch] retrieved record: ', item)
            if (getters.storeRef[id]) return
            dispatch('addAndCleanNode', item)
          })
          commit('PUSH_RETRIEVEDFETCHREFS', fetchRef)
          // Get the last visible document
          const lastVisible = querySnapshot.docs.pop()
          // get the next records.
          const next = fetchRef.startAfter(lastVisible)
          commit('SET_NEXTFETCHREF', next)
          resolve('fetchedAll')
        }).catch(error => {
          console.log(error)
          return reject(error)
        })
      })
    },
    openDBChannel ({dispatch, getters, state, commit, rootState, rootGetters}) {
      let dbRef = getters.dbRef
      // apply where filters and orderBy
      getters.syncWhere.forEach(paramsArr => {
        dbRef = dbRef.where(...paramsArr)
      })
      if (orderBy.length) {
        dbRef = dbRef.orderBy(...getters.syncOrderBy)
      }
      // make a promise
      return new Promise ((resolve, reject) => {
        dbRef
        .onSnapshot(querySnapshot => {
          let source = querySnapshot.metadata.hasPendingWrites ? 'local' : 'server'
          querySnapshot.docChanges.forEach(change => {
            // console.log('change', change)
            const id = change.doc.id
            let doc = change.doc.data()
            const tempId = change.doc.data().id
            doc.id = id
            if (change.type === 'added') {
              doc = setDefaultValues(doc, state.sync.defaultValues)
              state.added.before(id, doc, source, change)
              dispatch('newItemFromServer', {item: doc, tempId})
              state.added.after(id, doc, source, change)
            }
            if (change.type === 'modified') {
              if (source === 'server') {
                state.modified.before(id, doc, source, change)
                console.log('Modified item: ', id, copyObj(item), 'server Msg: ', change)
                dispatch('modifiedItemFromServer', {item: doc})
                state.modified.after(id, doc, source, change)
              }
            }
            if (change.type === 'removed') {
              if (source === 'server') {
                state.removed.before(id, doc, source, change)
                console.log('Removed item: ', id, copyObj(item), 'server Msg: ', change)
                dispatch('deletedItemFromServer', {item: doc})
                state.removed.after(id, doc, source, change)
              }
            }
          })
          resolve()
        }, error => {
          commit('SET_PATCHING', 'error')
          return reject(error)
        })
      })
    },
    stopPatching ({state, rootState, commit, dispatch}) {
      if (state.stopPatchingTimeout) { clearTimeout(state.stopPatchingTimeout) }
      state.stopPatchingTimeout = setTimeout(_ => { commit('SET_PATCHING', false) }, 300)
    },
    startPatching ({state, rootState, commit, dispatch}) {
      if (state.stopPatchingTimeout) { clearTimeout(state.stopPatchingTimeout) }
      commit('SET_PATCHING', true)
    }
  },
  getters:
  {
    signedIn: () => {
      return Firebase.auth().currentUser !== null
    },
    dbRef: (state, getters, rootState, rootGetters) => {
      if (!getters.signedIn) return false
      return Firebase.firestore().path(state.firestorePath)
    },
    storeRef: (state, getters, rootState) => {
      return getDeepRef(rootState, state.vuexstorePath)
    },
    syncWhere: (state) => {
      if (!state.sync.where || !isArray(state.sync.where)) return []
      return state.sync.where
    },
    syncOrderBy: (state) => {
      if (!state.sync.orderBy || !isArray(state.sync.orderBy)) return []
      return state.sync.orderBy
    },
    prepareForPatch: (state, getters, rootState, rootGetters) =>
    (ids = [], fields = []) => {
      // get relevant data from the storeRef
      // returns {object} -> {id: data}
      return ids.reduce((carry, id) => {
        // Accept an extra condition to check
        let check = state.patch.checkCondition
        if (check && !check(id, fields, getters.storeRef)) return carry

        let patchData = {}
        // Patch specific fields only
        if (fields.length) {
          fields.forEach(field => {
            patchData[field] = getters.storeRef[id][field]
          })
        // Patch the whole item
        } else {
          patchData = copyObj(getters.storeRef[id])
          patchData = checkFillables(patchData, getters.patch.fillables, getters.patch.guard)
        }
        patchData.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
        carry[id] = patchData
        return carry
      })
    },
    prepareForDeletion: (state, getters, rootState, rootGetters) =>
    (ids = []) => {
      return ids.reduce((carry, id) => {
        // Accept an extra condition to check
        let check = state.delete.checkCondition
        if (check && !check(id, getters.storeRef)) return carry
        carry.push(id)
        return carry
      }, [])
    },
    prepareForInsert: (state, getters, rootState, rootGetters) =>
    (items = []) => {
      items = copyObj(items)
      return items.reduce((carry, item) => {
        // Accept an extra condition to check
        let check = state.insert.checkCondition
        if (check && !check(id, getters.storeRef)) return carry

        item = checkFillables(item, getters.insert.fillables, getters.insert.guard)
        item.created_at = Firebase.firestore.FieldValue.serverTimestamp()
        item.created_by = rootGetters['user/id']
        carry.push(item)
        return carry
      }, [])
    }
  }
}
