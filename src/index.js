import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module'

export default function (userConfig, {logging = false} = {logging: false}) {
  return store => {
    // Get an array of config files
    if (!isArray(userConfig)) userConfig = [userConfig]
    // Create a module for each config file
    userConfig.forEach(config => {
      config.logging = logging
      const moduleName = getKeysFromPath(config.moduleName)
      store.registerModule(moduleName, iniModule(config))
    })
  }
}
