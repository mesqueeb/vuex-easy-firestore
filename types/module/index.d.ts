import { IStore, IEasyFirestoreModule } from '../declarations';
export declare type FirestoreConfig = {
    FirebaseDependency?: any;
    enablePersistence?: boolean;
    synchronizeTabs?: boolean;
};
/**
 * A function that returns a vuex module object with seamless 2-way sync for firestore.
 *
 * @param {IEasyFirestoreModule} userConfig Takes a config object per module
 * @param {*} FirebaseDependency The firebase dependency (non-instanciated), defaults to the firebase peer dependency if left blank.
 * @returns {IStore} the module ready to be included in your vuex store
 */
export default function (userConfig: IEasyFirestoreModule, firestoreConfig: FirestoreConfig): IStore;
