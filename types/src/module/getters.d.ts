import { AnyObject } from '../declarations';
import { IConfig } from './defaultConfig';
export type IPluginGetters<State = {
    _conf: IConfig;
    [key: string]: any;
}> = {
    firestorePathComplete: (state: State, getters?: any, rootState?: any, rootGetters?: any) => string;
    signedIn: (state: State, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    dbRef: (state: State, getters?: any, rootState?: any, rootGetters?: any) => any;
    storeRef: (state: State, getters?: any, rootState?: any, rootGetters?: any) => AnyObject;
    collectionMode: (state: State, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    prepareForPatch: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (ids?: string[], doc?: AnyObject) => AnyObject;
    prepareForInsert: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (items?: any[]) => any[];
    prepareInitialDocForInsert: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (doc: AnyObject) => AnyObject;
    docModeId: (state: State, getters?: any, rootState?: any, rootGetters?: any) => string;
    fillables: (state: State, getters?: any, rootState?: any, rootGetters?: any) => string[];
    guard: (state: State, getters?: any, rootState?: any, rootGetters?: any) => string[];
    defaultValues: (state: State, getters?: any, rootState?: any, rootGetters?: any) => AnyObject;
    cleanUpRetrievedDoc: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (doc?: AnyObject, id?: string) => AnyObject;
    prepareForPropDeletion: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (path?: string) => {
        [id: string]: AnyObject;
    };
    getWhereArrays: (state: State, getters?: any, rootState?: any, rootGetters?: any) => (whereArrays?: [string, string, any][]) => [string, string, any][];
};
/**
 * A function returning the getters object
 *
 * @export
 * @param {*} firebase The firebase dependency
 * @returns {AnyObject} the getters object
 */
export default function (firebaseApp: any): AnyObject;
