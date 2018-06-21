// import { getKeysFromPath } from 'vuex-easy-access'
import { getKeysFromPath } from './utils/temp-vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module/index'

// I don't know why getKeysFromPath is UNDEFINED WTF

export default function createEasyFirestore (userConfig) {
  return store => {
    // Get an array of config files
    if (!isArray(userConfig)) userConfig = [userConfig]
    // Create a module for each config file
    userConfig.forEach(config => {
      const moduleNameSpace = getKeysFromPath(config.moduleNameSpace)
      store.registerModule(moduleNameSpace, iniModule(config))
    })
    store.setDoc = (path, payload) => {
      return store.dispatch(path + '/setDoc', payload)
    }
    store.insertDoc = (path, payload) => {
      return store.dispatch(path + '/insertDoc', payload)
    }
    store.patchDoc = (path, payload) => {
      return store.dispatch(path + '/patchDoc', payload)
    }
    store.deleteDoc = (path, payload) => {
      return store.dispatch(path + '/deleteDoc', payload)
    }
  }
}
