// Firebase
import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module'
import { IEasyFirestoreModule } from './declarations'
import { arrayUnion, arrayRemove } from './utils/arrayHelpers'

/**
 * Create vuex-easy-firestore modules. Add as single plugin to Vuex Store.
 *
 * @export
 * @param {(IEasyFirestoreModule | IEasyFirestoreModule[])} easyFirestoreModule A vuex-easy-firestore module (or array of modules) with proper configuration as per the documentation.
 * @param {{logging?: boolean, FirebaseDependency?: any}} extraConfig An object with `logging` and `FirebaseDependency` props. `logging` enables console logs for debugging. `FirebaseDependency` is the non-instanciated Firebase class you can pass. (defaults to the Firebase peer dependency)
 * @returns {*}
 */

function vuexEasyFirestore (
  easyFirestoreModule: IEasyFirestoreModule | IEasyFirestoreModule[],
  {
    logging = false,
    FirebaseDependency = Firebase
  }: {
    logging?: boolean,
    FirebaseDependency?: any
  } = {
    logging: false,
    FirebaseDependency: Firebase
  }
): any {
  return store => {
    // Get an array of config files
    if (!isArray(easyFirestoreModule)) easyFirestoreModule = [easyFirestoreModule]
    // Create a module for each config file
    easyFirestoreModule.forEach((config: IEasyFirestoreModule) => {
      config.logging = logging
      const moduleName = getKeysFromPath(config.moduleName)
      store.registerModule(moduleName, iniModule(config, FirebaseDependency))
    })
  }
}

export { vuexEasyFirestore, arrayUnion, arrayRemove }
export default vuexEasyFirestore
