import Firebase from 'firebase/app'
import 'firebase/auth'
import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module/index'
import 'regenerator-runtime/runtime'

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
    store.insert = (path, payload) => {
      return store.dispatch(path + '/insert', payload)
    }
    store.patch = (path, payload) => {
      return store.dispatch(path + '/patch', payload)
    }
    store.delete = (path, payload) => {
      return store.dispatch(path + '/delete', payload)
    }
  }
}
