import { AnyObject } from '../declarations';
export declare type IPluginGetters = {
    firestorePathComplete: (state: any, getters?: any, rootState?: any, rootGetters?: any) => string;
    signedIn: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    dbRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => any;
    storeRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => AnyObject;
    collectionMode: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    prepareForPatch: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (ids: string[], doc: AnyObject) => AnyObject;
    prepareForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (items: any[]) => any[];
    prepareInitialDocForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (doc: AnyObject) => AnyObject;
};
/**
 * A function returning the getters object
 *
 * @export
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the getters object
 */
export default function (firebase: any): AnyObject;
