import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import copyObj from '../utils/copyObj'
import { getDeepRef } from 'vuex-easy-access'
import checkFillables from '../utils/checkFillables'

const getters = {
  signedIn: (state, getters, rootState, rootGetters) => {
    const user = getDeepRef(rootState, state.vuexUserPath)
    return (user !== null)
  },
  dbRef: (state, getters, rootState, rootGetters) => {
    if (!getters.signedIn) return false
    const userId = Firebase.auth().currentUser.uid
    const path = state.firestorePath.replace('{userId}', userId)
    return (state.firestoreRefType.toLowerCase() === 'collection')
      ? Firebase.firestore().collection(path)
      : Firebase.firestore().doc(path)
  },
  storeRef: (state, getters, rootState) => {
    const path = (state.docsStateProp)
      ? `${state.moduleNameSpace}/${state.docsStateProp}`
      : state.moduleNameSpace
    return getDeepRef(rootState, path)
  },
  collectionMode: (state, getters, rootState) => {
    return (state.firestoreRefType.toLowerCase() === 'collection')
  },
  prepareForPatch: (state, getters, rootState, rootGetters) =>
  (ids = [], fields = []) => {
    // get relevant data from the storeRef
    const collectionMode = getters.collectionMode
    if (!collectionMode) ids.push('singleDoc')
    // returns {object} -> {id: data}
    return ids.reduce((carry, id) => {
      // Accept an extra condition to check
      const check = state.patch.checkCondition
      if (check && !check(id, fields, getters.storeRef)) return carry

      let patchData = {}
      // Patch specific fields only
      if (fields.length) {
        fields.forEach(field => {
          patchData[field] = (collectionMode)
            ? getters.storeRef[id][field]
            : getters.storeRef[field]
        })
      // Patch the whole item
      } else {
        patchData = (collectionMode)
          ? copyObj(getters.storeRef[id])
          : copyObj(getters.storeRef)
        patchData = checkFillables(patchData, state.patch.fillables, state.patch.guard)
      }
      patchData.updated_at = Firebase.firestore.FieldValue.serverTimestamp()
      carry[id] = patchData
      return carry
    }, {})
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
      if (check && !check(item, getters.storeRef)) return carry

      item = checkFillables(item, state.insert.fillables, state.insert.guard)
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
