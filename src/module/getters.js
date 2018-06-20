import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import copyObj from 'nanoclone'
import { getDeepRef } from 'vuex-easy-access'
import checkFillables from '../utils/checkFillables'

const getters = {
  signedIn: () => {
    return Firebase.auth().currentUser !== null
  },
  dbRef: (state, getters, rootState, rootGetters) => {
    if (!getters.signedIn) return false
    const userId = Firebase.auth().currentUser.uid
    const path = state.firestorePath.replace('{userId}', userId)
    return Firebase.firestore().collection(path)
  },
  storeRef: (state, getters, rootState) => {
    return getDeepRef(rootState, state.vuexstorePath)
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

export default function (userGetters = {}) {
  return Object.assign({}, getters, userGetters)
}
