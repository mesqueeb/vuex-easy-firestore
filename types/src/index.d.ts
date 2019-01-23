import 'firebase/firestore';
import 'firebase/auth';
import { IEasyFirestoreModule } from './declarations';
import { arrayUnion, arrayRemove } from './utils/arrayHelpers';
/**
 * Create vuex-easy-firestore modules. Add as single plugin to Vuex Store.
 *
 * @export
 * @param {(IEasyFirestoreModule | IEasyFirestoreModule[])} easyFirestoreModule A vuex-easy-firestore module (or array of modules) with proper configuration as per the documentation.
 * @param {{logging?: boolean, FirebaseDependency?: any}} extraConfig An object with `logging` and `FirebaseDependency` props. `logging` enables console logs for debugging. `FirebaseDependency` is the non-instanciated Firebase class you can pass. (defaults to the Firebase peer dependency)
 * @returns {*}
 */
declare function vuexEasyFirestore(easyFirestoreModule: IEasyFirestoreModule | IEasyFirestoreModule[], { logging, preventInitialDocInsertion, FirebaseDependency }?: {
    logging?: boolean;
    preventInitialDocInsertion?: boolean;
    FirebaseDependency?: any;
}): any;
export { vuexEasyFirestore, arrayUnion, arrayRemove };
export default vuexEasyFirestore;
