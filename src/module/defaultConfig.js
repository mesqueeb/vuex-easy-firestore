
export default {
  firestorePath: '',
    // The path to a collection or doc in firestore. You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '',
    // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '',
    // The module name. Can be nested, eg. `'user/items'`
  statePropName: '',
    // The name of the property where the docs or doc will be synced to. If left blank it will be synced on the state of the module. (Please see [Sync directly to module state](#sync-directly-to-module-state) for more info)

  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
    // HOOKS for local changes:
    insertHook: function (updateStore, doc, store) { return updateStore(doc) },
    patchHook: function (updateStore, doc, store) { return updateStore(doc) },
    deleteHook: function (updateStore, id, store) { return updateStore(id) },
    // HOOKS for local batch changes:
    patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids) },
  },

  // When items on the server side are changed:
  serverChange: {
    defaultValues: {},
    // HOOKS for changes on SERVER:
    addedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
    removedHook: function (updateStore, doc, id, store, source, change) { return updateStore(doc) },
  },

  // When items are fetched through `dispatch('module/fetch', filters)`.
  fetch: {
    // The max amount of documents to be fetched. Defaults to 50.
    docLimit: 50,
  },

  // You can also add custom state/getters/mutations/actions. These will be added to your module.
  state: {},
  getters: {},
  mutations: {},
  actions: {},
}
