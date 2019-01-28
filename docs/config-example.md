# Config example

Here is a list with all possible config options. **Only the top 4 properties are required**, the rest may be left out if not used!

```js
const firestoreModule = {
  firestorePath: '',
    // The path to a "collection" or single "document" in firestore.
    // You can use `{userId}` which will be replaced with the user Id.
  firestoreRefType: '',
    // `'collection'` or `'doc'`. Depending on your `firestorePath`.
  moduleName: '',
    // The module name. eg. `'userItems'`
    // Can also be a nested module, eg. `'user/items'`
  statePropName: '',
    // The name of the property where the docs or doc will be synced to.
    // always best to set to `'data'` imo!
    // If left blank it will be synced on the state of the module.

  namespaced: true,
    // this is automatically added! See more info at: https://vuex.vuejs.org/guide/modules.html#namespacing

  // EVERYTHING BELOW IS OPTIONAL (only include what you use)
  // Related to the 2-way sync:
  sync: {
    where: [],
    orderBy: [],
    fillables: [],
    guard: [],
    defaultValues: {},
    debounceTimerMs: 1000,
    // HOOKS for local changes:
    insertHook: function (updateStore, doc, store) { return updateStore(doc) },
    patchHook: function (updateStore, doc, store) { return updateStore(doc) },
    deleteHook: function (updateStore, id, store) { return updateStore(id) },
    // for batches
    insertBatchHook: function (updateStore, docs, store) { return updateStore(docs) },
    patchBatchHook: function (updateStore, doc, ids, store) { return updateStore(doc, ids) },
    deleteBatchHook: function (updateStore, ids, store) { return updateStore(ids) },
  },

  // When docs on the server side are changed:
  serverChange: {
    convertTimestamps: {},
    // HOOKS for changes on SERVER:
    addedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    modifiedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
    removedHook: function (updateStore, doc, id, store) { return updateStore(doc) },
  },

  // When docs are fetched through `dispatch('module/fetch', filters)`.
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
```
