import { AnyObject } from '../declarations';
export declare type HandleDoc = (doc: any) => any;
export declare type HandleId = (id: string) => any;
export declare type HandleDocs = (docs: any[]) => any;
export declare type HandleDocIds = (doc: any, ids: string[]) => any;
export declare type HandleIds = (ids: string[]) => any;
export declare type SyncHookDoc = (updateStore: HandleDoc, doc: any, store: any) => void | HandleDoc;
export declare type SyncHookId = (updateStore: HandleId, id: string, store: any) => void | HandleId;
export declare type InsertBatchHook = (updateStore: HandleDocs, docs: any[], store: any) => void | HandleDocs;
export declare type PatchBatchHook = (updateStore: HandleDocIds, doc: any, ids: string[], store: any) => void | HandleDocIds;
export declare type DeleteBatchHook = (updateStore: HandleIds, ids: string[], store: any) => void | HandleIds;
export declare type ServerChangeHook = (updateStore: HandleDoc, doc: any, id: any, store: any) => void | HandleDoc;
export declare type IConfig = {
    firestorePath: string;
    firestoreRefType: string;
    moduleName: string;
    statePropName: string | null;
    logging?: boolean;
    sync?: {
        where?: any[][];
        orderBy?: string[];
        fillables?: string[];
        guard?: string[];
        preventInitialDocInsertion?: boolean;
        debounceTimerMs?: number;
        defaultValues?: AnyObject;
        insertHook?: SyncHookDoc;
        patchHook?: SyncHookDoc;
        deleteHook?: SyncHookId;
        insertHookBeforeSync?: SyncHookDoc;
        patchHookBeforeSync?: SyncHookDoc;
        deleteHookBeforeSync?: SyncHookId;
        insertBatchHook?: InsertBatchHook;
        patchBatchHook?: PatchBatchHook;
        deleteBatchHook?: DeleteBatchHook;
    };
    serverChange?: {
        defaultValues?: AnyObject;
        convertTimestamps?: AnyObject;
        addedHook?: ServerChangeHook;
        modifiedHook?: ServerChangeHook;
        removedHook?: ServerChangeHook;
    };
    fetch?: {
        docLimit?: number;
    };
    state?: AnyObject;
    mutations?: AnyObject;
    actions?: AnyObject;
    getters?: AnyObject;
};
declare const _default: {
    firestorePath: string;
    firestoreRefType: string;
    moduleName: string;
    statePropName: any;
    logging: boolean;
    sync: {
        where: any[];
        orderBy: any[];
        fillables: any[];
        guard: any[];
        defaultValues: {};
        preventInitialDocInsertion: boolean;
        debounceTimerMs: number;
        insertHook: (updateStore: any, doc: any, store: any) => any;
        patchHook: (updateStore: any, doc: any, store: any) => any;
        deleteHook: (updateStore: any, id: any, store: any) => any;
        insertHookBeforeSync: (updateFirestore: any, doc: any, store: any) => any;
        patchHookBeforeSync: (updateFirestore: any, doc: any, store: any) => any;
        deleteHookBeforeSync: (updateFirestore: any, id: any, store: any) => any;
        insertBatchHook: (updateStore: any, docs: any, store: any) => any;
        patchBatchHook: (updateStore: any, doc: any, ids: any, store: any) => any;
        deleteBatchHook: (updateStore: any, ids: any, store: any) => any;
    };
    serverChange: {
        defaultValues: {};
        convertTimestamps: {};
        addedHook: (updateStore: any, doc: any, id: any, store: any) => any;
        modifiedHook: (updateStore: any, doc: any, id: any, store: any) => any;
        removedHook: (updateStore: any, doc: any, id: any, store: any) => any;
    };
    fetch: {
        docLimit: number;
    };
};
export default _default;
