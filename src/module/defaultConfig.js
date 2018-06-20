
/**
 * A function executed during the 2 way sync when docs are added/modified/deleted. NEEDS TO EXECUTE FIRST PARAM! You can use this function to do a conditional check on the documents to decide if/when to execute the store update.
 *
 * @param {function} storeUpdateFn this is the function that will make changes to your vuex store. Takes no params.
 * @param {object} store the store for usage with `store.dispatch`, `store.commit`, `store.getters` etc.
 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
 * @param {string} source of the change. Can be 'local' or 'server'
 */
function syncHook (storeUpdateFn, store, id, doc, source, change) {
  // throw error if you want to stop the document in your store from being modified
  // do some stuff
  storeUpdateFn()
  // do some stuff
}

export default {
  vuexstorePath: '', // must be relative to rootState
  firestorePath: '',
  mapType: 'collection', // 'collection' only ('doc' not integrated yet)
  sync: {
    type: '2way', // '2way' only ('1way' not yet integrated)
    where: [],
    orderBy: [],
    // You HAVE to set all fields you want to be reactive on beforehand!
    // These values are only set when you have items who don't have the props defined in defaultValues upon retrieval
    // These default values will be merged with a reverse Object.assign on retrieved documents
    defaultValues: {},
    added: syncHook,
    modified: syncHook,
    removed: syncHook,
  },
  fetch: {
    docLimit: 50, // defaults to 50
  },
  insert: {
    // checkCondition (value, storeRef) { return (params == 'something') },
    checkCondition: null,
    fillables: [],
    guard: [],
  },
  patch: {
    // checkCondition (id, fields, storeRef) { return (params == 'something') },
    checkCondition: null,
    fillables: [],
    guard: [],
  },
  delete: {
    // checkCondition (id, storeRef) { return (params == 'something') },
    checkCondition: null,
  }
}
