import { AnyObject } from '../declarations';
export type IPluginGetters<State = any> = {
    firestorePathComplete: (state: State, getters?: any, rootState?: any, rootGetters?: any) => string;
    signedIn: (state: State, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    dbRef: (state: State, getters?: any, rootState?: any, rootGetters?: any) => any;
    storeRef: (state: State, getters?: any, rootState?: any, rootGetters?: any) => AnyObject;
    collectionMode: (state: State, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    prepareForPatch: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (ids: string[], doc: AnyObject) => AnyObject;
    prepareForInsert: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (items: any[]) => any[];
    prepareInitialDocForInsert: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (doc: AnyObject) => AnyObject;
};
/**
 * A function returning the getters object
 *
 * @export
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the getters object
 */
export default function (firebaseApp: any): AnyObject;
