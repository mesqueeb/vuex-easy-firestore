import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import copyObj from '../utils/copyObj'
import { getDeepRef } from 'vuex-easy-access'
import checkFillables from '../utils/checkFillables'

const getters = {
  signedIn: (state, getters, rootState, rootGetters) => {
    const requireUser = state._conf.firestorePath.includes('{userId}')
    if (!requireUser) return true
    return state._sync.signedIn
  },
  dbRef: (state, getters, rootState, rootGetters) => {
    let path
    const requireUser = state._conf.firestorePath.includes('{userId}')
    if (requireUser) {
      if (!getters.signedIn) return false
      if (!Firebase.auth().currentUser) return false
      const userId = Firebase.auth().currentUser.uid
      path = state._conf.firestorePath.replace('{userId}', userId)
    } else {
      path = state._conf.firestorePath
    }
    return (state._conf.firestoreRefType.toLowerCase() === 'collection')
      ? Firebase.firestore().collection(path)
      : Firebase.firestore().doc(path)
  },
  storeRef: (state, getters, rootState) => {
    const path = (state._conf.statePropName)
      ? `${state._conf.moduleName}/${state._conf.statePropName}`
      : state._conf.moduleName
    return getDeepRef(rootState, path)
  },
  collectionMode: (state, getters, rootState) => {
    return (state._conf.firestoreRefType.toLowerCase() === 'collection')
  },
  prepareForPatch: (state, getters, rootState, rootGetters) =>
  (ids = [], doc = {}) => {
    // get relevant data from the storeRef
    const collectionMode = getters.collectionMode
    if (!collectionMode) ids.push('singleDoc')
    // returns {object} -> {id: data}
    return ids.reduce((carry, id) => {
      let patchData = {}
      // retrieve full object
      if (!Object.keys(doc).length) {
        patchData = (collectionMode)
          ? getters.storeRef[id]
          : getters.storeRef
      } else {
        patchData = doc
      }
      patchData = copyObj(patchData)
      patchData = checkFillables(patchData, state._conf.sync.fillables, state._conf.sync.guard)
      carry[id] = patchData
      return carry
    }, {})
  },
  prepareForDeletion: (state, getters, rootState, rootGetters) =>
  (ids = []) => {
    return ids.reduce((carry, id) => {
      carry.push(id)
      return carry
    }, [])
  },
  prepareForInsert: (state, getters, rootState, rootGetters) =>
  (items = []) => {
    items = copyObj(items)
    return items.reduce((carry, item) => {
      item = checkFillables(item, state._conf.sync.fillables, state._conf.sync.guard)
      carry.push(item)
      return carry
    }, [])
  }
}

export default function (userGetters = {}) {
  return Object.assign({}, getters, userGetters)
}
