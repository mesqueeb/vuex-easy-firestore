import { AnyObject } from '../declarations'

export type HandleDoc = (doc: any) => any
export type HandleId = (id: string) => any
export type HandleDocs = (docs: any[]) => any
export type HandleDocIds = (doc: any, ids: string[]) => any
export type HandleIds = (ids: string[]) => any

export type SyncHookDoc = (updateStore: HandleDoc, doc: any, store) => (void | HandleDoc)
export type SyncHookId = (updateStore: HandleId, id: string, store) => (void | HandleId)
export type InsertBatchHook = (updateStore: HandleDocs, docs: any[], store) => (void | HandleDocs)
export type PatchBatchHook = (updateStore: HandleDocIds, doc: any, ids: string[], store) => (void | HandleDocIds)
export type DeleteBatchHook = (updateStore: HandleIds, ids: string[], store) => (void | HandleIds)
export type ServerChangeHook = (updateStore: HandleDoc, doc: any, id, store) => (void | HandleDoc)

export type IConfig = {
  firestorePath: string
  firestoreRefType: string
  moduleName: string
  statePropName: string | null
  logging?: boolean
  sync?: {
    where?: any[][]
    orderBy?: string[]
    fillables?: string[]
    guard?: string[]
    preventInitialDocInsertion?: boolean
    debounceTimerMs?: number
    defaultValues?: AnyObject
    insertHook?: SyncHookDoc
    patchHook?: SyncHookDoc
    deleteHook?: SyncHookId
    insertHookBeforeSync?: SyncHookDoc
    patchHookBeforeSync?: SyncHookDoc
    deleteHookBeforeSync?: SyncHookId
    insertBatchHook?: InsertBatchHook
    patchBatchHook?: PatchBatchHook
    deleteBatchHook?: DeleteBatchHook
  }
  serverChange?: {
    defaultValues?: AnyObject
    convertTimestamps?: AnyObject
    addedHook?: ServerChangeHook
    modifiedHook?: ServerChangeHook
    removedHook?: ServerChangeHook
  }
  fetch?: {
    docLimit?: number
  }
  state?: AnyObject
  mutations?: AnyObject
  actions?: AnyObject
  getters?: AnyObject
}

export default {
  firestorePath: '',
    // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '',
    // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '',
    // The module name. Can be nested, eg. `'user/items'`
  statePropName: null,
    // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module.
  logging: false,
  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
    defaultValues: {},
    preventInitialDocInsertion: false,
    debounceTimerMs: 1000,
    // HOOKS for local changes:
    insertHook: function (updateStore, doc, store) { return updateStore(doc) },
    patchHook: function (updateStore, doc, store) { return updateStore(doc) },
    deleteHook: function (updateStore, id, store) { return updateStore(id) },
    // HOOKS after local changes before sync:
    insertHookBeforeSync: function (updateFirestore, doc, store) { return updateFirestore(doc) },
    patchHookBeforeSync: function (updateFirestore, doc, store) { return updateFirestore(doc) },
    deleteHookBeforeSync: function (updateFirestore, id, store) { return updateFirestore(id) },
    // HOOKS for local batch changes:
    insertBatchHook: function (updateStore, docs, store) { return updateStore(docs) },
    patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids) },
  },

  // When items on the server side are changed:
  serverChange: {
    defaultValues: {}, // depreciated
    convertTimestamps: {},
    // HOOKS for changes on SERVER:
    addedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    removedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
  },

  // When items are fetched through `dispatch('module/fetch', {clauses})`.
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50,
  }
}
