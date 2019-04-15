// Firebase
import * as Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { getKeysFromPath } from 'vuex-easy-access'
import { isArray } from 'is-what'
import iniModule from './module'
import { IEasyFirestoreModule } from './declarations'
import { arrayUnion, arrayRemove, setFirebaseDependency as setFirebase1 } from './utils/arrayHelpers'
import { increment, setFirebaseDependency as setFirebase2 } from './utils/incrementHelper'

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
    preventInitialDocInsertion = false,
    FirebaseDependency = Firebase
  }: {
    logging?: boolean,
    preventInitialDocInsertion?: boolean,
    FirebaseDependency?: any
  } = {
    logging: false,
    preventInitialDocInsertion: false,
    FirebaseDependency: Firebase
  }
): any {
  if (FirebaseDependency) {
    setFirebase1(FirebaseDependency)
    setFirebase2(FirebaseDependency)
  }
  return store => {
    // Get an array of config files
    if (!isArray(easyFirestoreModule)) easyFirestoreModule = [easyFirestoreModule]
    // Create a module for each config file
    easyFirestoreModule.forEach((config: IEasyFirestoreModule) => {
      config.logging = logging
      if (config.sync && config.sync.preventInitialDocInsertion === undefined) {
        config.sync.preventInitialDocInsertion = preventInitialDocInsertion
      }
      const moduleName = getKeysFromPath(config.moduleName)
      store.registerModule(moduleName, iniModule(config, FirebaseDependency))
    })
  }
}

export { vuexEasyFirestore, arrayUnion, arrayRemove, increment }
export default vuexEasyFirestore
