import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module/index'

export default function (userConfig) {
  return store => {
    // Get an array of config files
    if (!isArray(userConfig)) userConfig = [userConfig]
    // Create a module for each config file
    userConfig.forEach(config => {
      const moduleName = getKeysFromPath(config.moduleName)
      store.registerModule(moduleName, iniModule(config))
    })
  }
}
