import * as Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { AnyObject } from '../declarations';
export declare type IPluginGetters = {
    signedIn: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    dbRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => any;
    storeRef: (state: any, getters?: any, rootState?: any, rootGetters?: any) => AnyObject;
    collectionMode: (state: any, getters?: any, rootState?: any, rootGetters?: any) => boolean;
    prepareForPatch: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (ids: string[], doc: AnyObject) => AnyObject;
    prepareForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (items: any[]) => any[];
    prepareInitialDocForInsert: (state: any, getters?: any, rootState?: any, rootGetters?: any) => (doc: AnyObject) => AnyObject;
};
declare const _default: {
    signedIn: (state: any, getters: any, rootState: any, rootGetters: any) => any;
    dbRef: (state: any, getters: any, rootState: any, rootGetters: any) => false | Firebase.firestore.CollectionReference | Firebase.firestore.DocumentReference;
    storeRef: (state: any, getters: any, rootState: any) => import("vuex-easy-access/types/declarations").AnyObject;
    collectionMode: (state: any, getters: any, rootState: any) => boolean;
    prepareForPatch: (state: any, getters: any, rootState: any, rootGetters: any) => (ids?: any[], doc?: {}) => any;
    prepareForInsert: (state: any, getters: any, rootState: any, rootGetters: any) => (items?: any[]) => any;
    prepareInitialDocForInsert: (state: any, getters: any, rootState: any, rootGetters: any) => (doc: any) => any;
};
export default _default;
