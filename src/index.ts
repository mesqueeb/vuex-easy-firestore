import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module'
import { IUserConfig } from './declarations'

export default function (
  userConfig: IUserConfig | IUserConfig[],
  {logging = false}: {logging: boolean} = {logging: false}
): any {
  return store => {
    // Get an array of config files
    if (!isArray(userConfig)) userConfig = [userConfig]
    // Create a module for each config file
    userConfig.forEach((config: IUserConfig) => {
      config.logging = logging
      const moduleName = getKeysFromPath(config.moduleName)
      store.registerModule(moduleName, iniModule(config))
    })
  }
}
