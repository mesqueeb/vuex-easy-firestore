
/**
 * A function executed during the 2 way sync BEFORE docs are added/modified/deleted. NEEDS TO BE ASYNC. If you `throw` an error it will not modify the document in your store. You can use this function to do a conditional check on the documents; if they fail throw an error.
 *
 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
 * @param {object} store the store for usage with eg. `store.dispatch` `store.commit` etc.
 * @param {string} source of the change. Can be 'local' or 'server'
 * @param {object} change of firestore at `querySnapshot.docChanges.forEach(change => ...)` (see firestore documentation for more info)
 *
 * @returns {promise} MUST return a promise. When you throw no changes will be made on your store.
 */
async function syncHook (id, doc, store, source, change, executeUpdate) {
  // throw error if you want to stop the document in your store from being modified
  // do some stuff
  executeUpdate()
  // do some stuff
}
/**
 * A function executed during the 2 way sync AFTER docs are added/modified/deleted. Includes the response/error from the async syncHookBefore.
 *
 * @param {string} id the doc id returned in `change.doc.id` (see firestore documentation for more info)
 * @param {object} doc the doc returned in `change.doc.data()` (see firestore documentation for more info)
 * @param {object} store the store for usage with eg. `store.dispatch` `store.commit` etc.
 * @param {string} source of the change. Can be 'local' or 'server'
 * @param {object} change of firestore at `querySnapshot.docChanges.forEach(change => ...)` (see firestore documentation for more info)
 * @param {*}      response or the error of the syncHookBefore async function
 */
function syncHookAfter (id, doc, store, source, change, response) {
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
    added: {
      before: syncHookBefore, // does nothing by default
      after: syncHookAfter, // does nothing by default
    },
    modified: {
      before: syncHookBefore, // does nothing by default
      after: syncHookAfter, // does nothing by default
    },
    removed: {
      before: syncHookBefore, // does nothing by default
      after: syncHookAfter, // does nothing by default
    },
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
