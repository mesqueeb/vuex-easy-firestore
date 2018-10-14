import { IStore, IEasyFirestoreModule } from '../declarations';
/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {IEasyFirestoreModule} userConfig Takes a config object per module
 * @param {*} FirebaseDependency The Firebase dependency (non-instanciated), defaults to the Firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
export default function (userConfig: IEasyFirestoreModule, FirebaseDependency: any): IStore;
